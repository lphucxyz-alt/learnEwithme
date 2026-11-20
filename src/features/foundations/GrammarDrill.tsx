import { useId, useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { Listen } from '../../components/Audio'
import type { GrammarQuestion } from '../../data/foundations'
import { shuffle } from '../../services/random'
import type { GrammarTask } from './lesson-quiz'

export function GrammarDrill({ question, done, onAnswer, qualifies, final = false }: {
  question: GrammarQuestion | GrammarTask; done: (correct: boolean) => void; onAnswer?: (correct: boolean) => void; qualifies: boolean; final?: boolean
}) {
  const field = useId()
  const { complete } = useStudy()
  const mode = 'mode' in question ? question.mode : 'choice'
  const [choices] = useState(() => shuffle([question.answer, ...question.distractors]))
  const [selected, select] = useState('')
  const [typedAnswer, setTypedAnswer] = useState('')
  const [orderedTokens, setOrderedTokens] = useState<number[]>([])
  const [wordTokens] = useState(() => shuffle(question.answer.trim().split(/\s+/).map((word, index) => ({ word, index }))))
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
    const orderedAnswer = orderedTokens.map(index => wordTokens.find(token => token.index === index)?.word).join(' ')
    const response = mode === 'choice' ? selected : mode === 'word-order' ? orderedAnswer : typedAnswer
    if (!response.trim() || mode === 'word-order' && orderedTokens.length < wordTokens.length) return
    const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, ' ').replace(/[.,!?;:]+$/g, '')
    const correct = normalize(response) === normalize(question.answer)
    setResult(correct)
    complete('foundations', correct ? 7 : 2, 0, correct ? [] : [{
      id: 'grammar:' + question.id, domain: 'foundations', prompt: question.prompt,
      answer: question.answer + ' · ' + question.explanation
    }], qualifies)
    onAnswer?.(correct)
  }}>
    <fieldset className="question stack">
      <legend>{mode === 'choice' ? question.prompt : mode === 'gap' ? 'Điền từ hoặc cụm từ còn thiếu.' : mode === 'correction' ? 'Tìm và sửa lỗi trong câu.' : 'Sắp xếp các từ để hoàn thành câu.'}</legend>
      {'topicTitle' in question && <span className="pill">{question.topicTitle}</span>}
      {mode === 'choice' && <div className="lesson-choices">{choices.map(choice => <label key={choice}
        data-correct={result !== null && choice === question.answer}
        data-wrong={result === false && choice === selected}>
        <input type="radio" name={field} value={choice} checked={choice === selected} disabled={result !== null} onChange={() => select(choice)} />
        {choice === 'Ø' ? 'Ø · bỏ trống' : choice}
      </label>)}</div>}
      {mode === 'gap' && <div className="grammar-writing-task">
        <p>{question.prompt}</p>
        <label>Đáp án của bạn
          <input autoComplete="off" aria-label="Điền từ hoặc cụm từ còn thiếu" value={typedAnswer === 'Ø' ? '' : typedAnswer} disabled={result !== null} placeholder="Gõ từ hoặc cụm từ" onChange={event => setTypedAnswer(event.target.value)} />
        </label>
        {question.answer === 'Ø' && <button type="button" disabled={result !== null} onClick={() => setTypedAnswer('Ø')}>Để trống (Ø)</button>}
      </div>}
      {mode === 'correction' && <div className="grammar-writing-task">
        <p className="grammar-error-sentence">{('displayedPrompt' in question && question.displayedPrompt) || question.prompt}</p>
        <label>Thay phần sai bằng gì?
          <input autoComplete="off" aria-label="Nhập phần sửa đúng" value={typedAnswer === 'Ø' ? '' : typedAnswer} disabled={result !== null} placeholder="Gõ phần sửa đúng" onChange={event => setTypedAnswer(event.target.value)} />
        </label>
        {question.answer === 'Ø' && <button type="button" disabled={result !== null} onClick={() => setTypedAnswer('Ø')}>Bỏ phần thừa (Ø)</button>}
      </div>}
      {mode === 'word-order' && <div className="grammar-writing-task">
        <p>{question.prompt}</p>
        <div className="grammar-word-bank" aria-label="Các từ cần sắp xếp">{wordTokens.filter(token => !orderedTokens.includes(token.index)).map(token => <button type="button" key={token.index} disabled={result !== null} onClick={() => setOrderedTokens(value => [...value, token.index])}>{token.word}</button>)}</div>
        <div className="grammar-answer-order" aria-label="Cụm từ bạn đã sắp xếp">{orderedTokens.map(index => {
          const token = wordTokens.find(item => item.index === index)!
          return <button type="button" key={index} disabled={result !== null} onClick={() => setOrderedTokens(value => value.filter(item => item !== index))}>{token.word} ×</button>
        })}</div>
      </div>}
    </fieldset>
    {result !== null && <div className="lesson-rule stack quiz-feedback" role="status">
      <strong className={result ? 'answer' : 'error'}>{result ? 'Chính xác' : 'Đáp án: ' + question.answer}</strong>
      <p>{question.explanation}</p>
      <p>{spokenExample} <Listen text={spokenExample} /></p>
    </div>}
    <button className="primary" disabled={result === null && (mode === 'choice' ? !selected : mode === 'word-order' ? orderedTokens.length < wordTokens.length : !typedAnswer.trim())}>{result === null ? 'Chấm câu trả lời' : final ? 'Xem kết quả' : 'Câu tiếp theo'}</button>
  </form>
}
