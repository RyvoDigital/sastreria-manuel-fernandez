'use client'

import { useState, useEffect, useRef, FormEvent, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { MapPin, Phone, Clock, Mail, ArrowRight, Calendar, Video, MessageSquare, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useContent } from '@/lib/content-provider'
import { useSettings } from '@/lib/settings-provider'
import { useIsMobile } from '@/lib/use-mobile'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { useSearchParams } from 'next/navigation'

/* ─── Nav height constant ─── */
const NAV_H = 76

type QuoteKey =
  | 'quote1' | 'quote2' | 'quote3' | 'quote4'
  | 'quote5' | 'quote6' | 'quote7' | 'quote8'

const PHOTOS: { src: string; quoteKey: QuoteKey }[] = [
 
  { src: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778765799/fotos-web/01-atelier-canon/atelier-unknown-001-0350.jpg', quoteKey: 'quote1' },
  { src: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778765846/fotos-web/01-atelier-canon/atelier-unknown-012-0621.jpg', quoteKey: 'quote2' },
  { src: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778765781/fotos-web/01-atelier-canon/atelier-2026-04-24-006-0648.jpg', quoteKey: 'quote3' },
]

const CSS = `
  @keyframes mf-contact-kb {
    0%   { transform: scale(1.0) translate(0px, 0px); }
    100% { transform: scale(1.08) translate(-14px, -8px); }
  }
  .mf-contact-photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.50) saturate(0.62);
    animation: mf-contact-kb 6500ms ease-in-out forwards;
    will-change: transform;
  }
  .mf-cf-field { position: relative; margin-bottom: 1.4rem; }
  .mf-cf-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(196,163,90,0.18);
    color: var(--color-offwhite);
    font-family: var(--font-sans);
    font-size: 1.05rem;
    font-weight: 300;
    padding: 1.4rem 0 0.55rem;
    outline: none;
    transition: border-color 0.3s cubic-bezier(0.16,1,0.3,1);
    letter-spacing: 0.03em;
    box-sizing: border-box;
  }
  .mf-cf-input:focus { border-bottom-color: var(--color-gold); }
  .mf-cf-label {
    position: absolute;
    left: 0; top: 1.4rem;
    font-family: var(--font-sans);
    font-size: 0.82rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(245,240,234,0.28);
    pointer-events: none;
    transition:
      top .24s cubic-bezier(0.16,1,0.3,1),
      font-size .24s cubic-bezier(0.16,1,0.3,1),
      color .24s cubic-bezier(0.16,1,0.3,1);
  }
  .mf-cf-input:focus + .mf-cf-label,
  .mf-cf-input:not(:placeholder-shown) + .mf-cf-label {
    top: 0; font-size: 0.65rem; color: var(--color-gold);
  }
  .mf-cf-textarea { resize: none; min-height: 64px; }
  .mf-cf-submit {
    background: transparent;
    border: 1px solid rgba(196,163,90,0.28);
    color: rgba(245,240,234,0.55);
    font-family: var(--font-sans);
    font-size: 0.85rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 0.85rem 2.2rem;
    cursor: pointer;
    transition: border-color .25s, color .25s, transform .2s;
  }
  .mf-cf-submit:hover {
    border-color: var(--color-gold);
    color: var(--color-gold);
    transform: translateY(-1px);
  }
  .mf-contact-info::-webkit-scrollbar { width: 3px; }
  .mf-contact-info::-webkit-scrollbar-track { background: transparent; }
  .mf-contact-info::-webkit-scrollbar-thumb { background: rgba(196,163,90,0.2); border-radius: 2px; }
  @media (max-width: 768px) {
    .mf-contact-wrap  { flex-direction: column !important; height: auto !important; min-height: 100svh !important; }
    .mf-contact-photo-col { width: 100% !important; height: 45vh !important; flex-shrink: 0 !important; }
    .mf-contact-info  { width: 100% !important; height: auto !important; overflow-y: visible !important;
                         padding-top: 3rem !important; padding-bottom: 4rem !important; }
  }
`

type BookingMode = 'none' | 'inperson-measure' | 'inperson-style' | 'videocall'

function ContactPageInner() {
  const { t, locale } = useI18n()
  const { getValue } = useContent()
  const { getPrice, isEnabled } = useSettings()
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [submitted, setSubmitted]   = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [bookingMode, setBookingMode] = useState<BookingMode>('none')
  const [videocallSuccess, setVideocallSuccess] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  /* Scroll to top when booking mode changes */
  useEffect(() => {
    if (bookingMode !== 'none') {
      const lenis = (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).lenis) as { scrollTo: (y: number, opts?: { immediate?: boolean }) => void } | undefined
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }
  }, [bookingMode])

  /* Handle Stripe return */
  useEffect(() => {
    const success = searchParams.get('videocall_success')
    const cancelled = searchParams.get('videocall_cancelled')
    const sessionId = searchParams.get('session_id')

    if (success && sessionId) {
      fetch(`/api/stripe/verify?session_id=${sessionId}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setVideocallSuccess(true)
            setBookingMode('videocall')
          }
        })
        .catch(console.error)
    }
    if (cancelled) {
      setBookingMode('videocall')
    }
  }, [searchParams])

  /* Preload */
  useEffect(() => {
    PHOTOS.forEach(({ src }) => { const i = new Image(); i.src = src })
  }, [])

  /* Cycle every 5s */
  useEffect(() => {
    const id = setInterval(() => setPhotoIndex(p => (p + 1) % PHOTOS.length), 5000)
    return () => clearInterval(id)
  }, [])

  /* GSAP stagger entrance */
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const items = panel.querySelectorAll('.mf-ci')
    gsap.set(items, { y: 20, opacity: 0 })
    const tl = gsap.timeline({ delay: 0.1 })
    tl.to(items, { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out' })
    return () => { tl.kill() }
  }, [bookingMode])

  /* Form submit */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const f    = e.currentTarget
    const name = (f.elements.namedItem('nombre')  as HTMLInputElement).value
    const mail = (f.elements.namedItem('email')   as HTMLInputElement).value
    const phone = (f.elements.namedItem('telefono') as HTMLInputElement).value
    const msg  = (f.elements.namedItem('mensaje') as HTMLTextAreaElement).value

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: mail, phone, message: msg, type: 'contact' }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || t.contacto.form_error)
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.contacto.form_error)
    } finally {
      setLoading(false)
    }
  }

  const handleFreeBooking = async (data: { name: string; email: string; phone: string; date: string; time: string }) => {
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'inperson', locale }),
    })
    const result = await res.json()
    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Error')
    }
  }

  const handleStripeCheckout = async (data: { name: string; email: string; phone: string; date: string; time: string }) => {
    const videocallPriceCents = (getPrice('videollamada') || 50) * 100
    const res = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'videocall',
        name: data.name,
        email: data.email,
        date: data.date,
        time: data.time,
        price: videocallPriceCents,
      }),
    })
    const result = await res.json()
    if (result.url) {
      window.location.href = result.url
    } else {
      throw new Error(result.error || 'Error')
    }
  }

  const cmsPhone = getValue('contact.phone')
  const cmsAddress = getValue('contact.address')
  const cmsHours = getValue('business.hours')

  const details = [
    { Icon: MapPin, label: t.contacto.address_label, value: cmsAddress || t.contacto.address,  href: undefined },
    { Icon: Phone,  label: t.contacto.phone_label,   value: cmsPhone || t.contacto.phone,    href: `tel:${(cmsPhone || t.contacto.phone).replace(/\s/g,'')}` },
    { Icon: Clock,  label: t.contacto.hours_label,   value: cmsHours || t.contacto.hours,    href: undefined },
    { Icon: Mail,   label: t.contacto.email_label,   value: t.contacto.email,    href: `mailto:${t.contacto.email}` },
  ]

  const bookingHubLabels = {
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
      videocallPaidSuccess: '¡Videollamada confirmada! Hemos recibido tu pago. Te enviaremos el enlace de conexión antes de la cita.'
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
      videocallPaidSuccess: 'Video call confirmed! We have received your payment. We will send you the connection link before the appointment.'
    },
    it: {
      hubTitle: 'Come preferisci contattarci?',
      hubSubtitle: 'Scegli l\'opzione più adatta a te',
      inpersonMeasure: 'Prendere Misure',
      inpersonMeasureDesc: 'Visita la nostra sartoria a Madrid per le misure',
      inpersonStyle: 'Consulto di Stile',
      inpersonStyleDesc: 'Visita per una consulenza di stile senza misure',
      videocall: 'Videochiamata',
      videocallDesc: 'Consulenza personalizzata a distanza',
      message: 'Invia Messaggio',
      messageDesc: 'Scrivici e ti risponderemo presto',
      videocallPaidSuccess: 'Videochiamata confermata! Abbiamo ricevuto il pagamento. Ti invieremo il link di connessione prima dell\'appuntamento.'
    },
    fr: {
      hubTitle: 'Comment préférez-vous nous contacter?',
      hubSubtitle: 'Choisissez l\'option qui vous convient le mieux',
      inpersonMeasure: 'Prise de Mesures',
      inpersonMeasureDesc: 'Visitez notre maison de tailleur à Madrid pour les mesures',
      inpersonStyle: 'Consultation de Style',
      inpersonStyleDesc: 'Visitez-nous pour une consultation de style sans mesures',
      videocall: 'Visioconférence',
      videocallDesc: 'Consultation personnalisée à distance',
      message: 'Envoyer un Message',
      messageDesc: 'Écrivez-nous et nous vous répondrons bientôt',
      videocallPaidSuccess: 'Visioconférence confirmée! Nous avons reçu votre paiement. Nous vous enverrons le lien de connexion avant le rendez-vous.'
    },
  }

  const bl = bookingHubLabels[locale as keyof typeof bookingHubLabels] || bookingHubLabels.es

  if (bookingMode !== 'none') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628' }}>
        {videocallSuccess && bookingMode === 'videocall' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
              background: 'rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.3)',
              padding: '1rem var(--container-padding)', textAlign: 'center',
            }}
          >
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#C9A84C', margin: 0 }}>
              {bl.videocallPaidSuccess}
            </p>
          </motion.div>
        )}
        <BookingCalendar
          type={bookingMode}
          onFreeSubmit={handleFreeBooking}
          onStripeCheckout={handleStripeCheckout}
          onBack={() => {
            setBookingMode('none')
            setVideocallSuccess(false)
          }}
        />
      </div>
    )
  }

  return (
    <>
      <style>{CSS}</style>

      <div
        className="mf-contact-wrap"
        style={{
          display:       'flex',
          flexDirection: 'row',
          width:         '100%',
          minHeight:     '100svh',
          overflow:      'visible',
          background:    'var(--color-navy)',
        }}
      >

        {/* ══ LEFT — PHOTO PANEL ═══════════════════════════ */}
        <div
          className="mf-contact-photo-col"
          style={{
            position:  'relative',
            width:     '52%',
            minHeight: '100svh',
            overflow:  'hidden',
            flexShrink: 0,
          }}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={photoIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: [0.4, 0, 0.15, 1] }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <img
                src={PHOTOS[photoIndex].src}
                alt=""
                aria-hidden="true"
                className="mf-contact-photo"
              />
            </motion.div>
          </AnimatePresence>

          <div style={{
            position:      'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
            background:    'linear-gradient(to right, transparent 50%, rgba(5,12,20,0.92) 100%), linear-gradient(to top, rgba(5,12,20,0.72) 0%, transparent 30%)',
          }} />

          <div style={{
            position: 'absolute', top: NAV_H + 20, left: 28,
            width: 18, height: 18, zIndex: 3, pointerEvents: 'none',
            borderTop: '1px solid rgba(196,163,90,0.2)',
            borderLeft: '1px solid rgba(196,163,90,0.2)',
          }} />

          <AnimatePresence mode="wait">
            <motion.div
              key={photoIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.15, 1] }}
              style={{
                position: 'absolute', bottom: '5.2rem', left: '2.2rem', right: '3rem',
                zIndex: 3, pointerEvents: 'none',
                fontFamily: 'var(--font-serif)', fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
                fontStyle: 'italic', lineHeight: 1.65, color: 'rgba(245,240,234,0.42)',
              }}
            >
              {t.contacto[PHOTOS[photoIndex].quoteKey]}
            </motion.div>
          </AnimatePresence>

          <div style={{
            position: 'absolute', bottom: '2.2rem', left: '2.2rem', zIndex: 3,
            display: 'flex', alignItems: 'baseline', gap: '0.25rem',
            fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums',
            pointerEvents: 'none',
          }}>
            <span style={{ color: 'var(--color-gold)', fontSize: '0.95rem' }}>
              {String(photoIndex + 1).padStart(2, '0')}
            </span>
            <span style={{ color: 'rgba(196,163,90,0.25)', fontSize: '0.72rem', margin: '0 0.15rem' }}>/</span>
            <span style={{ color: 'rgba(245,240,234,0.22)', fontSize: '0.78rem' }}>
              {String(PHOTOS.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* ══ RIGHT — INFO PANEL ═══════════════════════════ */}
        <div
          ref={panelRef}
          className="mf-contact-info"
          style={{
            flex:          1,
            height:        '100%',
            minHeight:     '100svh',
            overflowY:     'auto',
            overflowX:     'hidden',
            display:       'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop:    `${NAV_H + 28}px`,
            paddingBottom: '8rem',
            paddingLeft:   isMobile ? '1.5rem' : 'clamp(2.5rem, 4.5vw, 5rem)',
            paddingRight:  isMobile ? '1.5rem' : 'clamp(2.5rem, 4.5vw, 5rem)',
            background:    'var(--color-navy)',
          }}
        >

          {/* Section label */}
          <div className="mf-ci" style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
            letterSpacing: '0.34em', textTransform: 'uppercase',
            color: 'rgba(196,163,90,0.55)', marginBottom: '0.9rem',
          }}>
            {t.contacto.section_label} · Madrid
          </div>

          {/* Headline */}
          <h1 className="mf-ci" style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.6rem, 4vw, 4.4rem)',
            fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.02em',
            color: 'var(--color-offwhite)', margin: '0 0 1rem',
          }}>
            {t.contacto.headline}
          </h1>

          {/* Gold rule */}
          <div className="mf-ci" style={{
            width: '36px', height: '1px',
            background: 'rgba(196,163,90,0.45)', marginBottom: '1rem',
          }} />

          {/* Subheadline */}
          <p className="mf-ci" style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.15rem, 1.5vw, 1.35rem)',
            fontStyle: 'italic', lineHeight: 1.7, color: 'rgba(245,240,234,0.4)',
            marginBottom: '1.8rem',
          }}>
            {t.contacto.subheadline}
          </p>

          {/* Contact details */}
          <div className="mf-ci" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '0.9rem 1.5rem',
            marginBottom: '1.8rem',
          }}>
            {details.map(({ Icon, label, value, href }) => (
              <div key={label} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                <Icon size={11} strokeWidth={1.5} style={{ color: 'var(--color-gold)', marginTop: '3px', flexShrink: 0, opacity: 0.6 }} />
                <div>
                  <div style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: 'rgba(196,163,90,0.4)', marginBottom: '2px',
                  }}>
                    {label}
                  </div>
                  {href ? (
                    <a href={href} style={{
                      fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 300,
                      color: 'rgba(245,240,234,0.58)', textDecoration: 'none',
                      transition: 'color .2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-gold-light)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(245,240,234,0.58)' }}>
                      {value}
                    </a>
                  ) : (
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 300,
                      color: 'rgba(245,240,234,0.58)',
                    }}>
                      {value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ─── BOOKING HUB ─── */}
          <div className="mf-ci" style={{ marginBottom: '2rem' }}>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.25rem, 2vw, 1.6rem)', fontStyle: 'italic',
              color: '#FFFFFF', marginBottom: '1rem',
            }}>
              {bl.hubTitle}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isEnabled('videollamada') ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
              gap: '0.75rem',
            }}>
              {/* In-person Measurements */}
              <button
                onClick={() => { setBookingMode('inperson-measure'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem',
                  padding: '1.25rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                  e.currentTarget.style.background = 'rgba(201,168,76,0.04)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }}
              >
                <Calendar size={20} color="#C9A84C" />
                <div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 500, margin: 0 }}>
                    {bl.inpersonMeasure}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '0.15rem 0 0' }}>
                    {bl.inpersonMeasureDesc}
                  </p>
                </div>
              </button>

              {/* In-person Style Consultation */}
              <button
                onClick={() => { setBookingMode('inperson-style'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem',
                  padding: '1.25rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                  e.currentTarget.style.background = 'rgba(201,168,76,0.04)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }}
              >
                <Calendar size={20} color="#C9A84C" />
                <div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 500, margin: 0 }}>
                    {bl.inpersonStyle}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '0.15rem 0 0' }}>
                    {bl.inpersonStyleDesc}
                  </p>
                </div>
              </button>

              {isEnabled('videollamada') && (
                <button
                  onClick={() => { setBookingMode('videocall'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem',
                    padding: '1.25rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                    e.currentTarget.style.background = 'rgba(201,168,76,0.04)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  }}
                >
                  <Video size={20} color="#C9A84C" />
                  <div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 500, margin: 0 }}>
                      {bl.videocall}
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '0.15rem 0 0' }}>
                      {bl.videocallDesc}
                    </p>
                  </div>
                </button>
              )}

              {/* Message */}
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem',
                  padding: '1.25rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                  e.currentTarget.style.background = 'rgba(201,168,76,0.04)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }}
              >
                <MessageSquare size={20} color="#C9A84C" />
                <div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 500, margin: 0 }}>
                    {bl.message}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '0.15rem 0 0' }}>
                    {bl.messageDesc}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Thin divider */}
          <div className="mf-ci" style={{
            height: '1px', background: 'rgba(196,163,90,0.09)', marginBottom: '1.6rem',
          }} />

          {/* Form */}
          <div className="mf-ci" id="contact-form">
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'rgba(245,240,234,0.25)', marginBottom: '1.4rem',
            }}>
              {t.contacto.form_title}
            </div>

            {submitted ? (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontFamily: 'var(--font-serif)', fontSize: '1.1rem',
                  fontStyle: 'italic', color: 'var(--color-gold)', lineHeight: 1.7,
                }}
              >
                {t.contacto.form_success}
              </motion.p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 1.5rem' }}>
                  <div className="mf-cf-field">
                    <input type="text"  name="nombre" id="mf-cn" placeholder=" " required className="mf-cf-input" disabled={loading} />
                    <label htmlFor="mf-cn" className="mf-cf-label">{t.contacto.form_name}</label>
                  </div>
                  <div className="mf-cf-field">
                    <input type="email" name="email"  id="mf-ce" placeholder=" " required className="mf-cf-input" disabled={loading} />
                    <label htmlFor="mf-ce" className="mf-cf-label">{t.contacto.form_email}</label>
                  </div>
                </div>

                <div className="mf-cf-field">
                  <input type="tel" name="telefono" id="mf-ct" placeholder=" " required className="mf-cf-input" disabled={loading} />
                  <label htmlFor="mf-ct" className="mf-cf-label">{t.contacto.form_phone}</label>
                </div>

                <div className="mf-cf-field">
                  <textarea name="mensaje" id="mf-cm" rows={2} placeholder=" " required className="mf-cf-input mf-cf-textarea" disabled={loading} />
                  <label htmlFor="mf-cm" className="mf-cf-label">{t.contacto.form_message}</label>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
                      color: '#e57373', marginBottom: '1rem',
                    }}
                  >
                    {error}
                  </motion.p>
                )}

                <button type="submit" className="mf-cf-submit" disabled={loading} style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? t.contacto.form_sending : t.contacto.form_submit}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export function ContactPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(201,168,76,0.2)', borderTopColor: '#C9A84C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ContactPageInner />
    </Suspense>
  )
}
