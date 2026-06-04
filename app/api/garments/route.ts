import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(
      `SELECT id, name, slug, thumbnail_url, description FROM garments WHERE is_active = TRUE ORDER BY sort_order, created_at`
    )
    return NextResponse.json({ garments: result.rows })
  } catch (error) {
    console.error('Get public garments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
