'use client'

import { useState } from 'react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { ErrorText, Field, Modal, api, btnPrimary, btnSecondary, inputClass } from '../../_components/ui'
import VariantesGenerator, { draftsToBody, type VarianteDraft } from '../VariantesGenerator'
import { useRol } from '../../_components/role'
import { UbicacionSelect, errorMessage, formatQty, type ProveedorOption } from '../shared'

export interface Variante {
  id: number
  etiqueta: string | null
  sku: string | null
  es_unica: boolean
  atributos: Record<string, string>
  stock_actual: string
  stock_reservado: string
  stock_minimo: string
  ubicacion: string | null
  pvp: string | null
  coste: string | null
  coste_medio: string | null
  activo: boolean
  alerta: 'agotado' | 'bajo' | null
}

const MOTIVOS = ['recuento', 'rotura', 'merma', 'regalo', 'uso_interno', 'error', 'otro'] as const

function Actions({ saving, onClose, label }: { saving: boolean; onClose: () => void; label: string }) {
  const { t } = useAdminI18n()
  return (
    <div className="flex gap-2 pt-2">
      <button type="submit" className={btnPrimary} disabled={saving}>{saving ? t.common.saving : label}</button>
      <button type="button" className={btnSecondary} onClick={onClose}>{t.common.cancel}</button>
    </div>
  )
}

export function varianteNombre(v: Pick<Variante, 'etiqueta' | 'es_unica'>, unica: string) {
  return v.es_unica ? unica : v.etiqueta || '—'
}

export function EntradaModal({ variante, productoNombre, unidad, proveedorId, coste, proveedores, onClose, onDone }: {
  variante: Variante
  productoNombre: string
  unidad: string
  proveedorId: number | null
  coste: string | null
  proveedores: ProveedorOption[]
  onClose: () => void
  onDone: () => void
}) {
  const { t } = useAdminI18n()
  const e = t.inventario.entradas
  const [proveedor, setProveedor] = useState(proveedorId ? String(proveedorId) : '')
  const [cantidad, setCantidad] = useState('')
  const [costeUnitario, setCosteUnitario] = useState(variante.coste ?? coste ?? '')
  const [referencia, setReferencia] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api('/api/admin/inventario/compras', {
        method: 'POST',
        body: {
          proveedor_id: proveedor,
          referencia_proveedor: referencia,
          lineas: [{ variante_id: variante.id, cantidad, coste_unitario: costeUnitario || 0 }],
        },
      })
      onDone()
    } catch (err) {
      setError(errorMessage(t, err))
      setSaving(false)
    }
  }

  return (
    <Modal title={`${e.quick} · ${productoNombre}${variante.es_unica ? '' : ` · ${variante.etiqueta}`}`} onClose={onClose} closeLabel={t.common.close}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={e.proveedor}>
          <select className={inputClass} value={proveedor} onChange={(ev) => setProveedor(ev.target.value)} required>
            <option value="" disabled>—</option>
            {proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={`${e.cantidad} (${t.inventario.unidades[unidad as keyof typeof t.inventario.unidades] ?? unidad})`}>
            <input className={`${inputClass} tabular-nums`} inputMode={unidad === 'm' ? 'decimal' : 'numeric'} value={cantidad} onChange={(ev) => setCantidad(ev.target.value)} required />
          </Field>
          <Field label={e.costeUnitario}>
            <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={costeUnitario} onChange={(ev) => setCosteUnitario(ev.target.value)} />
          </Field>
        </div>
        <Field label={e.refProveedor}>
          <input className={inputClass} value={referencia} onChange={(ev) => setReferencia(ev.target.value)} />
        </Field>
        <p className="text-xs text-gray-500">{e.help}</p>
        <ErrorText>{error}</ErrorText>
        <Actions saving={saving} onClose={onClose} label={e.save} />
      </form>
    </Modal>
  )
}

