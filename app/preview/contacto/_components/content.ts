'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { MapPin, Phone, Clock, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { track } from '@/lib/analytics'
import { useContent } from '@/lib/content-provider'
import { useSettings } from '@/lib/settings-provider'
import { BOOKING_ANCHOR, BOOKING_EVENT } from '@/lib/booking'

/*
 * Everything ContactPage renders and does, from the same sources: messages
 * keys (t.contacto.*), the CMS overrides, the booking hub's hard-coded
 * wording (verbatim), the three photographs with their quotes, and the same
 * handlers for the form, the free bookings and the paid video call.
 */

export type QuoteKey = 'quote1' | 'quote2' | 'quote3'
export const PHOTOS: { src: string; quoteKey: QuoteKey }[] = [
  { src: '/img/traje-azul-celeste-medida.webp', quoteKey: 'quote1' },
  { src: '/img/tarjeta-visita-sastreria-mano.webp', quoteKey: 'quote2' },
  { src: '/img/traje-azul-maniqui-forbes.webp', quoteKey: 'quote3' },
]

const HUB = {
  es: {
    hubTitle: '¿Cómo prefieres contactarnos?',
    hubSubtitle: 'Elige la opción que mejor se adapte a ti',
    inpersonMeasure: 'Tomar Medidas',
    inpersonMeasureDesc: 'Visítanos en nuestra sastrería en Madrid para tomar medidas',
    inpersonStyle: 'Consulta de Estilo',
    inpersonStyleDesc: 'Visítanos para una consulta de estilo sin medidas',
    videocall: 'Videollamada',
    videocallDesc: 'Consulta personalizada a distancia',
    message: 'Enviar Mensaje',
    messageDesc: 'Escríbenos y te responderemos pronto',
    videocallPaidSuccess: '¡Videollamada confirmada! Hemos recibido tu pago. Te enviaremos el enlace de conexión antes de la cita.',
  },
  en: {
    hubTitle: 'How would you like to reach us?',
    hubSubtitle: 'Choose the option that suits you best',
    inpersonMeasure: 'Measurements',
    inpersonMeasureDesc: 'Visit our Madrid tailoring house for measurements',
    inpersonStyle: 'Style Consultation',
    inpersonStyleDesc: 'Visit us for a style consultation without measurements',
    videocall: 'Video Call',
    videocallDesc: 'Personalized remote consultation',
    message: 'Send Message',
    messageDesc: 'Write to us and we will reply soon',
    videocallPaidSuccess: 'Video call confirmed! We have received your payment. We will send you the connection link before the appointment.',
  },
  it: {
    hubTitle: 'Come preferisci contattarci?',
    hubSubtitle: "Scegli l'opzione più adatta a te",
    inpersonMeasure: 'Prendere Misure',
    inpersonMeasureDesc: 'Visita la nostra sartoria a Madrid per le misure',
    inpersonStyle: 'Consulto di Stile',
    inpersonStyleDesc: 'Visita per una consulenza di stile senza misure',
    videocall: 'Videochiamata',
    videocallDesc: 'Consulenza personalizzata a distanza',
    message: 'Invia Messaggio',
    messageDesc: 'Scrivici e ti risponderemo presto',
    videocallPaidSuccess: "Videochiamata confermata! Abbiamo ricevuto il pagamento. Ti invieremo il link di connessione prima dell'appuntamento.",
  },
  fr: {
    hubTitle: 'Comment préférez-vous nous contacter?',
    hubSubtitle: "Choisissez l'option qui vous convient le mieux",
    inpersonMeasure: 'Prise de Mesures',
    inpersonMeasureDesc: 'Visitez notre maison de tailleur à Madrid pour les mesures',
    inpersonStyle: 'Consultation de Style',
    inpersonStyleDesc: 'Visitez-nous pour une consultation de style sans mesures',
    videocall: 'Visioconférence',
    videocallDesc: 'Consultation personnalisée à distance',
    message: 'Envoyer un Message',
    messageDesc: 'Écrivez-nous et nous vous répondrons bientôt',
    videocallPaidSuccess: 'Visioconférence confirmée! Nous avons reçu votre paiement. Nous vous enverrons le lien de connexion avant le rendez-vous.',
  },
}

/* Space between the fixed header and the booking options when they are brought into view. */
const BOOKING_GAP = 24

export type BookingMode = 'none' | 'inperson-measure' | 'inperson-style' | 'videocall'
type BookingData = { name: string; email: string; phone: string; date: string; time: string }

