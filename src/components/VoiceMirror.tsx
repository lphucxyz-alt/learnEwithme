import { useEffect, useRef, useState } from 'react'
import { stopAudio } from '../services/audio'

export function VoiceMirror({ durationMs = 2500, onStart, onRecord, onBusy }: {
  durationMs?: number; onStart?: () => void; onRecord?: (seconds: number) => void; onBusy?: (busy: boolean) => void
}) {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'recording'>('idle')
  const [progress, setProgress] = useState(0)
  const [clip, setClip] = useState('')
  const [error, setError] = useState('')
  const audio = useRef<HTMLAudioElement>(null)
  const recording = useRef<MediaRecorder>(null)
  const media = useRef<MediaStream>(null)
  const objectUrl = useRef('')
  const frame = useRef<number>(undefined)
  const timer = useRef<number>(undefined)
  const generation = useRef(0)

  function release() {
    window.clearTimeout(timer.current)
    if (frame.current !== undefined) cancelAnimationFrame(frame.current)
    media.current?.getTracks().forEach(track => track.stop())
    media.current = null
    recording.current = null
  }

  useEffect(() => () => {
    generation.current++
    const recorder = recording.current
    if (recorder?.state === 'recording') recorder.stop()
    release()
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
  }, [])

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Trình duyệt chưa hỗ trợ thu âm trực tiếp.')
      return
    }
    const request = ++generation.current
    stopAudio()
    onStart?.()
    audio.current?.pause()
    setError('')
    setStatus('requesting')
    onBusy?.(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (request !== generation.current) {
        stream.getTracks().forEach(track => track.stop())
        return
      }
      media.current = stream
      const recorder = new MediaRecorder(stream)
      recording.current = recorder
      const chunks: Blob[] = []
      const startedAt = performance.now()
      let failed = false
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data) }
      recorder.onerror = () => {
        if (request !== generation.current) return
        failed = true
        setError('Bản ghi bị lỗi. Bạn có thể thử thu lại.')
        if (recorder.state === 'recording') recorder.stop()
        release()
        setStatus('idle')
        onBusy?.(false)
      }
      recorder.onstop = () => {
        if (request !== generation.current || failed) return
        release()
        setStatus('idle')
        onBusy?.(false)
        setProgress(0)
        if (!chunks.length) {
          setError('Không nhận được âm thanh. Hãy thử thu lại.')
          return
        }
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
        objectUrl.current = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }))
        setClip(objectUrl.current)
        onRecord?.((performance.now() - startedAt) / 1000)
      }
      recorder.start()
      setStatus('recording')
      function draw(now: number) {
        const percent = Math.min(100, (now - startedAt) / durationMs * 100)
        setProgress(percent)
        if (percent < 100) frame.current = requestAnimationFrame(draw)
      }
      frame.current = requestAnimationFrame(draw)
      timer.current = window.setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop()
      }, durationMs)
    } catch {
      if (request !== generation.current) return
      release()
      setStatus('idle')
      onBusy?.(false)
      setError('Không mở được micro. Kiểm tra quyền truy cập rồi thử lại.')
    }
  }

  return <section className="ipa-recording stack" aria-label="So sánh bản ghi">
    <div className="row">
      <button type="button" onClick={() => void start()} disabled={status !== 'idle'}>
        <span className="rec-dot" aria-hidden="true" /> {status === 'requesting' ? 'Đang chờ micro…' : status === 'recording' ? 'Đang thu âm…' : 'Thu âm để đối chiếu'}
      </button>
      {status === 'recording' && <button type="button" onClick={() => {
        if (recording.current?.state === 'recording') recording.current.stop()
      }}>Dừng thu</button>}
    </div>
    {status === 'recording' && <progress aria-label="Tiến độ thu âm" value={progress} max={100} />}
    {clip && status === 'idle' && <div className="stack"><small>Nghe lại bản ghi của bạn</small>
      <audio key={clip} ref={audio} src={clip} controls aria-label="Bản ghi phát âm của bạn" onPlay={() => { stopAudio(); onStart?.() }} />
    </div>}
    {error && <p role="status" className="error">{error}</p>}
  </section>
}
