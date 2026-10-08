'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminI18n } from '@/lib/admin/i18n'

export default function InventarioTabs() {
  const { t } = useAdminI18n()
  const pathname = usePathname()
  const tabs = [
    { href: '/admin/inventario', label: t.inventario.tabs.productos, match: (p: string) => p === '/admin/inventario' || /^\/admin\/inventario\/(\d+|nuevo)/.test(p) },
    { href: '/admin/inventario/entradas', label: t.inventario.tabs.entradas, match: (p: string) => p.startsWith('/admin/inventario/entradas') },
    { href: '/admin/inventario/categorias', label: t.inventario.tabs.categorias, match: (p: string) => p.startsWith('/admin/inventario/categorias') },
  ]

  return (
    <nav className="flex gap-1 mb-6 border-b border-[#1E3A5F] overflow-x-auto" aria-label={t.inventario.title}>
      {tabs.map((tab) => {
        const active = tab.match(pathname)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={`px-4 py-3 -mb-px text-sm whitespace-nowrap border-b-2 transition-colors ${
              active ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
