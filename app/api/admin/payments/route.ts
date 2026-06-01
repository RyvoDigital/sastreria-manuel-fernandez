import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import { getPayments } from '@/lib/admin/db'

export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    const payments = await getPayments()

    return NextResponse.json({
      payments: payments.map((p: Record<string, unknown>) => ({
        id: p.stripe_session_id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        customer: p.customer_email,
        created: Math.floor(new Date(p.created_at as string).getTime() / 1000),
        metadata: (p.metadata as Record<string, string>) || {},
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
