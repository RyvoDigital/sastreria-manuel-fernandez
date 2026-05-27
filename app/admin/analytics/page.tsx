'use client'

import { useEffect, useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  CreditCard,
  Calendar,
  Video,
  Mail,
  Settings,
} from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'

interface Stats {
  totalBookings: number
  bookingsThisMonth: number
  unreadContacts: number
  newConfigurations: number
  upcomingAppointments: number
  bookingsByType: { type: string; total: string }[]
  bookingsByMonth: { month: string; total: string }[]
  contactsByType: { type: string; total: string }[]
  configsByStatus: { status: string; total: string }[]
}

const COLORS = ['#C9A84C', '#4A90A4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

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

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-serif text-white mb-8">{t.sidebar.analytics}</h1>
        <div className="text-gray-400">{t.common.loading}</div>
      </div>
    )
  }

  const bookingsByTypeData =
    stats?.bookingsByType.map((row) => ({
      name: row.type === 'videocall' ? 'Videollamada' : 'Presencial',
      value: parseInt(row.total, 10),
    })) || []

  const bookingsByMonthData =
    stats?.bookingsByMonth.map((row) => ({
      name: row.month,
      value: parseInt(row.total, 10),
    })) || []

  const contactsByTypeData =
    stats?.contactsByType.map((row) => ({
      name: row.type === 'videollamada' ? 'Videollamada' : 'Contacto',
      value: parseInt(row.total, 10),
    })) || []

  const configsByStatusData =
    stats?.configsByStatus.map((row) => ({
      name:
        row.status === 'new'
          ? 'Nuevo'
          : row.status === 'quote_sent'
            ? 'Presupuesto'
            : row.status === 'in_production'
              ? 'En producción'
              : 'Completado',
      value: parseInt(row.total, 10),
    })) || []

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">{t.sidebar.analytics}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-[#C9A84C]" size={20} />
            <h2 className="text-lg font-medium text-white">{t.common.bookingTrends}</h2>
          </div>
          {bookingsByMonthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={bookingsByMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#0A1628',
                    border: '1px solid #1E3A5F',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#C9A84C"
                  strokeWidth={2}
                  dot={{ fill: '#C9A84C', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center bg-[#1E3A5F]/10 rounded-lg">
              <p className="text-gray-400 text-sm">{t.common.noData}</p>
            </div>
          )}
        </div>

        {/* Bookings by Type */}
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Video className="text-[#C9A84C]" size={20} />
            <h2 className="text-lg font-medium text-white">{t.common.popularServices}</h2>
          </div>
          {bookingsByTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={bookingsByTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {bookingsByTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#0A1628',
                    border: '1px solid #1E3A5F',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center bg-[#1E3A5F]/10 rounded-lg">
              <p className="text-gray-400 text-sm">{t.common.noData}</p>
            </div>
          )}
        </div>

        {/* Contacts by Type */}
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="text-[#C9A84C]" size={20} />
            <h2 className="text-lg font-medium text-white">Contactos por Tipo</h2>
          </div>
          {contactsByTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={contactsByTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#0A1628',
                    border: '1px solid #1E3A5F',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="#4A90A4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center bg-[#1E3A5F]/10 rounded-lg">
              <p className="text-gray-400 text-sm">{t.common.noData}</p>
            </div>
          )}
        </div>

        {/* Configs by Status */}
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-[#C9A84C]" size={20} />
            <h2 className="text-lg font-medium text-white">Configuraciones por Estado</h2>
          </div>
          {configsByStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={configsByStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#0A1628',
                    border: '1px solid #1E3A5F',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center bg-[#1E3A5F]/10 rounded-lg">
              <p className="text-gray-400 text-sm">{t.common.noData}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
