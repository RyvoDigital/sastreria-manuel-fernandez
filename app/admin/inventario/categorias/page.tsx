'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Plus } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, Card, ErrorText, Field, Modal, PageHeader, api, btnPrimary, btnSecondary, inputClass, useApi } from '../../_components/ui'
import InventarioTabs from '../InventarioTabs'
import { UNIDADES, IVA_TIPOS } from '../ProductoForm'
import { errorMessage, type Categoria } from '../shared'

export default function CategoriasPage() {
  const { t } = useAdminI18n()
  const c = t.inventario.categorias
  const { data, loading, reload } = useApi<{ categorias: Categoria[] }>('/api/admin/inventario/categorias')
  const [editing, setEditing] = useState<Categoria | 'new' | null>(null)

  return (
    <div>
      <PageHeader
        title={t.inventario.title}
        actions={
          <button type="button" className={btnPrimary} onClick={() => setEditing('new')}>
            <Plus size={16} />
            {c.new}
          </button>
        }
      />
      <InventarioTabs />
      <p className="text-sm text-gray-400 mb-6 max-w-2xl">{c.help}</p>

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {(['terminado', 'material'] as const).map((tipo) => (
            <Card key={tipo} title={t.inventario.tipos[tipo]}>
              <ul className="divide-y divide-[#1E3A5F] -my-3">
                {data?.categorias.filter((cat) => cat.tipo === tipo).map((cat) => (
                  <li key={cat.id} className={`py-3 flex items-center gap-3 ${cat.activo ? '' : 'opacity-50'}`}>
                    <div className="min-w-0 flex-1">
                      <Link href={`/admin/inventario?categoria=${cat.id}`} className="text-white hover:text-[#C9A84C]">{cat.nombre}</Link>
                      <div className="text-xs text-gray-500">
                        {t.inventario.unidadesLargas[cat.unidad_defecto as keyof typeof t.inventario.unidadesLargas] ?? cat.unidad_defecto}
                        {' · '}{t.inventario.fields.iva} {Number(cat.iva_defecto)}
                        {' · '}{cat.productos} {c.productos}
                      </div>
                      {cat.subtipos?.length > 0 && <div className="text-xs text-gray-400 mt-0.5">{c.subtipos}: {cat.subtipos.join(', ')}</div>}
                    </div>
                    {!cat.activo && <Badge>{c.inactive}</Badge>}
                    <button type="button" className={btnSecondary} onClick={() => setEditing(cat)} aria-label={t.common.edit}>
                      <Pencil size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <CategoriaModal
          categoria={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); reload() }}
        />
      )}
    </div>
  )
}

function CategoriaModal({ categoria, onClose, onSaved }: { categoria: Categoria | null; onClose: () => void; onSaved: () => void }) {
  const { t } = useAdminI18n()
  const c = t.inventario.categorias
  const [form, setForm] = useState({
    nombre: categoria?.nombre ?? '',
    tipo: categoria?.tipo ?? 'terminado',
    unidad_defecto: categoria?.unidad_defecto ?? 'ud',
    iva_defecto: categoria ? String(Number(categoria.iva_defecto)) : '21',
    orden: String(categoria?.orden ?? 100),
    activo: categoria?.activo ?? true,
    subtipos: (categoria?.subtipos ?? []).join(', '),
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (categoria) await api(`/api/admin/inventario/categorias/${categoria.id}`, { method: 'PATCH', body: form })
      else await api('/api/admin/inventario/categorias', { method: 'POST', body: form })
      onSaved()
    } catch (err) {
      setError(errorMessage(t, err))
      setSaving(false)
    }
  }

  return (
    <Modal title={categoria ? categoria.nombre : c.new} onClose={onClose} closeLabel={t.common.close}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={c.nombre}>
          <input className={inputClass} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        </Field>
        <Field label={c.tipo}>
          <select className={inputClass} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as Categoria['tipo'] })}>
            <option value="terminado">{t.inventario.tipos.terminado}</option>
            <option value="material">{t.inventario.tipos.material}</option>
          </select>
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label={c.unidad}>
            <select className={inputClass} value={form.unidad_defecto} onChange={(e) => setForm({ ...form, unidad_defecto: e.target.value })}>
              {UNIDADES.map((u) => <option key={u} value={u}>{t.inventario.unidadesLargas[u]}</option>)}
            </select>
          </Field>
          <Field label={c.iva}>
            <select className={inputClass} value={form.iva_defecto} onChange={(e) => setForm({ ...form, iva_defecto: e.target.value })}>
              {IVA_TIPOS.map((v) => <option key={v} value={v}>{v} %</option>)}
            </select>
          </Field>
          <Field label={c.orden}>
            <input className={inputClass} inputMode="numeric" value={form.orden} onChange={(e) => setForm({ ...form, orden: e.target.value })} />
          </Field>
        </div>
        <Field label={c.subtipos}>
          <input className={inputClass} value={form.subtipos} onChange={(e) => setForm({ ...form, subtipos: e.target.value })} placeholder={c.subtiposEjemplo} />
        </Field>
        <p className="text-xs text-gray-500 -mt-2">{c.subtiposHint}</p>
        {categoria && (
          <label className="flex items-center gap-3 text-sm text-gray-300 min-h-11">
            <input type="checkbox" className="w-5 h-5 accent-[#C9A84C]" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
            {t.usuarios.active}
          </label>
        )}
        <ErrorText>{error}</ErrorText>
        <div className="flex gap-2 pt-2">
          <button type="submit" className={btnPrimary} disabled={saving}>{saving ? t.common.saving : t.common.save}</button>
          <button type="button" className={btnSecondary} onClick={onClose}>{t.common.cancel}</button>
        </div>
      </form>
    </Modal>
  )
}
