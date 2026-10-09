'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, Card, useApi } from './ui'
import { formatQty } from '../inventario/shared'

interface Alertas {
  agotados: number
  bajos: number
  items: {
    variante_id: number
    producto_id: number
    producto: string
    etiqueta: string | null
    es_unica: boolean
    stock_actual: string
    stock_minimo: string
    unidad: string
    alerta: 'agotado' | 'bajo'
  }[]
}

export default function StockAlertsCard() {
  const { t, locale } = useAdminI18n()
  const { data } = useApi<Alertas>('/api/admin/inventario/alertas?limit=8')
  const p = t.inventario.panel

  return (
    <Card
      title={<span className="flex items-center gap-2"><AlertTriangle size={18} className="text-amber-400" />{p.alertas}</span>}
      actions={
        data && data.agotados + data.bajos > 0 ? (
          <Link href="/admin/inventario?alerta=cualquiera" className="text-sm text-[#C9A84C] hover:text-[#D4B76A]">
            {p.verTodas} ({data.agotados + data.bajos})
          </Link>
        ) : undefined
      }
    >
      {!data ? (
        <p className="text-sm text-gray-400">{t.common.loading}</p>
      ) : data.items.length === 0 ? (
        <p className="text-sm text-gray-400">{p.sinAlertas}</p>
      ) : (
        <ul className="divide-y divide-[#1E3A5F] -my-2">
          {data.items.map((a) => (
            <li key={a.variante_id}>
              <Link href={`/admin/inventario/${a.producto_id}`} className="py-2.5 flex items-center gap-3 text-sm hover:text-[#C9A84C]">
                <span className="flex-1 min-w-0 truncate text-white">
                  {a.producto}
                  {!a.es_unica && a.etiqueta && <span className="text-gray-400"> · {a.etiqueta}</span>}
                </span>
                <span className="text-gray-400 tabular-nums shrink-0">
                  {formatQty(a.stock_actual, locale)} / {formatQty(a.stock_minimo, locale)}
                </span>
                <Badge tone={a.alerta === 'agotado' ? 'red' : 'amber'}>{t.inventario.alertas[a.alerta]}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
