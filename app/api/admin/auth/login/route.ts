import { NextRequest, NextResponse } from 'next/server'
import { getAdminByEmail } from '@/lib/admin/db'
import { verifyPassword, signToken, setSessionCookie } from '@/lib/admin/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('[login] Attempt:', email)
    console.log('[login] Password received:', JSON.stringify(password))
    console.log('[login] Password length:', password?.length)

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const admin = await getAdminByEmail(email)
    console.log('[login] Admin found:', !!admin)

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('[login] Hash from DB:', admin.password_hash)

    // Test: hash the submitted password fresh and compare hashes
    const testHash = await bcrypt.hash(password, 12)
    console.log('[login] Fresh hash of submitted password:', testHash)

    const valid = await verifyPassword(password, admin.password_hash)
    console.log('[login] bcrypt.compare result:', valid)

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
