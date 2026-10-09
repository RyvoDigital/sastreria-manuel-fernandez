'use client'

import { useState } from 'react'
import { Plus, Ruler, Trash2 } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Card, ErrorText, api, btnSecondary } from '../../_components/ui'
import { FichaMedidasView, MedidasFormModal, MedidasVersionLabel, type MedidasRow } from '../../_components/MedidasFicha'

export type { MedidasRow }

// Measurements are versioned: each "Nueva toma" is a new row, and encargos keep the version they were made from
export default function MedidasSection({ clienteId, medidas, onChange }: {
  clienteId: number
  medidas: MedidasRow[]
  onChange: () => void
}) {
  const { t } = useAdminI18n()
  const [adding, setAdding] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState('')

  // Newest first; the latest ficha is the base for the next version
  const actual = medidas[0] ?? null
  const ultimaFicha = medidas.find((m) => m.tipo_prenda === 'ficha') ?? null

  async function remove(row: MedidasRow) {
    if (!window.confirm(t.medidas.deleteConfirm)) return
    setError('')
    try {
      await api(`/api/admin/clientes/${clienteId}/medidas?medidasId=${row.id}`, { method: 'DELETE' })
      onChange()
    } catch (err) {
      setError((err as Error).message === 'in use' ? t.medidas.enUso : t.gestionCommon.error)
    }
  }

  return (
    <Card
      title={<span className="flex items-center gap-2"><Ruler size={18} className="text-[#C9A84C]" />{t.clientes.sections.medidas}</span>}
      actions={
        <button type="button" className={btnSecondary} onClick={() => setAdding(true)}>
          <Plus size={16} />
          {ultimaFicha ? t.medidas.nuevaVersion : t.medidas.add}
        </button>
      }
    >
      {!actual ? (
        <p className="text-sm text-gray-400">{t.medidas.empty}</p>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-gray-400">
            {t.medidas.latest}: <MedidasVersionLabel row={actual} />
          </div>
          <FichaMedidasView row={actual} />
          {medidas.length > 1 && (
            <button
              type="button"
              className="text-sm text-[#C9A84C] hover:text-[#D4B76A] py-2"
              aria-expanded={showHistory}
              onClick={() => setShowHistory((v) => !v)}
            >
              {t.medidas.history} ({medidas.length})
            </button>
          )}
          <ErrorText>{error}</ErrorText>
          {showHistory && (
            <ul className="space-y-3">
              {medidas.map((m) => (
                <li key={m.id} className="bg-[#1E3A5F]/15 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 mb-3 text-xs text-gray-400">
                    <MedidasVersionLabel row={m} />
                    <button type="button" onClick={() => remove(m)} className="p-2 -m-2 text-gray-500 hover:text-red-400" aria-label={t.common.delete}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <FichaMedidasView row={m} compact />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {adding && (
        <MedidasFormModal
          clienteId={clienteId}
          base={ultimaFicha}
          onClose={() => setAdding(false)}
          onSaved={() => { setAdding(false); onChange() }}
        />
      )}
    </Card>
  )
}
