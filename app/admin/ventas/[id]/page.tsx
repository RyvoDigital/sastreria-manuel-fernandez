'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Printer, Undo2 } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { METODOS_PAGO, toCents, type MetodoPago } from '@/lib/admin/ventas-calc'
import { Badge, Card, ErrorText, Field, Modal, PageHeader, api, btnPrimary, btnSecondary, formatMoney, inputClass, intlLocale, useApi } from '../../_components/ui'
import { formatQty } from '../../inventario/shared'
import VentasTabs from '../VentasTabs'
import { desgloseVenta, type VentaDetalle, type VentaLinea } from '../types'

export default function VentaPage() {
  const { id } = useParams<{ id: string }>()
  const { t, locale } = useAdminI18n()
  const v = t.ventas
  const { data, error, reload } = useApi<VentaDetalle>(`/api/admin/ventas/${id}`)
  const [devolviendo, setDevolviendo] = useState(false)

  if (error) return <div className="text-gray-400">{t.common.noData}</div>
  if (!data) return <div className="text-gray-400">{t.common.loading}</div>
  const { venta, lineas, devoluciones } = data
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Madrid' }).format(new Date(iso))
  const money = (x: string | number) => formatMoney(x, locale)
  const metodo = (m: string) => v.metodos[m as keyof typeof v.metodos] ?? m
  const cliente = [venta.cliente_nombre, venta.cliente_apellidos].filter(Boolean).join(' ')

  return (
    <div>
      <PageHeader
        back={{ href: '/admin/ventas', label: v.title }}
        title={venta.numero}
        actions={
          <>
            <Link href={`/admin/ventas/${venta.id}/ticket`} className={btnSecondary}>
              <Printer size={16} />
              {v.imprimirTicket}
            </Link>
            {/* Returns: accessories only (bespoke work and arreglos are never returned) */}
            {lineas.some((l) => l.devolvible && Number(l.cantidad) > Number(l.cantidad_devuelta)) && (
              <button type="button" className={btnSecondary} onClick={() => setDevolviendo(true)}>
                <Undo2 size={16} />
                {v.devolucion}
              </button>
            )}
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-400">
          {venta.estado !== 'completada' && <Badge tone={venta.estado === 'devuelta' ? 'red' : 'amber'}>{v.estados[venta.estado]}</Badge>}
          <span>{fmt(venta.fecha)}</span>
          {venta.admin_nombre && <span>· {venta.admin_nombre}</span>}
        </div>
      </PageHeader>
      <VentasTabs />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6 items-start">
        <div className="space-y-6 min-w-0">
          <Card title={v.productos}>
            <ul className="divide-y divide-[#1E3A5F] -my-3">
              {lineas.map((l) => (
                <li key={l.id} className="py-3 flex items-start gap-4 text-sm">
                  <div className="min-w-0 flex-1">
                    {l.producto_id ? (
                      <Link href={`/admin/inventario/${l.producto_id}`} className="text-white hover:text-[#C9A84C]">{l.descripcion}</Link>
                    ) : (
                      <span className="text-white">{l.descripcion}</span>
                    )}
                    <div className="text-xs text-gray-500">
                      {formatQty(l.cantidad, locale)} × {money(l.pvp_unitario)}
                      {Number(l.descuento_pct) > 0 && ` · −${Number(l.descuento_pct)} %`}
                      {` · IVA ${Number(l.iva)} %`}
                      {Number(l.cantidad_devuelta) > 0 && <span className="text-red-300"> · {v.devuelto}: {formatQty(l.cantidad_devuelta, locale)}</span>}
                    </div>
                  </div>
                  <span className="text-white tabular-nums">{money(l.total)}</span>
                </li>
              ))}
            </ul>
          </Card>

          {devoluciones.length > 0 && (
            <Card title={v.devoluciones}>
              <ul className="divide-y divide-[#1E3A5F] -my-3">
                {devoluciones.map((d) => (
                  <li key={d.id} className="py-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-white">{d.numero} · {fmt(d.fecha)}</span>
                      <span className="text-red-300 tabular-nums">−{money(d.importe_total)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {[metodo(d.metodo_reembolso), d.admin_nombre, d.motivo].filter(Boolean).join(' · ')}
                    </div>
                    <ul className="text-xs text-gray-400 mt-1">
                      {d.lineas.map((dl, i) => {
                        const l = lineas.find((x) => x.id === dl.venta_linea_id)
                        return (
                          <li key={i}>
                            {formatQty(dl.cantidad, locale)} × {l?.descripcion}
                            {l?.variante_id && !dl.reponer_stock && <span className="text-amber-400"> · {v.noRepuesto}</span>}
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {venta.notas && <Card title={t.common.notes}><p className="text-sm text-gray-300 whitespace-pre-line">{venta.notas}</p></Card>}
        </div>

        <div className="space-y-6">
          <Card title={v.cliente}>
            {venta.cliente_id ? (
              <Link href={`/admin/clientes/${venta.cliente_id}`} className="block hover:text-[#C9A84C]">
                <div className="text-white">{cliente}</div>
                <div className="text-xs text-gray-500">{[venta.cliente_telefono, venta.cliente_email].filter(Boolean).join(' · ')}</div>
              </Link>
            ) : (
              <p className="text-sm text-gray-400">{v.sinCliente}</p>
            )}
          </Card>
          <Card title={v.resumen}>
            <dl className="space-y-1.5 text-sm">
              {desgloseVenta(lineas).map((d) => (
                <div key={d.iva} className="flex justify-between text-gray-400">
                  <dt>{v.baseIva.replace('{iva}', String(d.iva))}</dt>
                  <dd className="tabular-nums">{money(d.base / 100)} + {money(d.cuota / 100)}</dd>
                </div>
              ))}
              {Number(venta.descuento_total) > 0 && (
                <div className="flex justify-between text-gray-400"><dt>{v.descuentos}</dt><dd className="tabular-nums">−{money(venta.descuento_total)}</dd></div>
              )}
              <div className="flex justify-between text-white text-xl pt-2 border-t border-[#1E3A5F]">
                <dt className="font-serif">{v.total}</dt>
                <dd className="tabular-nums">{money(venta.total)}</dd>
              </div>
              <div className="flex justify-between text-gray-400 pt-2">
                <dt>{v.metodoPago}</dt>
                <dd>{venta.pagos ? venta.pagos.map((p) => `${metodo(p.metodo)} ${money(p.importe)}`).join(' + ') : metodo(venta.metodo_pago)}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>

      {devolviendo && (
        <DevolucionModal
          ventaId={venta.id}
          lineas={lineas}
          defaultMetodo={(METODOS_PAGO as readonly string[]).includes(venta.metodo_pago) ? (venta.metodo_pago as MetodoPago) : 'efectivo'}
          onClose={() => setDevolviendo(false)}
          onDone={() => { setDevolviendo(false); reload() }}
        />
      )}
    </div>
  )
}

function DevolucionModal({ ventaId, lineas, defaultMetodo, onClose, onDone }: {
  ventaId: number
  lineas: VentaLinea[]
  defaultMetodo: MetodoPago
  onClose: () => void
  onDone: () => void
}) {
  const { t, locale } = useAdminI18n()
  const v = t.ventas
  const pendientes = lineas.filter((l) => l.devolvible && Number(l.cantidad) - Number(l.cantidad_devuelta) > 0)
  const [rows, setRows] = useState(() => pendientes.map((l) => ({ id: l.id, cantidad: '', reponer: !!l.variante_id })))
  const [metodo, setMetodo] = useState<MetodoPago>(defaultMetodo)
  const [motivo, setMotivo] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const num = (s: string) => Number(s.replace(',', '.')) || 0

  // Same proportional rule as the server; shown as an estimate
  const estimado = rows.reduce((sum, r) => {
    const l = lineas.find((x) => x.id === r.id)!
    return sum + Math.round((toCents(l.total) * Math.min(num(r.cantidad), Number(l.cantidad))) / Number(l.cantidad))
  }, 0)

  function todo() {
    setRows(rows.map((r) => {
      const l = lineas.find((x) => x.id === r.id)!
      return { ...r, cantidad: String(Number(l.cantidad) - Number(l.cantidad_devuelta)).replace('.', ',') }
    }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api(`/api/admin/ventas/${ventaId}/devoluciones`, {
        method: 'POST',
        body: {
          metodo_reembolso: metodo,
          motivo,
          lineas: rows.filter((r) => num(r.cantidad) > 0).map((r) => ({ venta_linea_id: r.id, cantidad: r.cantidad, reponer_stock: r.reponer })),
        },
      })
      onDone()
    } catch (err) {
      const code = (err as Error).message
      setError((v.errors as Record<string, string>)[code] ?? (t.inventario.errors as Record<string, string>)[code] ?? t.gestionCommon.error)
      setSaving(false)
    }
  }

  return (
    <Modal title={v.devolucion} onClose={onClose} closeLabel={t.common.close} wide>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-xs text-gray-500">{v.soloComplementos}</p>
        <button type="button" className="text-sm text-[#C9A84C] hover:text-[#D4B76A]" onClick={todo}>{v.devolverTodo}</button>
        <ul className="space-y-2">
          {pendientes.map((l, i) => {
            const pendiente = Number(l.cantidad) - Number(l.cantidad_devuelta)
            return (
              <li key={l.id} className="grid grid-cols-[1fr_7rem] gap-3 items-center bg-[#1E3A5F]/15 rounded-lg p-3">
                <div className="min-w-0">
                  <div className="text-sm text-white truncate">{l.descripcion}</div>
                  <div className="text-xs text-gray-500">{v.pendienteDevolver}: {formatQty(pendiente, locale)}</div>
                  {l.variante_id && (
                    <label className="flex items-center gap-2 text-xs text-gray-300 mt-2 min-h-8">
                      <input type="checkbox" className="w-4 h-4 accent-[#C9A84C]" checked={rows[i].reponer} onChange={(e) => setRows(rows.map((r, j) => (j === i ? { ...r, reponer: e.target.checked } : r)))} />
                      {v.reponerStock}
                    </label>
                  )}
                </div>
                <Field label={v.cantidad}>
                  <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={rows[i].cantidad} onChange={(e) => setRows(rows.map((r, j) => (j === i ? { ...r, cantidad: e.target.value } : r)))} placeholder="0" />
                </Field>
              </li>
            )
          })}
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={v.metodoReembolso}>
            <select className={inputClass} value={metodo} onChange={(e) => setMetodo(e.target.value as MetodoPago)}>
              {METODOS_PAGO.map((m) => <option key={m} value={m}>{v.metodos[m]}</option>)}
            </select>
          </Field>
          <Field label={`${v.motivo} (${t.gestionCommon.optional})`}>
            <input className={inputClass} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </Field>
        </div>
        <div className="flex justify-between text-sm border-t border-[#1E3A5F] pt-3">
          <span className="text-gray-400">{v.importeDevolver}</span>
          <span className="text-white tabular-nums">{formatMoney(estimado / 100, locale)}</span>
        </div>
        <ErrorText>{error}</ErrorText>
        <div className="flex gap-2">
          <button type="submit" className={btnPrimary} disabled={saving || rows.every((r) => num(r.cantidad) === 0)}>
            {saving ? t.common.saving : v.confirmarDevolucion}
          </button>
          <button type="button" className={btnSecondary} onClick={onClose}>{t.common.cancel}</button>
        </div>
      </form>
    </Modal>
  )
}
