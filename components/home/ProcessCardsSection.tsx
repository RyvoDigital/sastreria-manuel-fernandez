'use client'

import Image from 'next/image'
import { useI18n } from '@/lib/i18n'

const CARD_IMAGES = [
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/others/IMG_1648_mthpln',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/others/IMG_0150_qzf8st',
  'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/others/IMG_1277_e8nsav',
]

interface CardProps {
  num: string
  title: string
  body: string
  image: string
  index: number
}

function ProcessCard({ num, title, body, image, index }: CardProps) {
  return (
    <div style={{
      position:  'sticky',
      top:        0,
      height:    '100vh',
      width:     '100%',
      zIndex:     index + 1,
      overflow:  'hidden',
    }}>
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src={image}
            alt={title}
            fill
            style={{
              objectFit:   'cover',
              filter:      'brightness(0.32) saturate(0.5)',
            }}
            unoptimized
          />
        </div>

        {/* Dark overlay */}
        <div style={{
          position:   'absolute',
          inset:       0,
          background: 'rgba(10,22,40,0.7)',
        }} />

        {/* Ghost numeral watermark */}
        <div style={{
          position:      'absolute',
          bottom:        '-0.05em',
          right:         '-0.02em',
          fontFamily:    'var(--font-serif)',
          fontSize:      'clamp(14rem, 28vw, 30rem)',
          lineHeight:     1,
          fontWeight:     400,
          letterSpacing: '-0.04em',
          color:         'rgba(201,168,76,0.06)',
          userSelect:    'none',
          pointerEvents: 'none',
          zIndex:         1,
        }}>
          {num}
        </div>

        {/* Content — centered */}
        <div style={{
          position:   'absolute',
          top:        '50%',
          left:       '50%',
          transform:  'translate(-50%, -50%)',
          zIndex:      2,
          display:    'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign:  'center',
          width:      'min(600px, 85vw)',
        }}>
          {/* Step label */}
          <div style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.55rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color:          'var(--color-gold)',
            marginBottom:  '1.4rem',
            opacity:        0.8,
          }}>
            Paso {num}
          </div>

          {/* Gold rule */}
          <div style={{
            width:        '40px',
            height:       '1px',
            background:   'rgba(196,163,90,0.4)',
            marginBottom: '2rem',
          }} />

          {/* Title */}
          <h2 style={{
            fontFamily:    'var(--font-serif)',
            fontSize:      'clamp(3rem, 6vw, 5.5rem)',
            fontWeight:     400,
            lineHeight:     1.05,
            letterSpacing: '-0.01em',
            color:          '#FFFFFF',
            fontStyle:     'italic',
            marginBottom:  '2rem',
          }}>
            {title}
          </h2>

          {/* Body */}
          <p style={{
            fontFamily:  'var(--font-sans)',
            fontSize:    'clamp(0.8rem, 1vw, 0.95rem)',
            fontWeight:   300,
            lineHeight:   1.9,
            color:        'rgba(255,255,255,0.6)',
            maxWidth:    '420px',
          }}>
            {body}
          </p>
        </div>

        {/* Bottom edge gold accent */}
        <div style={{
          position:   'absolute',
          bottom:      0,
          left:        0,
          right:       0,
          height:     '1px',
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)',
          zIndex:      2,
        }} />

        {/* Step counter — bottom right */}
        <div style={{
          position:      'absolute',
          bottom:        '2.5rem',
          right:         'clamp(2rem, 4vw, 4rem)',
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.52rem',
          letterSpacing: '0.25em',
          color:         'rgba(201,168,76,0.4)',
          zIndex:         3,
          textTransform: 'uppercase',
        }}>
          {num} / 03
        </div>
    </div>
  )
}

export function ProcessCardsSection() {
  const { t } = useI18n()

  const steps = [
    { num: t.proceso.step1_num, title: t.proceso.step1_title, body: t.proceso.step1_body },
    { num: t.proceso.step2_num, title: t.proceso.step2_title, body: t.proceso.step2_body },
    { num: t.proceso.step3_num, title: t.proceso.step3_title, body: t.proceso.step3_body },
  ]

  return (
    <section style={{ background: '#0A1628' }}>
      {steps.map((step, i) => (
        <ProcessCard
          key={i}
          num={step.num}
          title={step.title}
          body={step.body}
          image={CARD_IMAGES[i]}
          index={i}
        />
      ))}
    </section>
  )
}
