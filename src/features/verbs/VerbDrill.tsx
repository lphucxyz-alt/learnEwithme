import { useEffect, useRef, useState } from 'react'
import { Listen } from '../../components/Audio'
import { useStudy } from '../../app/StudyProvider'
import { accepts, clozeAnswer, verbCard, verbExample, type Verb } from './verbs'

export function VerbDrill({ verb, mode, done, qualifies }: { verb: Verb; qualifies: boolean; mode: 'typing' | 'cloze'; done: (correct: boolean) => void }) {
  const { complete } = useStudy()
  const start = useRef(Date.now())
  const [values, setValues] = useState(['', ''])
  const [result, setResult] = useState<boolean | null>(null)
  const cloze = mode === 'cloze'
  return <form className="stack" onSubmit={event => {
    event.preventDefault()
    if (result !== null) { done(result); return }
    if (!values[0].trim() || !cloze && !values[1].trim()) return
    const correct = cloze ? accepts(values[0], clozeAnswer(verb)) : accepts(values[0], verb.past) && accepts(values[1], verb.part)
    setResult(correct)
    complete('verbs', correct ? 8 : 2, Math.min(120, Math.round((Date.now() - start.current) / 1000)), correct ? [] : [verbCard(verb)], qualifies)
  }}>
    <p>{cloze ? verb.example : <strong>{verb.base} · {verb.meaning}</strong>}</p>
    <div className="row">{(cloze ? ['Từ cần điền'] : ['V2', 'V3']).map((label, index) => <label key={label}>{label}
      <input autoComplete="off" required disabled={result !== null} value={values[index]} onChange={event => setValues(previous => previous.map((value, position) => position === index ? event.target.value : value))} />
    </label>)}</div>
    {result !== null && <p className={result ? 'answer' : 'error'} role="status">{result ? 'Chính xác' : 'Đáp án'} · {cloze ? verbExample(verb) : verb.past + ' · ' + verb.part} <Listen text={verbExample(verb)} /></p>}
    <button className="primary">{result === null ? 'Chấm câu trả lời' : 'Tiếp tục'}</button>
  </form>
}

export function Flashcard({ verb, move, onReveal }: { verb: Verb; move: (direction: number) => void; onReveal: () => void }) {
  const { complete } = useStudy()
  const [flipped, setFlipped] = useState(false)
  const touch = useRef(0)
  function flip() {
    if (!flipped) onReveal()
    setFlipped(value => !value)
  }
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.target as HTMLElement).closest('input,textarea,select,button,[role=dialog]')) return
      if (event.code === 'Space') { event.preventDefault(); flip() }
      if (event.key === 'ArrowRight') move(1)
      if (event.key === 'ArrowLeft') move(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  return <div className="stack">
    <button className="flash" onTouchStart={event => { touch.current = event.touches[0].clientX }} onTouchEnd={event => {
      const distance = event.changedTouches[0].clientX - touch.current
      if (Math.abs(distance) > 50) move(distance < 0 ? 1 : -1)
    }} onClick={flip}><strong>{flipped ? verb.past + ' · ' + verb.part : verb.base}</strong>
      <span>{flipped ? verbExample(verb) : verb.meaning + ' · Chạm hoặc nhấn Space để lật'}</span></button>
    <div className="row"><button onClick={() => move(-1)}>Thẻ trước</button><button onClick={() => move(1)}>Thẻ sau</button>
      {flipped && <button onClick={() => complete('verbs', 0, 0, [verbCard(verb)], false)}>Đưa vào sổ lỗi</button>}</div>
  </div>
}
