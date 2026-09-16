'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-setup'

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
}: {
  src: string
  alt: string
  height?: string
  drift?: number
  objectPosition?: string
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
        src={src}
        alt={alt}
        loading="lazy"
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
