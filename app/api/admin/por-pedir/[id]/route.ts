import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { actualizarPorPedir } from '@/lib/admin/por-pedir'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update por pedir', async () => {
    await requireAdmin()
    return { item: await actualizarPorPedir(parseId((await ctx.params).id), await request.json()) }
  })
}
