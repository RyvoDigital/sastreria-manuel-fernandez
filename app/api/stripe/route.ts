import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'Stripe not configured. Add STRIPE_SECRET_KEY to your environment variables.' },
        { status: 503 }
      )
    }

    // Dynamic import to avoid build-time Stripe initialization
    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2026-04-22.dahlia',
    })

    const body = await req.json()
    const { courseId, courseName, price } = body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: courseName || 'Curso de Sastrería',
              description: 'Acceso completo al curso de sastrería artesanal',
            },
            unit_amount: price || 9900,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin') || 'http://localhost:3000'}/cursos?success=true`,
      cancel_url: `${req.headers.get('origin') || 'http://localhost:3000'}/cursos?cancelled=true`,
      metadata: {
        courseId: courseId || 'default',
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
