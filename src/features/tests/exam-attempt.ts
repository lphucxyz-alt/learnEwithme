import type { Exam } from '../../types/exam'
import type { Draft, StudyState } from '../../types/study'
import { seedCard } from '../../services/srs.ts'
import { dayKey, record } from '../discipline/activity.ts'
import { countWords, hasAnswer, hasExamCredit } from '../discipline/study-credit.ts'
import { scoreExam } from './scoring.ts'

export function hasExamResponse(exam: Exam, answers: Draft['answers']) {
  switch (exam.skill) {
    case 'Reading':
    case 'Listening':
      return exam.questions.some(question => hasAnswer(answers[question.id]))
    case 'Writing':
      return exam.tasks.some((_, index) => countWords(answers['task-' + index] ?? '') > 0)
    case 'Speaking':
      return exam.parts.some((_, index) => Number(answers['part-' + (index + 1)]) > 0)
  }
}

export function finishExam(state: StudyState, exam: Exam, options: {
  attemptId: string; now: number; deadline: number; additionalMs?: number
}): StudyState {
  const draft = state.drafts[exam.id]
  if (!draft || draft.deadline !== options.deadline) return state
  const credited = hasExamCredit(exam, draft.answers)
  if (!credited && options.now < draft.deadline) return state

  const drafts = { ...state.drafts }
  delete drafts[exam.id]
  if (!hasExamResponse(exam, draft.answers)) return { ...state, drafts }

  const ended = new Date(Math.min(options.now, draft.deadline))
  const day = dayKey(ended)
  const activeMs = Math.min(exam.seconds * 1000, (draft.activeMs ?? 0) + (options.additionalMs ?? 0))
  const { score, total, errors } = scoreExam(exam, draft)
  const cards = { ...state.cards }
  if (credited) {
    for (const error of errors) cards[error.id] = { ...seedCard(error, cards[error.id]), due: day }
  }
  const updated = credited ? record(state, 'tests', 15 + (score ?? 0) * 3, Math.floor(activeMs / 1000), day) : state
  const attempt = { id: options.attemptId, examId: exam.id, at: ended.toISOString(), score, total, draft: { ...draft, activeMs } }
  const attempts = [attempt, ...updated.attempts].sort((a, b) => b.at.localeCompare(a.at))
  return { ...updated, drafts, cards, attempts }
}
