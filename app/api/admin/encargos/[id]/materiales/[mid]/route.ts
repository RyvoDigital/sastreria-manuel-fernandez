import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { deleteMaterial, updateMaterial } from '@/lib/admin/encargos'

type Ctx = { params: Promise<{ id: string; mid: string }> }

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update material', async () => {
    await requireAdmin()
    const { id, mid } = await ctx.params
    return { material: await updateMaterial(parseId(id), parseId(mid), await request.json()) }
  })
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  return handle('Delete material', async () => {
    await requireAdmin()
    const { id, mid } = await ctx.params
    await deleteMaterial(parseId(id), parseId(mid))
    return { ok: true }
  })
}
