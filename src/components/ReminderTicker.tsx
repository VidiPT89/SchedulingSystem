'use client'

import { useEffect } from 'react'

export function ReminderTicker() {
  useEffect(() => {
    const tick = () => {
      void fetch('/api/cron/reminders', { method: 'POST' })
    }
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])
  return null
}
