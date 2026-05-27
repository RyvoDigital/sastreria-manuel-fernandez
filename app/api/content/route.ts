import { NextResponse } from 'next/server'
import { getAllContent } from '@/lib/admin/db'

export async function GET() {
  try {
    const content = await getAllContent()
    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({ content: [] }, { status: 500 })
  }
}
