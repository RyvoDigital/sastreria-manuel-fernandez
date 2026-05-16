import { NextRequest, NextResponse } from 'next/server'
import { getBookedSlots } from '@/lib/bookings'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ success: false, error: 'Missing date' }, { status: 400 })
    }

    const booked = await getBookedSlots(date)
    return NextResponse.json({
      success: true,
      date,
      bookedTimes: booked.map((b) => b.time),
    })
  } catch (err) {
    console.error('Availability API error:', err)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
