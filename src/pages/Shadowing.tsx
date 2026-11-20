import { useEffect, useRef, useState } from 'react'
import { shadowLessons, type ShadowLesson } from '../data/shadowing'
import { VoiceMirror } from '../components/VoiceMirror'
import { speak, stopAudio } from '../services/audio'

type Accent = 'en-GB' | 'en-US'
type Mode = 'shadow' | 'dictation'
const levels = ['A1', 'A2', 'B1'] as const

function readProgress(lesson: ShadowLesson, key: string): number[] {
  try {
    const values: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    if (Array.isArray(values)) return [...new Set(values.filter(value => Number.isInteger(value) && value >= 0 && value < lesson.lines.length))]
  } catch { return [] }
  return []
}

function normalize(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
}

function ShadowSession({ lesson }: { lesson: ShadowLesson }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [accent, setAccent] = useState<Accent>('en-GB')
  const [mode, setMode] = useState<Mode>('shadow')
  const [translation, setTranslation] = useState(false)
  const [loop, setLoop] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [recording, setRecording] = useState(false)
  const [status, setStatus] = useState('')
  const [typed, setTyped] = useState('')
  const [graded, setGraded] = useState<boolean>()
  const [heard, setHeard] = useState(false)
  const writtenKey = 'learn-shadowing:written:' + lesson.id
  const recordedKey = 'learn-shadowing:recorded:' + lesson.id
  const [written, setWritten] = useState(() => readProgress(lesson, writtenKey))
  const [recorded, setRecorded] = useState(() => readProgress(lesson, recordedKey))
  const player = useRef<HTMLAudioElement>(null)
  const playback = useRef(0)
  const timer = useRef<number>(undefined)
  const line = lesson.lines[lineIndex]
  const progress = mode === 'shadow' ? recorded.length : written.length

  function stop() {
    playback.current++
    window.clearTimeout(timer.current)
    stopAudio()
    player.current?.pause()
    setPlaying(false)
  }

  useEffect(() => () => {
    playback.current++
    window.clearTimeout(timer.current)
    stopAudio()
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(writtenKey, JSON.stringify(written))
      localStorage.setItem(recordedKey, JSON.stringify(recorded))
    } catch { return }
  }, [written, recorded, writtenKey, recordedKey])

  function selectLine(next: number) {
    stop()
    setLineIndex(next)
    setTyped('')
    setGraded(undefined)
    setTranslation(false)
    setHeard(false)
    setStatus('')
    setRecording(false)
  }

  function play(full: boolean) {
    stop()
    const request = playback.current
    setPlaying(true)
    function start(index: number) {
      if (request !== playback.current) return
      const text = lesson.lines[index].en
      setLineIndex(index)
      setStatus(`Đang phát câu ${index + 1}.`)
      const finished = () => {
        if (request !== playback.current) return
        setHeard(true)
        if (full && index + 1 < lesson.lines.length) {
          timer.current = window.setTimeout(() => start(index + 1), 380)
        } else if (!full && loop && mode === 'shadow') {
          timer.current = window.setTimeout(() => start(index), 500)
        } else {
          setPlaying(false)
          setStatus(mode === 'shadow' ? 'Đến lượt bạn đọc theo.' : 'Gõ câu bạn vừa nghe.')
        }
      }
      const failed = (message: string) => {
        if (request !== playback.current) return
        setPlaying(false)
        setStatus(message)
      }
      const audio = player.current
      if (!audio) return
      let fallingBack = false
      const fallback = () => {
        if (request !== playback.current || fallingBack) return
        fallingBack = true
        speak(text, accent, speed, { end: finished, error: failed })
      }
      audio.onended = finished
      audio.onerror = fallback
      audio.src = import.meta.env.BASE_URL + `shadow-voice/${accent}/${lesson.id}-${index + 1}.mp3`
      audio.playbackRate = speed
      void audio.play().catch(fallback)
    }
    start(full ? 0 : lineIndex)
  }

  return <section className="panel shadow-session stack" aria-labelledby="shadow-session-heading">
    <audio ref={player} preload="none" hidden />
    <div className="between"><h2 id="shadow-session-heading">{lesson.title}</h2><span className="pill">{lesson.level}</span></div>
    <div className="row" role="group" aria-label="Chế độ luyện">
      <button aria-pressed={mode === 'shadow'} onClick={() => { if (mode !== 'shadow') { setMode('shadow'); selectLine(0) } }}>Đọc theo</button>
      <button aria-pressed={mode === 'dictation'} onClick={() => { if (mode !== 'dictation') { setMode('dictation'); selectLine(0) } }}>Nghe chép</button>
    </div>
    <div className="shadow-player">
      <div className="between">
        <small>Câu {lineIndex + 1}/{lesson.lines.length}</small>
        <small>{progress}/{lesson.lines.length} {mode === 'shadow' ? 'đã thu âm' : 'đã chép đúng'}</small>
      </div>
      <progress value={progress} max={lesson.lines.length} aria-label="Tiến độ bài Shadowing này" />
      {mode === 'shadow' && <>
        <p className="shadow-line" lang="en">{line.en}</p>
        {translation && <p className="muted">{line.vi}</p>}
      </>}
      <div className="row">
        <button className="primary" disabled={recording} onClick={() => play(false)}>Nghe câu</button>
        {mode === 'shadow' && <button onClick={() => { setTranslation(value => !value) }} aria-pressed={translation}>{translation ? 'Ẩn nghĩa' : 'Xem nghĩa'}</button>}
        {mode === 'shadow' && <button disabled={recording} onClick={() => play(true)}>Nghe cả bài</button>}
        {playing && <button onClick={() => { stop(); setStatus('Đã dừng.') }}>Dừng</button>}
      </div>
      <div className="row shadow-play-options">
        <label>Giọng<select value={accent} onChange={event => { stop(); setAccent(event.target.value as Accent); setStatus('') }}>
          <option value="en-GB">Anh–Anh</option><option value="en-US">Anh–Mỹ</option>
        </select></label>
        <label>Tốc độ<select value={speed} onChange={event => { stop(); setSpeed(Number(event.target.value)); setStatus('') }}>
          {[0.6, 0.75, 1, 1.2].map(rate => <option key={rate} value={rate}>{rate}×</option>)}
        </select></label>
        {mode === 'shadow' && <label><input type="checkbox" checked={loop} onChange={event => { stop(); setLoop(event.target.checked); setStatus('') }} /> Lặp câu</label>}
      </div>
      {status && <small role="status">{status}</small>}
    </div>
    {mode === 'shadow' ? <>
      <p className="muted">{lesson.focus} Nghe mẫu một lượt rồi thử đọc theo.</p>
      <VoiceMirror key={lineIndex} durationMs={10_000} onStart={stop} onBusy={setRecording}
        onRecord={seconds => { if (seconds >= 1) setRecorded(previous => previous.includes(lineIndex) ? previous : [...previous, lineIndex]) }} />
    </> : <form className="stack shadow-dictation" onSubmit={event => {
      event.preventDefault()
      if (!heard || !typed.trim()) return
      const correct = normalize(typed) === normalize(line.en)
      setGraded(correct)
      if (correct) setWritten(previous => previous.includes(lineIndex) ? previous : [...previous, lineIndex])
    }}>
      <label>Câu bạn nghe<input value={typed} autoComplete="off" spellCheck={false} autoCapitalize="none" onChange={event => {
        setTyped(event.target.value)
        setGraded(undefined)
      }} /></label>
      <button className="primary" disabled={!heard || !typed.trim()}>Kiểm tra</button>
      {graded !== undefined && <div className={graded ? 'answer' : 'error'} role="status">
        <strong>{graded ? 'Chính xác' : 'Câu mẫu'}</strong><p lang="en">{line.en}</p><p className="muted">{line.vi}</p>
      </div>}
    </form>}
    <div className="between shadow-lines">
      <button disabled={lineIndex === 0} onClick={() => selectLine(lineIndex - 1)}>Câu trước</button>
      <div className="row" aria-label="Chọn câu">
        {lesson.lines.map((item, index) => <button key={item.en} type="button" aria-label={`Câu ${index + 1}`}
          aria-pressed={index === lineIndex} onClick={() => selectLine(index)}>{index + 1}</button>)}
      </div>
      <button disabled={lineIndex + 1 === lesson.lines.length} onClick={() => selectLine(lineIndex + 1)}>Câu sau</button>
    </div>
  </section>
}

export default function Shadowing() {
  const [level, setLevel] = useState<ShadowLesson['level']>('A1')
  const lessons = shadowLessons.filter(lesson => lesson.level === level)
  const [selected, setSelected] = useState(shadowLessons[0].id)
  const lesson = lessons.find(item => item.id === selected) ?? lessons[0]
  return <>
    <header className="page-head"><h1>Shadowing tiếng Anh</h1><p>Nghe từng câu, đọc theo nhịp, nghe lại giọng mình.</p></header>
    <div className="shadow-layout">
      <section className="panel stack shadow-library" aria-label="Chọn bài Shadowing">
        <h2>Chọn bài</h2>
        <div className="row" role="group" aria-label="Trình độ Shadowing">
          {levels.map(value => <button key={value} aria-pressed={level === value} onClick={() => setLevel(value)}>{value}</button>)}
        </div>
        {lessons.map(item => <button key={item.id} aria-pressed={lesson.id === item.id} onClick={() => setSelected(item.id)}>{item.title}</button>)}
      </section>
      <ShadowSession key={lesson.id} lesson={lesson} />
    </div>
  </>
}
