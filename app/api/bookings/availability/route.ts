import { NextRequest, NextResponse } from 'next/server'
import { getBookedSlots } from '@/lib/bookings'
import { getBlockedTimes } from '@/lib/availability'
import { normalizeDateString, normalizeTimeSlot } from '@/lib/booking/date-utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ success: false, error: 'Missing date' }, { status: 400 })
    }

    const [booked, blocked] = await Promise.all([
      getBookedSlots(date),
      getBlockedTimes(date),
    ])

    return NextResponse.json({
      success: true,
      date: normalizeDateString(date),
      bookedTimes: booked.map((b) => normalizeTimeSlot(b.time)),
      blockedTimes: blocked.map((t) => normalizeTimeSlot(t)),
    })
  } catch (err) {
    console.error('Availability API error:', err)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
