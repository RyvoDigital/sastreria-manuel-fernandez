'use client'

import { useAdminI18n } from '@/lib/admin/i18n'

export default function AdminLangSwitcher() {
  const { locale, setLocale } = useAdminI18n()

  return (
    <div className="flex items-center justify-center gap-1">
      {(['es', 'en', 'it', 'fr'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            locale === l
              ? 'bg-[#C9A84C] text-[#0A1628] font-medium'
              : 'text-gray-400 hover:text-white hover:bg-[#1E3A5F]/50'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
