'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarPlus, Package, Plus, Trash2, X } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { METODOS_PAGO, toCents } from '@/lib/admin/ventas-calc'
import { Badge, Card, ErrorText, Field, api, btnPrimary, btnSecondary, formatDate, formatMoney, inputClass, useApi } from '../../_components/ui'
import { useRol } from '../../_components/role'
import VariantePicker, { type VarianteOption } from '../../_components/VariantePicker'
import { formatQty } from '../../inventario/shared'
import { METROS_DEFECTO } from '../shared'

export interface Material {
  id: number
  material: 'tejido' | 'forro'
  origen: 'proveedor' | 'inventario' | 'cliente'
  proveedor_id: number | null
  proveedor: string | null
  referencia: string | null
  metros: string | null
  estado_pedido: 'pedido' | 'recibido' | null
  variante_id: number | null
  producto: string | null
  producto_id: number | null
  variante: string | null
  es_unica: boolean | null
  consumido: boolean
  notas: string | null
}

export interface ProductoLinea {
  id: number
  variante_id: number
  cantidad: string
  consumido: boolean
  notas: string | null
  producto_id: number
  producto: string
  unidad: string
  variante: string | null
  es_unica: boolean
  sku: string | null
  stock_actual: string
  pvp: string | null
}

export interface Prueba {
  id: number
  notas: string | null
  booking_id: number | null
  fecha: string | null
  hora: string | null
  status: string | null
}

export interface Pago {
  id: number
  fecha: string
  importe: string | null
  metodo: string
  pagos: { metodo: string; importe: string }[] | null
  notas: string | null
  admin_nombre: string | null
}

function useError() {
  const { t } = useAdminI18n()
  const [error, setError] = useState('')
  const run = async (fn: () => Promise<unknown>) => {
    setError('')
    try {
      await fn()
      return true
    } catch (err) {
      const code = (err as Error).message
      setError(t.encargos.errors[code] ?? (t.inventario.errors as Record<string, string>)[code] ?? t.gestionCommon.error)
      return false
    }
  }
  return { error, run }
}

// ── Tejido y forro ────────────────────────────────────────────────────────────

