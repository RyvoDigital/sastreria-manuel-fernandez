import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import { getAllContent, setContent } from '@/lib/admin/db'

export async function GET() {
  try {
    await requireAuth()
    const content = await getAllContent()
    return NextResponse.json({ content })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get content error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { id, value } = body

    if (!id || value === undefined) {
      return NextResponse.json({ error: 'ID and value required' }, { status: 400 })
    }

    const content = await setContent(id, value)
    return NextResponse.json({ content })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update content error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
