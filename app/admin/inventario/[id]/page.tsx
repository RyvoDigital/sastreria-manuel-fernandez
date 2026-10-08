'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Archive, ArchiveRestore, ArrowDownToLine, History, Pencil, Plus, Save, SlidersHorizontal } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, Card, ErrorText, PageHeader, api, btnDanger, btnPrimary, btnSecondary, formatMoney, useApi } from '../../_components/ui'
import InventarioTabs from '../InventarioTabs'
import ProductoForm, { toBody, type ProductoFormValues } from '../ProductoForm'
import { AlertaBadge, TipoBadge, errorMessage, formatQty, useUnidad, type Categoria, type ProveedorOption } from '../shared'
import { AddVariantesModal, AjusteModal, EntradaModal, VarianteEditModal, varianteNombre, type Variante } from './modals'
import Movimientos from './Movimientos'

interface Producto extends Record<string, unknown> {
  id: number
  nombre: string
  categoria: string
  tipo: 'terminado' | 'material'
  unidad: string
  referencia: string | null
  proveedor_id: number | null
  coste: string | null
  pvp: string | null
  stock_minimo_defecto: string
  activo: boolean
  tiene_movimientos: boolean
}

type Dialog =
  | { kind: 'entrada' | 'ajuste' | 'editar'; variante: Variante }
  | { kind: 'variantes' }
  | null

export default function ProductoFichaPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useAdminI18n()
  const { data, error, reload } = useApi<{ producto: Producto; variantes: Variante[] }>(`/api/admin/inventario/productos/${id}`)
  const { data: cats } = useApi<{ categorias: Categoria[] }>('/api/admin/inventario/categorias')
  const { data: provs } = useApi<{ proveedores: ProveedorOption[] }>('/api/admin/proveedores')
  const [historyVersion, setHistoryVersion] = useState(0)

  if (error) return <div className="text-gray-400">{t.common.noData}</div>
  if (!data) return <div className="text-gray-400">{t.common.loading}</div>

  return (
    <Ficha
      producto={data.producto}
      variantes={data.variantes}
      categorias={cats?.categorias ?? []}
      proveedores={provs?.proveedores ?? []}
      historyVersion={historyVersion}
      onStockChange={() => { reload(); setHistoryVersion((v) => v + 1) }}
      reload={reload}
    />
  )
}

function toValues(p: Producto): ProductoFormValues {
  const str = (v: unknown) => (v === null || v === undefined ? '' : String(v))
  return {
    categoria_id: str(p.categoria_id), nombre: p.nombre, referencia: str(p.referencia), marca: str(p.marca),
    proveedor_id: str(p.proveedor_id), descripcion: str(p.descripcion), color: str(p.color), material: str(p.material),
    talla: str(p.talla), unidad: p.unidad, coste: str(p.coste), pvp: str(p.pvp), iva: String(Number(p.iva)),
    stock_minimo_defecto: String(Number(p.stock_minimo_defecto)), ubicacion: str(p.ubicacion), observaciones: str(p.observaciones),
    foto_url: (p.foto_url as string) ?? null, foto_thumb_url: (p.foto_thumb_url as string) ?? null,
  }
}

