import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStudy } from '../app/StudyProvider'
import { bandEstimate, exams } from '../features/tests/catalog'
import { ExamHistory, ExamSession } from '../features/tests/ExamSession'

export function TestRoute() {
  const { id } = useParams()
  const exam = exams.find(item => item.id === id)
  if (!exam) return <section className="panel"><h1>Không tìm thấy đề</h1><Link to="/tests">Về kho đề</Link></section>
  return <ExamSession key={id} exam={exam} />
}

export function TestHistoryRoute() {
  const { id, attempt } = useParams()
  const { state } = useStudy()
  const exam = exams.find(item => item.id === id)
  if (!exam) return <section className="panel"><h1>Không tìm thấy đề</h1><Link to="/tests">Về kho đề</Link></section>
  return <ExamHistory exam={exam} attempts={state.attempts.filter(item => item.examId === id)} selected={attempt} />
}

export default function Tests() {
  const { state } = useStudy()
  const [skill, setSkill] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [collection, setCollection] = useState('')
  const [status, setStatus] = useState('')
  const entries = exams.map(exam => {
    const attempts = state.attempts.filter(item => item.examId === exam.id)
    return { exam, attempts, status: state.drafts[exam.id] ? 'Đang làm' : attempts.length ? 'Đã xong' : 'Chưa làm' }
  }).filter(item => (!skill || item.exam.skill === skill) && (!difficulty || item.exam.difficulty === difficulty) && (!collection || item.exam.collection === collection) && (!status || item.status === status))
  return <>
    <header className="page-head"><p className="overline">MÔ PHỎNG THI MÁY</p><h1>Kho đề IELTS</h1><p>Làm đề mẫu, xem lời giải và theo dõi lịch sử từng kỹ năng.</p></header>
    <section className="panel stack"><div className="row">
      {([
        ['Kỹ năng', skill, setSkill, ['Reading', 'Listening', 'Writing', 'Speaking']],
        ['Độ khó', difficulty, setDifficulty, ['Nền tảng', 'Trung bình', 'Nâng cao']],
        ['Bộ đề', collection, setCollection, [...new Set(exams.map(item => item.collection))]],
        ['Trạng thái', status, setStatus, ['Chưa làm', 'Đang làm', 'Đã xong']]
      ] as const).map(([label, value, set, options]) =>
        <select key={label} aria-label={label} value={value} onChange={event => set(event.target.value)}>
          <option value="">{label}</option>{options.map(option => <option key={option}>{option}</option>)}
        </select>)}
    </div>
    {!entries.length && <p>Không tìm thấy đề phù hợp.</p>}
    <div className="catalog">{entries.map(({ exam, attempts, status: label }) => <article className="catalog-item stack" key={exam.id}>
      <div className="between"><span className="overline">{exam.skill}</span><span className="pill">{label}</span></div>
      <h2>{exam.title}</h2><p>{exam.collection} · {exam.difficulty}</p>
      {attempts[0]?.score != null && <p>Lần gần nhất {attempts[0].score}/{attempts[0].total} · band {bandEstimate(attempts[0].score, attempts[0].total)}</p>}
      <div className="row"><Link className="button primary" to={'/tests/' + exam.id}>{label === 'Đang làm' ? 'Tiếp tục' : 'Mở đề'}</Link>
      {attempts.length > 0 && <Link className="button" to={'/tests/' + exam.id + '/history'}>Lịch sử ({attempts.length})</Link>}</div>
    </article>)}</div></section>
  </>
}
