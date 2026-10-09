import { NextRequest } from 'next/server'
import { handle, requireAdmin, requireOwner } from '@/lib/admin/server'
import { crear, listar, parseLista } from '@/lib/admin/listas'

type Ctx = { params: Promise<{ lista: string }> }

export async function GET(_request: NextRequest, ctx: Ctx) {
  return handle('Listar', async () => {
    await requireAdmin()
    return { items: await listar(parseLista((await ctx.params).lista)) }
  })
}

export async function POST(request: NextRequest, ctx: Ctx) {
  return handle('Crear en lista', async () => {
    await requireOwner()
    return { item: await crear(parseLista((await ctx.params).lista), await request.json()) }
  })
}
