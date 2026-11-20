import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { record } from '../features/discipline/activity'
import { seedCard } from '../services/srs'
import { storage } from '../services/storage'
import type { CardSeed, Domain, StudyState } from '../types/study'

type Update = (update: (state: StudyState) => StudyState) => void
const StudyContext = createContext<{
  state: StudyState
  update: Update
  complete: (domain: Domain, xp: number, seconds?: number, errors?: CardSeed[], qualifies?: boolean) => void
  storageError: boolean
} | null>(null)

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, update] = useState(storage.read)
  const [storageError, setStorageError] = useState(false)
  useEffect(() => {
    try {
      storage.write(state)
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
    document.documentElement.dataset.theme = state.theme
  }, [state])
  function complete(domain: Domain, xp: number, seconds = 0, errors: CardSeed[] = [], qualifies = true) {
    update(previous => {
      const next = xp || seconds || qualifies ? record(previous, domain, xp, seconds, undefined, qualifies) : previous
      const cards = { ...next.cards }
      for (const error of errors) {
        const card = seedCard(error, cards[error.id])
        cards[error.id] = { ...card, due: seedCard(error).due }
      }
      return { ...next, cards }
    })
  }
  return <StudyContext.Provider value={{ state, update, complete, storageError }}>{children}</StudyContext.Provider>
}

export function useStudy() {
  const context = useContext(StudyContext)
  if (!context) throw new Error('StudyProvider is required')
  return context
}
