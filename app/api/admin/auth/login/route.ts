import { NextRequest, NextResponse } from 'next/server'
import { getAdminByEmail } from '@/lib/admin/db'
import { verifyPassword, signToken, setSessionCookie } from '@/lib/admin/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('[login] Attempt:', email)

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const admin = await getAdminByEmail(email)
    console.log('[login] Admin found:', !!admin)

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('[login] Hash length:', admin.password_hash?.length)
    console.log('[login] Hash prefix:', admin.password_hash?.substring(0, 30))

    const valid = await verifyPassword(password, admin.password_hash)
    console.log('[login] Password valid:', valid)

    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    })

    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error('[login] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
