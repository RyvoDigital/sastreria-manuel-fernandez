'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useI18n, type Locale } from '@/lib/i18n'

/*
 * The page a confirmation email's cancel link opens. The token arrives after
 * the # (never sent to the server or to analytics) and is moved out of the
 * address bar at once. Opening the link only looks the booking up; it is
 * cancelled when the visitor presses the button, so mail scanners that open
 * links cannot cancel anything.
 */

type L = 'es' | 'en' | 'it' | 'fr'

const COPY: Record<L, {
  title: string
  checking: string
  booking: (date: string, time: string) => string
  cancel: string
  cancelling: string
  cancelled: string
  invalid: string
  paid: string
  failed: string
  home: string
}> = {
  es: {
    title: 'Cancelar tu cita',
    checking: 'Comprobando la reserva…',
    booking: (d, t) => `Cita presencial del ${d} a las ${t}.`,
    cancel: 'Cancelar esta reserva',
    cancelling: 'Cancelando…',
    cancelled: 'Reserva cancelada correctamente',
    invalid: 'Este enlace ya no es válido: la cita ya se canceló o ya ha pasado. Si necesitas ayuda, contáctanos.',
    paid: 'Las videollamadas pagadas se cancelan a través de la sastrería. Contáctanos y te ayudamos.',
    failed: 'No se ha podido cancelar. Inténtalo de nuevo o contáctanos.',
    home: 'Volver al inicio',
  },
  en: {
    title: 'Cancel your appointment',
    checking: 'Checking the booking…',
    booking: (d, t) => `In-person appointment on ${d} at ${t}.`,
    cancel: 'Cancel this booking',
    cancelling: 'Cancelling…',
    cancelled: 'Booking cancelled successfully',
    invalid: 'This link is no longer valid: the appointment has already been cancelled or has passed. If you need help, contact us.',
    paid: 'Paid video calls are cancelled through the shop. Contact us and we will help.',
    failed: 'The booking could not be cancelled. Try again or contact us.',
    home: 'Back to the homepage',
  },
  it: {
    title: 'Annulla il tuo appuntamento',
    checking: 'Verifica della prenotazione…',
    booking: (d, t) => `Appuntamento in sede del ${d} alle ${t}.`,
    cancel: 'Annulla questa prenotazione',
    cancelling: 'Annullamento…',
    cancelled: 'Prenotazione annullata con successo',
    invalid: "Questo link non è più valido: l'appuntamento è già stato annullato o è passato. Se hai bisogno di aiuto, contattaci.",
    paid: 'Le videochiamate pagate si annullano tramite la sartoria. Contattaci e ti aiutiamo.',
    failed: 'Non è stato possibile annullare. Riprova o contattaci.',
    home: 'Torna alla home',
  },
  fr: {
    title: 'Annuler votre rendez-vous',
    checking: 'Vérification de la réservation…',
    booking: (d, t) => `Rendez-vous en atelier le ${d} à ${t}.`,
    cancel: 'Annuler ce rendez-vous',
    cancelling: 'Annulation…',
    cancelled: 'Rendez-vous annulé avec succès',
    invalid: "Ce lien n'est plus valide : le rendez-vous a déjà été annulé ou est passé. Si vous avez besoin d'aide, contactez-nous.",
    paid: 'Les visioconférences payées s’annulent auprès de la sastrería. Contactez-nous, nous vous aiderons.',
    failed: "L'annulation n'a pas pu être effectuée. Réessayez ou contactez-nous.",
    home: "Retour à l'accueil",
  },
}

type State =
  | { step: 'checking' }
  | { step: 'ready'; date: string; time: string }
  | { step: 'cancelling'; date: string; time: string }
  | { step: 'cancelled'; date: string; time: string }
  | { step: 'invalid' }
  | { step: 'paid' }
  | { step: 'failed'; date: string; time: string }

function formatDate(date: string, locale: L): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d, 12))
}

