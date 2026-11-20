import { useEffect, useState } from 'react'
import type { StudyState } from '../../types/study'
import { formatVietnamDate, formatVietnamTime, shiftDay, weekdayOf } from './activity'

const weekdayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

function dayDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const extraSeconds = seconds % 60
  if (hours) return `${hours} giờ ${String(minutes).padStart(2, '0')} phút`
  if (minutes) return extraSeconds ? `${minutes} phút ${extraSeconds} giây` : `${minutes} phút`
  return `${extraSeconds} giây`
}

export function ActivityCalendar({ activity, protectedDays, today, now }: {
  activity: StudyState['activity']
  protectedDays: Set<string>
  today: string
  now: number
}) {
  const [weeks, setWeeks] = useState(12)
  const [selected, setSelected] = useState(today)
  useEffect(() => setSelected(today), [today])

  const firstDay = shiftDay(today, -((weekdayOf(today) + 6) % 7) - (weeks - 1) * 7)
  const weekStarts = Array.from({ length: weeks }, (_, index) => shiftDay(firstDay, index * 7))
  const calendarDays = weekStarts.flatMap(start => Array.from({ length: 7 }, (_, index) => shiftDay(start, index)))
  const monthLabels = weekStarts.map((weekStart, index) => {
    const firstDayOfMonth = Array.from({ length: 7 }, (_, dayIndex) => shiftDay(weekStart, dayIndex))
      .find(day => day.slice(0, 7) !== shiftDay(day, -1).slice(0, 7))
    if (!firstDayOfMonth && index !== 0) return ''
    const monthDate = new Date((firstDayOfMonth ?? weekStart) + 'T12:00:00Z')
    return formatVietnamDate(monthDate, { month: 'short' })
  })
  const selectedEntry = activity[selected]
  const selectedTurns = Object.values(selectedEntry?.counts ?? {}).reduce((sum, count) => sum + count, 0)
  const todayLabel = formatVietnamDate(new Date(now), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const selectedLabel = formatVietnamDate(new Date(selected + 'T12:00:00Z'), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return <section className="panel stack heatmap-panel activity-calendar-panel" aria-labelledby="activity-calendar-title">
    <div className="activity-calendar-heading">
      <div>
        <p className="overline">NHỊP HỌC CỦA BẠN</p>
        <h2 id="activity-calendar-title">Lịch học</h2>
        <p className="muted">Hôm nay là {todayLabel} · giờ Việt Nam <strong className="vietnam-clock">{formatVietnamTime(new Date(now))}</strong> (GMT+7)</p>
      </div>
      <label className="activity-range">Xem
        <select className="heatmap-select" aria-label="Khoảng thời gian lịch học" value={weeks} onChange={event => setWeeks(Number(event.target.value))}>
          <option value={12}>12 tuần</option>
          <option value={53}>1 năm</option>
        </select>
      </label>
    </div>

    <div className="activity-calendar-scroll" role="region" aria-label="Lịch hoạt động, cuộn ngang để xem các tuần">
      <div className="activity-months" style={{ gridTemplateColumns: `2.35rem repeat(${weeks}, 1rem)` }}>
        <span aria-hidden="true" />
        {monthLabels.map((month, index) => <span key={weekStarts[index]}>{month}</span>)}
      </div>
      <div className="activity-calendar-chart">
        <div className="activity-weekdays" aria-hidden="true">{weekdayLabels.map(label => <span key={label}>{label}</span>)}</div>
        <div className="activity-calendar-cells" style={{ gridTemplateColumns: `repeat(${weeks}, 1rem)` }}>
          {calendarDays.map(day => {
            const entry = activity[day]
            const dayTurns = Object.values(entry?.counts ?? {}).reduce((sum, count) => sum + count, 0)
            const xp = entry?.xp ?? 0
            const level = Math.min(4, Math.max(Math.ceil((entry?.seconds ?? 0) / 900), Math.ceil(xp / 15)))
            const title = `${formatVietnamDate(new Date(day + 'T12:00:00Z'), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${dayDuration(entry?.seconds ?? 0)} học · ${xp} XP · ${dayTurns} lượt${protectedDays.has(day) ? ' · Khiên bảo vệ streak' : ''}`
            return <button
              key={day}
              type="button"
              disabled={day > today}
              data-level={level}
              data-protected={protectedDays.has(day)}
              data-selected={day === selected}
              aria-label={title}
              aria-pressed={day === selected}
              title={title}
              onClick={() => setSelected(day)}
            />
          })}
        </div>
      </div>
    </div>

    <div className="activity-calendar-summary">
      <div className="activity-selected-day">
        <strong>{selectedLabel}</strong>
        {selected === today && <span className="pill">Hôm nay</span>}
        {protectedDays.has(selected) && <span className="pill">Khiên giữ chuỗi</span>}
      </div>
      <div className="activity-stat-list">
        <span><strong>{dayDuration(selectedEntry?.seconds ?? 0)}</strong><small>thời gian tập trung</small></span>
        <span><strong>{selectedEntry?.xp ?? 0} XP</strong><small>điểm học tập</small></span>
        <span><strong>{selectedTurns}</strong><small>lượt hoàn thành</small></span>
      </div>
      <div className="activity-calendar-legend" aria-label="Cường độ dựa trên thời gian học">
        <span>Ít</span>{[0, 1, 2, 3, 4].map(level => <i key={level} data-level={level} />)}<span>Nhiều</span>
        <small>Mỗi ô là một ngày · viền tím đánh dấu ngày có khiên</small>
      </div>
    </div>
  </section>
}
