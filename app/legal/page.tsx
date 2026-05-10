'use client'

import { useI18n } from '@/lib/i18n'

export default function LegalPage() {
  const { t } = useI18n()

  return (
    <div
      style={{
        minHeight: '100svh',
        background: 'var(--color-navy)',
        paddingTop: '120px',
        paddingBottom: '6rem',
        paddingLeft: 'var(--container-padding)',
        paddingRight: 'var(--container-padding)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 400,
            color: 'var(--color-offwhite)',
            marginBottom: '3rem',
          }}
        >
          {t.legal.title}
        </h1>

        <div
          style={{
            display: 'grid',
            gap: '2.5rem',
          }}
        >
          <section>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '1rem',
              }}
            >
              {t.legal.owner_title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(245,240,234,0.7)',
              }}
            >
              {t.legal.owner_name}
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '1rem',
              }}
            >
              {t.legal.address_title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(245,240,234,0.7)',
              }}
            >
              {t.legal.address}
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '1rem',
              }}
            >
              {t.legal.email_title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(245,240,234,0.7)',
              }}
            >
              {t.legal.email}
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '1rem',
              }}
            >
              {t.legal.phone_title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(245,240,234,0.7)',
              }}
            >
              {t.legal.phone}
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '1rem',
              }}
            >
              {t.legal.disclaimer_title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(245,240,234,0.7)',
              }}
            >
              {t.legal.disclaimer}
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '1rem',
              }}
            >
              {t.legal.copyright_title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(245,240,234,0.7)',
              }}
            >
              {t.legal.copyright}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
