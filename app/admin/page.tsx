'use client'

import { useEffect, useState } from 'react'
import { Calendar, Mail, Shirt, CreditCard, Clock } from 'lucide-react'

interface Stats {
  totalBookings: number
  bookingsThisMonth: number
  unreadContacts: number
  newConfigurations: number
  upcomingAppointments: number
}

export default function AdminDashboard() {
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

  const cards = [
    { label: 'Total Bookings', value: stats?.totalBookings ?? 0, icon: Calendar, color: 'text-blue-400' },
    { label: 'This Month', value: stats?.bookingsThisMonth ?? 0, icon: Clock, color: 'text-emerald-400' },
    { label: 'Unread Contacts', value: stats?.unreadContacts ?? 0, icon: Mail, color: 'text-amber-400' },
    { label: 'New Configs', value: stats?.newConfigurations ?? 0, icon: Shirt, color: 'text-purple-400' },
    { label: 'Upcoming', value: stats?.upcomingAppointments ?? 0, icon: CreditCard, color: 'text-rose-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <card.icon className={card.color} size={24} />
              <span className="text-xs text-gray-400 uppercase tracking-wider">{card.label}</span>
            </div>
            <div className="text-3xl font-light text-white">
              {loading ? '...' : card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/bookings" className="p-4 bg-[#1E3A5F]/30 rounded-lg hover:bg-[#1E3A5F]/50 transition-colors">
            <h3 className="text-[#C9A84C] font-medium mb-1">View Bookings</h3>
            <p className="text-sm text-gray-400">See all appointments and manage your calendar</p>
          </a>
          <a href="/admin/contacts" className="p-4 bg-[#1E3A5F]/30 rounded-lg hover:bg-[#1E3A5F]/50 transition-colors">
            <h3 className="text-[#C9A84C] font-medium mb-1">Check Inbox</h3>
            <p className="text-sm text-gray-400">Read and reply to client inquiries</p>
          </a>
          <a href="/admin/customers" className="p-4 bg-[#1E3A5F]/30 rounded-lg hover:bg-[#1E3A5F]/50 transition-colors">
            <h3 className="text-[#C9A84C] font-medium mb-1">Customer Directory</h3>
            <p className="text-sm text-gray-400">Search clients and view their history</p>
          </a>
        </div>
      </div>
    </div>
  )
}
