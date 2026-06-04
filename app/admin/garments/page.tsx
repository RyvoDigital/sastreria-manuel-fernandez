'use client'

import { useEffect, useState } from 'react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Box, Plus, Pencil, Trash2, Save, X, Eye, EyeOff } from 'lucide-react'

interface Garment {
  id: number
  name: string
  slug: string
  thumbnail_url: string
  description: string
  is_active: boolean
  sort_order: number
}

export default function GarmentsAdminPage() {
  const { t } = useAdminI18n()
  const [garments, setGarments] = useState<Garment[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Garment | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    thumbnail_url: '',
    description: '',
    is_active: true,
    sort_order: 0,
  })

  async function fetchGarments() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/garments')
      const data = await res.json()
      setGarments(data.garments || [])
    } catch (err) {
      console.error('Failed to load garments', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGarments()
  }, [])

  function resetForm() {
    setForm({
      name: '',
      slug: '',
      thumbnail_url: '',
      description: '',
      is_active: true,
      sort_order: 0,
    })
    setEditing(null)
    setCreating(false)
  }

  function startEdit(g: Garment) {
    setForm({
      name: g.name,
      slug: g.slug,
      thumbnail_url: g.thumbnail_url,
      description: g.description || '',
      is_active: g.is_active,
      sort_order: g.sort_order,
    })
    setEditing(g)
    setCreating(false)
  }

  async function handleSave() {
    if (!form.name || !form.slug || !form.thumbnail_url) return

    const url = editing ? '/api/admin/garments' : '/api/admin/garments'
    const method = editing ? 'PUT' : 'POST'
    const body = editing
      ? { id: editing.id, ...form }
      : { ...form }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        resetForm()
        await fetchGarments()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to save')
      }
    } catch (err) {
      console.error('Save garment error', err)
      alert('Failed to save garment')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this garment?')) return
    try {
      const res = await fetch(`/api/admin/garments?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchGarments()
      } else {
        alert('Failed to delete')
      }
    } catch (err) {
      console.error('Delete garment error', err)
      alert('Failed to delete garment')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Box className="text-[#C9A84C]" size={24} />
          <h1 className="text-2xl font-serif text-white">3D Garments</h1>
        </div>
        <button
          onClick={() => { resetForm(); setCreating(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#0A1628] rounded-lg text-sm font-medium hover:bg-[#D4B76A] transition-colors"
        >
          <Plus size={16} />
          Add Garment
        </button>
      </div>

      {(creating || editing) && (
        <div className="bg-[#0D1D30] border border-[#1E3A5F] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-medium text-white mb-4">
            {editing ? 'Edit Garment' : 'New Garment'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                placeholder="e.g. Classic Bespoke Suit"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                placeholder="e.g. classic-bespoke-suit"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Thumbnail URL</label>
              <input
                type="text"
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                rows={3}
                placeholder="Short description..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 accent-[#C9A84C]"
                id="is_active"
              />
              <label htmlFor="is_active" className="text-sm text-gray-300">Active</label>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#0A1628] rounded-lg text-sm font-medium hover:bg-[#D4B76A] transition-colors"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-gray-300 rounded-lg text-sm hover:bg-[#2a4a73] transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm">Loading…</div>
      ) : garments.length === 0 ? (
        <div className="text-gray-400 text-sm">No garments found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {garments.map((g) => (
            <div key={g.id} className="bg-[#0D1D30] border border-[#1E3A5F] rounded-xl overflow-hidden">
              <div className="aspect-[4/3] bg-[#0A1628]">
                <img
                  src={g.thumbnail_url}
                  alt={g.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-white font-medium text-sm">{g.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">/{g.slug}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {g.is_active ? (
                      <Eye size={14} className="text-emerald-400" />
                    ) : (
                      <EyeOff size={14} className="text-gray-500" />
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{g.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => startEdit(g)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#1E3A5F] text-gray-300 rounded-lg text-xs hover:bg-[#2a4a73] transition-colors"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(g.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-900/20 text-red-300 rounded-lg text-xs hover:bg-red-900/40 transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
