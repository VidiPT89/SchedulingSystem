import { runReminders } from '@/lib/reminders'
import { NextResponse } from 'next/server'

export async function POST() {
  const sent = await runReminders()
  return NextResponse.json({ sent })
}

export async function GET() {
  const sent = await runReminders()
  return NextResponse.json({ sent })
}
