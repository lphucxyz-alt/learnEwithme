import { useState } from 'react'
import { Link } from 'react-router-dom'
import { leastRecent } from '../services/random'
import { exams } from '../features/tests/catalog'
import { Speaking } from '../features/tests/Speaking'
import { SpeakingLifeline } from '../features/fluency/SpeakingLifeline'

const topics = exams.filter(item => item.skill === 'Speaking')
const initialTopic = topics.find(item => item.id === 'study-routines') ?? topics[0]

export default function Fluency() {
  const [topic, setTopic] = useState(initialTopic.id)
  const [recent, setRecent] = useState([initialTopic.id])
  const exam = topics.find(item => item.id === topic) ?? initialTopic
  function selectTopic(value: string) {
    setTopic(value)
    setRecent(previous => [...previous.filter(id => id !== value), value])
  }
  return <>
    <header className="page-head"><Link className="text-link" to="/practice">Luyện nhanh</Link><h1>Luyện nói 4/3/2</h1>
      <p>Giữ cùng một đề qua ba lượt. Sau mỗi lượt, bấm Chấm với AI và chọn một lỗi để sửa khi nói lại.</p>
      <p>Tải bản ghi để lần sau mở cùng đề và so khoảng lặng, tốc độ nhớ lại cụm từ.</p></header>
    <section className="panel row"><label>Chủ đề Speaking
      <select value={topic} onChange={event => selectTopic(event.target.value)}>{topics.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
    </label><button onClick={() => {
      const [next] = leastRecent(topics.filter(item => item.id !== topic), 1, item => item.id, recent)
      if (next) selectTopic(next.id)
    }}>Đổi chủ đề ngẫu nhiên</button></section>
    <SpeakingLifeline topic={exam.title} roundMinutes={4} defaultOpen={true} />
    <Speaking key={exam.id} parts={exam.parts} fluency />
  </>
}
