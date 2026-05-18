import { getSession } from '@/lib/admin/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { AdminI18nProvider } from '@/lib/admin/i18n'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const isLoggedIn = !!session

  if (!isLoggedIn) {
    return (
      <AdminI18nProvider>
        <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4 py-8">
          {children}
        </div>
      </AdminI18nProvider>
    )
  }

  return (
    <AdminI18nProvider>
      <div className="flex min-h-screen bg-[#0F1D2E]">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </AdminI18nProvider>
  )
}
