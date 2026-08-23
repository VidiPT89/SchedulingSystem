import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const services = await prisma.service.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(services)
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const service = await prisma.service.create({
    data: {
      namePt: String(body.namePt || '').trim(),
      nameEn: String(body.nameEn || '').trim(),
      durationMinutes: Number(body.durationMinutes || 60),
      priceCents: Number(body.priceCents || 0),
      descriptionPt: String(body.descriptionPt || '').trim(),
      descriptionEn: String(body.descriptionEn || '').trim(),
    },
  })
  return NextResponse.json(service)
}
