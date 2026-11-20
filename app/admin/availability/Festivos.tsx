'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AlertTriangle, CalendarOff, Loader2, Trash2, X } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { api, btnPrimary, ErrorText, Field, inputClass, intlLocale } from '../_components/ui'

export interface CitaEnFestivo {
  id: number
  date: string
  time: string
  name: string
  type: string
  tipo_cita: string
}

export interface Festivo {
  id: number
  desde: string
  hasta: string
  motivo: string | null
  citas: CitaEnFestivo[]
}

const atNoon = (iso: string) => new Date(iso + 'T12:00:00')

function formatDay(iso: string, locale: string, withYear = true) {
  return atNoon(iso).toLocaleDateString(intlLocale(locale), {
    weekday: 'short', day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}),
  })
}

export function formatRange(f: { desde: string; hasta: string }, locale: string) {
  if (f.desde === f.hasta) return formatDay(f.desde, locale)
  const sameYear = f.desde.slice(0, 4) === f.hasta.slice(0, 4)
  return `${formatDay(f.desde, locale, !sameYear)} – ${formatDay(f.hasta, locale)}`
}

export function isFestivo(festivos: Festivo[] | undefined, date: string) {
  return !!festivos?.some((f) => f.desde <= date && date <= f.hasta)
}

function CitasList({ citas }: { citas: CitaEnFestivo[] }) {
  const { t, locale } = useAdminI18n()
  return (
    <ul className="mt-2 space-y-1 text-sm">
      {citas.map((c) => (
        <li key={c.id} className="flex flex-wrap gap-x-2 text-amber-200/90">
          <span className="tabular-nums">{formatDay(c.date, locale, false)} · {c.time}</span>
          <span className="text-white">{c.name}</span>
          <span className="text-amber-200/60">
            {t.citas.tipos[c.tipo_cita] ?? c.tipo_cita}
            {c.type === 'videocall' ? ` · ${t.common.videocall}` : ''}
          </span>
        </li>
      ))}
    </ul>
  )
}

function citasCount(n: number, t: ReturnType<typeof useAdminI18n>['t']) {
  return n === 1 ? t.festivos.unaCita : t.festivos.nCitas.replace('{n}', String(n))
}

export function FestivosCard({ festivos, loading, reload }: { festivos: Festivo[] | undefined; loading: boolean; reload: () => void }) {
  const { t, locale } = useAdminI18n()
  const tf = t.festivos
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [motivo, setMotivo] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Citas that were already booked when the holiday was added: shown until dismissed
  const [aviso, setAviso] = useState<{ rango: string; citas: CitaEnFestivo[] } | null>(null)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!desde) return
    setSaving(true)
    setError(null)
    setAviso(null)
    try {
      const res = await api<{ festivo: Festivo; citas: CitaEnFestivo[] }>('/api/admin/festivos', {
        method: 'POST',
        body: { desde, hasta: hasta || desde, motivo },
      })
      if (res.citas.length) setAviso({ rango: formatRange(res.festivo, locale), citas: res.citas })
      setDesde('')
      setHasta('')
      setMotivo('')
      reload()
    } catch (err) {
      const code = (err as Error).message
      setError(tf.errors[code] ?? code)
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    setDeleting(id)
    setError(null)
    try {
      await api(`/api/admin/festivos?id=${id}`, { method: 'DELETE' })
      reload()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-4 sm:p-6 mt-6">
      <h2 className="text-lg font-serif text-white mb-2 flex items-center gap-2">
        <CalendarOff size={18} className="text-[#C9A84C]" />
        {tf.titulo}
      </h2>
      <p className="text-sm text-gray-400 mb-5 max-w-2xl">{tf.ayuda}</p>

      <form onSubmit={add} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)_auto] lg:items-end">
        <Field label={tf.desde}>
          <input
            type="date"
            required
            value={desde}
            onChange={(e) => {
              setDesde(e.target.value)
              if (hasta && e.target.value > hasta) setHasta('')
            }}
            className={inputClass}
          />
        </Field>
        <Field label={tf.hasta}>
          <input type="date" value={hasta} min={desde || undefined} onChange={(e) => setHasta(e.target.value)} className={inputClass} />
        </Field>
        <Field label={tf.motivo} className="sm:col-span-2 lg:col-span-1">
          <input
            type="text"
            value={motivo}
            maxLength={200}
            placeholder={tf.motivoPlaceholder}
            onChange={(e) => setMotivo(e.target.value)}
            className={inputClass}
          />
        </Field>
        <button type="submit" disabled={saving || !desde} className={`${btnPrimary} sm:col-span-2 lg:col-span-1`}>
          {saving && <Loader2 size={16} className="animate-spin" />}
          {tf.anadir}
        </button>
      </form>

      <div className="mt-3">
        <ErrorText>{error}</ErrorText>
      </div>

      {aviso && (
        <div role="alert" className="mt-4 rounded-lg border border-amber-700/60 bg-amber-900/15 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="flex items-center gap-2 text-amber-300 font-medium">
              <AlertTriangle size={16} className="shrink-0" />
              {tf.avisoTitulo} ({aviso.rango})
            </p>
            <button type="button" onClick={() => setAviso(null)} aria-label={tf.cerrar} className="p-1 -m-1 text-amber-300/70 hover:text-amber-200">
              <X size={16} />
            </button>
          </div>
          <p className="mt-1 text-sm text-amber-200/80">{tf.avisoTexto}</p>
          <CitasList citas={aviso.citas} />
          <Link href="/admin/bookings" className="mt-3 inline-block text-sm text-[#C9A84C] hover:underline">{tf.irCitas} →</Link>
        </div>
      )}

      <h3 className="mt-6 mb-3 text-xs uppercase tracking-wider text-gray-400">{tf.proximos}</h3>
      {loading && !festivos ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 size={16} className="animate-spin" />
          {t.common.loading}
        </div>
      ) : !festivos?.length ? (
        <p className="text-sm text-gray-500">{tf.ninguno}</p>
      ) : (
        <ul className="divide-y divide-[#1E3A5F] border border-[#1E3A5F] rounded-lg">
          {festivos.map((f) => (
            <li key={f.id} className="flex items-start justify-between gap-3 p-3 sm:p-4">
              <div className="min-w-0">
                <p className="text-white first-letter:uppercase">{formatRange(f, locale)}</p>
                {f.motivo && <p className="text-sm text-gray-400 break-words">{f.motivo}</p>}
                {f.citas.length > 0 && (
                  <div className="mt-2">
                    <p className="flex items-center gap-1.5 text-sm text-amber-300">
                      <AlertTriangle size={14} className="shrink-0" />
                      {citasCount(f.citas.length, t)}
                    </p>
                    <CitasList citas={f.citas} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(f.id)}
                disabled={deleting !== null}
                aria-label={`${tf.quitar}: ${formatRange(f, locale)}`}
                title={tf.quitar}
                className="shrink-0 inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg text-red-300 hover:bg-red-900/20 disabled:opacity-50"
              >
                {deleting === f.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
