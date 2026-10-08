import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { updateCategoria } from '@/lib/admin/inventario'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update categoria', async () => {
    await requireAdmin()
    return { categoria: await updateCategoria(parseId((await ctx.params).id), await request.json()) }
  })
}
