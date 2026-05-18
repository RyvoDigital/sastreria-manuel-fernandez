'use client'

import { useEffect, useState } from 'react'
import { Shirt, CheckCircle } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

interface Configuration {
  id: number
  name: string
  email: string
  fabric: string | null
  measurements: Record<string, unknown> | null
  design_options: Record<string, unknown> | null
  status: string
  notes: string | null
  created_at: string
}

export default function ConfigurationsPage() {
  const { t } = useAdminI18n()
  const [configs, setConfigs] = useState<Configuration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConfigs()
  }, [])

  async function fetchConfigs() {
    setLoading(true)
    const res = await fetch('/api/admin/configurations')
    const data = await res.json()
    setConfigs(data.configurations || [])
    setLoading(false)
  }

  async function updateStatus(id: number, status: string) {
    await fetch('/api/admin/configurations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchConfigs()
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">{t.sidebar.configurations}</h1>

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : configs.length === 0 ? (
        <div className="text-gray-400">{t.common.noData}</div>
      ) : (
        <div className="space-y-4">
          {configs.map((c) => (
            <div key={c.id} className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#C9A84C]/10 rounded-lg">
                    <Shirt size={18} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{c.name}</div>
                    <div className="text-gray-400 text-sm">{c.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    c.status === 'new' ? 'bg-amber-900/30 text-amber-300' :
                    c.status === 'quote_sent' ? 'bg-blue-900/30 text-blue-300' :
                    c.status === 'in_production' ? 'bg-purple-900/30 text-purple-300' :
                    'bg-emerald-900/30 text-emerald-300'
                  }`}>
                    {c.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-[#1E3A5F]/20 rounded-lg p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t.common.fabric}</div>
                  <div className="text-white">{c.fabric || t.common.notSelected}</div>
                </div>
                <div className="bg-[#1E3A5F]/20 rounded-lg p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t.common.measurements}</div>
                  <div className="text-white text-sm">
                    {c.measurements ? Object.entries(c.measurements).map(([k, v]) => (
                      <div key={k}>{k}: {String(v)}</div>
                    )) : t.common.none}
                  </div>
                </div>
                <div className="bg-[#1E3A5F]/20 rounded-lg p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t.common.design}</div>
                  <div className="text-white text-sm">
                    {c.design_options ? Object.entries(c.design_options).map(([k, v]) => (
                      <div key={k}>{k}: {String(v)}</div>
                    )) : t.common.none}
                  </div>
                </div>
              </div>

              {c.notes && (
                <div className="text-sm text-gray-300 mb-4 bg-[#1E3A5F]/10 p-3 rounded-lg">
                  <span className="text-gray-400">{t.common.notes}:</span> {c.notes}
                </div>
              )}

              <div className="flex gap-2">
                {c.status !== 'quote_sent' && (
                  <button
                    onClick={() => updateStatus(c.id, 'quote_sent')}
                    className="px-3 py-1.5 bg-blue-900/30 text-blue-300 rounded-lg text-xs hover:bg-blue-900/50"
                  >
                    {t.common.markQuoteSent}
                  </button>
                )}
                {c.status !== 'in_production' && (
                  <button
                    onClick={() => updateStatus(c.id, 'in_production')}
                    className="px-3 py-1.5 bg-purple-900/30 text-purple-300 rounded-lg text-xs hover:bg-purple-900/50"
                  >
                    {t.common.markInProduction}
                  </button>
                )}
                {c.status !== 'completed' && (
                  <button
                    onClick={() => updateStatus(c.id, 'completed')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/30 text-emerald-300 rounded-lg text-xs hover:bg-emerald-900/50"
                  >
                    <CheckCircle size={14} />
                    {t.common.markCompleted}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
