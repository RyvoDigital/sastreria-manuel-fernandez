'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'

gsap.registerPlugin(ScrollTrigger)

/* ─── Step data ──────────────────────────────────────────── */
const STEP_META = [
  {
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1778242036/photos/web_lista_images/home-selection_vsmq3j',
    imageLeft: true,
    bg: '#050C14',
  },
  {
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1778242003/photos/web_lista_images/home-sartorial-interpretation_sdszvu',
    imageLeft: false,
    bg: '#07101A',
  },
  {
    image: 'https://res.cloudinary.com/dwruvre6o/image/upload/v1778242094/photos/web_lista_images/home-the-result_l9d5tm',
    imageLeft: true,
    bg: '#050C14',
  },
]

/* ─── Single step block ──────────────────────────────────── */
interface StepProps {
  num: string
  title: string
  body: string
  image: string
  imageLeft: boolean
  bg: string
}

function StepBlock({ num, title, body, image, imageLeft, bg }: StepProps) {
  const isMobile = useIsMobile()
  const blockRef  = useRef<HTMLDivElement>(null)
  const imgWrap   = useRef<HTMLDivElement>(null)
  const imgInner  = useRef<HTMLDivElement>(null)
  const ghostRef  = useRef<HTMLDivElement>(null)
  const textRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const block = blockRef.current
    const img   = imgWrap.current
    const inner = imgInner.current
    const ghost = ghostRef.current
    const text  = textRef.current
    if (!block || !img || !inner || !ghost || !text) return

    const ctx = gsap.context(() => {

      /* Image: clip-path curtain reveal */
      gsap.fromTo(img,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.5,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: block, start: 'top 72%', toggleActions: 'play none none none' },
        }
      )

      /* Subtle parallax drift on image inner */
      gsap.to(inner, {
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: block, start: 'top bottom', end: 'bottom top', scrub: 1.8 },
      })

      /* Ghost numeral fades in with a larger scale-down effect */
      gsap.fromTo(ghost,
        { opacity: 0, scale: 1.2, y: 60, rotate: 5 },
        {
          opacity: 1, scale: 1, y: 0, rotate: 0,
          duration: 1.8, ease: 'expo.out',
          scrollTrigger: { trigger: block, start: 'top 85%', toggleActions: 'play none none none' },
        }
      )

      /* Text items stagger up with a wider reveal */
      gsap.fromTo(
        text.querySelectorAll('.si'),
        { y: 40, opacity: 0, letterSpacing: '0.05em' },
        {
          y: 0, opacity: 1, letterSpacing: '0em',
          duration: 1.4, stagger: 0.15, ease: 'power4.out',
          scrollTrigger: { trigger: block, start: 'top 70%', toggleActions: 'play none none none' },
        }
      )
    }, block)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={blockRef}
      style={{
        position:  'relative',
        display:   'grid',
        gridTemplateColumns: isMobile ? '1fr' : '45fr 55fr',
        minHeight: isMobile ? 'auto' : '88vh',
        background: bg,
        overflow:  'hidden',
      }}
    >
      {/* Ghost numeral — watermark */}
      <div ref={ghostRef} style={{
        position:     'absolute',
        top:          '50%',
        [imageLeft ? 'right' : 'left']: '-0.02em',
        transform:    'translateY(-52%)',
        fontFamily:   'var(--font-serif)',
        fontSize:     'clamp(12rem, 24vw, 26rem)',
        lineHeight:    1,
        fontWeight:    400,
        letterSpacing: '-0.04em',
        color:        'rgba(196,163,90,0.035)',
        userSelect:   'none',
        pointerEvents: 'none',
        zIndex:        1,
        opacity:       0,
      }}>
        {num}
      </div>

      {/* Image column */}
      <div
        ref={imgWrap}
        style={{
          order:     isMobile ? 1 : (imageLeft ? 1 : 2),
          position:  'relative',
          overflow:  'hidden',
          minHeight: isMobile ? '40vh' : '88vh',
          clipPath:  'inset(0 0 100% 0)',
        }}
      >
        <div
          ref={imgInner}
          style={{
            position:           'absolute',
            inset:              '-10% 0',
            backgroundImage:    `url('${image}')`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            filter:             'brightness(0.68) saturate(0.55)',
          }}
        />
        {/* Inset gold frame */}
        <div style={{
          position: 'absolute',
          inset:    '2rem',
          border:   '1px solid rgba(196,163,90,0.14)',
          zIndex:    2,
          pointerEvents: 'none',
        }} />
        {/* Step counter — corner of image */}
        <div style={{
          position:   'absolute',
          bottom:     '2.6rem',
          [imageLeft ? 'right' : 'left']: '2.8rem',
          fontFamily: 'var(--font-sans)',
          fontSize:   '0.52rem',
          letterSpacing: '0.25em',
          color:      'rgba(196,163,90,0.5)',
          zIndex:      3,
          textTransform: 'uppercase',
        }}>
          {num} / 03
        </div>
      </div>

      {/* Text column */}
      <div
        ref={textRef}
        style={{
          order:         isMobile ? 2 : (imageLeft ? 2 : 1),
          position:      'relative',
          zIndex:         2,
          display:       'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding:       isMobile ? '2.5rem var(--container-padding)' : `clamp(4rem, 7vw, 7rem) clamp(3rem, 5vw, 6rem)`,
        }}
      >
        {/* Small step label */}
        <div className="si" style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.55rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color:          'var(--color-gold)',
          marginBottom:  '1.2rem',
          opacity:        0.75,
        }}>
          Paso {num}
        </div>

        {/* Gold rule */}
        <div className="si" style={{
          width:      '30px',
          height:     '1px',
          background:  'rgba(196,163,90,0.45)',
          marginBottom: '1.8rem',
        }} />

        {/* Title */}
        <h2 className="si" style={{
          fontFamily:    'var(--font-serif)',
          fontSize:      'clamp(2rem, 3.8vw, 3.4rem)',
          fontWeight:     400,
          lineHeight:     1.08,
          letterSpacing: '-0.01em',
          color:          'var(--color-offwhite)',
          marginBottom:  '1.8rem',
          fontStyle:     'italic',
        }}>
          {title}
        </h2>

        {/* Body */}
        <p className="si" style={{
          fontFamily:  'var(--font-sans)',
          fontSize:    'clamp(0.8rem, 1vw, 0.9rem)',
          fontWeight:   300,
          lineHeight:   1.9,
          color:        'rgba(245,240,234,0.45)',
          maxWidth:    '340px',
        }}>
          {body}
        </p>

        {/* Bottom accent — vertical line fragment */}
        <div className="si" style={{
          marginTop:  '3rem',
          width:      '1px',
          height:     '40px',
          background: 'linear-gradient(to bottom, rgba(196,163,90,0.35), transparent)',
        }} />
      </div>
    </div>
  )
}

