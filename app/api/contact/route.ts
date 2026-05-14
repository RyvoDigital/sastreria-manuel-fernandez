import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
  type: z.enum(['contact', 'videollamada']).default('contact'),
  date: z.string().optional(),
  time: z.string().optional(),
  locale: z.string().max(5).optional(),
})

/* ─── Owner-facing email builders ─────────────────────────────── */

function getOwnerSubject(type: string, name: string, date?: string, time?: string, locale?: string): string {
  if (type === 'videollamada' && date && time) {
    const map: Record<string, string> = {
      es: `Solicitud de Videollamada - ${date} ${time}`,
      en: `Video Call Request - ${date} ${time}`,
      it: `Richiesta di Videochiamata - ${date} ${time}`,
      fr: `Demande de Visioconférence - ${date} ${time}`,
    }
    return map[locale || 'es'] || map.es
  }
  return `Consulta de ${name}`
}

function getOwnerBody(type: string, name: string, email: string, message: string, date?: string, time?: string, locale?: string): { text: string; html: string } {
  if (type === 'videollamada' && date && time) {
    const loc = locale || 'es'
    const map: Record<string, string> = {
      es: `Hola equipo de Sastrería Manuel Fernández,\n\nMe gustaría reservar una videollamada para el día ${date} a las ${time}.\n\nPreferencia de plataforma: Zoom / Google Meet\nDuración estimada: 20-25 minutos\n\nSaludos cordiales`,
      en: `Hello Sastrería Manuel Fernández team,\n\nI would like to book a video call for ${date} at ${time}.\n\nPlatform preference: Zoom / Google Meet\nEstimated duration: 20-25 minutes\n\nBest regards`,
      it: `Salve team di Sastrería Manuel Fernández,\n\nVorrei prenotare una videochiamata per il giorno ${date} alle ${time}.\n\nPreferenza piattaforma: Zoom / Google Meet\nDurata stimata: 20-25 minuti\n\nCordiali saluti`,
      fr: `Bonjour équipe de Sastrería Manuel Fernández,\n\nJe souhaiterais réserver une visioconférence pour le ${date} à ${time}.\n\nPréférence de plateforme: Zoom / Google Meet\nDurée estimée: 20-25 minutes\n\nCordialement`,
    }
    const text = map[loc] || map.es
    const html = `<pre style="font-family:sans-serif;line-height:1.6">${text.replace(/\n/g, '<br>')}</pre>`
    return { text, html }
  }

  const text = `Nombre: ${name}\nEmail: ${email}\n\n${message}`
  const html = `
    <div style="font-family:sans-serif;line-height:1.6;color:#333">
      <h2 style="color:#C9A84C">Nuevo mensaje desde la web</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:1rem 0">
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>
  `
  return { text, html }
}

/* ─── Client-facing confirmation email builders ───────────────── */

function getClientContactSubject(locale: string): string {
  const map: Record<string, string> = {
    es: 'Hemos recibido tu mensaje — Sastrería Manuel Fernández',
    en: 'We received your message — Sastrería Manuel Fernández',
    it: 'Abbiamo ricevuto il tuo messaggio — Sastrería Manuel Fernández',
    fr: 'Nous avons reçu votre message — Sastrería Manuel Fernández',
  }
  return map[locale] || map.es
}

function getClientContactBody(name: string, message: string, locale: string): { text: string; html: string } {
  const map: Record<string, { greeting: string; lead: string; copy: string; closing: string; signature: string }> = {
    es: {
      greeting: `Hola ${name},`,
      lead: 'Gracias por contactar con Sastrería Manuel Fernández.',
      copy: 'Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.',
      closing: 'Un saludo,',
      signature: 'Equipo Sastrería Manuel Fernández',
    },
    en: {
      greeting: `Hello ${name},`,
      lead: 'Thank you for contacting Sastrería Manuel Fernández.',
      copy: 'We have received your message and will get back to you as soon as possible.',
      closing: 'Best regards,',
      signature: 'Sastrería Manuel Fernández Team',
    },
    it: {
      greeting: `Ciao ${name},`,
      lead: 'Grazie per aver contattato Sastrería Manuel Fernández.',
      copy: 'Abbiamo ricevuto il tuo messaggio e ti contatteremo al più presto.',
      closing: 'Cordiali saluti,',
      signature: 'Team Sastrería Manuel Fernández',
    },
    fr: {
      greeting: `Bonjour ${name},`,
      lead: "Merci d'avoir contacté Sastrería Manuel Fernández.",
      copy: 'Nous avons reçu votre message et nous vous contacterons dans les plus brefs délais.',
      closing: 'Cordialement,',
      signature: "Équipe Sastrería Manuel Fernández",
    },
  }

  const t = map[locale] || map.es
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
  return { text, html }
}

