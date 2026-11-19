import { useEffect, useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { rateCard } from '../../services/srs'
import type { Card } from '../../types/study'
import { record } from './activity'

export function ReviewCard({ card, onDone }: { card: Card; onDone?: () => void }) {
  const [revealed, setRevealed] = useState(false)
  const { update } = useStudy()
  function rate(quality: 1 | 2 | 3 | 4) {
    update(previous => {
      const current = previous.cards[card.id]
      if (!current || current.due !== card.due || current.repetitions !== card.repetitions || current.lapses !== card.lapses) return previous
      return { ...record(previous, 'review', 5), cards: { ...previous.cards, [card.id]: rateCard(current, quality) } }
    })
    onDone?.()
  }
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if ((event.target as HTMLElement).closest('input, textarea, select, button, [role=dialog]') || event.ctrlKey || event.metaKey) return
      if (event.code === 'Space') {
        event.preventDefault()
        setRevealed(true)
      }
      if (revealed && /^[1-4]$/.test(event.key)) rate(Number(event.key) as 1 | 2 | 3 | 4)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  })
  return <div className="stack"><p>{card.prompt}</p>{revealed
    ? <><p className="answer">{card.answer}</p><div className="row">{(['Quên', 'Khó', 'Nhớ', 'Dễ'] as const).map((label, index) =>
      <button key={label} onClick={() => rate((index + 1) as 1 | 2 | 3 | 4)}>{index + 1}. {label}</button>)}</div></>
    : <button onClick={() => setRevealed(true)}>Hiện đáp án</button>}</div>
}
