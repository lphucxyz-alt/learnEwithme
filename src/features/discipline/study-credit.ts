import type { Exam } from '../../types/exam'
import type { Draft } from '../../types/study'

export function minimumWork(total: number) {
  return Math.ceil(total / 2)
}

export function countWords(text: string) {
  return (text.match(/\p{L}+(?:['’\u002d]\p{L}+)*/gu) ?? []).length
}

export const speakingPartMinimumSeconds = 30

export function hasAnswer(text = '') {
  return /[\p{L}\p{N}]/u.test(text)
}

export function examProgress(exam: Exam, answers: Draft['answers']) {
  switch (exam.skill) {
    case 'Reading':
    case 'Listening':
      return {
        total: exam.questions.length,
        answered: exam.questions.filter(item => hasAnswer(answers[item.id])).length,
        unit: 'câu'
      }
    case 'Writing':
      return {
        total: exam.tasks.length,
        answered: exam.tasks.filter((task, index) => countWords(answers['task-' + index] ?? '') >= minimumWork(task.minWords)).length,
        unit: 'bài viết'
      }
    case 'Speaking':
      return {
        total: exam.parts.length,
        answered: exam.parts.filter((_, index) => Number(answers['part-' + (index + 1)]) >= speakingPartMinimumSeconds).length,
        unit: 'phần nói'
      }
  }
}

export function hasExamCredit(exam: Exam, answers: Draft['answers']) {
  const { total, answered } = examProgress(exam, answers)
  return total > 0 && answered >= minimumWork(total)
}
