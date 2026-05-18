import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import { getDashboardStats } from '@/lib/admin/db'

export async function GET() {
  try {
    await requireAuth()
    const stats = await getDashboardStats()
    return NextResponse.json({ stats })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
