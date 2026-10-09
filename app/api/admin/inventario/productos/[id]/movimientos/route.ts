import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin, sinDineroDeep } from '@/lib/admin/server'
import { getMovimientos } from '@/lib/admin/inventario'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, ctx: Ctx) {
  return handle('Get movimientos', async () => {
    const admin = await requireAdmin()
    const sp = request.nextUrl.searchParams
    const movimientos = await getMovimientos(parseId((await ctx.params).id), {
      varianteId: Number(sp.get('variante')) || undefined,
      offset: Number(sp.get('offset')) || 0,
    })
    return sinDineroDeep(admin, { movimientos })
  })
}
