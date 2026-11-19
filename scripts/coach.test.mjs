import assert from 'node:assert/strict'
import { test } from 'node:test'
import { groundedFeedback } from '../server/feedback.mjs'

const correction = { original: 'I use the bus', improved: 'I used the bus', explanation: 'Dùng quá khứ khi kể về năm ngoái.' }
const example = {
  sufficient: true, summary: 'Bài trả lời đúng đề.', strength: 'Có ví dụ.', criteria: { grammar: 'developing' },
  corrections: [correction, { ...correction, original: 'I go shopping' }], nextAction: 'Nói lại một câu ở thì quá khứ.',
  comparison: 'Ý rõ hơn.', audioNote: 'Có vài lần dừng.', transcript: 'Last year, I use the bus every day.'
}

test('keeps only errors quoted from the submitted writing and omits audio observations', () => {
  const result = groundedFeedback(example, { answer: 'Last year, I use the bus every day.' }, false)
  assert.deepEqual(result.corrections, [correction])
  assert.equal(result.transcript, null)
  assert.equal(result.audioNote, null)
  assert.equal(result.comparison, null)
})

test('retains grounded spoken corrections and comparison when there is prior feedback', () => {
  const result = groundedFeedback(example, { previous: { summary: 'Lượt trước' } }, true)
  assert.equal(result.sufficient, true)
  assert.deepEqual(result.corrections, [correction])
  assert.equal(result.comparison, example.comparison)
})

test('does not grade a recording with no intelligible speech', () => {
  const result = groundedFeedback({ ...example, transcript: '[không rõ]' }, {}, true)
  assert.equal(result.sufficient, false)
  assert.equal(result.criteria, null)
  assert.deepEqual(result.corrections, [])
})
