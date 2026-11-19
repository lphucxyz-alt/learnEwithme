import { useId, useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { Listen } from '../../components/Audio'
import type { GrammarQuestion } from '../../data/foundations'
import { shuffle } from '../../services/random'

export function GrammarDrill({ question, done, onAnswer, final = false }: {
  question: GrammarQuestion; done: (correct: boolean) => void; onAnswer?: (correct: boolean) => void; final?: boolean
}) {
  const field = useId()
  const { complete } = useStudy()
  const [choices] = useState(() => shuffle([question.answer, ...question.distractors]))
  const [selected, select] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const fills = question.answer.split(' / ')
  let slot = 0
  const example = question.prompt.replace(/___/g, () => {
    const fill = fills[slot++] ?? ''
    return fill === 'Ø' ? '' : fill
  }).replace(/\s+/g, ' ').trim()
  const spokenExample = example.charAt(0).toUpperCase() + example.slice(1)
  return <form className="stack" onSubmit={event => {
    event.preventDefault()
    if (result !== null) {
      done(result)
      return
    }
    if (!selected) return
    const correct = selected === question.answer
    setResult(correct)
    complete('foundations', correct ? 7 : 2, 0, correct ? [] : [{
      id: 'grammar:' + question.id, domain: 'foundations', prompt: question.prompt,
      answer: question.answer + ' · ' + question.explanation
    }])
    onAnswer?.(correct)
  }}>
    <fieldset className="question stack">
      <legend>{question.prompt}</legend>
      <div className="lesson-choices">{choices.map(choice => <label key={choice}
        data-correct={result !== null && choice === question.answer}
        data-wrong={result === false && choice === selected}>
        <input type="radio" name={field} value={choice} checked={choice === selected} disabled={result !== null} onChange={() => select(choice)} />
        {choice === 'Ø' ? 'Ø · bỏ trống' : choice}
      </label>)}</div>
    </fieldset>
    {result !== null && <div className="lesson-rule stack" role="status">
      <strong className={result ? 'answer' : 'error'}>{result ? 'Chính xác' : 'Đáp án: ' + question.answer}</strong>
      <p>{question.explanation}</p>
      <p>{spokenExample} <Listen text={spokenExample} /></p>
    </div>}
    <button className="primary" disabled={!selected}>{result === null ? 'Chấm câu trả lời' : final ? 'Xem kết quả' : 'Câu tiếp theo'}</button>
  </form>
}
