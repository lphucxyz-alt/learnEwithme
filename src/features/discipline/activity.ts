import type { Domain, StudyState } from '../../types/study'

export const STUDY_TIME_ZONE = 'Asia/Ho_Chi_Minh'

export function dayKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: STUDY_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export function shiftDay(day: string, offset: number) {
  const date = new Date(day + 'T12:00:00Z')
  date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().slice(0, 10)
}

export function weekdayOf(day: string) {
  return new Date(day + 'T12:00:00Z').getUTCDay()
}

export function formatVietnamDate(date: Date, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('vi-VN', { timeZone: STUDY_TIME_ZONE, ...options }).format(date)
}

export function formatVietnamTime(date: Date) {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: STUDY_TIME_ZONE, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).format(date)
}

export function secondsUntilVietnamMidnight(now: number) {
  const today = dayKey(new Date(now))
  const tomorrowUtc = Date.parse(shiftDay(today, 1) + 'T00:00:00Z')
  return Math.max(0, Math.floor((tomorrowUtc - now) / 1000) - 7 * 60 * 60)
}

export function isStudyDay(entry?: StudyState['activity'][string]) {
  return entry?.qualified ?? Boolean(entry && Object.values(entry.counts).some(count => count > 0))
}

export function record(state: StudyState, domain: Domain, xp: number, seconds = 0, day = dayKey(), qualifies = true): StudyState {
  const entry = state.activity[day] ?? { xp: 0, seconds: 0, counts: {} }
  return { ...state, activity: { ...state.activity, [day]: {
    xp: entry.xp + xp, seconds: entry.seconds + seconds,
    counts: { ...entry.counts, [domain]: (entry.counts[domain] ?? 0) + 1 },
    qualified: qualifies || isStudyDay(entry)
  } } }
}

export function streaks(activity: StudyState['activity'], today: string) {
  const days = Object.keys(activity).filter(day => day <= today && isStudyDay(activity[day])).sort()
  let longest = 0
  let current = 0
  let shields = 0
  let studyRun = 0
  let previous = ''
  const protectedDays = new Set<string>()
  function coverGap(next: string) {
    if (!previous || next === shiftDay(previous, 1)) return
    studyRun = 0
    if (shields > 0) {
      shields--
      protectedDays.add(shiftDay(previous, 1))
      current++
      longest = Math.max(longest, current)
      if (next === shiftDay(previous, 2)) return
    }
    current = 0
  }
  for (const day of days) {
    coverGap(day)
    current++
    studyRun++
    if (studyRun % 7 === 0) shields++
    longest = Math.max(longest, current)
    previous = day
  }
  if (previous && previous < shiftDay(today, -1)) coverGap(today)
  return { current, longest, shields, protectedDays, studiedToday: previous === today }
}

export function clockLabel(seconds: number) {
  return [Math.floor(seconds / 60), seconds % 60].map(value => String(value).padStart(2, '0')).join(':')
}
