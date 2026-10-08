'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Archive, ArchiveRestore, Calendar, CreditCard, Save, ShoppingBag, Scissors } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, Card, ErrorText, Field, PageHeader, api, useApi, btnDanger, btnPrimary, btnSecondary, formatDate, formatMoney, inputClass } from '../../_components/ui'
import MedidasSection, { type MedidasRow } from './MedidasSection'

interface Cliente {
  id: number
  nombre: string
  apellidos: string | null
  email: string | null
  telefono: string | null
  nif: string | null
  direccion: string | null
  codigo_postal: string | null
  ciudad: string | null
  pais: string | null
  fecha_nacimiento: string | null
  idioma: string
  notas: string | null
  origen: 'tienda' | 'web' | 'backfill'
  acepta_comunicaciones: boolean
  activo: boolean
  created_at: string
  updated_at: string
}

interface Cita {
  id: number
  date: string
  time: string
  type: string
  status: string
  notes: string | null
}

interface Pago {
  id: number
  amount: number
  currency: string
  status: string
  type: string | null
  created_at: string
}

interface Ficha {
  cliente: Cliente
  medidas: MedidasRow[]
  citas: Cita[]
  pagos: Pago[]
}

const TEXT_FIELDS = ['nombre', 'apellidos', 'email', 'telefono', 'nif', 'direccion', 'codigo_postal', 'ciudad', 'pais'] as const

