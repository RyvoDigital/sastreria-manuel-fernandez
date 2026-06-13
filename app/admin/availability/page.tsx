'use client'

import { useEffect, useState } from 'react'
import { Clock, Lock, Unlock, Trash2, Loader2 } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

interface BlockedSlot {
  id: number
  date: string
  time: string
  reason: string | null
}

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
]

const SATURDAY_SLOTS = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30']

function formatDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDayName(dateStr: string, locale: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day, 12, 0, 0)
  return date.toLocaleDateString(
    locale === 'en' ? 'en-GB' : locale === 'it' ? 'it-IT' : locale === 'fr' ? 'fr-FR' : 'es-ES',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  )
}

function getDayOfWeekLocal(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0).getDay()
}

function getSlotsForDate(dateStr: string): string[] {
  const dayOfWeek = getDayOfWeekLocal(dateStr)
  if (dayOfWeek === 0) return []
  if (dayOfWeek === 6) return SATURDAY_SLOTS
  return TIME_SLOTS
}

export default function AvailabilityPage() {
  const { locale } = useAdminI18n()
  const [selectedDate, setSelectedDate] = useState(formatDateLocal(new Date()))
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlockedSlots()
  }, [selectedDate])

  async function fetchBlockedSlots() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/availability?date=${selectedDate}`)
      const data = await res.json()
      if (res.ok) {
        setBlockedSlots(data.slots || [])
      } else {
        setError(data.error || 'Error loading blocked slots')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function toggleSlot(time: string) {
    const existing = blockedSlots.find((s) => s.time === time)
    if (existing) {
      // Unblock
      setSaving(time)
      const res = await fetch(`/api/admin/availability?id=${existing.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setBlockedSlots(blockedSlots.filter((s) => s.id !== existing.id))
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to unblock slot')
      }
      setSaving(null)
    } else {
      // Block
      setSaving(time)
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, time, reason: 'Bloqueado por admin' }),
      })
      if (res.ok) {
        const data = await res.json()
        setBlockedSlots([...blockedSlots, data.slot])
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to block slot')
      }
      setSaving(null)
    }
  }

  const slots = getSlotsForDate(selectedDate)
  const isSunday = getDayOfWeekLocal(selectedDate) === 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-white">Gestión de horarios</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6 mb-6">
        <label className="block text-sm text-gray-400 mb-2">Seleccionar fecha</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white text-sm"
        />
        <p className="mt-2 text-[#C9A84C] text-sm">
          {getDayName(selectedDate, locale)}
        </p>
      </div>

      <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
        <h2 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
          <Clock size={18} className="text-[#C9A84C]" />
          Franjas horarias
        </h2>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 size={16} className="animate-spin" />
            Cargando…
          </div>
        ) : isSunday ? (
          <p className="text-gray-400">Domingo — cerrado</p>
        ) : slots.length === 0 ? (
          <p className="text-gray-400">No hay franjas disponibles para esta fecha.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {slots.map((time) => {
              const blocked = blockedSlots.find((s) => s.time === time)
              return (
                <button
                  key={time}
                  onClick={() => toggleSlot(time)}
                  disabled={!!saving}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-colors ${
                    blocked
                      ? 'bg-red-900/20 border-red-900/50 text-red-300 hover:bg-red-900/30'
                      : 'bg-emerald-900/10 border-emerald-900/30 text-emerald-300 hover:bg-emerald-900/20'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {blocked ? <Lock size={14} /> : <Unlock size={14} />}
                    {time}
                  </span>
                  {blocked && !saving && (
                    <Trash2 size={14} className="opacity-60" />
                  )}
                  {saving === time && <Loader2 size={14} className="animate-spin" />}
                </button>
              )
            })}
          </div>
        )}

        <div className="mt-6 flex items-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Unlock size={14} className="text-emerald-300" />
            Disponible
          </div>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-red-300" />
            No disponible
          </div>
        </div>
      </div>
    </div>
  )
}
