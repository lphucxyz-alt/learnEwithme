import { dayKey, shiftDay } from '../features/discipline/activity.ts'
import type { Card, CardSeed } from '../types/study'

export function seedCard(seed: CardSeed, current?: Card): Card {
  return current ?? { ...seed, due: dayKey(), interval: 0, repetitions: 0, ease: 2.5, lapses: 0 }
}

export function rateCard(card: Card, quality: 1 | 2 | 3 | 4): Card {
  const grade = [0, 2, 3, 4, 5][quality]
  const ease = Math.max(1.3, card.ease + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  const repetitions = grade < 3 ? 0 : card.repetitions + 1
  const interval = repetitions < 2 ? 1 : repetitions === 2 ? 6 : Math.round(card.interval * card.ease)
  return { ...card, ease, repetitions, interval, due: shiftDay(dayKey(), interval), lapses: card.lapses + Number(grade < 3) }
}
