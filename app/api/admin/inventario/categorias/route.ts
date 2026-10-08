import { NextRequest } from 'next/server'
import { handle, requireAdmin } from '@/lib/admin/server'
import { createCategoria, listCategorias } from '@/lib/admin/inventario'

export async function GET() {
  return handle('List categorias', async () => {
    await requireAdmin()
    return { categorias: await listCategorias() }
  })
}

export async function POST(request: NextRequest) {
  return handle('Create categoria', async () => {
    await requireAdmin()
    return { categoria: await createCategoria(await request.json()) }
  })
}