export function useContacto() {
  const { t, locale } = useI18n()
  const { getValue } = useContent()
  const { getPrice, isEnabled } = useSettings()
  const ct = t.contacto
  const bl = HUB[locale as keyof typeof HUB] || HUB.es

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingMode, setBookingMode] = useState<BookingMode>('none')
  const [videocallSuccess, setVideocallSuccess] = useState(false)

  /* Scroll to top when booking mode changes */
  useEffect(() => {
    if (bookingMode !== 'none') {
      const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o?: { immediate?: boolean }) => void } }).lenis
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }
  }, [bookingMode])

  /* Stripe return, read in the browser so the page is server-rendered in full. */
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const success = sp.get('videocall_success')
    const cancelled = sp.get('videocall_cancelled')
    const sessionId = sp.get('session_id')
    if (success && sessionId) {
      fetch(`/api/stripe/verify?session_id=${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setVideocallSuccess(true)
            setBookingMode('videocall')
          }
        })
        .catch(console.error)
    }
    if (cancelled) setBookingMode('videocall')
  }, [])

  /* "Reservar cita" from anywhere: arrive at #reservar, or the link was used
     while already here. Close any open calendar step and bring the options into view. */
  const [bookingRequest, setBookingRequest] = useState(0)
  useEffect(() => {
    const request = () => {
      setBookingMode('none')
      setBookingRequest((n) => n + 1)
    }
    const onHash = () => {
      if (window.location.hash === `#${BOOKING_ANCHOR}`) request()
    }
    onHash()
    window.addEventListener(BOOKING_EVENT, request)
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener(BOOKING_EVENT, request)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])
  useEffect(() => {
    if (!bookingRequest) return
    // Land the options just under the fixed header, every time. The target is
    // measured, not left to scroll-margin, and checked again once the page has
    // settled (fonts, images and the scroll scene can still move it).
    const target = () => {
      const el = document.getElementById(BOOKING_ANCHOR)
      if (!el) return null
      // The header's own height: it slides away while scrolling down, so its
      // on-screen position would move the target.
      const row = document.querySelector('.mf-nav-row') as HTMLElement | null
      const header = row ? row.offsetTop + row.offsetHeight : 0
      return Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - header - BOOKING_GAP))
    }
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o?: { immediate?: boolean; duration?: number }) => void } }).lenis
    const go = (immediate: boolean) => {
      const y = target()
      if (y === null || Math.abs(window.scrollY - y) < 2) return
      if (lenis) lenis.scrollTo(y, immediate ? { immediate: true } : { duration: 0.9 })
      else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' })
    }
    const ids = [requestAnimationFrame(() => go(false))]
    const timers = [1100, 1800, 2600].map((ms) => window.setTimeout(() => go(true), ms))
    // The reader takes over: no more corrections once they scroll themselves.
    const stop = () => timers.forEach(clearTimeout)
    const events = ['wheel', 'touchstart', 'keydown'] as const
    events.forEach((e) => window.addEventListener(e, stop, { passive: true, once: true }))
    return () => {
      ids.forEach(cancelAnimationFrame)
      stop()
      events.forEach((e) => window.removeEventListener(e, stop))
    }
  }, [bookingRequest])

  /* Form submit */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const f = e.currentTarget
    const name = (f.elements.namedItem('nombre') as HTMLInputElement).value
    const mail = (f.elements.namedItem('email') as HTMLInputElement).value
    const phone = (f.elements.namedItem('telefono') as HTMLInputElement).value
    const msg = (f.elements.namedItem('mensaje') as HTMLTextAreaElement).value
    const website = (f.elements.namedItem('website') as HTMLInputElement | null)?.value || ''
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: mail, phone, message: msg, type: 'contact', website }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || ct.form_error)
      track('contact_form_submit', { location: 'contacto' })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : ct.form_error)
    } finally {
      setLoading(false)
    }
  }

  const handleFreeBooking = async (data: BookingData) => {
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'inperson', locale }),
    })
    const result = await res.json()
    if (!res.ok || !result.success) throw new Error(result.error || 'Error')
    return result
  }

  const handleStripeCheckout = async (data: BookingData) => {
    const videocallPriceCents = (getPrice('videollamada') || 50) * 100
    const res = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'videocall', name: data.name, email: data.email, phone: data.phone, date: data.date, time: data.time, price: videocallPriceCents, locale }),
    })
    const result = await res.json()
    if (result.url) window.location.href = result.url
    else throw new Error(result.error || 'Error')
  }

  const cmsPhone = getValue('contact.phone')
  const cmsAddress = getValue('contact.address')
  const cmsHours = getValue('business.hours')
  const details = [
    { Icon: MapPin, label: ct.address_label, value: cmsAddress || ct.address, href: undefined },
    { Icon: Phone, label: ct.phone_label, value: cmsPhone || ct.phone, href: `tel:${(cmsPhone || ct.phone).replace(/\s/g, '')}` },
    { Icon: Clock, label: ct.hours_label, value: cmsHours || ct.hours, href: undefined },
    { Icon: Mail, label: ct.email_label, value: ct.email, href: `mailto:${ct.email}` },
  ]

  const open = (mode: Exclude<BookingMode, 'none'>) => {
    setBookingMode(mode)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const options: { key: string; icon: 'calendar' | 'video' | 'message'; title: string; desc: string; onClick: () => void }[] = [
    { key: 'inperson-measure', icon: 'calendar', title: bl.inpersonMeasure, desc: bl.inpersonMeasureDesc, onClick: () => open('inperson-measure') },
    { key: 'inperson-style', icon: 'calendar', title: bl.inpersonStyle, desc: bl.inpersonStyleDesc, onClick: () => open('inperson-style') },
    ...(isEnabled('videollamada') ? [{ key: 'videocall', icon: 'video' as const, title: bl.videocall, desc: bl.videocallDesc, onClick: () => open('videocall') }] : []),
    { key: 'message', icon: 'message', title: bl.message, desc: bl.messageDesc, onClick: () => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }) },
  ]

  return {
    t: ct,
    locale,
    bl,
    details,
    options,
    quotes: PHOTOS.map((p) => ct[p.quoteKey]),
    form: { submitted, loading, error, handleSubmit },
    booking: {
      mode: bookingMode,
      videocallSuccess,
      handleFreeBooking,
      handleStripeCheckout,
      back: () => {
        setBookingMode('none')
        setVideocallSuccess(false)
      },
    },
  }
}

export type Contacto = ReturnType<typeof useContacto>
