import { NextRequest } from 'next/server'
import { handle, parseId, requireOwner } from '@/lib/admin/server'
import { addPago } from '@/lib/admin/encargos'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, ctx: Ctx) {
  return handle('Add pago encargo', async () => {
    const admin = await requireOwner()
    return { pago: await addPago(parseId((await ctx.params).id), await request.json(), admin) }
  })
}
