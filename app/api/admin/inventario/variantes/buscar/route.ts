import { NextRequest } from 'next/server'
import { handle, requireAdmin, sinDineroDeep } from '@/lib/admin/server'
import { buscarVariantes } from '@/lib/admin/inventario'

export async function GET(request: NextRequest) {
  return handle('Buscar variantes', async () => {
    const admin = await requireAdmin()
    const sp = request.nextUrl.searchParams
    const tipo = sp.get('tipo')
    return sinDineroDeep(admin, {
      variantes: await buscarVariantes(sp.get('q')?.trim() ?? '', {
        tipo: tipo === 'terminado' || tipo === 'material' ? tipo : undefined,
      }),
    })
  })
}
