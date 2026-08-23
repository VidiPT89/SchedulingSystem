import { prisma } from '@/lib/prisma'
import { generateSlots } from '@/lib/slots'
import { parseISO } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const serviceId = request.nextUrl.searchParams.get('serviceId')
  const day = request.nextUrl.searchParams.get('day')
  if (!serviceId || !day) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service || !service.active) return NextResponse.json({ error: 'Unknown service' }, { status: 404 })

  const start = parseISO(`${day}T00:00:00`)
  const end = parseISO(`${day}T23:59:59`)
  const busy = await prisma.appointment.findMany({
    where: {
      status: 'confirmed',
      startsAt: { gte: start, lte: end },
    },
  })

  const slots = generateSlots(
    start,
    service.durationMinutes,
    busy.map((item) => ({ start: item.startsAt, end: item.endsAt })),
  )

  return NextResponse.json(slots)
}
