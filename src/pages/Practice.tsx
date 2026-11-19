import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudy } from '../app/StudyProvider'
import { clockLabel, dayKey } from '../features/discipline/activity'
import { useNow } from '../features/discipline/FocusTimer'
import { ReviewCard } from '../features/discipline/Review'
import { EarDrill } from '../features/ipa/EarDrill'
import { GrammarDrill } from '../features/foundations/GrammarDrill'
import { rememberPractice } from '../services/random'
import { createSession, type PracticeMode } from '../features/practice/session'
import { StructureDrill } from '../features/structures/StructureDrill'
import { VerbDrill } from '../features/verbs/VerbDrill'

export default function Practice() {
  const { state, complete, update } = useStudy()
  const [session, setSession] = useState<ReturnType<typeof createSession>>([])
  const [mode, setMode] = useState<PracticeMode>('foundations')
  const [level, setLevel] = useState<'A1' | 'A2' | 'B1' | 'all'>('A1')
  const [reviewed, setReviewed] = useState(0)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [deadline, setDeadline] = useState(0)
  const [xpStart, setXpStart] = useState(0)
  const [xpGained, setXpGained] = useState(0)
  const [finished, setFinished] = useState(false)
  const now = useNow()
  const step = session[index]
  const remaining = Math.max(0, Math.ceil((deadline - now) / 1000))
  const totalXp = Object.values(state.activity).reduce((sum, entry) => sum + entry.xp, 0)
  function finish(attempts = answers.length + reviewed) {
    if (finished) return
    const bonus = attempts > 0 ? 15 : 0
    if (bonus) complete('practice', bonus)
    setXpGained(totalXp - xpStart + bonus)
    setFinished(true)
  }
  function next(correct?: boolean, review = false) {
    if (correct !== undefined) setAnswers(previous => [...previous, correct])
    if (review) setReviewed(value => value + 1)
    setIndex(value => value + 1)
    if (index + 1 === session.length) finish(answers.length + reviewed + Number(correct !== undefined || review))
  }
  function start(minutes: number) {
    const due = Object.values(state.cards).filter(card => card.due <= dayKey()).sort((a, b) => a.due.localeCompare(b.due))
    const next = createSession(minutes, due, mode, state.recentPractice, level)
    update(previous => ({ ...previous, recentPractice: rememberPractice(previous.recentPractice, next.filter(item => item.kind !== 'review').map(item => item.id)) }))
    setSession(next)
    setReviewed(0)
    setIndex(0)
    setAnswers([])
    setXpStart(totalXp)
    setDeadline(Date.now() + minutes * 60_000)
    setFinished(false)
  }
  return <>
    <header className="page-head"><p className="overline">PHIÊN LUYỆN HẰNG NGÀY</p><h1>Luyện nhanh</h1><p>Chọn ngữ pháp hoặc trộn nhiều kỹ năng. Phiên mới ưu tiên câu bạn ít gặp gần đây.</p><Link className="text-link" to="/practice/speaking">Luyện nói 4/3/2</Link></header>
    {!session.length && <section className="panel stack">
      <h2>Chọn nội dung</h2>
      <div className="row"><button aria-pressed={mode === 'foundations'} onClick={() => setMode('foundations')}>Ngữ pháp nền tảng</button>
        <button aria-pressed={mode === 'mixed'} onClick={() => setMode('mixed')}>Trộn kỹ năng</button>
        <select aria-label="Trình độ ngữ pháp" value={level} onChange={event => setLevel(event.target.value as typeof level)}>
          <option value="A1">A1 · Cơ bản</option><option value="A2">A2 · Hằng ngày</option><option value="B1">B1 · Trung cấp</option><option value="all">Mọi trình độ</option>
        </select>
      </div>
    </section>}
    {!session.length && <div className="metrics">{[5, 15, 30].map(minutes => <section className="panel stack" key={minutes}>
      <h2>{minutes} phút</h2><button className="primary" onClick={() => start(minutes)}>Bắt đầu phiên {minutes} phút</button>
    </section>)}</div>}
    {session.length > 0 && !finished && step && <section className="panel stack">
      <div className="between"><h2>{{ review: 'Ôn thẻ đến hạn', grammar: 'Ngữ pháp nền tảng', ipa: 'Phân biệt âm', verb: 'Động từ', structure: 'Biến đổi câu' }[step.kind]}</h2><strong>{index + 1}/{session.length} · {clockLabel(remaining)}</strong></div>
      <progress value={index} max={session.length} aria-label="Tiến độ bài luyện" />
      {step.kind === 'review' && <ReviewCard key={index} card={step.card} onDone={() => next(undefined, true)} />}
      {step.kind === 'grammar' && <GrammarDrill key={index} question={step.question} done={next} />}
      {step.kind === 'ipa' && <EarDrill key={index} pair={step.pair} done={next} />}
      {step.kind === 'verb' && <VerbDrill key={index} verb={step.verb} mode={step.mode} done={next} />}
      {step.kind === 'structure' && <StructureDrill key={index} item={step.structure} done={next} />}
      <div className="row"><button onClick={() => next()}>Bỏ qua bước</button>{remaining === 0 && <button onClick={() => finish()}>Kết thúc theo thời lượng</button>}</div>
    </section>}
    {finished && <section className="panel stack"><h2>Tổng kết phiên học</h2><p>{answers.filter(Boolean).length}/{answers.length} câu đã trả lời đúng · {reviewed} thẻ đã ôn · +{xpGained} XP</p>
      <div className="row"><Link className="button primary" to="/">Về trung tâm</Link><button onClick={() => setSession([])}>Chọn phiên mới</button></div>
    </section>}
  </>
}
