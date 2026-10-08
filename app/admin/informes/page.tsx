'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Field, PageHeader, inputClass, useApi } from '../_components/ui'
import type { Categoria } from '../inventario/shared'
import ReportTable, { type Column, type Row } from './ReportTable'

const INFORMES = ['ventas', 'stock', 'valoracion', 'movimientos', 'alertas'] as const
type Informe = (typeof INFORMES)[number]

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' })
const iso = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' })

function presets() {
  const now = new Date(`${today()}T12:00:00`)
  const y = now.getFullYear()
  const m = now.getMonth()
  return {
    hoy: [today(), today()],
    mes: [iso(new Date(y, m, 1, 12)), today()],
    mesAnterior: [iso(new Date(y, m - 1, 1, 12)), iso(new Date(y, m, 0, 12))],
    anio: [iso(new Date(y, 0, 1, 12)), today()],
  } as const
}

export default function InformesPage() {
  return (
    <Suspense>
      <Informes />
    </Suspense>
  )
}

function Informes() {
  const { t } = useAdminI18n()
  const sp = useSearchParams()
  const actual = (INFORMES as readonly string[]).includes(sp.get('r') ?? '') ? (sp.get('r') as Informe) : 'ventas'

  return (
    <div>
      <PageHeader title={t.informes.title} />
      <nav className="flex gap-1 mb-6 border-b border-[#1E3A5F] overflow-x-auto" aria-label={t.informes.title}>
        {INFORMES.map((r) => (
          <Link
            key={r}
            href={`/admin/informes?r=${r}`}
            aria-current={actual === r ? 'page' : undefined}
            className={`px-4 py-3 -mb-px text-sm whitespace-nowrap border-b-2 transition-colors ${
              actual === r ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {t.informes.tabs[r]}
          </Link>
        ))}
      </nav>
      {actual === 'ventas' && <VentasReport />}
      {actual === 'stock' && <StockReport />}
      {actual === 'valoracion' && <ValoracionReport />}
      {actual === 'movimientos' && <MovimientosReport />}
      {actual === 'alertas' && <AlertasReport />}
    </div>
  )
}

function Rango({ desde, hasta, onChange }: { desde: string; hasta: string; onChange: (d: string, h: string) => void }) {
  const { t } = useAdminI18n()
  const p = presets()
  return (
    <>
      <Field label={t.ventas.desde}><input type="date" className={inputClass} value={desde} onChange={(e) => onChange(e.target.value, hasta)} /></Field>
      <Field label={t.ventas.hasta}><input type="date" className={inputClass} value={hasta} onChange={(e) => onChange(desde, e.target.value)} /></Field>
      <div className="col-span-2 sm:col-span-full flex flex-wrap gap-2">
        {(Object.keys(p) as (keyof typeof p)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onChange(p[k][0], p[k][1])}
            className={`px-3 py-1.5 rounded-full text-xs border ${desde === p[k][0] && hasta === p[k][1] ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-[#1E3A5F] text-gray-400 hover:text-white'}`}
          >
            {t.informes.presets[k]}
          </button>
        ))}
      </div>
    </>
  )
}

function TipoCategoria({ tipo, categoria, onTipo, onCategoria }: { tipo: string; categoria?: string; onTipo: (v: string) => void; onCategoria?: (v: string) => void }) {
  const { t } = useAdminI18n()
  const { data } = useApi<{ categorias: Categoria[] }>(onCategoria ? '/api/admin/inventario/categorias' : null)
  return (
    <>
      <Field label={t.inventario.filters.tipo}>
        <select className={inputClass} value={tipo} onChange={(e) => onTipo(e.target.value)}>
          <option value="">{t.inventario.filters.todos}</option>
          <option value="terminado">{t.inventario.tipos.terminado}</option>
          <option value="material">{t.inventario.tipos.material}</option>
        </select>
      </Field>
      {onCategoria && (
        <Field label={t.inventario.filters.categoria}>
          <select className={inputClass} value={categoria} onChange={(e) => onCategoria(e.target.value)}>
            <option value="">{t.inventario.filters.todas}</option>
            {data?.categorias.filter((c) => !tipo || c.tipo === tipo).map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </Field>
      )}
    </>
  )
}

function Filtros({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 items-end">{children}</div>
}

function useReport(informe: string, params: Record<string, string | undefined>) {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][])
  return useApi<{ rows: Row[]; agrupar?: string }>(`/api/admin/informes/${informe}?${qs}`)
}

function Loading({ loading, error, children }: { loading: boolean; error: string | null; children: React.ReactNode }) {
  const { t } = useAdminI18n()
  if (error) return <p className="text-sm text-red-400">{t.gestionCommon.error}</p>
  if (loading) return <p className="text-sm text-gray-400">{t.common.loading}</p>
  return <>{children}</>
}

// ── Ventas ──

function VentasReport() {
  const { t } = useAdminI18n()
  const r = t.informes
  const [[desde, hasta], setRango] = useState<[string, string]>(() => [...presets().mes] as [string, string])
  const [agrupar, setAgrupar] = useState('dia')
  const [tipo, setTipo] = useState('')
  const [categoria, setCategoria] = useState('')
  const { data, loading, error } = useReport('ventas', { desde, hasta, agrupar, tipo, categoria })
  const metodo = (m: unknown) => t.ventas.metodos[m as keyof typeof t.ventas.metodos] ?? String(m)

  const grupoCol: Column = {
    key: 'grupo',
    label: r.agrupaciones[agrupar as keyof typeof r.agrupaciones],
    kind: agrupar === 'dia' || agrupar === 'mes' ? 'date' : 'text',
    wide: agrupar === 'producto' || agrupar === 'cliente',
    format: (row) => agrupar === 'metodo' ? metodo(row.grupo) : row.grupo == null || row.grupo === '' ? r.sinAsignar[agrupar as keyof typeof r.sinAsignar] ?? '—' : String(row.grupo),
    href: (row) => agrupar === 'producto' && row.producto_id ? `/admin/inventario/${row.producto_id}` : agrupar === 'cliente' && row.cliente_id ? `/admin/clientes/${row.cliente_id}` : null,
  }
  const columns: Column[] = [
    grupoCol,
    { key: 'ventas', label: r.cols.ventas, kind: 'int', total: agrupar === 'dia' || agrupar === 'mes' || agrupar === 'metodo' || agrupar === 'vendedor' },
    { key: 'unidades', label: r.cols.unidades, kind: 'qty' },
    { key: 'bruto', label: r.cols.bruto, kind: 'money', total: true },
    { key: 'devuelto', label: r.cols.devuelto, kind: 'money', total: true },
    { key: 'total', label: r.cols.totalNeto, kind: 'money', total: true },
    { key: 'base', label: r.cols.base, kind: 'money', total: true },
    { key: 'iva', label: r.cols.iva, kind: 'money', total: true },
    { key: 'coste', label: r.cols.coste, kind: 'money', total: true },
    { key: 'margen', label: r.cols.margen, kind: 'money', total: true },
  ]

  return (
    <div>
      <Filtros>
        <Rango desde={desde} hasta={hasta} onChange={(d, h) => setRango([d, h])} />
        <Field label={r.agrupar}>
          <select className={inputClass} value={agrupar} onChange={(e) => setAgrupar(e.target.value)}>
            {Object.entries(r.agrupaciones).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </Field>
        <TipoCategoria tipo={tipo} categoria={categoria} onTipo={setTipo} onCategoria={setCategoria} />
      </Filtros>
      <p className="text-xs text-gray-500 mb-4 max-w-3xl">{r.ventasHelp}</p>
      <Loading loading={loading && !data} error={error}>
        <ReportTable columns={columns} rows={data?.rows ?? []} filename={`ventas-${agrupar}-${desde}_${hasta}.csv`} empty={r.vacio} />
        {data?.rows.some((row) => row.coste_incompleto) && <p className="text-xs text-amber-400 mt-3">{r.costeIncompleto}</p>}
      </Loading>
    </div>
  )
}

// ── Stock actual ──

function StockReport() {
  const { t } = useAdminI18n()
  const r = t.informes
  const [tipo, setTipo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [conStock, setConStock] = useState(true)
  const { data, loading, error } = useReport('stock', { tipo, categoria, conStock: conStock ? '1' : undefined })
  const unidad = (row: Row) => t.inventario.unidades[row.unidad as keyof typeof t.inventario.unidades] ?? String(row.unidad)
  const columns: Column[] = [
    { key: 'producto', label: r.cols.producto, wide: true, href: (row) => `/admin/inventario/${row.producto_id}` },
    { key: 'variante', label: r.cols.variante },
    { key: 'sku', label: 'SKU' },
    { key: 'categoria', label: r.cols.categoria },
    { key: 'ubicacion', label: r.cols.ubicacion },
    { key: 'stock', label: r.cols.stock, kind: 'qty' },
    { key: 'unidad', label: r.cols.unidad, format: unidad },
    { key: 'minimo', label: r.cols.minimo, kind: 'qty' },
    { key: 'reservado', label: r.cols.reservado, kind: 'qty' },
    { key: 'coste_unitario', label: r.cols.costeUnitario, kind: 'money' },
    { key: 'valor_coste', label: r.cols.valorCoste, kind: 'money', total: true },
    { key: 'pvp', label: r.cols.pvp, kind: 'money' },
    { key: 'valor_pvp', label: r.cols.valorPvp, kind: 'money', total: true },
    { key: 'alerta', label: r.cols.alerta, format: (row) => (row.alerta ? t.inventario.alertas[row.alerta as 'bajo' | 'agotado'] : '') },
  ]
  return (
    <div>
      <Filtros>
        <TipoCategoria tipo={tipo} categoria={categoria} onTipo={setTipo} onCategoria={setCategoria} />
        <label className="flex items-center gap-3 text-sm text-gray-300 min-h-11 col-span-2">
          <input type="checkbox" className="w-5 h-5 accent-[#C9A84C]" checked={conStock} onChange={(e) => setConStock(e.target.checked)} />
          {r.soloConStock}
        </label>
      </Filtros>
      <Loading loading={loading && !data} error={error}>
        <ReportTable columns={columns} rows={data?.rows ?? []} filename={`stock-${today()}.csv`} empty={r.vacio} />
      </Loading>
    </div>
  )
}

// ── Valoración ──

function ValoracionReport() {
  const { t } = useAdminI18n()
  const r = t.informes
  const [tipo, setTipo] = useState('')
  const { data, loading, error } = useReport('valoracion', { tipo })
  const columns: Column[] = [
    { key: 'categoria', label: r.cols.categoria, href: (row) => `/admin/inventario?categoria=${row.categoria_id}` },
    { key: 'tipo', label: r.cols.tipo, format: (row) => t.inventario.tipos[row.tipo as 'terminado' | 'material'] },
    { key: 'productos', label: r.cols.productos, kind: 'int', total: true },
    { key: 'valor_coste', label: r.cols.valorCoste, kind: 'money', total: true },
    { key: 'valor_pvp', label: r.cols.valorPvp, kind: 'money', total: true },
    { key: 'valor_pvp_base', label: r.cols.valorPvpBase, kind: 'money', total: true },
    { key: 'margen_potencial', label: r.cols.margenPotencial, kind: 'money', total: true },
  ]
  return (
    <div>
      <Filtros>
        <TipoCategoria tipo={tipo} onTipo={setTipo} />
      </Filtros>
      <p className="text-xs text-gray-500 mb-4 max-w-3xl">{r.valoracionHelp}</p>
      <Loading loading={loading && !data} error={error}>
        <ReportTable columns={columns} rows={data?.rows ?? []} filename={`valoracion-${today()}.csv`} empty={r.vacio} />
        {data?.rows.some((row) => Number(row.sin_coste) > 0) && <p className="text-xs text-amber-400 mt-3">{r.sinCoste}</p>}
      </Loading>
    </div>
  )
}

// ── Movimientos ──

const TIPOS_MOV = ['inicial', 'compra', 'venta', 'devolucion_venta', 'ajuste', 'devolucion_proveedor', 'consumo_encargo', 'devolucion_encargo'] as const

function MovimientosReport() {
  const { t } = useAdminI18n()
  const r = t.informes
  const [[desde, hasta], setRango] = useState<[string, string]>(() => [...presets().mes] as [string, string])
  const [tipo, setTipo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [movimiento, setMovimiento] = useState('')
  const [usuario, setUsuario] = useState('')
  const { data: users } = useApi<{ usuarios: { id: number; name: string }[] }>('/api/admin/usuarios')
  const { data, loading, error } = useReport('movimientos', { desde, hasta, tipo, categoria, movimiento, usuario })
  const m = t.inventario.movimientos.tipos
  const columns: Column[] = [
    { key: 'fecha', label: r.cols.fecha, kind: 'datetime' },
    { key: 'producto', label: r.cols.producto, wide: true, href: (row) => `/admin/inventario/${row.producto_id}` },
    { key: 'variante', label: r.cols.variante },
    { key: 'tipo', label: r.cols.tipo, format: (row) => m[row.tipo as keyof typeof m] ?? String(row.tipo) },
    { key: 'cantidad', label: r.cols.cantidad, kind: 'qty' },
    { key: 'unidad', label: r.cols.unidad, format: (row) => t.inventario.unidades[row.unidad as keyof typeof t.inventario.unidades] ?? String(row.unidad) },
    { key: 'stock_resultante', label: r.cols.stock, kind: 'qty' },
    { key: 'coste_unitario', label: r.cols.costeUnitario, kind: 'money' },
    { key: 'valor_coste', label: r.cols.valorCoste, kind: 'money', total: true },
    { key: 'usuario', label: r.cols.usuario },
    {
      key: 'documento', label: r.cols.documento,
      href: (row) => row.documento_tipo === 'compra' ? `/admin/inventario/entradas/${row.documento_id}` : row.documento_tipo === 'venta' ? `/admin/ventas/${row.documento_id}` : null,
    },
    { key: 'motivo', label: r.cols.motivo, wide: true, format: (row) => [row.motivo ? t.inventario.ajuste.motivos[row.motivo as keyof typeof t.inventario.ajuste.motivos] : '', row.nota].filter(Boolean).join(' · ') },
  ]
  return (
    <div>
      <Filtros>
        <Rango desde={desde} hasta={hasta} onChange={(d, h) => setRango([d, h])} />
        <TipoCategoria tipo={tipo} categoria={categoria} onTipo={setTipo} onCategoria={setCategoria} />
        <Field label={r.cols.tipo}>
          <select className={inputClass} value={movimiento} onChange={(e) => setMovimiento(e.target.value)}>
            <option value="">{t.inventario.filters.todos}</option>
            {TIPOS_MOV.map((k) => <option key={k} value={k}>{m[k]}</option>)}
          </select>
        </Field>
        <Field label={r.cols.usuario}>
          <select className={inputClass} value={usuario} onChange={(e) => setUsuario(e.target.value)}>
            <option value="">{t.inventario.filters.todos}</option>
            {users?.usuarios.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </Field>
      </Filtros>
      <Loading loading={loading && !data} error={error}>
        <ReportTable columns={columns} rows={data?.rows ?? []} filename={`movimientos-${desde}_${hasta}.csv`} empty={r.vacio} />
      </Loading>
    </div>
  )
}

// ── Stock bajo / agotado ──

function AlertasReport() {
  const { t } = useAdminI18n()
  const r = t.informes
  const { data, loading, error } = useReport('alertas', {})
  const columns: Column[] = [
    { key: 'producto', label: r.cols.producto, wide: true, href: (row) => `/admin/inventario/${row.producto_id}` },
    { key: 'etiqueta', label: r.cols.variante, format: (row) => (row.es_unica ? '' : String(row.etiqueta ?? '')) },
    { key: 'sku', label: 'SKU' },
    { key: 'categoria', label: r.cols.categoria },
    { key: 'stock_actual', label: r.cols.stock, kind: 'qty' },
    { key: 'stock_reservado', label: r.cols.reservado, kind: 'qty' },
    { key: 'stock_minimo', label: r.cols.minimo, kind: 'qty' },
    { key: 'unidad', label: r.cols.unidad, format: (row) => t.inventario.unidades[row.unidad as keyof typeof t.inventario.unidades] ?? String(row.unidad) },
    { key: 'alerta', label: r.cols.alerta, format: (row) => t.inventario.alertas[row.alerta as 'bajo' | 'agotado'] },
  ]
  return (
    <Loading loading={loading && !data} error={error}>
      <ReportTable columns={columns} rows={data?.rows ?? []} filename={`stock-bajo-${today()}.csv`} empty={t.inventario.panel.sinAlertas} />
    </Loading>
  )
}
