import { NextRequest } from 'next/server'
import { handle, parseId, requireOwner } from '@/lib/admin/server'
import { deletePago } from '@/lib/admin/encargos'

type Ctx = { params: Promise<{ id: string; pid: string }> }

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  return handle('Delete pago encargo', async () => {
    await requireOwner()
    const { id, pid } = await ctx.params
    await deletePago(parseId(id), parseId(pid))
    return { ok: true }
  })
}
