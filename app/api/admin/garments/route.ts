import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import { getGarments, createGarment, updateGarment, deleteGarment } from '@/lib/admin/db'

export async function GET() {
  try {
    await requireAuth()
    const garments = await getGarments()
    return NextResponse.json({ garments })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get garments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const garment = await createGarment(body)
    return NextResponse.json({ garment })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Create garment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { id, ...data } = body
    if (!id) {
      return NextResponse.json({ error: 'Garment ID required' }, { status: 400 })
    }
    const garment = await updateGarment(Number(id), data)
    return NextResponse.json({ garment })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update garment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Garment ID required' }, { status: 400 })
    }
    await deleteGarment(Number(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Delete garment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
