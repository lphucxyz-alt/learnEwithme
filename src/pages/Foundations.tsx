import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStudy } from '../app/StudyProvider'
import { Listen } from '../components/Audio'
import type { Lesson } from '../data/foundations'
import { lessons } from '../data/foundations/catalog'
import { GrammarDrill } from '../features/foundations/GrammarDrill'
import { createLessonQuiz, type GrammarTask } from '../features/foundations/lesson-quiz'
import { triggerCelebration } from '../features/discipline/CelebrationHost'
import { leastRecent, rememberPractice } from '../services/random'

const levels = ['A1', 'A2', 'B1'] as const
const groups = [...new Set(lessons.map(item => item.group))]
const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replaceAll('đ', 'd').trim()

export default function Foundations() {
  const { state } = useStudy()
  const [level, setLevel] = useState('')
  const [group, setGroup] = useState('')
  const [query, setQuery] = useState('')
  const visibleLevel = level || (query.trim() ? 'all' : 'A1')
  const results = lessons.filter(item => (visibleLevel === 'all' || item.level === visibleLevel) && (!group || item.group === group)
    && normalize([item.title, item.rule, item.group].join(' ')).includes(normalize(query)))
  const next = results.find(item => !state.lessons[item.id]?.attempts)
  return <>
    <header className="hero"><div><p className="overline">TIẾNG ANH TỪ GỐC · A1–B1</p><h1>Nền tảng tiếng Anh</h1>
      <p>{lessons.length} bài · 20 lượt luyện mỗi bài · 4 cách làm có giải thích tiếng Việt.</p></div>
      {next && <Link className="button primary" to={'/foundations/' + next.id}>Học bài tiếp theo</Link>}
    </header>
    <section className="panel stack">
      <h2>Tìm chủ điểm cần ôn</h2>
      <div className="row">
        <input type="search" aria-label="Tìm bài nền tảng" placeholder="Ví dụ: mạo từ, in/on/at, quá khứ" value={query} onChange={event => setQuery(event.target.value)} />
        <select aria-label="Trình độ" value={visibleLevel} onChange={event => setLevel(event.target.value)}>
          <option value="all">Mọi trình độ</option>{levels.map(value => <option key={value}>{value}</option>)}
        </select>
        <select aria-label="Chủ điểm" value={group} onChange={event => setGroup(event.target.value)}>
          <option value="">Mọi chủ điểm</option>{groups.map(value => <option key={value}>{value}</option>)}
        </select>
      </div>
      {!results.length && <p>Chưa tìm thấy bài phù hợp.</p>}
      {levels.filter(value => results.some(item => item.level === value)).map(value => <div key={value} className="stack">
        <h3>{value} · {value === 'A1' ? 'Dựng câu cơ bản' : value === 'A2' ? 'Nói và viết hằng ngày' : 'Nối ý và diễn đạt chính xác'}</h3>
        <div className="lesson-catalog">{results.filter(item => item.level === value).map(item => {
          const progress = state.lessons[item.id]
          return <Link key={item.id} className="button lesson-link" to={'/foundations/' + item.id}>
            <span><strong>{item.title}</strong><small>{item.group}</small></span>
            <span className="pill">{progress ? progress.best + '/' + (progress.total ?? 6) + ' tốt nhất' : '20 lượt · 4 dạng'}</span>
          </Link>
        })}</div>
      </div>)}
    </section>
    <section className="panel stack"><h2>Đọc thêm theo trình độ</h2><div className="row">
      <a className="text-link" href="https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2" target="_blank" rel="noreferrer">British Council · A1–A2</a>
      <a className="text-link" href="https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2" target="_blank" rel="noreferrer">British Council · B1–B2</a>
    </div></section>
  </>
}

function LessonPage({ lesson }: { lesson: Lesson }) {
  const { state, update } = useStudy()
  const [quiz, setQuiz] = useState<GrammarTask[]>([])
  const [position, setPosition] = useState(0)
  const [score, setScore] = useState(0)
  const progress = state.lessons[lesson.id]
  const next = lessons[lessons.indexOf(lesson) + 1]
  const question = quiz[position]
  function start() {
    const questions = leastRecent(createLessonQuiz(lesson), 20, item => item.id, state.recentPractice)
    update(previous => ({ ...previous, recentPractice: rememberPractice(previous.recentPractice, questions.map(item => item.id)) }))
    setQuiz(questions)
    setPosition(0)
    setScore(0)
  }
  return <>
    <header className="page-head">
      <Link className="text-link" to="/foundations">Nền tảng tiếng Anh</Link>
      <p className="overline">{lesson.level} · {lesson.group}</p><h1>{lesson.title}</h1>
      {progress && <p>Kết quả tốt nhất {progress.best}/{progress.total ?? 6} · Đã làm {progress.attempts} lần</p>}
    </header>
    <div className="split">
      <section className="panel stack">
        <h2>Khi nào dùng?</h2><p>{lesson.rule}</p>
        <blockquote><strong>{lesson.example}</strong><p>{lesson.translation}</p><Listen text={lesson.example} /></blockquote>
        <div className="lesson-rule"><h3>Dễ nhầm</h3><p>{lesson.trap}</p></div>
      </section>
      <section className="panel stack">
        <div className="between"><h2>Luyện ngay</h2>{question && <span className="pill">{position + 1}/{quiz.length}</span>}</div>
        {!quiz.length && <><p className="muted">20 lượt luyện theo 4 dạng: chọn đáp án, điền từ, sửa lỗi và sắp xếp từ. Câu hỏi được tạo từ ngân hàng bài học, có thể gặp lại cùng điểm ngữ pháp ở dạng khác.</p><button className="primary" onClick={start}>Bắt đầu 20 lượt</button></>}
        {question && <GrammarDrill key={question.id} question={question} final={position + 1 === quiz.length}
          onAnswer={correct => {
            const total = score + Number(correct)
            setScore(total)
            if (position + 1 === quiz.length) {
              triggerCelebration({
                xp: 15,
                title: '+15 XP! Hoàn thành bài học',
                subtitle: total === quiz.length ? 'Xuất sắc! Bạn làm đúng toàn bộ câu.' : 'Đã ghi nhận tiến độ ngữ pháp hôm nay.',
                confetti: true
              })
              update(previous => {
                const entry = previous.lessons[lesson.id]
                const previousBest = entry?.total === 20 ? entry.best : 0
                return { ...previous, lessons: { ...previous.lessons, [lesson.id]: { attempts: (entry?.attempts ?? 0) + 1, best: Math.max(previousBest, total), last: total, total: 20 } } }
              })
            }
          }}
          done={() => setPosition(value => value + 1)} />}
        {quiz.length > 0 && !question && <>
          <p role="status">Kết quả <strong>{score}/{quiz.length}</strong>. {score < quiz.length ? 'Câu sai đã vào sổ ôn ở Trung tâm.' : 'Bạn đã làm đúng cả bài.'}</p>
          <div className="row"><button onClick={start}>Luyện lại</button>{next && <Link className="button primary" to={'/foundations/' + next.id}>Bài tiếp theo</Link>}</div>
        </>}
      </section>
    </div>
  </>
}

export function FoundationLesson() {
  const { id } = useParams()
  const lesson = lessons.find(item => item.id === id)
  return lesson ? <LessonPage key={lesson.id} lesson={lesson} /> : <section className="panel stack"><h1>Không tìm thấy bài</h1><Link className="text-link" to="/foundations">Về kho nền tảng</Link></section>
}
