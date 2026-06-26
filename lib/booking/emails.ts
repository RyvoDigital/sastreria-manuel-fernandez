import { Resend } from 'resend'

export interface BookingEmailDetails {
  name: string
  email: string
  phone?: string
  date: string
  time: string
  type: 'inperson' | 'videocall'
  locale?: string
}

function phoneLine(phone: string | undefined, locale: string): string {
  const label: Record<string, string> = {
    es: 'Teléfono',
    en: 'Phone',
    it: 'Telefono',
    fr: 'Téléphone',
  }
  const value = phone?.trim() || '—'
  return `${label[locale] || label.es}: ${value}`
}

function getOwnerSubject(type: string, name: string, date: string, time: string, locale?: string): string {
  if (type === 'videocall') {
    const map: Record<string, string> = {
      es: `Videollamada pagada - ${date} ${time} - ${name}`,
      en: `Paid Video Call - ${date} ${time} - ${name}`,
      it: `Videochiamata pagata - ${date} ${time} - ${name}`,
      fr: `Visioconférence payée - ${date} ${time} - ${name}`,
    }
    return map[locale || 'es'] || map.es
  }
  const map: Record<string, string> = {
    es: `Confirmación de reserva - ${date} ${time} - ${name}`,
    en: `Booking confirmation - ${date} ${time} - ${name}`,
    it: `Conferma prenotazione - ${date} ${time} - ${name}`,
    fr: `Confirmation de réservation - ${date} ${time} - ${name}`,
  }
  return map[locale || 'es'] || map.es
}

function getOwnerBody(
  type: string,
  name: string,
  email: string,
  phone: string | undefined,
  date: string,
  time: string,
  locale?: string
): { text: string; html: string } {
  const loc = locale || 'es'
  const phoneText = phoneLine(phone, loc)

  if (type === 'videocall') {
    const map: Record<string, string> = {
      es: `Nueva videollamada pagada\n\nCliente: ${name}\nEmail: ${email}\n${phoneText}\nFecha: ${date}\nHora: ${time}\n\nEl pago ha sido confirmado por Stripe.`,
      en: `New paid video call\n\nClient: ${name}\nEmail: ${email}\n${phoneText}\nDate: ${date}\nTime: ${time}\n\nPayment confirmed by Stripe.`,
      it: `Nuova videochiamata pagata\n\nCliente: ${name}\nEmail: ${email}\n${phoneText}\nData: ${date}\nOra: ${time}\n\nIl pagamento è stato confermato da Stripe.`,
      fr: `Nouvelle visioconférence payée\n\nClient: ${name}\nEmail: ${email}\n${phoneText}\nDate: ${date}\nHeure: ${time}\n\nPaiement confirmé par Stripe.`,
    }
    const text = map[loc] || map.es
    return { text, html: formatOwnerHtml(text, loc) }
  }

  const map: Record<string, string> = {
    es: `Nueva cita presencial\n\nCliente: ${name}\nEmail: ${email}\n${phoneText}\nFecha: ${date}\nHora: ${time}\n\nLa cita es gratuita.`,
    en: `New in-person appointment\n\nClient: ${name}\nEmail: ${email}\n${phoneText}\nDate: ${date}\nTime: ${time}\n\nThis is a free appointment.`,
    it: `Nuovo appuntamento in sede\n\nCliente: ${name}\nEmail: ${email}\n${phoneText}\nData: ${date}\nOra: ${time}\n\nL'appuntamento è gratuito.`,
    fr: `Nouveau rendez-vous en atelier\n\nClient: ${name}\nEmail: ${email}\n${phoneText}\nDate: ${date}\nHeure: ${time}\n\nLe rendez-vous est gratuit.`,
  }
  const text = map[loc] || map.es
  return { text, html: formatOwnerHtml(text, loc) }
}

function formatOwnerHtml(text: string, locale: string): string {
  const title: Record<string, string> = {
    es: 'Nueva reserva',
    en: 'New booking',
    it: 'Nuova prenotazione',
    fr: 'Nouvelle réservation',
  }
  return `
    <div style="font-family:sans-serif;line-height:1.6;color:#222;max-width:560px;margin:0 auto;padding:2rem">
      <h1 style="font-size:1.25rem;color:#0A1628;margin:0 0 1rem">${title[locale] || title.es}</h1>
      <pre style="font-family:sans-serif;white-space:pre-wrap;margin:0">${text.replace(/\n/g, '<br>')}</pre>
    </div>
  `
}

