import { getSession } from '@/lib/admin/auth'
import { query } from '@/lib/db'
import type { Role } from '@/lib/admin/server'
import AdminShell from '@/components/admin/AdminShell'
import { AdminI18nProvider } from '@/lib/admin/i18n'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  // The role comes from the row, not the token, so a change applies on the next page load
  const admin = session
    ? ((await query(`SELECT role FROM admins WHERE id = $1 AND activo IS NOT FALSE`, [session.id])).rows[0] as { role: Role } | undefined)
    : undefined

  if (!admin) {
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
      <AdminShell role={admin.role}>{children}</AdminShell>
    </AdminI18nProvider>
  )
}
