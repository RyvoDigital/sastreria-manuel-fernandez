import { NextRequest } from 'next/server'
import { handle, requireAdmin, sinDineroBody, sinDineroDeep } from '@/lib/admin/server'
import { createProducto, listProductos, type ProductoFilters } from '@/lib/admin/inventario'

export async function GET(request: NextRequest) {
  return handle('List productos', async () => {
    const admin = await requireAdmin()
    const sp = request.nextUrl.searchParams
    const tipo = sp.get('tipo')
    const alerta = sp.get('alerta')
    const productos = await listProductos({
      q: sp.get('q')?.trim() || undefined,
      categoria: Number(sp.get('categoria')) || undefined,
      proveedor: Number(sp.get('proveedor')) || undefined,
      tipo: tipo === 'terminado' || tipo === 'material' ? tipo : undefined,
      alerta: ['bajo', 'agotado', 'cualquiera'].includes(alerta ?? '') ? (alerta as ProductoFilters['alerta']) : undefined,
      archivados: sp.get('archivados') === '1',
      offset: Number(sp.get('offset')) || 0,
    })
    return sinDineroDeep(admin, { productos })
  })
}

export async function POST(request: NextRequest) {
  return handle('Create producto', async () => {
    const admin = await requireAdmin()
    return sinDineroDeep(admin, { producto: await createProducto(sinDineroBody(admin, await request.json()), admin) })
  })
}
