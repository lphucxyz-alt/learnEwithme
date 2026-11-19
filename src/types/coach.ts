import { z } from 'zod'

const line = z.string().trim().min(1).max(500)
const rating = z.enum(['needs_work', 'developing', 'clear'])
export const coachMode = z.enum(['speaking', 'writing'])
export const correctionSchema = z.object({
  original: line, improved: line, explanation: line
})
export const coachFeedbackSchema = z.object({
  sufficient: z.boolean(),
  summary: line,
  strength: line.nullable(),
  criteria: z.object({ relevance: rating, organization: rating, vocabulary: rating, grammar: rating }).nullable(),
  corrections: z.array(correctionSchema).max(3),
  nextAction: line,
  comparison: line.nullable(),
  audioNote: line.nullable(),
  transcript: z.string().trim().max(16000).nullable()
})
export const coachEntrySchema = z.object({
  id: z.string().min(1).max(180),
  mode: coachMode,
  topic: z.string().min(1).max(180),
  at: z.iso.datetime(),
  feedback: coachFeedbackSchema
})
export const coachRequestSchema = z.object({
  mode: coachMode,
  topic: z.string().trim().min(1).max(180),
  prompt: z.string().trim().min(1).max(4000),
  answer: z.string().trim().max(16000).optional(),
  round: z.literal([2, 3, 4]).optional(),
  seconds: z.number().positive().max(300).optional(),
  previous: z.object({ summary: line, nextAction: line, corrections: z.array(correctionSchema).max(3) }).optional()
})
export type CoachFeedback = z.infer<typeof coachFeedbackSchema>
export type CoachEntry = z.infer<typeof coachEntrySchema>
export type CoachRequest = z.infer<typeof coachRequestSchema>
