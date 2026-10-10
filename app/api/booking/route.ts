import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { bookSlot, cancelBookingByToken, isCancelTokenShape, isSlotBooked } from '@/lib/bookings'
import { validateBookingSlot } from '@/lib/booking/date-utils'
import { sendBookingEmails } from '@/lib/booking/emails'
import { isSlotBlocked } from '@/lib/availability'
import { rateLimit } from '@/lib/rate-limit'
import { checkSpam } from '@/lib/spam-filter'
import { isEmailReachable } from '@/lib/email-validate'

const bookingLimiter = rateLimit({ name: 'booking', maxRequests: 3, windowMs: 60_000 })
const cancelLimiter = rateLimit({ name: 'booking-cancel', maxRequests: 10, windowMs: 60_000 })

const bookingSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(1).max(50),
  date: z.string().min(1),
  time: z.string().min(1),
  type: z.enum(['inperson', 'videocall']).default('inperson'),
  locale: z.string().max(10).optional(),
  website: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
})

export async function POST(req: NextRequest) {
  const limit = bookingLimiter(req)
  if (!limit.success) {
    return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const parsed = bookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, phone, date, time, type, locale, website, company } = parsed.data
    const loc = locale || 'es'

    const spam = checkSpam({ name, email, phone, website, company })
    if (spam.spam) {
      console.warn('Booking spam blocked:', { email, reasons: spam.reasons })
      return NextResponse.json({ success: true, filtered: true })
    }

    const reach = await isEmailReachable(email)
    if (!reach.ok) {
      console.warn('Booking email not reachable:', { email, reason: reach.reason })
      return NextResponse.json(
        { success: false, error: 'Please use a valid email address we can reply to.' },
        { status: 400 }
      )
    }

    const slotValidation = validateBookingSlot(date, time)
    if (!slotValidation.valid) {
      return NextResponse.json(
        { success: false, error: slotValidation.error },
        { status: 400 }
      )
    }

    const blocked = await isSlotBlocked(date, time)
    if (blocked) {
      return NextResponse.json(
        { success: false, error: 'unavailable' },
        { status: 409 }
      )
    }

    const alreadyBooked = await isSlotBooked(date, time)
    if (alreadyBooked) {
      return NextResponse.json(
        { success: false, error: 'conflict' },
        { status: 409 }
      )
    }

    const bookResult = await bookSlot({
      name,
      email,
      phone,
      date,
      time,
      type,
      locale,
      createdAt: new Date().toISOString(),
    })

    if (!bookResult.success) {
      return NextResponse.json(
        { success: false, error: 'conflict' },
        { status: 409 }
      )
    }

    const { ownerId, clientId } = await sendBookingEmails({
      name,
      email,
      phone,
      date,
      time,
      type,
      locale: loc,
      cancelToken: bookResult.cancelToken,
    })

    return NextResponse.json({
      success: true,
      bookingId: bookResult.bookingId,
      cancelToken: bookResult.cancelToken,
      ownerId,
      clientId,
    })
  } catch (err) {
    console.error('Booking API error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/*
 * Public cancellation. Only the booking's cancel token, which only the person
 * who booked has (booking response, confirmation email), can cancel it. A
 * booking number, or an email with a date and time, is refused: anyone could
 * guess those. The admin cancels through /api/admin/bookings, behind its login.
 */
export async function DELETE(req: NextRequest) {
  const limit = cancelLimiter(req)
  if (!limit.success) {
    return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { token } = body as { token?: unknown }

    if (!isCancelTokenShape(token)) {
      return NextResponse.json(
        { success: false, error: 'cancel_token_required' },
        { status: 403 }
      )
    }

    const result = await cancelBookingByToken(token)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error === 'paid_booking' ? 409 : 404 }
      )
    }

    return NextResponse.json({ success: true, booking: { date: result.booking.date, time: result.booking.time } })
  } catch (err) {
    console.error('Booking cancel error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
