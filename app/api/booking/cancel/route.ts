import { NextRequest, NextResponse } from 'next/server'
import { findBookingByCancelToken, isCancelTokenShape } from '@/lib/bookings'
import { rateLimit } from '@/lib/rate-limit'

const lookupLimiter = rateLimit({ name: 'booking-cancel-lookup', maxRequests: 20, windowMs: 60_000 })

/*
 * Which booking a cancel token belongs to, so /cancelar-cita can show the date
 * and time before the visitor confirms. Looking up never cancels; the
 * cancellation itself is DELETE /api/booking with the same token. POST, so the
 * token travels in the body and never in a URL or a server log.
 */
export async function POST(req: NextRequest) {
  const limit = lookupLimiter(req)
  if (!limit.success) {
    return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const { token } = body as { token?: unknown }
  if (!isCancelTokenShape(token)) {
    return NextResponse.json({ success: false, error: 'cancel_token_required' }, { status: 403 })
  }

  try {
    const booking = await findBookingByCancelToken(token)
    if (!booking) return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 })
    return NextResponse.json({ success: true, booking: { date: booking.date, time: booking.time, type: booking.type } })
  } catch (err) {
    console.error('Booking cancel lookup error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
