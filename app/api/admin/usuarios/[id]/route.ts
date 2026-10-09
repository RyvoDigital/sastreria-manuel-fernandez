import { NextRequest } from 'next/server'
import { handle, parseId, requireOwner } from '@/lib/admin/server'
import { updateUsuario } from '@/lib/admin/usuarios'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update usuario', async () => {
    const actor = await requireOwner()
    return { usuario: await updateUsuario(parseId((await ctx.params).id), await request.json(), actor) }
  })
}
