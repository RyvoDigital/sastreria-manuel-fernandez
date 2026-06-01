import { NextRequest, NextResponse } from 'next/server'
import { bookSlot, isSlotBooked } from '@/lib/bookings'
import { updatePaymentBySessionId } from '@/lib/admin/db'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const { default: Stripe } = await import('stripe')
  const stripe = new Stripe(stripeKey, {})

  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    } else {
      // Fallback for development without webhook secret
      event = JSON.parse(payload)
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Record<string, any>
    const metadata = session.metadata || {}

    // Update local payment record
    try {
      await updatePaymentBySessionId(session.id, {
        status: 'paid',
        stripePaymentIntentId: session.payment_intent || null,
      })
    } catch (dbErr) {
      console.error('Failed to update payment status:', dbErr)
    }

    // Only handle videocall bookings via webhook
    if (metadata.type === 'videocall') {
      const name = metadata.name || ''
      const email = metadata.email || ''
      const date = metadata.date || ''
      const time = metadata.time || ''
      const locale = metadata.locale || 'es'

      if (name && email && date && time) {
        const alreadyBooked = await isSlotBooked(date, time)
        if (!alreadyBooked) {
          await bookSlot({
            name,
            email,
            date,
            time,
            type: 'videocall',
            createdAt: new Date().toISOString(),
          })

          // Send confirmation emails
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

              const ownerTextMap: Record<string, string> = {
                es: `Nueva videollamada pagada\n\nCliente: ${name}\nEmail: ${email}\nFecha: ${date}\nHora: ${time}\n\nEl pago ha sido confirmado por Stripe.`,
                en: `New paid video call\n\nClient: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}\n\nPayment confirmed by Stripe.`,
                it: `Nuova videochiamata pagata\n\nCliente: ${name}\nEmail: ${email}\nData: ${date}\nOra: ${time}\n\nIl pagamento è stato confermato da Stripe.`,
                fr: `Nouvelle visioconférence payée\n\nClient: ${name}\nEmail: ${email}\nDate: ${date}\nHeure: ${time}\n\nPaiement confirmé par Stripe.`,
              }

              await resend.emails.send({
                from: fromEmail,
                to: ownerEmail,
                subject: ownerMap[loc] || ownerMap.es,
                text: ownerTextMap[loc] || ownerTextMap.es,
                html: `<pre style="font-family:sans-serif;line-height:1.6">${(ownerTextMap[loc] || ownerTextMap.es).replace(/\n/g, '<br>')}</pre>`,
                replyTo: email,
              })

              const clientSubjectMap: Record<string, string> = {
                es: `Confirmación de tu videollamada — ${date} ${time}`,
                en: `Your video call confirmation — ${date} ${time}`,
                it: `Conferma della tua videochiamata — ${date} ${time}`,
                fr: `Confirmation de votre visioconférence — ${date} ${time}`,
              }

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

              await resend.emails.send({
                from: fromEmail,
                to: email,
                subject: clientSubjectMap[loc] || clientSubjectMap.es,
                text: clientText,
                html: clientHtml,
                replyTo: ownerEmail,
              })
            } catch (emailErr) {
              console.error('Webhook email sending failed:', emailErr)
            }
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
