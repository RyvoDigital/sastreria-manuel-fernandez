import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import { getCustomers, upsertCustomerNote } from '@/lib/admin/db'

export async function GET() {
  try {
    await requireAuth()
    const customers = await getCustomers()
    return NextResponse.json({ customers })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get customers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { email, name, notes, measurements } = body

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const customer = await upsertCustomerNote({ email, name, notes, measurements })
    return NextResponse.json({ customer })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Upsert customer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
