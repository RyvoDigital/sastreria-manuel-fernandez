import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin, requirePropietarioData } from '@/lib/admin/server'
import { getVenta } from '@/lib/admin/ventas'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, ctx: Ctx) {
  return handle('Get venta', async () => {
    requirePropietarioData(await requireAdmin())
    return getVenta(parseId((await ctx.params).id))
  })
}
