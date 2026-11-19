import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useStudy } from '../app/StudyProvider'
import { dayKey, shiftDay, streaks, clockLabel } from '../features/discipline/activity'
import { useNow } from '../features/discipline/FocusTimer'
import { ReviewCard } from '../features/discipline/Review'
import { StreakCard } from '../features/discipline/StreakCard'
import { getStudyPlan } from '../features/discipline/study-plan'
import { FluencyPlan } from '../features/discipline/FluencyPlan'

export default function Dashboard() {
  const { state } = useStudy()
  const now = useNow()
  const today = dayKey(new Date(now))
  const tomorrow = new Date(now)
  tomorrow.setHours(24, 0, 0, 0)
  const left = Math.max(0, Math.floor((tomorrow.getTime() - now) / 1000))
  const [weeks, setWeeks] = useState(12)
  const [selected, setSelected] = useState<string | null>(null)
  const activity = state.activity[today]
  const plan = getStudyPlan(state)
  const { current, longest, shields, protectedDays, studiedToday } = streaks(state.activity, today)
  const due = Object.values(state.cards).filter(card => card.due <= today).sort((a,b) => a.due.localeCompare(b.due))
  const mondayOffset = (new Date(today + 'T12:00:00').getDay() + 6) % 7
  const start = shiftDay(today, -mondayOffset - (weeks - 1) * 7)
  const detail = state.activity[selected ?? today]
  return <>
    <header className="hero hero-study">
      <div><p className="overline">MỤC TIÊU IELTS {state.targetBand.toFixed(1)}</p>
      <h1>Trung tâm kỷ luật</h1><p>Học chắc câu cơ bản, luyện ngắn mỗi ngày, rồi làm quen với đề IELTS.</p></div>
      <section className="next-study stack">
        <h2>Bài nên làm tiếp</h2>
        <p><strong>{plan.title}</strong></p>
        <p>{plan.detail}</p>
        <Link className="button primary" to={plan.path}>{plan.label}</Link>
      </section>
    </header>
    <section className="panel study-path">
      <div className="stack"><h2>Lộ trình 6.5</h2>
        <small>{plan.basicsDone}/{plan.basicsTotal} chủ điểm cốt lõi đạt ít nhất 65%</small>
        <progress aria-label="Tiến độ chủ điểm cốt lõi" value={plan.basicsDone} max={plan.basicsTotal} />
      </div>
      <div className="row"><Link className="button" to="/foundations">Nền tảng</Link><Link className="button" to="/practice">Luyện 5 phút</Link><Link className="button" to="/tests">Đề làm quen</Link></div>
    </section>
    <div className="metrics">
      <StreakCard days={current} longest={longest} studied={studiedToday} protectedYesterday={protectedDays.has(shiftDay(today, -1))} />
      <section className="panel"><span>XP hôm nay</span><strong>{activity?.xp ?? 0} XP</strong><small>{Math.floor((activity?.seconds ?? 0) / 60)} phút tập trung</small></section>
      <section className="panel"><span>Khiên bảo vệ</span><strong>{shields}</strong><small>Còn {Math.floor(left / 3600)}:{clockLabel(left % 3600)} trong ngày</small><small>Mỗi 7 ngày học liền nhận 1 khiên. Khiên giữ được một ngày nghỉ trong mỗi lần gián đoạn.</small></section>
    </div>
    <section className="panel stack">
      <div className="between"><h2>Lịch hoạt động</h2><select aria-label="Khoảng thời gian" value={weeks} onChange={event => setWeeks(Number(event.target.value))}><option value={12}>12 tuần</option><option value={53}>Một năm</option></select></div>
      <div className="heat-scroll"><div className="heatmap">{Array.from({ length: weeks * 7 }, (_, index) => {
        const day = shiftDay(start, index)
        const xp = state.activity[day]?.xp ?? 0
        const label = day + ' · ' + xp + ' XP' + (protectedDays.has(day) ? ' · Được khiên bảo vệ' : '')
        return <button key={day} type="button" disabled={day > today} data-level={Math.min(4, Math.ceil(xp / 12))} data-protected={protectedDays.has(day)} aria-label={label} title={label} onClick={() => setSelected(day)} />
      })}</div></div>
      <p className="muted">{selected ?? today}{protectedDays.has(selected ?? today) && ' · Được khiên bảo vệ'} · {detail?.xp ?? 0} XP · {Math.floor((detail?.seconds ?? 0) / 60)} phút · {Object.values(detail?.counts ?? {}).reduce((a,b) => a+b, 0)} lượt</p>
    </section>
    <div className="split">
      <section className="panel stack"><h2>Hôm nay</h2>
        <Link className="quest" to="/foundations"><span>Học 3 câu ngữ pháp</span><strong>{Math.min(activity?.counts.foundations ?? 0, 3)}/3</strong></Link>
        <Link className="quest" to="/practice"><span>Làm một lượt luyện ngắn</span><strong>{Math.min(activity?.counts.practice ?? 0, 1)}/1</strong></Link>
      </section>
      <section className="panel stack"><h2>Sổ tay lỗi sai <span className="pill">{due.length} đến hạn</span></h2>
        {due[0] ? <ReviewCard key={due[0].id} card={due[0]} /> : <p className="muted">Hôm nay bạn đã ôn hết các thẻ đến hạn.</p>}
        <details><summary>Tất cả thẻ ({Object.keys(state.cards).length})</summary><ul>{Object.values(state.cards).map(card =>
          <li key={card.id}>{card.prompt} · {card.due}</li>)}</ul></details>
      </section>
    </div>
    <FluencyPlan weekday={new Date(now).getDay()} />
  </>
}
