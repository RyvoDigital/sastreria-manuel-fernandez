import { NextRequest } from 'next/server'
import { handle, requireAdmin } from '@/lib/admin/server'
import { getAlertas } from '@/lib/admin/inventario'

export async function GET(request: NextRequest) {
  return handle('Alertas stock', async () => {
    await requireAdmin()
    return getAlertas(Number(request.nextUrl.searchParams.get('limit')) || 100)
  })
}
