import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { findHoldSession, isHoldTokenShape, releaseHold } from '@/lib/booking/slots'

const releaseLimiter = rateLimit({ name: 'stripe-release', maxRequests: 10, windowMs: 60_000 })

/*
 * The client came back from Stripe without paying (Checkout's cancel link
 * carries the hold token). Free the video-call slot now instead of waiting for
 * the hold to expire, and close the Checkout session so it can't be paid later.
 * Only the hold token, which only that client was sent, releases anything.
 */
export async function POST(req: NextRequest) {
  const limit = releaseLimiter(req)
  if (!limit.success) {
    return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const { token } = body as { token?: unknown }
  if (!isHoldTokenShape(token)) {
    return NextResponse.json({ success: false, error: 'invalid_token' }, { status: 400 })
  }

  try {
    const sessionId = await findHoldSession(token)
    if (sessionId === undefined) return NextResponse.json({ success: true }) // already released or booked
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (sessionId && stripeKey) {
      const { default: Stripe } = await import('stripe')
      const stripe = new Stripe(stripeKey, {})
      // Close the session first. If it was paid after all (another tab), keep the hold:
      // the webhook or the success page turns it into the booking.
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      if (session.status === 'complete') return NextResponse.json({ success: true })
      if (session.status === 'open') await stripe.checkout.sessions.expire(sessionId)
    }
    await releaseHold(token)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Stripe hold release error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
