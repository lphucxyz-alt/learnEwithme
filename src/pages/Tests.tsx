import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useStudy } from '../app/StudyProvider'
import { leastRecent, rememberPractice } from '../services/random'
import { starterExamIds } from '../features/discipline/study-plan'
import { bandEstimate, exams, questionsOf } from '../features/tests/catalog'
import { ExamHistory, ExamSession } from '../features/tests/ExamSession'
import { PersonalExamShelf } from '../features/tests/PersonalExamShelf'
import { hasExamCredit } from '../features/discipline/study-credit'
import { useNow } from '../features/discipline/FocusTimer'
import { finishExam } from '../features/tests/exam-attempt'

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
  const [view, setView] = useState<'simulations' | 'pdf'>('simulations')
  const now = useNow()
  useEffect(() => {
    const ended = exams.flatMap(exam => {
      const deadline = state.drafts[exam.id]?.deadline
      return deadline !== undefined && deadline <= now ? [{ exam, deadline, attemptId: crypto.randomUUID() }] : []
    })
    if (ended.length) update(previous => ended.reduce((current, { exam, ...options }) => finishExam(current, exam, { ...options, now }), previous))
  }, [now, state.drafts, update])
  const entries = exams.map(exam => {
    const attempts = state.attempts.filter(item => item.examId === exam.id)
    const latestCompleted = attempts.find(item => hasExamCredit(exam, item.draft.answers))
    const deadline = state.drafts[exam.id]?.deadline
    return { exam, attempts, latestCompleted, status: deadline !== undefined && deadline > now ? 'Đang làm' : latestCompleted ? 'Đã nộp' : attempts.length ? 'Chưa đủ' : 'Chưa làm' }
  }).filter(({ exam, status: examStatus }) => {
    const matchesDifficulty = difficulty === 'Gợi ý 6.5' ? starterExamIds.includes(exam.id) : !difficulty || exam.difficulty === difficulty
    return matchesDifficulty && (!skill || exam.skill === skill) && (!collection || exam.collection === collection)
      && (!status || examStatus === status) && exam.title.toLowerCase().includes(query.trim().toLowerCase())
  })
  function chooseRandom() {
    const unattempted = entries.filter(item => item.status === 'Chưa làm' || item.status === 'Chưa đủ')
    const key = (item: typeof entries[number]) => 'test:' + item.exam.id
    const [next] = leastRecent(unattempted.length ? unattempted : entries, 1, key, state.recentPractice)
    if (!next) return
    update(previous => ({ ...previous, recentPractice: rememberPractice(previous.recentPractice, [key(next)]) }))
    navigate('/tests/' + next.exam.id)
  }
  return <>
    <header className="page-head"><p className="overline">MÔ PHỎNG THI MÁY</p><h1>Kho đề IELTS</h1><p>Chọn đề luyện theo kỹ năng hoặc mở PDF của bạn.</p></header>
    <div className="row" role="group" aria-label="Chọn kho đề">
      <button type="button" aria-pressed={view === 'simulations'} onClick={() => setView('simulations')}>Đề mô phỏng</button>
      <button type="button" aria-pressed={view === 'pdf'} onClick={() => setView('pdf')}>PDF của tôi</button>
    </div>
    <div hidden={view !== 'pdf'}><PersonalExamShelf /></div>
    <div hidden={view !== 'simulations'}>
    <section className="panel stack">
      <p className="muted exam-source-note">Các bài mô phỏng do dự án tự biên soạn. Đề chính thức bạn đang sở hữu có thể mở trong mục PDF của tôi.</p>
      <div className="between">
      <input type="search" aria-label="Tìm đề" placeholder="Tìm tên đề" value={query} onChange={event => { setQuery(event.target.value); if (difficulty === 'Gợi ý 6.5' && event.target.value.trim()) setDifficulty('') }} />
      <button className="primary" disabled={!entries.length} onClick={chooseRandom}>Chọn đề ngẫu nhiên</button>
    </div><div className="row">
      {([
        ['Kỹ năng', skill, setSkill, ['Reading', 'Listening', 'Writing', 'Speaking']],
        ['Độ khó', difficulty, setDifficulty, ['Gợi ý 6.5', 'Nền tảng', 'Trung bình', 'Nâng cao']],
        ['Bộ đề', collection, (value: string) => { setCollection(value); if (value && difficulty === 'Gợi ý 6.5') setDifficulty('') }, [...new Set(exams.map(item => item.collection))]],
        ['Trạng thái', status, setStatus, ['Chưa làm', 'Đang làm', 'Đã nộp', 'Chưa đủ']]
      ] as const).map(([label, value, set, options]) =>
        <select key={label} aria-label={label} value={value} onChange={event => set(event.target.value)}>
          <option value="">{label === 'Độ khó' ? 'Mọi mức' : label}</option>{options.map(option => <option key={option}>{option}</option>)}
        </select>)}
    </div>
    <p className="muted">{entries.length} đề phù hợp · Chọn ngẫu nhiên ưu tiên đề chưa làm và lâu chưa gặp.</p>
    {!entries.length && <p>Không tìm thấy đề phù hợp.</p>}
    <div className="catalog exam-catalog">{entries.map(({ exam, attempts, latestCompleted, status: label }) => <article className="catalog-item stack" key={exam.id}>
      <div className="between"><span className="overline">{exam.skill}</span><span className="pill">{label}</span></div>
      <h2>{exam.title}</h2><p>{exam.collection} · {exam.difficulty}</p><small>{Math.ceil(exam.seconds / 60)} phút{questionsOf(exam).length > 0 ? ' · ' + questionsOf(exam).length + ' câu' : exam.skill === 'Writing' ? ' · 2 task' : ' · 3 phần'}</small>
      {latestCompleted?.score != null && <p>Lần được tính gần nhất {latestCompleted.score}/{latestCompleted.total} · band {bandEstimate(latestCompleted.score, latestCompleted.total)}</p>}
      <div className="row"><Link className="button primary" to={'/tests/' + exam.id}>{label === 'Đang làm' ? 'Tiếp tục' : 'Mở đề'}</Link>
      {attempts.length > 0 && <Link className="button" to={'/tests/' + exam.id + '/history'}>Lịch sử ({attempts.length})</Link>}</div>
    </article>)}</div></section>
    </div>
  </>
}
