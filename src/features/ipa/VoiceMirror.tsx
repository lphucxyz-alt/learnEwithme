import { useEffect, useRef, useState } from 'react'
import { getIpaTip } from './ipaTips'

interface VoiceMirrorProps {
  symbol: string
  onPlaySample?: () => void | Promise<void>
  durationMs?: number
}

export function VoiceMirror({ symbol, onPlaySample, durationMs = 2000 }: VoiceMirrorProps) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'playing'>('idle')
  const [progress, setProgress] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const stopTracks = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    stopTracks()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setStatus('idle')
    setProgress(0)
    setError(null)
    setAudioUrl(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [symbol])

  useEffect(() => {
    return () => {
      stopTracks()
      if (audioRef.current) audioRef.current.pause()
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    if (status === 'recording') return
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Trình duyệt hiện tại không hỗ trợ thu âm trực tiếp.')
      return
    }

    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const chunks: BlobPart[] = []
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder

      recorder.ondataavailable = event => {
        if (event.data.size > 0) chunks.push(event.data)
      }

      recorder.onstop = () => {
        stopTracks()
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
        const nextUrl = URL.createObjectURL(blob)
        setAudioUrl(prev => {
          if (prev) URL.revokeObjectURL(prev)
          return nextUrl
        })
        setStatus('idle')
        setProgress(0)
      }

      recorder.start()
      setStatus('recording')
      const startedAt = performance.now()

      const tick = (now: number) => {
        const pct = Math.min(100, ((now - startedAt) / durationMs) * 100)
        setProgress(pct)
        if (pct < 100) {
          rafRef.current = window.requestAnimationFrame(tick)
        }
      }
      rafRef.current = window.requestAnimationFrame(tick)

      timerRef.current = window.setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop()
      }, durationMs)
    } catch {
      stopTracks()
      setStatus('idle')
      setError('Chưa có quyền micro. Hãy cho phép truy cập micro trên trình duyệt.')
    }
  }

  const playMine = () => {
    if (!audioUrl) return
    if (audioRef.current) audioRef.current.pause()
    const audio = new Audio(audioUrl)
    audioRef.current = audio
    setStatus('playing')
    audio.onended = () => setStatus('idle')
    audio.onerror = () => setStatus('idle')
    void audio.play()
  }

  const compareWithSample = async () => {
    if (!audioUrl) return
    if (onPlaySample) {
      await Promise.resolve(onPlaySample())
      window.setTimeout(() => playMine(), 900)
    } else {
      playMine()
    }
  }

  return (
    <div className="voice-mirror">
      <div className="voice-mirror-actions">
        <button
          type="button"
          className="button voice-rec-btn"
          data-recording={status === 'recording'}
          onClick={startRecording}
          disabled={status === 'recording'}
        >
          <span className="rec-dot" aria-hidden="true" />
          {status === 'recording' ? 'Đang thu 2s...' : 'Thu âm 2s đối chiếu'}
        </button>

        {audioUrl && (
          <>
            <button
              type="button"
              className="button"
              onClick={playMine}
              disabled={status !== 'idle'}
            >
              {status === 'playing' ? 'Đang phát...' : 'Nghe giọng bạn'}
            </button>
            {onPlaySample && (
              <button
                type="button"
                className="button primary"
                onClick={compareWithSample}
                disabled={status !== 'idle'}
              >
                So sánh Mẫu → Bạn
              </button>
            )}
          </>
        )}
      </div>

      {status === 'recording' && (
        <div className="voice-progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="voice-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && <p className="voice-error">{error}</p>}
    </div>
  )
}

export function IpaTipCard({ symbol }: { symbol: string }) {
  const tip = getIpaTip(symbol)
  if (!tip) return null

  return (
    <section className="ipa-tip-card">
      <div className="ipa-tip-head">
        <span className="pill">Mẹo phát âm thực chiến</span>
        {tip.vs && <span className="ipa-tip-vs">Dễ nhầm với {tip.vs}</span>}
      </div>
      <p className="ipa-tip-cue">{tip.cue}</p>
      <p className="ipa-tip-trap">
        <strong>Lỗi hay gặp:</strong> {tip.trap}
      </p>
      {tip.pair && (
        <div className="ipa-tip-pair">
          <span>Đối chiếu:</span>
          <code>{tip.pair[0]}</code>
          <span aria-hidden="true">≠</span>
          <code>{tip.pair[1]}</code>
        </div>
      )}
    </section>
  )
}
