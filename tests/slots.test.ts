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
