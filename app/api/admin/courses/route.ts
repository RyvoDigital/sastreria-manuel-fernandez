import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import { getCourses, createCourse, updateCourse, deleteCourse } from '@/lib/admin/db'

export async function GET() {
  try {
    await requireAuth()
    const courses = await getCourses()
    return NextResponse.json({ courses })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get courses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const course = await createCourse(body)
    return NextResponse.json({ course })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Create course error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { id, ...data } = body
    if (!id) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 })
    }
    const course = await updateCourse(id, data)
    return NextResponse.json({ course })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update course error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 })
    }
    await deleteCourse(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Delete course error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
