import { useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { rateCard } from '../../services/srs'
import type { Card } from '../../types/study'
import { record } from './activity'
import { FlipCard3D } from './FlipCard3D'

export function ReviewCard({ card, onDone, qualifies = true }: { card: Card; onDone?: () => void; qualifies?: boolean }) {
  const [flipped, setFlipped] = useState(false)
  const { update } = useStudy()

  function rate(quality: 1 | 2 | 3 | 4) {
    update(previous => {
      const current = previous.cards[card.id]
      if (!current || current.due !== card.due || current.repetitions !== card.repetitions || current.lapses !== card.lapses) return previous
      return { ...record(previous, 'review', 5, 0, undefined, qualifies), cards: { ...previous.cards, [card.id]: rateCard(current, quality) } }
    })
    onDone?.()
  }

  return (
    <div className="stack" onKeyDown={event => {
      if (flipped && !event.repeat && !event.ctrlKey && !event.metaKey && /^[1-4]$/.test(event.key)) {
        event.preventDefault()
        rate(Number(event.key) as 1 | 2 | 3 | 4)
      }
    }}>
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
