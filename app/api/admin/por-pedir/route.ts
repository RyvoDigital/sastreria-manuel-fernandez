import { NextRequest } from 'next/server'
import { handle, requireAdmin } from '@/lib/admin/server'
import { crearPorPedir, listPorPedir } from '@/lib/admin/por-pedir'

export async function GET(request: NextRequest) {
  return handle('List por pedir', async () => {
    await requireAdmin()
    return { items: await listPorPedir({ abiertos: request.nextUrl.searchParams.get('todos') !== '1' }) }
  })
}

export async function POST(request: NextRequest) {
  return handle('Create por pedir', async () => {
    const admin = await requireAdmin()
    return { item: await crearPorPedir(await request.json(), admin) }
  })
}
