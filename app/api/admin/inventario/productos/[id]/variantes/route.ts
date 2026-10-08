import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { addVariantes } from '@/lib/admin/inventario'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, ctx: Ctx) {
  return handle('Add variantes', async () => {
    const admin = await requireAdmin()
    const body = await request.json()
    return { variantes: await addVariantes(parseId((await ctx.params).id), body.variantes, admin) }
  })
}
