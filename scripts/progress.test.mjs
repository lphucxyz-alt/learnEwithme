import assert from 'node:assert/strict'
import { test } from 'node:test'
import { dayKey, record, secondsUntilVietnamMidnight, shiftDay, streaks } from '../src/features/discipline/activity.ts'
import { leastRecent, rememberPractice, shuffle } from '../src/services/random.ts'

const start = '2026-11-25'
const studyDays = offsets => Object.fromEntries(offsets.map(offset => [shiftDay(start, offset), {
  xp: 7, seconds: 0, counts: { foundations: 1 }
}]))
const week = Array.from({ length: 7 }, (_, index) => index)

test('old activity qualifies, saving a flashcard does not, and repeat practice credits one calendar day', () => {
  const activity = studyDays([0])
  const today = shiftDay(start, 1)
  const saved = record({ activity }, 'verbs', 1, 0, today, false)
  assert.equal(streaks(saved.activity, today).studiedToday, false)
  const answered = record(saved, 'foundations', 2, 0, today)
  const reviewed = record(answered, 'review', 5, 0, today)
  assert.equal(streaks(reviewed.activity, today).current, 2)
  assert.equal(streaks(reviewed.activity, today).studiedToday, true)
})

test('a seven-day run spans a calendar week and grants a shield', () => {
  const activity = studyDays(week)
  assert.equal(streaks(activity, shiftDay(start, 6)).shields, 1)
  const pending = streaks(activity, shiftDay(start, 7))
  assert.equal(pending.current, 7)
  assert.equal(pending.studiedToday, false)
  assert.equal(pending.shields, 1)
  const missed = streaks(activity, shiftDay(start, 8))
  assert.equal(missed.current, 8)
  assert.equal(missed.shields, 0)
  assert.ok(missed.protectedDays.has(shiftDay(start, 7)))
})

test('one protected day includes the next study day in the chain, while two missed days reset it', () => {
  assert.equal(streaks(studyDays([...week, 8]), shiftDay(start, 8)).current, 9)
  const broken = streaks(studyDays([...week, 9]), shiftDay(start, 9))
  assert.equal(broken.current, 1)
  assert.equal(broken.longest, 8)
  assert.equal(broken.shields, 0)
})

test('processing a long gap gives the same shield usage before and after returning', () => {
  const activity = studyDays(Array.from({ length: 14 }, (_, index) => index))
  const offline = streaks(activity, shiftDay(start, 16))
  const returned = streaks({ ...activity, ...studyDays([16]) }, shiftDay(start, 16))
  assert.equal(offline.current, 0)
  assert.equal(returned.current, 1)
  assert.equal(offline.shields, 1)
  assert.equal(returned.shields, 1)
  assert.deepEqual(offline.protectedDays, returned.protectedDays)
})

test('calendar days cross leap day and year boundaries', () => {
  assert.equal(shiftDay('2028-02-28', 1), '2028-02-29')
  assert.equal(dayKey(new Date(2026, 11, 31, 23, 55)), '2026-12-31')
  assert.equal(shiftDay('2026-12-31', 1), '2027-01-01')
})

test('daily progress and midnight countdown use Vietnam local time independent of UTC date', () => {
  const beforeMidnight = Date.parse('2026-11-20T16:59:30.000Z')
  const afterMidnight = Date.parse('2026-11-20T17:00:30.000Z')
  assert.equal(dayKey(new Date(beforeMidnight)), '2026-11-20')
  assert.equal(dayKey(new Date(afterMidnight)), '2026-11-21')
  assert.equal(secondsUntilVietnamMidnight(beforeMidnight), 30)
  assert.equal(secondsUntilVietnamMidnight(afterMidnight), 86370)
})

test('least-recent selection yields unseen items first and history stays bounded', () => {
  const pool = ['a', 'b', 'c', 'd', 'e', 'f']
  const first = leastRecent(pool, 3, id => id, [], () => 0.3)
  const history = rememberPractice([], first)
  const second = leastRecent(pool, 3, id => id, history, () => 0.3)
  assert.deepEqual(new Set([...first, ...second]), new Set(pool))
  assert.deepEqual(rememberPractice(['a', 'b'], ['a', 'c']), ['b', 'a', 'c'])
  assert.equal(rememberPractice([], Array.from({ length: 241 }, (_, index) => String(index))).length, 240)
  assert.deepEqual(shuffle(pool, () => 0.9999), pool)
})
