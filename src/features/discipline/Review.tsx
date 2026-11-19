import { useEffect, useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { rateCard } from '../../services/srs'
import type { Card } from '../../types/study'
import { record } from './activity'
import { FlipCard3D } from './FlipCard3D'

export function ReviewCard({ card, onDone }: { card: Card; onDone?: () => void }) {
  const [flipped, setFlipped] = useState(false)
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
        setFlipped(prev => !prev)
      }
      if (flipped && /^[1-4]$/.test(event.key)) rate(Number(event.key) as 1 | 2 | 3 | 4)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  })

  return (
    <div className="stack" style={{ gap: '0.85rem' }}>
      <FlipCard3D
        flipped={flipped}
        onToggle={() => setFlipped(prev => !prev)}
        front={<p className="flip-prompt">{card.prompt}</p>}
        back={
          <div className="stack">
            <p className="flip-answer">{card.answer}</p>
          </div>
        }
      />
      {flipped ? (
        <div className="row" style={{ justifyContent: 'center', gap: '0.5rem' }}>
          {(['Quên', 'Khó', 'Nhớ', 'Dễ'] as const).map((label, index) => (
            <button key={label} className="button" onClick={() => rate((index + 1) as 1 | 2 | 3 | 4)}>
              {index + 1}. {label}
            </button>
          ))}
        </div>
      ) : (
        <button className="button primary" style={{ width: '100%' }} onClick={() => setFlipped(true)}>
          Lật thẻ xem đáp án (Space)
        </button>
      )}
    </div>
  )
}
