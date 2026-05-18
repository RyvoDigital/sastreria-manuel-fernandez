import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY

export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    const stripe = new Stripe(stripeKey, {})
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const sessions = await stripe.checkout.sessions.list({
      limit,
      expand: ['data.customer', 'data.payment_intent'],
    })

    return NextResponse.json({
      payments: sessions.data.map((s) => ({
        id: s.id,
        amount: s.amount_total,
        currency: s.currency,
        status: s.payment_status,
        customer: s.customer_details?.email || s.customer_email,
        created: s.created,
        metadata: s.metadata,
      })),
    })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get payments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
