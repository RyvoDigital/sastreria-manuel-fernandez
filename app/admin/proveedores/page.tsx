'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Plus, Search } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { ErrorText, Field, Modal, PageHeader, api, btnPrimary, btnSecondary, inputClass } from '../_components/ui'

interface ProveedorRow {
  id: number
  nombre: string
  persona_contacto: string | null
  email: string | null
  telefono: string | null
  ciudad: string | null
  pais: string | null
}

export default function ProveedoresPage() {
  const { t } = useAdminI18n()
  const [proveedores, setProveedores] = useState<ProveedorRow[]>([])
  const [q, setQ] = useState('')
  const [archivados, setArchivados] = useState(false)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (archivados) params.set('archivados', '1')
    const data = await api<{ proveedores: ProveedorRow[] }>(`/api/admin/proveedores?${params}`)
    setProveedores(data.proveedores)
    setLoading(false)
  }, [q, archivados])

  useEffect(() => {
    const timer = setTimeout(() => {
      load().catch(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [load])

  return (
    <div>
      <PageHeader
        title={t.proveedores.title}
        actions={
          <button type="button" className={btnPrimary} onClick={() => setCreating(true)}>
            <Plus size={16} />
            {t.proveedores.new}
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="search"
            placeholder={t.proveedores.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={`${inputClass} pl-12`}
            aria-label={t.common.search}
          />
        </div>
        <button type="button" className={btnSecondary} onClick={() => setArchivados((v) => !v)}>
          {archivados ? t.proveedores.showActive : t.proveedores.showArchived}
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : proveedores.length === 0 ? (
        <div className="text-gray-400">{t.proveedores.empty}</div>
      ) : (
        <ul className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl divide-y divide-[#1E3A5F]">
          {proveedores.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/proveedores/${p.id}`} className="flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-[#1E3A5F]/20 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium">{p.nombre}</div>
                  <div className="text-sm text-gray-400 truncate">
                    {[p.persona_contacto, p.email, p.telefono].filter(Boolean).join(' · ') || '—'}
                  </div>
                </div>
                <div className="hidden sm:block text-sm text-gray-400 shrink-0">
                  {[p.ciudad, p.pais].filter(Boolean).join(', ')}
                </div>
                <ChevronRight size={18} className="text-gray-500 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {creating && <NuevoProveedorModal onClose={() => setCreating(false)} />}
    </div>
  )
}

function NuevoProveedorModal({ onClose }: { onClose: () => void }) {
  const { t } = useAdminI18n()
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', persona_contacto: '', email: '', telefono: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { proveedor } = await api<{ proveedor: { id: number } }>('/api/admin/proveedores', { method: 'POST', body: form })
      router.push(`/admin/proveedores/${proveedor.id}`)
    } catch {
      setError(t.gestionCommon.error)
      setSaving(false)
    }
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value })

  return (
    <Modal title={t.proveedores.new} onClose={onClose} closeLabel={t.common.close}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={t.proveedores.fields.nombre}>
          <input className={inputClass} value={form.nombre} onChange={set('nombre')} required autoComplete="off" />
        </Field>
        <Field label={t.proveedores.fields.persona_contacto}>
          <input className={inputClass} value={form.persona_contacto} onChange={set('persona_contacto')} autoComplete="off" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t.proveedores.fields.email}>
            <input className={inputClass} type="email" value={form.email} onChange={set('email')} autoComplete="off" />
          </Field>
          <Field label={t.proveedores.fields.telefono}>
            <input className={inputClass} type="tel" value={form.telefono} onChange={set('telefono')} autoComplete="off" />
          </Field>
        </div>
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
