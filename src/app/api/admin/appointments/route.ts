import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const appointments = await prisma.appointment.findMany({
    include: { service: true },
    orderBy: { startsAt: 'desc' },
  })
  return NextResponse.json(appointments)
}
