import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'scheduling-admin'

export async function isAdmin() {
  const jar = await cookies()
  return jar.get(ADMIN_COOKIE)?.value === 'ok'
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || 'studio'
}
