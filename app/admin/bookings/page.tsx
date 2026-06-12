'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Bell } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

interface Booking {
  id: number
  date: string
  time: string
  type: string
  name: string
  email: string
  status: string
  notes: string | null
  created_at: string
  reminder_sent_at: string | null
}

function formatAdminDate(dateStr: string, locale: string): string {
  if (!dateStr) return '—'
  const dateOnly = dateStr.split('T')[0]
  const [year, month, day] = dateOnly.split('-').map(Number)
  if (!year || !month || !day || Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return dateOnly || '—'
  }
  const date = new Date(year, month - 1, day, 12, 0, 0)
  if (Number.isNaN(date.getTime())) {
    return dateOnly
  }
  return new Intl.DateTimeFormat(
    locale === 'en' ? 'en-GB' : locale === 'it' ? 'it-IT' : locale === 'fr' ? 'fr-FR' : 'es-ES',
    { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Madrid' }
  ).format(date)
}

function formatAdminTime(timeStr: string): string {
  return timeStr
}

export default function BookingsPage() {
  const { t, locale } = useAdminI18n()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [filter])

  async function fetchBookings() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter !== 'all') params.set('type', filter)
    const res = await fetch(`/api/admin/bookings?${params}`)
    const data = await res.json()
    setBookings(data.bookings || [])
    setLoading(false)
  }

  async function updateStatus(id: number, status: string) {
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchBookings()
  }

  async function sendReminder(id: number) {
    const res = await fetch('/api/admin/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: id }),
    })
    if (res.ok) {
      fetchBookings()
    } else {
      alert('Failed to send reminder')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-white">{t.sidebar.bookings}</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
        >
          <option value="all">{t.common.allTypes}</option>
          <option value="inperson">{t.common.inPerson}</option>
          <option value="videocall">{t.common.videocall}</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : bookings.length === 0 ? (
        <div className="text-gray-400">{t.common.noData}</div>
      ) : (
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1E3A5F]/30 text-gray-300 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">{t.common.date}</th>
                <th className="px-6 py-4">{t.common.time}</th>
                <th className="px-6 py-4">{t.common.client}</th>
                <th className="px-6 py-4">{t.common.type}</th>
                <th className="px-6 py-4">{t.common.status}</th>
                <th className="px-6 py-4">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/50">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#1E3A5F]/20">
                  <td className="px-6 py-4 text-white">{formatAdminDate(b.date, locale)}</td>
                  <td className="px-6 py-4 text-white">{formatAdminTime(b.time)}</td>
                  <td className="px-6 py-4">
                    <div className="text-white">{b.name}</div>
                    <div className="text-gray-400 text-xs">{b.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      b.type === 'videocall' ? 'bg-purple-900/30 text-purple-300' : 'bg-blue-900/30 text-blue-300'
                    }`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      b.status === 'confirmed' ? 'bg-emerald-900/30 text-emerald-300' :
                      b.status === 'cancelled' ? 'bg-red-900/30 text-red-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {b.status !== 'confirmed' && (
                        <button
                          onClick={() => updateStatus(b.id, 'confirmed')}
                          className="p-1.5 bg-emerald-900/30 text-emerald-300 rounded hover:bg-emerald-900/50"
                          title={t.common.confirm}
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(b.id, 'cancelled')}
                          className="p-1.5 bg-red-900/30 text-red-300 rounded hover:bg-red-900/50"
                          title={t.common.cancel}
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => sendReminder(b.id)}
                        className={`p-1.5 rounded ${b.reminder_sent_at ? 'bg-gray-800 text-gray-500' : 'bg-amber-900/30 text-amber-300 hover:bg-amber-900/50'}`}
                        title={b.reminder_sent_at ? 'Reminder sent' : 'Send reminder'}
                      >
                        <Bell size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
