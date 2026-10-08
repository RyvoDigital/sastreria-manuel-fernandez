'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, X } from 'lucide-react'

// Shared building blocks for the gestión screens, matching the existing admin look.
// Inputs stay at 16px so iOS Safari doesn't zoom on focus.

export const inputClass =
  'w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C] disabled:opacity-60'
export const btnPrimary =
  'inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2 bg-[#C9A84C] text-[#0A1628] rounded-lg text-sm font-medium hover:bg-[#D4B76A] transition-colors disabled:opacity-50'
export const btnSecondary =
  'inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2 bg-[#1E3A5F]/50 text-gray-300 rounded-lg text-sm hover:bg-[#1E3A5F] transition-colors disabled:opacity-50'
export const btnDanger =
  'inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2 rounded-lg text-sm text-red-300 hover:bg-red-900/20 transition-colors disabled:opacity-50'
export const cardClass = 'bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-4 sm:p-6'

export function PageHeader({ title, back, actions, children }: {
  title: React.ReactNode
  back?: { href: string; label: string }
  actions?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="mb-6 sm:mb-8">
      {back && (
        <Link href={back.href} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-3">
          <ArrowLeft size={16} />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-serif text-white break-words">{title}</h1>
          {children}
        </div>
        {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}

export function Card({ title, actions, children, className = '' }: {
  title?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`${cardClass} ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          {title && <h2 className="text-lg font-medium text-white">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}

export function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">{label}</span>
      {children}
    </label>
  )
}

export function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'gold' | 'green' | 'red' | 'amber' }) {
  const tones = {
    neutral: 'bg-[#1E3A5F]/50 text-gray-300',
    gold: 'bg-[#C9A84C]/10 text-[#C9A84C]',
    green: 'bg-emerald-500/10 text-emerald-400',
    red: 'bg-red-500/10 text-red-400',
    amber: 'bg-amber-500/10 text-amber-400',
  }
  return <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${tones[tone]}`}>{children}</span>
}

export function Modal({ title, onClose, children, closeLabel }: {
  title: string
  onClose: () => void
  children: React.ReactNode
  closeLabel: string
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  // Callers pass inline arrows; keep the effect from re-running (and re-focusing) on every render
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current()
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('input, select, textarea')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-[#0F1D2E] border border-[#1E3A5F] rounded-t-2xl sm:rounded-2xl p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-serif text-white">{title}</h2>
          <button type="button" onClick={onClose} aria-label={closeLabel} className="p-2 -mr-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E3A5F]/50">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return <p role="alert" className="text-sm text-red-400">{children}</p>
}

// fetch wrapper: returns parsed JSON or throws with the API's error code
export async function api<T>(url: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(url, {
    method: init?.method ?? 'GET',
    headers: init?.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data as T
}

// Loads a JSON endpoint; reload() refetches. Stale responses (url changed meanwhile) are dropped.
export function useApi<T>(url: string) {
  const [state, setState] = useState<{ data: T | null; error: string | null; loading: boolean }>({ data: null, error: null, loading: true })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let current = true
    api<T>(url).then(
      (data) => current && setState({ data, error: null, loading: false }),
      (error: Error) => current && setState((s) => ({ ...s, error: error.message, loading: false }))
    )
    return () => {
      current = false
    }
  }, [url, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  return { ...state, reload }
}

export function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return '—'
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value) || value.endsWith('T00:00:00.000Z')
  const date = dateOnly ? new Date(value.slice(0, 10) + 'T12:00:00') : new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Madrid' }).format(date)
}

export function formatMoney(value: number | string | null | undefined, locale: string) {
  if (value === null || value === undefined || value === '') return '—'
  return new Intl.NumberFormat(intlLocale(locale), { style: 'currency', currency: 'EUR' }).format(Number(value))
}

export function intlLocale(locale: string) {
  return locale === 'en' ? 'en-GB' : locale === 'it' ? 'it-IT' : locale === 'fr' ? 'fr-FR' : 'es-ES'
}