/* ─── Section wrapper ────────────────────────────────────── */
export function ProcesoSection() {
  const { t }       = useI18n()
  const sectionRef  = useRef<HTMLElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const threadRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const header  = headerRef.current
    const thread  = threadRef.current
    if (!section || !header || !thread) return

    const ctx = gsap.context(() => {
      /* Header stagger */
      gsap.fromTo(header.querySelectorAll('.hi'),
        { y: 16, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: header, start: 'top 82%' },
        }
      )

      /* Vertical thread draws as section scrolls */
      gsap.fromTo(thread,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const steps = [
    { num: t.proceso.step1_num, title: t.proceso.step1_title, body: t.proceso.step1_body },
    { num: t.proceso.step2_num, title: t.proceso.step2_title, body: t.proceso.step2_body },
    { num: t.proceso.step3_num, title: t.proceso.step3_title, body: t.proceso.step3_body },
  ]

  return (
    <section ref={sectionRef} style={{ position: 'relative', background: '#050C14' }}>

      {/* ── Left-margin gold thread ─────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        left: 'clamp(1.2rem, 2.5vw, 2.8rem)',
        width: '1px',
        background: 'rgba(196,163,90,0.07)',
        zIndex: 6,
        pointerEvents: 'none',
      }}>
        <div
          ref={threadRef}
          style={{
            position:        'absolute',
            inset:            0,
            background:      'linear-gradient(to bottom, rgba(196,163,90,0.5), rgba(196,163,90,0.2))',
            transformOrigin: 'top center',
            transform:       'scaleY(0)',
          }}
        />
        {/* Node markers */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position:    'absolute',
            top:          `${16.5 + i * 33.3}%`,
            left:         '50%',
            transform:   'translate(-50%, -50%)',
            width:        '4px',
            height:       '4px',
            borderRadius: '50%',
            background:  'var(--color-gold)',
            opacity:      0.35,
          }} />
        ))}
      </div>

      {/* ── Section header ──────────────────────────────── */}
      <div
        ref={headerRef}
        style={{
          maxWidth: 'var(--container-max)',
          margin:   '0 auto',
          padding:  `clamp(5rem, 8vw, 9rem) clamp(3rem, 6vw, 7rem) clamp(3rem, 4vw, 4rem)`,
          display:  'flex',
          alignItems: 'baseline',
          gap: '1.5rem',
        }}
      >
        <span className="hi" style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.56rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color:          'rgba(196,163,90,0.5)',
          whiteSpace:    'nowrap',
        }}>
          {t.proceso.label}
        </span>
        <div className="hi" style={{
          flex:       1,
          height:     '1px',
          background: 'rgba(196,163,90,0.08)',
          maxWidth:   '120px',
        }} />
      </div>

      {/* ── Step blocks ─────────────────────────────────── */}
      {steps.map((s, i) => (
        <StepBlock
          key={i}
          num={s.num}
          title={s.title}
          body={s.body}
          image={STEP_META[i].image}
          imageLeft={STEP_META[i].imageLeft}
          bg={STEP_META[i].bg}
        />
      ))}

      {/* ── Bottom breathing room ───────────────────────── */}
      <div style={{ height: 'clamp(4rem, 6vw, 7rem)', background: '#050C14' }} />
    </section>
  )
}
