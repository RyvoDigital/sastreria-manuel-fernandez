'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { MapPin, Phone, Clock, Mail, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'

/* ─── Nav height constant (1.6rem top + 1.6rem bottom + ~44px logo) ─── */
const NAV_H = 76

type QuoteKey =
  | 'quote1' | 'quote2' | 'quote3' | 'quote4'
  | 'quote5' | 'quote6' | 'quote7' | 'quote8'

const PHOTOS: { src: string; quoteKey: QuoteKey }[] = [
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1778241918/photos/web_lista_images/contacto-page_s9mfnn', quoteKey: 'quote1' },
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1778241985/photos/web_lista_images/contacto-section_kj0rgk', quoteKey: 'quote2' },
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471156/photos/others/IMG_9503_wwqizp',         quoteKey: 'quote3' },
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471227/photos/others/IMG_1729_a7o3ej',        quoteKey: 'quote4' },
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471166/photos/others/IMG_0078_fcvvhk',    quoteKey: 'quote5' },
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471219/photos/others/IMG_1477_bx8bwn', quoteKey: 'quote6' },
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471223/photos/others/IMG_1701_ojirsx',     quoteKey: 'quote7' },
  { src: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471208/photos/others/IMG_0734_ug3baf',      quoteKey: 'quote8' },
]

const CSS = `
  /* ── Ken Burns ──────────────────────────────────────────── */
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

  /* ── Float labels ───────────────────────────────────────── */
  .mf-cf-field { position: relative; margin-bottom: 1.4rem; }
  .mf-cf-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(196,163,90,0.18);
    color: var(--color-offwhite);
    font-family: var(--font-sans);
    font-size: 1rem;
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
    font-size: 0.75rem;
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
    top: 0; font-size: 0.58rem; color: var(--color-gold);
  }
  .mf-cf-textarea { resize: none; min-height: 64px; }

  /* ── Submit button ───────────────────────────────────────── */
  .mf-cf-submit {
    background: transparent;
    border: 1px solid rgba(196,163,90,0.28);
    color: rgba(245,240,234,0.55);
    font-family: var(--font-sans);
    font-size: 0.78rem;
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

  /* ── Scrollbar styling for info panel ───────────────────── */
  .mf-contact-info::-webkit-scrollbar { width: 3px; }
  .mf-contact-info::-webkit-scrollbar-track { background: transparent; }
  .mf-contact-info::-webkit-scrollbar-thumb { background: rgba(196,163,90,0.2); border-radius: 2px; }

  /* ── Mobile ─────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .mf-contact-wrap  { flex-direction: column !important; height: auto !important; min-height: 100svh !important; }
    .mf-contact-photo-col { width: 100% !important; height: 45vh !important; flex-shrink: 0 !important; }
    .mf-contact-info  { width: 100% !important; height: auto !important; overflow-y: visible !important;
                         padding-top: 3rem !important; padding-bottom: 4rem !important; }
  }
`

export function ContactPage() {
  const { t } = useI18n()
  const isMobile = useIsMobile()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [submitted, setSubmitted]   = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

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
  }, [])

  /* Form submit → API */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const f    = e.currentTarget
    const name = (f.elements.namedItem('nombre')  as HTMLInputElement).value
    const mail = (f.elements.namedItem('email')   as HTMLInputElement).value
    const msg  = (f.elements.namedItem('mensaje') as HTMLTextAreaElement).value

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: mail, message: msg, type: 'contact' }),
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

  const details = [
    { Icon: MapPin, label: t.contacto.address_label, value: t.contacto.address,  href: undefined },
    { Icon: Phone,  label: t.contacto.phone_label,   value: t.contacto.phone,    href: `tel:${t.contacto.phone.replace(/\s/g,'')}` },
    { Icon: Clock,  label: t.contacto.hours_label,   value: t.contacto.hours,    href: undefined },
    { Icon: Mail,   label: t.contacto.email_label,   value: t.contacto.email,    href: `mailto:${t.contacto.email}` },
  ]

  return (
    <>
      <style>{CSS}</style>

      {/* ── OUTER WRAPPER ──────────────────────────────────── */}
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
          {/* Cycling photos with crossfade */}
          <AnimatePresence mode="sync">
            <motion.div
              key={photoIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: [0.4, 0, 0.15, 1] }}
              style={{ position: 'absolute', inset: 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTOS[photoIndex].src}
                alt=""
                aria-hidden="true"
                className="mf-contact-photo"
              />
            </motion.div>
          </AnimatePresence>

          {/* Right bleed gradient — seamlessly blends into navy panel */}
          <div style={{
            position:      'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
            background:    'linear-gradient(to right, transparent 50%, rgba(5,12,20,0.92) 100%), linear-gradient(to top, rgba(5,12,20,0.72) 0%, transparent 30%)',
          }} />

          {/* Top-left corner bracket */}
          <div style={{
            position: 'absolute', top: NAV_H + 20, left: 28,
            width: 18, height: 18, zIndex: 3, pointerEvents: 'none',
            borderTop: '1px solid rgba(196,163,90,0.2)',
            borderLeft: '1px solid rgba(196,163,90,0.2)',
          }} />

          {/* Cycling quote */}
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

          {/* Photo counter */}
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
            /* Nav clearance + breathing room */
            paddingTop:    `${NAV_H + 28}px`,
            paddingBottom: '8rem',
            paddingLeft:   isMobile ? '1.5rem' : 'clamp(2.5rem, 4.5vw, 5rem)',
            paddingRight:  isMobile ? '1.5rem' : 'clamp(2.5rem, 4.5vw, 5rem)',
            background:    'var(--color-navy)',
          }}
        >

          {/* Section label */}
          <div className="mf-ci" style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
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
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.05rem, 1.3vw, 1.2rem)',
            fontStyle: 'italic', lineHeight: 1.7, color: 'rgba(245,240,234,0.4)',
            marginBottom: '1.8rem',
          }}>
            {t.contacto.subheadline}
          </p>

          {/* Contact details — 2-column grid */}
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
                    fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: 'rgba(196,163,90,0.4)', marginBottom: '2px',
                  }}>
                    {label}
                  </div>
                  {href ? (
                    <a href={href} style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 300,
                      color: 'rgba(245,240,234,0.58)', textDecoration: 'none',
                      transition: 'color .2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-gold-light)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(245,240,234,0.58)' }}>
                      {value}
                    </a>
                  ) : (
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 300,
                      color: 'rgba(245,240,234,0.58)',
                    }}>
                      {value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Reservar CTA */}
          <div className="mf-ci" style={{ marginBottom: '1.8rem' }}>
            <Link
              href="/contacto"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.75rem 1.8rem',
                background: 'var(--color-gold)', color: '#080808',
                fontFamily: 'var(--font-sans)', fontSize: '0.88rem',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background .25s, transform .2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--color-gold-light)'
                el.style.transform  = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--color-gold)'
                el.style.transform  = 'translateY(0)'
              }}
            >
              {t.contacto.cta_reservar}
              <ArrowRight size={10} strokeWidth={1.5} />
            </Link>
          </div>

          {/* Thin divider */}
          <div className="mf-ci" style={{
            height: '1px', background: 'rgba(196,163,90,0.09)', marginBottom: '1.6rem',
          }} />

          {/* Form */}
          <div className="mf-ci">
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
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
                {/* Name + Email side by side on desktop */}
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
