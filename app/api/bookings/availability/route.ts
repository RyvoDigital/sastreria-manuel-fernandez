import { NextRequest, NextResponse } from 'next/server'
import { getBlockedTimes } from '@/lib/availability'
import { getTakenTimes } from '@/lib/booking/slots'
import { normalizeDateString, normalizeTimeSlot } from '@/lib/booking/date-utils'

// Always read fresh (the handler reads the request, so it is never prerendered), and tell
// browsers and the CDN not to keep it: a cached answer would offer a time someone just booked.
const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' }

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ success: false, error: 'Missing date' }, { status: 400, headers: NO_STORE })
    }

    const [taken, blocked] = await Promise.all([
      getTakenTimes(date),
      getBlockedTimes(date),
    ])

    return NextResponse.json(
      {
        success: true,
        date: normalizeDateString(date),
        // Booked, or held while someone pays for a video call
        bookedTimes: taken,
        blockedTimes: blocked.map((t) => normalizeTimeSlot(t)),
      },
      { headers: NO_STORE }
    )
  } catch (err) {
    console.error('Availability API error:', err)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500, headers: NO_STORE })
  }
}
