import { prisma } from '@/lib/prisma'
import { sendConfirmation } from '@/lib/reminders'
import { generateSlots } from '@/lib/slots'
import { addMinutes, parseISO } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const serviceId = String(body.serviceId || '')
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const locale = body.locale === 'en' ? 'en' : 'pt'
  const startsAt = parseISO(String(body.startsAt || ''))

  if (!serviceId || !name || !email || Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service || !service.active) return NextResponse.json({ error: 'Unknown service' }, { status: 404 })

  const endsAt = addMinutes(startsAt, service.durationMinutes)
  const dayStart = new Date(startsAt)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(startsAt)
  dayEnd.setHours(23, 59, 59, 999)

  const busy = await prisma.appointment.findMany({
    where: { status: 'confirmed', startsAt: { gte: dayStart, lte: dayEnd } },
  })
  const slots = generateSlots(
    startsAt,
    service.durationMinutes,
    busy.map((item) => ({ start: item.startsAt, end: item.endsAt })),
  )
  const open = slots.find((slot) => slot.start.getTime() === startsAt.getTime() && slot.available)
  if (!open) return NextResponse.json({ error: 'Slot unavailable' }, { status: 409 })

  const appointment = await prisma.appointment.create({
    data: {
      serviceId,
      customerName: name,
      customerEmail: email,
      startsAt,
      endsAt,
      locale,
    },
  })

  await sendConfirmation(appointment.id)
  return NextResponse.json(appointment)
}
