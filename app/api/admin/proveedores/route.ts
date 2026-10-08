import { NextRequest } from 'next/server'
import { handle, requireAdmin } from '@/lib/admin/server'
import { createProveedor, listProveedores } from '@/lib/admin/proveedores'

export async function GET(request: NextRequest) {
  return handle('List proveedores', async () => {
    await requireAdmin()
    const sp = request.nextUrl.searchParams
    return { proveedores: await listProveedores({ q: sp.get('q')?.trim() || undefined, archivados: sp.get('archivados') === '1' }) }
  })
}

export async function POST(request: NextRequest) {
  return handle('Create proveedor', async () => {
    await requireAdmin()
    return { proveedor: await createProveedor(await request.json()) }
  })
}
