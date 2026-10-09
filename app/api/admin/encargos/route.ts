import { NextRequest } from 'next/server'
import { handle, requireAdmin, sinDineroDeep } from '@/lib/admin/server'
import { createEncargo, listEncargos } from '@/lib/admin/encargos'

export async function GET(request: NextRequest) {
  return handle('List encargos', async () => {
    const admin = await requireAdmin()
    const sp = request.nextUrl.searchParams
    const encargos = await listEncargos({
      q: sp.get('q')?.trim() || undefined,
      estado: sp.get('estado') || undefined,
      tipo: sp.get('tipo') || undefined,
      sastre: Number(sp.get('sastre')) || undefined,
      pendientePago: sp.get('pendiente') === '1',
      abiertos: sp.get('abiertos') === '1',
    })
    return sinDineroDeep(admin, { encargos })
  })
}

export async function POST(request: NextRequest) {
  return handle('Create encargo', async () => {
    const admin = await requireAdmin()
    return { encargo: await createEncargo(await request.json(), admin) }
  })
}
