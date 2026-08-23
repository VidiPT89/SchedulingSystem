import nodemailer from 'nodemailer'
import { prisma } from './prisma'

function smtpReady() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export async function sendMail(input: { kind: string; to: string; subject: string; body: string }) {
  let delivered = false

  if (smtpReady()) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: input.to,
      subject: input.subject,
      text: input.body,
    })
    delivered = true
  }

  await prisma.emailLog.create({
    data: { ...input, delivered },
  })

  return delivered
}

export function confirmationCopy(locale: string, service: string, when: string) {
  if (locale === 'en') {
    return {
      subject: `Confirmed: ${service}`,
      body: `Your appointment for ${service} is confirmed for ${when}.\nWe will send a reminder one hour before.\n\nDeveloped by David Arsénio Martins\nhttps://ividi.dev/\nhttps://github.com/VidiPT89/`,
    }
  }
  return {
    subject: `Confirmado: ${service}`,
    body: `A sua marcação de ${service} está confirmada para ${when}.\nEnviamos um lembrete uma hora antes.\n\nDeveloped by David Arsénio Martins\nhttps://ividi.dev/\nhttps://github.com/VidiPT89/`,
  }
}

export function reminderCopy(locale: string, service: string, when: string) {
  if (locale === 'en') {
    return {
      subject: `Reminder: ${service} in one hour`,
      body: `This is your one-hour reminder for ${service} at ${when}.`,
    }
  }
  return {
    subject: `Lembrete: ${service} dentro de uma hora`,
    body: `Este é o lembrete de uma hora para ${service} às ${when}.`,
  }
}
