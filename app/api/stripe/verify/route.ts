import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { bookSlot, isSlotBooked } from '@/lib/bookings'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing session_id' }, { status: 400 })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ success: false, error: 'Stripe not configured' }, { status: 503 })
    }

    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2026-04-22.dahlia',
    })

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 })
    }

    const metadata = session.metadata || {}
    const name = metadata.name || ''
    const email = metadata.email || ''
    const date = metadata.date || ''
    const time = metadata.time || ''
    const locale = metadata.locale || 'es'

    if (!name || !email || !date || !time) {
      return NextResponse.json({ success: false, error: 'Incomplete booking data' }, { status: 400 })
    }

    // Check if already booked (idempotency)
    const alreadyBooked = await isSlotBooked(date, time)
    if (!alreadyBooked) {
      const bookResult = await bookSlot({
        name,
        email,
        date,
        time,
        type: 'videocall',
        createdAt: new Date().toISOString(),
      })

      if (!bookResult.success) {
        return NextResponse.json({ success: false, error: bookResult.error }, { status: 409 })
      }
    }

    // Send notification emails (non-critical)
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      try {
        const resend = new Resend(apiKey)
        const ownerEmail = process.env.CONTACT_EMAIL || 'sastreriamanuelfernandez@gmail.com'
        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'

        const loc = locale

        const ownerMap: Record<string, string> = {
          es: `Videollamada pagada - ${date} ${time} - ${name}`,
          en: `Paid Video Call - ${date} ${time} - ${name}`,
          it: `Videochiamata pagata - ${date} ${time} - ${name}`,
          fr: `Visioconférence payée - ${date} ${time} - ${name}`,
        }
        const ownerSubject = ownerMap[loc] || ownerMap.es

        const ownerTextMap: Record<string, string> = {
          es: `Nueva videollamada pagada\n\nCliente: ${name}\nEmail: ${email}\nFecha: ${date}\nHora: ${time}\n\nEl pago ha sido confirmado por Stripe.`,
          en: `New paid video call\n\nClient: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}\n\nPayment confirmed by Stripe.`,
          it: `Nuova videochiamata pagata\n\nCliente: ${name}\nEmail: ${email}\nData: ${date}\nOra: ${time}\n\nIl pagamento è stato confermato da Stripe.`,
          fr: `Nouvelle visioconférence payée\n\nClient: ${name}\nEmail: ${email}\nDate: ${date}\nHeure: ${time}\n\nPaiement confirmé par Stripe.`,
        }
        const ownerText = ownerTextMap[loc] || ownerTextMap.es

        const ownerResult = await resend.emails.send({
          from: fromEmail,
          to: ownerEmail,
          subject: ownerSubject,
          text: ownerText,
          html: `<pre style="font-family:sans-serif;line-height:1.6">${ownerText.replace(/\n/g, '<br>')}</pre>`,
          replyTo: email,
        })
        if (ownerResult.error) console.error('Resend owner email error:', ownerResult.error)

        const clientSubjectMap: Record<string, string> = {
          es: `Confirmación de tu videollamada — ${date} ${time}`,
          en: `Your video call confirmation — ${date} ${time}`,
          it: `Conferma della tua videochiamata — ${date} ${time}`,
          fr: `Confirmation de votre visioconférence — ${date} ${time}`,
        }
        const clientSubject = clientSubjectMap[loc] || clientSubjectMap.es

        const clientMap: Record<string, { greeting: string; lead: string; copy: string; signature: string }> = {
          es: {
            greeting: `Hola ${name},`,
            lead: `Tu videollamada ha sido confirmada para el ${date} a las ${time}.`,
            copy: 'Nos pondremos en contacto contigo en las próximas horas para enviarte el enlace de conexión.',
            signature: 'Equipo Sastrería Manuel Fernández',
          },
          en: {
            greeting: `Hello ${name},`,
            lead: `Your video call has been confirmed for ${date} at ${time}.`,
            copy: 'We will contact you within the next few hours to send you the connection link.',
            signature: 'Sastrería Manuel Fernández Team',
          },
          it: {
            greeting: `Ciao ${name},`,
            lead: `La tua videochiamata è stata confermata per il ${date} alle ${time}.`,
            copy: 'Ti contatteremo nelle prossime ore per inviarti il link di connessione.',
            signature: 'Team Sastrería Manuel Fernández',
          },
          fr: {
            greeting: `Bonjour ${name},`,
            lead: `Votre visioconférence a été confirmée pour le ${date} à ${time}.`,
            copy: 'Nous vous contacterons dans les prochaines heures pour vous envoyer le lien de connexion.',
            signature: 'Équipe Sastrería Manuel Fernández',
          },
        }
        const c = clientMap[loc] || clientMap.es
        const clientText = `${c.greeting}\n\n${c.lead}\n${c.copy}\n\n—\n${c.signature}`
        const clientHtml = `
          <div style="font-family:'Cormorant Garamond','Georgia',serif;line-height:1.7;color:#222;max-width:560px;margin:0 auto;padding:2rem">
            <div style="border-bottom:1px solid #C9A84C;padding-bottom:1rem;margin-bottom:1.5rem">
              <h1 style="font-weight:400;font-style:italic;color:#0A1628;margin:0;font-size:1.6rem">Sastrería Manuel Fernández</h1>
            </div>
            <p style="font-size:1.1rem">${c.greeting}</p>
            <p>${c.lead}</p>
            <p>${c.copy}</p>
            <hr style="border:none;border-top:1px solid #eee;margin:2rem 0">
            <p style="color:#666;font-size:0.95rem">${c.signature}</p>
          </div>
        `

        const clientResult = await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: clientSubject,
          text: clientText,
          html: clientHtml,
          replyTo: ownerEmail,
        })
        if (clientResult.error) console.error('Resend client email error:', clientResult.error)
      } catch (emailErr) {
        console.error('Email sending failed:', emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      name,
      email,
      date,
      time,
    })
  } catch (error) {
    console.error('Stripe verify error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify session' },
      { status: 500 }
    )
  }
}
