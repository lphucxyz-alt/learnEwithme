import { pairs } from '../../data/ipa'
import { structures, type Structure } from '../../data/structures'
import type { Card } from '../../types/study'
import { verbs, type Verb } from '../verbs/verbs'

type Step = { kind: 'review'; card: Card } | { kind: 'ipa'; pair: typeof pairs[number] } | { kind: 'verb'; verb: Verb } | { kind: 'structure'; structure: Structure }

function sample<T>(values: T[], size: number) {
  const pool = [...values]
  return Array.from({ length: Math.min(size, pool.length) }, () => pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
}

export function createSession(minutes: number, due: Card[]): Step[] {
  const [review, ipa, verb, structure] = minutes === 5 ? [3, 2, 5, 2] : minutes === 15 ? [6, 3, 8, 3] : [12, 5, 14, 6]
  return [
    ...due.slice(0, review).map(card => ({ kind: 'review' as const, card })),
    ...sample(pairs, ipa).map(pair => ({ kind: 'ipa' as const, pair })),
    ...sample(verbs, verb).map(item => ({ kind: 'verb' as const, verb: item })),
    ...sample(structures, structure).map(item => ({ kind: 'structure' as const, structure: item }))
  ]
}
