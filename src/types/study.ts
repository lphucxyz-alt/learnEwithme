import { z } from 'zod'

export const targetBand = 6.5
export const domains = ['foundations', 'ipa', 'verbs', 'structures', 'tests', 'review', 'practice', 'focus'] as const
export const domainSchema = z.enum(domains)
export type Domain = z.infer<typeof domainSchema>
const isoDay = z.iso.date()
const count = z.number().int().nonnegative()
export const cardSchema = z.object({
  id: z.string(), domain: domainSchema, prompt: z.string(), answer: z.string(),
  due: isoDay, interval: count, repetitions: count, ease: z.number().min(1.3), lapses: count
})
export type Card = z.infer<typeof cardSchema>
export type CardSeed = Pick<Card, 'id' | 'domain' | 'prompt' | 'answer'>
export const draftSchema = z.object({
  deadline: count, answers: z.record(z.string(), z.string()),
  highlights: z.array(z.object({ paragraph: count, start: count, end: count, color: z.enum(['amber', 'green', 'pink']) })),
  ratings: z.record(z.string(), z.number().min(0).max(9))
})
export type Draft = z.infer<typeof draftSchema>
export const stateSchema = z.object({
  version: z.literal(1),
  theme: z.enum(['light', 'dark']),
  accent: z.enum(['en-GB', 'en-US']),
  rate: z.literal([0.6, 0.75, 1, 1.2]),
  dailyMinutes: z.number().int().min(5).max(120),
  targetBand: z.number().min(4).max(9).default(targetBand).transform(() => targetBand),
  fluencyNotes: z.string().default(''),
  activity: z.record(isoDay, z.object({ xp: count, seconds: count, counts: z.partialRecord(domainSchema, count), qualified: z.boolean().optional() })),
  lessons: z.record(z.string(), z.object({ attempts: count, best: count, last: count })).default({}),
  recentPractice: z.array(z.string()).max(240).default([]),
  cards: z.record(z.string(), cardSchema),
  drafts: z.record(z.string(), draftSchema),
  attempts: z.array(z.object({ id: z.string(), examId: z.string(), at: z.iso.datetime(), score: count.nullable(), total: count, draft: draftSchema })),
  focus: z.object({ mode: z.enum(['work', 'break']), duration: count, remaining: count, deadline: count.nullable() })
})
export type StudyState = z.infer<typeof stateSchema>
export const initialState: StudyState = {
  version: 1, theme: 'light', accent: 'en-GB', rate: 1, dailyMinutes: 25, targetBand, fluencyNotes: '',
  activity: {}, lessons: {}, recentPractice: [], cards: {}, drafts: {}, attempts: [],
  focus: { mode: 'work', duration: 1500, remaining: 1500, deadline: null }
}
