import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { addMaterial } from '@/lib/admin/encargos'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, ctx: Ctx) {
  return handle('Add material', async () => {
    const admin = await requireAdmin()
    return { material: await addMaterial(parseId((await ctx.params).id), await request.json(), admin) }
  })
}
