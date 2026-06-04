'use client'

import { useRef, useEffect } from 'react'
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
  BookOpen,
  Box,
} from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, key: 'dashboard' },
  { href: '/admin/bookings', icon: Calendar, key: 'bookings' },
  { href: '/admin/contacts', icon: Mail, key: 'contacts' },
  { href: '/admin/payments', icon: CreditCard, key: 'payments' },
  { href: '/admin/configurations', icon: Shirt, key: 'configurations' },
  { href: '/admin/courses', icon: BookOpen, key: 'courses' },
  { href: '/admin/garments', icon: Box, key: 'garments' },
  { href: '/admin/customers', icon: Users, key: 'customers' },
  { href: '/admin/content', icon: FileText, key: 'content' },
  { href: '/admin/settings', icon: Settings, key: 'settings' },
  { href: '/admin/analytics', icon: BarChart3, key: 'analytics' },
  { href: '/admin/change-password', icon: KeyRound, key: 'password' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { t, locale, setLocale } = useAdminI18n()
  const langSwitcherRef = useRef<HTMLDivElement>(null)

  // Native DOM event listeners for lang switcher
  useEffect(() => {
    const container = langSwitcherRef.current
    if (!container) return
    const buttons = container.querySelectorAll('button[data-lang]')
    const handlers: Array<() => void> = []
    buttons.forEach((btn) => {
      const lang = btn.getAttribute('data-lang') as 'es' | 'en' | 'it' | 'fr'
      const handler = () => setLocale(lang)
      btn.addEventListener('click', handler)
      handlers.push(() => btn.removeEventListener('click', handler))
    })
    return () => handlers.forEach((fn) => fn())
  }, [setLocale])

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <aside className="w-64 min-h-screen bg-[#0A1628] border-r border-[#1E3A5F] flex flex-col shrink-0">
      <div className="p-6 border-b border-[#1E3A5F]">
        <h1 className="text-lg font-serif text-[#C9A84C] tracking-wide">{t.sidebar.title}</h1>
        <p className="text-xs text-gray-400 mt-1">{t.sidebar.subtitle}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
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
              {/* @ts-ignore */}
              {t.sidebar[item.key]}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#1E3A5F] space-y-3">
        <div ref={langSwitcherRef} className="flex items-center justify-center gap-1">
          {(['es', 'en', 'it', 'fr'] as const).map((l) => (
            <button
              key={l}
              type="button"
              data-lang={l}
              className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
                locale === l
                  ? 'bg-[#C9A84C] text-[#0A1628] font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-[#1E3A5F]/50'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          {t.sidebar.logout}
        </button>
      </div>
    </aside>
  )
}