function Ficha({ producto, variantes, categorias, proveedores, historyVersion, onStockChange, reload }: {
  producto: Producto
  variantes: Variante[]
  categorias: Categoria[]
  proveedores: ProveedorOption[]
  historyVersion: number
  onStockChange: () => void
  reload: () => void
}) {
  const { t, locale } = useAdminI18n()
  const fmtUnidad = useUnidad()
  const s = t.inventario.variantesSection
  const [values, setValues] = useState(() => toValues(producto))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [dialog, setDialog] = useState<Dialog>(null)

  const activas = variantes.filter((v) => v.activo)
  const inactivas = variantes.filter((v) => !v.activo)
  const stockTotal = activas.reduce((sum, v) => sum + Number(v.stock_actual), 0)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api(`/api/admin/inventario/productos/${producto.id}`, { method: 'PATCH', body: toBody(values) })
      setMessage(t.inventario.saved)
      reload()
    } catch (err) {
      setError(errorMessage(t, err))
    } finally {
      setSaving(false)
    }
  }

  async function toggleArchivado() {
    if (producto.activo && !window.confirm(t.inventario.archiveConfirm)) return
    await api(`/api/admin/inventario/productos/${producto.id}`, { method: 'PATCH', body: { activo: !producto.activo } })
    reload()
  }

  const closeAndRefresh = () => { setDialog(null); onStockChange() }

  const varianteCard = (v: Variante) => (
    <li key={v.id} className={`py-3 ${v.activo ? '' : 'opacity-50'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex flex-wrap items-center gap-2">
          <span className="text-white font-medium">{varianteNombre(v, s.unica)}</span>
          <AlertaBadge alerta={v.activo ? v.alerta : null} />
          {!v.activo && <Badge>{s.inactiva}</Badge>}
        </div>
        <span className="text-lg text-white tabular-nums shrink-0">{fmtUnidad(v.stock_actual, producto.unidad)}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mt-1">
        <div className="text-xs text-gray-500 min-w-0 break-all">
          {[v.sku, v.ubicacion, `${s.minimo}: ${formatQty(v.stock_minimo, locale)}`, v.pvp && formatMoney(v.pvp, locale)].filter(Boolean).join(' · ')}
        </div>
        <div className="flex gap-1.5 ml-auto">
          <button type="button" className={btnSecondary} onClick={() => setDialog({ kind: 'entrada', variante: v })} disabled={!v.activo} title={t.inventario.entradas.quick}>
            <ArrowDownToLine size={16} />
            <span className="hidden sm:inline">{t.inventario.acciones.entrada}</span>
          </button>
          <button type="button" className={btnSecondary} onClick={() => setDialog({ kind: 'ajuste', variante: v })} disabled={!v.activo} title={t.inventario.ajuste.title}>
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">{t.inventario.acciones.ajuste}</span>
          </button>
          <button type="button" className={btnSecondary} onClick={() => setDialog({ kind: 'editar', variante: v })} aria-label={t.common.edit}>
            <Pencil size={16} />
          </button>
        </div>
      </div>
    </li>
  )

  return (
    <div>
      <PageHeader
        back={{ href: '/admin/inventario', label: t.inventario.title }}
        title={producto.nombre}
        actions={
          <button type="button" className={producto.activo ? btnDanger : btnSecondary} onClick={toggleArchivado}>
            {producto.activo ? <Archive size={16} /> : <ArchiveRestore size={16} />}
            {producto.activo ? t.inventario.archive : t.inventario.unarchive}
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <TipoBadge tipo={producto.tipo} />
          <Badge>{producto.categoria}</Badge>
          {!producto.activo && <Badge tone="red">{t.inventario.archived}</Badge>}
        </div>
      </PageHeader>
      <InventarioTabs />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="xl:order-2 space-y-6">
          <Card
            title={
              <span className="flex items-baseline gap-3">
                {s.title}
                <span className="text-sm font-normal text-gray-400 tabular-nums">{t.inventario.stock}: {fmtUnidad(stockTotal, producto.unidad)}</span>
              </span>
            }
            actions={
              <button type="button" className={btnSecondary} onClick={() => setDialog({ kind: 'variantes' })}>
                <Plus size={16} />
                <span className="hidden sm:inline">{s.add}</span>
              </button>
            }
          >
            <ul className="divide-y divide-[#1E3A5F] -my-3">{activas.map(varianteCard)}</ul>
            {inactivas.length > 0 && (
              <details className="mt-4">
                <summary className="text-sm text-gray-400 cursor-pointer py-2">{s.inactivas} ({inactivas.length})</summary>
                <ul className="divide-y divide-[#1E3A5F]">{inactivas.map(varianteCard)}</ul>
              </details>
            )}
          </Card>

          <Card title={<span className="flex items-center gap-2"><History size={18} className="text-[#C9A84C]" />{t.inventario.movimientos.title}</span>}>
            <Movimientos productoId={producto.id} unidad={producto.unidad} variantes={variantes} version={historyVersion} />
          </Card>
        </div>

        <form onSubmit={save} className="xl:order-1 space-y-6">
          <ProductoForm
            values={values}
            onChange={setValues}
            categorias={categorias}
            proveedores={proveedores}
            productoId={producto.id}
            unidadLocked={producto.tiene_movimientos}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className={btnPrimary} disabled={saving}>
              <Save size={16} />
              {saving ? t.common.saving : t.common.save}
            </button>
            {message && <span className="text-sm text-emerald-400">{message}</span>}
            <ErrorText>{error}</ErrorText>
          </div>
          <p className="text-xs text-gray-500">
            {t.inventario.verEntradas}{' '}
            <Link href={`/admin/inventario/entradas`} className="text-[#C9A84C] hover:text-[#D4B76A]">{t.inventario.tabs.entradas}</Link>
          </p>
        </form>
      </div>

      {dialog?.kind === 'entrada' && (
        <EntradaModal
          variante={dialog.variante}
          productoNombre={producto.nombre}
          unidad={producto.unidad}
          proveedorId={producto.proveedor_id}
          coste={producto.coste}
          proveedores={proveedores}
          onClose={() => setDialog(null)}
          onDone={closeAndRefresh}
        />
      )}
      {dialog?.kind === 'ajuste' && (
        <AjusteModal
          variante={dialog.variante}
          productoNombre={producto.nombre}
          unidad={producto.unidad}
          onClose={() => setDialog(null)}
          onDone={(sinCambios) => {
            closeAndRefresh()
            setMessage(sinCambios ? t.inventario.ajuste.sinCambios : '')
          }}
        />
      )}
      {dialog?.kind === 'editar' && (
        <VarianteEditModal variante={dialog.variante} onClose={() => setDialog(null)} onDone={() => { setDialog(null); reload() }} />
      )}
      {dialog?.kind === 'variantes' && (
        <AddVariantesModal
          productoId={producto.id}
          referencia={producto.referencia ?? ''}
          stockMinimo={String(Number(producto.stock_minimo_defecto))}
          unidad={producto.unidad}
          onClose={() => setDialog(null)}
          onDone={closeAndRefresh}
        />
      )}
    </div>
  )
}
