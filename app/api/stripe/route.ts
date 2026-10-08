import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { createPayment, getSettings } from '@/lib/admin/db'
import { isSlotBooked } from '@/lib/bookings'
import { isSlotBlocked } from '@/lib/availability'
import { validateBookingSlot } from '@/lib/booking/date-utils'
import { areCoursePurchasesOpen } from '@/lib/course-purchases-server'

const stripeLimiter = rateLimit({ name: 'stripe', maxRequests: 10, windowMs: 60_000 })

/**
 * What to charge, in cents, decided here and never taken from the browser.
 * Prices are the admin settings in euros: `cursos-<id>` for one course, else
 * `cursos`, and `videollamada` for a video call. The fallbacks match what
 * the site displays when settings cannot be read (CursosList, ContactPage).
 */
async function priceInCents(type: unknown, courseId: unknown): Promise<number> {
  let settings: { id: string; price: number | string | null }[] = []
  try {
    settings = await getSettings()
  } catch (err) {
    console.error('Stripe: could not read prices from settings, using defaults', err)
  }
  const euros = (id: string) => {
    const value = Number(settings.find((s) => s.id === id)?.price)
    return Number.isFinite(value) && value > 0 ? value : null
  }

  const amount =
    type === 'videocall'
      ? euros('videollamada') ?? 50
      : (typeof courseId === 'string' ? euros(`cursos-${courseId}`) : null) ?? euros('cursos') ?? 350
  return Math.round(amount * 100)
}

export async function POST(req: NextRequest) {
  const limit = stripeLimiter(req)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'Stripe not configured. Add STRIPE_SECRET_KEY to your environment variables.' },
        { status: 503 }
      )
    }

    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(stripeKey, {

    })

    const body = await req.json()
    // Any `price` in the body is ignored: the amount is looked up server-side.
    const { type, courseId, courseName, name, email, phone, date, time } = body
    const price = await priceInCents(type, courseId)

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    let session

    if (type === 'videocall') {
      if (!date || !time || !email || !name) {
        return NextResponse.json({ error: 'Missing booking details' }, { status: 400 })
      }

      const slotValidation = validateBookingSlot(date, time)
      if (!slotValidation.valid) {
        return NextResponse.json({ error: slotValidation.error }, { status: 400 })
      }

      if (await isSlotBlocked(date, time)) {
        return NextResponse.json({ error: 'unavailable' }, { status: 409 })
      }

      if (await isSlotBooked(date, time)) {
        return NextResponse.json({ error: 'conflict' }, { status: 409 })
      }

      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Videollamada de Asesoría',
                description: `Consulta personalizada de sastrería - ${date} a las ${time}`,
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/contacto?videocall_success=1&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/contacto?videocall_cancelled=1`,
        metadata: {
          type: 'videocall',
          name: name || '',
          email: email || '',
          phone: phone || '',
          date: date || '',
          time: time || '',
          locale: body.locale || 'es',
        },
        customer_email: email,
      })
    } else {
      if (!(await areCoursePurchasesOpen())) {
        return NextResponse.json({ error: 'course_purchases_closed' }, { status: 403 })
      }
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: courseName || 'Curso de Sastrería',
                description: 'Acceso completo al curso de sastrería artesanal',
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/cursos?success=true`,
        cancel_url: `${origin}/cursos?cancelled=true`,
        metadata: {
          type: 'course',
          courseId: courseId || 'default',
        },
      })
    }

    // Record payment in local DB
    try {
      await createPayment({
        stripeSessionId: session.id,
        amount: price,
        currency: 'eur',
        status: 'pending',
        type: type || 'course',
        customerEmail: email || null,
        customerName: name || null,
        metadata: { courseId, date, time },
      })
    } catch (dbErr) {
      console.error('Failed to record payment:', dbErr)
      // Non-critical: don't fail checkout if DB insert fails
    }

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
