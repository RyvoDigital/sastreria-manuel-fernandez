import { NextRequest } from 'next/server'
import { esPropietario, handle, requireAdmin, requirePropietarioData } from '@/lib/admin/server'
import { createCliente, listClientes } from '@/lib/admin/clientes'

export async function GET(request: NextRequest) {
  return handle('List clientes', async () => {
    const admin = await requireAdmin()
    const sp = request.nextUrl.searchParams
    const clientes = await listClientes({
      q: sp.get('q')?.trim() || undefined,
      archivados: sp.get('archivados') === '1',
      offset: Number(sp.get('offset')) || 0,
    })
    // Empleados get the name only (search still matches email and phone)
    if (!esPropietario(admin)) {
      return { clientes: clientes.map((c) => ({ ...c, email: null, telefono: null })) }
    }
    return { clientes }
  })
}

export async function POST(request: NextRequest) {
  return handle('Create cliente', async () => {
    const admin = await requireAdmin()
    requirePropietarioData(admin)
    return { cliente: await createCliente(await request.json(), admin) }
  })
}
