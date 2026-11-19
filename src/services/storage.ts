import { initialState, stateSchema, type StudyState } from '../types/study'

export interface StudyStorage {
  read(): StudyState
  write(state: StudyState): void
}

const key = 'ielts-discipline-os:v1'

export function parseBackup(source: string): StudyState {
  return stateSchema.parse(JSON.parse(source))
}

export const storage: StudyStorage = {
  read() {
    try {
      const source = localStorage.getItem(key)
      return source ? parseBackup(source) : initialState
    } catch {
      return initialState
    }
  },
  write(state) {
    localStorage.setItem(key, JSON.stringify(state))
  }
}
