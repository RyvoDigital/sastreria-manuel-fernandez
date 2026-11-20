import { NextRequest } from 'next/server'
import { handle, parseId, requireAdmin } from '@/lib/admin/server'
import { createFestivo, deleteFestivo, listFestivos } from '@/lib/admin/festivos'

// Horarios → Festivos. Propietarios and Empleados (like the rest of Horarios); never the Taller login.

export async function GET() {
  return handle('List festivos', async () => {
    await requireAdmin()
    return { festivos: await listFestivos() }
  })
}

export async function POST(request: NextRequest) {
  return handle('Create festivo', async () => {
    const admin = await requireAdmin()
    return createFestivo(await request.json(), admin)
  })
}

export async function DELETE(request: NextRequest) {
  return handle('Delete festivo', async () => {
    await requireAdmin()
    return deleteFestivo(parseId(new URL(request.url).searchParams.get('id') ?? ''))
  })
}
