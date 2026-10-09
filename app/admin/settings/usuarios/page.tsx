'use client'

import { useCallback, useState } from 'react'
import { Plus, UserCog } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import SettingsTabs from '../SettingsTabs'
import { Badge, ErrorText, Field, Modal, api, useApi, btnPrimary, btnSecondary, cardClass, formatDate, inputClass } from '../../_components/ui'

interface Usuario {
  id: number
  name: string
  email: string
  role: string
  activo: boolean
  created_at: string
}

export default function UsuariosPage() {
  const { t, locale } = useAdminI18n()
  const { data, loading, reload } = useApi<{ usuarios: Usuario[]; me: { id: number; role: string } }>('/api/admin/usuarios')
  const usuarios = data?.usuarios ?? []
  const me = data?.me ?? null
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Usuario | null>(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const errorText = useCallback(
    (e: unknown) => t.usuarios.errors[(e as Error).message] ?? t.gestionCommon.error,
    [t]
  )

  const isOwner = me?.role === 'owner'

  async function toggleActivo(u: Usuario) {
    setError('')
    try {
      await api(`/api/admin/usuarios/${u.id}`, { method: 'PATCH', body: { activo: !u.activo } })
      setNotice(t.usuarios.updated)
      reload()
    } catch (e) {
      setError(errorText(e))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-6">{t.settings.title}</h1>
      <SettingsTabs />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <p className="text-sm text-gray-400 max-w-2xl">{t.usuarios.intro}</p>
        {isOwner && (
          <button type="button" className={btnPrimary} onClick={() => { setCreating(true); setNotice(''); setError('') }}>
            <Plus size={16} />
            {t.usuarios.new}
          </button>
        )}
      </div>

      {!loading && !isOwner && <p className="text-sm text-amber-400 mb-4">{t.usuarios.onlyOwners}</p>}
      {notice && <p className="text-sm text-emerald-400 mb-4">{notice}</p>}
      <div className="mb-4"><ErrorText>{error}</ErrorText></div>

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : (
        <div className="space-y-3">
          {usuarios.map((u) => (
            <div key={u.id} className={`${cardClass} flex flex-col sm:flex-row sm:items-center gap-4 ${u.activo ? '' : 'opacity-60'}`}>
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 bg-[#1E3A5F]/30 rounded-lg shrink-0">
                  <UserCog size={18} className="text-[#C9A84C]" />
                </div>
                <div className="min-w-0">
                  <div className="text-white font-medium truncate">
                    {u.name}
                    {u.id === me?.id && <span className="text-gray-500 font-normal"> ({t.usuarios.you})</span>}
                  </div>
                  <div className="text-sm text-gray-400 truncate">{u.email}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={u.role === 'owner' ? 'gold' : 'neutral'}>{t.usuarios.roles[u.role] ?? u.role}</Badge>
                <Badge tone={u.activo ? 'green' : 'red'}>{u.activo ? t.usuarios.active : t.usuarios.inactive}</Badge>
                <span className="text-xs text-gray-500">{formatDate(u.created_at, locale)}</span>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <button type="button" className={btnSecondary} onClick={() => { setEditing(u); setNotice(''); setError('') }}>
                    {t.common.edit}
                  </button>
                  {u.id !== me?.id && (
                    <button type="button" className={btnSecondary} onClick={() => toggleActivo(u)}>
                      {u.activo ? t.usuarios.deactivate : t.usuarios.activate}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {creating && (
        <UsuarioForm
          onClose={() => setCreating(false)}
          onSaved={() => { setCreating(false); setNotice(t.usuarios.created); reload() }}
          errorText={errorText}
        />
      )}
      {editing && (
        <UsuarioForm
          usuario={editing}
          isSelf={editing.id === me?.id}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); setNotice(t.usuarios.updated); reload() }}
          errorText={errorText}
        />
      )}
    </div>
  )
}

function UsuarioForm({ usuario, isSelf, onClose, onSaved, errorText }: {
  usuario?: Usuario
  isSelf?: boolean
  onClose: () => void
  onSaved: () => void
  errorText: (e: unknown) => string
}) {
  const { t } = useAdminI18n()
  const [name, setName] = useState(usuario?.name ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [role, setRole] = useState(usuario?.role ?? 'manager')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (usuario) {
        const body: Record<string, unknown> = { name }
        if (!isSelf) body.role = role
        if (password) body.password = password
        await api(`/api/admin/usuarios/${usuario.id}`, { method: 'PATCH', body })
      } else {
        await api('/api/admin/usuarios', { method: 'POST', body: { name, email, role, password } })
      }
      onSaved()
    } catch (err) {
      setError(errorText(err))
      setSaving(false)
    }
  }

  return (
    <Modal title={usuario ? usuario.name : t.usuarios.new} onClose={onClose} closeLabel={t.common.close}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={t.usuarios.name}>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="off" />
        </Field>
        <Field label={t.usuarios.email}>
          <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!!usuario} autoComplete="off" />
        </Field>
        <Field label={t.usuarios.role}>
          <select className={inputClass} value={role} onChange={(e) => setRole(e.target.value)} disabled={isSelf}>
            <option value="owner">{t.usuarios.roles.owner}</option>
            <option value="manager">{t.usuarios.roles.manager}</option>
            <option value="taller">{t.usuarios.roles.taller}</option>
          </select>
          <span className="block text-xs text-gray-500 mt-1.5">{t.usuarios.roleHelp}</span>
        </Field>
        <Field label={usuario ? `${t.usuarios.newPassword} (${t.gestionCommon.optional})` : t.usuarios.password}>
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!usuario}
            minLength={8}
            autoComplete="new-password"
          />
          <span className="block text-xs text-gray-500 mt-1.5">{t.usuarios.passwordHelp}</span>
        </Field>
        <ErrorText>{error}</ErrorText>
        <div className="flex gap-2 pt-2">
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? t.common.saving : usuario ? t.common.save : t.gestionCommon.create}
          </button>
          <button type="button" className={btnSecondary} onClick={onClose}>{t.common.cancel}</button>
        </div>
      </form>
    </Modal>
  )
}
