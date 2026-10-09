'use client'

import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, Card, ErrorText, PageHeader, api, btnPrimary, btnSecondary, inputClass, useApi } from '../../_components/ui'
import SettingsTabs from '../SettingsTabs'

interface Item {
  id: number
  nombre: string
  activo: boolean
}

export default function ListasPage() {
  const { t } = useAdminI18n()
  return (
    <div>
      <PageHeader title={t.sidebar.settings} />
      <SettingsTabs />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ListaCard lista="sastres" title={t.listas.sastres} help={t.listas.sastresHelp} />
        <ListaCard lista="ubicaciones" title={t.listas.ubicaciones} help={t.listas.ubicacionesHelp} />
      </div>
    </div>
  )
}

function ListaCard({ lista, title, help }: { lista: 'sastres' | 'ubicaciones'; title: string; help: string }) {
  const { t } = useAdminI18n()
  const { data, reload } = useApi<{ items: Item[] }>(`/api/admin/listas/${lista}`)
  const [nuevo, setNuevo] = useState('')
  const [error, setError] = useState('')

  async function run(fn: () => Promise<unknown>) {
    setError('')
    try {
      await fn()
      reload()
    } catch (err) {
      setError((err as Error).message === 'duplicate' ? t.listas.duplicado : t.gestionCommon.error)
    }
  }

  return (
    <Card title={title}>
      <p className="text-sm text-gray-400 mb-4">{help}</p>
      <form
        className="flex gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!nuevo.trim()) return
          run(async () => {
            await api(`/api/admin/listas/${lista}`, { method: 'POST', body: { nombre: nuevo } })
            setNuevo('')
          })
        }}
      >
        <input className={inputClass} value={nuevo} onChange={(e) => setNuevo(e.target.value)} placeholder={t.listas.nuevo} aria-label={t.listas.nuevo} />
        <button type="submit" className={btnPrimary}><Plus size={16} />{t.listas.add}</button>
      </form>
      <ErrorText>{error}</ErrorText>
      <ul className="divide-y divide-[#1E3A5F]">
        {data?.items.map((item) => (
          <Fila key={`${item.id}-${item.nombre}`} item={item} onSave={(body) => run(() => api(`/api/admin/listas/${lista}/${item.id}`, { method: 'PATCH', body }))} />
        ))}
      </ul>
    </Card>
  )
}

function Fila({ item, onSave }: { item: Item; onSave: (body: Record<string, unknown>) => void }) {
  const { t } = useAdminI18n()
  const [nombre, setNombre] = useState(item.nombre)
  return (
    <li className={`py-2.5 flex items-center gap-2 ${item.activo ? '' : 'opacity-60'}`}>
      <input className={`${inputClass} flex-1`} value={nombre} onChange={(e) => setNombre(e.target.value)} aria-label={t.listas.nombre} />
      {nombre.trim() && nombre !== item.nombre && (
        <button type="button" className={btnSecondary} onClick={() => onSave({ nombre })} aria-label={t.common.save}><Check size={16} /></button>
      )}
      {!item.activo && <Badge>{t.usuarios.inactive}</Badge>}
      <button type="button" className={btnSecondary} onClick={() => onSave({ activo: !item.activo })}>
        {item.activo ? t.usuarios.deactivate : t.usuarios.activate}
      </button>
    </li>
  )
}
