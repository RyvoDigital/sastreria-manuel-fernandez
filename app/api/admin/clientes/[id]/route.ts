import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin, requirePropietarioData } from '@/lib/admin/server'
import { getCliente, updateCliente } from '@/lib/admin/clientes'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, ctx: Ctx) {
  return handle('Get cliente', async () => {
    const admin = await requireAdmin()
    return getCliente(parseId((await ctx.params).id), admin)
  })
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update cliente', async () => {
    requirePropietarioData(await requireAdmin())
    return { cliente: await updateCliente(parseId((await ctx.params).id), await request.json()) }
  })
}
