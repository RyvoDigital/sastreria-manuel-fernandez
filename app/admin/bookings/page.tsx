'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Calendar } from 'lucide-react'

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
}

export default function BookingsPage() {
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-white">Bookings</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
        >
          <option value="all">All Types</option>
          <option value="inperson">In-Person</option>
          <option value="videocall">Videocall</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-gray-400">No bookings found.</div>
      ) : (
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1E3A5F]/30 text-gray-300 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/50">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#1E3A5F]/20">
                  <td className="px-6 py-4 text-white">{b.date}</td>
                  <td className="px-6 py-4 text-white">{b.time}</td>
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
                          title="Confirm"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(b.id, 'cancelled')}
                          className="p-1.5 bg-red-900/30 text-red-300 rounded hover:bg-red-900/50"
                          title="Cancel"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
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
