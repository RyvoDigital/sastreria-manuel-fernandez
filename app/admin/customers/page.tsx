import { redirect } from 'next/navigation'

// Old URL, kept so bookmarks keep working
export default function CustomersRedirect() {
  redirect('/admin/clientes')
}
