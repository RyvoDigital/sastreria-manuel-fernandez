'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-setup'
import { responsive } from '@/lib/responsive-image'

// Full bleed, drawn taller than its frame by the drift and cropped to cover:
// measured widest 160vw at 390px, 100vw from 768px up.
const SIZES = '(max-width: 600px) 176vw, (max-width: 1100px) 111vw, 111vw'

/**
 * Image with a scrubbed parallax drift.
 *
 * Transform only, never opacity. The image and its alt are in the server HTML
 * and fully rendered with JavaScript disabled; GSAP only nudges the transform
 * of the inner element, so nothing here can leave content invisible. Same
 * scrubbed-ScrollTrigger pattern as la-sastreria/HistoriaSection.tsx.
 */
export function ParallaxFigure({
  src,
  alt,
  height = 'clamp(20rem, 42vw, 34rem)',
  drift = 40,
  objectPosition = 'center',
  priority = false,
}: {
  src: string
  alt: string
  height?: string
  drift?: number
  objectPosition?: string
  /** The first figure after a landing hero is partly in view on load: fetch it eagerly. */
  priority?: boolean
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    const img = imgRef.current
    if (!frame || !img) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.to(img, {
        y: -drift,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
      })
    }, frame)

    return () => ctx.revert()
  }, [drift])

  return (
    <div ref={frameRef} style={{ position: 'relative', overflow: 'hidden', height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        {...responsive(src, SIZES)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? undefined : 'async'}
        style={{
          position: 'absolute',
          inset: `-${drift}px 0 -${drift}px 0`,
          width: '100%',
          height: `calc(100% + ${drift * 2}px)`,
          objectFit: 'cover',
          objectPosition,
          display: 'block',
        }}
      />
    </div>
  )
}
