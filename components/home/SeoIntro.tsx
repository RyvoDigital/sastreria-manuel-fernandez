'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-setup'
import { useI18n } from '@/lib/i18n'

/**
 * Muted body copy on dark ground, and the standard body colour.
 *
 * The scroll reveal brightens from one to the other. It deliberately animates
 * colour rather than opacity: this paragraph is the page's SEO copy, and text
 * that scrolls through a near-transparent state reads as hidden text. At its
 * dimmest this is still the colour the paragraph shipped with.
 */
const MUTED = 'rgba(255,255,255,0.72)'
const BRIGHT = '#FFFFFF' // var(--color-white), the globals.css body colour

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
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const copy = t.home.seo_intro

  useEffect(() => {
    const paragraph = paragraphRef.current
    if (!paragraph) return

    const words = paragraph.querySelectorAll('.reveal-word')
    if (!words.length) return

    // Reduced motion gets the finished state outright, with no ScrollTrigger.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(words, { color: BRIGHT })
      return
    }

    // Same pattern as ProcesoSection and TrajeEmpiezaSection: a scrubbed
    // ScrollTrigger inside a gsap.context that is reverted on cleanup. Lenis
    // drives real scroll position, so ScrollTrigger tracks it without any
    // extra wiring, exactly as the existing scrubbed sections do.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { color: MUTED },
        {
          color: BRIGHT,
          ease: 'none',
          duration: 1,
          stagger: { each: 0.5 },
          scrollTrigger: {
            trigger: paragraph,
            start: 'top 85%',
            end: 'bottom 45%',
            scrub: 1,
          },
        }
      )
    }, paragraph)

    return () => ctx.revert()
    // Re-runs on locale change: the word count and the spans change with it.
  }, [copy])

  // Split by word, never by character, and keep each separating space inside
  // its span as a real text node. The paragraph's text content stays byte for
  // byte identical to the dictionary string, so selection, copy and screen
  // readers are unaffected and a crawler extracts the same sentence.
  const words = copy.split(' ')

  return (
    <section
      style={{
        background: 'var(--color-navy)',
        padding: 'clamp(3.5rem, 8vw, 6rem) var(--container-padding)',
      }}
    >
      <p
        ref={paragraphRef}
        style={{
          maxWidth: '60ch',
          margin: '0 auto',
          textAlign: 'center',
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
          fontWeight: 300,
          lineHeight: 1.8,
          // Base colour, so the paragraph is legible with JavaScript disabled
          // and before the first ScrollTrigger tick.
          color: MUTED,
        }}
      >
        {words.map((word, i) => (
          <span key={i} className="reveal-word">
            {i < words.length - 1 ? `${word} ` : word}
          </span>
        ))}
      </p>
    </section>
  )
}
