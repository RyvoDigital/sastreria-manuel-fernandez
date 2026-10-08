import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { getProveedor, updateProveedor } from '@/lib/admin/proveedores'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, ctx: Ctx) {
  return handle('Get proveedor', async () => {
    await requireAdmin()
    return getProveedor(parseId((await ctx.params).id))
  })
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update proveedor', async () => {
    await requireAdmin()
    return { proveedor: await updateProveedor(parseId((await ctx.params).id), await request.json()) }
  })
}
