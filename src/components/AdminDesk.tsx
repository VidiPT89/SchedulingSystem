'use client'

import { useLocale } from '@/i18n/LocaleProvider'
import { format } from 'date-fns'
import { FormEvent, useEffect, useState } from 'react'

type Service = {
  id: string
  namePt: string
  nameEn: string
  durationMinutes: number
  priceCents: number
  descriptionPt: string
  descriptionEn: string
  active: boolean
}

type Appointment = {
  id: string
  customerName: string
  customerEmail: string
  startsAt: string
  status: string
  reminderSentAt: string | null
  service: Service
}

type Mail = {
  id: string
  kind: string
  to: string
  subject: string
  delivered: boolean
  createdAt: string
}

export function AdminDesk() {
  const { t, locale } = useLocale()
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [services, setServices] = useState<Service[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [mails, setMails] = useState<Mail[]>([])
  const [form, setForm] = useState({
    namePt: '',
    nameEn: '',
    durationMinutes: 60,
    priceCents: 5000,
    descriptionPt: '',
    descriptionEn: '',
  })

  async function load() {
    const [s, a, m, me] = await Promise.all([
      fetch('/api/admin/services'),
      fetch('/api/admin/appointments'),
      fetch('/api/admin/outbox'),
      fetch('/api/admin/session'),
    ])
    if (me.status === 401 || s.status === 401) {
      setAuthed(false)
      return
    }
    setAuthed(true)
    setServices(await s.json())
    setAppointments(await a.json())
    setMails(await m.json())
  }

  useEffect(() => {
    void load()
  }, [])

  async function login(event: FormEvent) {
    event.preventDefault()
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) await load()
  }

  async function saveService(event: FormEvent) {
    event.preventDefault()
    await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ namePt: '', nameEn: '', durationMinutes: 60, priceCents: 5000, descriptionPt: '', descriptionEn: '' })
    await load()
  }

  async function cancel(id: string) {
    await fetch(`/api/admin/appointments/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'cancelled' }) })
    await load()
  }

  if (authed === null) return <p>…</p>
  if (!authed) {
    return (
      <form className="mx-auto max-w-sm rounded-3xl border border-[#f4e6c8]/15 bg-black/45 p-6" onSubmit={login}>
        <h1 className="display text-4xl text-[#ffaa00]">{t.login}</h1>
        <input className="field mt-4" type="password" placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn mt-4 w-full">{t.enter}</button>
      </form>
    )
  }

  return (
    <div className="grid gap-8">
      <h1 className="display text-5xl text-[#ffaa00]">{t.admin}</h1>

      <form className="grid gap-3 rounded-3xl border border-[#f4e6c8]/15 bg-black/45 p-5 md:grid-cols-2" onSubmit={saveService}>
        <h2 className="display text-2xl text-[#ffaa00] md:col-span-2">{t.newService}</h2>
        <input className="field" placeholder={t.namePt} value={form.namePt} onChange={(e) => setForm({ ...form, namePt: e.target.value })} required />
        <input className="field" placeholder={t.nameEn} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
        <input className="field" type="number" min={15} step={15} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
        <input className="field" type="number" min={0} value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })} />
        <input className="field md:col-span-2" placeholder={t.descPt} value={form.descriptionPt} onChange={(e) => setForm({ ...form, descriptionPt: e.target.value })} required />
        <input className="field md:col-span-2" placeholder={t.descEn} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} required />
        <button className="btn md:col-span-2">{t.save}</button>
      </form>

      <section>
        <h2 className="display text-2xl text-[#ffaa00]">{t.services}</h2>
        <ul className="mt-3 grid gap-2">
          {services.map((s) => (
            <li key={s.id} className="rounded-xl border border-[#f4e6c8]/12 bg-black/40 px-4 py-3">
              {locale === 'en' ? s.nameEn : s.namePt} · {s.durationMinutes} {t.minutes} · {(s.priceCents / 100).toFixed(0)} €
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="display text-2xl text-[#ffaa00]">{t.appointments}</h2>
        {appointments.length === 0 ? <p className="mt-3 text-[#f4e6c8]/60">{t.empty}</p> : null}
        <ul className="mt-3 grid gap-2">
          {appointments.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f4e6c8]/12 bg-black/40 px-4 py-3">
              <div>
                <p>
                  {a.customerName} · {a.customerEmail}
                </p>
                <p className="text-sm text-[#f4e6c8]/70">
                  {locale === 'en' ? a.service.nameEn : a.service.namePt} · {format(new Date(a.startsAt), 'd MMM HH:mm')} · {a.status}
                  {a.reminderSentAt ? ` · ${t.reminder}` : ''}
                </p>
              </div>
              {a.status === 'confirmed' ? (
                <button className="btn btn-ghost" type="button" onClick={() => cancel(a.id)}>
                  {t.cancel}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="display text-2xl text-[#ffaa00]">{t.outbox}</h2>
        {mails.length === 0 ? <p className="mt-3 text-[#f4e6c8]/60">{t.empty}</p> : null}
        <ul className="mt-3 grid gap-2">
          {mails.map((mail) => (
            <li key={mail.id} className="rounded-xl border border-[#f4e6c8]/12 bg-black/40 px-4 py-3 text-sm">
              <span className="text-[#ff7a00]">{mail.kind}</span> · {mail.to} · {mail.subject} · {mail.delivered ? t.delivered : t.stored}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