function getClientVideollamadaSubject(locale: string, date: string, time: string): string {
  const map: Record<string, string> = {
    es: `Confirmación de tu videollamada — ${date} ${time}`,
    en: `Your video call confirmation — ${date} ${time}`,
    it: `Conferma della tua videochiamata — ${date} ${time}`,
    fr: `Confirmation de votre visioconférence — ${date} ${time}`,
  }
  return map[locale] || map.es
}

function getClientVideollamadaBody(name: string, date: string, time: string, locale: string): { text: string; html: string } {
  const map: Record<string, { greeting: string; lead: string; copy: string; closing: string; signature: string }> = {
    es: {
      greeting: `Hola ${name},`,
      lead: `Hemos recibido tu solicitud de videollamada para el ${date} a las ${time}.`,
      copy: 'Nos pondremos en contacto contigo en las próximas horas para confirmar la cita y enviarte el enlace de conexión.',
      closing: 'Un saludo,',
      signature: 'Equipo Sastrería Manuel Fernández',
    },
    en: {
      greeting: `Hello ${name},`,
      lead: `We have received your video call request for ${date} at ${time}.`,
      copy: 'We will contact you within the next few hours to confirm the appointment and send you the connection link.',
      closing: 'Best regards,',
      signature: 'Sastrería Manuel Fernández Team',
    },
    it: {
      greeting: `Ciao ${name},`,
      lead: `Abbiamo ricevuto la tua richiesta di videochiamata per il ${date} alle ${time}.`,
      copy: 'Ti contatteremo nelle prossime ore per confermare l\'appuntamento e inviarti il link di connessione.',
      closing: 'Cordiali saluti,',
      signature: 'Team Sastrería Manuel Fernández',
    },
    fr: {
      greeting: `Bonjour ${name},`,
      lead: `Nous avons reçu votre demande de visioconférence pour le ${date} à ${time}.`,
      copy: "Nous vous contacterons dans les prochaines heures pour confirmer le rendez-vous et vous envoyer le lien de connexion.",
      closing: 'Cordialement,',
      signature: "Équipe Sastrería Manuel Fernández",
    },
  }

  const t = map[locale] || map.es
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
  return { text, html }
}

/* ─── Route handler ───────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, message, type, date, time, locale } = parsed.data
    const loc = locale || 'es'

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set')
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)
    const ownerEmail = process.env.CONTACT_EMAIL || 'sastreriamanuelfernandez@gmail.com'
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'

    /* ── 1. Email to owner (the actual inquiry) ───────────────── */
    const ownerSubject = getOwnerSubject(type, name, date, time, loc)
    const ownerBody = getOwnerBody(type, name, email, message, date, time, loc)

    const ownerResult = await resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      subject: ownerSubject,
      text: ownerBody.text,
      html: ownerBody.html,
      replyTo: email,
    })

    if (ownerResult.error) {
      console.error('Resend owner email error:', ownerResult.error)
      return NextResponse.json(
        { success: false, error: 'Failed to send inquiry' },
        { status: 500 }
      )
    }

    /* ── 2. Confirmation email to client ──────────────────────── */
    let clientSubject: string
    let clientBody: { text: string; html: string }

    if (type === 'videollamada' && date && time) {
      clientSubject = getClientVideollamadaSubject(loc, date, time)
      clientBody = getClientVideollamadaBody(name, date, time, loc)
    } else {
      clientSubject = getClientContactSubject(loc)
      clientBody = getClientContactBody(name, message, loc)
    }

    const clientResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: clientSubject,
      text: clientBody.text,
      html: clientBody.html,
      replyTo: ownerEmail,
    })

    if (clientResult.error) {
      console.error('Resend client email error:', clientResult.error)
      /* Owner already got the email, so we don't hard-fail for the user.
         We return success but log the confirmation failure.            */
    }

    return NextResponse.json({
      success: true,
      ownerId: ownerResult.data?.id,
      clientId: clientResult.data?.id ?? null,
    })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
