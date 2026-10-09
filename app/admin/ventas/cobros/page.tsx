'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAdminI18n } from '@/lib/admin/i18n'
import { toCents } from '@/lib/admin/ventas-calc'
import { Badge, Card, Field, PageHeader, formatMoney, inputClass, intlLocale, useApi } from '../../_components/ui'
import VentasTabs from '../VentasTabs'

interface Cobro {
  origen: 'venta' | 'devolucion' | 'online' | 'encargo'
  id: number
  referencia: string
  fecha: string
  importe: string
  metodo: string
  pagos: { metodo: string; importe: string }[] | null
  cliente: string | null
}

const hoy = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' })

export default function CobrosPage() {
  const { t, locale } = useAdminI18n()
  const v = t.ventas
  const [desde, setDesde] = useState(hoy)
  const [hasta, setHasta] = useState(hoy)
  const { data, loading } = useApi<{ cobros: Cobro[] }>(desde && hasta ? `/api/admin/ventas/cobros?desde=${desde}&hasta=${hasta}` : null)
  const cobros = data?.cobros ?? []

  // Cash-up totals per method; mixed payments are split into their parts
  const porMetodo = new Map<string, number>()
  for (const c of cobros) {
    const parts = c.pagos ?? [{ metodo: c.metodo, importe: c.importe }]
    for (const p of parts) porMetodo.set(p.metodo, (porMetodo.get(p.metodo) ?? 0) + toCents(p.importe))
  }
  const total = [...porMetodo.values()].reduce((s, x) => s + x, 0)
  const metodo = (m: string) => (m === 'stripe' ? v.online : v.metodos[m as keyof typeof v.metodos] ?? m)
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }).format(new Date(iso))

  return (
    <div>
      <PageHeader title={v.title}>
        <p className="text-xs text-gray-500 mt-1 max-w-xl">{v.cobrosHelp}</p>
      </PageHeader>
      <VentasTabs />

      <div className="grid grid-cols-2 sm:w-96 gap-3 mb-6">
        <Field label={v.desde}><input type="date" className={inputClass} value={desde} onChange={(e) => setDesde(e.target.value)} /></Field>
        <Field label={v.hasta}><input type="date" className={inputClass} value={hasta} onChange={(e) => setHasta(e.target.value)} /></Field>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6 items-start">
        <Card>
          {loading ? (
            <p className="text-sm text-gray-400">{t.common.loading}</p>
          ) : cobros.length === 0 ? (
            <p className="text-sm text-gray-400">{v.sinCobros}</p>
          ) : (
            <ul className="divide-y divide-[#1E3A5F] -my-3">
              {cobros.map((c) => {
                const body = (
                  <>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-white">{c.cliente || v.sinCliente}</span>
                        {c.origen !== 'venta' && <Badge tone={c.origen === 'devolucion' ? 'red' : 'neutral'}>{v.origenes[c.origen]}</Badge>}
                      </div>
                      <div className="text-xs text-gray-500">{[c.referencia, fmt(c.fecha), c.pagos ? c.pagos.map((p) => metodo(p.metodo)).join(' + ') : metodo(c.metodo)].join(' · ')}</div>
                    </div>
                    <span className={`tabular-nums ${Number(c.importe) < 0 ? 'text-red-300' : 'text-white'}`}>{formatMoney(c.importe, locale)}</span>
                  </>
                )
                const href = c.origen === 'online' ? null : c.origen === 'encargo' ? `/admin/encargos/${c.id}` : `/admin/ventas/${c.id}`
                return (
                  <li key={`${c.origen}-${c.origen === 'venta' || c.origen === 'devolucion' ? c.referencia : `${c.id}-${c.fecha}`}`}>
                    {href ? (
                      <Link href={href} className="py-3 flex items-center gap-4 text-sm hover:bg-[#1E3A5F]/20 -mx-2 px-2 rounded">{body}</Link>
                    ) : (
                      <div className="py-3 flex items-center gap-4 text-sm">{body}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card title={v.porMetodo}>
          <dl className="space-y-1.5 text-sm">
            {[...porMetodo.entries()].map(([m, c]) => (
              <div key={m} className="flex justify-between text-gray-300">
                <dt>{metodo(m)}</dt>
                <dd className="tabular-nums">{formatMoney(c / 100, locale)}</dd>
              </div>
            ))}
            <div className="flex justify-between text-white text-lg pt-2 border-t border-[#1E3A5F]">
              <dt className="font-serif">{v.total}</dt>
              <dd className="tabular-nums">{formatMoney(total / 100, locale)}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