export function CancelBooking() {
  const { locale, setLocale, t: dict } = useI18n()
  const [token, setToken] = useState<string | null>(null)
  const [state, setState] = useState<State>({ step: 'checking' })
  const l = (['es', 'en', 'it', 'fr'].includes(locale) ? locale : 'es') as L
  const c = COPY[l]

  // Read the token and the email's language, then clear the address bar.
  useEffect(() => {
    const t = new URLSearchParams(window.location.hash.slice(1)).get('t')
    const lang = new URLSearchParams(window.location.search).get('l')
    if (lang && ['es', 'en', 'it', 'fr'].includes(lang)) setLocale(lang as Locale)
    window.history.replaceState(null, '', window.location.pathname)
    if (!t) return setState({ step: 'invalid' })
    setToken(t)
    fetch('/api/booking/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: t }) })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data.booking) return setState({ step: 'invalid' })
        if (data.booking.type !== 'inperson') return setState({ step: 'paid' })
        setState({ step: 'ready', date: data.booking.date, time: data.booking.time })
      })
      .catch(() => setState({ step: 'invalid' }))
  }, [setLocale])

  const cancel = async () => {
    if (!token || (state.step !== 'ready' && state.step !== 'failed')) return
    const { date, time } = state
    setState({ step: 'cancelling', date, time })
    try {
      const res = await fetch('/api/booking', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
      if (res.ok) return setState({ step: 'cancelled', date, time })
      setState(res.status === 404 ? { step: 'invalid' } : { step: 'failed', date, time })
    } catch {
      setState({ step: 'failed', date, time })
    }
  }

  const hasBooking = 'date' in state
  return (
    <section className="mf-cancel" aria-labelledby="mf-cancel-title">
      <div className="mf-cancel-inner">
        <h1 id="mf-cancel-title" className="mf-cancel-title">{c.title}</h1>
        <span className="mf-cancel-rule" aria-hidden="true" />
        <div aria-live="polite" className="mf-cancel-body">
          {state.step === 'checking' && <p>{c.checking}</p>}
          {hasBooking && <p className="mf-cancel-booking">{c.booking(formatDate(state.date, l), state.time)}</p>}
          {state.step === 'invalid' && <p>{c.invalid}</p>}
          {state.step === 'paid' && <p>{c.paid}</p>}
          {state.step === 'failed' && <p className="mf-cancel-error">{c.failed}</p>}
          {state.step === 'cancelled' && <p className="mf-cancel-done">{c.cancelled}</p>}
        </div>
        <div className="mf-cancel-actions">
          {(state.step === 'ready' || state.step === 'cancelling' || state.step === 'failed') && (
            <button type="button" className="mf-cancel-btn" onClick={cancel} disabled={state.step === 'cancelling'}>
              {state.step === 'cancelling' ? c.cancelling : c.cancel}
            </button>
          )}
          {(state.step === 'invalid' || state.step === 'paid') && (
            <Link href="/contacto" className="mf-cancel-btn">{dict.nav.contacto}</Link>
          )}
          <Link href="/" className="mf-cancel-link">{c.home}</Link>
        </div>
      </div>
      <style>{`
        .mf-cancel { min-height: 80svh; display: grid; align-items: center; background: var(--color-navy); color: #fff;
          padding: calc(var(--header-offset) + 3rem) var(--container-padding) 5rem; }
        .mf-cancel-inner { max-width: 36rem; }
        .mf-cancel-title { font-family: var(--font-serif); font-weight: 300; font-size: clamp(2.4rem, 1.8rem + 3vw, 4rem); line-height: 1.05; margin: 0; }
        .mf-cancel-rule { display: block; width: 48px; height: 1px; margin: 1.75rem 0; background: var(--color-gold); }
        .mf-cancel-body { display: grid; gap: 0.75rem; font-family: var(--font-sans); font-weight: 300; font-size: 1.05rem; line-height: 1.7; color: rgba(255,255,255,0.8); }
        .mf-cancel-body p { margin: 0; }
        .mf-cancel-booking { font-family: var(--font-serif); font-style: italic; font-size: 1.5rem; line-height: 1.35; color: #fff; }
        .mf-cancel-done { color: var(--color-gold-light); }
        .mf-cancel-error { color: #f1a1a1; }
        .mf-cancel-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem 1.75rem; margin-top: 2.25rem; }
        .mf-cancel-btn { display: inline-flex; align-items: center; min-height: 52px; padding: 0 2rem; border: 0; cursor: pointer;
          background: var(--color-gold); color: var(--color-navy); text-decoration: none;
          font-family: var(--font-sans); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
        .mf-cancel-btn:hover { background: var(--color-gold-light); }
        .mf-cancel-btn:disabled { opacity: 0.6; cursor: wait; }
        .mf-cancel-btn:focus-visible, .mf-cancel-link:focus-visible { outline: 2px solid var(--color-gold-light); outline-offset: 4px; }
        .mf-cancel-link { font-family: var(--font-sans); font-size: 0.8rem; letter-spacing: 0.08em; color: rgba(255,255,255,0.7); text-underline-offset: 4px; }
      `}</style>
    </section>
  )
}
