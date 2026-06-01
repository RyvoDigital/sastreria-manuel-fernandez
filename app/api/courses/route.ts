import { NextResponse } from 'next/server'
import { getCourses } from '@/lib/admin/db'

export async function GET() {
  try {
    const courses = await getCourses()
    return NextResponse.json({ courses: courses.filter((c: Record<string, unknown>) => c.enabled !== false) })
  } catch {
    return NextResponse.json({ courses: [] }, { status: 500 })
  }
}
