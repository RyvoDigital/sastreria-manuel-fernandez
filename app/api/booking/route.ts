import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { bookSlot, isSlotBooked } from '@/lib/bookings'
import { validateBookingSlot } from '@/lib/booking/date-utils'
import { sendBookingEmails } from '@/lib/booking/emails'
import { isSlotBlocked } from '@/lib/availability'
import { query } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'

const bookingLimiter = rateLimit({ name: 'booking', maxRequests: 3, windowMs: 60_000 })

const bookingSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(1).max(50),
  date: z.string().min(1),
  time: z.string().min(1),
  type: z.enum(['inperson', 'videocall']).default('inperson'),
  locale: z.string().max(10).optional(),
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

    const { name, email, phone, date, time, type, locale } = parsed.data
    const loc = locale || 'es'

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
    })

    return NextResponse.json({
      success: true,
      bookingId: bookResult.bookingId,
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

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, email, date, time } = body

    let result
    if (id) {
      result = await query(
        `DELETE FROM bookings WHERE id = $1 RETURNING *`,
        [id]
      )
    } else if (email && date && time) {
      result = await query(
        `DELETE FROM bookings WHERE email = $1 AND date = $2 AND time = $3 RETURNING *`,
        [email, date, time]
      )
    } else {
      return NextResponse.json(
        { success: false, error: 'Booking id or email/date/time required' },
        { status: 400 }
      )
    }

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, booking: result.rows[0] })
  } catch (err) {
    console.error('Booking delete error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}