'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Archive, ArchiveRestore, Package, Save, Truck } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, Card, ErrorText, Field, PageHeader, api, useApi, btnDanger, btnPrimary, btnSecondary, inputClass } from '../../_components/ui'

const FIELDS = [
  'nombre', 'razon_social', 'nif', 'persona_contacto', 'email', 'telefono', 'web', 'direccion', 'ciudad', 'pais',
] as const
const LONG_FIELDS = ['condiciones', 'notas'] as const

type Form = Record<(typeof FIELDS)[number] | (typeof LONG_FIELDS)[number], string>
type Proveedor = Partial<Record<keyof Form, string | null>> & { id: number; nombre: string; activo: boolean; updated_at: string }

export default function ProveedorFichaPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useAdminI18n()
  const { data, error, reload } = useApi<{ proveedor: Proveedor }>(`/api/admin/proveedores/${id}`)

  if (error) return <div className="text-gray-400">{t.common.noData}</div>
  if (!data) return <div className="text-gray-400">{t.common.loading}</div>
  return <ProveedorFicha key={data.proveedor.updated_at} proveedor={data.proveedor} reload={reload} />
}

function ProveedorFicha({ proveedor, reload }: { proveedor: Proveedor; reload: () => void }) {
  const { t } = useAdminI18n()
  const id = proveedor.id
  const [form, setForm] = useState<Form>(
    () => Object.fromEntries([...FIELDS, ...LONG_FIELDS].map((k) => [k, proveedor[k] ?? ''])) as Form
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api(`/api/admin/proveedores/${id}`, { method: 'PATCH', body: form })
      setMessage(t.proveedores.saved)
      reload()
    } catch (err) {
      setError((err as Error).message === 'nombre required' ? t.proveedores.nameRequired : t.gestionCommon.error)
    } finally {
      setSaving(false)
    }
  }

  async function toggleArchivado() {
    if (proveedor.activo && !window.confirm(t.proveedores.archiveConfirm)) return
    await api(`/api/admin/proveedores/${id}`, { method: 'PATCH', body: { activo: !proveedor.activo } })
    reload()
  }

  return (
    <div>
      <PageHeader
        back={{ href: '/admin/proveedores', label: t.proveedores.back }}
        title={proveedor.nombre}
        actions={
          <button type="button" className={proveedor.activo ? btnDanger : btnSecondary} onClick={toggleArchivado}>
            {proveedor.activo ? <Archive size={16} /> : <ArchiveRestore size={16} />}
            {proveedor.activo ? t.proveedores.archive : t.proveedores.unarchive}
          </button>
        }
      >
        {!proveedor.activo && <div className="mt-2"><Badge tone="red">{t.proveedores.archived}</Badge></div>}
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <form onSubmit={submit} className="space-y-6">
          <Card title={<span className="flex items-center gap-2"><Truck size={18} className="text-[#C9A84C]" />{t.clientes.sections.datos}</span>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.map((key) => (
                <Field key={key} label={t.proveedores.fields[key]} className={key === 'direccion' ? 'sm:col-span-2' : ''}>
                  <input
                    className={inputClass}
                    type={key === 'email' ? 'email' : key === 'telefono' ? 'tel' : key === 'web' ? 'url' : 'text'}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required={key === 'nombre'}
                    autoComplete="off"
                  />
                </Field>
              ))}
            </div>
            <div className="space-y-4 mt-4">
              {LONG_FIELDS.map((key) => (
                <Field key={key} label={t.proveedores.fields[key]}>
                  <textarea className={inputClass} rows={4} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </Field>
              ))}
            </div>
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

        <div className="space-y-6">
          <Card title={<span className="flex items-center gap-2"><Package size={18} className="text-[#C9A84C]" />{t.proveedores.productos}</span>}>
            <p className="text-sm text-gray-400">{t.proveedores.productosSoon}</p>
          </Card>
          <Card title={t.proveedores.compras}>
            <p className="text-sm text-gray-400">{t.proveedores.comprasSoon}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
