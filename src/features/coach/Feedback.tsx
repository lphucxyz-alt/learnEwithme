import { Listen } from '../../components/Audio'
import { useStudy } from '../../app/StudyProvider'
import { seedCard } from '../../services/srs'
import type { CoachEntry } from '../../types/coach'

const names = {
  relevance: 'Bám đề', organization: 'Mạch ý', vocabulary: 'Từ vựng', grammar: 'Ngữ pháp'
} as const
const ratings = { needs_work: 'Cần luyện', developing: 'Đang tiến bộ', clear: 'Rõ ràng' } as const

export function Feedback({ entry }: { entry: CoachEntry }) {
  const { state, update } = useStudy()
  const { feedback } = entry
  return <div className="stack coach-feedback">
    <p><strong>{feedback.summary}</strong></p>
    {feedback.strength && <p>Điểm làm tốt · {feedback.strength}</p>}
    {feedback.comparison && <p>So với lượt trước · {feedback.comparison}</p>}
    {feedback.criteria && <dl className="coach-criteria">{Object.entries(names).map(([key, title]) =>
      <div key={key}><dt>{title}</dt><dd>{ratings[feedback.criteria![key as keyof typeof names]]}</dd></div>)}</dl>}
    {feedback.corrections.map((correction, index) => {
      const id = 'coach:' + entry.id + ':' + index
      return <article key={id} className="lesson-rule stack">
        <div><del>{correction.original}</del><p><strong>{correction.improved}</strong> <Listen text={correction.improved} /></p></div>
        <p>{correction.explanation}</p>
        <button disabled={Boolean(state.cards[id])} onClick={() => update(previous => {
          if (previous.cards[id]) return previous
          const card = seedCard({ id, domain: 'tests', prompt: 'Sửa câu: ' + correction.original,
            answer: correction.improved + ' · ' + correction.explanation })
          return { ...previous, cards: { ...previous.cards, [id]: card } }
        })}>{state.cards[id] ? 'Đã lưu vào sổ ôn' : 'Ôn lại lỗi này'}</button>
      </article>
    })}
    {feedback.audioNote && <p>Nhịp nói và độ dễ nghe · {feedback.audioNote}</p>}
    <div className="lesson-rule"><h3>Lần sau thử</h3><p>{feedback.nextAction}</p></div>
    {feedback.transcript && <details><summary>Bản chép lời AI nghe được</summary><p className="transcript">{feedback.transcript}</p></details>}
  </div>
}
