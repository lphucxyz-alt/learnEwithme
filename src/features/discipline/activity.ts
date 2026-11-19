import type { Domain, StudyState } from '../../types/study'

export function dayKey(date = new Date()) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(value => String(value).padStart(2, '0')).join('-')
}

export function shiftDay(day: string, offset: number) {
  const date = new Date(day + 'T12:00:00')
  date.setDate(date.getDate() + offset)
  return dayKey(date)
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
