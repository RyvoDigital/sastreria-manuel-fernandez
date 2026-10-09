'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, UserPlus, UserX, X } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { ErrorText, Field, api, btnPrimary, btnSecondary, inputClass } from '../_components/ui'

export interface ClienteOption {
  id: number
  nombre: string
  apellidos: string | null
  email: string | null
  telefono: string | null
}

export const nombreCliente = (c: Pick<ClienteOption, 'nombre' | 'apellidos'>) => [c.nombre, c.apellidos].filter(Boolean).join(' ')

// Pick an existing client, create one on the spot, or leave the sale without a client
export default function ClientePicker({ value, onChange }: { value: ClienteOption | null; onChange: (c: ClienteOption | null) => void }) {
  const { t } = useAdminI18n()
  const v = t.ventas
  const [q, setQ] = useState('')
  const [results, setResults] = useState<ClienteOption[]>([])
  const [creating, setCreating] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!q.trim()) return
    let current = true
    const timer = setTimeout(() => {
      api<{ clientes: ClienteOption[] }>(`/api/admin/clientes?${new URLSearchParams({ q: q.trim() })}`).then((d) => current && setResults(d.clientes.slice(0, 8)))
    }, 200)
    return () => {
      current = false
      clearTimeout(timer)
    }
  }, [q])

  if (value) {
    return (
      <div className="flex items-center justify-between gap-3 bg-[#1E3A5F]/20 rounded-lg px-4 py-3">
        <div className="min-w-0">
          <div className="text-white font-medium truncate">{nombreCliente(value)}</div>
          <div className="text-xs text-gray-400 truncate">{[value.telefono, value.email].filter(Boolean).join(' · ')}</div>
        </div>
        <button type="button" onClick={() => onChange(null)} className="p-2 -mr-2 text-gray-400 hover:text-white" aria-label={v.quitarCliente}>
          <X size={18} />
        </button>
      </div>
    )
  }

  if (creating) return <NuevoCliente onCancel={() => setCreating(false)} onCreated={(c) => { setCreating(false); onChange(c) }} />

  return (
    <div ref={boxRef} className="space-y-2">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        <input
          type="search"
          className={`${inputClass} pl-12`}
          placeholder={v.buscarCliente}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={v.buscarCliente}
        />
        {q.trim() && results.length > 0 && (
          <ul role="listbox" className="absolute z-30 mt-1 w-full bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg shadow-2xl max-h-72 overflow-y-auto">
            {results.map((c) => (
              <li
                key={c.id}
                role="option"
                aria-selected={false}
                onPointerDown={(e) => { e.preventDefault(); onChange(c); setQ('') }}
                className="px-4 py-2.5 cursor-pointer hover:bg-[#1E3A5F]/60"
              >
                <div className="text-sm text-white">{nombreCliente(c)}</div>
                <div className="text-xs text-gray-500">{[c.telefono, c.email].filter(Boolean).join(' · ')}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button type="button" className={btnSecondary} onClick={() => setCreating(true)}>
          <UserPlus size={16} />
          {t.clientes.new}
        </button>
        <span className="inline-flex items-center gap-1.5 text-gray-500">
          <UserX size={14} />
          {v.sinCliente}
        </span>
      </div>
    </div>
  )
}

function NuevoCliente({ onCancel, onCreated }: { onCancel: () => void; onCreated: (c: ClienteOption) => void }) {
  const { t } = useAdminI18n()
  const [form, setForm] = useState({ nombre: '', apellidos: '', telefono: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })

  // Not a <form>: this sits inside the sale form, and nested forms aren't allowed
  async function create() {
    if (!form.nombre.trim()) {
      setError(t.clientes.nameRequired)
      return
    }
    setSaving(true)
    setError('')
    try {
      const { cliente } = await api<{ cliente: ClienteOption }>('/api/admin/clientes', { method: 'POST', body: form })
      onCreated(cliente)
    } catch (err) {
      const code = (err as Error).message
      setError(code === 'duplicate' ? t.clientes.duplicateEmail : code === 'invalid email' ? t.clientes.invalidEmail : t.gestionCommon.error)
      setSaving(false)
    }
  }

  return (
    <div className="bg-[#1E3A5F]/15 rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.clientes.fields.nombre}><input className={inputClass} value={form.nombre} onChange={set('nombre')} autoFocus /></Field>
        <Field label={t.clientes.fields.apellidos}><input className={inputClass} value={form.apellidos} onChange={set('apellidos')} /></Field>
        <Field label={t.clientes.fields.telefono}><input className={inputClass} type="tel" value={form.telefono} onChange={set('telefono')} /></Field>
        <Field label={t.clientes.fields.email}><input className={inputClass} type="email" value={form.email} onChange={set('email')} /></Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <div className="flex gap-2">
        <button type="button" className={btnPrimary} onClick={create} disabled={saving}>{saving ? t.gestionCommon.creating : t.gestionCommon.create}</button>
        <button type="button" className={btnSecondary} onClick={onCancel}>{t.common.cancel}</button>
      </div>
    </div>
  )
}
