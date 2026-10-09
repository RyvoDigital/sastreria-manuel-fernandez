import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin, requirePropietarioData } from '@/lib/admin/server'
import { getCompra } from '@/lib/admin/compras'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, ctx: Ctx) {
  return handle('Get compra', async () => {
    requirePropietarioData(await requireAdmin())
    return getCompra(parseId((await ctx.params).id))
  })
}