export function Materiales({ encargoId, prendas, confirmado, materiales, onChange }: {
  encargoId: number
  prendas: string[]
  confirmado: boolean
  materiales: Material[]
  onChange: () => void
}) {
  const { t, locale } = useAdminI18n()
  const m = t.encargos.materiales
  const [adding, setAdding] = useState(false)
  const { error, run } = useError()

  async function estado(mat: Material, estadoPedido: 'pedido' | 'recibido') {
    if (await run(() => api(`/api/admin/encargos/${encargoId}/materiales/${mat.id}`, { method: 'PATCH', body: { estado_pedido: estadoPedido } }))) onChange()
  }
  async function quitar(mat: Material) {
    if (!window.confirm(m.borrarConfirm)) return
    if (await run(() => api(`/api/admin/encargos/${encargoId}/materiales/${mat.id}`, { method: 'DELETE' }))) onChange()
  }

  return (
    <Card
      title={t.encargos.secciones.materiales}
      actions={!adding && (
        <button type="button" className={btnSecondary} onClick={() => setAdding(true)}>
          <Plus size={16} />
          <span className="hidden sm:inline">{m.add}</span>
        </button>
      )}
    >
      {materiales.length === 0 && !adding && <p className="text-sm text-gray-400">{m.vacio}</p>}
      <ul className="divide-y divide-[#1E3A5F] -my-2">
        {materiales.map((mat) => (
          <li key={mat.id} className="py-3 flex items-start gap-3 text-sm">
            <div className="min-w-0 flex-1">
              <div className="text-white">
                {m[mat.material]} · <span className="text-gray-300">{t.encargos.origenes[mat.origen]}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5 break-words">
                {[
                  mat.origen === 'inventario' && mat.producto && (
                    <Link key="p" href={`/admin/inventario/${mat.producto_id}`} className="text-[#C9A84C] hover:text-[#D4B76A]">
                      {mat.producto}{mat.variante && !mat.es_unica ? ` · ${mat.variante}` : ''}
                    </Link>
                  ),
                  mat.proveedor,
                  mat.referencia,
                  mat.metros && `${formatQty(mat.metros, locale)} m`,
                  mat.notas,
                ].filter(Boolean).reduce<React.ReactNode[]>((acc, x, i) => (i ? [...acc, ' · ', x] : [x]), [])}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {mat.origen === 'proveedor' && mat.estado_pedido && (
                  <>
                    <Badge tone={mat.estado_pedido === 'recibido' ? 'green' : 'amber'}>{t.encargos.estadoPedido[mat.estado_pedido]}</Badge>
                    <button type="button" className="text-xs text-[#C9A84C] hover:text-[#D4B76A] py-1" onClick={() => estado(mat, mat.estado_pedido === 'recibido' ? 'pedido' : 'recibido')}>
                      {mat.estado_pedido === 'recibido' ? m.marcarPedido : m.marcarRecibido}
                    </button>
                  </>
                )}
                {mat.origen === 'inventario' && (
                  <Badge tone={mat.consumido ? 'neutral' : 'gold'}>{mat.consumido ? m.consumido : m.seDescontara}</Badge>
                )}
              </div>
            </div>
            {!mat.consumido && (
              <button type="button" onClick={() => quitar(mat)} className="p-2 -m-1 text-gray-500 hover:text-red-400" aria-label={t.common.delete}>
                <Trash2 size={16} />
              </button>
            )}
          </li>
        ))}
      </ul>
      <ErrorText>{error}</ErrorText>
      {adding && (
        <MaterialForm
          encargoId={encargoId}
          prendas={prendas}
          confirmado={confirmado}
          onCancel={() => setAdding(false)}
          onSaved={() => { setAdding(false); onChange() }}
        />
      )}
    </Card>
  )
}