export default function ClienteFichaPage() {
  const { id } = useParams<{ id: string }>()
  const { t, locale } = useAdminI18n()
  const { data: ficha, error, reload } = useApi<Ficha>(`/api/admin/clientes/${id}`)

  async function toggleArchivado() {
    if (!ficha) return
    if (ficha.cliente.activo && !window.confirm(t.clientes.archiveConfirm)) return
    await api(`/api/admin/clientes/${id}`, { method: 'PATCH', body: { activo: !ficha.cliente.activo } })
    reload()
  }

  if (error) return <div className="text-gray-400">{t.common.noData}</div>
  if (!ficha) return <div className="text-gray-400">{t.common.loading}</div>

  const { cliente } = ficha

  return (
    <div>
      <PageHeader
        back={{ href: '/admin/clientes', label: t.clientes.back }}
        title={[cliente.nombre, cliente.apellidos].filter(Boolean).join(' ')}
        actions={
          <button type="button" className={cliente.activo ? btnDanger : btnSecondary} onClick={toggleArchivado}>
            {cliente.activo ? <Archive size={16} /> : <ArchiveRestore size={16} />}
            {cliente.activo ? t.clientes.archive : t.clientes.unarchive}
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge>{t.clientes.origen[cliente.origen]}</Badge>
          {!cliente.activo && <Badge tone="red">{t.clientes.archived}</Badge>}
          <span className="text-xs text-gray-500">{formatDate(cliente.created_at, locale)}</span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <DatosForm key={cliente.updated_at} cliente={cliente} onSaved={reload} />
        </div>

        <div className="space-y-6">
          <MedidasSection clienteId={cliente.id} medidas={ficha.medidas} onChange={reload} />

          <Card title={<span className="flex items-center gap-2"><Calendar size={18} className="text-[#C9A84C]" />{t.clientes.sections.citas}</span>}>
            {ficha.citas.length === 0 ? (
              <p className="text-sm text-gray-400">{t.clientes.noCitas}</p>
            ) : (
              <ul className="divide-y divide-[#1E3A5F]">
                {ficha.citas.map((c) => (
                  <li key={c.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                    <div>
                      <div className="text-white">{formatDate(c.date, locale)} · {c.time}</div>
                      {c.notes && <div className="text-gray-400 text-xs mt-0.5">{c.notes}</div>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Badge>{c.type === 'videocall' || c.type === 'videollamada' ? t.common.videocall : t.common.inPerson}</Badge>
                      <Badge tone={c.status === 'cancelled' ? 'red' : 'neutral'}>{c.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {ficha.pagos.length > 0 && (
            <Card title={<span className="flex items-center gap-2"><CreditCard size={18} className="text-[#C9A84C]" />{t.clientes.sections.pagos}</span>}>
              <ul className="divide-y divide-[#1E3A5F]">
                {ficha.pagos.map((p) => (
                  <li key={p.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                    <div className="text-white">{formatDate(p.created_at, locale)} · {p.type ?? '—'}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{formatMoney(p.amount / 100, locale)}</span>
                      <Badge tone={p.status === 'paid' || p.status === 'completed' ? 'green' : 'neutral'}>{p.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card title={<span className="flex items-center gap-2"><ShoppingBag size={18} className="text-[#C9A84C]" />{t.clientes.sections.compras}</span>}>
            <p className="text-sm text-gray-400">{t.clientes.comprasSoon}</p>
          </Card>

          <Card title={<span className="flex items-center gap-2"><Scissors size={18} className="text-[#C9A84C]" />{t.clientes.sections.encargos}</span>}>
            <p className="text-sm text-gray-400">{t.clientes.encargosSoon}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Remounted (via key) whenever the record changes, so unsaved edits survive a measurements reload
function DatosForm({ cliente, onSaved }: { cliente: Cliente; onSaved: () => void }) {
  const { t } = useAdminI18n()
  const [form, setForm] = useState(() => toForm(cliente))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api(`/api/admin/clientes/${cliente.id}`, { method: 'PATCH', body: form })
      setMessage(t.clientes.saved)
      onSaved()
    } catch (err) {
      const code = (err as Error).message
      setError(
        code === 'duplicate' ? t.clientes.duplicateEmail
          : code === 'invalid email' ? t.clientes.invalidEmail
            : code === 'nombre required' ? t.clientes.nameRequired
              : t.gestionCommon.error
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card title={t.clientes.sections.datos}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEXT_FIELDS.map((key) => (
            <Field key={key} label={t.clientes.fields[key]} className={key === 'direccion' ? 'sm:col-span-2' : ''}>
              <input
                className={inputClass}
                type={key === 'email' ? 'email' : key === 'telefono' ? 'tel' : 'text'}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={key === 'nombre'}
                autoComplete="off"
              />
            </Field>
          ))}
          <Field label={t.clientes.fields.fecha_nacimiento}>
            <input className={inputClass} type="date" value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} />
          </Field>
          <Field label={t.clientes.fields.idioma}>
            <select className={inputClass} value={form.idioma} onChange={(e) => setForm({ ...form, idioma: e.target.value })}>
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="it">Italiano</option>
              <option value="fr">Français</option>
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-3 mt-5 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#C9A84C]"
            checked={form.acepta_comunicaciones}
            onChange={(e) => setForm({ ...form, acepta_comunicaciones: e.target.checked })}
          />
          {t.clientes.fields.acepta_comunicaciones}
        </label>
      </Card>

      <Card title={t.clientes.sections.notas}>
        <textarea
          className={inputClass}
          rows={5}
          value={form.notas}
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          aria-label={t.clientes.fields.notas}
        />
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={btnPrimary} disabled={saving}>
          <Save size={16} />
          {saving ? t.common.saving : t.common.save}
        </button>
        {message && <span className="text-sm text-emerald-400">{message}</span>}
        <ErrorText>{error}</ErrorText>
      </div>
    </form>
  )
}

function toForm(c: Cliente) {
  return {
    nombre: c.nombre ?? '',
    apellidos: c.apellidos ?? '',
    email: c.email ?? '',
    telefono: c.telefono ?? '',
    nif: c.nif ?? '',
    direccion: c.direccion ?? '',
    codigo_postal: c.codigo_postal ?? '',
    ciudad: c.ciudad ?? '',
    pais: c.pais ?? '',
    fecha_nacimiento: c.fecha_nacimiento ?? '',
    idioma: c.idioma ?? 'es',
    notas: c.notas ?? '',
    acepta_comunicaciones: !!c.acepta_comunicaciones,
  }
}
