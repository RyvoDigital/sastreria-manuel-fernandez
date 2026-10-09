import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin, sinDineroBody, sinDineroDeep } from '@/lib/admin/server'
import { getProducto, updateProducto } from '@/lib/admin/inventario'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, ctx: Ctx) {
  return handle('Get producto', async () => {
    const admin = await requireAdmin()
    return sinDineroDeep(admin, await getProducto(parseId((await ctx.params).id)))
  })
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update producto', async () => {
    const admin = await requireAdmin()
    return sinDineroDeep(admin, { producto: await updateProducto(parseId((await ctx.params).id), sinDineroBody(admin, await request.json())) })
  })
}
