'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Trash2 } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Card, ErrorText, Field, PageHeader, api, btnPrimary, formatMoney, inputClass, useApi } from '../../../_components/ui'
import VariantePicker, { type VarianteOption } from '../../../_components/VariantePicker'
import InventarioTabs from '../../InventarioTabs'
import { errorMessage, formatQty, type ProveedorOption } from '../../shared'

interface Linea {
  variante: VarianteOption
  cantidad: string
  coste: string
}

const toNumber = (s: string) => Number(s.replace(',', '.')) || 0

export default function NuevaEntradaPage() {
  const { t, locale } = useAdminI18n()
  const e = t.inventario.entradas
  const router = useRouter()
  const { data: provs } = useApi<{ proveedores: ProveedorOption[] }>('/api/admin/proveedores')
  const [proveedor, setProveedor] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' }))
  const [referencia, setReferencia] = useState('')
  const [notas, setNotas] = useState('')
  const [lineas, setLineas] = useState<Linea[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function add(v: VarianteOption) {
    // Scanning the same item twice adds one more instead of a duplicate line
    const existing = lineas.findIndex((l) => l.variante.id === v.id)
    if (existing >= 0) {
      setLineas(lineas.map((l, i) => (i === existing ? { ...l, cantidad: String(toNumber(l.cantidad) + 1) } : l)))
      return
    }
    setLineas([...lineas, { variante: v, cantidad: '1', coste: v.coste ? String(Number(v.coste)) : '' }])
    if (!proveedor && v.proveedor_id) setProveedor(String(v.proveedor_id))
  }

  const update = (i: number, patch: Partial<Linea>) => setLineas(lineas.map((l, j) => (j === i ? { ...l, ...patch } : l)))
  const total = lineas.reduce((sum, l) => sum + toNumber(l.cantidad) * toNumber(l.coste), 0)

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { compra } = await api<{ compra: { id: number } }>('/api/admin/inventario/compras', {
        method: 'POST',
        body: {
          proveedor_id: proveedor,
          fecha,
          referencia_proveedor: referencia,
          notas,
          lineas: lineas.map((l) => ({ variante_id: l.variante.id, cantidad: l.cantidad, coste_unitario: l.coste || 0 })),
        },
      })
      router.push(`/admin/inventario/entradas/${compra.id}`)
    } catch (err) {
      setError(errorMessage(t, err))
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title={e.new} back={{ href: '/admin/inventario/entradas', label: e.back }} />
      <InventarioTabs />

      <form onSubmit={submit} className="space-y-6">
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label={e.proveedor}>
              <select className={inputClass} value={proveedor} onChange={(ev) => setProveedor(ev.target.value)} required>
                <option value="" disabled>—</option>
                {provs?.proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </Field>
            <Field label={e.fecha}>
              <input className={inputClass} type="date" value={fecha} onChange={(ev) => setFecha(ev.target.value)} required />
            </Field>
            <Field label={e.refProveedor}>
              <input className={inputClass} value={referencia} onChange={(ev) => setReferencia(ev.target.value)} />
            </Field>
          </div>
        </Card>

        <Card title={e.lineas}>
          <VariantePicker
            onPick={add}
            placeholder={e.buscarProducto}
            renderMeta={(v) => `${t.inventario.stock}: ${formatQty(v.stock_actual, locale)}`}
          />
          {lineas.length > 0 && (
            <ul className="mt-4 space-y-2">
              {lineas.map((l, i) => {
                const u = t.inventario.unidades[l.variante.unidad as keyof typeof t.inventario.unidades] ?? l.variante.unidad
                return (
                  <li key={l.variante.id} className="grid grid-cols-2 sm:grid-cols-[1fr_7rem_8rem_6rem_auto] gap-2 items-end bg-[#1E3A5F]/15 rounded-lg p-3">
                    <div className="col-span-2 sm:col-span-1 min-w-0 self-center">
                      <div className="text-white text-sm truncate">
                        {l.variante.producto}
                        {!l.variante.es_unica && l.variante.etiqueta && <span className="text-[#C9A84C]"> · {l.variante.etiqueta}</span>}
                      </div>
                      <div className="text-xs text-gray-500">{l.variante.sku ?? l.variante.referencia ?? ''}</div>
                    </div>
                    <Field label={`${e.cantidad} (${u})`}>
                      <input
                        className={`${inputClass} tabular-nums`}
                        inputMode={l.variante.unidad === 'm' ? 'decimal' : 'numeric'}
                        value={l.cantidad}
                        onChange={(ev) => update(i, { cantidad: ev.target.value })}
                        required
                      />
                    </Field>
                    <Field label={e.costeUnitario}>
                      <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={l.coste} onChange={(ev) => update(i, { coste: ev.target.value })} />
                    </Field>
                    <div className="text-sm text-white tabular-nums text-right self-center sm:pb-3">{formatMoney(toNumber(l.cantidad) * toNumber(l.coste), locale)}</div>
                    <button
                      type="button"
                      onClick={() => setLineas(lineas.filter((_, j) => j !== i))}
                      className="min-h-11 px-3 text-gray-500 hover:text-red-400 justify-self-end"
                      aria-label={t.common.delete}
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          <div className="flex justify-end gap-4 border-t border-[#1E3A5F] mt-4 pt-4 text-sm">
            <span className="text-gray-400">{e.total}</span>
            <span className="text-white tabular-nums font-medium">{formatMoney(total, locale)}</span>
          </div>
        </Card>

        <Card title={e.notas}>
          <textarea className={inputClass} rows={3} value={notas} onChange={(ev) => setNotas(ev.target.value)} aria-label={e.notas} />
        </Card>

        <p className="text-sm text-gray-400">{e.help}</p>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={btnPrimary} disabled={saving || lineas.length === 0}>
            <Save size={16} />
            {saving ? e.saving : e.save}
          </button>
          <ErrorText>{error}</ErrorText>
        </div>
      </form>
    </div>
  )
}
