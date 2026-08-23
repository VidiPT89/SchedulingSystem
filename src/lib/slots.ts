import { addMinutes, areIntervalsOverlapping, isBefore, setHours, setMinutes, startOfDay } from 'date-fns'

export const OPEN_HOUR = 9
export const CLOSE_HOUR = 18
export const GRID_MINUTES = 15

export type BusyBlock = { start: Date; end: Date }

export type Slot = {
  start: Date
  end: Date
  available: boolean
}

export function dayWindow(day: Date): { open: Date; close: Date } {
  const base = startOfDay(day)
  return {
    open: setMinutes(setHours(base, OPEN_HOUR), 0),
    close: setMinutes(setHours(base, CLOSE_HOUR), 0),
  }
}

export function generateSlots(day: Date, durationMinutes: number, busy: BusyBlock[], now = new Date()): Slot[] {
  const { open, close } = dayWindow(day)
  const slots: Slot[] = []
  let cursor = open

  while (!isBefore(close, addMinutes(cursor, durationMinutes))) {
    const end = addMinutes(cursor, durationMinutes)
    const overlaps = busy.some((block) =>
      areIntervalsOverlapping(
        { start: cursor, end },
        { start: block.start, end: block.end },
        { inclusive: false },
      ),
    )
    const past = isBefore(cursor, now)
    slots.push({ start: cursor, end, available: !overlaps && !past })
    cursor = addMinutes(cursor, GRID_MINUTES)
  }

  return slots
}

export function reminderWindow(startsAt: Date, now = new Date()) {
  const target = addMinutes(startsAt, -60)
  const earliest = addMinutes(now, -5)
  const latest = addMinutes(now, 5)
  return !isBefore(target, earliest) && !isBefore(latest, target)
}
