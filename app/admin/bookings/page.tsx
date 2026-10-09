'use client'

import { useCallback, useEffect, useState } from 'react'
import { CheckCircle, XCircle, Bell, Pencil, X } from 'lucide-react'
import Link from 'next/link'
import { useAdminI18n } from '@/lib/admin/i18n'
import { useRol } from '../_components/role'

interface Booking {
  id: number
  date: string
  time: string
  type: string
  name: string
  email: string
  phone: string | null
  status: string
  notes: string | null
  created_at: string
  reminder_sent_at: string | null
  tipo_cita: 'primera_visita' | 'prueba' | 'entrega'
  encargo_id: number | null
  encargo_numero: string | null
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
  return timeStr || '—'
}

export default function BookingsPage() {
  const { t, locale } = useAdminI18n()
  const { propietario } = useRol()
  const [tipoCita, setTipoCita] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchBookings = useCallback(() => {
    const params = new URLSearchParams()
    if (filter !== 'all') params.set('type', filter)
    if (tipoCita) params.set('tipoCita', tipoCita)
    return fetch(`/api/admin/bookings?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || [])
        setLoading(false)
      })
  }, [filter, tipoCita])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

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

  function openEdit(booking: Booking) {
    setEditingBooking({ ...booking })
    setEditError(null)
  }

  function closeEdit() {
    setEditingBooking(null)
    setEditError(null)
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingBooking) return
    setSaving(true)
    setEditError(null)

    const res = await fetch('/api/admin/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingBooking.id,
        name: editingBooking.name,
        email: editingBooking.email,
        phone: editingBooking.phone,
        date: editingBooking.date,
        time: editingBooking.time,
        type: editingBooking.type,
        tipo_cita: editingBooking.tipo_cita,
        status: editingBooking.status,
        notes: editingBooking.notes,
      }),
    })

    const data = await res.json()
    setSaving(false)

    if (res.ok) {
      closeEdit()
      fetchBookings()
    } else {
      setEditError(data.error || 'Failed to update booking')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-serif text-white">{t.sidebar.bookings}</h1>
        <div className="flex flex-wrap gap-2">
        <select
          value={tipoCita}
          onChange={(e) => {
            setLoading(true)
            setTipoCita(e.target.value)
          }}
          aria-label={t.citas.tipo}
          className="px-4 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
        >
          <option value="">{t.citas.todas}</option>
          {(['primera_visita', 'prueba', 'entrega'] as const).map((tc) => <option key={tc} value={tc}>{t.citas.tipos[tc]}</option>)}
        </select>
        <select
          value={filter}
          onChange={(e) => {
            setLoading(true)
            setFilter(e.target.value)
          }}
          className="px-4 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
        >
          <option value="all">{t.common.allTypes}</option>
          <option value="inperson">{t.common.inPerson}</option>
          <option value="videocall">{t.common.videocall}</option>
        </select>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : bookings.length === 0 ? (
        <div className="text-gray-400">{t.common.noData}</div>
      ) : (
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[720px]">
            <thead className="bg-[#1E3A5F]/30 text-gray-300 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">{t.common.date}</th>
                <th className="px-6 py-4">{t.common.time}</th>
                <th className="px-6 py-4">{t.common.client}</th>
                <th className="px-6 py-4">Teléfono</th>
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
                    {/* Appointment type before the name, as they write it in the diary */}
                    <div className="text-white">
                      <span className={b.tipo_cita === 'primera_visita' ? 'text-gray-400' : 'text-[#C9A84C]'}>{t.citas.tipos[b.tipo_cita] ?? ''}</span>
                      {' · '}{b.name}
                    </div>
                    {b.email && <div className="text-gray-400 text-xs">{b.email}</div>}
                    {b.encargo_id && (
                      <Link href={`/admin/encargos/${b.encargo_id}`} className="text-xs text-[#C9A84C] hover:text-[#D4B76A]">{t.citas.encargo} {b.encargo_numero}</Link>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">{b.phone || '—'}</td>
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
                      <button
                        onClick={() => openEdit(b)}
                        className="p-1.5 bg-[#1E3A5F]/50 text-[#C9A84C] rounded hover:bg-[#1E3A5F]"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#1E3A5F]">
              <h2 className="text-xl font-serif text-white">Editar reserva</h2>
              <button onClick={closeEdit} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveEdit} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-300 text-sm">
                  {editError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">{t.common.date}</label>
                  <input
                    type="date"
                    required
                    value={editingBooking.date}
                    onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">{t.common.time}</label>
                  <input
                    type="time"
                    required
                    value={editingBooking.time}
                    onChange={(e) => setEditingBooking({ ...editingBooking, time: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">{t.common.client}</label>
                <input
                  type="text"
                  required
                  value={editingBooking.name}
                  onChange={(e) => setEditingBooking({ ...editingBooking, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">{t.citas.tipo}</label>
                <select
                  value={editingBooking.tipo_cita}
                  onChange={(e) => setEditingBooking({ ...editingBooking, tipo_cita: e.target.value as Booking['tipo_cita'] })}
                  className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
                >
                  {(['primera_visita', 'prueba', 'entrega'] as const).map((tc) => <option key={tc} value={tc}>{t.citas.tipos[tc]}</option>)}
                </select>
              </div>

              {propietario && <>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Email</label>
                {/* Pruebas and entregas for clients without email are stored with an empty one */}
                <input
                  type="email"
                  required={editingBooking.tipo_cita === 'primera_visita'}
                  value={editingBooking.email ?? ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={editingBooking.phone || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
                />
              </div>
              </>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">{t.common.type}</label>
                  <select
                    value={editingBooking.type}
                    onChange={(e) => setEditingBooking({ ...editingBooking, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
                  >
                    <option value="inperson">{t.common.inPerson}</option>
                    <option value="videocall">{t.common.videocall}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">{t.common.status}</label>
                  <select
                    value={editingBooking.status}
                    onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">{t.common.notes}</label>
                <textarea
                  value={editingBooking.notes || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 border border-[#1E3A5F] rounded-lg text-white text-sm hover:bg-[#1E3A5F]/30"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#C9A84C] text-black rounded-lg text-sm font-medium hover:bg-[#D4B55A] disabled:opacity-50"
                >
                  {saving ? 'Guardando…' : t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
