import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin, sinDineroBody, sinDineroDeep } from '@/lib/admin/server'
import { updateVariante } from '@/lib/admin/inventario'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update variante', async () => {
    const admin = await requireAdmin()
    return sinDineroDeep(admin, { variante: await updateVariante(parseId((await ctx.params).id), sinDineroBody(admin, await request.json())) })
  })
}
