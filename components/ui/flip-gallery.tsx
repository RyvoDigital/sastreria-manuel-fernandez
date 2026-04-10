'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type GalleryImage = { title: string; url: string }

export type FlipGalleryProps = {
  images: GalleryImage[]
  id?: string
  width?: number
  height?: number
  onIndexChange?: (index: number) => void
}

// ─── Flip animation keyframes ─────────────────────────────────────────────────

const FLIP_SPEED = 720
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

// ─── Scoped CSS ───────────────────────────────────────────────────────────────

const buildCSS = (id: string) => `
  #${id} { position: relative; }


  /* Half containers */
  #${id} > .mf-fg-half {
    position: absolute;
    width: 100%;
    height: 50%;
    overflow: hidden;
  }

  #${id} > .mf-fg-top,
  #${id} > .mf-fg-overlay-top {
    top: 0;
    transform-origin: bottom center;
  }

  #${id} > .mf-fg-bottom,
  #${id} > .mf-fg-overlay-bottom {
    bottom: 0;
    transform-origin: top center;
  }

  /*
   * BUG FIX: each img is 200% tall relative to its 50%-height parent,
   * which equals the full card height. top-half shows top portion,
   * bottom-half shows bottom portion — no more doubling.
   */
  #${id} > .mf-fg-top img,
  #${id} > .mf-fg-overlay-top img {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 200%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  #${id} > .mf-fg-bottom img,
  #${id} > .mf-fg-overlay-bottom img {
    position: absolute;
    bottom: 0; left: 0;
    width: 100%;
    height: 200%;
    object-fit: cover;
    object-position: center bottom;
    display: block;
  }
`

// ─── Component ────────────────────────────────────────────────────────────────

export function FlipGallery({
  images,
  id = 'mf-flip-gallery',
  width = 360,
  height = 580,
  onIndexChange,
}: FlipGalleryProps) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const halvesRef     = useRef<HTMLElement[]>([])
  const currentIdxRef = useRef(0)
  const [displayIdx, setDisplayIdx] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    halvesRef.current = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('.mf-fg-half')
    )
    halvesRef.current.forEach((el) => setHalfSrc(el, images[0].url))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setHalfSrc = (wrapperEl: HTMLElement, url: string) => {
    const img = wrapperEl.querySelector<HTMLImageElement>('img')
    if (img) img.src = url
  }

  const flipTo = (nextIdx: number, reverse: boolean) => {
    const gallery = containerRef.current
    if (!gallery) return

    const topAnim    = reverse ? flipAnimationTopReverse    : flipAnimationTop
    const bottomAnim = reverse ? flipAnimationBottomReverse : flipAnimationBottom

    gallery.querySelector<HTMLElement>('.mf-fg-overlay-top')?.animate(topAnim, flipTiming)
    gallery.querySelector<HTMLElement>('.mf-fg-overlay-bottom')?.animate(bottomAnim, flipTiming)

    halvesRef.current.forEach((el, idx) => {
      const isSecondaryHalf = idx === 1 || idx === 2
      const delay = (reverse && !isSecondaryHalf) || (!reverse && isSecondaryHalf)
        ? FLIP_SPEED - 200
        : 0
      setTimeout(() => setHalfSrc(el, images[nextIdx].url), delay)
    })
  }

  const navigate = (increment: number) => {
    const next    = (currentIdxRef.current + increment + images.length) % images.length
    const reverse = increment < 0
    currentIdxRef.current = next
    setDisplayIdx(next)
    onIndexChange?.(next)
    flipTo(next, reverse)
  }

  const pad = (n: number) => String(n + 1).padStart(2, '0')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: buildCSS(id) }} />

      <div style={{ display: 'inline-flex', flexDirection: 'column' }}>

        {/* Card shell */}
        <div style={{
          position:   'relative',
          boxShadow:  '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.15)',
        }}>
          {/* Flip card */}
          <div
            id={id}
            ref={containerRef}
            style={{ width: `${width}px`, height: `${height}px`, perspective: '1000px' }}
          >
            {/* Background (static, always current image) */}
            <div className="mf-fg-half mf-fg-top">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[0].url} alt="" />
            </div>
            <div className="mf-fg-half mf-fg-bottom">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[0].url} alt="" />
            </div>
            {/* Animated overlays */}
            <div className="mf-fg-half mf-fg-overlay-top">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[0].url} alt="" />
            </div>
            <div className="mf-fg-half mf-fg-overlay-bottom">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[0].url} alt="" />
            </div>
          </div>

          {/* Progress bar — thin gold fill at bottom of card */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '2px',
            background: 'rgba(201,168,76,0.12)',
            zIndex: 30,
          }}>
            <div style={{
              height:     '100%',
              width:      `${((displayIdx + 1) / images.length) * 100}%`,
              background: 'rgba(201,168,76,0.7)',
              transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
        </div>

        {/* Controls row */}
        <div style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          paddingTop:      '1.1rem',
          width:           `${width}px`,
        }}>

          {/* Current category label */}
          <div style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.6rem',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color:         '#C9A84C',
            opacity:        0.8,
          }}>
            {images[displayIdx].title}
          </div>

          {/* Counter + navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              fontFamily:    'var(--font-sans)',
              fontSize:      '0.58rem',
              letterSpacing: '0.12em',
              color:         'rgba(201,168,76,0.4)',
            }}>
              {pad(displayIdx)} — {pad(images.length - 1)}
            </span>

            {/* Prev */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Anterior"
              style={{
                width:      '30px',
                height:     '30px',
                display:    'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border:     '1px solid rgba(201,168,76,0.2)',
                color:      'rgba(201,168,76,0.55)',
                cursor:     'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget
                t.style.borderColor = 'rgba(201,168,76,0.6)'
                t.style.color = '#C9A84C'
                t.style.background = 'rgba(201,168,76,0.08)'
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget
                t.style.borderColor = 'rgba(201,168,76,0.2)'
                t.style.color = 'rgba(201,168,76,0.55)'
                t.style.background = 'none'
              }}
            >
              <ChevronLeft size={13} strokeWidth={1.5} />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={() => navigate(1)}
              aria-label="Siguiente"
              style={{
                width:      '30px',
                height:     '30px',
                display:    'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border:     '1px solid rgba(196,163,90,0.18)',
                color:      'rgba(196,163,90,0.5)',
                cursor:     'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget
                t.style.borderColor = 'rgba(196,163,90,0.55)'
                t.style.color = 'rgba(196,163,90,0.95)'
                t.style.background = 'rgba(196,163,90,0.05)'
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget
                t.style.borderColor = 'rgba(201,168,76,0.2)'
                t.style.color = 'rgba(201,168,76,0.55)'
                t.style.background = 'none'
              }}
            >
              <ChevronRight size={13} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