function MaterialForm({ encargoId, prendas, confirmado, onCancel, onSaved }: {
  encargoId: number
  prendas: string[]
  confirmado: boolean
  onCancel: () => void
  onSaved: () => void
}) {
  const { t, locale } = useAdminI18n()
  const m = t.encargos.materiales
  const { data: provs } = useApi<{ proveedores: { id: number; nombre: string }[] }>('/api/admin/proveedores')
  // Default metres: what the garments need for a talla M
  const metrosTejido = prendas.reduce((s, p) => s + (METROS_DEFECTO[p] ?? 0), 0)
  const [material, setMaterial] = useState<'tejido' | 'forro'>('tejido')
  const [origen, setOrigen] = useState<'proveedor' | 'inventario' | 'cliente'>('proveedor')
  const [proveedor, setProveedor] = useState('')
  const [referencia, setReferencia] = useState('')
  const [metros, setMetros] = useState(metrosTejido ? String(metrosTejido).replace('.', ',') : '')
  const [variante, setVariante] = useState<VarianteOption | null>(null)
  const [notas, setNotas] = useState('')
  const { error, run } = useError()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const ok = await run(() => api(`/api/admin/encargos/${encargoId}/materiales`, {
      method: 'POST',
      body: { material, origen, proveedor_id: proveedor || null, referencia, metros, variante_id: variante?.id, notas },
    }))
    if (ok) onSaved()
  }

  return (
    <form onSubmit={submit} className="mt-4 pt-4 border-t border-[#1E3A5F] space-y-4">
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={m.material}>
        {(['tejido', 'forro'] as const).map((x) => (
          <button
            key={x}
            type="button"
            role="radio"
            aria-checked={material === x}
            onClick={() => {
              setMaterial(x)
              setMetros(x === 'tejido' && metrosTejido ? String(metrosTejido).replace('.', ',') : '')
            }}
            className={`px-3 py-2.5 rounded-lg border text-sm ${material === x ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-[#1E3A5F] text-gray-300'}`}
          >
            {m[x]}
          </button>
        ))}
      </div>
      <fieldset>
        <legend className="text-xs uppercase tracking-wider text-gray-400 mb-1">{m.origen}</legend>
        {(['proveedor', 'inventario', 'cliente'] as const).map((o) => (
          <label key={o} className="flex items-center gap-3 text-sm text-gray-200 min-h-10 cursor-pointer">
            <input type="radio" className="w-5 h-5 accent-[#C9A84C]" checked={origen === o} onChange={() => setOrigen(o)} />
            {t.encargos.origenes[o]}
          </label>
        ))}
      </fieldset>

      {origen === 'inventario' ? (
        <div className="space-y-2">
          {variante ? (
            <div className="flex items-center justify-between gap-3 bg-[#1E3A5F]/20 rounded-lg px-3 py-2 text-sm">
              <span className="text-white min-w-0 truncate">
                {variante.producto}{!variante.es_unica && variante.etiqueta ? ` · ${variante.etiqueta}` : ''}
                <span className="text-gray-400"> · {formatQty(variante.stock_actual, locale)} m {m.stock}</span>
              </span>
              <button type="button" className="p-1 text-gray-400 hover:text-white" onClick={() => setVariante(null)} aria-label={t.common.delete}><X size={16} /></button>
            </div>
          ) : (
            <VariantePicker tipo="material" placeholder={m.producto} onPick={setVariante} />
          )}
          {confirmado && <p className="text-xs text-amber-300">{t.encargos.estadoAyuda}</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {origen === 'proveedor' && (
            <Field label={m.proveedor}>
              <select className={inputClass} value={proveedor} onChange={(e) => setProveedor(e.target.value)}>
                <option value="">—</option>
                {provs?.proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </Field>
          )}
          <Field label={m.referencia}>
            <input className={inputClass} value={referencia} onChange={(e) => setReferencia(e.target.value)} />
          </Field>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-3">
        <Field label={m.metros}>
          <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={metros} onChange={(e) => setMetros(e.target.value)} required={origen === 'inventario'} />
        </Field>
        <Field label={m.notas}>
          <input className={inputClass} value={notas} onChange={(e) => setNotas(e.target.value)} />
        </Field>
      </div>
      {material === 'tejido' && <p className="text-xs text-gray-500">{m.metrosHint}</p>}
      <ErrorText>{error}</ErrorText>
      <div className="flex gap-2">
        <button type="submit" className={btnPrimary}>{t.common.save}</button>
        <button type="button" className={btnSecondary} onClick={onCancel}>{t.common.cancel}</button>
      </div>
    </form>
  )
}

// ── Productos del stock (no Venta) ─────────────────────────────────────────────

export interface FaltaStock {
  varianteId: number
  producto: string
  variante?: string | null
  disponible: number
  faltan?: number
  unidad: string
}

// "Not enough stock" with the same way out as Ventas: note what's missing in «Por pedir»
export function SinStockAviso({ falta, clienteId, numero }: { falta: FaltaStock; clienteId: number; numero: string }) {
  const { t, locale } = useAdminI18n()
  const [estado, setEstado] = useState<'idle' | 'ok' | 'error'>('idle')
  const u = t.inventario.unidades[falta.unidad as keyof typeof t.inventario.unidades] ?? falta.unidad
  const nombre = `${falta.producto}${falta.variante ? ` · ${falta.variante}` : ''}`
  const faltan = falta.faltan && falta.faltan > 0 ? falta.faltan : 1

  async function anadir() {
    try {
      await api('/api/admin/por-pedir', { method: 'POST', body: { variante_id: falta.varianteId, cantidad: faltan, cliente_id: clienteId, notas: numero } })
      setEstado('ok')
    } catch {
      setEstado('error')
    }
  }

  return (
    <div role="alert" className="rounded-lg border border-red-900/50 bg-red-900/15 px-3 py-2.5 text-sm">
      <p className="text-red-300">
        {t.encargos.productos.sinStock.replace('{producto}', nombre).replace('{n}', `${formatQty(falta.disponible, locale)} ${u}`)}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{t.encargos.productos.pedirHint}</p>
      <div className="mt-1.5 text-xs">
        {estado === 'ok' ? (
          <span className="text-emerald-400">{t.porPedir.anadido}</span>
        ) : (
          <button type="button" onClick={anadir} className="text-[#C9A84C] hover:text-[#D4B76A] underline underline-offset-2 py-1">
            {t.porPedir.anadir} ({formatQty(faltan, locale)} {u})
          </button>
        )}
        {estado === 'error' && <span className="ml-2 text-red-400">{t.gestionCommon.error}</span>}
      </div>
    </div>
  )
}

export function faltaDe(err: unknown): FaltaStock | null {
  const e = err as Error & { details?: FaltaStock }
  return e.message === 'insufficient stock' && e.details?.varianteId ? e.details : null
}

export function Productos({ encargoId, clienteId, numero, confirmado, productos, onChange }: {
  encargoId: number
  clienteId: number
  numero: string
  confirmado: boolean
  productos: ProductoLinea[]
  onChange: () => void
}) {
  const { t, locale } = useAdminI18n()
  const pr = t.encargos.productos
  const { propietario } = useRol()
  const [adding, setAdding] = useState(false)
  const { error, run } = useError()

  async function quitar(l: ProductoLinea) {
    if (!window.confirm(pr.quitarConfirm)) return
    if (await run(() => api(`/api/admin/encargos/${encargoId}/productos/${l.id}`, { method: 'DELETE' }))) onChange()
  }

  return (
    <Card
      title={pr.titulo}
      actions={!adding && (
        <button type="button" className={btnSecondary} onClick={() => setAdding(true)}>
          <Plus size={16} />
          <span className="hidden sm:inline">{pr.add}</span>
        </button>
      )}
    >
      {productos.length === 0 && !adding && <p className="text-sm text-gray-400">{pr.vacio}</p>}
      <ul className="divide-y divide-[#1E3A5F] -my-2">
        {productos.map((l) => {
          const u = t.inventario.unidades[l.unidad as keyof typeof t.inventario.unidades] ?? l.unidad
          const falta = !l.consumido && Number(l.stock_actual) < Number(l.cantidad)
          return (
            <li key={l.id} className="py-3 flex items-start gap-3 text-sm">
              <Package size={16} className="mt-0.5 text-gray-500 shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <Link href={`/admin/inventario/${l.producto_id}`} className="text-white hover:text-[#C9A84C] break-words">
                    {l.producto}{l.variante && !l.es_unica ? <span className="text-[#C9A84C]"> · {l.variante}</span> : null}
                  </Link>
                  <span className="tabular-nums text-gray-200">{formatQty(l.cantidad, locale)} {u}</span>
                </div>
                <div className="text-xs text-gray-400 break-words">
                  {[l.sku, propietario && l.pvp && `${pr.pvp} ${formatMoney(l.pvp, locale)}`, l.notas].filter(Boolean).join(' · ')}
                </div>
                <Badge tone={l.consumido ? 'neutral' : 'gold'}>{l.consumido ? pr.consumido : pr.seDescontara}</Badge>
                {falta && (
                  <SinStockAviso
                    clienteId={clienteId}
                    numero={numero}
                    falta={{ varianteId: l.variante_id, producto: l.producto, variante: l.es_unica ? null : l.variante, disponible: Number(l.stock_actual), faltan: Math.round((Number(l.cantidad) - Number(l.stock_actual)) * 1000) / 1000, unidad: l.unidad }}
                  />
                )}
              </div>
              <button type="button" onClick={() => quitar(l)} className="p-2 -m-1 text-gray-500 hover:text-red-400" aria-label={`${pr.quitar}: ${l.producto}`} title={pr.quitar}>
                <Trash2 size={16} />
              </button>
            </li>
          )
        })}
      </ul>
      <ErrorText>{error}</ErrorText>
      {adding && (
        <ProductoForm
          encargoId={encargoId}
          clienteId={clienteId}
          numero={numero}
          confirmado={confirmado}
          onCancel={() => setAdding(false)}
          onSaved={() => { setAdding(false); onChange() }}
        />
      )}
    </Card>
  )
}

function ProductoForm({ encargoId, clienteId, numero, confirmado, onCancel, onSaved }: {
  encargoId: number
  clienteId: number
  numero: string
  confirmado: boolean
  onCancel: () => void
  onSaved: () => void
}) {
  const { t, locale } = useAdminI18n()
  const pr = t.encargos.productos
  const [variante, setVariante] = useState<VarianteOption | null>(null)
  const [cantidad, setCantidad] = useState('1')
  const [notas, setNotas] = useState('')
  const [falta, setFalta] = useState<FaltaStock | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const u = variante ? (t.inventario.unidades[variante.unidad as keyof typeof t.inventario.unidades] ?? variante.unidad) : ''

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!variante) return
    setSaving(true)
    setError('')
    setFalta(null)
    try {
      await api(`/api/admin/encargos/${encargoId}/productos`, { method: 'POST', body: { variante_id: variante.id, cantidad, notas } })
      onSaved()
    } catch (err) {
      const f = faltaDe(err)
      if (f) setFalta(f)
      else {
        const code = (err as Error).message
        setError(t.encargos.errors[code] ?? (t.inventario.errors as Record<string, string>)[code] ?? t.gestionCommon.error)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 pt-4 border-t border-[#1E3A5F] space-y-4">
      {variante ? (
        <div className="flex items-center justify-between gap-3 bg-[#1E3A5F]/20 rounded-lg px-3 py-2 text-sm">
          <span className="text-white min-w-0 break-words">
            {variante.producto}{!variante.es_unica && variante.etiqueta ? ` · ${variante.etiqueta}` : ''}
            <span className="text-gray-400"> · {formatQty(variante.stock_actual, locale)} {u} {pr.enStock}</span>
          </span>
          <button type="button" className="p-1 text-gray-400 hover:text-white shrink-0" onClick={() => { setVariante(null); setFalta(null) }} aria-label={t.common.delete}><X size={16} /></button>
        </div>
      ) : (
        <VariantePicker
          placeholder={pr.buscar}
          onPick={(v) => { setVariante(v); setFalta(null) }}
          renderMeta={(v) => `${formatQty(v.stock_actual, locale)} ${t.inventario.unidades[v.unidad as keyof typeof t.inventario.unidades] ?? v.unidad}`}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-3">
        <Field label={pr.cantidad}>
          <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
        </Field>
        <Field label={pr.notas}>
          <input className={inputClass} value={notas} onChange={(e) => setNotas(e.target.value)} maxLength={500} />
        </Field>
      </div>
      {confirmado && <p className="text-xs text-amber-300">{pr.descontaraAhora}</p>}
      {!confirmado && variante && Number(cantidad.replace(',', '.')) > Number(variante.stock_actual) && (
        <p className="text-xs text-amber-300">{pr.faltaAviso}</p>
      )}
      {falta && <SinStockAviso falta={falta} clienteId={clienteId} numero={numero} />}
      <ErrorText>{error}</ErrorText>
      <div className="flex gap-2">
        <button type="submit" className={btnPrimary} disabled={!variante || saving}>{t.common.save}</button>
        <button type="button" className={btnSecondary} onClick={onCancel}>{t.common.cancel}</button>
      </div>
    </form>
  )
}

// ── Pruebas (each one is a Cita) ──────────────────────────────────────────────

export function Pruebas({ encargoId, pruebas, onChange }: { encargoId: number; pruebas: Prueba[]; onChange: () => void }) {
  const { t, locale } = useAdminI18n()
  const p = t.encargos.pruebas
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [notas, setNotas] = useState('')
  const { error, run } = useError()
  // Numbered in date order, skipping cancelled ones
  const titulos = pruebas.reduce<{ n: number; list: string[] }>((acc, pr) => {
    if (pr.status === 'cancelled') return { ...acc, list: [...acc.list, p.cancelada] }
    return { n: acc.n + 1, list: [...acc.list, p.n.replace('{n}', String(acc.n + 1))] }
  }, { n: 0, list: [] }).list

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (await run(() => api(`/api/admin/encargos/${encargoId}/pruebas`, { method: 'POST', body: { fecha, hora, notas } }))) {
      setFecha('')
      setHora('')
      setNotas('')
      onChange()
    }
  }

  return (
    <Card title={t.encargos.secciones.pruebas}>
      {pruebas.length === 0 ? (
        <p className="text-sm text-gray-400 mb-4">{p.vacio}</p>
      ) : (
        <ul className="divide-y divide-[#1E3A5F] -mt-2 mb-4">
          {pruebas.map((pr, i) => (
            <PruebaFila key={`${pr.id}-${pr.notas}`} encargoId={encargoId} prueba={pr} titulo={titulos[i]} onChange={onChange} locale={locale} />
          ))}
        </ul>
      )}
      <form onSubmit={add} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label={p.fecha}><input type="date" className={inputClass} value={fecha} onChange={(e) => setFecha(e.target.value)} required /></Field>
          <Field label={p.hora}><input type="time" step={900} className={inputClass} value={hora} onChange={(e) => setHora(e.target.value)} required /></Field>
        </div>
        <Field label={p.notas}><input className={inputClass} value={notas} onChange={(e) => setNotas(e.target.value)} /></Field>
        <ErrorText>{error}</ErrorText>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={btnSecondary}><CalendarPlus size={16} />{p.add}</button>
          <span className="text-xs text-gray-500">{p.ayuda}</span>
        </div>
      </form>
    </Card>
  )
}

function PruebaFila({ encargoId, prueba, titulo, onChange, locale }: { encargoId: number; prueba: Prueba; titulo: string; onChange: () => void; locale: string }) {
  const { t } = useAdminI18n()
  const p = t.encargos.pruebas
  const [notas, setNotas] = useState(prueba.notas ?? '')
  const { error, run } = useError()
  const cancelada = prueba.status === 'cancelled'

  async function patch(body: Record<string, unknown>) {
    if (await run(() => api(`/api/admin/encargos/${encargoId}/pruebas/${prueba.id}`, { method: 'PATCH', body }))) onChange()
  }

  return (
    <li className={`py-3 text-sm ${cancelada ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-white">
          {titulo}
          {prueba.fecha && <span className="text-gray-300"> · {formatDate(prueba.fecha, locale)} {prueba.hora}</span>}
        </span>
        {!cancelada && (
          <button
            type="button"
            className="text-xs text-gray-400 hover:text-red-300 py-1"
            onClick={() => window.confirm(p.cancelConfirm) && patch({ cancelar: true })}
          >
            {p.cancelar}
          </button>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <input className={inputClass} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder={p.notas} aria-label={p.notas} />
        {notas !== (prueba.notas ?? '') && (
          <button type="button" className={btnSecondary} onClick={() => patch({ notas })}>{p.guardarNotas}</button>
        )}
      </div>
      <ErrorText>{error}</ErrorText>
    </li>
  )
}

// ── Entrega ───────────────────────────────────────────────────────────────────

export function Entrega({ encargoId, fechaEntrega, cita, onChange }: {
  encargoId: number
  fechaEntrega: string | null
  cita: { fecha: string | null; hora: string | null; estado: string | null }
  onChange: () => void
}) {
  const { t, locale } = useAdminI18n()
  const en = t.encargos.entregaCita
  const [fecha, setFecha] = useState(cita.fecha ?? fechaEntrega ?? '')
  const [hora, setHora] = useState(cita.hora ?? '')
  const { error, run } = useError()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (await run(() => api(`/api/admin/encargos/${encargoId}/entrega`, { method: 'POST', body: { fecha, hora } }))) onChange()
  }

  return (
    <Card title={t.encargos.secciones.entrega}>
      <dl className="text-sm space-y-1 mb-4">
        <div className="flex justify-between gap-3"><dt className="text-gray-400">{t.encargos.campos.fecha_entrega}</dt><dd className="text-white">{formatDate(fechaEntrega, locale)}</dd></div>
        {cita.fecha && (
          <div className="flex justify-between gap-3">
            <dt className="text-gray-400">{en.cita}</dt>
            <dd className={cita.estado === 'cancelled' ? 'text-red-300 line-through' : 'text-white'}>{formatDate(cita.fecha, locale)} {cita.hora}</dd>
          </div>
        )}
      </dl>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.encargos.pruebas.fecha}><input type="date" className={inputClass} value={fecha} onChange={(e) => setFecha(e.target.value)} required /></Field>
          <Field label={t.encargos.pruebas.hora}><input type="time" step={900} className={inputClass} value={hora} onChange={(e) => setHora(e.target.value)} required /></Field>
        </div>
        <ErrorText>{error}</ErrorText>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={btnSecondary}><CalendarPlus size={16} />{cita.fecha ? en.mover : en.programar}</button>
          <span className="text-xs text-gray-500">{en.ayuda}</span>
        </div>
      </form>
    </Card>
  )
}

// ── Pagos (Propietarios) ──────────────────────────────────────────────────────

const METODOS = METODOS_PAGO

export function Pagos({ encargoId, totales, pagos, onChange }: {
  encargoId: number
  totales: { total: string | null; pagado: string | null; pendiente: string | null }
  pagos: Pago[]
  onChange: () => void
}) {
  const { t, locale } = useAdminI18n()
  const pg = t.encargos.pagos
  const metodoLabel = (x: string) => t.ventas.metodos[x as keyof typeof t.ventas.metodos] ?? x
  const pendiente = totales.pendiente !== null ? Number(totales.pendiente) : null
  const [importe, setImporte] = useState(pendiente && pendiente > 0 ? pendiente.toFixed(2).replace('.', ',') : '')
  const [metodo, setMetodo] = useState('tarjeta')
  const [split, setSplit] = useState<{ metodo: string; importe: string }[]>([{ metodo: 'efectivo', importe: '' }, { metodo: 'tarjeta', importe: '' }])
  const [fecha, setFecha] = useState(() => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' }))
  const [notas, setNotas] = useState('')
  const { error, run } = useError()

  async function add(e: React.FormEvent) {
    e.preventDefault()
    const ok = await run(() => api(`/api/admin/encargos/${encargoId}/pagos`, {
      method: 'POST',
      body: { importe, metodo, pagos: metodo === 'mixto' ? split : undefined, fecha, notas },
    }))
    if (ok) onChange()
  }
  async function borrar(pago: Pago) {
    if (!window.confirm(pg.borrarConfirm)) return
    if (await run(() => api(`/api/admin/encargos/${encargoId}/pagos/${pago.id}`, { method: 'DELETE' }))) onChange()
  }

  const splitRest = toCents(importe.replace(',', '.') || '0') - split.reduce((s, x) => s + toCents(x.importe.replace(',', '.') || '0'), 0)

  return (
    <Card title={t.encargos.secciones.pagos}>
      {/* TOTAL / SEÑAL / PENDIENTE, like the paper ficha */}
      <dl className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
        {([
          [t.encargos.total, totales.total],
          [t.encargos.pagado, totales.pagado],
          [t.encargos.pendiente, totales.pendiente],
        ] as const).map(([label, value], i) => (
          <div key={label} className="bg-[#1E3A5F]/20 rounded-lg px-2 sm:px-3 py-2.5 min-w-0">
            <dt className="text-xs text-gray-400">{label}</dt>
            <dd className={`text-sm sm:text-lg tabular-nums ${i === 2 && pendiente !== null && pendiente > 0.004 ? 'text-amber-300' : 'text-white'}`}>{formatMoney(value, locale)}</dd>
          </div>
        ))}
      </dl>
      {totales.total === null && <p className="text-xs text-gray-500 -mt-3 mb-4">{pg.sinTotal}</p>}

      {pagos.length === 0 ? (
        <p className="text-sm text-gray-400 mb-4">{pg.vacio}</p>
      ) : (
        <ul className="divide-y divide-[#1E3A5F] -mt-2 mb-4">
          {pagos.map((x) => (
            <li key={x.id} className="py-2.5 flex items-center gap-3 text-sm">
              <div className="min-w-0 flex-1">
                <div className="text-white">{formatDate(x.fecha, locale)} · {x.pagos ? x.pagos.map((s) => `${metodoLabel(s.metodo)} ${formatMoney(s.importe, locale)}`).join(' + ') : metodoLabel(x.metodo)}</div>
                <div className="text-xs text-gray-500">{[x.admin_nombre, x.notas].filter(Boolean).join(' · ')}</div>
              </div>
              <span className="text-white tabular-nums">{formatMoney(x.importe, locale)}</span>
              <button type="button" onClick={() => borrar(x)} className="p-2 -m-1 text-gray-500 hover:text-red-400" aria-label={pg.borrar}><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="space-y-3 pt-4 border-t border-[#1E3A5F]">
        <div className="grid grid-cols-2 gap-3">
          <Field label={pg.importe}><input className={`${inputClass} tabular-nums`} inputMode="decimal" value={importe} onChange={(e) => setImporte(e.target.value)} required /></Field>
          <Field label={pg.fecha}><input type="date" className={inputClass} value={fecha} onChange={(e) => setFecha(e.target.value)} required /></Field>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label={pg.metodo}>
          {[...METODOS, 'mixto' as const].map((x) => (
            <button
              key={x}
              type="button"
              role="radio"
              aria-checked={metodo === x}
              onClick={() => setMetodo(x)}
              className={`px-3 py-2.5 rounded-lg border text-sm ${metodo === x ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-[#1E3A5F] text-gray-300'}`}
            >
              {metodoLabel(x)}
            </button>
          ))}
        </div>
        {metodo === 'mixto' && (
          <div className="space-y-2">
            {split.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <select className={inputClass} value={s.metodo} onChange={(e) => setSplit(split.map((y, j) => (j === i ? { ...y, metodo: e.target.value } : y)))} aria-label={pg.metodo}>
                  {METODOS.map((x) => <option key={x} value={x}>{metodoLabel(x)}</option>)}
                </select>
                <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={s.importe} onChange={(e) => setSplit(split.map((y, j) => (j === i ? { ...y, importe: e.target.value } : y)))} aria-label={pg.importe} />
              </div>
            ))}
            {splitRest !== 0 && <p className="text-xs text-amber-300 tabular-nums">{t.ventas.pendienteMixto}: {formatMoney(splitRest / 100, locale)}</p>}
          </div>
        )}
        <Field label={t.common.notes}><input className={inputClass} value={notas} onChange={(e) => setNotas(e.target.value)} /></Field>
        <ErrorText>{error}</ErrorText>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={btnPrimary}>{pg.add}</button>
          <span className="text-xs text-gray-500">{pg.ayuda}</span>
        </div>
      </form>
    </Card>
  )
}
