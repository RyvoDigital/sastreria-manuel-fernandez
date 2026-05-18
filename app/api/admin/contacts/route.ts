import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import { getContacts, markContactRead } from '@/lib/admin/db'

export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    const { searchParams } = new URL(request.url)
    const filters = {
      read: searchParams.has('read') ? searchParams.get('read') === 'true' : undefined,
      type: searchParams.get('type') || undefined,
    }
    const contacts = await getContacts(filters)
    return NextResponse.json({ contacts })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get contacts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Contact ID required' }, { status: 400 })
    }

    const contact = await markContactRead(id)
    return NextResponse.json({ contact })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
