import { NextRequest } from 'next/server'
import { handle, requireAdmin, sinDineroDeep } from '@/lib/admin/server'
import { ajustarStock } from '@/lib/admin/inventario'

export async function POST(request: NextRequest) {
  return handle('Ajuste stock', async () => {
    const admin = await requireAdmin()
    return sinDineroDeep(admin, await ajustarStock(await request.json(), admin))
  })
}
