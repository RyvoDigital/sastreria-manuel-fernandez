'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Receipt, Trash2 } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { METODOS_PAGO, calcularLinea, desgloseIva, toCents, type MetodoPago } from '@/lib/admin/ventas-calc'
import { Card, ErrorText, Field, PageHeader, api, btnPrimary, btnSecondary, formatMoney, inputClass, useApi } from '../../_components/ui'
import VariantePicker, { type VarianteOption } from '../../_components/VariantePicker'
import { formatQty } from '../../inventario/shared'
import ClientePicker, { type ClienteOption } from '../ClientePicker'

interface Linea {
  key: string
  variante: VarianteOption | null // null = free-text line
  descripcion: string
  cantidad: string
  pvp: string
  descuento: string
  iva: number
}

const num = (s: string) => Number(s.replace(',', '.')) || 0

export default function NuevaVentaPage() {
  return (
    <Suspense>
      <NuevaVenta />
    </Suspense>
  )
}

function NuevaVenta() {
  const { t, locale } = useAdminI18n()
  const v = t.ventas
  const router = useRouter()
  const searchParams = useSearchParams()
  const clienteParam = searchParams.get('cliente')
  // Coming from a ficha del cliente preselects that client
  const { data: preset } = useApi<{ cliente: ClienteOption }>(clienteParam ? `/api/admin/clientes/${clienteParam}` : null)
  const [cliente, setCliente] = useState<ClienteOption | null | undefined>(undefined)
  const clienteActual = cliente === undefined ? (preset?.cliente ?? null) : cliente

  const [lineas, setLineas] = useState<Linea[]>([])
  const [metodo, setMetodo] = useState<MetodoPago | 'mixto'>('tarjeta')
  const [pagos, setPagos] = useState<{ metodo: MetodoPago; importe: string }[]>([
    { metodo: 'efectivo', importe: '' },
    { metodo: 'tarjeta', importe: '' },
  ])
  const [notas, setNotas] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  // Lines already noted in "Por pedir" (selling never takes stock below zero)
  const [pedidos, setPedidos] = useState<Set<string>>(() => new Set())

  async function anadirPorPedir(l: Linea, faltan: number) {
    if (!l.variante) return
    try {
      await api('/api/admin/por-pedir', {
        method: 'POST',
        body: { variante_id: l.variante.id, cantidad: faltan, cliente_id: clienteActual?.id ?? null },
      })
      setPedidos((prev) => new Set(prev).add(l.key))
    } catch {
      setError(t.gestionCommon.error)
    }
  }

  function addVariante(opt: VarianteOption) {
    const existing = lineas.findIndex((l) => l.variante?.id === opt.id)
    if (existing >= 0) {
      setLineas(lineas.map((l, i) => (i === existing ? { ...l, cantidad: String(num(l.cantidad) + 1) } : l)))
      return
    }
    setLineas([
      ...lineas,
      {
        key: `v${opt.id}`,
        variante: opt,
        descripcion: opt.es_unica || !opt.etiqueta ? opt.producto : `${opt.producto} · ${opt.etiqueta}`,
        cantidad: '1',
        pvp: opt.pvp ? String(Number(opt.pvp)).replace('.', ',') : '',
        descuento: '',
        iva: Number(opt.iva),
      },
    ])
  }

  function addLibre() {
    setLineas([...lineas, { key: `l${Date.now()}`, variante: null, descripcion: '', cantidad: '1', pvp: '', descuento: '', iva: 21 }])
  }

  const update = (key: string, patch: Partial<Linea>) => setLineas(lineas.map((l) => (l.key === key ? { ...l, ...patch } : l)))

  const calcs = lineas.map((l) => ({ iva: l.iva, ...calcularLinea(num(l.cantidad), toCents(l.pvp || 0), Math.min(num(l.descuento), 100), l.iva) }))
  const total = calcs.reduce((s, c) => s + c.total, 0)
  const descuentoTotal = calcs.reduce((s, c) => s + c.descuento, 0)
  const desglose = desgloseIva(calcs)
  const pagado = pagos.reduce((s, p) => s + toCents(p.importe || 0), 0)
  const money = (c: number) => formatMoney(c / 100, locale)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (lineas.length === 0) return
    setSaving(true)
    setError('')
    try {
      const { venta } = await api<{ venta: { id: number } }>('/api/admin/ventas', {
        method: 'POST',
        body: {
          cliente_id: clienteActual?.id ?? null,
          metodo_pago: metodo,
          pagos: metodo === 'mixto' ? pagos.filter((p) => toCents(p.importe || 0) > 0) : undefined,
          notas,
          lineas: lineas.map((l) => ({
            variante_id: l.variante?.id ?? null,
            descripcion: l.descripcion,
            cantidad: l.cantidad,
            pvp_unitario: l.pvp,
            descuento_pct: l.descuento || 0,
            iva: l.iva,
          })),
        },
      })
      router.push(`/admin/ventas/${venta.id}`)
    } catch (err) {
      const e = err as Error & { details?: { producto?: string; variante?: string; disponible?: number } }
      const msg = e.message === 'insufficient stock'
        ? t.porPedir.sinStock
        : (v.errors as Record<string, string>)[e.message] ?? (t.inventario.errors as Record<string, string>)[e.message] ?? t.gestionCommon.error
      const d = e.details
      setError(e.message === 'insufficient stock' && d?.producto
        ? `${msg} ${d.producto}${d.variante ? ` · ${d.variante}` : ''}: ${formatQty(d.disponible ?? 0, locale)}`
        : msg)
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title={v.new} back={{ href: '/admin/ventas', label: v.title }} />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6 items-start">
        <div className="space-y-6 min-w-0">
          <Card title={v.cliente}>
            <ClientePicker value={clienteActual} onChange={setCliente} />
          </Card>

          <Card title={v.productos}>
            <VariantePicker
              onPick={addVariante}
              placeholder={t.inventario.entradas.buscarProducto}
              renderMeta={(o) => (
                <>
                  <div className="text-white">{o.pvp ? formatMoney(o.pvp, locale) : '—'}</div>
                  <div className={Number(o.stock_actual) > 0 ? '' : 'text-red-400'}>
                    {formatQty(o.stock_actual, locale)} {t.inventario.unidades[o.unidad as keyof typeof t.inventario.unidades] ?? o.unidad}
                  </div>
                </>
              )}
            />
            <button type="button" className={`${btnSecondary} mt-3`} onClick={addLibre}>
              <Plus size={16} />
              {v.lineaLibre}
            </button>

            {lineas.length > 0 && (
              <ul className="mt-4 space-y-2 @container">
                {lineas.map((l, i) => {
                  const unidad = l.variante?.unidad
                  const u = unidad ? (t.inventario.unidades[unidad as keyof typeof t.inventario.unidades] ?? unidad) : ''
                  const sinStock = l.variante && num(l.cantidad) > Number(l.variante.stock_actual)
                  return (
                    <li key={l.key} className="bg-[#1E3A5F]/15 rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        {l.variante ? (
                          <div className="min-w-0">
                            <div className="text-sm text-white">{l.descripcion}</div>
                            <div className="text-xs text-gray-500">
                              {[l.variante.sku, `IVA ${l.iva} %`].filter(Boolean).join(' · ')}
                              {sinStock && <span className="text-red-400"> · {v.stockInsuficiente} ({formatQty(l.variante.stock_actual, locale)} {u})</span>}
                            </div>
                            {sinStock && (
                              <div className="mt-1.5 text-xs">
                                {pedidos.has(l.key) ? (
                                  <span className="text-emerald-400">{t.porPedir.anadido}</span>
                                ) : (
                                  <button
                                    type="button"
                                    className="text-[#C9A84C] hover:text-[#D4B76A] underline underline-offset-2 py-1"
                                    onClick={() => anadirPorPedir(l, Math.round((num(l.cantidad) - Number(l.variante!.stock_actual)) * 1000) / 1000)}
                                  >
                                    {t.porPedir.anadir}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            className={`${inputClass} flex-1`}
                            value={l.descripcion}
                            onChange={(e) => update(l.key, { descripcion: e.target.value })}
                            placeholder={v.conceptoPlaceholder}
                            aria-label={v.concepto}
                            required
                          />
                        )}
                        <button type="button" onClick={() => setLineas(lineas.filter((x) => x.key !== l.key))} className="p-2 -mr-1 text-gray-500 hover:text-red-400 shrink-0" aria-label={t.common.delete}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 @lg:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                        <Field label={`${v.cantidad}${u ? ` (${u})` : ''}`}>
                          <input className={`${inputClass} tabular-nums`} inputMode={unidad === 'm' || !l.variante ? 'decimal' : 'numeric'} value={l.cantidad} onChange={(e) => update(l.key, { cantidad: e.target.value })} required />
                        </Field>
                        <Field label={v.precio}>
                          <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={l.pvp} onChange={(e) => update(l.key, { pvp: e.target.value })} required />
                        </Field>
                        <Field label={v.descuento}>
                          <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={l.descuento} onChange={(e) => update(l.key, { descuento: e.target.value })} placeholder="0" />
                        </Field>
                        <div className="col-span-3 @lg:col-span-1 flex items-center justify-between @lg:justify-end gap-3 @lg:pb-3">
                          {!l.variante && (
                            <select className={`${inputClass} w-auto`} value={l.iva} onChange={(e) => update(l.key, { iva: Number(e.target.value) })} aria-label="IVA">
                              {[21, 10, 4, 0].map((r) => <option key={r} value={r}>IVA {r} %</option>)}
                            </select>
                          )}
                          <span className="text-white tabular-nums font-medium ml-auto">{money(calcs[i].total)}</span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>

          <Card title={t.common.notes}>
            <textarea className={inputClass} rows={2} value={notas} onChange={(e) => setNotas(e.target.value)} aria-label={t.common.notes} />
          </Card>
        </div>

        <div className="lg:sticky lg:top-6 space-y-4">
          <Card title={v.resumen}>
            <dl className="space-y-1.5 text-sm">
              {desglose.map((d) => (
                <div key={d.iva} className="flex justify-between text-gray-400">
                  <dt>{v.baseIva.replace('{iva}', String(d.iva))}</dt>
                  <dd className="tabular-nums">{money(d.base)} + {money(d.cuota)}</dd>
                </div>
              ))}
              {descuentoTotal > 0 && (
                <div className="flex justify-between text-gray-400">
                  <dt>{v.descuentos}</dt>
                  <dd className="tabular-nums">−{money(descuentoTotal)}</dd>
                </div>
              )}
              <div className="flex justify-between text-white text-xl pt-2 border-t border-[#1E3A5F]">
                <dt className="font-serif">{v.total}</dt>
                <dd className="tabular-nums">{money(total)}</dd>
              </div>
            </dl>

            <div className="mt-5">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">{v.metodoPago}</div>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={v.metodoPago}>
                {[...METODOS_PAGO, 'mixto' as const].map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={metodo === m}
                    onClick={() => setMetodo(m)}
                    className={`min-h-11 px-2 rounded-lg text-sm border transition-colors ${
                      metodo === m ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10' : 'border-[#1E3A5F] text-gray-300'
                    }`}
                  >
                    {v.metodos[m]}
                  </button>
                ))}
              </div>
              {metodo === 'mixto' && (
                <div className="mt-3 space-y-2">
                  {pagos.map((p, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2">
                      <select className={inputClass} value={p.metodo} onChange={(e) => setPagos(pagos.map((x, j) => (j === i ? { ...x, metodo: e.target.value as MetodoPago } : x)))} aria-label={v.metodoPago}>
                        {METODOS_PAGO.map((m) => <option key={m} value={m}>{v.metodos[m]}</option>)}
                      </select>
                      <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={p.importe} onChange={(e) => setPagos(pagos.map((x, j) => (j === i ? { ...x, importe: e.target.value } : x)))} aria-label={v.importe} placeholder="0,00" />
                    </div>
                  ))}
                  <p className={`text-xs ${pagado === total ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {v.pendienteMixto}: {money(total - pagado)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <ErrorText>{error}</ErrorText>
          <button type="submit" className={`${btnPrimary} w-full text-base`} disabled={saving || lineas.length === 0 || (metodo === 'mixto' && pagado !== total)}>
            <Receipt size={18} />
            {saving ? t.common.saving : `${v.cobrar} ${money(total)}`}
          </button>
          <p className="text-xs text-gray-500">{v.noFiscal}</p>
        </div>
      </form>
    </div>
  )
}
