import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { addProducto } from '@/lib/admin/encargos'

type Ctx = { params: Promise<{ id: string }> }

// A product line on an encargo: stock goes down through the ledger, no Venta is created
export async function POST(request: NextRequest, ctx: Ctx) {
  return handle('Add encargo producto', async () => {
    const admin = await requireAdmin()
    return { producto: await addProducto(parseId((await ctx.params).id), await request.json(), admin) }
  })
}
