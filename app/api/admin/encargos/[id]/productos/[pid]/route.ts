import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { quitarProducto } from '@/lib/admin/encargos'

type Ctx = { params: Promise<{ id: string; pid: string }> }

// Removes the line; if it had taken stock, the stock goes back
export async function DELETE(_request: NextRequest, ctx: Ctx) {
  return handle('Remove encargo producto', async () => {
    const admin = await requireAdmin()
    const { id, pid } = await ctx.params
    return quitarProducto(parseId(id), parseId(pid), admin)
  })
}
