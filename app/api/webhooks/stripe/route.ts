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

  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    } else {
      event = JSON.parse(payload)
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Record<string, unknown>
    const metadata = (session.metadata || {}) as Record<string, string>

    try {
      await updatePaymentBySessionId(session.id as string, {
        status: 'paid',
        stripePaymentIntentId: (session.payment_intent as string) || undefined,
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