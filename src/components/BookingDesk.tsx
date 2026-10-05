'use client'

import { useLocale } from '@/i18n/LocaleProvider'
import { addDays, format, startOfDay } from 'date-fns'
import { enGB, pt } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { FormEvent, useEffect, useMemo, useState } from 'react'

type Service = {
  id: string
  namePt: string
  nameEn: string
  durationMinutes: number
  priceCents: number
  descriptionPt: string
  descriptionEn: string
}

type Slot = { start: string; end: string; available: boolean }

export function BookingDesk() {
  const { t, locale } = useLocale()
  const [services, setServices] = useState<Service[]>([])
  const [serviceId, setServiceId] = useState('')
  const [day, setDay] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [slots, setSlots] = useState<Slot[]>([])
  const [picked, setPicked] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const days = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(startOfDay(new Date()), i)),
    [],
  )

  useEffect(() => {
    void fetch('/api/services')
      .then((r) => r.json())
      .then((data: Service[]) => {
        setServices(data)
        if (data[0]) setServiceId(data[0].id)
      })
  }, [])

  // Changing service or day clears the picked slot while rendering, not in an effect.
  const slotKey = `${serviceId}|${day}`
  const [seenSlotKey, setSeenSlotKey] = useState(slotKey)
  if (seenSlotKey !== slotKey) {
    setSeenSlotKey(slotKey)
    setPicked('')
  }

  useEffect(() => {
    if (!serviceId) return
    // Switching days quickly must not let an older reply overwrite the newer day's slots.
    let ignore = false
    fetch(`/api/slots?serviceId=${serviceId}&day=${day}`)
      .then((r) => r.json())
      .then((data: Slot[]) => {
        if (!ignore) setSlots(data)
      })
      .catch(() => {
        /* offline: keep the current slots */
      })
    return () => {
      ignore = true
    }
  }, [serviceId, day])

  const selected = services.find((s) => s.id === serviceId)
  const dfLocale = locale === 'en' ? enGB : pt

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!picked) return
    setBusy(true)
    setMessage('')
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, startsAt: picked, name, email, locale }),
    })
    setBusy(false)
    if (!res.ok) {
      const err = await res.json()
      setMessage(err.error || 'Error')
      return
    }
    setMessage(t.success)
    setName('')
    setEmail('')
    setPicked('')
    const refreshed = await fetch(`/api/slots?serviceId=${serviceId}&day=${day}`).then((r) => r.json())
    setSlots(refreshed)
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        <p className="text-xs uppercase tracking-[0.28em] text-[#ff7a00]">{t.kicker}</p>
        <h1 className="display mt-3 text-5xl leading-none text-[#ffaa00] sm:text-7xl">{t.hero}</h1>
        <p className="mt-4 max-w-xl text-[#f4e6c8]/80">{t.lead}</p>

        <h2 className="display mt-10 text-3xl text-[#ffaa00]">{t.services}</h2>
        <div className="mt-4 grid gap-3">
          {services.map((service, i) => (
            <motion.button
              key={service.id}
              type="button"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setServiceId(service.id)}
              className={`rounded-2xl border p-4 text-left ${
                serviceId === service.id
                  ? 'border-[#ff7a00] bg-[#ff7a00]/15'
                  : 'border-[#f4e6c8]/15 bg-black/40'
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <strong>{locale === 'en' ? service.nameEn : service.namePt}</strong>
                <span className="text-[#ffaa00]">
                  {(service.priceCents / 100).toFixed(0)} € · {service.durationMinutes} {t.minutes}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#f4e6c8]/70">
                {locale === 'en' ? service.descriptionEn : service.descriptionPt}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#f4e6c8]/15 bg-black/45 p-5">
        <h2 className="display text-2xl text-[#ffaa00]">{t.pickDay}</h2>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {days.map((d) => {
            const key = format(d, 'yyyy-MM-dd')
            return (
              <button
                key={key}
                type="button"
                onClick={() => setDay(key)}
                className={`rounded-lg px-1 py-2 text-center text-xs ${
                  day === key ? 'bg-[#ff7a00] text-black' : 'bg-[#f4e6c8]/8 hover:bg-[#ff7a00]/20'
                }`}
              >
                <span className="block uppercase">{format(d, 'EEE', { locale: dfLocale })}</span>
                <span className="display text-lg">{format(d, 'd')}</span>
              </button>
            )
          })}
        </div>

        <h3 className="mt-6 text-sm uppercase tracking-widest text-[#ff7a00]">{t.pickSlot}</h3>
        <div className="mt-3 grid max-h-48 grid-cols-3 gap-2 overflow-auto pr-1">
          {slots.length === 0 ? <p className="col-span-3 text-sm text-[#f4e6c8]/60">{t.noSlots}</p> : null}
          {slots.map((slot) => (
            <button
              key={slot.start}
              type="button"
              disabled={!slot.available}
              title={slot.available ? undefined : t.taken}
              aria-label={slot.available ? undefined : `${format(new Date(slot.start), 'HH:mm')} · ${t.taken}`}
              onClick={() => setPicked(slot.start)}
              className={`rounded-md px-2 py-2 text-sm ${
                !slot.available
                  ? 'cursor-not-allowed bg-[#f4e6c8]/5 text-[#f4e6c8]/30'
                  : picked === slot.start
                    ? 'bg-[#ffaa00] text-black'
                    : 'bg-[#ff7a00]/20 hover:bg-[#ff7a00]/40'
              }`}
            >
              {format(new Date(slot.start), 'HH:mm')}
            </button>
          ))}
        </div>

        <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
          <input className="field" required placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} />
          <input
            className="field"
            required
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn" disabled={busy || !picked || !selected}>
            {t.confirm}
          </button>
          {message ? <p className="text-sm text-[#ffaa00]">{message}</p> : null}
        </form>
      </section>
    </div>
  )
}
