'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Printer } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { btnPrimary, btnSecondary, formatMoney, intlLocale, useApi } from '../../../_components/ui'
import { formatQty } from '../../../inventario/shared'
import { desgloseVenta, type VentaDetalle } from '../../types'

// Printable NON-FISCAL ticket / albarán. The admin chrome is hidden by print: utilities in AdminShell.
export default function TicketPage() {
  const { id } = useParams<{ id: string }>()
  const { t, locale } = useAdminI18n()
  const v = t.ventas
  const k = v.ticket
  const { data, error } = useApi<VentaDetalle>(`/api/admin/ventas/${id}`)

  if (error) return <div className="text-gray-400">{t.common.noData}</div>
  if (!data) return <div className="text-gray-400">{t.common.loading}</div>
  const { venta, lineas, devoluciones, empresa } = data
  const money = (x: string | number) => formatMoney(x, locale)
  const metodo = (m: string) => v.metodos[m as keyof typeof v.metodos] ?? m
  const fecha = new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Madrid' }).format(new Date(venta.fecha))
  const cliente = [venta.cliente_nombre, venta.cliente_apellidos].filter(Boolean).join(' ')

  return (
    <div>
      <style>{'@page { margin: 6mm } @media print { html, body { background: #fff !important } }'}</style>
      <div className="flex flex-wrap gap-2 mb-6 print:hidden">
        <Link href={`/admin/ventas/${venta.id}`} className={btnSecondary}>
          <ArrowLeft size={16} />
          {venta.numero}
        </Link>
        <button type="button" className={btnPrimary} onClick={() => window.print()}>
          <Printer size={16} />
          {k.imprimir}
        </button>
      </div>

      <article className="ticket mx-auto w-full max-w-[80mm] bg-white text-black p-5 font-mono text-[12px] leading-snug rounded print:rounded-none print:p-0">
        <header className="text-center mb-3">
          <div className="font-serif text-base font-semibold tracking-wide">Sastrería Manuel Fernández</div>
          {empresa.direccion && <div>{empresa.direccion}</div>}
          {empresa.telefono && <div>{empresa.telefono}</div>}
        </header>

        <div className="border-y border-dashed border-black py-2 mb-2">
          <div className="font-semibold">{k.titulo} {venta.numero}</div>
          <div>{fecha}</div>
          {cliente && <div>{k.cliente}: {cliente}{venta.cliente_nif ? ` · ${venta.cliente_nif}` : ''}</div>}
          {venta.admin_nombre && <div>{k.atendido}: {venta.admin_nombre}</div>}
        </div>

        <table className="w-full mb-2">
          <tbody>
            {lineas.map((l) => (
              <tr key={l.id} className="align-top">
                <td className="pb-1.5">
                  <div>{l.descripcion}</div>
                  <div className="text-[11px]">
                    {formatQty(l.cantidad, locale)} × {money(l.pvp_unitario)}
                    {Number(l.descuento_pct) > 0 && ` −${Number(l.descuento_pct)}%`}
                  </div>
                </td>
                <td className="pb-1.5 text-right whitespace-nowrap pl-2">{money(l.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-dashed border-black pt-2 space-y-0.5">
          {desgloseVenta(lineas).map((d) => (
            <div key={d.iva} className="flex justify-between text-[11px]">
              <span>{k.base} {d.iva}%: {money(d.base / 100)}</span>
              <span>{k.iva}: {money(d.cuota / 100)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold text-sm pt-1">
            <span>{v.total}</span>
            <span>{money(venta.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>{v.metodoPago}</span>
            <span>{venta.pagos ? venta.pagos.map((p) => `${metodo(p.metodo)} ${money(p.importe)}`).join(' + ') : metodo(venta.metodo_pago)}</span>
          </div>
        </div>

        {devoluciones.length > 0 && (
          <div className="border-t border-dashed border-black mt-2 pt-2">
            {devoluciones.map((d) => (
              <div key={d.id} className="flex justify-between">
                <span>{k.devolucion} {d.numero}</span>
                <span>−{money(d.importe_total)}</span>
              </div>
            ))}
          </div>
        )}

        <footer className="text-center border-t border-dashed border-black mt-3 pt-2 space-y-1">
          <div className="font-semibold">{k.noFiscal}</div>
          <div>{k.gracias}</div>
        </footer>
      </article>
    </div>
  )
}