export function AjusteModal({ variante, productoNombre, unidad, onClose, onDone }: {
  variante: Variante
  productoNombre: string
  unidad: string
  onClose: () => void
  onDone: (sinCambios: boolean) => void
}) {
  const { t, locale } = useAdminI18n()
  const a = t.inventario.ajuste
  const [modo, setModo] = useState<'recuento' | 'delta'>('recuento')
  const [cantidad, setCantidad] = useState('')
  const [motivo, setMotivo] = useState<(typeof MOTIVOS)[number]>('recuento')
  const [nota, setNota] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const parsed = Number(cantidad.replace(',', '.'))
  const resultado = cantidad.trim() && Number.isFinite(parsed) ? (modo === 'recuento' ? parsed : Number(variante.stock_actual) + parsed) : null
  const u = t.inventario.unidades[unidad as keyof typeof t.inventario.unidades] ?? unidad

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await api<{ sinCambios: boolean }>('/api/admin/inventario/ajustes', {
        method: 'POST',
        body: { varianteId: variante.id, modo, cantidad, motivo, nota },
      })
      onDone(res.sinCambios)
    } catch (err) {
      setError(errorMessage(t, err))
      setSaving(false)
    }
  }

  return (
    <Modal title={`${a.title} · ${productoNombre}${variante.es_unica ? '' : ` · ${variante.etiqueta}`}`} onClose={onClose} closeLabel={t.common.close}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={a.modo}>
          {(['recuento', 'delta'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={modo === m}
              onClick={() => { setModo(m); if (m === 'recuento') setMotivo('recuento') }}
              className={`min-h-11 px-3 py-2 rounded-lg text-sm border transition-colors ${
                modo === m ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10' : 'border-[#1E3A5F] text-gray-300'
              }`}
            >
              {a[m]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label={`${modo === 'recuento' ? a.cantidadRecuento : a.cantidadDelta} (${u})`}>
            <input
              className={`${inputClass} tabular-nums`}
              inputMode={unidad === 'm' || modo === 'delta' ? 'decimal' : 'numeric'}
              value={cantidad}
              onChange={(ev) => setCantidad(ev.target.value)}
              placeholder={modo === 'delta' ? '-1' : ''}
              required
            />
          </Field>
          <Field label={a.motivo}>
            <select className={inputClass} value={motivo} onChange={(ev) => setMotivo(ev.target.value as (typeof MOTIVOS)[number])}>
              {MOTIVOS.map((m) => <option key={m} value={m}>{a.motivos[m]}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex gap-6 text-sm">
          <div><span className="text-gray-400">{a.actual}: </span><span className="text-white tabular-nums">{formatQty(variante.stock_actual, locale)} {u}</span></div>
          {resultado !== null && (
            <div>
              <span className="text-gray-400">{a.resultado}: </span>
              <span className={`tabular-nums ${resultado < 0 ? 'text-red-400' : 'text-white'}`}>{formatQty(resultado, locale)} {u}</span>
            </div>
          )}
        </div>
        <Field label={`${a.nota} (${t.gestionCommon.optional})`}>
          <input className={inputClass} value={nota} onChange={(ev) => setNota(ev.target.value)} />
        </Field>
        <ErrorText>{error}</ErrorText>
        <Actions saving={saving} onClose={onClose} label={t.common.save} />
      </form>
    </Modal>
  )
}

export function VarianteEditModal({ variante, onClose, onDone }: { variante: Variante; onClose: () => void; onDone: () => void }) {
  const { t } = useAdminI18n()
  const { propietario } = useRol()
  const s = t.inventario.variantesSection
  const [form, setForm] = useState({
    etiqueta: variante.etiqueta ?? '',
    sku: variante.sku ?? '',
    pvp: variante.pvp ?? '',
    coste: variante.coste ?? '',
    stock_minimo: String(Number(variante.stock_minimo)),
    ubicacion: variante.ubicacion ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function patch(body: Record<string, unknown>) {
    setSaving(true)
    setError('')
    try {
      await api(`/api/admin/inventario/variantes/${variante.id}`, { method: 'PATCH', body })
      onDone()
    } catch (err) {
      setError(errorMessage(t, err))
      setSaving(false)
    }
  }

  const set = (key: keyof typeof form) => (ev: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: ev.target.value })

  return (
    <Modal title={variante.es_unica ? s.unica : variante.etiqueta ?? s.etiqueta} onClose={onClose} closeLabel={t.common.close}>
      <form onSubmit={(ev) => { ev.preventDefault(); patch(form) }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {!variante.es_unica && (
            <Field label={s.etiqueta}><input className={inputClass} value={form.etiqueta} onChange={set('etiqueta')} /></Field>
          )}
          <Field label={s.sku}><input className={inputClass} value={form.sku} onChange={set('sku')} disabled={variante.es_unica} /></Field>
          {propietario && (
            <>
              <Field label={`${s.pvp} (${s.override})`}><input className={inputClass} inputMode="decimal" value={form.pvp} onChange={set('pvp')} /></Field>
              <Field label={`${s.coste} (${s.override})`}><input className={inputClass} inputMode="decimal" value={form.coste} onChange={set('coste')} /></Field>
            </>
          )}
          <Field label={s.minimo}><input className={inputClass} inputMode="decimal" value={form.stock_minimo} onChange={set('stock_minimo')} /></Field>
          <Field label={s.ubicacion}><UbicacionSelect value={form.ubicacion} onChange={(v) => setForm({ ...form, ubicacion: v })} /></Field>
        </div>
        <ErrorText>{error}</ErrorText>
        <div className="flex flex-wrap gap-2 pt-2">
          <button type="submit" className={btnPrimary} disabled={saving}>{saving ? t.common.saving : t.common.save}</button>
          {!variante.es_unica && (
            <button type="button" className={btnSecondary} disabled={saving} onClick={() => patch({ activo: !variante.activo })}>
              {variante.activo ? s.deactivate : s.activate}
            </button>
          )}
          <button type="button" className={btnSecondary} onClick={onClose}>{t.common.cancel}</button>
        </div>
      </form>
    </Modal>
  )
}

export function AddVariantesModal({ productoId, referencia, stockMinimo, unidad, onClose, onDone }: {
  productoId: number
  referencia: string
  stockMinimo: string
  unidad: string
  onClose: () => void
  onDone: () => void
}) {
  const { t } = useAdminI18n()
  const [rows, setRows] = useState<VarianteDraft[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    if (rows.length === 0) return
    setSaving(true)
    setError('')
    try {
      await api(`/api/admin/inventario/productos/${productoId}/variantes`, { method: 'POST', body: { variantes: draftsToBody(rows) } })
      onDone()
    } catch (err) {
      setError(errorMessage(t, err))
      setSaving(false)
    }
  }

  return (
    <Modal title={t.inventario.variantesSection.add} onClose={onClose} closeLabel={t.common.close} wide>
      <form onSubmit={submit} className="space-y-4">
        <VariantesGenerator rows={rows} onChange={setRows} referencia={referencia} stockMinimo={stockMinimo} unidadDecimal={unidad === 'm'} />
        <ErrorText>{error}</ErrorText>
        <Actions saving={saving} onClose={onClose} label={t.inventario.variantesSection.add} />
      </form>
    </Modal>
  )
}
