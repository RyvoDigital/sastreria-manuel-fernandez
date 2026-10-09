'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Scissors } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Card, btnSecondary, formatDate, formatMoney } from '../../_components/ui'
import { useRol } from '../../_components/role'
import { EstadoBadge, TIPOS, useEncargoTexto, type EncargoResumen, type Tipo } from '../../encargos/shared'

// Prenda a medida, Camisa a medida and Arreglo each get their own list, like their paper files
export default function EncargosSection({ clienteId, encargos }: { clienteId: number; encargos: EncargoResumen[] }) {
  const { locale } = useAdminI18n()
  const { e, prendas } = useEncargoTexto()
  const { propietario } = useRol()
  // Open on the first kind that has encargos
  const [tab, setTab] = useState<Tipo>(() => TIPOS.find((tp) => encargos.some((x) => x.tipo === tp)) ?? 'prenda')
  const lista = encargos.filter((x) => x.tipo === tab)

  return (
    <Card
      title={<span className="flex items-center gap-2"><Scissors size={18} className="text-[#C9A84C]" />{e.title}</span>}
      actions={
        <Link href={`/admin/encargos/nuevo?cliente=${clienteId}&tipo=${tab}`} className={btnSecondary}>
          <Plus size={16} />
          {e.nuevoTipo[tab]}
        </Link>
      }
    >
      <div className="flex gap-1 -mt-2 mb-4 border-b border-[#1E3A5F] overflow-x-auto" role="tablist">
        {TIPOS.map((tp) => {
          const n = encargos.filter((x) => x.tipo === tp).length
          return (
            <button
              key={tp}
              type="button"
              role="tab"
              aria-selected={tab === tp}
              onClick={() => setTab(tp)}
              className={`px-3 py-2.5 -mb-px text-sm whitespace-nowrap border-b-2 transition-colors ${
                tab === tp ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {e.tiposLargos[tp]}{n > 0 && <span className="ml-1.5 text-xs text-gray-500">{n}</span>}
            </button>
          )
        })}
      </div>
      {lista.length === 0 ? (
        <p className="text-sm text-gray-400">{e.vacioTipo}</p>
      ) : (
        <ul className="divide-y divide-[#1E3A5F] -my-2">
          {lista.map((x) => {
            const pendiente = x.total != null && x.pagado != null ? Number(x.total) - Number(x.pagado) : null
            return (
              <li key={x.id}>
                <Link href={`/admin/encargos/${x.id}`} className="py-2.5 flex items-center justify-between gap-3 text-sm hover:text-[#C9A84C]">
                  <span className="min-w-0">
                    <span className="text-white">{prendas(x)}</span>
                    <span className="block text-xs text-gray-500 truncate">
                      {[x.numero, formatDate(x.fecha_encargo, locale), x.fecha_entrega && `${e.entrega}: ${formatDate(x.fecha_entrega, locale)}`, x.sastre]
                        .filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1 shrink-0">
                    <EstadoBadge estado={x.estado} />
                    {propietario && pendiente !== null && pendiente > 0.004 && (
                      <span className="text-xs text-amber-300 tabular-nums">{e.pendiente}: {formatMoney(pendiente, locale)}</span>
                    )}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
