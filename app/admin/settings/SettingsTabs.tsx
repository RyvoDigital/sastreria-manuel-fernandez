'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminI18n } from '@/lib/admin/i18n'

export default function SettingsTabs() {
  const { t } = useAdminI18n()
  const pathname = usePathname()
  const tabs = [
    { href: '/admin/settings', label: t.usuarios.tabServicios },
    { href: '/admin/settings/usuarios', label: t.usuarios.tabUsuarios },
  ]

  return (
    <div className="flex gap-1 mb-8 border-b border-[#1E3A5F]" role="tablist">
      {tabs.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            role="tab"
            aria-selected={active}
            className={`px-4 py-3 -mb-px text-sm border-b-2 transition-colors ${
              active ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
