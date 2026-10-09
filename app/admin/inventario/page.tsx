'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, Package, Plus, Search } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, PageHeader, api, btnPrimary, btnSecondary, formatMoney, inputClass, useApi } from '../_components/ui'
import InventarioTabs from './InventarioTabs'
import { type Categoria, type ProveedorOption, TipoBadge, useUnidad } from './shared'

interface ProductoRow {
  id: number
  nombre: string
  referencia: string | null
  marca: string | null
  unidad: string
  pvp: string | null
  foto_thumb_url: string | null
  categoria: string
  subtipo: string | null
  tipo: 'terminado' | 'material'
  proveedor: string | null
  variantes: number
  stock_total: string
  agotados: number
  bajos: number
}

const FILTER_KEYS = ['categoria', 'proveedor', 'tipo', 'alerta', 'archivados'] as const

export default function InventarioPage() {
  return (
    <Suspense>
      <InventarioList />
    </Suspense>
  )
}

function InventarioList() {
  const { t, locale } = useAdminI18n()
  const fmtUnidad = useUnidad()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [extra, setExtra] = useState<ProductoRow[]>([])
  const [hasMoreExtra, setHasMoreExtra] = useState<boolean | null>(null)

  // Filters live in the URL so the back button and shared links keep them
  const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, searchParams.get(k) ?? ''])) as Record<(typeof FILTER_KEYS)[number], string>
  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    router.replace(`${pathname}?${next}`)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((searchParams.get('q') ?? '') !== q) setFilter('q', q.trim())
    }, 250)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const listParams = new URLSearchParams(searchParams)
  const { data, loading } = useApi<{ productos: ProductoRow[] }>(`/api/admin/inventario/productos?${listParams}`)
  const { data: cats } = useApi<{ categorias: Categoria[] }>('/api/admin/inventario/categorias')
  const { data: provs } = useApi<{ proveedores: ProveedorOption[] }>('/api/admin/proveedores')

  // "Load more" pages are appended locally and reset whenever the filters change
  const [extraFor, setExtraFor] = useState('')
  if (extraFor !== listParams.toString()) {
    setExtraFor(listParams.toString())
    setExtra([])
    setHasMoreExtra(null)
  }
  const productos = [...(data?.productos ?? []), ...extra]
  const hasMore = hasMoreExtra ?? (data?.productos.length === 50)

  async function loadMore() {
    const params = new URLSearchParams(listParams)
    params.set('offset', String(productos.length))
    const more = await api<{ productos: ProductoRow[] }>(`/api/admin/inventario/productos?${params}`)
    setExtra((prev) => [...prev, ...more.productos])
    setHasMoreExtra(more.productos.length === 50)
  }

  const selectClass = `${inputClass} sm:w-auto`

  return (
    <div>
      <PageHeader
        title={t.inventario.title}
        actions={
          <Link href="/admin/inventario/nuevo" className={btnPrimary}>
            <Plus size={16} />
            {t.inventario.new}
          </Link>
        }
      />
      <InventarioTabs />

      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="search"
            placeholder={t.inventario.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={`${inputClass} pl-12`}
            aria-label={t.common.search}
          />
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          <select className={selectClass} value={filters.tipo} onChange={(e) => setFilter('tipo', e.target.value)} aria-label={t.inventario.filters.tipo}>
            <option value="">{t.inventario.filters.tipo}: {t.inventario.filters.todos}</option>
            <option value="terminado">{t.inventario.tipos.terminado}</option>
            <option value="material">{t.inventario.tipos.material}</option>
          </select>
          <select className={selectClass} value={filters.categoria} onChange={(e) => setFilter('categoria', e.target.value)} aria-label={t.inventario.filters.categoria}>
            <option value="">{t.inventario.filters.categoria}: {t.inventario.filters.todas}</option>
            {(['terminado', 'material'] as const).map((tipo) => (
              <optgroup key={tipo} label={t.inventario.tipos[tipo]}>
                {cats?.categorias.filter((c) => c.tipo === tipo && c.activo).map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <select className={selectClass} value={filters.proveedor} onChange={(e) => setFilter('proveedor', e.target.value)} aria-label={t.inventario.filters.proveedor}>
            <option value="">{t.inventario.filters.proveedor}: {t.inventario.filters.todos}</option>
            {provs?.proveedores.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          <select className={selectClass} value={filters.alerta} onChange={(e) => setFilter('alerta', e.target.value)} aria-label={t.inventario.filters.alerta}>
            <option value="">{t.inventario.filters.alerta}: {t.inventario.filters.todas}</option>
            <option value="cualquiera">{t.inventario.filters.cualquiera}</option>
            <option value="bajo">{t.inventario.alertas.bajo}</option>
            <option value="agotado">{t.inventario.alertas.agotado}</option>
          </select>
          <button type="button" className={`${btnSecondary} col-span-2 sm:col-span-1`} onClick={() => setFilter('archivados', filters.archivados ? '' : '1')}>
            {filters.archivados ? t.inventario.showActive : t.inventario.showArchived}
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : productos.length === 0 ? (
        <div className="text-gray-400">{t.inventario.empty}</div>
      ) : (
        <>
          <ul className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl divide-y divide-[#1E3A5F]">
            {productos.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/inventario/${p.id}`} className="flex items-center gap-4 px-4 sm:px-6 py-3 hover:bg-[#1E3A5F]/20 transition-colors">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#1E3A5F]/30 shrink-0 flex items-center justify-center">
                    {p.foto_thumb_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- Blob host isn't in next.config remotePatterns
                      <img src={p.foto_thumb_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <Package size={20} className="text-gray-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-medium truncate">{p.nombre}</div>
                    <div className="text-sm text-gray-400 truncate">
                      {[p.referencia, p.subtipo ? `${p.categoria} · ${p.subtipo}` : p.categoria, p.marca ?? p.proveedor].filter(Boolean).join(' · ')}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1 sm:hidden">
                      {p.agotados > 0 && <Badge tone="red">{t.inventario.alertas.agotado} · {p.agotados}</Badge>}
                      {p.bajos > 0 && <Badge tone="amber">{t.inventario.alertas.bajo} · {p.bajos}</Badge>}
                    </div>
                  </div>
                  <div className="hidden md:block shrink-0"><TipoBadge tipo={p.tipo} /></div>
                  <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 min-w-28">
                    <span className="text-white tabular-nums">{fmtUnidad(p.stock_total, p.unidad)}</span>
                    <span className="text-xs text-gray-500">
                      {p.variantes > 1 ? `${p.variantes} ${t.inventario.variantesSection.count}` : formatMoney(p.pvp, locale)}
                    </span>
                    <div className="flex gap-1.5">
                      {p.agotados > 0 && <Badge tone="red">{t.inventario.alertas.agotado} · {p.agotados}</Badge>}
                      {p.bajos > 0 && <Badge tone="amber">{t.inventario.alertas.bajo} · {p.bajos}</Badge>}
                    </div>
                  </div>
                  <span className="sm:hidden text-sm text-white tabular-nums shrink-0">{fmtUnidad(p.stock_total, p.unidad)}</span>
                  <ChevronRight size={18} className="text-gray-500 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="mt-4 text-center">
              <button type="button" className={btnSecondary} onClick={loadMore}>{t.clientes.loadMore}</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
