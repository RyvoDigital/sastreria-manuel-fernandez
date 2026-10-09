import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { addMedidas, deleteMedidas } from '@/lib/admin/clientes'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, ctx: Ctx) {
  return handle('Add medidas', async () => {
    const admin = await requireAdmin()
    return { medidas: await addMedidas(parseId((await ctx.params).id), await request.json(), admin) }
  })
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  return handle('Delete medidas', async () => {
    await requireAdmin()
    const medidasId = parseId(request.nextUrl.searchParams.get('medidasId') ?? '')
    await deleteMedidas(parseId((await ctx.params).id), medidasId)
    return { success: true }
  })
}
