import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await context.params
  const body = await request.json()
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: String(body.status || 'cancelled') },
  })
  return NextResponse.json(appointment)
}
