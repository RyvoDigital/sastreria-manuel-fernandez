'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Mail,
  CreditCard,
  Shirt,
  Users,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  KeyRound,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/configurations', label: 'Configurations', icon: Shirt },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/change-password', label: 'Password', icon: KeyRound },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <aside className="w-64 min-h-screen bg-[#0A1628] border-r border-[#1E3A5F] flex flex-col">
      <div className="p-6 border-b border-[#1E3A5F]">
        <h1 className="text-lg font-serif text-[#C9A84C] tracking-wide">Sastrería Admin</h1>
        <p className="text-xs text-gray-400 mt-1">Manuel Fernández</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                  : 'text-gray-300 hover:bg-[#1E3A5F]/50 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#1E3A5F]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm text-gray-300 hover:bg-red-900/20 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
