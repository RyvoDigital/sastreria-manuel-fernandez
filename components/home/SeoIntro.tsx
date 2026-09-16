'use client'

import { useI18n } from '@/lib/i18n'

/**
 * Plain-language description of the business, sitting directly below the hero.
 *
 * On 'use client': the handoff asks for a server component so the copy is in
 * the server HTML. It also asks for the string to live in all four
 * messages/*.json files and for the language switcher to swap it, and useI18n
 * is a client context, so the two cannot both hold in a server component.
 *
 * 'use client' is the one that satisfies both. Client components are still
 * server-rendered, and the i18n provider defaults to 'es' on the server, so
 * this paragraph is present in the raw HTML exactly as a crawler sees it. What
 * is genuinely absent from the server HTML is ContentProvider data, which is
 * fetched in a useEffect after hydration. This copy deliberately does not go
 * through getValue() for that reason.
 */
export function SeoIntro() {
  const { t } = useI18n()

  return (
    <section
      style={{
        background: 'var(--color-navy)',
        padding: 'clamp(3.5rem, 8vw, 6rem) var(--container-padding)',
      }}
    >
      <p
        style={{
          maxWidth: '60ch',
          margin: '0 auto',
          textAlign: 'center',
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
          fontWeight: 300,
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.72)',
        }}
      >
        {t.home.seo_intro}
      </p>
    </section>
  )
}
