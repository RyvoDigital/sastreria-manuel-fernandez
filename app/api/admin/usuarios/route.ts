import { NextRequest } from 'next/server'
import { handle, requireAdmin, requireOwner } from '@/lib/admin/server'
import { createUsuario, listUsuarios } from '@/lib/admin/usuarios'

export async function GET() {
  return handle('List usuarios', async () => {
    const me = await requireAdmin()
    return { usuarios: await listUsuarios(), me }
  })
}

export async function POST(request: NextRequest) {
  return handle('Create usuario', async () => {
    await requireOwner()
    return { usuario: await createUsuario(await request.json()) }
  })
}
