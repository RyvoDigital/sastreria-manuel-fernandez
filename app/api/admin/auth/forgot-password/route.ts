import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { getAdminByEmail } from '@/lib/admin/db'
import { Resend } from 'resend'

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || 'fallback-secret-change-me'
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const admin = await getAdminByEmail(email)
    if (!admin) {
      // Don't reveal whether email exists
      return NextResponse.json({ success: true })
    }

    const token = await new SignJWT({ email: admin.email, purpose: 'reset' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(SECRET)

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/reset-password?token=${token}`

    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const resend = new Resend(apiKey)
      const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'

      await resend.emails.send({
        from: fromEmail,
        to: admin.email,
        subject: 'Password Reset — Sastrería Admin',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:2rem;color:#222">
            <h2 style="color:#0A1628">Password Reset Request</h2>
            <p>Click the link below to reset your admin password. This link expires in 15 minutes.</p>
            <a href="${resetUrl}" style="display:inline-block;margin:1rem 0;padding:0.75rem 1.5rem;background:#C9A84C;color:#0A1628;text-decoration:none;border-radius:6px;font-weight:500">Reset Password</a>
            <p style="color:#666;font-size:0.9rem">If you did not request this, you can safely ignore this email.</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
