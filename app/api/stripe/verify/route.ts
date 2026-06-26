import { NextRequest, NextResponse } from 'next/server'
import { bookSlot, isSlotBooked } from '@/lib/bookings'
import { validateBookingSlot } from '@/lib/booking/date-utils'
import { sendBookingEmails } from '@/lib/booking/emails'
import { isSlotBlocked } from '@/lib/availability'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing session_id' }, { status: 400 })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ success: false, error: 'Stripe not configured' }, { status: 503 })
    }

    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(stripeKey, {})

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 })
    }

    const metadata = session.metadata || {}
    const name = metadata.name || ''
    const email = metadata.email || ''
    const phone = metadata.phone || ''
    const date = metadata.date || ''
    const time = metadata.time || ''
    const locale = metadata.locale || 'es'

    if (!name || !email || !date || !time) {
      return NextResponse.json({ success: false, error: 'Incomplete booking data' }, { status: 400 })
    }

    const slotValidation = validateBookingSlot(date, time)
    if (!slotValidation.valid) {
      return NextResponse.json(
        { success: false, error: slotValidation.error },
        { status: 400 }
      )
    }

    const alreadyBooked = await isSlotBooked(date, time)
    if (!alreadyBooked) {
      const blocked = await isSlotBlocked(date, time)
      if (blocked) {
        return NextResponse.json({ success: false, error: 'unavailable' }, { status: 409 })
      }

      const bookResult = await bookSlot({
        name,
        email,
        phone,
        date,
        time,
        type: 'videocall',
        locale,
        createdAt: new Date().toISOString(),
      })

      if (!bookResult.success) {
        return NextResponse.json({ success: false, error: bookResult.error }, { status: 409 })
      }

      await sendBookingEmails({
        name,
        email,
        phone,
        date,
        time,
        type: 'videocall',
        locale,
      })
    }

    return NextResponse.json({
      success: true,
      name,
      email,
      date,
      time,
    })
  } catch (error) {
    console.error('Stripe verify error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify session' },
      { status: 500 }
    )
  }
}