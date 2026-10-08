import { NextRequest } from 'next/server'
import { HttpError, handle, requireAdmin } from '@/lib/admin/server'
import { informeMovimientos, informeStock, informeValoracion, informeVentas, panelKpis, type Filtros } from '@/lib/admin/informes'
import { getAlertas } from '@/lib/admin/inventario'

type Ctx = { params: Promise<{ informe: string }> }

export async function GET(request: NextRequest, ctx: Ctx) {
  return handle('Informe', async () => {
    await requireAdmin()
    const { informe } = await ctx.params
    const sp = request.nextUrl.searchParams
    const tipo = sp.get('tipo')
    const f: Filtros = {
      tipo: tipo === 'terminado' || tipo === 'material' ? tipo : undefined,
      categoria: Number(sp.get('categoria')) || undefined,
      desde: sp.get('desde') ?? undefined,
      hasta: sp.get('hasta') ?? undefined,
      tipoMovimiento: sp.get('movimiento') || undefined,
      usuario: Number(sp.get('usuario')) || undefined,
      agrupar: sp.get('agrupar') ?? undefined,
      conStock: sp.get('conStock') === '1',
    }
    switch (informe) {
      case 'stock': return { rows: await informeStock(f) }
      case 'valoracion': return { rows: await informeValoracion(f) }
      case 'movimientos': return { rows: await informeMovimientos(f) }
      case 'ventas': return informeVentas(f)
      case 'alertas': return { rows: (await getAlertas(100000)).items }
      case 'panel': return panelKpis()
      default: throw new HttpError(404, 'not found')
    }
  })
}
