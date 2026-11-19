import type { Domain, StudyState } from '../../types/study'

export function dayKey(date = new Date()) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(value => String(value).padStart(2, '0')).join('-')
}

export function shiftDay(day: string, offset: number) {
  const date = new Date(day + 'T12:00:00')
  date.setDate(date.getDate() + offset)
  return dayKey(date)
}

export function record(state: StudyState, domain: Domain, xp: number, seconds = 0, day = dayKey()): StudyState {
  const entry = state.activity[day] ?? { xp: 0, seconds: 0, counts: {} }
  return { ...state, activity: { ...state.activity, [day]: {
    xp: entry.xp + xp, seconds: entry.seconds + seconds,
    counts: { ...entry.counts, [domain]: (entry.counts[domain] ?? 0) + 1 }
  } } }
}

export function streaks(activity: StudyState['activity'], today: string) {
  const days = Object.keys(activity).filter(day => day <= today).sort()
  let longest = 0
  let current = 0
  let shields = 0
  let weekly = 0
  let previousWeek = ''
  let previous = ''
  for (const day of days) {
    const weekday = new Date(day + 'T12:00:00').getDay()
    const week = shiftDay(day, -((weekday + 6) % 7))
    if (week !== previousWeek) {
      weekly = 0
      previousWeek = week
    }
    weekly++
    if (previous && shiftDay(previous, 1) !== day) {
      if (shields > 0 && shiftDay(previous, 2) === day) shields--
      else current = 0
    }
    current++
    if (weekly === 7) shields++
    longest = Math.max(longest, current)
    previous = day
  }
  if (previous && previous < shiftDay(today, -1)) {
    if (previous === shiftDay(today, -2) && shields > 0) shields--
    else current = 0
  }
  return { current, longest, shields }
}

export function clockLabel(seconds: number) {
  return [Math.floor(seconds / 60), seconds % 60].map(value => String(value).padStart(2, '0')).join(':')
}
