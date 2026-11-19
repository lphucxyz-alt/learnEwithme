import { examSchema, type Exam, type Question } from '../../types/exam'
import type { CardSeed, Draft } from '../../types/study'

const modules = import.meta.glob<unknown>('../../data/tests/*.json', { eager: true, import: 'default' })
export const exams = Object.values(modules).map(source => examSchema.parse(source))
if (new Set(exams.map(exam => exam.id)).size !== exams.length) throw new Error('Duplicate exam ID')

export function questionsOf(exam: Exam): Question[] {
  return exam.skill === 'Reading' || exam.skill === 'Listening' ? exam.questions : []
}

export function evidence(exam: Exam, index: number) {
  if (exam.skill === 'Reading') return exam.paragraphs[index]
  if (exam.skill === 'Listening') return exam.turns[index].text
  return ''
}

function normalize(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '')
}

export function matches(question: Question, value: string) {
  return question.answers.some(answer => normalize(answer) === normalize(value))
}

export function scoreExam(exam: Exam, draft: Draft) {
  const questions = questionsOf(exam)
  const wrong = questions.filter(question => !matches(question, draft.answers[question.id] ?? ''))
  const errors: CardSeed[] = wrong.map(question => ({
    id: 'exam:' + exam.id + ':' + question.id, domain: 'tests', prompt: question.prompt,
    answer: question.answers[0] + ' · ' + question.explanation + ' · ' + evidence(exam, question.evidence)
  }))
  return { score: questions.length ? questions.length - wrong.length : null, total: questions.length, errors }
}

export function bandEstimate(score: number, total: number) {
  const fraction = score / total
  const thresholds = [[0.975,9],[0.925,8.5],[0.875,8],[0.8,7.5],[0.75,7],[0.675,6.5],[0.575,6],[0.475,5.5],[0.375,5],[0.3,4.5],[0.25,4]]
  return thresholds.find(([threshold]) => fraction >= threshold)?.[1].toFixed(1) ?? '<4'
}
