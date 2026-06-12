import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/admin/auth'
import { getBookings, updateBooking } from '@/lib/admin/db'
import { Resend } from 'resend'
import { query } from '@/lib/db'
import { validateBookingSlot } from '@/lib/booking/date-utils'

export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    const { searchParams } = new URL(request.url)
    const filters = {
      type: searchParams.get('type') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      status: searchParams.get('status') || undefined,
    }
    const bookings = await getBookings(filters)
    return NextResponse.json({ bookings })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get bookings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    const booking = await updateBooking(id, { status, notes })
    return NextResponse.json({ booking })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getUpdateSubject(type: string, date: string, time: string, locale: string): string {
  if (type === 'videocall') {
    const map: Record<string, string> = {
      es: `Tu videollamada ha sido actualizada — ${date} ${time}`,
      en: `Your video call has been updated — ${date} ${time}`,
      it: `La tua videochiamata è stata aggiornata — ${date} ${time}`,
      fr: `Votre visioconférence a été mise à jour — ${date} ${time}`,
    }
    return map[locale] || map.es
  }
  const map: Record<string, string> = {
    es: `Tu cita presencial ha sido actualizada — ${date} ${time}`,
    en: `Your in-person appointment has been updated — ${date} ${time}`,
    it: `Il tuo appuntamento in sede è stato aggiornato — ${date} ${time}`,
    fr: `Votre rendez-vous en atelier a été mis à jour — ${date} ${time}`,
  }
  return map[locale] || map.es
}

function getUpdateBody(
  type: string,
  name: string,
  date: string,
  time: string,
  locale: string,
  changedFields: string[]
): { text: string; html: string } {
  const loc = locale || 'es'
  const serviceName =
    type === 'videocall'
      ? { es: 'videollamada', en: 'video call', it: 'videochiamata', fr: 'visioconférence' }
      : { es: 'cita presencial', en: 'in-person appointment', it: 'appuntamento in sede', fr: 'rendez-vous en atelier' }

  const fieldLabels: Record<string, Record<string, string>> = {
    date: { es: 'Fecha', en: 'Date', it: 'Data', fr: 'Date' },
    time: { es: 'Hora', en: 'Time', it: 'Ora', fr: 'Heure' },
    name: { es: 'Nombre', en: 'Name', it: 'Nome', fr: 'Nom' },
    email: { es: 'Email', en: 'Email', it: 'Email', fr: 'Email' },
    phone: { es: 'Teléfono', en: 'Phone', it: 'Telefono', fr: 'Téléphone' },
    status: { es: 'Estado', en: 'Status', it: 'Stato', fr: 'Statut' },
    notes: { es: 'Notas', en: 'Notes', it: 'Note', fr: 'Notes' },
  }

  const changedList = changedFields
    .map((f) => `• ${(fieldLabels[f] && fieldLabels[f][loc]) || f}`)
    .join('\n')

  const map: Record<string, { greeting: string; lead: string; changed: string; copy: string; signature: string }> = {
    es: {
      greeting: `Hola ${name},`,
      lead: `Tu ${serviceName.es} ha sido actualizada. Los detalles actualizados son:`,
      changed: 'Campos actualizados:\n{changedList}',
      copy: `Fecha: ${date}\nHora: ${time}\n\nSi tienes alguna pregunta, contáctanos.`,
      signature: 'Equipo Sastrería Manuel Fernández',
    },
    en: {
      greeting: `Hello ${name},`,
      lead: `Your ${serviceName.en} has been updated. The updated details are:`,
      changed: 'Updated fields:\n{changedList}',
      copy: `Date: ${date}\nTime: ${time}\n\nIf you have any questions, please contact us.`,
      signature: 'Sastrería Manuel Fernández Team',
    },
    it: {
      greeting: `Ciao ${name},`,
      lead: `La tua ${serviceName.it} è stata aggiornata. I dettagli aggiornati sono:`,
      changed: 'Campi aggiornati:\n{changedList}',
      copy: `Data: ${date}\nOra: ${time}\n\nSe hai domande, contattaci.`,
      signature: 'Team Sastrería Manuel Fernández',
    },
    fr: {
      greeting: `Bonjour ${name},`,
      lead: `Votre ${serviceName.fr} a été mise à jour. Les détails mis à jour sont :`,
      changed: 'Champs mis à jour :\n{changedList}',
      copy: `Date : ${date}\nHeure : ${time}\n\nSi vous avez des questions, contactez-nous.`,
      signature: 'Équipe Sastrería Manuel Fernández',
    },
  }

  const t = map[loc] || map.es
  const text = `${t.greeting}\n\n${t.lead}\n${t.changed.replace('{changedList}', changedList)}\n\n${t.copy}\n\n—\n${t.signature}`
  const html = `
    <div style="font-family:'Cormorant Garamond','Georgia',serif;line-height:1.7;color:#222;max-width:560px;margin:0 auto;padding:2rem">
      <div style="border-bottom:1px solid #C9A84C;padding-bottom:1rem;margin-bottom:1.5rem">
        <h1 style="font-weight:400;font-style:italic;color:#0A1628;margin:0;font-size:1.6rem">Sastrería Manuel Fernández</h1>
      </div>
      <p style="font-size:1.1rem">${t.greeting}</p>
      <p>${t.lead}</p>
      <p style="white-space:pre-line">${t.changed.replace('{changedList}', changedList.replace(/\n/g, '<br>'))}</p>
      <p style="white-space:pre-line">${t.copy}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:2rem 0">
      <p style="color:#666;font-size:0.95rem">${t.signature}</p>
    </div>
  `
  return { text, html }
}

