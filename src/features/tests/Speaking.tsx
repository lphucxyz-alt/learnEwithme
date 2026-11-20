import { useEffect, useRef, useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { CoachReview } from '../coach/CoachReview'
import { Listen } from '../../components/Audio'
import { clockLabel, dayKey } from '../discipline/activity'
import { useNow } from '../discipline/FocusTimer'
import { saveRoutineRecording, type RoutineRecording } from '../discipline/routine-work'
import { minimumWork } from '../discipline/study-credit'
import type { Exam } from '../../types/exam'

const roundMinutes = [4, 3, 2] as const
type Clip = { id: string; url: string; blob: Blob; seconds: number; day: string }

export function Speaking({ parts, fluency, onRecording }: {
  parts: readonly Extract<Exam, { skill: 'Speaking' }>['parts'][number][]
  fluency?: RoutineRecording
  onRecording?: (part: number, seconds: number) => void
}) {
  const { state, update } = useStudy()
  const [round, setRound] = useState(0)
  const [clips, setClips] = useState<Record<number, Clip>>({})
  const [reference, setReference] = useState('')
  const clipUrls = useRef<string[]>([])
  const rounds = fluency === 'weekly-story' ? [3] : roundMinutes
  const duration = rounds[round] * 60
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<{ prepEnd: number; speakEnd: number } | null>(null)
  const [active, setActive] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [recording, setRecording] = useState<Clip>()
  const [error, setError] = useState('')
  const recorder = useRef<MediaRecorder | null>(null)
  const mounted = useRef(true)
  const generation = useRef(0)
  const now = useNow()
  const part = parts[index]
  const lastAdvice = state.coachHistory.find(entry => entry.mode === 'speaking' && entry.topic === part.title && entry.feedback.sufficient)
    ?.feedback.nextAction
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      generation.current++
      const current = recorder.current
      if (current?.state === 'recording') current.stop()
      current?.stream.getTracks().forEach(track => track.stop())
      clipUrls.current.forEach(clip => URL.revokeObjectURL(clip))
    }
  }, [])
  useEffect(() => () => { if (recording) URL.revokeObjectURL(recording.url) }, [recording])
  useEffect(() => () => { if (reference) URL.revokeObjectURL(reference) }, [reference])
  const remaining = phase ? Math.max(0, Math.ceil(((now < phase.prepEnd ? phase.prepEnd : phase.speakEnd) - now) / 1000)) : 0
  useEffect(() => {
    if (phase && now >= phase.speakEnd && recorder.current?.state === 'recording') recorder.current.stop()
  }, [phase, now])

  async function startRecording() {
    setError('')
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('Hãy mở trang qua HTTPS trên trình duyệt hỗ trợ micro.')
      return
    }
    let stream: MediaStream | undefined
    const request = ++generation.current
    setRequesting(true)
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!mounted.current || request !== generation.current) {
        stream.getTracks().forEach(track => track.stop())
        return
      }
      const current = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      current.ondataavailable = event => { if (event.data.size) chunks.push(event.data) }
      const started = Date.now()
      current.onstop = () => {
        current.stream.getTracks().forEach(track => track.stop())
        if (!mounted.current || request !== generation.current) return
        setActive(false)
        if (chunks.length) {
          const blob = new Blob(chunks, { type: current.mimeType })
          const seconds = Math.max(1, Math.round((Date.now() - started) / 1000))
          const day = dayKey()
          const clip = { id: crypto.randomUUID(), url: URL.createObjectURL(blob), blob, seconds, day }
          if (fluency) {
            const replaced = clips[round]?.url
            if (replaced) {
              URL.revokeObjectURL(replaced)
              clipUrls.current = clipUrls.current.filter(item => item !== replaced)
            }
            clipUrls.current.push(clip.url)
            const nextClips = { ...clips, [round]: clip }
            setClips(nextClips)
            const qualifyingSeconds = rounds.flatMap((minutes, index) => {
              const sample = nextClips[index]
              return sample?.day === day && sample.seconds >= minimumWork(minutes * 60)
                ? [Math.min(sample.seconds, minutes * 60)] : []
            })
            if (qualifyingSeconds.length >= minimumWork(rounds.length)) {
              update(previous => saveRoutineRecording(previous, fluency, qualifyingSeconds.reduce((total, time) => total + time, 0), day))
            }
          } else {
            setRecording(clip)
            onRecording?.(index, seconds)
          }
        }
      }
      current.onerror = () => {
        setError('Có lỗi trong khi ghi âm.')
        if (current.state === 'recording') current.stop()
        current.stream.getTracks().forEach(track => track.stop())
        setActive(false)
      }
      recorder.current = current
      current.start()
      setActive(true)
      if (fluency) setPhase({ prepEnd: started, speakEnd: started + duration * 1000 })
    } catch {
      stream?.getTracks().forEach(track => track.stop())
      if (mounted.current && request === generation.current) setError('Không mở được micro. Kiểm tra quyền truy cập thiết bị.')
    } finally {
      if (mounted.current && request === generation.current) setRequesting(false)
    }
  }
  return <section className="panel stack">
    {parts.length > 1 && <div className="row">{parts.map((item, position) => <button key={item.title} disabled={requesting || active} aria-pressed={index === position} onClick={() => {
      if (index === position) return
      clipUrls.current.forEach(clip => URL.revokeObjectURL(clip))
      clipUrls.current = []
      setIndex(position)
      setPhase(null)
      setRecording(undefined)
      setRound(0)
      setClips({})
    }}>Part {position + 1}</button>)}</div>}
    <h2>{part.title}</h2><ul>{part.prompts.map(prompt => <li key={prompt}>{prompt} <Listen text={prompt} /></li>)}</ul>
    {index === 1 && !fluency && <div className="row"><button onClick={() => {
      const time = Date.now()
      setPhase({ prepEnd: time + 60_000, speakEnd: time + 180_000 })
    }}>Bắt đầu 1 phút chuẩn bị</button>
      {phase && <strong>{remaining ? (now < phase.prepEnd ? 'Chuẩn bị ' : 'Nói ') + clockLabel(remaining) : 'Hết giờ nói'}</strong>}</div>}
    {fluency && <div className="row">
      {rounds.length > 1 && rounds.map((minutes, position) => <button key={minutes} aria-pressed={round === position} disabled={active || requesting} onClick={() => {
        setRound(position); setPhase(null)
      }}>{minutes} phút</button>)}
      <strong>{clockLabel(phase ? remaining : duration)}</strong>
    </div>}
    {fluency === 'speak-432' && <small>Để giữ chuỗi, ghi đủ nửa thời lượng ở 2 trong 3 lượt cùng một đề.</small>}
    {fluency && <details className="panel" style={{ background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.25)', padding: '0.85rem 1.1rem' }}>
      <summary style={{ fontWeight: 600, color: 'var(--accent)', cursor: 'pointer' }}>
        🆘 Phao cứu sinh: Sườn bài & Câu nối chống "đóng băng não" khi nói
      </summary>
      <div className="stack" style={{ gap: '0.55rem', marginTop: '0.65rem', fontSize: '0.88rem' }}>
        <div>
          <strong>1. Trả lời trực tiếp (Direct Answer):</strong>
          <p className="muted" style={{ margin: '0.15rem 0 0' }}>"To be completely honest, when it comes to this topic, I would say that..."</p>
        </div>
        <div>
          <strong>2. Giải thích & Cho ví dụ cá nhân (Reason & Example):</strong>
          <p className="muted" style={{ margin: '0.15rem 0 0' }}>"The main reason is that... For example, I remember a specific time when..."</p>
        </div>
        <div>
          <strong>3. So sánh quá khứ vs hiện tại để kéo dài thời gian:</strong>
          <p className="muted" style={{ margin: '0.15rem 0 0' }}>"In the past, I used to... but nowadays, things have changed because..."</p>
        </div>
        <div>
          <strong>4. Câu câu giờ tự nhiên khi cần suy nghĩ (Natural Fillers):</strong>
          <p className="muted" style={{ margin: '0.15rem 0 0' }}>"That's an intriguing question..." · "What I really want to emphasize is..." · "If I'm not mistaken..."</p>
        </div>
      </div>
    </details>}
    {fluency && lastAdvice && <div className="lesson-rule"><h3>Gợi ý cho lượt tiếp theo</h3><p>{lastAdvice}</p></div>}
    <div className="row"><button className="primary" disabled={active || requesting} onClick={() => void startRecording()}>{requesting ? 'Đang yêu cầu quyền' : 'Ghi âm'}</button><button disabled={!active} onClick={() => {
      if (recorder.current?.state === 'recording') recorder.current.stop()
    }}>Dừng ghi âm</button>{active && <span role="status">Đang ghi âm</span>}</div>
    {error && <p className="error" role="status">{error}</p>}
    {recording && <div className="stack">
      <div className="row"><audio controls src={recording.url} /><a className="button" href={recording.url} download="ielts-speaking">Tải bản ghi</a></div>
      <CoachReview key={recording.id} id={recording.id} audio={recording.blob} exercise={{
        mode: 'speaking', topic: part.title, prompt: part.prompts.join('\n'), seconds: recording.seconds
      }} />
    </div>}
    {fluency && <>
      {Object.entries(clips).map(([position, clip]) => {
        const currentRound = Number(position)
        const minutes = rounds[currentRound]
        const earlierId = clips[currentRound - 1]?.id
        return <div className="stack" key={clip.id}>
          <div className="row"><strong>Lượt {minutes} phút</strong><audio controls src={clip.url} />
            <a className="button" href={clip.url} download={'ielts-part-' + (index + 1) + '-' + minutes + 'min'}>Tải bản ghi</a></div>
          <CoachReview id={clip.id} audio={clip.blob} earlierId={earlierId} exercise={{
            mode: 'speaking', topic: part.title, prompt: part.prompts.join('\n'),
            round: fluency === 'speak-432' ? roundMinutes[currentRound] : undefined, seconds: clip.seconds
          }} />
        </div>
      })}
      <label>Cụm từ dùng lại và chỗ bị khựng<textarea rows={3} value={state.fluencyNotes} onChange={event => {
        const value = event.target.value
        update(previous => ({ ...previous, fluencyNotes: value }))
      }} /></label>
      <label>Chọn bản ghi tháng trước để nghe đối chiếu<input type="file" accept="audio/*,.webm,.ogg,.m4a" onChange={event => {
        const file = event.target.files?.[0]
        if (file) setReference(URL.createObjectURL(file))
      }} /></label>
      {reference && <audio controls src={reference} />}
    </>}
    <details key={index}><summary>Câu trả lời mẫu nâng cao</summary><p>{part.sample}</p><Listen text={part.sample} /></details>
  </section>
}
