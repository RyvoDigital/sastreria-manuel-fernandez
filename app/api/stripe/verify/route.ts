import { NextRequest, NextResponse } from 'next/server'
import { bookPaidVideocall } from '@/lib/bookings'
import { validateBookingSlot } from '@/lib/booking/date-utils'
import { sendBookingEmails } from '@/lib/booking/emails'

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

    // The slot was held for this session while the client paid. The webhook may have booked it
    // already: only the first of the two creates the booking and sends the emails.
    const result = await bookPaidVideocall({
      name,
      email,
      phone,
      date,
      time,
      type: 'videocall',
      locale,
      createdAt: new Date().toISOString(),
      stripeSessionId: session.id,
      holdToken: metadata.hold || null,
    })

    if (!result.ok) {
      console.error('Stripe verify: paid video call could not be booked, the slot is taken', { date, time, session: session.id })
      return NextResponse.json({ success: false, error: result.error }, { status: 409 })
    }

    if (result.created) {
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