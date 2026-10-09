import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { programarEntrega } from '@/lib/admin/encargos'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, ctx: Ctx) {
  return handle('Programar entrega', async () => {
    await requireAdmin()
    return { cita: await programarEntrega(parseId((await ctx.params).id), await request.json()) }
  })
}
