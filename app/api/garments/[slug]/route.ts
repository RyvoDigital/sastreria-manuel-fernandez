import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const result = await query(
      `SELECT id, name, slug, thumbnail_url, description FROM garments WHERE slug = $1 AND is_active = TRUE`,
      [slug]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Garment not found' }, { status: 404 })
    }
    return NextResponse.json({ garment: result.rows[0] })
  } catch (error) {
    console.error('Get garment by slug error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
