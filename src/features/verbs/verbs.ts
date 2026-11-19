import data from '../../data/verbs.json'

export const verbs = data
export type Verb = typeof verbs[number]

export function verbGroup(verb: Verb) {
  const [base, past, part] = [verb.base, verb.past, verb.part].map(form => form.split('/')[0])
  if (base === past && past === part) return 'AAA'
  if (past === part) return 'ABB'
  if (base === part) return 'ABA'
  if (base === past) return 'AAB'
  return 'ABC'
}

export function accepts(value: string, expected: string) {
  return expected.toLowerCase().split('/').some(form => form === value.toLowerCase().trim())
}

export function verbCard(verb: Verb) {
  return { id: 'verb:' + verb.base, domain: 'verbs' as const, prompt: verb.base + ' · ' + verb.meaning, answer: verb.past + ' · ' + verb.part }
}

export function clozeAnswer(verb: Verb) {
  return verb.base === 'be' ? 'were' : verb.exampleForm === 'base' ? verb.base : verb.past
}

export function verbExample(verb: Verb) {
  return verb.example.replace('___', clozeAnswer(verb).split('/')[0])
}
