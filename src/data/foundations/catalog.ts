import { a1 } from './a1.ts'
import { a2 } from './a2.ts'
import { b1 } from './b1.ts'
import { extension } from './extension.ts'

export const lessons = [...a1, ...extension.filter(item => item.level === 'A1'), ...a2, ...extension.filter(item => item.level === 'A2'), ...b1, ...extension.filter(item => item.level === 'B1')]
export const grammarQuestions = lessons.flatMap(entry => entry.questions)
