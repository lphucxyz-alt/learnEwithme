import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudy } from '../../app/StudyProvider'
import { localCoachUrl, requestFeedback } from '../../services/coach'
import type { CoachEntry, CoachRequest } from '../../types/coach'
import { Feedback } from './Feedback'
import { sharePrompt } from './instructions'

export function CoachReview({ id, exercise, audio, earlierId }: {
  id: string; exercise: Omit<CoachRequest, 'previous'>; audio?: Blob; earlierId?: string
}) {
  const { state, update } = useStudy()
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState(false)
  const [copied, setCopied] = useState('')
  const request = useRef<AbortController | null>(null)
  useEffect(() => () => request.current?.abort(), [])
  const entry = state.coachHistory.find(item => item.id === id)
  const earlier = state.coachHistory.find(item => item.feedback.sufficient && item.id !== id
    && (earlierId ? item.id === earlierId : !exercise.round && item.mode === exercise.mode && item.topic === exercise.topic))
  const previous = earlier?.feedback
  const input = {
    ...exercise, previous: previous && { summary: previous.summary, corrections: previous.corrections, nextAction: previous.nextAction }
  }

  async function grade() {
    if (request.current) return
    const controller = new AbortController()
    request.current = controller
    setPending(true)
    setStatus('')
    try {
      const feedback = await requestFeedback(input, audio, controller.signal)
      if (controller.signal.aborted) return
      const result: CoachEntry = { id, mode: exercise.mode, topic: exercise.topic, at: new Date().toISOString(), feedback }
      update(current => ({ ...current, coachHistory: [result, ...current.coachHistory.filter(item => item.id !== id)].slice(0, 30) }))
    } catch (error) {
      if (!controller.signal.aborted) setStatus(error instanceof Error ? error.message : 'Bạn có thể thử chấm lại.')
    } finally {
      request.current = null
      if (!controller.signal.aborted) setPending(false)
    }
  }

  if (!audio && !exercise.answer?.trim()) return null
  return <section className="coach-panel stack">
    <div className="between"><h3>AI góp ý · Mục tiêu 6.5</h3><Link className="text-link" to="/coach">Nhận xét đã lưu</Link></div>
    {entry ? <Feedback entry={entry} /> : <>
      <p className="muted">Nhận xét luyện tập. {audio ? 'Bản ghi' : 'Bài viết'} được gửi tới Gemini khi bạn bấm chấm.</p>
      <button className="primary" disabled={pending} onClick={() => void grade()}>{pending ? 'AI đang chấm…' : 'Chấm với AI'}</button>
      {pending && <p role="status">Đang xem bài và chuẩn bị gợi ý sửa.</p>}
      {status && <p className="error" role="status">{status}</p>}
      <details open={status.startsWith('Chưa kết nối') || undefined}>
        <summary>Dùng AI trên thiết bị khác</summary>
        <p>{audio ? 'Sao chép yêu cầu và đính kèm file ghi âm đã tải xuống trong cuộc trò chuyện AI của bạn.' : 'Sao chép yêu cầu cùng bài viết để gửi vào cuộc trò chuyện AI của bạn.'}</p>
        <div className="row">
          <button onClick={async () => {
            try {
              await navigator.clipboard.writeText(sharePrompt(input, Boolean(audio)))
              setCopied('Đã sao chép yêu cầu.')
            } catch { setCopied('Không sao chép được. Bạn có thể chọn văn bản trong ô bên dưới.') }
          }}>Sao chép yêu cầu</button>
          <a className="text-link" href={localCoachUrl + window.location.hash} target="_blank" rel="noreferrer">Mở bản có AI trên Ubuntu</a>
        </div>
        {copied && <p role="status">{copied}</p>}
        <textarea readOnly aria-label="Mẫu yêu cầu AI" value={sharePrompt(input, Boolean(audio))} rows={4} />
      </details>
    </>}
  </section>
}