function getClientSubject(type: string, date: string, time: string, locale?: string): string {
  if (type === 'videocall') {
    const map: Record<string, string> = {
      es: `Confirmación de tu videollamada — ${date} ${time}`,
      en: `Your video call confirmation — ${date} ${time}`,
      it: `Conferma della tua videochiamata — ${date} ${time}`,
      fr: `Confirmation de votre visioconférence — ${date} ${time}`,
    }
    return map[locale || 'es'] || map.es
  }
  const map: Record<string, string> = {
    es: `Confirmación de tu cita presencial — ${date} ${time}`,
    en: `Your in-person appointment confirmation — ${date} ${time}`,
    it: `Conferma del tuo appuntamento in sede — ${date} ${time}`,
    fr: `Confirmation de votre rendez-vous en atelier — ${date} ${time}`,
  }
  return map[locale || 'es'] || map.es
}

function getClientBody(
  type: string,
  name: string,
  date: string,
  time: string,
  locale?: string
): { text: string; html: string } {
  const loc = locale || 'es'

  if (type === 'videocall') {
    const map: Record<string, { greeting: string; lead: string; copy: string; signature: string }> = {
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
    return formatClientEmail(map[loc] || map.es)
  }

  const map: Record<string, { greeting: string; lead: string; copy: string; signature: string }> = {
    es: {
      greeting: `Hola ${name},`,
      lead: `Tu cita presencial ha sido confirmada para el ${date} a las ${time}.`,
      copy: 'Nos vemos en nuestra sastrería de Madrid. Si necesitas cambiar la cita, contáctanos con antelación.',
      signature: 'Equipo Sastrería Manuel Fernández',
    },
    en: {
      greeting: `Hello ${name},`,
      lead: `Your in-person appointment has been confirmed for ${date} at ${time}.`,
      copy: 'We look forward to seeing you at our Madrid tailor shop. If you need to reschedule, please contact us in advance.',
      signature: 'Sastrería Manuel Fernández Team',
    },
    it: {
      greeting: `Ciao ${name},`,
      lead: `Il tuo appuntamento in sede è stato confermato per il ${date} alle ${time}.`,
      copy: 'Ti aspettiamo nella nostra sartoria a Madrid. Se hai bisogno di modificare l\'appuntamento, contattaci in anticipo.',
      signature: 'Team Sastrería Manuel Fernández',
    },
    fr: {
      greeting: `Bonjour ${name},`,
      lead: `Votre rendez-vous en atelier a été confirmé pour le ${date} à ${time}.`,
      copy: 'Nous vous attendons dans notre sastrería à Madrid. Si vous avez besoin de modifier le rendez-vous, veuillez nous contacter à l\'avance.',
      signature: 'Équipe Sastrería Manuel Fernández',
    },
  }

  return formatClientEmail(map[loc] || map.es)
}

function formatClientEmail(t: { greeting: string; lead: string; copy: string; signature: string }) {
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

export async function sendBookingEmails(
  details: BookingEmailDetails
): Promise<{ ownerId: string | null; clientId: string | null }> {
  const apiKey = process.env.RESEND_API_KEY
  const ownerEmail = process.env.CONTACT_EMAIL || 'sastreriamanuelfernandez@gmail.com'
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'

  let ownerId: string | null = null
  let clientId: string | null = null

  if (!apiKey) {
    return { ownerId, clientId }
  }

  const { name, email, phone, date, time, type, locale } = details
  const loc = locale || 'es'

  try {
    const resend = new Resend(apiKey)

    const ownerBody = getOwnerBody(type, name, email, phone, date, time, loc)
    const ownerResult = await resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      subject: getOwnerSubject(type, name, date, time, loc),
      text: ownerBody.text,
      html: ownerBody.html,
      replyTo: email,
    })

    if (ownerResult.error) {
      console.error('Resend owner email error:', JSON.stringify(ownerResult.error), { from: fromEmail, to: ownerEmail })
    } else {
      ownerId = ownerResult.data?.id ?? null
    }

    const clientBody = getClientBody(type, name, date, time, loc)
    const clientResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      cc: [ownerEmail],
      subject: getClientSubject(type, date, time, loc),
      text: clientBody.text,
      html: clientBody.html,
      replyTo: ownerEmail,
    })

    if (clientResult.error) {
      console.error('Resend client email error:', JSON.stringify(clientResult.error), { from: fromEmail, to: email })
    } else {
      clientId = clientResult.data?.id ?? null
    }
  } catch (emailErr) {
    console.error('Email sending failed:', emailErr)
  }

  return { ownerId, clientId }
}