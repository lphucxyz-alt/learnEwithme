import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useStudy } from '../app/StudyProvider'
import { dayKey, shiftDay, streaks, clockLabel } from '../features/discipline/activity'
import { useNow } from '../features/discipline/FocusTimer'
import { ReviewCard } from '../features/discipline/Review'
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
  const { current, longest, shields } = streaks(state.activity, today)
  const due = Object.values(state.cards).filter(card => card.due <= today).sort((a,b) => a.due.localeCompare(b.due))
  const rituals = [
    { domain: 'ipa', title: 'Luyện phân biệt âm IPA', total: 5 },
    { domain: 'verbs', title: 'Ôn động từ bất quy tắc', total: 10 },
    { domain: 'structures', title: 'Biến đổi câu IELTS', total: 3 },
    { domain: 'practice', title: 'Hoàn thành phiên luyện nhanh', total: 1 }
  ] as const
  const mondayOffset = (new Date(today + 'T12:00:00').getDay() + 6) % 7
  const start = shiftDay(today, -mondayOffset - (weeks - 1) * 7)
  const detail = state.activity[selected ?? today]
  return <>
    <header className="hero">
      <div><p className="overline">{new Intl.DateTimeFormat('vi', { weekday: 'long', month: 'long', day: 'numeric' }).format(now)}</p>
      <h1>Trung tâm kỷ luật</h1><p>Tập trung vào bước tiếp theo trên đường đến band {state.targetBand.toFixed(1)}.</p></div>
      <Link className="button primary" to="/practice">Bắt đầu luyện</Link>
    </header>
    <div className="metrics">
      <section className="panel"><span>Chuỗi hiện tại</span><strong>{current} ngày</strong><small>Kỷ lục {longest} ngày</small></section>
      <section className="panel"><span>XP hôm nay</span><strong>{activity?.xp ?? 0} XP</strong><small>{Math.floor((activity?.seconds ?? 0) / 60)} phút tập trung</small></section>
      <section className="panel"><span>Khiên bảo vệ</span><strong>{shields}</strong><small>Còn {Math.floor(left / 3600)}:{clockLabel(left % 3600)} trong ngày</small></section>
    </div>
    <section className="panel stack">
      <div className="between"><h2>Lịch hoạt động</h2><select aria-label="Khoảng thời gian" value={weeks} onChange={event => setWeeks(Number(event.target.value))}><option value={12}>12 tuần</option><option value={53}>Một năm</option></select></div>
      <div className="heat-scroll"><div className="heatmap">{Array.from({ length: weeks * 7 }, (_, index) => {
        const day = shiftDay(start, index)
        const xp = state.activity[day]?.xp ?? 0
        return <button key={day} type="button" disabled={day > today} data-level={Math.min(4, Math.ceil(xp / 12))} aria-label={day + ' · ' + xp + ' XP'} title={day + ' · ' + xp + ' XP'} onClick={() => setSelected(day)} />
      })}</div></div>
      <p className="muted">{selected ?? today} · {detail?.xp ?? 0} XP · {Math.floor((detail?.seconds ?? 0) / 60)} phút · {Object.values(detail?.counts ?? {}).reduce((a,b) => a+b, 0)} lượt</p>
    </section>
    <div className="split">
      <section className="panel stack"><h2>Nhiệm vụ hằng ngày</h2>{rituals.map(ritual => {
        const count = activity?.counts[ritual.domain] ?? 0
        return <Link key={ritual.domain} className="quest" to={'/' + ritual.domain}>
          <span>{count >= ritual.total ? '✓' : '○'} {ritual.title}</span><strong>{Math.min(count, ritual.total)}/{ritual.total}</strong>
        </Link>
      })}</section>
      <section className="panel stack"><h2>Sổ tay lỗi sai <span className="pill">{due.length} đến hạn</span></h2>
        {due[0] ? <ReviewCard key={due[0].id} card={due[0]} /> : <p className="muted">Hôm nay bạn đã ôn hết các thẻ đến hạn.</p>}
        <details><summary>Tất cả thẻ ({Object.keys(state.cards).length})</summary><ul>{Object.values(state.cards).map(card =>
          <li key={card.id}>{card.prompt} · {card.due}</li>)}</ul></details>
      </section>
    </div>
    <FluencyPlan weekday={new Date(now).getDay()} />
  </>
}
