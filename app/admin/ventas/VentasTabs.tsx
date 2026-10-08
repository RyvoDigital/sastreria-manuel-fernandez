'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminI18n } from '@/lib/admin/i18n'

export default function VentasTabs() {
  const { t } = useAdminI18n()
  const pathname = usePathname()
  const tabs = [
    { href: '/admin/ventas', label: t.ventas.tabs.ventas, active: pathname === '/admin/ventas' || /^\/admin\/ventas\/\d+/.test(pathname) },
    { href: '/admin/ventas/cobros', label: t.ventas.tabs.cobros, active: pathname.startsWith('/admin/ventas/cobros') },
  ]
  return (
    <nav className="flex gap-1 mb-6 border-b border-[#1E3A5F] print:hidden" aria-label={t.ventas.title}>
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? 'page' : undefined}
          className={`px-4 py-3 -mb-px text-sm border-b-2 transition-colors ${
            tab.active ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
