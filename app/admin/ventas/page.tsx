'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Plus, Search } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, PageHeader, api, btnPrimary, btnSecondary, formatMoney, inputClass, intlLocale, useApi } from '../_components/ui'
import VentasTabs from './VentasTabs'

interface VentaRow {
  id: number
  numero: string
  fecha: string
  total: string
  devuelto: string
  metodo_pago: string
  estado: 'completada' | 'devuelta_parcial' | 'devuelta'
  admin_nombre: string | null
  cliente: string | null
  lineas: number
}

export default function VentasPage() {
  const { t, locale } = useAdminI18n()
  const v = t.ventas
  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [extra, setExtra] = useState<{ key: string; rows: VentaRow[]; more: boolean }>({ key: '', rows: [], more: false })

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(q.trim()), 250)
    return () => clearTimeout(timer)
  }, [q])

  const params = new URLSearchParams(Object.entries({ q: debounced, desde, hasta }).filter(([, val]) => val))
  const key = params.toString()
  const { data, loading } = useApi<{ ventas: VentaRow[] }>(`/api/admin/ventas?${key}`)
  const ventas = [...(data?.ventas ?? []), ...(extra.key === key ? extra.rows : [])]
  const hasMore = extra.key === key ? extra.more : data?.ventas.length === 50

  async function loadMore() {
    const more = await api<{ ventas: VentaRow[] }>(`/api/admin/ventas?${key}&offset=${ventas.length}`)
    setExtra({ key, rows: [...(extra.key === key ? extra.rows : []), ...more.ventas], more: more.ventas.length === 50 })
  }

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }).format(new Date(iso))

  return (
    <div>
      <PageHeader
        title={v.title}
        actions={
          <Link href="/admin/ventas/nueva" className={btnPrimary}>
            <Plus size={16} />
            {v.new}
          </Link>
        }
      >
        <p className="text-xs text-gray-500 mt-1 max-w-xl">{v.noFiscal}</p>
      </PageHeader>
      <VentasTabs />

      <div className="grid grid-cols-2 sm:grid-cols-[1fr_auto_auto] gap-2 mb-6">
        <div className="relative col-span-2 sm:col-span-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="search" className={`${inputClass} pl-12`} placeholder={v.buscar} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t.common.search} />
        </div>
        <input type="date" className={inputClass} value={desde} onChange={(e) => setDesde(e.target.value)} aria-label={v.desde} />
        <input type="date" className={inputClass} value={hasta} onChange={(e) => setHasta(e.target.value)} aria-label={v.hasta} />
      </div>

      {loading && !data ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : ventas.length === 0 ? (
        <div className="text-gray-400">{v.empty}</div>
      ) : (
        <>
          <ul className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl divide-y divide-[#1E3A5F]">
            {ventas.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/ventas/${s.id}`} className="flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-[#1E3A5F]/20 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-white font-medium">{s.cliente || v.sinCliente}</span>
                      {s.estado !== 'completada' && <Badge tone={s.estado === 'devuelta' ? 'red' : 'amber'}>{v.estados[s.estado]}</Badge>}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {[s.numero, fmt(s.fecha), v.metodos[s.metodo_pago as keyof typeof v.metodos] ?? s.metodo_pago, s.admin_nombre].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-white tabular-nums">{formatMoney(s.total, locale)}</div>
                    {Number(s.devuelto) > 0 && <div className="text-xs text-red-300 tabular-nums">−{formatMoney(s.devuelto, locale)}</div>}
                  </div>
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
