'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Mail,
  CreditCard,
  Users,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  KeyRound,
  BookOpen,
  Truck,
  Package,
  ShoppingBag,
  FileBarChart,
  Scissors,
  ClipboardList,
  X,
} from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import type { Role } from '@/lib/admin/server'
import { useRol } from '@/app/admin/_components/role'

// Evelyn's order. `roles` limits an item; without it, Propietarios and Empleados see it.
// The API enforces the same limits.
const STAFF: readonly Role[] = ['owner', 'manager']
const OWNER: readonly Role[] = ['owner']
const navGroups = [
  {
    key: 'gestion',
    items: [
      { href: '/admin', icon: LayoutDashboard, key: 'dashboard' },
      { href: '/admin/clientes', icon: Users, key: 'customers' },
      { href: '/admin/bookings', icon: Calendar, key: 'bookings' },
      { href: '/admin/encargos', icon: ClipboardList, key: 'encargos' },
      { href: '/admin/taller', icon: Scissors, key: 'taller', roles: ['owner', 'manager', 'taller'] as readonly Role[] },
      { href: '/admin/inventario', icon: Package, key: 'inventario' },
      { href: '/admin/ventas', icon: ShoppingBag, key: 'ventas', roles: OWNER },
      { href: '/admin/proveedores', icon: Truck, key: 'proveedores' },
      { href: '/admin/informes', icon: FileBarChart, key: 'informes', roles: OWNER },
    ],
  },
  {
    key: 'web',
    items: [
      { href: '/admin/availability', icon: Clock, key: 'availability' },
      { href: '/admin/contacts', icon: Mail, key: 'contacts', roles: OWNER },
      { href: '/admin/payments', icon: CreditCard, key: 'payments', roles: OWNER },
      { href: '/admin/courses', icon: BookOpen, key: 'courses', roles: OWNER },
      { href: '/admin/content', icon: FileText, key: 'content' },
      { href: '/admin/settings', icon: Settings, key: 'settings', roles: OWNER },
      { href: '/admin/analytics', icon: BarChart3, key: 'analytics' },
    ],
  },
] as const

const accountItems = [{ href: '/admin/change-password', icon: KeyRound, key: 'password' }] as const

function visible(item: object, role: Role) {
  const roles = 'roles' in item ? (item.roles as readonly Role[]) : STAFF
  return roles.includes(role)
}

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const { t, locale, setLocale } = useAdminI18n()
  const langSwitcherRef = useRef<HTMLDivElement>(null)
  const [stockAlerts, setStockAlerts] = useState(0)
  const { role } = useRol()

  // Low-stock / sold-out count next to Inventario, refreshed on every navigation
  useEffect(() => {
    if (role === 'taller') return
    let current = true
    fetch('/api/admin/inventario/alertas?limit=1')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => current && d && setStockAlerts(d.agotados + d.bajos))
      .catch(() => {})
    return () => {
      current = false
    }
  }, [pathname, role])

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

  // Close the mobile drawer after navigating; onClose is read through a ref so a new callback doesn't close it
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })
  useEffect(() => {
    onCloseRef.current?.()
  }, [pathname])

  return (
    <aside
      className={`print:hidden fixed md:static inset-y-0 left-0 z-50 w-64 min-h-screen bg-[#0A1628] border-r border-[#1E3A5F] flex flex-col shrink-0 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="p-6 border-b border-[#1E3A5F] flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-serif text-[#C9A84C] tracking-wide">{t.sidebar.title}</h1>
          <p className="text-xs text-gray-400 mt-1">{t.sidebar.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-[#1E3A5F]/50 hover:text-white transition-colors shrink-0"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {navGroups.map((group) => {
          const items = group.items.filter((item) => visible(item, role))
          if (items.length === 0) return null
          return (
          <div key={group.key} className="mb-5">
            <div className="px-4 mb-2 text-[11px] uppercase tracking-[0.14em] text-gray-500">{t.nav[group.key]}</div>
            <div className="space-y-1">
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  label={t.sidebar[item.key]}
                  badge={item.key === 'inventario' && stockAlerts > 0 ? { count: stockAlerts, label: t.inventario.panel.alertas } : undefined}
                />
              ))}
            </div>
          </div>
          )
        })}
        <div className="pt-4 border-t border-[#1E3A5F] space-y-1">
          {accountItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} label={t.sidebar[item.key]} />
          ))}
        </div>
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

function NavLink({ item, pathname, label, badge }: {
  item: { href: string; icon: React.ComponentType<{ size?: number }> }
  pathname: string
  label: string
  badge?: { count: number; label: string }
}) {
  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
  return (
    <Link
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
          : 'text-gray-300 hover:bg-[#1E3A5F]/50 hover:text-white'
      }`}
    >
      <item.icon size={18} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs flex items-center justify-center tabular-nums" title={badge.label} aria-label={`${badge.count} ${badge.label}`}>
          {badge.count}
        </span>
      )}
    </Link>
  )
}
