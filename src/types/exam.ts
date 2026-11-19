import { z } from 'zod'

const text = z.string().trim().min(1)
const key = z.string().regex(/^[a-z0-9-]+$/)
const seconds = z.number().int().positive()
const base = { id: key, title: text, collection: text, difficulty: z.enum(['Nền tảng', 'Trung bình', 'Nâng cao']), seconds }
const question = z.object({
  id: key, kind: z.enum(['tfng', 'choice', 'gap']), prompt: text,
  choices: z.array(text).optional(), answers: z.array(text).min(1), explanation: text,
  evidence: z.number().int().nonnegative()
})
const group = z.array(question).min(1)
export const examSchema = z.discriminatedUnion('skill', [
  z.object({ ...base, skill: z.literal('Reading'), paragraphs: z.array(text).min(1), questions: group }),
  z.object({ ...base, skill: z.literal('Listening'), turns: z.array(z.object({ speaker: text, text })).min(1), questions: group }),
  z.object({ ...base, skill: z.literal('Writing'), tasks: z.tuple([z.object({ title: text, prompt: text, minWords: z.literal(150), sample: text }), z.object({ title: text, prompt: text, minWords: z.literal(250), sample: text })]) }),
  z.object({ ...base, skill: z.literal('Speaking'), parts: z.tuple([
    z.object({ title: text, prompts: z.array(text).min(1), sample: text }),
    z.object({ title: text, prompts: z.array(text).min(1), sample: text }),
    z.object({ title: text, prompts: z.array(text).min(1), sample: text })
  ]) })
]).superRefine((exam, context) => {
  if (exam.skill !== 'Reading' && exam.skill !== 'Listening') return
  const ids = new Set<string>()
  const sections = exam.skill === 'Reading' ? exam.paragraphs : exam.turns
  exam.questions.forEach((question, index) => {
    const choices = question.kind === 'tfng' ? ['True', 'False', 'Not Given'] : question.choices
    if (ids.has(question.id) || question.evidence >= sections.length || question.kind !== 'gap' && (!choices || choices.length < 2 || question.answers.some(answer => !choices.includes(answer)))) {
      context.addIssue({ code: 'custom', path: ['questions', index], message: 'Check question ID, evidence index and answer choices' })
    }
    ids.add(question.id)
  })
})
export type Exam = z.infer<typeof examSchema>
export type Question = z.infer<typeof question>
