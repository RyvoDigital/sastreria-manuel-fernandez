'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Plus, Save, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

interface Course {
  id: string
  title_es: string
  title_en: string
  title_it: string
  title_fr: string
  desc_es: string
  desc_en: string
  desc_it: string
  desc_fr: string
  duration: string
  lessons: number
  image: string
  price: number
  locked: boolean
  enabled: boolean
  sort_order: number
}

const emptyCourse: Omit<Course, 'sort_order'> = {
  id: '',
  title_es: '',
  title_en: '',
  title_it: '',
  title_fr: '',
  desc_es: '',
  desc_en: '',
  desc_it: '',
  desc_fr: '',
  duration: '',
  lessons: 0,
  image: '',
  price: 0,
  locked: false,
  enabled: true,
}

export default function CoursesPage() {
  const { t } = useAdminI18n()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Course | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/courses')
      .then((r) => r.json())
      .then((data) => {
        setCourses(data.courses || [])
        setLoading(false)
      })
  }, [])

  async function handleSave(course: Course) {
    setSaving(true)
    const isNew = !courses.find((c) => c.id === course.id)
    const res = await fetch('/api/admin/courses', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    })
    const data = await res.json()
    if (data.course) {
      setCourses((prev) =>
        isNew ? [...prev, data.course] : prev.map((c) => (c.id === course.id ? data.course : c))
      )
      setEditing(null)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este curso? / Delete this course?')) return
    await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' })
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  async function moveOrder(id: string, direction: 'up' | 'down') {
    const idx = courses.findIndex((c) => c.id === id)
    if (idx < 0) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= courses.length) return

    const updated = [...courses]
    const temp = updated[idx].sort_order
    updated[idx].sort_order = updated[swapIdx].sort_order
    updated[swapIdx].sort_order = temp
    updated.sort((a, b) => a.sort_order - b.sort_order)
    setCourses(updated)

    await fetch('/api/admin/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, sort_order: updated[idx].sort_order }),
    })
    await fetch('/api/admin/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: updated[swapIdx].id, sort_order: updated[swapIdx].sort_order }),
    })
  }

  if (loading) return <div className="text-gray-400">{t.common.loading}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-white">Cursos</h1>
        <button
          onClick={() => setEditing({ ...emptyCourse, sort_order: courses.length })}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#0A1628] rounded-lg hover:bg-[#D4B76A] transition-colors"
        >
          <Plus size={18} />
          Nuevo curso
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-white">
                {courses.find((c) => c.id === editing.id) ? 'Editar curso' : 'Nuevo curso'}
              </h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">ID (slug)</label>
                  <input
                    value={editing.id}
                    onChange={(e) => setEditing({ ...editing, id: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm"
                    placeholder="intro"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Precio (€)</label>
                  <input
                    type="number"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              {(['es', 'en', 'it', 'fr'] as const).map((lang) => (
                <div key={lang}>
                  <label className="block text-xs text-gray-400 mb-1">Título ({lang.toUpperCase()})</label>
                  <input
                    value={editing[`title_${lang}` as keyof Course] as string}
                    onChange={(e) => setEditing({ ...editing, [`title_${lang}`]: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm mb-2"
                  />
                  <label className="block text-xs text-gray-400 mb-1">Descripción ({lang.toUpperCase()})</label>
                  <textarea
                    value={editing[`desc_${lang}` as keyof Course] as string}
                    onChange={(e) => setEditing({ ...editing, [`desc_${lang}`]: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm"
                  />
                </div>
              ))}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Duración</label>
                  <input
                    value={editing.duration}
                    onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm"
                    placeholder="45 min"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Lecciones</label>
                  <input
                    type="number"
                    value={editing.lessons}
                    onChange={(e) => setEditing({ ...editing, lessons: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Orden</label>
                  <input
                    type="number"
                    value={editing.sort_order}
                    onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">URL de imagen</label>
                <input
                  value={editing.image}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm"
                  placeholder="https://..."
                />
                {editing.image && (
                  <img src={editing.image} alt="preview" className="mt-2 h-24 rounded-lg object-cover" />
                )}
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.enabled}
                    onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                    className="rounded border-[#1E3A5F] bg-[#0F1D2E] text-[#C9A84C]"
                  />
                  Visible
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.locked}
                    onChange={(e) => setEditing({ ...editing, locked: e.target.checked })}
                    className="rounded border-[#1E3A5F] bg-[#0F1D2E] text-[#C9A84C]"
                  />
                  Bloqueado
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSave(editing)}
                disabled={saving || !editing.id}
                className="flex items-center gap-2 px-6 py-2 bg-[#C9A84C] text-[#0A1628] font-medium rounded-lg hover:bg-[#D4B76A] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1E3A5F]/30 text-gray-300 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Duración</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E3A5F]/50">
            {courses.map((c, i) => (
              <tr key={c.id} className="hover:bg-[#1E3A5F]/20">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveOrder(c.id, 'up')} disabled={i === 0} className="text-gray-500 hover:text-white disabled:opacity-20">
                      <ChevronUp size={14} />
                    </button>
                    <button onClick={() => moveOrder(c.id, 'down')} disabled={i === courses.length - 1} className="text-gray-500 hover:text-white disabled:opacity-20">
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {c.image && (
                      <img src={c.image} alt="" className="w-10 h-10 rounded object-cover" />
                    )}
                    <div>
                      <div className="text-white font-medium">{c.title_es}</div>
                      <div className="text-gray-500 text-xs">{c.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-white">€{c.price}</td>
                <td className="px-4 py-3 text-gray-300">{c.duration}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${c.enabled ? 'bg-emerald-900/30 text-emerald-300' : 'bg-gray-800 text-gray-400'}`}>
                    {c.enabled ? 'Activo' : 'Oculto'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditing(c)}
                      className="p-2 text-gray-400 hover:text-[#C9A84C] transition-colors"
                    >
                      <BookOpen size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
