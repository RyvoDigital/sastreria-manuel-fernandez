import { NextRequest } from 'next/server'
import { handle, requireAdmin } from '@/lib/admin/server'
import { createCliente, listClientes } from '@/lib/admin/clientes'

export async function GET(request: NextRequest) {
  return handle('List clientes', async () => {
    await requireAdmin()
    const sp = request.nextUrl.searchParams
    const clientes = await listClientes({
      q: sp.get('q')?.trim() || undefined,
      archivados: sp.get('archivados') === '1',
      offset: Number(sp.get('offset')) || 0,
    })
    return { clientes }
  })
}

export async function POST(request: NextRequest) {
  return handle('Create cliente', async () => {
    const admin = await requireAdmin()
    return { cliente: await createCliente(await request.json(), admin) }
  })
}
