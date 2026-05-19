'use client'

import { useEffect, useState } from 'react'
import { Calendar, Mail, Shirt, CreditCard, Clock } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

interface Stats {
  totalBookings: number
  bookingsThisMonth: number
  unreadContacts: number
  newConfigurations: number
  upcomingAppointments: number
}

export default function AdminDashboard() {
  const { t } = useAdminI18n()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => setStats(data.stats))
  }, [])

  const cards = [
    { label: t.dashboard.totalBookings, value: stats?.totalBookings ?? 0, icon: Calendar, color: 'text-blue-400' },
    { label: t.dashboard.unreadContacts, value: stats?.unreadContacts ?? 0, icon: Mail, color: 'text-amber-400' },
    { label: t.dashboard.newConfigs, value: stats?.newConfigurations ?? 0, icon: Shirt, color: 'text-purple-400' },
    { label: 'Videocalls', value: stats?.upcomingAppointments ?? 0, icon: Clock, color: 'text-emerald-400' },
    { label: 'Stripe', value: '—', icon: CreditCard, color: 'text-cyan-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">{t.dashboard.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <card.icon size={20} className={card.color} />
              <span className="text-sm text-gray-400">{card.label}</span>
            </div>
            <div className="text-3xl font-light text-white">{card.value}</div>
          </div>
        ))}
      </div>

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
