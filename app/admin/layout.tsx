import { getSession } from '@/lib/admin/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const isLoggedIn = !!session

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A1628]">
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0F1D2E]">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
