import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { updatePrueba } from '@/lib/admin/encargos'

type Ctx = { params: Promise<{ id: string; pid: string }> }

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update prueba', async () => {
    await requireAdmin()
    const { id, pid } = await ctx.params
    return { prueba: await updatePrueba(parseId(id), parseId(pid), await request.json()) }
  })
}
