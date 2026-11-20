import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useStudy } from '../app/StudyProvider'
import { leastRecent, rememberPractice } from '../services/random'
import { starterExamIds } from '../features/discipline/study-plan'
import { bandEstimate, exams, questionsOf } from '../features/tests/catalog'
import { ExamHistory, ExamSession } from '../features/tests/ExamSession'
import { PersonalExamShelf } from '../features/tests/PersonalExamShelf'

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
  const location = useLocation()
  const [skill, setSkill] = useState(() => new URLSearchParams(location.search).get('skill') ?? '')
  const [difficulty, setDifficulty] = useState(() => new URLSearchParams(location.search).has('skill') ? '' : 'Gợi ý 6.5')
  const [collection, setCollection] = useState('')
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const entries = exams.map(exam => {
    const attempts = state.attempts.filter(item => item.examId === exam.id)
    return { exam, attempts, status: state.drafts[exam.id] ? 'Đang làm' : attempts.length ? 'Đã xong' : 'Chưa làm' }
  }).filter(({ exam, status: examStatus }) => {
    const matchesDifficulty = difficulty === 'Gợi ý 6.5' ? starterExamIds.includes(exam.id) : !difficulty || exam.difficulty === difficulty
    return matchesDifficulty && (!skill || exam.skill === skill) && (!collection || exam.collection === collection)
      && (!status || examStatus === status) && exam.title.toLowerCase().includes(query.trim().toLowerCase())
  })
  function chooseRandom() {
    const unattempted = entries.filter(item => item.status === 'Chưa làm')
    const key = (item: typeof entries[number]) => 'test:' + item.exam.id
    const [next] = leastRecent(unattempted.length ? unattempted : entries, 1, key, state.recentPractice)
    if (!next) return
    update(previous => ({ ...previous, recentPractice: rememberPractice(previous.recentPractice, [key(next)]) }))
    navigate('/tests/' + next.exam.id)
  }
  return <>
    <header className="page-head"><p className="overline">MÔ PHỎNG THI MÁY</p><h1>Kho đề IELTS</h1><p>Bắt đầu với một bài gợi ý cho mỗi kỹ năng. Đổi bộ lọc để tìm thêm bài.</p>
      <p className="exam-source-note"><strong>Ghi rõ nguồn:</strong> 20 bài mô phỏng trong ứng dụng do dự án tự biên soạn, không phải đề Cambridge hay đề thi IELTS chính thức. Để làm đề thật bạn đang sở hữu ngay tại đây, thêm PDF ở khung bên dưới.</p>
    </header>
    <PersonalExamShelf />
    <section className="panel stack"><div className="between">
      <input type="search" aria-label="Tìm đề" placeholder="Tìm tên đề" value={query} onChange={event => { setQuery(event.target.value); if (difficulty === 'Gợi ý 6.5' && event.target.value.trim()) setDifficulty('') }} />
      <button className="primary" disabled={!entries.length} onClick={chooseRandom}>Chọn đề ngẫu nhiên</button>
    </div><div className="row">
      {([
        ['Kỹ năng', skill, setSkill, ['Reading', 'Listening', 'Writing', 'Speaking']],
        ['Độ khó', difficulty, setDifficulty, ['Gợi ý 6.5', 'Nền tảng', 'Trung bình', 'Nâng cao']],
        ['Bộ đề', collection, (value: string) => { setCollection(value); if (value && difficulty === 'Gợi ý 6.5') setDifficulty('') }, [...new Set(exams.map(item => item.collection))]],
        ['Trạng thái', status, setStatus, ['Chưa làm', 'Đang làm', 'Đã xong']]
      ] as const).map(([label, value, set, options]) =>
        <select key={label} aria-label={label} value={value} onChange={event => set(event.target.value)}>
          <option value="">{label === 'Độ khó' ? 'Mọi mức' : label}</option>{options.map(option => <option key={option}>{option}</option>)}
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
  </>
}
