'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users, CreditCard } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

interface Stats {
  totalBookings: number
  bookingsThisMonth: number
  unreadContacts: number
  newConfigurations: number
  upcomingAppointments: number
}

export default function AnalyticsPage() {
  const { t } = useAdminI18n()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">{t.sidebar.analytics}</h1>

      {loading ? (
        <div className="text-gray-400">{t.common.loading}</div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-emerald-400" size={20} />
                <span className="text-sm text-gray-400">{t.common.monthlyBookings}</span>
              </div>
              <div className="text-3xl font-light text-white">{stats?.bookingsThisMonth ?? 0}</div>
            </div>
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-blue-400" size={20} />
                <span className="text-sm text-gray-400">{t.common.totalClients}</span>
              </div>
              <div className="text-3xl font-light text-white">{stats?.totalBookings ?? 0}</div>
            </div>
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-purple-400" size={20} />
                <span className="text-sm text-gray-400">{t.common.newConfigs}</span>
              </div>
              <div className="text-3xl font-light text-white">{stats?.newConfigurations ?? 0}</div>
            </div>
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="text-amber-400" size={20} />
                <span className="text-sm text-gray-400">{t.common.conversion}</span>
              </div>
              <div className="text-3xl font-light text-white">
                {stats && stats.totalBookings > 0
                  ? `${Math.round((stats.bookingsThisMonth / stats.totalBookings) * 100)}%`
                  : '0%'}
              </div>
              <div className="text-xs text-gray-500 mt-1">{t.common.monthlyBookings} / total</div>
            </div>
          </div>

          <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
            <h2 className="text-lg font-medium text-white mb-4">{t.common.revenueOverview}</h2>
            <div className="h-64 flex items-center justify-center bg-[#1E3A5F]/10 rounded-lg">
              <div className="text-center">
                <BarChart3 size={48} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">{t.common.comingSoon}</p>
                <p className="text-gray-500 text-xs mt-1">{t.common.requiresHistory}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">{t.common.popularServices}</h2>
              <div className="h-48 flex items-center justify-center bg-[#1E3A5F]/10 rounded-lg">
                <p className="text-gray-400 text-sm">{t.common.comingSoon}</p>
              </div>
            </div>
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">{t.common.bookingTrends}</h2>
              <div className="h-48 flex items-center justify-center bg-[#1E3A5F]/10 rounded-lg">
                <p className="text-gray-400 text-sm">{t.common.comingSoon}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
