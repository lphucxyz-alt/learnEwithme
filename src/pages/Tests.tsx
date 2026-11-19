import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStudy } from '../app/StudyProvider'
import { leastRecent, rememberPractice } from '../services/random'
import { bandEstimate, exams, questionsOf } from '../features/tests/catalog'
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
  const { state, update } = useStudy()
  const navigate = useNavigate()
  const [skill, setSkill] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [collection, setCollection] = useState('')
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const entries = exams.map(exam => {
    const attempts = state.attempts.filter(item => item.examId === exam.id)
    return { exam, attempts, status: state.drafts[exam.id] ? 'Đang làm' : attempts.length ? 'Đã xong' : 'Chưa làm' }
  }).filter(item => (!skill || item.exam.skill === skill) && (!difficulty || item.exam.difficulty === difficulty) && (!collection || item.exam.collection === collection) && (!status || item.status === status) && item.exam.title.toLowerCase().includes(query.trim().toLowerCase()))
  function chooseRandom() {
    const unattempted = entries.filter(item => item.status === 'Chưa làm')
    const key = (item: typeof entries[number]) => 'test:' + item.exam.id
    const [next] = leastRecent(unattempted.length ? unattempted : entries, 1, key, state.recentPractice)
    if (!next) return
    update(previous => ({ ...previous, recentPractice: rememberPractice(previous.recentPractice, [key(next)]) }))
    navigate('/tests/' + next.exam.id)
  }
  return <>
    <header className="page-head"><p className="overline">MÔ PHỎNG THI MÁY</p><h1>Kho đề IELTS</h1><p>{exams.length} đề tự biên soạn ở ba độ khó, có bài làm quen, Academic và General Training.</p></header>
    <section className="panel stack"><div className="between">
      <input type="search" aria-label="Tìm đề" placeholder="Tìm tên đề" value={query} onChange={event => setQuery(event.target.value)} />
      <button className="primary" disabled={!entries.length} onClick={chooseRandom}>Chọn đề ngẫu nhiên</button>
    </div><div className="row">
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
    <p className="muted">{entries.length} đề phù hợp · Chọn ngẫu nhiên ưu tiên đề chưa làm và lâu chưa gặp.</p>
    {!entries.length && <p>Không tìm thấy đề phù hợp.</p>}
    <div className="catalog">{entries.map(({ exam, attempts, status: label }) => <article className="catalog-item stack" key={exam.id}>
      <div className="between"><span className="overline">{exam.skill}</span><span className="pill">{label}</span></div>
      <h2>{exam.title}</h2><p>{exam.collection} · {exam.difficulty}</p><small>{Math.ceil(exam.seconds / 60)} phút{questionsOf(exam).length > 0 ? ' · ' + questionsOf(exam).length + ' câu' : exam.skill === 'Writing' ? ' · 2 task' : ' · 3 phần'}</small>
      {attempts[0]?.score != null && <p>Lần gần nhất {attempts[0].score}/{attempts[0].total} · band {bandEstimate(attempts[0].score, attempts[0].total)}</p>}
      <div className="row"><Link className="button primary" to={'/tests/' + exam.id}>{label === 'Đang làm' ? 'Tiếp tục' : 'Mở đề'}</Link>
      {attempts.length > 0 && <Link className="button" to={'/tests/' + exam.id + '/history'}>Lịch sử ({attempts.length})</Link>}</div>
    </article>)}</div></section>
    <section className="panel stack"><h2>Đề mẫu chính thức IELTS</h2>
      <div className="row">
        <a className="text-link" href="https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test" target="_blank" rel="noreferrer">IELTS Academic</a>
        <a className="text-link" href="https://ielts.org/take-a-test/preparation-resources/sample-test-questions/general-training-test" target="_blank" rel="noreferrer">IELTS General Training</a>
      </div>
    </section>
  </>
}
