import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import { getSettings, updateSetting } from '@/lib/admin/db'

export async function GET() {
  try {
    await requireAuth()
    const settings = await getSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { settings } = body

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: 'Settings array required' }, { status: 400 })
    }

    for (const s of settings) {
      await updateSetting(s.id, { enabled: s.enabled, price: s.price })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
