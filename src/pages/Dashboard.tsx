import { Link } from 'react-router-dom'
import { useStudy } from '../app/StudyProvider'
import { dayKey, shiftDay, streaks, clockLabel, secondsUntilVietnamMidnight, weekdayOf } from '../features/discipline/activity'
import { useNow } from '../features/discipline/FocusTimer'
import { ActivityCalendar } from '../features/discipline/ActivityCalendar'
import { ReviewCard } from '../features/discipline/Review'
import { StreakCard } from '../features/discipline/StreakCard'
import { getStudyPlan } from '../features/discipline/study-plan'
import { FluencyPlan } from '../features/discipline/FluencyPlan'
import { EmptyStateCard, OnboardingWelcomeCard } from '../components/EmptyState'

export default function Dashboard() {
  const { state } = useStudy()
  const now = useNow()
  const today = dayKey(new Date(now))
  const left = secondsUntilVietnamMidnight(now)
  const activity = state.activity[today]
  const plan = getStudyPlan(state)
  const { current, longest, shields, protectedDays, studiedToday } = streaks(state.activity, today)
  const due = Object.values(state.cards)
    .filter(card => card.due <= today)
    .sort((a, b) => a.due.localeCompare(b.due))
  const progressPct = plan.basicsTotal > 0 ? Math.round((plan.basicsDone / plan.basicsTotal) * 100) : 0
  const foundationsCount = Math.min(activity?.counts.foundations ?? 0, 3)
  const practiceCount = Math.min(activity?.counts.practice ?? 0, 1)
  const isBrandNew = Object.keys(state.activity).length === 0 && Object.keys(state.cards).length === 0

  return (
    <div className="dashboard-view">
      <header className="hero hero-study">
        <div className="hero-intro">
          <p className="overline">MỤC TIÊU IELTS {state.targetBand.toFixed(1)}</p>
          <h1>Trung tâm kỷ luật</h1>
          <p className="hero-subtitle">
            Học chắc câu cơ bản, luyện ngắn mỗi ngày, rồi làm quen với đề IELTS.
          </p>
        </div>

        <section className="next-study">
          <div className="stack">
            <h2 className="next-study-eyebrow">⚡ BƯỚC TIẾP THEO HÔM NAY</h2>
            <p className="next-study-title">{plan.title}</p>
            <p className="next-study-detail">{plan.detail}</p>
          </div>
          <Link className="button primary" to={plan.path} style={{ fontSize: '0.95rem', padding: '0.7rem 1.1rem' }}>
            Bắt đầu học: {plan.label} →
          </Link>
        </section>
      </header>

      <FluencyPlan weekday={weekdayOf(today)} dateKey={today} />

      {isBrandNew && <OnboardingWelcomeCard />}

      <section className="panel study-path">
        <div className="stack">
          <div className="study-path-meta">
            <h2>Lộ trình 6.5</h2>
            <span className="study-path-pct">{progressPct}%</span>
          </div>
          <small className="metric-sub">
            {plan.basicsDone}/{plan.basicsTotal} chủ điểm cốt lõi đạt ít nhất 65%
          </small>
          <progress
            aria-label="Tiến độ chủ điểm cốt lõi"
            value={plan.basicsDone}
            max={plan.basicsTotal}
          />
        </div>
        <div className="row">
          <Link className="button" to="/foundations">Nền tảng</Link>
          <Link className="button" to="/practice">Luyện 5 phút</Link>
          <Link className="button" to="/tests">Đề làm quen</Link>
        </div>
      </section>

      <div className="metrics">
        <StreakCard
          days={current}
          longest={longest}
          studied={studiedToday}
          protectedYesterday={protectedDays.has(shiftDay(today, -1))}
        />
        <section className="panel metric-card">
          <span className="metric-label">XP hôm nay</span>
          <strong className="metric-value">{activity?.xp ?? 0} XP</strong>
          <small className="metric-sub">
            {Math.floor((activity?.seconds ?? 0) / 60)} phút tập trung
          </small>
        </section>
        <section className="panel metric-card">
          <div>
            <span className="metric-label">Khiên bảo vệ</span>
            <strong className="metric-value">{shields}</strong>
            <small className="metric-sub">
              Còn {Math.floor(left / 3600)}:{clockLabel(left % 3600)} trong ngày
            </small>
          </div>
          <small className="metric-hint">
            Mỗi 7 ngày học liền nhận 1 khiên. Khiên giữ được một ngày nghỉ trong mỗi lần gián đoạn.
          </small>
        </section>
      </div>

      <ActivityCalendar activity={state.activity} protectedDays={protectedDays} today={today} now={now} />

      <div className="split">
        <section className="panel stack">
          <h2>Hôm nay</h2>
          <div className="quest-list">
            <Link className="quest" to="/foundations" data-done={foundationsCount >= 3}>
              <span>Học 3 câu ngữ pháp</span>
              <strong>{foundationsCount}/3</strong>
            </Link>
            <Link className="quest" to="/practice" data-done={practiceCount >= 1}>
              <span>Làm một lượt luyện ngắn</span>
              <strong>{practiceCount}/1</strong>
            </Link>
          </div>
        </section>

        <section className="panel stack">
          <div className="between">
            <h2>
              Sổ tay lỗi sai <span className="pill">{due.length} đến hạn</span>
            </h2>
            <Link className="text-link" to="/coach">
              Nhận xét AI đã lưu
            </Link>
          </div>
          <small className="muted" style={{ marginTop: '-0.3rem' }}>
            Hệ thống SM-2 tự động nhắc lại những câu bạn từng làm sai đúng lúc não bộ sắp quên.
          </small>

          {Object.keys(state.cards).length === 0 ? (
            <EmptyStateCard
              badge="Sổ tay sạch tinh"
              title="Chưa có lỗi sai nào được lưu"
              description="Mỗi khi làm sai ở phần Nền tảng hoặc Luyện ngắn, thẻ ôn tập SM-2 sẽ tự động xuất hiện tại đây."
              actionLabel="Bắt đầu luyện 5 phút"
              actionTo="/practice"
            />
          ) : due[0] ? (
            <ReviewCard key={due[0].id} card={due[0]} />
          ) : (
            <p className="muted">Hôm nay bạn đã ôn hết các thẻ đến hạn.</p>
          )}

          {Object.keys(state.cards).length > 0 && (
            <details className="cards-disclosure">
              <summary>Tất cả thẻ ({Object.keys(state.cards).length})</summary>
              <ul>
                {Object.values(state.cards).map(card => (
                  <li key={card.id}>
                    {card.prompt}
                    <span>{card.due}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      </div>
    </div>
  )
}
