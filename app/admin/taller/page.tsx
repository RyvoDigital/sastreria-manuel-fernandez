'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, PageHeader, formatDate, useApi } from '../_components/ui'
import { useRol } from '../_components/role'
import { useEncargoTexto, type EncargoResumen, type Estado } from '../encargos/shared'

const COLUMNAS: Estado[] = ['presupuesto', 'confirmado', 'prueba', 'listo']

// Encargos by state, filterable by tailor to see each one's workload.
// A Taller login sees only this page: no prices, no contact details, no links into the client file.
export default function TallerPage() {
  const { t, locale } = useAdminI18n()
  const { e, prendas } = useEncargoTexto()
  const { taller } = useRol()
  const { data } = useApi<{ encargos: EncargoResumen[]; sastres: { id: number; nombre: string }[] }>('/api/admin/taller')
  const [sastre, setSastre] = useState<number | 'sin' | null>(null)
  const tl = e.taller

  const encargos = (data?.encargos ?? []).filter((x) => sastre === null || (sastre === 'sin' ? !x.sastre_id : x.sastre_id === sastre))
  const abiertos = (data?.encargos ?? []).filter((x) => x.estado !== 'entregado')
  const carga = (id: number | null) => abiertos.filter((x) => x.sastre_id === id).length

  const chip = (key: string, label: string, value: number | 'sin' | null, n: number) => (
    <button
      key={key}
      type="button"
      aria-pressed={sastre === value}
      onClick={() => setSastre(value)}
      className={`px-3 py-2 rounded-full text-sm border transition-colors ${
        sastre === value ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-[#1E3A5F] text-gray-300 hover:border-gray-500'
      }`}
    >
      {label} <span className="text-xs text-gray-500 tabular-nums">{n}</span>
    </button>
  )

  const card = (x: EncargoResumen) => {
    const body = (
      <>
        <div className="text-white text-sm">{x.cliente}</div>
        <div className="text-sm text-gray-300">{prendas(x)}</div>
        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
          <div>{x.numero} · {x.sastre ?? tl.sinAsignar}</div>
          {x.proxima_prueba && <div>{tl.proximaPrueba}: {formatDate(x.proxima_prueba, locale)}</div>}
          {x.fecha_entrega && <div>{e.entrega}: {formatDate(x.fecha_entrega, locale)}</div>}
        </div>
        {x.taller_externo && !x.taller_devuelto && (
          <div className="mt-1.5"><Badge tone="amber">{tl.fuera}: {x.taller_externo}</Badge></div>
        )}
      </>
    )
    const className = 'block bg-[#0A1628] border border-[#1E3A5F] rounded-lg p-3'
    return (
      <li key={x.id}>
        {taller ? <div className={className}>{body}</div> : <Link href={`/admin/encargos/${x.id}`} className={`${className} hover:border-[#C9A84C]/60`}>{body}</Link>}
      </li>
    )
  }

  const entregados = encargos.filter((x) => x.estado === 'entregado')

  return (
    <div>
      <PageHeader title={tl.title}>
        <p className="text-xs text-gray-500 mt-1 max-w-xl">{tl.ayuda}</p>
      </PageHeader>

      {!data ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label={e.filtros.sastre}>
            {chip('todos', tl.todos, null, abiertos.length)}
            {data.sastres.map((s) => chip(String(s.id), s.nombre, s.id, carga(s.id)))}
            {chip('sin', tl.sinAsignar, 'sin', carga(null))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {COLUMNAS.map((estado) => {
              const lista = encargos.filter((x) => x.estado === estado)
              return (
                <section key={estado} className="bg-[#1E3A5F]/10 border border-[#1E3A5F] rounded-xl p-3 min-w-0">
                  <h2 className="flex items-center justify-between text-sm text-gray-300 mb-3 px-1">
                    <span className="uppercase tracking-wider text-xs">{e.estados[estado]}</span>
                    <span className="text-xs text-gray-500 tabular-nums">{lista.length}</span>
                  </h2>
                  {lista.length === 0 ? <p className="text-xs text-gray-500 px-1 pb-1">{tl.vacio}</p> : <ul className="space-y-2">{lista.map(card)}</ul>}
                </section>
              )
            })}
          </div>

          {entregados.length > 0 && (
            <details className="mt-6">
              <summary className="text-sm text-gray-400 cursor-pointer py-2">{tl.entregadosRecientes} ({entregados.length})</summary>
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 mt-2">{entregados.map(card)}</ul>
            </details>
          )}
        </>
      )}
    </div>
  )
}
