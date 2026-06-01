import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import { query } from '@/lib/db'
import { updateBookingReminder } from '@/lib/admin/db'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    const result = await query(
      `SELECT * FROM bookings WHERE id = $1`,
      [bookingId]
    )
    const booking = result.rows[0]
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
    }

    const resend = new Resend(apiKey)
    const ownerEmail = process.env.CONTACT_EMAIL || 'sastreriamanuelfernandez@gmail.com'
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'
    const { name, email, date, time, type } = booking
    const loc = booking.locale || 'es'

    const subjectMap: Record<string, string> = {
      es: `Recordatorio de tu cita — ${date} ${time}`,
      en: `Reminder: your appointment — ${date} ${time}`,
      it: `Promemoria del tuo appuntamento — ${date} ${time}`,
      fr: `Rappel de votre rendez-vous — ${date} ${time}`,
    }

    const bodyMap: Record<string, { greeting: string; lead: string; copy: string; signature: string }> = {
      es: {
        greeting: `Hola ${name},`,
        lead: `Te recordamos que tienes una ${type === 'videocall' ? 'videollamada' : 'cita presencial'} el ${date} a las ${time}.`,
        copy: 'Si necesitas cancelar o cambiar la hora, contáctanos lo antes posible.',
        signature: 'Equipo Sastrería Manuel Fernández',
      },
      en: {
        greeting: `Hello ${name},`,
        lead: `This is a reminder that you have a ${type === 'videocall' ? 'video call' : 'in-person appointment'} on ${date} at ${time}.`,
        copy: 'If you need to cancel or reschedule, please contact us as soon as possible.',
        signature: 'Sastrería Manuel Fernández Team',
      },
      it: {
        greeting: `Ciao ${name},`,
        lead: `Ti ricordiamo che hai una ${type === 'videocall' ? 'videochiamata' : 'visita in sede'} il ${date} alle ${time}.`,
        copy: 'Se hai bisogno di annullare o modificare l\'appuntamento, contattaci al più presto.',
        signature: 'Team Sastrería Manuel Fernández',
      },
      fr: {
        greeting: `Bonjour ${name},`,
        lead: `Nous vous rappelons que vous avez un ${type === 'videocall' ? 'visioconférence' : 'rendez-vous en atelier'} le ${date} à ${time}.`,
        copy: 'Si vous avez besoin d\'annuler ou de modifier le rendez-vous, veuillez nous contacter dès que possible.',
        signature: 'Équipe Sastrería Manuel Fernández',
      },
    }

    const t = bodyMap[loc] || bodyMap.es
    const text = `${t.greeting}\n\n${t.lead}\n${t.copy}\n\n—\n${t.signature}`
    const html = `
      <div style="font-family:'Cormorant Garamond','Georgia',serif;line-height:1.7;color:#222;max-width:560px;margin:0 auto;padding:2rem">
        <div style="border-bottom:1px solid #C9A84C;padding-bottom:1rem;margin-bottom:1.5rem">
          <h1 style="font-weight:400;font-style:italic;color:#0A1628;margin:0;font-size:1.6rem">Sastrería Manuel Fernández</h1>
        </div>
        <p style="font-size:1.1rem">${t.greeting}</p>
        <p>${t.lead}</p>
        <p>${t.copy}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:2rem 0">
        <p style="color:#666;font-size:0.95rem">${t.signature}</p>
      </div>
    `

    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: subjectMap[loc] || subjectMap.es,
      text,
      html,
      replyTo: ownerEmail,
    })

    if (emailResult.error) {
      console.error('Reminder email error:', emailResult.error)
      return NextResponse.json({ error: 'Failed to send reminder' }, { status: 500 })
    }

    await updateBookingReminder(bookingId)

    return NextResponse.json({ success: true, emailId: emailResult.data?.id })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Send reminder error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
