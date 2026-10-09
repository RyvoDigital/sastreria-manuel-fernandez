import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin, sinDineroDeep } from '@/lib/admin/server'
import { getEncargo, updateEncargo } from '@/lib/admin/encargos'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, ctx: Ctx) {
  return handle('Get encargo', async () => {
    const admin = await requireAdmin()
    return sinDineroDeep(admin, await getEncargo(parseId((await ctx.params).id), admin))
  })
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return handle('Update encargo', async () => {
    const admin = await requireAdmin()
    return updateEncargo(parseId((await ctx.params).id), await request.json(), admin)
  })
}
