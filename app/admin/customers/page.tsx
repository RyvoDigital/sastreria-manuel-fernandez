'use client'

import { useEffect, useState } from 'react'
import { Users, Search, Save } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

interface Customer {
  email: string
  name: string | null
  notes: string | null
  measurements: Record<string, unknown> | null
  updated_at: string | null
  booking_count: string
  last_booking: string | null
}

export default function CustomersPage() {
  const { t } = useAdminI18n()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filtered, setFiltered] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editNotes, setEditNotes] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    const term = search.toLowerCase()
    setFiltered(customers.filter((c) =>
      (c.name?.toLowerCase() || '').includes(term) ||
      c.email.toLowerCase().includes(term)
    ))
  }, [search, customers])

  async function fetchCustomers() {
    setLoading(true)
    const res = await fetch('/api/admin/customers')
    const data = await res.json()
    setCustomers(data.customers || [])
    setFiltered(data.customers || [])
    setLoading(false)
  }

  async function saveNotes(email: string) {
    await fetch('/api/admin/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, notes: editNotes }),
    })
    setEditing(null)
    fetchCustomers()
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">{t.sidebar.customers}</h1>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={t.common.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C]"
        />
      </div>

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400">{t.common.noData}</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c.email} className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1E3A5F]/30 rounded-lg">
                    <Users size={18} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{c.name || t.common.unknown}</div>
                    <div className="text-gray-400 text-sm">{c.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{c.booking_count} {t.common.bookings}</div>
                  {c.last_booking && (
                    <div className="text-xs text-gray-500">
                      {t.common.last}: {new Date(c.last_booking).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {c.measurements && Object.keys(c.measurements).length > 0 && (
                <div className="bg-[#1E3A5F]/20 rounded-lg p-4 mb-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">{t.common.measurementsOnFile}</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-white">
                    {Object.entries(c.measurements).map(([k, v]) => (
                      <div key={k}>{k}: {String(v)}</div>
                    ))}
                  </div>
                </div>
              )}

              {editing === c.email ? (
                <div className="space-y-3">
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder={t.common.notes}
                    className="w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveNotes(c.email)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#C9A84C] text-[#0A1628] rounded-lg text-sm font-medium hover:bg-[#D4B76A]"
                    >
                      <Save size={14} />
                      {t.common.saveNotes}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-4 py-2 bg-[#1E3A5F]/50 text-gray-300 rounded-lg text-sm hover:bg-[#1E3A5F]"
                    >
                      {t.common.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {c.notes ? (
                    <div className="text-sm text-gray-300 bg-[#1E3A5F]/10 p-3 rounded-lg mb-3">
                      {c.notes}
                    </div>
                  ) : null}
                  <button
                    onClick={() => { setEditing(c.email); setEditNotes(c.notes || '') }}
                    className="text-sm text-[#C9A84C] hover:text-[#D4B76A]"
                  >
                    {c.notes ? t.common.editNotes : t.common.addNotes}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
