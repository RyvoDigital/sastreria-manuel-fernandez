'use client'

import { useEffect, useState } from 'react'
import { Calendar, Mail, Users, Clock, Save, Euro } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import StockAlertsCard from './_components/StockAlertsCard'
import PanelKpis from './_components/PanelKpis'
import PorPedirCard from './_components/PorPedirCard'
import { useRol } from './_components/role'

interface Stats {
  totalBookings: number
  bookingsThisMonth: number
  unreadContacts: number
  totalClientes: number
  upcomingAppointments: number
}

interface ServiceSetting {
  id: string
  name: string
  enabled: boolean
  price: number | null
}

// Configurator settings rows stay in the DB but the feature is gone
const RETIRED_SETTINGS = ['configurador', 'modelos3d']

export default function AdminDashboard() {
  const { t } = useAdminI18n()
  const { propietario } = useRol()
  const [stats, setStats] = useState<Stats | null>(null)
  const [settings, setSettings] = useState<ServiceSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      // Service prices are owner-only
      propietario ? fetch('/api/admin/settings').then((r) => r.json()) : Promise.resolve({ settings: [] }),
    ]).then(([statsData, settingsData]) => {
      setStats(statsData.stats)
      setSettings(settingsData.settings || [])
      setLoading(false)
    })
  }, [propietario])

  async function handleSavePrices() {
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

  function updatePrice(id: string, price: number) {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price } : s))
    )
  }

  const statCards = [
    { label: t.dashboard.totalBookings, value: stats?.totalBookings ?? 0, icon: Calendar, color: 'text-blue-400' },
    { label: t.dashboard.unreadContacts, value: stats?.unreadContacts ?? 0, icon: Mail, color: 'text-amber-400' },
    { label: t.dashboard.totalClientes, value: stats?.totalClientes ?? 0, icon: Users, color: 'text-purple-400' },
    { label: t.common.videocall, value: stats?.upcomingAppointments ?? 0, icon: Clock, color: 'text-emerald-400' },
  ]

  const priceSettings = settings.filter((s) => s.price !== null && !RETIRED_SETTINGS.includes(s.id))

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">{t.dashboard.title}</h1>

      <div className="space-y-6 mb-10">
        {propietario && <PanelKpis />}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <PorPedirCard />
          <StockAlertsCard />
        </div>
      </div>

      {/* Stats cards */}
      <h2 className="text-[11px] uppercase tracking-[0.14em] text-gray-500 mb-3">{t.nav.web}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <card.icon size={20} className={card.color} />
              <span className="text-sm text-gray-400">{card.label}</span>
            </div>
            <div className="text-3xl font-light text-white">{card.value}</div>
          </div>
        ))}
      </div>


      {/* Price settings */}
      {propietario && (
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Euro size={18} className="text-[#C9A84C]" />
            Precios de servicios
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSavePrices}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#0A1628] text-sm font-medium rounded-lg hover:bg-[#D4B76A] transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? t.common.saving : t.settings.save}
            </button>
            {saved && <span className="text-emerald-400 text-sm">{t.settings.saved}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-gray-400">{t.common.loading}</div>
          ) : (
            priceSettings.map((s) => (
              <div key={s.id} className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">{s.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#C9A84C] text-xl">€</span>
                  <input
                    type="number"
                    value={s.price ?? 0}
                    onChange={(e) => updatePrice(s.id, parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent text-white text-2xl font-light focus:outline-none border-b border-[#1E3A5F] focus:border-[#C9A84C] pb-1"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${s.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {s.enabled ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">{t.dashboard.viewBookings}</h2>
          <a
            href="/admin/bookings"
            className="block p-4 bg-[#1E3A5F]/20 rounded-lg hover:bg-[#1E3A5F]/30 transition-colors"
          >
            <h3 className="text-[#C9A84C] font-medium mb-1">{t.dashboard.viewBookings}</h3>
            <p className="text-gray-400 text-sm">{stats?.totalBookings ?? 0} total</p>
          </a>
        </div>
      </div>
    </div>
  )
}
