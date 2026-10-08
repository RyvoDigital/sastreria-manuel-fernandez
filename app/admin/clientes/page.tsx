'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Plus, Search } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, ErrorText, Field, Modal, PageHeader, api, btnPrimary, btnSecondary, formatDate, inputClass } from '../_components/ui'

interface ClienteRow {
  id: number
  nombre: string
  apellidos: string | null
  email: string | null
  telefono: string | null
  origen: 'tienda' | 'web' | 'backfill'
  citas: number
  ultima_cita: string | null
}

const PAGE = 50

export default function ClientesPage() {
  const { t, locale } = useAdminI18n()
  const [clientes, setClientes] = useState<ClienteRow[]>([])
  const [q, setQ] = useState('')
  const [archivados, setArchivados] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async (offset: number) => {
    const params = new URLSearchParams({ offset: String(offset) })
    if (q.trim()) params.set('q', q.trim())
    if (archivados) params.set('archivados', '1')
    const data = await api<{ clientes: ClienteRow[] }>(`/api/admin/clientes?${params}`)
    setClientes((prev) => (offset === 0 ? data.clientes : [...prev, ...data.clientes]))
    setHasMore(data.clientes.length === PAGE)
    setLoading(false)
  }, [q, archivados])

  // Debounced so typing a name doesn't fire a request per keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      load(0).catch(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [load])

  return (
    <div>
      <PageHeader
        title={t.clientes.title}
        actions={
          <button type="button" className={btnPrimary} onClick={() => setCreating(true)}>
            <Plus size={16} />
            {t.clientes.new}
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="search"
            placeholder={t.clientes.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={`${inputClass} pl-12`}
            aria-label={t.common.search}
          />
        </div>
        <button type="button" className={btnSecondary} onClick={() => setArchivados((v) => !v)}>
          {archivados ? t.clientes.showActive : t.clientes.showArchived}
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : clientes.length === 0 ? (
        <div className="text-gray-400">{t.clientes.empty}</div>
      ) : (
        <>
          <ul className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl divide-y divide-[#1E3A5F]">
            {clientes.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/clientes/${c.id}`} className="flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-[#1E3A5F]/20 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium">{[c.nombre, c.apellidos].filter(Boolean).join(' ')}</span>
                      {c.origen !== 'tienda' && <Badge>{t.clientes.origen[c.origen]}</Badge>}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {[c.email, c.telefono].filter(Boolean).join(' · ') || '—'}
                    </div>
                  </div>
                  <div className="hidden sm:block text-right text-sm shrink-0">
                    <div className="text-gray-300">{c.citas} {t.clientes.citas.toLowerCase()}</div>
                    {c.ultima_cita && (
                      <div className="text-xs text-gray-500">{t.clientes.lastCita}: {formatDate(c.ultima_cita, locale)}</div>
                    )}
                  </div>
                  <ChevronRight size={18} className="text-gray-500 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="mt-4 text-center">
              <button type="button" className={btnSecondary} onClick={() => load(clientes.length)}>
                {t.clientes.loadMore}
              </button>
            </div>
          )}
        </>
      )}

      {creating && <NuevoClienteModal onClose={() => setCreating(false)} />}
    </div>
  )
}

function NuevoClienteModal({ onClose }: { onClose: () => void }) {
  const { t } = useAdminI18n()
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', telefono: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { cliente } = await api<{ cliente: { id: number } }>('/api/admin/clientes', { method: 'POST', body: form })
      router.push(`/admin/clientes/${cliente.id}`)
    } catch (err) {
      const code = (err as Error).message
      setError(code === 'duplicate' ? t.clientes.duplicateEmail : code === 'invalid email' ? t.clientes.invalidEmail : t.gestionCommon.error)
      setSaving(false)
    }
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value })

  return (
    <Modal title={t.clientes.new} onClose={onClose} closeLabel={t.common.close}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t.clientes.fields.nombre}>
            <input className={inputClass} value={form.nombre} onChange={set('nombre')} required autoComplete="off" />
          </Field>
          <Field label={t.clientes.fields.apellidos}>
            <input className={inputClass} value={form.apellidos} onChange={set('apellidos')} autoComplete="off" />
          </Field>
        </div>
        <Field label={t.clientes.fields.email}>
          <input className={inputClass} type="email" value={form.email} onChange={set('email')} autoComplete="off" />
        </Field>
        <Field label={t.clientes.fields.telefono}>
          <input className={inputClass} type="tel" value={form.telefono} onChange={set('telefono')} autoComplete="off" />
        </Field>
        <ErrorText>{error}</ErrorText>
        <div className="flex gap-2 pt-2">
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? t.gestionCommon.creating : t.gestionCommon.create}
          </button>
          <button type="button" className={btnSecondary} onClick={onClose}>{t.common.cancel}</button>
        </div>
      </form>
    </Modal>
  )
}
