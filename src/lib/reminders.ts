import { format } from 'date-fns'
import { enGB, pt } from 'date-fns/locale'
import { confirmationCopy, reminderCopy, sendMail } from './mail'
import { prisma } from './prisma'
import { reminderWindow } from './slots'

function stamp(date: Date, locale: string) {
  return format(date, "EEEE, d MMMM yyyy · HH:mm", { locale: locale === 'en' ? enGB : pt })
}

export async function sendConfirmation(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { service: true },
  })
  if (!appointment || appointment.status !== 'confirmed') return

  const name = appointment.locale === 'en' ? appointment.service.nameEn : appointment.service.namePt
  const copy = confirmationCopy(appointment.locale, name, stamp(appointment.startsAt, appointment.locale))
  await sendMail({ kind: 'confirmation', to: appointment.customerEmail, ...copy })
  await prisma.appointment.update({
    where: { id: appointment.id },
    data: { confirmationSentAt: new Date() },
  })
}

export async function runReminders(now = new Date()) {
  const upcoming = await prisma.appointment.findMany({
    where: {
      status: 'confirmed',
      reminderSentAt: null,
    },
    include: { service: true },
  })

  let sent = 0
  for (const appointment of upcoming) {
    if (!reminderWindow(appointment.startsAt, now)) continue
    const name = appointment.locale === 'en' ? appointment.service.nameEn : appointment.service.namePt
    const copy = reminderCopy(appointment.locale, name, stamp(appointment.startsAt, appointment.locale))
    await sendMail({ kind: 'reminder', to: appointment.customerEmail, ...copy })
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { reminderSentAt: now },
    })
    sent += 1
  }
  return sent
}
