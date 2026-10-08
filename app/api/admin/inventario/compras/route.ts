import { NextRequest } from 'next/server'
import { handle, requireAdmin } from '@/lib/admin/server'
import { createCompra, listCompras } from '@/lib/admin/compras'

export async function GET(request: NextRequest) {
  return handle('List compras', async () => {
    await requireAdmin()
    const sp = request.nextUrl.searchParams
    return { compras: await listCompras({ proveedor: Number(sp.get('proveedor')) || undefined, offset: Number(sp.get('offset')) || 0 }) }
  })
}

export async function POST(request: NextRequest) {
  return handle('Create compra', async () => {
    const admin = await requireAdmin()
    return { compra: await createCompra(await request.json(), admin) }
  })
}
