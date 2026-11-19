export type GrammarQuestion = {
  id: string
  prompt: string
  answer: string
  distractors: string[]
  explanation: string
}
export type Lesson = {
  id: string
  level: 'A1' | 'A2' | 'B1'
  group: string
  title: string
  rule: string
  example: string
  translation: string
  trap: string
  questions: GrammarQuestion[]
}

type QuestionRow = [prompt: string, answer: string, distractorA: string, distractorB: string, explanation: string]
export function lesson(
  id: string, level: Lesson['level'], group: string, title: string, rule: string,
  example: string, translation: string, trap: string, rows: QuestionRow[]
): Lesson {
  return { id, level, group, title, rule, example, translation, trap,
    questions: rows.map(([prompt, answer, distractorA, distractorB, explanation], index) => ({
      id: id + '-' + (index + 1), prompt, answer, distractors: [distractorA, distractorB], explanation
    })) }
}
