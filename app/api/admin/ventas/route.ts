import { NextRequest } from 'next/server'
import { handle, requireAdmin, requirePropietarioData } from '@/lib/admin/server'
import { createVenta, listVentas } from '@/lib/admin/ventas'

const DATE = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: NextRequest) {
  return handle('List ventas', async () => {
    requirePropietarioData(await requireAdmin())
    const sp = request.nextUrl.searchParams
    const desde = sp.get('desde') ?? ''
    const hasta = sp.get('hasta') ?? ''
    return {
      ventas: await listVentas({
        q: sp.get('q')?.trim() || undefined,
        desde: DATE.test(desde) ? desde : undefined,
        hasta: DATE.test(hasta) ? hasta : undefined,
        cliente: Number(sp.get('cliente')) || undefined,
        offset: Number(sp.get('offset')) || 0,
      }),
    }
  })
}

export async function POST(request: NextRequest) {
  return handle('Create venta', async () => {
    const admin = await requireAdmin()
    requirePropietarioData(admin)
    return { venta: await createVenta(await request.json(), admin) }
  })
}
