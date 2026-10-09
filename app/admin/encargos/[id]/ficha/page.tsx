'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Printer } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { CARACTERISTICAS, POSTURA, SECCIONES_MEDIDAS, type CampoFicha } from '@/lib/admin/medidas'
import { btnPrimary, btnSecondary, formatDate, formatMoney, useApi } from '../../../_components/ui'
import { useFichaLabels } from '../../../_components/MedidasFicha'
import { formatQty } from '../../../inventario/shared'
import { useEncargoTexto } from '../../shared'
import type { EncargoDetalle } from '../../types'

// One A4 page laid out like the shop's paper "Ficha de trabajo" (labels only, no illustrations).
// The admin chrome is hidden by the print: utilities in AdminShell.
export default function FichaTrabajoPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useAdminI18n()
  const { data, error } = useApi<EncargoDetalle>(`/api/admin/encargos/${id}`)
  if (error) return <div className="text-gray-400">{t.common.noData}</div>
  if (!data) return <div className="text-gray-400">{t.common.loading}</div>
  return <Ficha data={data} />
}

function Box({ checked }: { checked: boolean }) {
  return (
    <span className="inline-flex items-center justify-center w-[3.2mm] h-[3.2mm] border border-black shrink-0 text-[8px] leading-none" aria-hidden>
      {checked ? '✕' : ''}
    </span>
  )
}

