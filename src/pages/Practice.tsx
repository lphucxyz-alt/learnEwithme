import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudy } from '../app/StudyProvider'
import { clockLabel, dayKey } from '../features/discipline/activity'
import { useNow } from '../features/discipline/FocusTimer'
import { ReviewCard } from '../features/discipline/Review'
import { EarDrill } from '../features/ipa/EarDrill'
import { createSession } from '../features/practice/session'
import { StructureDrill } from '../features/structures/StructureDrill'
import { VerbDrill } from '../features/verbs/VerbDrill'

export default function Practice() {
  const { state, complete } = useStudy()
  const [session, setSession] = useState<ReturnType<typeof createSession>>([])
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
  function finish() {
    if (finished) return
    complete('practice', 15)
    setXpGained(totalXp - xpStart + 15)
    setFinished(true)
  }
  function next(correct?: boolean) {
    if (correct !== undefined) setAnswers(previous => [...previous, correct])
    setIndex(index + 1)
    if (index + 1 === session.length) finish()
  }
  function start(minutes: number) {
    const due = Object.values(state.cards).filter(card => card.due <= dayKey()).sort((a, b) => a.due.localeCompare(b.due))
    setSession(createSession(minutes, due))
    setIndex(0)
    setAnswers([])
    setXpStart(totalXp)
    setDeadline(Date.now() + minutes * 60_000)
    setFinished(false)
  }
  return <>
    <header className="page-head"><p className="overline">PHIÊN LUYỆN HẰNG NGÀY</p><h1>Luyện nhanh</h1><p>Ôn thẻ đến hạn, luyện nghe, động từ và biến đổi câu trong một phiên.</p><Link className="text-link" to="/practice/speaking">Luyện nói 4/3/2</Link></header>
    {!session.length && <div className="metrics">{[5, 15, 30].map(minutes => <section className="panel stack" key={minutes}>
      <h2>{minutes} phút</h2><button className="primary" onClick={() => start(minutes)}>Bắt đầu phiên {minutes} phút</button>
    </section>)}</div>}
    {session.length > 0 && !finished && step && <section className="panel stack">
      <div className="between"><h2>{{ review: 'Ôn thẻ đến hạn', ipa: 'Phân biệt âm', verb: 'Động từ', structure: 'Biến đổi câu' }[step.kind]}</h2><strong>{index + 1}/{session.length} · {clockLabel(remaining)}</strong></div>
      <progress value={index} max={session.length} aria-label="Tiến độ bài luyện" />
      {step.kind === 'review' && <ReviewCard key={index} card={step.card} onDone={() => next()} />}
      {step.kind === 'ipa' && <EarDrill key={index} pair={step.pair} done={next} />}
      {step.kind === 'verb' && <VerbDrill key={index} verb={step.verb} mode={index % 2 ? 'typing' : 'cloze'} done={next} />}
      {step.kind === 'structure' && <StructureDrill key={index} item={step.structure} done={next} />}
      <div className="row"><button onClick={() => next()}>Bỏ qua bước</button>{remaining === 0 && <button onClick={finish}>Kết thúc theo thời lượng</button>}</div>
    </section>}
    {finished && <section className="panel stack"><h2>Tổng kết phiên học</h2><p>{answers.filter(Boolean).length}/{answers.length} câu đã trả lời đúng · +{xpGained} XP</p>
      <div className="row"><Link className="button primary" to="/">Về trung tâm</Link><button onClick={() => setSession([])}>Chọn phiên mới</button></div>
    </section>}
  </>
}
