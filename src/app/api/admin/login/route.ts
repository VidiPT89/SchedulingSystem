import { ADMIN_COOKIE, adminPassword } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (String(body.password || '') !== adminPassword()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, 'ok', { httpOnly: true, sameSite: 'lax', path: '/' })
  return res
}
