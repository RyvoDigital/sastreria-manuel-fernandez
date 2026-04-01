'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type GalleryImage = {
  title: string
  url: string
}

export type FlipGalleryProps = {
  images: GalleryImage[]
  id?: string      // scopes all CSS selectors — must be unique per page
  width?: number   // card width in px
  height?: number  // card height in px
}

// ─── Animation keyframes ─────────────────────────────────────────────────────

const FLIP_SPEED = 750
const flipTiming: KeyframeAnimationOptions = { duration: FLIP_SPEED, iterations: 1 }

const flipAnimationTop: Keyframe[] = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
]
const flipAnimationBottom: Keyframe[] = [
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(0)' },
]
const flipAnimationTopReverse: Keyframe[] = [
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(0)' },
]
const flipAnimationBottomReverse: Keyframe[] = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
]

// ─── Scoped CSS (injected once per id) ───────────────────────────────────────

const buildCSS = (id: string, w: number, h: number) => `
  #${id} {
    position: relative;
  }

  /* Gold divider at card midpoint */
  #${id}::after {
    content: '';
    position: absolute;
    background: var(--color-gold, #C4A35A);
    opacity: 0.55;
    width: 100%;
    height: 1px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 10;
    pointer-events: none;
  }

  /* Category caption — appears below card via ::before */
  #${id}::before {
    content: attr(data-title);
    font-family: var(--font-sans, sans-serif);
    font-size: 0.62rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--color-gold, #C4A35A);
    position: absolute;
    left: 0;
    top: calc(100% + 1.25rem);
    width: 100%;
    text-align: left;
    opacity: var(--title-opacity, 0);
    transform: translateY(var(--title-y, 0.5rem));
    transition: opacity 450ms ease-in-out, transform 450ms ease-in-out;
    pointer-events: none;
  }

  /* Card halves */
  #${id} > .mf-fg-half {
    position: absolute;
    width: 100%;
    height: 50%;
    overflow: hidden;
    background-size: ${w}px ${h}px;
    background-repeat: no-repeat;
  }

  #${id} > .mf-fg-top,
  #${id} > .mf-fg-overlay-top {
    top: 0;
    transform-origin: bottom;
    background-position: top center;
  }

  #${id} > .mf-fg-bottom,
  #${id} > .mf-fg-overlay-bottom {
    bottom: 0;
    transform-origin: top;
    background-position: bottom center;
  }
`

// ─── Component ────────────────────────────────────────────────────────────────

export function FlipGallery({
  images,
  id = 'mf-flip-gallery',
  width = 340,
  height = 560,
}: FlipGalleryProps) {
  const containerRef   = useRef<HTMLDivElement>(null)
  const halvesRef      = useRef<HTMLElement[]>([])
  const currentIdxRef  = useRef(0)
  const [, forceRender] = useState(0) // only used to trigger re-render if needed

  // Initialise first image after mount
  useEffect(() => {
    if (!containerRef.current) return
    halvesRef.current = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('.mf-fg-half')
    )
    setAllHalves()
    showTitle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setAllHalves = () => {
    halvesRef.current.forEach((el) => {
      el.style.backgroundImage = `url('${images[currentIdxRef.current].url}')`
    })
  }

  const showTitle = () => {
    const el = containerRef.current
    if (!el) return
    el.setAttribute('data-title', images[currentIdxRef.current].title)
    el.style.setProperty('--title-opacity', '1')
    el.style.setProperty('--title-y', '0rem')
  }

  const hideTitle = () => {
    const el = containerRef.current
    if (!el) return
    el.style.setProperty('--title-opacity', '0')
    el.style.setProperty('--title-y', '0.5rem')
    el.setAttribute('data-title', '')
  }

  const flipTo = (nextIdx: number, reverse: boolean) => {
    const gallery = containerRef.current
    if (!gallery) return

    const topAnim    = reverse ? flipAnimationTopReverse    : flipAnimationTop
    const bottomAnim = reverse ? flipAnimationBottomReverse : flipAnimationBottom

    const overlayTop    = gallery.querySelector<HTMLElement>('.mf-fg-overlay-top')
    const overlayBottom = gallery.querySelector<HTMLElement>('.mf-fg-overlay-bottom')
    overlayTop?.animate(topAnim, flipTiming)
    overlayBottom?.animate(bottomAnim, flipTiming)

    hideTitle()

    // Update background images staggered so the flip looks physical
    halvesRef.current.forEach((el, idx) => {
      const isSecondaryHalf = idx === 1 || idx === 2
      const delay = (reverse && !isSecondaryHalf) || (!reverse && isSecondaryHalf)
        ? FLIP_SPEED - 200
        : 0
      setTimeout(() => {
        el.style.backgroundImage = `url('${images[nextIdx].url}')`
      }, delay)
    })

    // Reveal new caption mid-animation
    setTimeout(showTitle, FLIP_SPEED * 0.5)
  }

  const navigate = (increment: number) => {
    const next    = (currentIdxRef.current + increment + images.length) % images.length
    const reverse = increment < 0
    currentIdxRef.current = next
    flipTo(next, reverse)
    forceRender((n) => n + 1) // keep React in sync (optional, purely cosmetic)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: buildCSS(id, width, height) }} />

      {/* Outer wrapper — keeps caption space and nav together */}
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch' }}>

        {/* Card frame */}
        <div style={{
          border:     '1px solid rgba(196,163,90,0.18)',
          padding:    '5px',
          background: 'rgba(196,163,90,0.025)',
        }}>
          <div
            id={id}
            ref={containerRef}
            style={{ width: `${width}px`, height: `${height}px`, perspective: '800px' }}
          >
            <div className="mf-fg-half mf-fg-top" />
            <div className="mf-fg-half mf-fg-bottom" />
            <div className="mf-fg-half mf-fg-overlay-top" />
            <div className="mf-fg-half mf-fg-overlay-bottom" />
          </div>
        </div>

        {/* Navigation row — sits below caption space */}
        <div style={{
          display:        'flex',
          justifyContent: 'flex-end',
          gap:            '0.25rem',
          paddingTop:     '3rem',   /* clears the ::before caption */
        }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Anterior"
            style={{
              color:      'var(--color-gold)',
              opacity:     0.55,
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              padding:    '4px',
              display:    'flex',
              transition: 'opacity .2s, transform .2s',
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLButtonElement
              t.style.opacity = '1'
              t.style.transform = 'scale(1.2)'
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLButtonElement
              t.style.opacity = '0.55'
              t.style.transform = 'scale(1)'
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => navigate(1)}
            aria-label="Siguiente"
            style={{
              color:      'var(--color-gold)',
              opacity:     0.55,
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              padding:    '4px',
              display:    'flex',
              transition: 'opacity .2s, transform .2s',
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLButtonElement
              t.style.opacity = '1'
              t.style.transform = 'scale(1.2)'
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLButtonElement
              t.style.opacity = '0.55'
              t.style.transform = 'scale(1)'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  )
}
