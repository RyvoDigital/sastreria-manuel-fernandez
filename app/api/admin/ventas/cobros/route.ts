import { NextRequest } from 'next/server'
import { HttpError, handle, requireAdmin, requirePropietarioData } from '@/lib/admin/server'
import { listCobros } from '@/lib/admin/ventas'

const DATE = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: NextRequest) {
  return handle('List cobros', async () => {
    requirePropietarioData(await requireAdmin())
    const sp = request.nextUrl.searchParams
    const desde = sp.get('desde') ?? ''
    const hasta = sp.get('hasta') ?? ''
    if (!DATE.test(desde) || !DATE.test(hasta)) throw new HttpError(400, 'invalid dates')
    return { cobros: await listCobros({ desde, hasta }) }
  })
}
