'use client'

import Link from 'next/link'
import { CalendarDays, Package, Receipt, TrendingUp, UserPlus } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { formatMoney, useApi } from './ui'

interface Kpis {
  ventas_hoy: string
  tickets_hoy: number
  ventas_mes: string
  tickets_mes: number
  valor_inventario: string
  clientes_nuevos_mes: number
  citas_7_dias: number
}

// Shop key numbers at the top of the Panel; each card opens the report behind it
export default function PanelKpis() {
  const { t, locale } = useAdminI18n()
  const k = t.informes.panel
  const { data } = useApi<Kpis>('/api/admin/informes/panel')

  const cards = [
    { href: '/admin/ventas/cobros', icon: Receipt, label: k.ventasHoy, value: data && formatMoney(data.ventas_hoy, locale), sub: data && `${data.tickets_hoy} ${k.tickets}` },
    { href: '/admin/informes?r=ventas', icon: TrendingUp, label: k.ventasMes, value: data && formatMoney(data.ventas_mes, locale), sub: data && `${data.tickets_mes} ${k.tickets}` },
    { href: '/admin/informes?r=valoracion', icon: Package, label: k.valorInventario, value: data && formatMoney(data.valor_inventario, locale), sub: k.aCoste },
    { href: '/admin/clientes', icon: UserPlus, label: k.clientesNuevos, value: data?.clientes_nuevos_mes, sub: k.esteMes },
    { href: '/admin/bookings', icon: CalendarDays, label: k.citas7, value: data?.citas_7_dias, sub: k.confirmadas },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((c) => (
        <Link key={c.href} href={c.href} className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-4 sm:p-5 hover:border-[#C9A84C]/50 transition-colors last:col-span-2 lg:last:col-span-1">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <c.icon size={16} className="text-[#C9A84C] shrink-0" />
            <span className="text-xs sm:text-sm truncate">{c.label}</span>
          </div>
          <div className="text-xl sm:text-2xl font-light text-white tabular-nums">{c.value ?? '—'}</div>
          {c.sub && <div className="text-xs text-gray-500 mt-1">{c.sub}</div>}
        </Link>
      ))}
    </div>
  )
}
