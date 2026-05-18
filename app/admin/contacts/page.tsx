'use client'

import { useEffect, useState } from 'react'
import { Mail, Eye } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

interface Contact {
  id: number
  name: string
  email: string
  type: string
  message: string
  locale: string
  read: boolean
  created_at: string
}

export default function ContactsPage() {
  const { t } = useAdminI18n()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    setLoading(true)
    const res = await fetch('/api/admin/contacts')
    const data = await res.json()
    setContacts(data.contacts || [])
    setLoading(false)
  }

  async function markAsRead(id: number) {
    await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchContacts()
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">{t.sidebar.contacts}</h1>

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : contacts.length === 0 ? (
        <div className="text-gray-400">{t.common.noData}</div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div
              key={c.id}
              className={`bg-[#0A1628] border rounded-xl p-6 ${
                c.read ? 'border-[#1E3A5F]/50' : 'border-[#C9A84C]/30'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${c.read ? 'bg-gray-800' : 'bg-[#C9A84C]/10'}`}>
                    <Mail size={18} className={c.read ? 'text-gray-400' : 'text-[#C9A84C]'} />
                  </div>
                  <div>
                    <div className="text-white font-medium">{c.name}</div>
                    <div className="text-gray-400 text-sm">{c.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{c.type}</span>
                  <span className="text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</span>
                  {!c.read && (
                    <button
                      onClick={() => markAsRead(c.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A5F]/50 text-gray-300 rounded-lg text-xs hover:bg-[#1E3A5F]"
                    >
                      <Eye size={14} />
                      {t.common.markRead}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{c.message}</p>
              <div className="mt-3 text-xs text-gray-500">{t.common.language}: {c.locale.toUpperCase()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
