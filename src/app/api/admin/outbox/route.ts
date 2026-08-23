import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const mails = await prisma.emailLog.findMany({ orderBy: { createdAt: 'desc' }, take: 40 })
  return NextResponse.json(mails)
}
