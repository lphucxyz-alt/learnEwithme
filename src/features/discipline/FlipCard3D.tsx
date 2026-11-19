import type { ReactNode } from 'react'

interface FlipCard3DProps {
  flipped: boolean
  onToggle: () => void
  frontLabel?: string
  backLabel?: string
  front: ReactNode
  back: ReactNode
}

export function FlipCard3D({
  flipped,
  onToggle,
  frontLabel = 'Câu hỏi / Lỗi sai',
  backLabel = 'Đáp án chuẩn',
  front,
  back,
}: FlipCard3DProps) {
  return (
    <div className="flip-scene">
      <div
        className="flip-card"
        data-flipped={flipped}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        onClick={onToggle}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onToggle()
          }
        }}
      >
        <div className="flip-face flip-front">
          <div className="flip-face-head">
            <span className="pill">{frontLabel}</span>
            <span className="flip-hint">Chạm để lật ↻</span>
          </div>
          <div className="flip-face-body">{front}</div>
        </div>

        <div className="flip-face flip-back">
          <div className="flip-face-head">
            <span className="pill flip-pill-answer">{backLabel}</span>
            <span className="flip-hint">Chạm để xem lại ↺</span>
          </div>
          <div className="flip-face-body">{back}</div>
        </div>
      </div>
    </div>
  )
}
