import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { examSchema } from '../src/types/exam.ts'
import { pairs, sounds } from '../src/data/ipa.ts'

const readJson = path => JSON.parse(readFileSync(path, 'utf8'))
const testsDir = new URL('../src/data/tests/', import.meta.url)
const exams = readdirSync(testsDir).filter(file => file.endsWith('.json')).map(file => examSchema.parse(readJson(new URL(file, testsDir))))
assert.equal(new Set(exams.map(exam => exam.id)).size, exams.length)
assert.deepEqual([...new Set(exams.map(exam => exam.skill))].sort(), ['Listening', 'Reading', 'Speaking', 'Writing'])

const verbs = readJson(new URL('../src/data/verbs.json', import.meta.url))
assert.ok(verbs.length >= 150)
assert.equal(new Set(verbs.map(verb => verb.base)).size, verbs.length)
assert.ok(verbs.every(verb => [verb.base, verb.past, verb.part, verb.meaning, verb.level].every(Boolean)
  && verb.ipa.length === 3 && verb.ipa.every(Boolean) && verb.example.split('___').length === 2))

assert.equal(new Set(sounds.map(sound => sound.symbol)).size, 44)
assert.ok(pairs.every(pair => pair.sounds.every(symbol => sounds.some(sound => sound.symbol === symbol))))
for (const sound of sounds) {
  const file = [...sound.symbol].map(character => character.codePointAt(0).toString(16)).join('-')
  assert.ok(existsSync(new URL('../public/phonemes/' + file + '.mp3', import.meta.url)), sound.symbol)
}
console.log(`Kiểm tra học liệu đạt · ${verbs.length} động từ · ${sounds.length} âm · ${exams.length} đề`)
