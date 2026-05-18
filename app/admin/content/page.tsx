'use client'

import { useEffect, useState } from 'react'
import { FileText, Save } from 'lucide-react'

interface ContentItem {
  id: string
  value: string
  updated_at: string
}

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  async function fetchContent() {
    setLoading(true)
    const res = await fetch('/api/admin/content')
    const data = await res.json()
    setContent(data.content || [])
    setLoading(false)
  }

  async function updateValue(id: string, value: string) {
    setSaving(id)
    await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, value }),
    })
    setSaving(null)
    fetchContent()
  }

  const contentLabels: Record<string, string> = {
    'hero.title': 'Homepage Hero Title',
    'hero.subtitle': 'Homepage Hero Subtitle',
    'videocall.price': 'Videocall Price (EUR)',
    'configurator.price': 'Configurator Price (EUR)',
    'courses.price': 'Course Price (EUR)',
    'contact.phone': 'Contact Phone Number',
    'contact.address': 'Business Address',
    'business.hours': 'Business Hours',
  }

  // Ensure default content items exist
  const defaultIds = Object.keys(contentLabels)
  const existingIds = content.map((c) => c.id)
  const missingIds = defaultIds.filter((id) => !existingIds.includes(id))

  const displayContent = [
    ...content,
    ...missingIds.map((id) => ({ id, value: '', updated_at: '' })),
  ]

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">Content Control</h1>
      <p className="text-gray-400 text-sm mb-6">Edit site copy and business details without touching code.</p>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-6">
          {displayContent.map((item) => (
            <div key={item.id} className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText size={18} className="text-[#C9A84C]" />
                <div>
                  <div className="text-white font-medium">{contentLabels[item.id] || item.id}</div>
                  <div className="text-xs text-gray-500 font-mono">{item.id}</div>
                </div>
              </div>
              <EditableField
                initialValue={item.value}
                onSave={(value) => updateValue(item.id, value)}
                saving={saving === item.id}
              />
              {item.updated_at && (
                <div className="text-xs text-gray-500 mt-2">
                  Last updated: {new Date(item.updated_at).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EditableField({
  initialValue,
  onSave,
  saving,
}: {
  initialValue: string
  onSave: (value: string) => void
  saving: boolean
}) {
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  function handleSave() {
    onSave(value)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className="px-4 py-3 bg-[#1E3A5F]/20 rounded-lg text-white cursor-pointer hover:bg-[#1E3A5F]/30 min-h-[44px] flex items-center"
      >
        {value || <span className="text-gray-500 italic">Click to edit...</span>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C9A84C]"
        autoFocus
        onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#C9A84C] text-[#0A1628] rounded-lg text-sm font-medium hover:bg-[#D4B76A] disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => { setValue(initialValue); setIsEditing(false) }}
          className="px-4 py-2 bg-[#1E3A5F]/50 text-gray-300 rounded-lg text-sm hover:bg-[#1E3A5F]"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
