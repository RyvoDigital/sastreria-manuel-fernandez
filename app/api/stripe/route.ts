import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

const stripeLimiter = rateLimit({ name: 'stripe', maxRequests: 10, windowMs: 60_000 })

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
    const { type, courseId, courseName, price, name, email, date, time } = body

    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ error: 'Invalid or missing price' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    let session

    if (type === 'videocall') {
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
          date: date || '',
          time: time || '',
        },
        customer_email: email,
      })
    } else if (type === 'configurator') {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Acceso al Configurador de Prendas',
                description: 'Diseña tu traje a medida paso a paso',
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/configurador?success=true`,
        cancel_url: `${origin}/configurador?cancelled=true`,
        metadata: {
          type: 'configurator',
        },
      })
    } else {
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

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
