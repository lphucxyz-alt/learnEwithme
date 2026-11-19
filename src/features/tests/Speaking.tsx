import { useEffect, useRef, useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { Listen } from '../../components/Audio'
import { clockLabel } from '../discipline/activity'
import { useNow } from '../discipline/FocusTimer'
import type { Exam } from '../../types/exam'

export function Speaking({ parts, fluency = false }: { parts: Extract<Exam, { skill: 'Speaking' }>['parts']; fluency?: boolean }) {
  const { complete, state, update } = useStudy()
  const [round, setRound] = useState(0)
  const [clips, setClips] = useState<Record<number, string>>({})
  const [reference, setReference] = useState('')
  const clipUrls = useRef<string[]>([])
  const duration = [240, 180, 120][round]
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<{ prepEnd: number; speakEnd: number } | null>(null)
  const [active, setActive] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const recorder = useRef<MediaRecorder | null>(null)
  const mounted = useRef(true)
  const generation = useRef(0)
  const now = useNow()
  const part = parts[index]
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
  useEffect(() => () => { if (url) URL.revokeObjectURL(url) }, [url])
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
          const clip = URL.createObjectURL(new Blob(chunks, { type: current.mimeType }))
          if (fluency) {
            clipUrls.current.push(clip)
            setClips(previous => ({ ...previous, [round]: clip }))
            complete('practice', 8, Math.round((Date.now() - started) / 1000))
          } else setUrl(clip)
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
    <div className="row">{parts.map((item, position) => <button key={item.title} disabled={requesting || active} aria-pressed={index === position} onClick={() => {
      setIndex(position); setPhase(null); setUrl(''); setRound(0); setClips({})
    }}>Part {position + 1}</button>)}</div>
    <h2>{part.title}</h2><ul>{part.prompts.map(prompt => <li key={prompt}>{prompt} <Listen text={prompt} /></li>)}</ul>
    {index === 1 && !fluency && <div className="row"><button onClick={() => {
      const time = Date.now()
      setPhase({ prepEnd: time + 60_000, speakEnd: time + 180_000 })
    }}>Bắt đầu 1 phút chuẩn bị</button>
      {phase && <strong>{remaining ? (now < phase.prepEnd ? 'Chuẩn bị ' : 'Nói ') + clockLabel(remaining) : 'Hết giờ nói'}</strong>}</div>}
    {fluency && <div className="row">
      {[4, 3, 2].map((minutes, position) => <button key={minutes} aria-pressed={round === position} disabled={active || requesting} onClick={() => {
        setRound(position); setPhase(null)
      }}>{minutes} phút</button>)}
      <strong>{clockLabel(phase ? remaining : duration)}</strong>
    </div>}
    <div className="row"><button className="primary" disabled={active || requesting} onClick={() => void startRecording()}>{requesting ? 'Đang yêu cầu quyền' : 'Ghi âm'}</button><button disabled={!active} onClick={() => {
      if (recorder.current?.state === 'recording') recorder.current.stop()
    }}>Dừng ghi âm</button>{active && <span role="status">Đang ghi âm</span>}</div>
    {error && <p className="error" role="status">{error}</p>}
    {url && <div className="row"><audio controls src={url} /><a className="button" href={url} download="ielts-speaking">Tải bản ghi</a></div>}
    {fluency && <>
      {Object.entries(clips).map(([position, clip]) => <div className="row" key={position}>
        <strong>Lượt {4 - Number(position)} phút</strong><audio controls src={clip} /><a className="button" href={clip} download={'ielts-part-' + (index + 1) + '-' + (4 - Number(position)) + 'min'}>Tải bản ghi</a>
      </div>)}
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
