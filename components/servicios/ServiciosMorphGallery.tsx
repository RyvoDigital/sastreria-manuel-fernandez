'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type AnimationPhase = 'scatter' | 'line' | 'circle' | 'bottom-strip'

interface FlipCardTarget {
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
}

interface FlipCardProps {
  src: string
  index: number
  total: number
  phase: AnimationPhase
  target: FlipCardTarget
  serviceName: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const IMG_WIDTH  = 55
const IMG_HEIGHT = 78
const TOTAL_IMAGES = 20
const MAX_SCROLL   = 3000

const SERVICE_NAMES = [
  'Traje a Medida',
  'Chaqueta Deportiva',
  'Pantalón a Medida',
  'Abrigo a Medida',
  'Traje de Novio',
  'Arreglos & Renovación',
]

const IMAGES = [
  '/photos/cutting-fabric-wide.jpg',
  '/photos/cutting-table.jpg',
  '/photos/cutting-tweed.jpg',
  '/photos/sleeve-buttons.jpg',
  '/photos/velvet-lining.jpg',
  '/photos/fitting-vest.jpg',
  '/photos/fabric-selection.jpg',
  '/photos/blue-plaid-form.jpg',
  '/photos/tailor-workshop.jpg',
  '/photos/madrid-tweed.jpg',
  '/photos/maestro-cutting-table.jpg',
  '/photos/camel-jacket-form.jpg',
  '/photos/mint-jacket-madrid.jpg',
  '/photos/purple-lining-interior.jpg',
  '/photos/measuring-tape.jpg',
  '/photos/scissors-cutting.jpg',
  '/photos/fabric-consultation.jpg',
  '/photos/showroom-suits.jpg',
  '/photos/cutting-table.jpg',   // repeat
  '/photos/sleeve-buttons.jpg',  // repeat
]

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t

// ─── Scoped CSS ───────────────────────────────────────────────────────────────

const CSS = `
  @keyframes mf-sm-fadeSlideIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .mf-sm-fade-in {
    animation: mf-sm-fadeSlideIn 0.8s ease-out forwards;
    opacity: 0;
  }
  .mf-sm-delay-100 { animation-delay: 0.1s; }
  .mf-sm-delay-200 { animation-delay: 0.2s; }
  .mf-sm-delay-300 { animation-delay: 0.3s; }
`

// ─── FlipCard ─────────────────────────────────────────────────────────────────

function FlipCard({ src, index, phase, target, serviceName }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: 'spring', stiffness: 40, damping: 15 }}
      style={{
        position: 'absolute',
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            borderRadius: '2px',
            boxShadow: '0 8px 32px rgba(5,12,20,0.4)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 h-full w-full flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--color-navy)',
            border: '1px solid rgba(196,163,90,0.25)',
            borderRadius: '2px',
            padding: '0.5rem',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.38rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(196,163,90,0.55)',
            marginBottom: '0.4rem',
            textAlign: 'center',
          }}>
            Servicio
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '0.55rem',
            color: 'var(--color-gold)',
            textAlign: 'center',
            lineHeight: 1.3,
          }}>
            {SERVICE_NAMES[index % SERVICE_NAMES.length]}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ServiciosMorphGallery() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>('scatter')
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Container size
  useEffect(() => {
    if (!containerRef.current) return
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height })
      }
    }
    const observer = new ResizeObserver(handleResize)
    observer.observe(containerRef.current)
    setContainerSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight })
    return () => observer.disconnect()
  }, [])

  // Virtual scroll
  const virtualScroll = useMotionValue(0)
  const scrollRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      const s = scrollRef.current
      // Allow page scroll at boundaries
      if ((e.deltaY > 0 && s >= MAX_SCROLL) || (e.deltaY < 0 && s <= 0)) return
      e.preventDefault()
      const newScroll = Math.min(Math.max(s + e.deltaY, 0), MAX_SCROLL)
      scrollRef.current = newScroll
      virtualScroll.set(newScroll)
    }

    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY
      touchStartY = e.touches[0].clientY
      const s = scrollRef.current
      if ((deltaY > 0 && s >= MAX_SCROLL) || (deltaY < 0 && s <= 0)) return
      e.preventDefault()
      const newScroll = Math.min(Math.max(s + deltaY, 0), MAX_SCROLL)
      scrollRef.current = newScroll
      virtualScroll.set(newScroll)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
    }
  }, [virtualScroll])

  const morphProgress  = useTransform(virtualScroll, [0, 600], [0, 1])
  const smoothMorph    = useSpring(morphProgress, { stiffness: 40, damping: 20 })
  const scrollRotate   = useTransform(virtualScroll, [600, 3000], [0, 360])
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 })

  const mouseX = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseX.set(normalizedX * 100)
    }
    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX])

  // Intro sequence
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase('line'), 500)
    const t2 = setTimeout(() => setIntroPhase('circle'), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Random scatter positions
  const scatterPositions = useMemo(() => IMAGES.map(() => ({
    x: (Math.random() - 0.5) * 1500,
    y: (Math.random() - 0.5) * 1000,
    rotation: (Math.random() - 0.5) * 180,
    scale: 0.6,
    opacity: 0,
  })), [])

  // Render loop values
  const [morphValue, setMorphValue] = useState(0)
  const [rotateValue, setRotateValue] = useState(0)
  const [parallaxValue, setParallaxValue] = useState(0)

  useEffect(() => {
    const u1 = smoothMorph.on('change', setMorphValue)
    const u2 = smoothScrollRotate.on('change', setRotateValue)
    const u3 = smoothMouseX.on('change', setParallaxValue)
    return () => { u1(); u2(); u3() }
  }, [smoothMorph, smoothScrollRotate, smoothMouseX])

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1])
  const contentY       = useTransform(smoothMorph, [0.8, 1], [20, 0])

  return (
    <section style={{ height: '100vh', overflow: 'hidden', background: 'var(--color-cream)', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <div className="flex h-full w-full flex-col items-center justify-center" style={{ perspective: '1000px' }}>

          {/* Intro text — fades out as morph begins */}
          <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={
                introPhase === 'circle' && morphValue < 0.5
                  ? { opacity: 1 - morphValue * 2, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, filter: 'blur(10px)' }
              }
              transition={{ duration: 1 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 400,
                color: 'var(--color-navy)',
                lineHeight: 1.1,
              }}
            >
              El Repertorio
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={
                introPhase === 'circle' && morphValue < 0.5
                  ? { opacity: 0.5 - morphValue }
                  : { opacity: 0 }
              }
              transition={{ duration: 1, delay: 0.2 }}
              style={{
                marginTop: '1rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(196,163,90,0.7)',
              }}
            >
              Descubra cada servicio — desplace para explorar
            </motion.p>
          </div>

          {/* Arc active text — fades in */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="absolute top-[8%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
          >
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.58rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(196,163,90,0.6)',
            }}>
              Pase el cursor para descubrir · Deslice para explorar
            </p>
          </motion.div>

          {/* Cards */}
          <div className="relative flex items-center justify-center w-full h-full">
            {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
              let target: FlipCardTarget = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 }

              if (introPhase === 'scatter') {
                target = scatterPositions[i]
              } else if (introPhase === 'line') {
                const lineSpacing = 65
                const lineTotalWidth = TOTAL_IMAGES * lineSpacing
                const lineX = i * lineSpacing - lineTotalWidth / 2
                target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 }
              } else {
                const isMobile = containerSize.width < 768
                const minDimension = Math.min(containerSize.width, containerSize.height)
                const circleRadius = Math.min(minDimension * 0.35, 350)
                const circleAngle = (i / TOTAL_IMAGES) * 360
                const circleRad = (circleAngle * Math.PI) / 180
                const circlePos = {
                  x: Math.cos(circleRad) * circleRadius,
                  y: Math.sin(circleRad) * circleRadius,
                  rotation: circleAngle + 90,
                }

                const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5)
                const arcRadius  = baseRadius * (isMobile ? 1.4 : 1.1)
                const arcApexY   = containerSize.height * (isMobile ? 0.35 : 0.25)
                const arcCenterY = arcApexY + arcRadius
                const spreadAngle = isMobile ? 100 : 130
                const startAngle  = -90 - spreadAngle / 2
                const step        = spreadAngle / (TOTAL_IMAGES - 1)

                const scrollProgress   = Math.min(Math.max(rotateValue / 360, 0), 1)
                const maxRotation      = spreadAngle * 0.8
                const boundedRotation  = -scrollProgress * maxRotation
                const currentArcAngle = startAngle + i * step + boundedRotation
                const arcRad = (currentArcAngle * Math.PI) / 180
                const arcPos = {
                  x: Math.cos(arcRad) * arcRadius + parallaxValue,
                  y: Math.sin(arcRad) * arcRadius + arcCenterY,
                  rotation: currentArcAngle + 90,
                  scale: isMobile ? 1.4 : 1.8,
                }

                target = {
                  x:        lerp(circlePos.x,        arcPos.x,        morphValue),
                  y:        lerp(circlePos.y,        arcPos.y,        morphValue),
                  rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                  scale:    lerp(1,                  arcPos.scale,    morphValue),
                  opacity:  1,
                }
              }

              return (
                <FlipCard
                  key={i}
                  src={src}
                  index={i}
                  total={TOTAL_IMAGES}
                  phase={introPhase}
                  target={target}
                  serviceName={SERVICE_NAMES[i % SERVICE_NAMES.length]}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
