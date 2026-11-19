import { pairs } from '../../data/ipa'
import { grammarQuestions, lessons } from '../../data/foundations/catalog'
import type { GrammarQuestion } from '../../data/foundations'
import { structures, type Structure } from '../../data/structures'
import { leastRecent, shuffle } from '../../services/random'
import type { Card } from '../../types/study'
import { verbs, type Verb } from '../verbs/verbs'

export type PracticeMode = 'foundations' | 'mixed'
type Step = { id: string } & (
  { kind: 'review'; card: Card } |
  { kind: 'grammar'; question: GrammarQuestion } |
  { kind: 'ipa'; pair: typeof pairs[number] } |
  { kind: 'verb'; verb: Verb; mode: 'typing' | 'cloze' } |
  { kind: 'structure'; structure: Structure }
)

export function createSession(minutes: number, due: Card[], mode: PracticeMode, recent: string[], levels: 'A1' | 'A2' | 'B1' | 'all'): Step[] {
  const scale = minutes === 5 ? 0 : minutes === 15 ? 1 : 2
  const [reviewCount, grammarCount, pairCount, verbCount, structureCount] = [[3, 4, 2, 3, 1], [5, 7, 3, 6, 3], [8, 12, 5, 10, 5]][scale]
  const available = levels === 'all' ? grammarQuestions : lessons.filter(item => item.level === levels).flatMap(item => item.questions)
  const review = due.filter(card => mode === 'mixed' || card.domain === 'foundations').slice(0, reviewCount)
    .map(card => ({ id: 'review:' + card.id, kind: 'review' as const, card }))
  const selectedGrammar = leastRecent(available, mode === 'foundations' ? [8, 15, 26][scale] : grammarCount,
    item => item.id, recent)
  const grammar: Step[] = selectedGrammar.map(question => ({ id: question.id, kind: 'grammar', question }))
  if (mode === 'foundations') return [...review, ...shuffle(grammar)]
  const getPairId = (pair: typeof pairs[number]) => 'ipa:' + pair.words.join(':')
  const getVerbId = (verb: Verb) => 'verb:' + verb.base
  const getStructureId = (structure: Structure) => 'structure:' + structure.id
  const selectedPairs = leastRecent(pairs, pairCount, getPairId, recent)
  const selectedVerbs = leastRecent(verbs, verbCount, getVerbId, recent)
  const selectedStructures = leastRecent(structures, structureCount, getStructureId, recent)
  return [...review, ...shuffle<Step>([
    ...grammar,
    ...selectedPairs.map(pair => ({ id: getPairId(pair), kind: 'ipa' as const, pair })),
    ...selectedVerbs.map(verb => ({ id: getVerbId(verb), kind: 'verb' as const, verb, mode: Math.random() > 0.5 ? 'typing' as const : 'cloze' as const })),
    ...selectedStructures.map(structure => ({ id: getStructureId(structure), kind: 'structure' as const, structure }))
  ])]
}
