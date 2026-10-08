'use client'

import { useState } from 'react'
import { Trash2, Wand2 } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Field, btnSecondary, inputClass } from '../_components/ui'
import { expandValores, skuFor } from './shared'

export interface VarianteDraft {
  key: string
  atributos: Record<string, string>
  etiqueta: string
  sku: string
  stock_inicial: string
  stock_minimo: string
}

const ATRIBUTOS = ['talla', 'color', 'tejido', 'medida'] as const

function AtributoPicker({ value, custom, onValue, onCustom }: {
  value: string
  custom: string
  onValue: (v: string) => void
  onCustom: (v: string) => void
}) {
  const { t } = useAdminI18n()
  const labels = t.inventario.variantesSection.atributos
  return (
    <div className="grid grid-cols-2 gap-2">
      <select className={inputClass} value={value} onChange={(e) => onValue(e.target.value)} aria-label={t.inventario.variantesSection.atributo}>
        {ATRIBUTOS.map((a) => (
          <option key={a} value={a}>{labels[a]}</option>
        ))}
        <option value="otro">{labels.otro}</option>
      </select>
      {value === 'otro' && (
        <input className={inputClass} value={custom} onChange={(e) => onCustom(e.target.value)} placeholder={labels.otro} aria-label={labels.otro} />
      )}
    </div>
  )
}

export default function VariantesGenerator({ rows, onChange, referencia, stockMinimo, unidadDecimal }: {
  rows: VarianteDraft[]
  onChange: (rows: VarianteDraft[]) => void
  referencia: string
  stockMinimo: string
  unidadDecimal: boolean
}) {
  const { t } = useAdminI18n()
  const s = t.inventario.variantesSection
  const [attr1, setAttr1] = useState('talla')
  const [custom1, setCustom1] = useState('')
  const [values1, setValues1] = useState('')
  const [attr2, setAttr2] = useState('color')
  const [custom2, setCustom2] = useState('')
  const [values2, setValues2] = useState('')

  function generate() {
    const name1 = (attr1 === 'otro' ? custom1 : attr1).trim().toLowerCase()
    const name2 = (attr2 === 'otro' ? custom2 : attr2).trim().toLowerCase()
    const list1 = expandValores(values1)
    const list2 = values2.trim() && name2 ? expandValores(values2) : [null]
    if (!name1 || list1.length === 0) return
    const existing = new Set(rows.map((r) => r.etiqueta.toLowerCase()))
    const created: VarianteDraft[] = []
    for (const a of list1) {
      for (const b of list2) {
        const atributos: Record<string, string> = { [name1]: a }
        if (b !== null) atributos[name2] = b
        const etiqueta = Object.values(atributos).join(' · ')
        if (existing.has(etiqueta.toLowerCase())) continue
        created.push({
          key: `${Date.now()}-${created.length}`,
          atributos,
          etiqueta,
          sku: skuFor(referencia, Object.values(atributos)),
          stock_inicial: '',
          stock_minimo: stockMinimo || '0',
        })
      }
    }
    onChange([...rows, ...created])
    setValues1('')
    setValues2('')
  }

  const update = (key: string, patch: Partial<VarianteDraft>) => onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)))

  return (
    <div className="space-y-4 @container">
      <div className="bg-[#1E3A5F]/15 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-3">
          <Field label={s.atributo}>
            <AtributoPicker value={attr1} custom={custom1} onValue={setAttr1} onCustom={setCustom1} />
          </Field>
          <Field label={s.valores}>
            <input className={inputClass} value={values1} onChange={(e) => setValues1(e.target.value)} placeholder="38-48" />
          </Field>
          <Field label={`${s.combinar} (${t.gestionCommon.optional})`}>
            <AtributoPicker value={attr2} custom={custom2} onValue={setAttr2} onCustom={setCustom2} />
          </Field>
          <Field label={s.valores}>
            <input className={inputClass} value={values2} onChange={(e) => setValues2(e.target.value)} placeholder={s.valoresEjemplo} />
          </Field>
        </div>
        <p className="text-xs text-gray-500">{s.valoresHint}</p>
        <button type="button" className={btnSecondary} onClick={generate} disabled={!values1.trim()}>
          <Wand2 size={16} />
          {s.generator}
        </button>
      </div>

      {rows.length > 0 && (
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">{s.preview} ({rows.length})</div>
          <div className="space-y-2 @container">
            {rows.map((r) => (
              <div key={r.key} className="grid grid-cols-2 @xl:grid-cols-[1fr_1.2fr_0.7fr_0.7fr_auto] gap-2 items-end bg-[#0A1628] border border-[#1E3A5F] rounded-lg p-3">
                <Field label={s.etiqueta}>
                  <input className={inputClass} value={r.etiqueta} onChange={(e) => update(r.key, { etiqueta: e.target.value })} />
                </Field>
                <Field label={s.sku}>
                  <input className={inputClass} value={r.sku} onChange={(e) => update(r.key, { sku: e.target.value })} />
                </Field>
                <Field label={t.inventario.fields.stock_inicial}>
                  <input
                    className={`${inputClass} tabular-nums`}
                    inputMode={unidadDecimal ? 'decimal' : 'numeric'}
                    value={r.stock_inicial}
                    onChange={(e) => update(r.key, { stock_inicial: e.target.value })}
                    placeholder="0"
                  />
                </Field>
                <Field label={s.minimo}>
                  <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={r.stock_minimo} onChange={(e) => update(r.key, { stock_minimo: e.target.value })} />
                </Field>
                <button
                  type="button"
                  onClick={() => onChange(rows.filter((x) => x.key !== r.key))}
                  className="min-h-11 px-3 text-gray-500 hover:text-red-400 justify-self-end"
                  aria-label={s.remove}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function draftsToBody(rows: VarianteDraft[]) {
  return rows.map((r) => ({
    atributos: r.atributos,
    etiqueta: r.etiqueta,
    sku: r.sku,
    stock_inicial: r.stock_inicial || 0,
    stock_minimo: r.stock_minimo || 0,
  }))
}
