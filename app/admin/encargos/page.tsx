'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { PageHeader, btnPrimary, formatDate, formatMoney, inputClass, useApi } from '../_components/ui'
import { useRol } from '../_components/role'
import { ESTADOS, EstadoBadge, TIPOS, useEncargoTexto, type EncargoResumen } from './shared'

export default function EncargosPage() {
  return (
    <Suspense>
      <Encargos />
    </Suspense>
  )
}

function Encargos() {
  const { t, locale } = useAdminI18n()
  const { e, prendas } = useEncargoTexto()
  const { propietario } = useRol()
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('abiertos')
  const [tipo, setTipo] = useState('')
  const [sastre, setSastre] = useState('')
  const [pendiente, setPendiente] = useState(false)
  const { data: sastres } = useApi<{ items: { id: number; nombre: string; activo: boolean }[] }>('/api/admin/listas/sastres')

  const params = new URLSearchParams()
  if (q.trim()) params.set('q', q.trim())
  if (estado === 'abiertos') params.set('abiertos', '1')
  else if (estado) params.set('estado', estado)
  if (tipo) params.set('tipo', tipo)
  if (sastre) params.set('sastre', sastre)
  if (pendiente) params.set('pendiente', '1')
  const { data, loading } = useApi<{ encargos: EncargoResumen[] }>(`/api/admin/encargos?${params}`)
  const selectClass = `${inputClass} w-auto`

  return (
    <div>
      <PageHeader
        title={e.title}
        actions={
          <Link href="/admin/encargos/nuevo" className={btnPrimary}>
            <Plus size={16} />
            {e.nuevo}
          </Link>
        }
      />

      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className={`${inputClass} pl-9`} value={q} onChange={(ev) => setQ(ev.target.value)} placeholder={e.buscar} aria-label={e.buscar} />
        </div>
        <div className="flex flex-wrap gap-2">
          <select className={selectClass} value={estado} onChange={(ev) => setEstado(ev.target.value)} aria-label={e.filtros.estado}>
            <option value="abiertos">{e.filtros.abiertos}</option>
            <option value="">{e.filtros.todos}</option>
            {ESTADOS.map((s) => <option key={s} value={s}>{e.estados[s]}</option>)}
          </select>
          <select className={selectClass} value={tipo} onChange={(ev) => setTipo(ev.target.value)} aria-label={e.filtros.tipo}>
            <option value="">{e.filtros.tipo}: {e.filtros.todos}</option>
            {TIPOS.map((tp) => <option key={tp} value={tp}>{e.tiposLargos[tp]}</option>)}
          </select>
          <select className={selectClass} value={sastre} onChange={(ev) => setSastre(ev.target.value)} aria-label={e.filtros.sastre}>
            <option value="">{e.filtros.sastre}: {e.filtros.todos}</option>
            {sastres?.items.filter((s) => s.activo).map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
          {propietario && (
            <label className="flex items-center gap-2 text-sm text-gray-300 px-2 min-h-11 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-[#C9A84C]" checked={pendiente} onChange={(ev) => setPendiente(ev.target.checked)} />
              {e.filtros.pendientePago}
            </label>
          )}
        </div>
      </div>

      {loading && !data ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : !data?.encargos.length ? (
        <div className="text-gray-400">{e.vacio}</div>
      ) : (
        <ul className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl divide-y divide-[#1E3A5F]">
          {data.encargos.map((x) => {
            const resto = x.total != null && x.pagado != null ? Number(x.total) - Number(x.pagado) : null
            return (
              <li key={x.id}>
                <Link href={`/admin/encargos/${x.id}`} className="px-4 py-3 flex items-center gap-4 hover:bg-[#1E3A5F]/20">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-white">{x.cliente}</span>
                      <span className="text-gray-400 text-sm">· {prendas(x)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {[
                        x.numero,
                        e.tipos[x.tipo],
                        x.sastre ?? e.campos.sinSastre,
                        x.proxima_prueba && `${e.estados.prueba}: ${formatDate(x.proxima_prueba, locale)}`,
                        x.fecha_entrega && `${e.entrega}: ${formatDate(x.fecha_entrega, locale)}`,
                        x.taller_externo && !x.taller_devuelto && `${e.secciones.tallerExterno}: ${x.taller_externo}`,
                      ].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <EstadoBadge estado={x.estado} />
                    {propietario && x.total != null && (
                      <span className={`text-xs tabular-nums ${resto !== null && resto > 0.004 ? 'text-amber-300' : 'text-gray-500'}`}>
                        {resto !== null && resto > 0.004 ? `${e.pendiente}: ${formatMoney(resto, locale)}` : formatMoney(x.total, locale)}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