async function sendUpdateNotification(booking: Record<string, unknown>, changedFields: string[]) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  try {
    const resend = new Resend(apiKey)
    const ownerEmail = process.env.CONTACT_EMAIL || 'sastreriamanuelfernandez@gmail.com'
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'
    const name = String(booking.name || '')
    const email = String(booking.email || '')
    const date = String(booking.date || '')
    const time = String(booking.time || '')
    const type = String(booking.type || 'inperson')
    const locale = String(booking.locale || 'es')

    const subject = getUpdateSubject(type, date, time, locale)
    const body = getUpdateBody(type, name, date, time, locale, changedFields)

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject,
      text: body.text,
      html: body.html,
      replyTo: ownerEmail,
    })
  } catch (err) {
    console.error('Update notification email failed:', err)
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { id, name, email, phone, date, time, type, status, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    // Fetch existing booking
    const existingResult = await query(`SELECT * FROM bookings WHERE id = $1`, [id])
    const existing = existingResult.rows[0]
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Determine which fields actually changed
    const changedFields: string[] = []
    if (name !== undefined && name !== existing.name) changedFields.push('name')
    if (email !== undefined && email !== existing.email) changedFields.push('email')
    if (phone !== undefined && phone !== existing.phone) changedFields.push('phone')
    if (date !== undefined && date !== existing.date) changedFields.push('date')
    if (time !== undefined && time !== existing.time) changedFields.push('time')
    if (type !== undefined && type !== existing.type) changedFields.push('type')
    if (status !== undefined && status !== existing.status) changedFields.push('status')
    if (notes !== undefined && notes !== existing.notes) changedFields.push('notes')

    if (changedFields.length === 0) {
      return NextResponse.json({ booking: existing })
    }

    // Validate new slot if date/time changed
    const newDate = date !== undefined ? date : existing.date
    const newTime = time !== undefined ? time : existing.time
    const slotValidation = validateBookingSlot(newDate, newTime)
    if (!slotValidation.valid) {
      return NextResponse.json({ error: slotValidation.error }, { status: 400 })
    }

    // Check for conflicts if date/time changed (excluding current booking)
    if ((date !== undefined && date !== existing.date) || (time !== undefined && time !== existing.time)) {
      const conflictResult = await query(
        `SELECT 1 FROM bookings WHERE date = $1 AND time = $2 AND id != $3 LIMIT 1`,
        [newDate, newTime, id]
      )
      if (conflictResult.rowCount && conflictResult.rowCount > 0) {
        return NextResponse.json({ error: 'conflict' }, { status: 409 })
      }
    }

    const booking = await updateBooking(id, { name, email, phone, date, time, type, status, notes })

    // Notify client about the update
    if (booking) {
      await sendUpdateNotification(booking, changedFields)
    }

    return NextResponse.json({ booking })
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
