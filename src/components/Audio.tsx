import { useEffect, useState } from 'react'
import { useStudy } from '../app/StudyProvider'
import { speak, speakWord, stopAudio } from '../services/audio'

export function Listen({ text, label = 'Nghe' }: { text: string; label?: string }) {
  const { state } = useStudy()
  const [error, setError] = useState('')
  return <span className="inline-action"><button type="button" onClick={() => {
    setError('')
    speakWord(text, state.accent, state.rate, { error: setError })
  }}>{label}</button>{error && <small role="status">{error}</small>}</span>
}

export function AudioSandbox() {
  const { state, update } = useStudy()
  const [text, setText] = useState('Small improvements compound when we practise consistently.')
  const [loop, setLoop] = useState(false)
  const [word, setWord] = useState(-1)
  const [status, setStatus] = useState('')
  useEffect(() => stopAudio, [])
  return <section className="panel stack">
    <h2>Đọc văn bản tiếng Anh</h2>
    <textarea aria-label="Văn bản tiếng Anh" value={text} onChange={event => setText(event.target.value)} rows={3} />
    <div className="row">
      <select aria-label="Giọng đọc" value={state.accent} onChange={event => update(current => ({ ...current, accent: event.target.value as typeof state.accent }))}>
        <option value="en-GB">Anh–Anh</option><option value="en-US">Anh–Mỹ</option>
      </select>
      <select aria-label="Tốc độ" value={state.rate} onChange={event => update(current => ({ ...current, rate: Number(event.target.value) as typeof state.rate }))}>
        {[0.6, 0.75, 1, 1.2].map(rate => <option key={rate} value={rate}>{rate}×</option>)}
      </select>
      <label><input type="checkbox" checked={loop} onChange={event => setLoop(event.target.checked)} /> Lặp lại</label>
      <button className="primary" disabled={!text.trim()} onClick={() => {
        setStatus('Đang đọc')
        setWord(0)
        speak(text, state.accent, state.rate, { loop, boundary: setWord, end: () => {
          setWord(-1)
          setStatus('Đã đọc xong')
        }, error: setStatus })
      }}>Phát</button>
      <button onClick={() => { stopAudio(); setWord(-1); setStatus('Đã dừng') }}>Dừng</button>
    </div>
    <p aria-live="polite">{status}</p>
    <p className="transcript">{[...text.matchAll(/\S+/g)].map(match => <span key={match.index}
      className={word >= match.index && word < match.index + match[0].length ? 'spoken' : ''}>{match[0]} </span>)}</p>
  </section>
}
