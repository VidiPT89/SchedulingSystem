import assert from 'node:assert/strict'
import { test } from 'node:test'
import { addMinutes, setHours, setMinutes, startOfDay } from 'date-fns'
import { generateSlots, reminderWindow } from '../src/lib/slots'

test('busy block marks overlapping slots unavailable', () => {
  const day = startOfDay(new Date('2026-09-01T00:00:00'))
  const busyStart = setMinutes(setHours(day, 10), 0)
  const slots = generateSlots(day, 60, [{ start: busyStart, end: addMinutes(busyStart, 60) }], day)
  const ten = slots.find((slot) => slot.start.getHours() === 10 && slot.start.getMinutes() === 0)
  const nine = slots.find((slot) => slot.start.getHours() === 9 && slot.start.getMinutes() === 0)
  assert.equal(ten?.available, false)
  assert.equal(nine?.available, true)
})

test('reminder window is one hour before start', () => {
  const start = new Date('2026-09-01T12:00:00')
  assert.equal(reminderWindow(start, new Date('2026-09-01T11:00:00')), true)
  assert.equal(reminderWindow(start, new Date('2026-09-01T09:00:00')), false)
})

const day = startOfDay(new Date('2026-09-01T00:00:00'))
const at = (h: number, m = 0) => setMinutes(setHours(day, h), m)
const label = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`

test('slots follow the 15-minute grid and the last one still ends by closing time', () => {
  const slots = generateSlots(day, 60, [], day)
  assert.equal(slots.length, 33)
  assert.equal(label(slots[0].start), '9:00')
  assert.equal(label(slots[1].start), '9:15')
  assert.equal(label(slots.at(-1)!.start), '17:00')
  assert.equal(label(slots.at(-1)!.end), '18:00')
})

test('back-to-back bookings are allowed on both sides of a busy block', () => {
  const slots = generateSlots(day, 60, [{ start: at(10), end: at(11) }], day)
  const free = (h: number, m = 0) => slots.find((s) => label(s.start) === label(at(h, m)))?.available
  assert.equal(free(9), true)
  assert.equal(free(9, 15), false)
  assert.equal(free(10, 45), false)
  assert.equal(free(11), true)
})

test('slots that already started are not offered', () => {
  const slots = generateSlots(day, 30, [], at(12))
  assert.equal(slots.find((s) => label(s.start) === '11:45')?.available, false)
  assert.equal(slots.find((s) => label(s.start) === '12:00')?.available, true)
})

test('a service longer than the opening hours has no slots', () => {
  assert.equal(generateSlots(day, 10 * 60, [], day).length, 0)
})

test('the reminder fires within five minutes either side of one hour before', () => {
  const start = at(12)
  assert.equal(reminderWindow(start, at(11, 5)), true)
  assert.equal(reminderWindow(start, at(10, 55)), true)
  assert.equal(reminderWindow(start, at(11, 6)), false)
  assert.equal(reminderWindow(start, at(10, 54)), false)
})
