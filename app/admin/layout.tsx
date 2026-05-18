import { getSession } from '@/lib/admin/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const isLoggedIn = !!session

  return (
    <div className="flex min-h-screen bg-[#0F1D2E]">
      {isLoggedIn && <AdminSidebar />}
      <main className={`flex-1 overflow-auto ${isLoggedIn ? 'p-8' : ''}`}>
        {children}
      </main>
    </div>
  )
}
