'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users, CreditCard } from 'lucide-react'

interface Stats {
  totalBookings: number
  bookingsThisMonth: number
  unreadContacts: number
  newConfigurations: number
  upcomingAppointments: number
}

export default function AnalyticsPage() {
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
      <h1 className="text-2xl font-serif text-white mb-8">Analytics</h1>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-emerald-400" size={20} />
                <span className="text-sm text-gray-400">Monthly Bookings</span>
              </div>
              <div className="text-3xl font-light text-white">{stats?.bookingsThisMonth ?? 0}</div>
            </div>
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-blue-400" size={20} />
                <span className="text-sm text-gray-400">Total Clients</span>
              </div>
              <div className="text-3xl font-light text-white">{stats?.totalBookings ?? 0}</div>
            </div>
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-purple-400" size={20} />
                <span className="text-sm text-gray-400">New Configs</span>
              </div>
              <div className="text-3xl font-light text-white">{stats?.newConfigurations ?? 0}</div>
            </div>
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="text-amber-400" size={20} />
                <span className="text-sm text-gray-400">Conversion</span>
              </div>
              <div className="text-3xl font-light text-white">
                {stats && stats.totalBookings > 0
                  ? `${Math.round((stats.bookingsThisMonth / stats.totalBookings) * 100)}%`
                  : '0%'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Bookings this month / total</div>
            </div>
          </div>

          {/* Placeholder for future charts */}
          <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
            <h2 className="text-lg font-medium text-white mb-4">Revenue Overview</h2>
            <div className="h-64 flex items-center justify-center bg-[#1E3A5F]/10 rounded-lg">
              <div className="text-center">
                <BarChart3 size={48} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Detailed revenue charts coming soon</p>
                <p className="text-gray-500 text-xs mt-1">Requires payment data history</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">Popular Services</h2>
              <div className="h-48 flex items-center justify-center bg-[#1E3A5F]/10 rounded-lg">
                <p className="text-gray-400 text-sm">Service breakdown chart coming soon</p>
              </div>
            </div>
            <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">Booking Trends</h2>
              <div className="h-48 flex items-center justify-center bg-[#1E3A5F]/10 rounded-lg">
                <p className="text-gray-400 text-sm">Monthly trend chart coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
