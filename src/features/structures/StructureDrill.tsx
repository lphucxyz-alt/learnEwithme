import { useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { Listen } from '../../components/Audio'
import { structureCard, type Structure } from '../../data/structures'

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/[.!?]+$/, '').replace(/\s+/g, ' ')
}

export function StructureDrill({ item, done }: { item: Structure; done?: (correct: boolean) => void }) {
  const { complete } = useStudy()
  const [value, setValue] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const [order, setOrder] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const words = item.answers[0].split(' ').map((word, index) => ({ word, index })).reverse()
  return <form className="stack" onSubmit={event => {
    event.preventDefault()
    if (result !== null) { done?.(result); return }
    const text = order ? selected.map(index => words[index].word).join(' ') : value
    const correct = item.answers.some(answer => normalize(answer) === normalize(text))
    setResult(correct)
    complete('structures', correct ? 10 : 2, 0, correct ? [] : [structureCard(item)])
  }}>
    <div className="row"><button type="button" aria-pressed={!order} disabled={result !== null} onClick={() => setOrder(false)}>Biến đổi câu</button><button type="button" aria-pressed={order} disabled={result !== null} onClick={() => setOrder(true)}>Ghép câu</button></div>
    <p>{item.prompt}</p><label><strong>{item.prefix} …</strong>
      {!order && <input aria-label="Phần còn lại của câu" required value={value} disabled={result !== null} onChange={event => setValue(event.target.value)} />}</label>
    {order && <>
      <p>{selected.map(index => words[index].word).join(' ') || 'Chọn từng từ theo thứ tự.'}</p>
      <div className="row">{words.map((entry, index) => <button type="button" key={entry.index} disabled={result !== null || selected.includes(index)} onClick={() => setSelected(previous => [...previous, index])}>{entry.word}</button>)}
      <button type="button" disabled={!selected.length || result !== null} onClick={() => setSelected(previous => previous.slice(0, -1))}>Bỏ từ cuối</button></div>
    </>}
    {result !== null && <p role="status" className={result ? 'answer' : 'error'}>{result ? 'Chính xác' : 'Đáp án mẫu'} · {structureCard(item).answer} <Listen text={structureCard(item).answer} /></p>}
    {(result === null || done) && <button className="primary" disabled={order && !selected.length}>{result === null ? 'Chấm câu trả lời' : 'Tiếp tục'}</button>}
    {result !== null && !done && <button type="button" onClick={() => { setResult(null); setSelected([]); setValue('') }}>Làm lại</button>}
  </form>
}
