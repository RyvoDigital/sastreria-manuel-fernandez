'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAdminI18n } from '@/lib/admin/i18n'
import { api, btnSecondary, inputClass, intlLocale, useApi } from '../../_components/ui'
import { formatQty } from '../shared'
import { varianteNombre, type Variante } from './modals'

interface Movimiento {
  id: number
  variante_id: number
  tipo: string
  cantidad: string
  stock_resultante: string
  motivo: string | null
  nota: string | null
  admin_nombre: string | null
  created_at: string
  etiqueta: string | null
  es_unica: boolean
  compra_id: number | null
  compra_numero: string | null
}

export default function Movimientos({ productoId, unidad, variantes, version }: {
  productoId: number
  unidad: string
  variantes: Variante[]
  version: number
}) {
  const { t, locale } = useAdminI18n()
  const m = t.inventario.movimientos
  const [variante, setVariante] = useState('')
  const url = `/api/admin/inventario/productos/${productoId}/movimientos?${new URLSearchParams(variante ? { variante } : {})}&v=${version}`
  const { data, loading } = useApi<{ movimientos: Movimiento[] }>(url)
  const [extra, setExtra] = useState<{ url: string; rows: Movimiento[]; more: boolean }>({ url: '', rows: [], more: true })
  const rows = [...(data?.movimientos ?? []), ...(extra.url === url ? extra.rows : [])]
  const hasMore = extra.url === url ? extra.more : data?.movimientos.length === 100

  async function loadMore() {
    const more = await api<{ movimientos: Movimiento[] }>(`${url}&offset=${rows.length}`)
    setExtra({ url, rows: [...(extra.url === url ? extra.rows : []), ...more.movimientos], more: more.movimientos.length === 100 })
  }

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }).format(new Date(iso))
  const u = t.inventario.unidades[unidad as keyof typeof t.inventario.unidades] ?? unidad
  const multi = variantes.length > 1

  return (
    <div>
      {multi && (
        <select className={`${inputClass} mb-4`} value={variante} onChange={(e) => setVariante(e.target.value)} aria-label={t.inventario.variantesSection.etiqueta}>
          <option value="">{m.todasVariantes}</option>
          {variantes.map((v) => <option key={v.id} value={v.id}>{varianteNombre(v, t.inventario.variantesSection.unica)}</option>)}
        </select>
      )}

      {loading && !data ? (
        <p className="text-sm text-gray-400">{t.common.loading}</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400">{m.empty}</p>
      ) : (
        <>
          <ul className="divide-y divide-[#1E3A5F] -my-2">
            {rows.map((r) => {
              const qty = Number(r.cantidad)
              return (
                <li key={r.id} className="py-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 text-sm">
                  <div className="text-white">
                    {m.tipos[r.tipo as keyof typeof m.tipos] ?? r.tipo}
                    {multi && !r.es_unica && <span className="text-gray-400"> · {r.etiqueta}</span>}
                  </div>
                  <div className={`text-right tabular-nums font-medium ${qty > 0 ? 'text-emerald-400' : 'text-red-300'}`}>
                    {qty > 0 ? '+' : '−'}{formatQty(Math.abs(qty), locale)} {u}
                  </div>
                  <div className="text-xs text-gray-500">
                    {fmtDate(r.created_at)}
                    {r.admin_nombre && ` · ${r.admin_nombre}`}
                    {r.compra_numero && (
                      <> · <Link href={`/admin/inventario/entradas/${r.compra_id}`} className="text-[#C9A84C] hover:text-[#D4B76A]">{r.compra_numero}</Link></>
                    )}
                    {r.motivo && ` · ${t.inventario.ajuste.motivos[r.motivo as keyof typeof t.inventario.ajuste.motivos] ?? r.motivo}`}
                    {r.nota && ` · ${r.nota}`}
                  </div>
                  <div className="text-xs text-gray-500 text-right tabular-nums">{m.resultante}: {formatQty(r.stock_resultante, locale)}</div>
                </li>
              )
            })}
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
