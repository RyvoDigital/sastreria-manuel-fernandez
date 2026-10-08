import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { createDevolucion } from '@/lib/admin/ventas'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, ctx: Ctx) {
  return handle('Create devolucion', async () => {
    const admin = await requireAdmin()
    return { devolucion: await createDevolucion(parseId((await ctx.params).id), await request.json(), admin) }
  })
}
