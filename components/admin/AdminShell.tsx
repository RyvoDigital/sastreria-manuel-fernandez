'use client'

import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAdminI18n } from '@/lib/admin/i18n'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useAdminI18n()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-[#0F1D2E]">
      <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-[#0A1628] border-b border-[#1E3A5F]">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-gray-300 hover:bg-[#1E3A5F]/50 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-serif text-[#C9A84C] tracking-wide truncate">{t.sidebar.title}</h1>
          <p className="text-xs text-gray-400 truncate">{t.sidebar.subtitle}</p>
        </div>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      <div className="flex min-h-[calc(100vh-57px)] md:min-h-screen">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}