function Ficha({ data }: { data: EncargoDetalle }) {
  const { locale } = useAdminI18n()
  const { e, prendas } = useEncargoTexto()
  const { f, campo, valor } = useFichaLabels()
  const p = e.print
  const { encargo, materiales, totales } = data
  const medidas = data.medidas.find((m) => m.id === encargo.medidas_id)
  const ficha = medidas?.tipo_prenda === 'ficha' ? medidas : null
  const pruebas = data.pruebas.filter((x) => x.status !== 'cancelled')
  const cita = (x?: { fecha: string | null; hora: string | null }) => (x?.fecha ? `${formatDate(x.fecha, locale)} ${x.hora ?? ''}` : '')
  const tejidos = materiales
    .map((m) => [
      m.material === 'forro' ? e.materiales.forro : null,
      m.origen === 'inventario' ? [m.producto, m.variante && !m.es_unica ? m.variante : null].filter(Boolean).join(' ') : m.referencia,
      m.proveedor,
      m.metros && `${formatQty(m.metros, locale)} m`,
      m.origen === 'cliente' ? e.origenes.cliente : null,
    ].filter(Boolean).join(' · '))
    .join(' — ')
  const car = encargo.caracteristicas ?? {}

  const tabla = (seccion: 'chaqueta' | 'pantalon' | 'chaleco') => (
    <section className="border border-black">
      <h2 className="bg-[#0A1628] text-white text-center uppercase tracking-wider text-[9px] py-1 print:[print-color-adjust:exact]">{f.secciones[seccion]}</h2>
      <table className="w-full">
        <tbody>
          {(SECCIONES_MEDIDAS[seccion] as readonly CampoFicha[]).map((c) => {
            const v = ficha?.medidas[seccion]?.[c.key]
            return (
              <tr key={c.key} className="border-t border-black/40">
                <td className="px-1.5 py-[2px] w-[58%]">{campo(seccion, c.key)}</td>
                <td className="px-1.5 py-[2px] border-l border-black/40 tabular-nums">{v !== undefined ? valor(c, v) : ''}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )

  const checks = (titulo: string, keys: readonly string[], labels: Record<string, string>, marcados: string[], cols = 2) => (
    <section className="border border-black p-1.5">
      <h2 className="uppercase tracking-wider text-[9px] font-semibold mb-1">{titulo}</h2>
      <ul className={`grid gap-x-2 gap-y-[2px] ${cols === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {keys.map((k) => (
          <li key={k} className="flex items-start gap-1"><Box checked={marcados.includes(k)} /><span>{labels[k]}</span></li>
        ))}
      </ul>
    </section>
  )

  const celda = (label: string, value: React.ReactNode, className = '') => (
    <div className={`px-1.5 py-1 border-black ${className}`}>
      <span className="font-semibold uppercase text-[8px] tracking-wide">{label}: </span>
      <span>{value}</span>
    </div>
  )

  return (
    <div>
      <style>{'@page { size: A4; margin: 8mm } @media print { html, body { background: #fff !important } }'}</style>
      <div className="flex flex-wrap gap-2 mb-6 print:hidden">
        <Link href={`/admin/encargos/${encargo.id}`} className={btnSecondary}>
          <ArrowLeft size={16} />
          {encargo.numero}
        </Link>
        <button type="button" className={btnPrimary} onClick={() => window.print()}>
          <Printer size={16} />
          {p.imprimir}
        </button>
      </div>

      <article className="mx-auto w-full max-w-[194mm] bg-white text-black p-4 sm:p-6 print:p-0 text-[9.5px] leading-tight rounded print:rounded-none">
        <header className="flex items-end justify-between gap-4 border-b-2 border-black pb-2 mb-2">
          <div className="font-serif text-[13px] font-semibold tracking-wide">{p.cabecera}</div>
          <div className="text-right">
            <div className="font-serif text-[15px] uppercase tracking-wider">{p.titulo}</div>
            <div className="text-[9px]">{encargo.numero} · {e.tiposLargos[encargo.tipo]}</div>
          </div>
        </header>

        <div className="border border-black mb-2">
          <div className="grid grid-cols-[3fr_1fr] border-b border-black">
            {celda(e.campos.cliente, [encargo.cliente_nombre, encargo.cliente_apellidos].filter(Boolean).join(' '), 'border-r')}
            {celda('Tfno', encargo.cliente_telefono ?? '')}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 border-b border-black">
            {celda(e.campos.fecha_encargo, formatDate(encargo.fecha_encargo, locale), 'border-r')}
            {celda(p.fecha1, pruebas[0]?.fecha ? formatDate(pruebas[0].fecha, locale) : '', 'sm:border-r print:border-r')}
            {celda(p.fecha2, pruebas[1]?.fecha ? formatDate(pruebas[1].fecha, locale) : '', 'border-r')}
            {celda(e.campos.fecha_entrega, encargo.fecha_entrega ? formatDate(encargo.fecha_entrega, locale) : '')}
          </div>
          <div className="grid grid-cols-3 border-b border-black">
            {celda(e.total, totales.total !== null ? formatMoney(totales.total, locale) : '', 'border-r')}
            {celda(p.senal, totales.pagado !== null && Number(totales.pagado) > 0 ? formatMoney(totales.pagado, locale) : '', 'border-r')}
            {celda(e.pendiente, totales.pendiente !== null ? formatMoney(totales.pendiente, locale) : '')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2">
            {celda(e.campos.pedido, [prendas(encargo), encargo.tipo !== 'arreglo' ? encargo.pedido : null].filter(Boolean).join(' — '), 'sm:border-r print:border-r')}
            {celda(p.referencias, tejidos)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-2 mb-2 items-start">
          <div className="space-y-2">{tabla('chaqueta')}</div>
          <div className="space-y-2">
            {tabla('pantalon')}
            {tabla('chaleco')}
          </div>
          <div className="space-y-2">
            {checks(f.secciones.postura, POSTURA, f.postura, ficha?.medidas.postura ?? [])}
            <section className="border border-black p-1.5 min-h-[9mm]">
              <span className="font-semibold uppercase text-[8px] tracking-wide">{f.observacionesPostura}: </span>
              {ficha?.observaciones}
            </section>
            {checks(f.secciones.carChaqueta, CARACTERISTICAS.chaqueta, f.carChaqueta, car.chaqueta ?? [])}
            {checks(f.secciones.carPantalon, CARACTERISTICAS.pantalon, f.carPantalon, car.pantalon ?? [])}
          </div>
        </div>
        {medidas && <div className="text-[8px] mb-2">{p.medidasDel} {formatDate(medidas.tomada_en, locale)}{medidas.tomada_por_nombre ? ` · ${medidas.tomada_por_nombre}` : ''}</div>}

        <section className="border border-black p-1.5 mb-2 min-h-[22mm]">
          <h2 className="uppercase tracking-wider text-[9px] font-semibold mb-1">{e.campos.notas_sastre}</h2>
          <p className="whitespace-pre-line">{encargo.notas_sastre}</p>
          {encargo.tipo === 'arreglo' && encargo.pedido && <p className="whitespace-pre-line mt-1">{encargo.pedido}</p>}
        </section>

        <div className="border border-black">
          <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 border-b border-black">
            {celda(p.primeraPrueba, cita(pruebas[0]), 'sm:border-r print:border-r')}
            {celda(p.segundaPrueba, cita(pruebas[1]), 'sm:border-r print:border-r')}
            {celda(p.entregaFinal, encargo.entrega_cita_fecha ? cita({ fecha: encargo.entrega_cita_fecha, hora: encargo.entrega_cita_hora }) : encargo.fecha_entrega ? formatDate(encargo.fecha_entrega, locale) : '')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] print:grid-cols-[1fr_2fr] min-h-[16mm]">
            {celda(e.campos.sastre, encargo.sastre ?? '', 'sm:border-r print:border-r')}
            <div className="px-1.5 py-1">
              <span className="font-semibold uppercase text-[8px] tracking-wide">{e.campos.comentarios}: </span>
              <span className="whitespace-pre-line">{encargo.comentarios}</span>
            </div>
          </div>
        </div>
        {encargo.taller_externo && (
          <div className="text-[8px] mt-1.5">
            {e.secciones.tallerExterno}: {encargo.taller_externo}
            {encargo.taller_enviado && ` · ${e.campos.taller_enviado} ${formatDate(encargo.taller_enviado, locale)}`}
            {encargo.taller_devuelto && ` · ${e.campos.taller_devuelto} ${formatDate(encargo.taller_devuelto, locale)}`}
          </div>
        )}
      </article>
    </div>
  )
}
