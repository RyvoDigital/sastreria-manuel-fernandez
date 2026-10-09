'use client'

import Link from 'next/link'
import { ChevronRight, Plus } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { PageHeader, btnPrimary, formatDate, formatMoney, useApi } from '../../_components/ui'
import InventarioTabs from '../InventarioTabs'

interface CompraRow {
  id: number
  numero: string
  fecha: string
  referencia_proveedor: string | null
  proveedor: string
  admin_nombre: string | null
  lineas: number
  total: string
}

export default function EntradasPage() {
  const { t, locale } = useAdminI18n()
  const e = t.inventario.entradas
  const { data, loading } = useApi<{ compras: CompraRow[] }>('/api/admin/inventario/compras')

  return (
    <div>
      <PageHeader
        title={t.inventario.title}
        actions={
          <Link href="/admin/inventario/entradas/nueva" className={btnPrimary}>
            <Plus size={16} />
            {e.new}
          </Link>
        }
      />
      <InventarioTabs />

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : !data?.compras.length ? (
        <div className="text-gray-400">{e.empty}</div>
      ) : (
        <ul className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl divide-y divide-[#1E3A5F]">
          {data.compras.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/inventario/entradas/${c.id}`} className="flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-[#1E3A5F]/20 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium">{c.proveedor}</div>
                  <div className="text-sm text-gray-400 truncate">
                    {[c.numero, formatDate(c.fecha, locale), c.referencia_proveedor, c.admin_nombre].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white tabular-nums">{formatMoney(c.total, locale)}</div>
                  <div className="text-xs text-gray-500">{c.lineas} {e.lineas.toLowerCase()}</div>
                </div>
                <ChevronRight size={18} className="text-gray-500 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
