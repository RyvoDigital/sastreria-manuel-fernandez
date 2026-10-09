'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PackageSearch, Plus } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, Card, ErrorText, api, btnSecondary, formatDate, inputClass, useApi } from './ui'
import { formatQty } from '../inventario/shared'

interface Item {
  id: number
  descripcion: string
  cantidad: string
  estado: 'pendiente' | 'pedido' | 'resuelto'
  notas: string | null
  created_at: string
  producto_id: number | null
  cliente_id: number | null
  cliente: string | null
}

// Things a customer wanted when there was no stock: added from a sale or by hand, closed once resolved
export default function PorPedirCard() {
  const { t, locale } = useAdminI18n()
  const p = t.porPedir
  const { data, reload } = useApi<{ items: Item[] }>('/api/admin/por-pedir')
  const [descripcion, setDescripcion] = useState('')
  const [cantidad, setCantidad] = useState('1')
  const [error, setError] = useState('')

  async function run(fn: () => Promise<unknown>) {
    setError('')
    try {
      await fn()
      reload()
    } catch {
      setError(t.gestionCommon.error)
    }
  }

  return (
    <Card title={<span className="flex items-center gap-2"><PackageSearch size={18} className="text-[#C9A84C]" />{p.title}</span>}>
      {!data ? (
        <p className="text-sm text-gray-400">{t.common.loading}</p>
      ) : data.items.length === 0 ? (
        <p className="text-sm text-gray-400">{p.vacio}</p>
      ) : (
        <ul className="divide-y divide-[#1E3A5F] -my-2 mb-4">
          {data.items.map((item) => (
            <li key={item.id} className="py-2.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <div className="flex-1 min-w-48">
                <div className="text-white">
                  {item.producto_id ? (
                    <Link href={`/admin/inventario/${item.producto_id}`} className="hover:text-[#C9A84C]">{item.descripcion}</Link>
                  ) : item.descripcion}
                  <span className="text-gray-400 tabular-nums"> × {formatQty(item.cantidad, locale)}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {[
                    item.cliente && (item.cliente_id ? item.cliente : null),
                    formatDate(item.created_at, locale),
                    item.notas,
                  ].filter(Boolean).join(' · ')}
                </div>
              </div>
              <Badge tone={item.estado === 'pedido' ? 'neutral' : 'amber'}>{p.estados[item.estado]}</Badge>
              <div className="flex gap-1.5">
                {item.estado === 'pendiente' && (
                  <button type="button" className={btnSecondary} onClick={() => run(() => api(`/api/admin/por-pedir/${item.id}`, { method: 'PATCH', body: { estado: 'pedido' } }))}>
                    {p.marcarPedido}
                  </button>
                )}
                <button type="button" className={btnSecondary} onClick={() => run(() => api(`/api/admin/por-pedir/${item.id}`, { method: 'PATCH', body: { estado: 'resuelto' } }))}>
                  {p.marcarResuelto}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <form
        className="flex flex-wrap gap-2 mt-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!descripcion.trim()) return
          run(async () => {
            await api('/api/admin/por-pedir', { method: 'POST', body: { descripcion, cantidad } })
            setDescripcion('')
            setCantidad('1')
          })
        }}
      >
        <input className={`${inputClass} flex-1 min-w-48`} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder={p.placeholder} aria-label={p.placeholder} />
        <input className={`${inputClass} w-20 tabular-nums`} inputMode="decimal" value={cantidad} onChange={(e) => setCantidad(e.target.value)} aria-label={t.ventas.cantidad} />
        <button type="submit" className={btnSecondary}><Plus size={16} />{p.add}</button>
      </form>
      <ErrorText>{error}</ErrorText>
    </Card>
  )
}
