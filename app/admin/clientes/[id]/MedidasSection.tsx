'use client'

import { useMemo, useState } from 'react'
import { Plus, Ruler, Trash2 } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { CAMPOS_MEDIDAS, TIPOS_PRENDA_MEDIDAS, type TipoPrendaMedidas } from '@/lib/admin/medidas'
import { Card, ErrorText, Field, Modal, api, btnPrimary, btnSecondary, formatDate, inputClass } from '../../_components/ui'

export interface MedidasRow {
  id: number
  tipo_prenda: TipoPrendaMedidas
  medidas: Record<string, number | string>
  observaciones: string | null
  tomada_en: string
  tomada_por_nombre: string | null
}

export default function MedidasSection({ clienteId, medidas, onChange }: {
  clienteId: number
  medidas: MedidasRow[]
  onChange: () => void
}) {
  const { t, locale } = useAdminI18n()
  const [adding, setAdding] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Rows arrive newest first, so the first per garment type is the current set
  const latest = useMemo(() => {
    const seen = new Set<string>()
    return medidas.filter((m) => (seen.has(m.tipo_prenda) ? false : (seen.add(m.tipo_prenda), true)))
  }, [medidas])

  async function remove(row: MedidasRow) {
    if (!window.confirm(t.medidas.deleteConfirm)) return
    await api(`/api/admin/clientes/${clienteId}/medidas?medidasId=${row.id}`, { method: 'DELETE' })
    onChange()
  }

  const label = (key: string) => t.medidas.campos[key] ?? key.replace(/_/g, ' ')

  const renderRow = (m: MedidasRow, withDelete: boolean) => (
    <div key={m.id} className="bg-[#1E3A5F]/15 rounded-lg p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-white font-medium">{t.medidas.tipos[m.tipo_prenda] ?? m.tipo_prenda}</div>
          <div className="text-xs text-gray-500">
            {formatDate(m.tomada_en, locale)}
            {m.tomada_por_nombre && ` · ${t.medidas.tomadaPor}: ${m.tomada_por_nombre}`}
          </div>
        </div>
        {withDelete && (
          <button type="button" onClick={() => remove(m)} className="p-2 -m-2 text-gray-500 hover:text-red-400" aria-label={t.common.delete}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
        {Object.entries(m.medidas).map(([key, value]) => (
          <div key={key} className="min-w-0">
            <dt className="text-xs text-gray-400 truncate">{label(key)}</dt>
            <dd className="text-white tabular-nums">{String(value)}</dd>
          </div>
        ))}
      </dl>
      {m.observaciones && <p className="text-sm text-gray-300 mt-3 whitespace-pre-line">{m.observaciones}</p>}
    </div>
  )

  return (
    <Card
      title={<span className="flex items-center gap-2"><Ruler size={18} className="text-[#C9A84C]" />{t.clientes.sections.medidas}</span>}
      actions={
        <button type="button" className={btnSecondary} onClick={() => setAdding(true)}>
          <Plus size={16} />
          {t.medidas.add}
        </button>
      }
    >
      {medidas.length === 0 ? (
        <p className="text-sm text-gray-400">{t.medidas.empty}</p>
      ) : (
        <div className="space-y-3">
          <div className="text-xs text-gray-400 uppercase tracking-wider">{t.medidas.latest}</div>
          {latest.map((m) => renderRow(m, false))}
          <button
            type="button"
            className="text-sm text-[#C9A84C] hover:text-[#D4B76A] py-2"
            aria-expanded={showHistory}
            onClick={() => setShowHistory((v) => !v)}
          >
            {t.medidas.history} ({medidas.length})
          </button>
          {showHistory && <div className="space-y-3">{medidas.map((m) => renderRow(m, true))}</div>}
        </div>
      )}

      {adding && (
        <MedidasForm
          clienteId={clienteId}
          onClose={() => setAdding(false)}
          onSaved={() => { setAdding(false); onChange() }}
          label={label}
        />
      )}
    </Card>
  )
}

function MedidasForm({ clienteId, onClose, onSaved, label }: {
  clienteId: number
  onClose: () => void
  onSaved: () => void
  label: (key: string) => string
}) {
  const { t } = useAdminI18n()
  const [tipo, setTipo] = useState<TipoPrendaMedidas>('chaqueta')
  const [values, setValues] = useState<Record<string, string>>({})
  const [extras, setExtras] = useState<{ name: string; value: string }[]>([])
  const [observaciones, setObservaciones] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const medidas: Record<string, string> = {}
    for (const key of CAMPOS_MEDIDAS[tipo]) if (values[key]?.trim()) medidas[key] = values[key].trim()
    for (const x of extras) if (x.name.trim() && x.value.trim()) medidas[x.name.trim()] = x.value.trim()
    if (Object.keys(medidas).length === 0) {
      setError(t.medidas.required)
      return
    }
    setSaving(true)
    setError('')
    try {
      await api(`/api/admin/clientes/${clienteId}/medidas`, {
        method: 'POST',
        body: { tipo_prenda: tipo, medidas, observaciones, tomada_en: fecha },
      })
      onSaved()
    } catch {
      setError(t.gestionCommon.error)
      setSaving(false)
    }
  }

  return (
    <Modal title={t.medidas.add} onClose={onClose} closeLabel={t.common.close}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label={t.medidas.prenda}>
            <select className={inputClass} value={tipo} onChange={(e) => setTipo(e.target.value as TipoPrendaMedidas)}>
              {TIPOS_PRENDA_MEDIDAS.map((tp) => (
                <option key={tp} value={tp}>{t.medidas.tipos[tp]}</option>
              ))}
            </select>
          </Field>
          <Field label={t.medidas.fecha}>
            <input className={inputClass} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </Field>
        </div>

        <p className="text-xs text-gray-500">{t.medidas.unidad}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CAMPOS_MEDIDAS[tipo].map((key) => (
            <Field key={key} label={label(key)}>
              <input
                className={`${inputClass} tabular-nums`}
                inputMode="decimal"
                value={values[key] ?? ''}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              />
            </Field>
          ))}
        </div>

        {extras.map((x, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <Field label={t.medidas.otraNombre}>
              <input className={inputClass} value={x.name} onChange={(e) => setExtras(extras.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))} />
            </Field>
            <Field label={t.medidas.otraValor}>
              <input className={inputClass} inputMode="decimal" value={x.value} onChange={(e) => setExtras(extras.map((y, j) => (j === i ? { ...y, value: e.target.value } : y)))} />
            </Field>
          </div>
        ))}
        <button type="button" className="text-sm text-[#C9A84C] hover:text-[#D4B76A]" onClick={() => setExtras([...extras, { name: '', value: '' }])}>
          + {t.medidas.otra}
        </button>

        <Field label={t.medidas.observaciones}>
          <textarea className={inputClass} rows={3} placeholder={t.medidas.observacionesHint} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
        </Field>

        <ErrorText>{error}</ErrorText>
        <div className="flex gap-2 pt-2">
          <button type="submit" className={btnPrimary} disabled={saving}>{saving ? t.common.saving : t.common.save}</button>
          <button type="button" className={btnSecondary} onClick={onClose}>{t.common.cancel}</button>
        </div>
      </form>
    </Modal>
  )
}
