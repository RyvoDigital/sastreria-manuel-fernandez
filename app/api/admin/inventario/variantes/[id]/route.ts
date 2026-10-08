import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { updateVariante } from '@/lib/admin/inventario'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update variante', async () => {
    await requireAdmin()
    return { variante: await updateVariante(parseId((await ctx.params).id), await request.json()) }
  })
}
