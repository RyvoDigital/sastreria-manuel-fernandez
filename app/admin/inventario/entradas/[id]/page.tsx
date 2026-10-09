'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Card, PageHeader, formatDate, formatMoney, useApi } from '../../../_components/ui'
import InventarioTabs from '../../InventarioTabs'
import { useUnidad } from '../../shared'

interface Detalle {
  compra: { numero: string; fecha: string; proveedor: string; proveedor_id: number; referencia_proveedor: string | null; notas: string | null; admin_nombre: string | null; created_at: string }
  lineas: { id: number; producto_id: number; producto: string; etiqueta: string | null; es_unica: boolean; sku: string | null; unidad: string; cantidad: string; coste_unitario: string }[]
}

export default function EntradaDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { t, locale } = useAdminI18n()
  const fmtUnidad = useUnidad()
  const e = t.inventario.entradas
  const { data, error } = useApi<Detalle>(`/api/admin/inventario/compras/${id}`)

  if (error) return <div className="text-gray-400">{t.common.noData}</div>
  if (!data) return <div className="text-gray-400">{t.common.loading}</div>
  const { compra, lineas } = data
  const total = lineas.reduce((sum, l) => sum + Number(l.cantidad) * Number(l.coste_unitario), 0)

  return (
    <div>
      <PageHeader back={{ href: '/admin/inventario/entradas', label: e.back }} title={`${compra.numero} · ${compra.proveedor}`}>
        <p className="text-sm text-gray-400 mt-1">
          {[formatDate(compra.fecha, locale), compra.referencia_proveedor && `${e.refProveedor}: ${compra.referencia_proveedor}`, compra.admin_nombre && `${e.registradaPor}: ${compra.admin_nombre}`].filter(Boolean).join(' · ')}
        </p>
      </PageHeader>
      <InventarioTabs />

      <Card>
        <ul className="divide-y divide-[#1E3A5F] -my-3">
          {lineas.map((l) => (
            <li key={l.id} className="py-3 flex items-center gap-4 text-sm">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/inventario/${l.producto_id}`} className="text-white hover:text-[#C9A84C]">
                  {l.producto}{!l.es_unica && l.etiqueta && <span className="text-gray-400"> · {l.etiqueta}</span>}
                </Link>
                {l.sku && <div className="text-xs text-gray-500">{l.sku}</div>}
              </div>
              <div className="text-gray-300 tabular-nums">{fmtUnidad(l.cantidad, l.unidad)} × {formatMoney(l.coste_unitario, locale)}</div>
              <div className="text-white tabular-nums w-24 text-right">{formatMoney(Number(l.cantidad) * Number(l.coste_unitario), locale)}</div>
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-4 border-t border-[#1E3A5F] mt-3 pt-4 text-sm">
          <span className="text-gray-400">{e.total}</span>
          <span className="text-white tabular-nums font-medium">{formatMoney(total, locale)}</span>
        </div>
        {compra.notas && <p className="text-sm text-gray-300 mt-4 whitespace-pre-line">{compra.notas}</p>}
      </Card>
    </div>
  )
}
