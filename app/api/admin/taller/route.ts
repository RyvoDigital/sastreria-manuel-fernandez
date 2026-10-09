import { handle, requireAdmin } from '@/lib/admin/server'
import { tallerBoard } from '@/lib/admin/encargos'

// The only gestión route a Taller login can use: names, garments, states, dates and tailors only
export async function GET() {
  return handle('Taller board', async () => {
    await requireAdmin({ taller: true })
    return tallerBoard()
  })
}
