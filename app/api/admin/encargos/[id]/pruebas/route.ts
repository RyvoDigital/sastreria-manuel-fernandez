import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { addPrueba } from '@/lib/admin/encargos'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, ctx: Ctx) {
  return handle('Add prueba', async () => {
    await requireAdmin()
    return { prueba: await addPrueba(parseId((await ctx.params).id), await request.json()) }
  })
}
