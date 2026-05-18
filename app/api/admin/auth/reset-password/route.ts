import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { hashPassword } from '@/lib/admin/auth'
import { getAdminByEmail, updateAdminPassword } from '@/lib/admin/db'

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || 'fallback-secret-change-me'
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    let payload
    try {
      const verified = await jwtVerify(token, SECRET, { clockTolerance: 60 })
      payload = verified.payload as { email: string; purpose: string }
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    if (payload.purpose !== 'reset') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    const admin = await getAdminByEmail(payload.email)
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    const newHash = await hashPassword(newPassword)
    await updateAdminPassword(payload.email, newHash)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
