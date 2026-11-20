import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sounds } from '../src/data/ipa.ts'
import { splitPhones, soundPosition } from '../src/data/ipa-words.ts'
import { getArticulation, initialFrame } from '../src/features/ipa/articulation.ts'

const sound = symbol => sounds.find(item => item.symbol === symbol)

test('the same articulation timeline models a plosive closure, release and nasal airflow', () => {
  const closed = getArticulation(sound('p'), initialFrame)
  const released = getArticulation(sound('p'), 74)
  assert.equal(closed.pose.opening, 0)
  assert.equal(closed.flow, 'blocked')
  assert.ok(released.pose.opening > 0)
  assert.equal(released.flow, 'mouth')
  assert.equal(getArticulation(sound('m'), initialFrame).flow, 'nose')
  assert.equal(getArticulation(sound('θ'), initialFrame).voiced, false)
  assert.equal(getArticulation(sound('ð'), initialFrame).voiced, true)
})

test('diphthongs change jaw and tongue position and remain one unit in transcriptions', () => {
  const start = getArticulation(sound('aɪ'), initialFrame)
  const end = getArticulation(sound('aɪ'), 85)
  assert.ok(start.pose.opening > end.pose.opening)
  assert.equal(end.place, 'front')
  assert.deepEqual(splitPhones('ˈsəʊfə'), ['s', 'əʊ', 'f', 'ə'])
  assert.equal(soundPosition(splitPhones('ˈsəʊfə'), 'ə'), 'cuối')
  assert.equal(soundPosition(splitPhones('tʃiːp'), 'tʃ'), 'đầu')
})
