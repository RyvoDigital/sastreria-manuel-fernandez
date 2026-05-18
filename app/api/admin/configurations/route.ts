import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import { getConfigurations, updateConfiguration } from '@/lib/admin/db'

export async function GET() {
  try {
    await requireAuth()
    const configurations = await getConfigurations()
    return NextResponse.json({ configurations })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get configurations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Configuration ID required' }, { status: 400 })
    }

    const configuration = await updateConfiguration(id, { status, notes })
    return NextResponse.json({ configuration })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update configuration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
