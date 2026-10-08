import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { getProducto, updateProducto } from '@/lib/admin/inventario'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, ctx: Ctx) {
  return handle('Get producto', async () => {
    await requireAdmin()
    return getProducto(parseId((await ctx.params).id))
  })
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update producto', async () => {
    await requireAdmin()
    return { producto: await updateProducto(parseId((await ctx.params).id), await request.json()) }
  })
}
