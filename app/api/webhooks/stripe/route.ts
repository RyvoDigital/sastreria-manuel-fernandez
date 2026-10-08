import { NextRequest, NextResponse } from 'next/server'
import { bookSlot, isSlotBooked } from '@/lib/bookings'
import { updatePaymentBySessionId } from '@/lib/admin/db'
import { sendBookingEmails } from '@/lib/booking/emails'
import { isSlotBlocked } from '@/lib/availability'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const { default: Stripe } = await import('stripe')
  const stripe = new Stripe(stripeKey, {})

  // Every event must carry a valid Stripe signature. Without one, anyone could
  // POST a fake checkout.session.completed and mark a payment as paid or book
  // a slot. If the secret is missing the endpoint refuses with 503 rather than
  // trusting the body; Stripe retries failed deliveries for up to three days,
  // so events sent before the secret is configured are not lost.
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!endpointSecret) {
    console.error('Stripe webhook rejected: STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const payload = await req.text()

  let event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const metadata: Record<string, string> = session.metadata || {}
    const paymentIntent =
      typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id

    try {
      await updatePaymentBySessionId(session.id, {
        status: 'paid',
        stripePaymentIntentId: paymentIntent || undefined,
      })
    } catch (dbErr) {
      console.error('Failed to update payment status:', dbErr)
    }

    if (metadata.type === 'videocall') {
      const name = metadata.name || ''
      const email = metadata.email || ''
      const phone = metadata.phone || ''
      const date = metadata.date || ''
      const time = metadata.time || ''
      const locale = metadata.locale || 'es'

      if (name && email && date && time) {
        const alreadyBooked = await isSlotBooked(date, time)
        if (!alreadyBooked) {
          const blocked = await isSlotBlocked(date, time)
          if (!blocked) {
            await bookSlot({
              name,
              email,
              phone,
              date,
              time,
              type: 'videocall',
              locale,
              createdAt: new Date().toISOString(),
            })

            await sendBookingEmails({
              name,
              email,
              phone,
              date,
              time,
              type: 'videocall',
              locale,
            })
          } else {
            console.error('Webhook: attempted booking on blocked slot', { date, time })
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}