import { NextRequest } from 'next/server'
import { handle, parseId, requireOwner } from '@/lib/admin/server'
import { actualizar, parseLista } from '@/lib/admin/listas'

type Ctx = { params: Promise<{ lista: string; id: string }> }

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Actualizar lista', async () => {
    await requireOwner()
    const { lista, id } = await ctx.params
    return { item: await actualizar(parseLista(lista), parseId(id), await request.json()) }
  })
}
