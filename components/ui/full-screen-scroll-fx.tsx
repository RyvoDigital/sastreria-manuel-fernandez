'use client'

import React, {
  CSSProperties,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── CSS (injected globally; classes prefixed .mf-fx-* to avoid collisions) ───
const CSS = `
  .mf-fx {
    width: 100%;
    overflow: hidden;
    background: var(--mf-fx-page-bg, #050C14);
    color: #000;
    font-family: var(--mf-fx-font);
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }

  .mf-fx-debug {
    position: fixed; bottom: 10px; right: 10px; z-index: 9999;
    background: rgba(255,255,255,0.8); color: #000; padding: 6px 8px;
    font: 12px/1 monospace; border-radius: 4px;
  }

  .mf-fx-fixed { position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; background: var(--mf-fx-page-bg, #050C14); }

  .mf-fx-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--mf-fx-gap, 1rem);
    padding: 0 var(--mf-fx-grid-px, 3rem);
    position: relative;
    height: 100%;
    z-index: 2;
  }

  .mf-fx-bgs { position: absolute; inset: 0; background: var(--mf-fx-stage-bg, #050C14); z-index: 1; }
  .mf-fx-bg  { position: absolute; inset: 0; }
  .mf-fx-bg-img {
    position: absolute; inset: -10% 0 -10% 0;
    width: 100%; height: 120%; object-fit: cover;
    filter: brightness(0.78) saturate(0.72);
    opacity: 0;
    will-change: transform, opacity;
  }
  .mf-fx-bg-overlay { position: absolute; inset: 0; background: var(--mf-fx-overlay, rgba(5,12,20,0.5)); }

  .mf-fx-header {
    grid-column: 1 / 13; align-self: start; padding-top: 5vh;
    font-family: var(--font-sans, sans-serif);
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    text-align: center;
    color: var(--mf-fx-text, rgba(245,240,234,0.92));
  }
  .mf-fx-header > * { display: block; }

  .mf-fx-content {
    grid-column: 1 / 13;
    position: absolute; inset: 0;
    display: grid; grid-template-columns: 1fr 1.3fr 1fr;
    align-items: center;
    height: 100%;
    padding: 0 var(--mf-fx-grid-px, 3rem);
  }

  .mf-fx-left, .mf-fx-right {
    height: 60vh;
    overflow: hidden;
    display: grid; align-content: center;
  }
  .mf-fx-left  { justify-items: start; }
  .mf-fx-right { justify-items: end; }
  .mf-fx-track { will-change: transform; }

  .mf-fx-item {
    color: var(--mf-fx-text, rgba(245,240,234,0.92));
    font-family: var(--font-sans, sans-serif);
    font-weight: 400;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    line-height: 1;
    margin: calc(var(--mf-fx-row-gap, 10px) / 2) 0;
    opacity: 0.35;
    position: relative;
    font-size: clamp(0.65rem, 1.1vw, 0.85rem);
    user-select: none;
    cursor: pointer;
  }
  .mf-fx-left-item.active,
  .mf-fx-right-item.active { opacity: 1; }
  .mf-fx-left-item.active  { transform: translateX(10px);  padding-left:  16px; }
  .mf-fx-right-item.active { transform: translateX(-10px); padding-right: 16px; }

  .mf-fx-left-item.active::before,
  .mf-fx-right-item.active::after {
    content: '';
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 5px; height: 5px;
    background: rgba(196,163,90,0.9);
    border-radius: 50%;
  }
  .mf-fx-left-item.active::before  { left: 0; }
  .mf-fx-right-item.active::after  { right: 0; }

  .mf-fx-center {
    display: grid; place-items: center; text-align: center; height: 60vh; overflow: hidden;
  }
  .mf-fx-featured          { position: absolute; opacity: 0; visibility: hidden; }
  .mf-fx-featured.active   { opacity: 1; visibility: visible; }
  .mf-fx-featured-title {
    margin: 0;
    color: var(--mf-fx-text, rgba(245,240,234,0.92));
    font-style: italic;
    font-weight: 400;
    letter-spacing: -0.02em;
    font-size: clamp(3rem, 8vw, 7rem);
  }
  .mf-fx-word-mask { display: inline-block; overflow: hidden; vertical-align: middle; }
  .mf-fx-word      { display: inline-block; vertical-align: middle; }

  .mf-fx-footer {
    grid-column: 1 / 13; align-self: end; padding-bottom: 5vh; text-align: center;
  }
  .mf-fx-footer-title {
    color: var(--mf-fx-text, rgba(245,240,234,0.92));
    font-size: clamp(1.6rem, 7vw, 7rem); font-weight: 900;
    letter-spacing: -0.01em; line-height: 0.9;
  }
  .mf-fx-progress {
    width: 200px; height: 1px; margin: 1rem auto 0;
    background: rgba(196,163,90,0.2); position: relative;
  }
  .mf-fx-progress-fill {
    position: absolute; inset: 0 auto 0 0; width: 0%;
    background: rgba(196,163,90,0.8); height: 100%;
    transition: width 0.3s ease;
  }
  .mf-fx-progress-numbers {
    position: absolute; inset: auto 0 100% 0;
    display: flex; justify-content: space-between;
    font-size: 0.65rem; letter-spacing: 0.1em;
    color: rgba(196,163,90,0.6);
    padding-bottom: 0.4rem;
    font-family: var(--font-sans, sans-serif);
  }

  .mf-fx-end { height: 100vh; display: grid; place-items: center; background: #050C14; }
  .mf-fx-fin { transform: rotate(90deg); color: rgba(245,240,234,0.08); font-family: var(--font-sans, sans-serif); font-size: 0.6rem; letter-spacing: 0.3em; }

  @media (max-width: 900px) {
    .mf-fx-content {
      grid-template-columns: 1fr; row-gap: 3vh;
      place-items: center;
    }
    .mf-fx-left, .mf-fx-right, .mf-fx-center { height: auto; }
    .mf-fx-left, .mf-fx-right { justify-items: center; }
    .mf-fx-track { transform: none !important; }
  }
`

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = {
  id?: string
  background: string
  leftLabel?: ReactNode
  title: string | ReactNode
  rightLabel?: ReactNode
  renderBackground?: (active: boolean, previous: boolean) => ReactNode
}

type Colors = Partial<{
  text: string
  overlay: string
  pageBg: string
  stageBg: string
}>

type Durations = Partial<{
  change: number
  snap: number
}>

export type FullScreenFXAPI = {
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  getIndex: () => number
  refresh: () => void
}

export type FullScreenFXProps = {
  sections: Section[]
  className?: string
  style?: CSSProperties

  fontFamily?: string
  header?: ReactNode
  footer?: ReactNode
  gap?: number
  gridPaddingX?: number

  showProgress?: boolean
  debug?: boolean

  durations?: Durations
  reduceMotion?: boolean
  smoothScroll?: boolean

  bgTransition?: 'fade' | 'wipe'
  parallaxAmount?: number

  currentIndex?: number
  onIndexChange?: (index: number) => void
  initialIndex?: number

  colors?: Colors

  apiRef?: React.Ref<FullScreenFXAPI>
  ariaLabel?: string
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

// ─── Component ────────────────────────────────────────────────────────────────

export const FullScreenScrollFX = forwardRef<HTMLDivElement, FullScreenFXProps>(
  (
    {
      sections,
      className,
      style,

      fontFamily = "var(--font-serif), 'Cormorant Garamond', Georgia, serif",
      header,
      footer,
      gap = 1,
      gridPaddingX = 3,

      showProgress = true,
      debug = false,

      durations = { change: 0.8, snap: 900 },
      reduceMotion,
      smoothScroll = false,

      bgTransition = 'fade',
      parallaxAmount = 4,

      currentIndex,
      onIndexChange,
      initialIndex = 0,

      colors = {
        text:    'rgba(245,240,234,0.92)',
        overlay: 'rgba(5,12,20,0.5)',
        pageBg:  '#050C14',
        stageBg: '#050C14',
      },

      apiRef,
      ariaLabel = 'Full screen scroll slideshow',
    },
    ref
  ) => {
    const total = sections.length
    const [localIndex, setLocalIndex] = useState(clamp(initialIndex, 0, Math.max(0, total - 1)))
    const isControlled = typeof currentIndex === 'number'
    const index = isControlled ? clamp(currentIndex!, 0, Math.max(0, total - 1)) : localIndex

    const rootRef      = useRef<HTMLDivElement | null>(null)
    const fixedRef     = useRef<HTMLDivElement | null>(null)
    const fixedSectionRef = useRef<HTMLDivElement | null>(null)

    const bgRefs   = useRef<HTMLImageElement[]>([])
    const wordRefs = useRef<HTMLSpanElement[][]>([])

    const leftTrackRef  = useRef<HTMLDivElement | null>(null)
    const rightTrackRef = useRef<HTMLDivElement | null>(null)
    const leftItemRefs  = useRef<HTMLDivElement[]>([])
    const rightItemRefs = useRef<HTMLDivElement[]>([])

    const progressFillRef   = useRef<HTMLDivElement | null>(null)
    const currentNumberRef  = useRef<HTMLSpanElement | null>(null)

    const stRef           = useRef<ScrollTrigger | null>(null)
    const lastIndexRef    = useRef(index)
    const isAnimatingRef  = useRef(false)
    const isSnappingRef   = useRef(false)
    const sectionTopRef   = useRef<number[]>([])

    const prefersReduced = useMemo(() => {
      if (typeof window === 'undefined') return false
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }, [])
    const motionOff = reduceMotion ?? prefersReduced

    // Word splitting for center title
    const tempWordBucket = useRef<HTMLSpanElement[]>([])
    const splitWords = (text: string) => {
      const words = text.split(/\s+/).filter(Boolean)
      return words.map((w, i) => (
        <span className="mf-fx-word-mask" key={i}>
          <span className="mf-fx-word" ref={(el) => { if (el) tempWordBucket.current.push(el) }}>{w}</span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))
    }
    const WordsCollector = ({ onReady }: { onReady: () => void }) => {
      useEffect(() => onReady(), []) // eslint-disable-line
      return null
    }

    const computePositions = () => {
      const el = fixedSectionRef.current
      if (!el) return
      const top = el.offsetTop
      const h   = el.offsetHeight
      const arr: number[] = []
      for (let i = 0; i < total; i++) arr.push(top + (h * i) / total)
      sectionTopRef.current = arr
    }

    const measureAndCenterLists = (toIndex = index, animate = true) => {
      const centerTrack = (
        container: HTMLDivElement | null,
        items: HTMLDivElement[],
        isRight: boolean
      ) => {
        if (!container || items.length === 0) return
        const first  = items[0]
        const second = items[1]
        const contRect = container.getBoundingClientRect()
        let rowH = first.getBoundingClientRect().height
        if (second) {
          rowH = second.getBoundingClientRect().top - first.getBoundingClientRect().top
        }
        const targetY = contRect.height / 2 - rowH / 2 - toIndex * rowH
        const prop = isRight ? rightTrackRef : leftTrackRef
        if (!prop.current) return
        if (animate) {
          gsap.to(prop.current, { y: targetY, duration: (durations.change ?? 0.8) * 0.9, ease: 'power3.out' })
        } else {
          gsap.set(prop.current, { y: targetY })
        }
      }

      measureRAF(() => {
        measureRAF(() => {
          centerTrack(leftTrackRef.current, leftItemRefs.current, false)
          centerTrack(rightTrackRef.current, rightItemRefs.current, true)
        })
      })
    }

    const measureRAF = (fn: () => void) => {
      if (typeof window === 'undefined') return
      requestAnimationFrame(() => requestAnimationFrame(fn))
    }

    useLayoutEffect(() => {
      if (typeof window === 'undefined') return
      const fixed = fixedRef.current
      const fs    = fixedSectionRef.current
      if (!fixed || !fs || total === 0) return

      gsap.set(bgRefs.current, { opacity: 0, scale: 1.04, yPercent: 0 })
      if (bgRefs.current[0]) gsap.set(bgRefs.current[0], { opacity: 1, scale: 1 })

      wordRefs.current.forEach((words, sIdx) => {
        words.forEach((w) => {
          gsap.set(w, {
            yPercent: sIdx === index ? 0 : 100,
            opacity:  sIdx === index ? 1 : 0,
          })
        })
      })

      computePositions()
      measureAndCenterLists(index, false)

      const st = ScrollTrigger.create({
        trigger:    fs,
        start:      'top top',
        end:        'bottom bottom',
        pin:        fixed,
        pinSpacing: true,
        onUpdate: (self) => {
          if (motionOff || isSnappingRef.current) return
          const prog   = self.progress
          const target = Math.min(total - 1, Math.floor(prog * total))
          if (target !== lastIndexRef.current && !isAnimatingRef.current) {
            const next = lastIndexRef.current + (target > lastIndexRef.current ? 1 : -1)
            goTo(next, false)
          }
          if (progressFillRef.current) {
            const p = (lastIndexRef.current / (total - 1 || 1)) * 100
            progressFillRef.current.style.width = `${p}%`
          }
        },
      })

      stRef.current = st

      if (initialIndex && initialIndex > 0 && initialIndex < total) {
        requestAnimationFrame(() => goTo(initialIndex, false))
      }

      const ro = new ResizeObserver(() => {
        computePositions()
        measureAndCenterLists(lastIndexRef.current, false)
        ScrollTrigger.refresh()
      })
      ro.observe(fs)

      return () => {
        ro.disconnect()
        st.kill()
        stRef.current = null
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total, initialIndex, motionOff, bgTransition, parallaxAmount])

    const changeSection = (to: number) => {
      if (to === lastIndexRef.current || isAnimatingRef.current) return
      const from = lastIndexRef.current
      const down = to > from
      isAnimatingRef.current = true

      if (!isControlled) setLocalIndex(to)
      onIndexChange?.(to)

      if (currentNumberRef.current) {
        currentNumberRef.current.textContent = String(to + 1).padStart(2, '0')
      }
      if (progressFillRef.current) {
        const p = (to / (total - 1 || 1)) * 100
        progressFillRef.current.style.width = `${p}%`
      }

      const D = durations.change ?? 0.8

      const outWords = wordRefs.current[from] || []
      const inWords  = wordRefs.current[to]   || []
      if (outWords.length) {
        gsap.to(outWords, {
          yPercent: down ? -100 : 100,
          opacity:  0,
          duration: D * 0.6,
          stagger:  down ? 0.03 : -0.03,
          ease:     'power3.out',
        })
      }
      if (inWords.length) {
        gsap.set(inWords, { yPercent: down ? 100 : -100, opacity: 0 })
        gsap.to(inWords, {
          yPercent: 0,
          opacity:  1,
          duration: D,
          stagger:  down ? 0.05 : -0.05,
          ease:     'power3.out',
        })
      }

      const prevBg = bgRefs.current[from]
      const newBg  = bgRefs.current[to]
      if (bgTransition === 'fade') {
        if (newBg) {
          gsap.set(newBg, { opacity: 0, scale: 1.04, yPercent: down ? 1 : -1 })
          gsap.to(newBg, { opacity: 1, scale: 1, yPercent: 0, duration: D, ease: 'power2.out' })
        }
        if (prevBg) {
          gsap.to(prevBg, { opacity: 0, yPercent: down ? -parallaxAmount : parallaxAmount, duration: D, ease: 'power2.out' })
        }
      } else {
        if (newBg) {
          gsap.set(newBg, { opacity: 1, clipPath: down ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)', scale: 1, yPercent: 0 })
          gsap.to(newBg, { clipPath: 'inset(0 0 0 0)', duration: D, ease: 'power3.out' })
        }
        if (prevBg) {
          gsap.to(prevBg, { opacity: 0, duration: D * 0.8, ease: 'power2.out' })
        }
      }

      measureAndCenterLists(to, true)

      leftItemRefs.current.forEach((el, i) => {
        el.classList.toggle('active', i === to)
        gsap.to(el, { opacity: i === to ? 1 : 0.35, x: i === to ? 10 : 0, duration: D * 0.6, ease: 'power3.out' })
      })
      rightItemRefs.current.forEach((el, i) => {
        el.classList.toggle('active', i === to)
        gsap.to(el, { opacity: i === to ? 1 : 0.35, x: i === to ? -10 : 0, duration: D * 0.6, ease: 'power3.out' })
      })

      gsap.delayedCall(D, () => {
        lastIndexRef.current  = to
        isAnimatingRef.current = false
      })
    }

    const goTo = (to: number, withScroll = true) => {
      const clamped = clamp(to, 0, total - 1)
      isSnappingRef.current = true
      changeSection(clamped)

      const pos    = sectionTopRef.current[clamped]
      const snapMs = durations.snap ?? 900

      if (withScroll && typeof window !== 'undefined') {
        window.scrollTo({ top: pos, behavior: 'smooth' })
        setTimeout(() => (isSnappingRef.current = false), snapMs)
      } else {
        setTimeout(() => (isSnappingRef.current = false), 10)
      }
    }

    const next = () => goTo(index + 1)
    const prev = () => goTo(index - 1)

    useImperativeHandle(apiRef, () => ({ next, prev, goTo, getIndex: () => index, refresh: () => ScrollTrigger.refresh() }))

    const handleJump = (i: number) => goTo(i)

    const handleLoadedStagger = () => {
      leftItemRefs.current.forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          { opacity: i === index ? 1 : 0.35, y: 0, duration: 0.5, delay: i * 0.06, ease: 'power3.out' }
        )
      })
      rightItemRefs.current.forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          { opacity: i === index ? 1 : 0.35, y: 0, duration: 0.5, delay: 0.2 + i * 0.06, ease: 'power3.out' }
        )
      })
    }

    useEffect(() => {
      handleLoadedStagger()
      measureAndCenterLists(index, false)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const cssVars: CSSProperties = {
      ['--mf-fx-font'     as string]: fontFamily,
      ['--mf-fx-text'     as string]: colors.text    ?? 'rgba(245,240,234,0.92)',
      ['--mf-fx-overlay'  as string]: colors.overlay ?? 'rgba(5,12,20,0.5)',
      ['--mf-fx-page-bg'  as string]: colors.pageBg  ?? '#050C14',
      ['--mf-fx-stage-bg' as string]: colors.stageBg ?? '#050C14',
      ['--mf-fx-gap'      as string]: `${gap}rem`,
      ['--mf-fx-grid-px'  as string]: `${gridPaddingX}rem`,
      ['--mf-fx-row-gap'  as string]: '10px',
    }

    return (
      <div
        ref={(node) => {
          ;(rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={['mf-fx', className].filter(Boolean).join(' ')}
        style={{ ...cssVars, ...style }}
        aria-label={ariaLabel}
      >
        {/* Inject styles once */}
        <style dangerouslySetInnerHTML={{ __html: CSS }} />

        {debug && <div className="mf-fx-debug">Section: {index}</div>}

        <div>
          {/* The scroll space — multiple viewport heights */}
          <div
            ref={fixedSectionRef}
            style={{ height: `${Math.max(1, total + 1) * 100}vh`, position: 'relative' }}
          >
            <div className="mf-fx-fixed" ref={fixedRef}>

              {/* Backgrounds */}
              <div className="mf-fx-bgs" aria-hidden="true">
                {sections.map((s, i) => (
                  <div className="mf-fx-bg" key={s.id ?? i}>
                    {s.renderBackground ? (
                      s.renderBackground(index === i, lastIndexRef.current === i)
                    ) : (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          ref={(el) => { if (el) bgRefs.current[i] = el }}
                          src={s.background}
                          alt=""
                          className="mf-fx-bg-img"
                        />
                        <div className="mf-fx-bg-overlay" />
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="mf-fx-grid">

                {/* Header */}
                {header && <div className="mf-fx-header">{header}</div>}

                {/* Content */}
                <div className="mf-fx-content">

                  {/* Left labels */}
                  <div className="mf-fx-left" role="list">
                    <div className="mf-fx-track" ref={leftTrackRef}>
                      {sections.map((s, i) => (
                        <div
                          key={`L-${s.id ?? i}`}
                          className={`mf-fx-item mf-fx-left-item${i === index ? ' active' : ''}`}
                          ref={(el) => { if (el) leftItemRefs.current[i] = el }}
                          onClick={() => handleJump(i)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={i === index}
                        >
                          {s.leftLabel}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Center title */}
                  <div className="mf-fx-center">
                    {sections.map((s, sIdx) => {
                      tempWordBucket.current = []
                      const isString = typeof s.title === 'string'
                      return (
                        <div
                          key={`C-${s.id ?? sIdx}`}
                          className={`mf-fx-featured${sIdx === index ? ' active' : ''}`}
                        >
                          <h3 className="mf-fx-featured-title">
                            {isString ? splitWords(s.title as string) : s.title}
                          </h3>
                          <WordsCollector
                            onReady={() => {
                              if (tempWordBucket.current.length) {
                                wordRefs.current[sIdx] = [...tempWordBucket.current]
                              }
                              tempWordBucket.current = []
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>

                  {/* Right labels */}
                  <div className="mf-fx-right" role="list">
                    <div className="mf-fx-track" ref={rightTrackRef}>
                      {sections.map((s, i) => (
                        <div
                          key={`R-${s.id ?? i}`}
                          className={`mf-fx-item mf-fx-right-item${i === index ? ' active' : ''}`}
                          ref={(el) => { if (el) rightItemRefs.current[i] = el }}
                          onClick={() => handleJump(i)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={i === index}
                        >
                          {s.rightLabel}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer + progress */}
                <div className="mf-fx-footer">
                  {footer && <div className="mf-fx-footer-title">{footer}</div>}
                  {showProgress && (
                    <div className="mf-fx-progress">
                      <div className="mf-fx-progress-numbers">
                        <span ref={currentNumberRef}>{String(index + 1).padStart(2, '0')}</span>
                        <span>{String(total).padStart(2, '0')}</span>
                      </div>
                      <div className="mf-fx-progress-fill" ref={progressFillRef} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* End spacer */}
          <div className="mf-fx-end">
            <p className="mf-fx-fin">fin</p>
          </div>
        </div>
      </div>
    )
  }
)

FullScreenScrollFX.displayName = 'FullScreenScrollFX'
