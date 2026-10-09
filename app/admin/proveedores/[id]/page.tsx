'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Archive, ArchiveRestore, Package, Save, Truck } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, Card, ErrorText, Field, PageHeader, api, formatDate, formatMoney, useApi, btnDanger, btnPrimary, btnSecondary, inputClass } from '../../_components/ui'
import { useRol } from '../../_components/role'

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
          <ProveedorInventario proveedorId={id} />
        </div>
      </div>
    </div>
  )
}

function ProveedorInventario({ proveedorId }: { proveedorId: number }) {
  const { t, locale } = useAdminI18n()
  const { data: prods } = useApi<{ productos: { id: number; nombre: string; referencia: string | null; stock_total: string; unidad: string }[] }>(
    `/api/admin/inventario/productos?proveedor=${proveedorId}`
  )
  // Entradas carry costs: Propietarios only
  const { propietario } = useRol()
  const { data: compras } = useApi<{ compras: { id: number; numero: string; fecha: string; total: string; referencia_proveedor: string | null }[] }>(
    propietario ? `/api/admin/inventario/compras?proveedor=${proveedorId}` : null
  )
  const linkClass = 'py-2.5 flex items-center justify-between gap-3 text-sm hover:text-[#C9A84C]'

  return (
    <>
      <Card
        title={<span className="flex items-center gap-2"><Package size={18} className="text-[#C9A84C]" />{t.proveedores.productos}</span>}
        actions={<Link href={`/admin/inventario?proveedor=${proveedorId}`} className="text-sm text-[#C9A84C] hover:text-[#D4B76A]">{t.inventario.panel.verTodas}</Link>}
      >
        {!prods?.productos.length ? (
          <p className="text-sm text-gray-400">{t.inventario.empty}</p>
        ) : (
          <ul className="divide-y divide-[#1E3A5F] -my-2">
            {prods.productos.slice(0, 10).map((p) => (
              <li key={p.id}>
                <Link href={`/admin/inventario/${p.id}`} className={linkClass}>
                  <span className="text-white truncate">{p.nombre}{p.referencia && <span className="text-gray-500"> · {p.referencia}</span>}</span>
                  <span className="text-gray-400 tabular-nums shrink-0">{Number(p.stock_total).toLocaleString(locale)} {t.inventario.unidades[p.unidad as keyof typeof t.inventario.unidades] ?? p.unidad}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {propietario && <Card title={t.proveedores.compras}>
        {!compras?.compras.length ? (
          <p className="text-sm text-gray-400">{t.inventario.entradas.empty}</p>
        ) : (
          <ul className="divide-y divide-[#1E3A5F] -my-2">
            {compras.compras.slice(0, 10).map((c) => (
              <li key={c.id}>
                <Link href={`/admin/inventario/entradas/${c.id}`} className={linkClass}>
                  <span className="text-white">{c.numero}<span className="text-gray-500"> · {formatDate(c.fecha, locale)}{c.referencia_proveedor && ` · ${c.referencia_proveedor}`}</span></span>
                  <span className="text-gray-300 tabular-nums shrink-0">{formatMoney(c.total, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>}
    </>
  )
}
