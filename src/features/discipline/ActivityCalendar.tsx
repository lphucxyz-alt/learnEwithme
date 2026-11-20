import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { Card, Domain, StudyState } from '../../types/study'
import { formatVietnamDate, formatVietnamTime, isStudyDay, shiftDay, weekdayOf } from './activity'

const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const domainLabels: Record<Domain, string> = {
  foundations: 'Ngữ pháp',
  ipa: 'IPA',
  verbs: 'Động từ',
  structures: 'Cấu trúc',
  tests: 'Kho đề',
  review: 'Ôn thẻ',
  practice: 'Luyện nhanh',
  focus: 'Tập trung'
}

type Activity = StudyState['activity']
type CalendarRange = 12 | 53

function dayDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const extraSeconds = seconds % 60
  if (hours) return `${hours} giờ ${String(minutes).padStart(2, '0')} phút`
  if (minutes) return extraSeconds ? `${minutes} phút ${extraSeconds} giây` : `${minutes} phút`
  return `${extraSeconds} giây`
}

function dayLabel(day: string) {
  return formatVietnamDate(new Date(day + 'T12:00:00Z'), {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

function totalTurns(entry?: Activity[string]) {
  return Object.values(entry?.counts ?? {}).reduce((sum, count) => sum + count, 0)
}

function rangeStart(today: string, weeks: CalendarRange) {
  return shiftDay(today, -((weekdayOf(today) + 6) % 7) - (weeks - 1) * 7)
}

const CalendarGrid = memo(function CalendarGrid({ activity, protectedDays, today, selected, firstDay, weeks, chooseDay }: {
  activity: Activity
  protectedDays: Set<string>
  today: string
  selected: string
  firstDay: string
  weeks: CalendarRange
  chooseDay: (day: string) => void
}) {
  const scroll = useRef<HTMLDivElement>(null)
  const columns = useMemo(() => Array.from({ length: weeks }, (_, week) => {
    const days = Array.from({ length: 7 }, (_, offset) => shiftDay(firstDay, week * 7 + offset))
    const monthStart = days.find(day => day.endsWith('-01'))
    const monthDay = monthStart ?? (week === 0 ? days[0] : undefined)
    return {
      days: days.map(day => ({ day, label: dayLabel(day) })),
      month: monthDay ? formatVietnamDate(new Date(monthDay + 'T12:00:00Z'), { month: 'short' }) : ''
    }
  }), [firstDay, weeks])

  useEffect(() => {
    const container = scroll.current
    const active = container?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!container || !active) return
    const bounds = container.getBoundingClientRect()
    const cell = active.getBoundingClientRect()
    if (cell.left < bounds.left + 28 || cell.right > bounds.right - 4) {
      container.scrollLeft += cell.left - bounds.left - container.clientWidth / 2
    }
  }, [selected, weeks])

  return <div ref={scroll} className="activity-calendar-scroll" role="region" aria-label="Lịch hoạt động">
    <div className="activity-calendar-grid" data-range={weeks} style={{ '--weeks': weeks } as CSSProperties}>
      <div className="activity-calendar-column" aria-hidden="true">
        <span />
        {[...weekdays.slice(1), weekdays[0]].map(label => <span className="activity-weekday" key={label}>{label}</span>)}
      </div>
      {columns.map(({ days, month }) => <div className="activity-calendar-column" key={days[0].day}>
        <span className="activity-month" aria-hidden="true">{month}</span>
        {days.map(({ day, label }) => {
          const entry = activity[day]
          const xp = entry?.xp ?? 0
          const level = Math.min(4, Math.max(Math.ceil((entry?.seconds ?? 0) / 900), Math.ceil(xp / 15)))
          const shield = protectedDays.has(day)
          const description = `${label} · ${xp} XP · ${totalTurns(entry)} lượt${shield ? ' · Có khiên giữ chuỗi' : ''}`
          return day > today
            ? <span key={day} className="activity-calendar-future" aria-hidden="true" />
            : <button key={day} type="button" data-level={level} data-protected={shield} aria-label={description}
                aria-pressed={day === selected} title={description} onClick={() => chooseDay(day)} />
        })}
      </div>)}
    </div>
  </div>
})

function WeekChart({ activity, today, selected, chooseDay }: {
  activity: Activity
  today: string
  selected: string
  chooseDay: (day: string) => void
}) {
  const days = Array.from({ length: 7 }, (_, index) => shiftDay(today, index - 6))
  const total = days.reduce((sum, day) => sum + (activity[day]?.xp ?? 0), 0)
  const maximum = Math.max(1, ...days.map(day => activity[day]?.xp ?? 0))
  const activeDays = days.filter(day => isStudyDay(activity[day])).length

  return <div className="weekly-study stack">
    <div className="between">
      <h3>7 ngày gần nhất</h3>
      <span className="pill">{activeDays}/7 ngày học</span>
    </div>
    <div className="weekly-chart" role="group" aria-label="Điểm XP trong 7 ngày gần nhất">
      {days.map(day => {
        const xp = activity[day]?.xp ?? 0
        return <button key={day} type="button" className="weekly-chart-day" aria-pressed={day === selected}
          aria-label={`${dayLabel(day)} · ${xp} XP`} onClick={() => chooseDay(day)}>
          <span className="weekly-chart-track" aria-hidden="true">
            <span className="weekly-chart-bar" data-empty={xp === 0} style={{ height: `${xp / maximum * 100}%` }} />
          </span>
          <span>{day === today ? 'Nay' : weekdays[weekdayOf(day)]}</span>
        </button>
      })}
    </div>
    <small>{total > 0 ? <><strong>{total} XP</strong> trong 7 ngày · Chọn một cột để xem chi tiết</> : 'Biểu đồ sẽ ghi nhận XP sau lượt học đầu tiên.'}</small>
  </div>
}

function ReviewSummary({ due }: { due: Card[] }) {
  const counts = Object.entries(due.reduce<Partial<Record<Domain, number>>>((totals, card) => {
    totals[card.domain] = (totals[card.domain] ?? 0) + 1
    return totals
  }, {})).sort((a, b) => b[1] - a[1])

  return <div className="activity-review">
    <div className="stack">
      <h3>{due.length ? `${due.length} thẻ đến hạn ôn` : 'Sổ ôn tập'}</h3>
      {due.length > 0 ? <small>{counts.map(([domain, count]) => `${domainLabels[domain as Domain]} ${count}`).join(' · ')}</small>
        : <small>Hôm nay chưa có thẻ đến hạn.</small>}
    </div>
    {due.length > 0 && <button type="button" onClick={() => {
      const review = document.getElementById('review-bank')
      review?.focus({ preventScroll: true })
      review?.scrollIntoView({ block: 'start' })
    }}>Ôn ngay</button>}
  </div>
}

export function ActivityCalendar({ activity, protectedDays, due, today, now }: {
  activity: Activity
  protectedDays: Set<string>
  due: Card[]
  today: string
  now: number
}) {
  const [weeks, setWeeks] = useState<CalendarRange>(12)
  const [chosenDay, chooseDay] = useState<string>()
  const firstDay = rangeStart(today, weeks)
  const selected = chosenDay && chosenDay >= firstDay && chosenDay <= today ? chosenDay : today
  const entry = activity[selected]

  return <section className="panel study-insights" aria-labelledby="activity-calendar-title">
    <div className="activity-calendar-heading">
      <div>
        <h2 id="activity-calendar-title">Lịch học</h2>
        <p className="muted">{dayLabel(today)} · <time className="vietnam-clock" dateTime={new Date(now).toISOString()}>{formatVietnamTime(new Date(now))}</time> giờ Việt Nam (GMT+7)</p>
      </div>
      <label className="activity-range">Xem
        <select className="heatmap-select" aria-label="Khoảng thời gian lịch học" value={weeks} onChange={event => {
          const range = Number(event.target.value) as CalendarRange
          if (selected < rangeStart(today, range)) chooseDay(undefined)
          setWeeks(range)
        }}>
          <option value={12}>12 tuần</option>
          <option value={53}>1 năm</option>
        </select>
      </label>
    </div>

    <div className="study-insights-grid">
      <div className="activity-calendar-main stack">
        <CalendarGrid {...{ activity, protectedDays, today, selected, firstDay, weeks, chooseDay }} />
        <div className="activity-calendar-legend" aria-label="Cường độ theo thời gian học và XP">
          <span>Ít</span>{[0, 1, 2, 3, 4].map(level => <i key={level} data-level={level} />)}<span>Nhiều</span>
          {protectedDays.size > 0 && <small>Viền tím bên trong đánh dấu ngày có khiên</small>}
        </div>

        <div className="activity-calendar-summary">
          <div className="activity-selected-day">
            <strong>{selected === today ? 'Hôm nay' : dayLabel(selected)}</strong>
            {protectedDays.has(selected) && <span className="pill">Có khiên</span>}
            <label className="activity-day-picker">
              <span>Chọn ngày</span>
              <input type="date" min={firstDay} max={today} value={selected} onChange={event => {
                if (event.currentTarget.value && event.currentTarget.validity.valid) chooseDay(event.currentTarget.value)
              }} />
            </label>
          </div>
          <div className="activity-stat-list" aria-live="polite">
            <span><strong>{dayDuration(entry?.seconds ?? 0)}</strong><small>đã ghi nhận</small></span>
            <span><strong>{entry?.xp ?? 0} XP</strong><small>điểm học tập</small></span>
            <span><strong>{totalTurns(entry)}</strong><small>lượt hoạt động</small></span>
          </div>
        </div>
      </div>

      <div className="study-insights-side">
        <WeekChart {...{ activity, today, selected, chooseDay }} />
        <ReviewSummary due={due} />
      </div>
    </div>
  </section>
}
