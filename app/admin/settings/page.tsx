'use client'

import { useEffect, useState } from 'react'
import { Settings, Save } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

interface ServiceSetting {
  id: string
  name: string
  enabled: boolean
  price: number | null
}

export default function SettingsPage() {
  const { t } = useAdminI18n()
  const [settings, setSettings] = useState<ServiceSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings || [])
        setLoading(false)
      })
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function updateSetting(id: string, updates: Partial<ServiceSetting>) {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">{t.settings.title}</h1>

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : (
        <div className="space-y-6">
          {settings.map((s) => (
            <div key={s.id} className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Settings size={18} className="text-[#C9A84C]" />
                  <span className="text-white font-medium">{s.name}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.enabled}
                    onChange={(e) => updateSetting(s.id, { enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]" />
                </label>
              </div>

              {s.price !== null && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">{t.settings.price}</span>
                  <input
                    type="number"
                    value={s.price}
                    onChange={(e) => updateSetting(s.id, { price: parseInt(e.target.value) || 0 })}
                    className="w-32 px-3 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0A1628] font-medium rounded-lg hover:bg-[#D4B76A] transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? t.common.saving : t.settings.save}
            </button>
            {saved && (
              <span className="text-emerald-400 text-sm">{t.settings.saved}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
