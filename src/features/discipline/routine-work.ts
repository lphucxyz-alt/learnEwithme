import type { StudyState } from '../../types/study'
import { dayKey, record } from './activity'
import { countWords } from './study-credit'

export type RoutineNote = 'new-words' | 'self-talk'
export type RoutineRecording = 'speak-432' | 'weekly-story'

export function saveRoutineNote(state: StudyState, task: RoutineNote, entries: [string, string], day = dayKey()): StudyState {
  const wordsInFirst = task === 'new-words' ? 4 : 2
  const first = entries[0].trim()
  const second = entries[1].trim()
  if (countWords(first) < wordsInFirst || countWords(second) < 4 || first.toLowerCase() === second.toLowerCase()) return state
  const evidence = state.routineWork[day] ?? {}
  if (evidence[task]) return state
  const credited = record(state, task === 'new-words' ? 'foundations' : 'practice', 5, 0, day)
  return { ...credited, routineWork: { ...state.routineWork, [day]: { ...evidence, [task]: [first, second] } } }
}

export function saveRoutineRecording(state: StudyState, task: RoutineRecording, seconds: number, day = dayKey()): StudyState {
  const evidence = state.routineWork[day] ?? {}
  if (evidence[task]) return state
  const credited = record(state, 'practice', 8, seconds, day)
  return { ...credited, routineWork: { ...state.routineWork, [day]: { ...evidence, [task]: seconds } } }
}
