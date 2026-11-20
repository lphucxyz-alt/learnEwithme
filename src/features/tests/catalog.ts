import { examSchema, type Question } from '../../types/exam'
import { shuffle } from '../../services/random'

const modules = import.meta.glob<unknown>('../../data/tests/*.json', { eager: true, import: 'default' })
export const exams = Object.values(modules).map(source => examSchema.parse(source))
if (new Set(exams.map(exam => exam.id)).size !== exams.length) throw new Error('Duplicate exam ID')

export function examChoices(question: Question, deadline: number) {
  if (question.kind === 'tfng') return ['True', 'False', 'Not Given']
  if (!question.choices) return []
  let seed = deadline | 0
  for (const character of question.id) seed = Math.imul(seed ^ character.charCodeAt(0), 0x01000193)
  return shuffle(question.choices, () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 0x100000000
  })
}

export { bandEstimate, evidence, matches, questionsOf } from './scoring'
