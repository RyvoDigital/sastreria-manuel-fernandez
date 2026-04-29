'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ────────────────────────────────────────────────────────────────────

type AnimationPhase = 'scatter' | 'line' | 'circle'

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

const IMG_WIDTH  = 150
const IMG_HEIGHT = 210
const TOTAL_IMAGES = 20
const MAX_SCROLL   = 3000

const SERVICE_NAMES = [
  'Traje a Medida',
  'Blazer',
  'Pantalón a Medida',
  'Abrigo a Medida',
  'Traje de Novio',
  'Arreglos',
]

const IMAGES = [
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471178/photos/others/IMG_0906_xstjfd',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471148/photos/others/IMG_0533_cdimyt',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471175/photos/others/IMG_0647_dwn1or',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471159/photos/others/IMG_0113_zuhjvb',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471138/photos/others/IMG_1740_yxf1hf',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471112/photos/others/IMG_1340_gym6me',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471131/photos/others/IMG_0700_jgiuxf',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471133/photos/others/IMG_1030_yxqooj',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471118/photos/others/IMG_1550_skrrjt',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471120/photos/others/IMG_0869_aizdli',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471109/photos/others/IMG_2700_c0glna',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471111/photos/others/IMG_1534_awbav4',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471127/photos/others/IMG_0111_n3syl0',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471126/photos/others/IMG_0529_nlsj3y',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471115/photos/others/IMG_0923_glk03z',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471105/photos/others/IMG_0856_svf406',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471097/photos/others/IMG_5035_g1d0lw',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471096/photos/others/IMG_0992_bpf2rv',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471094/photos/others/IMG_7030_fke2jz',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1777471093/photos/others/IMG_1109_kdabgf',
]

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t

// ─── FlipCard ─────────────────────────────────────────────────────────────────

function FlipCard({ src, index, target }: FlipCardProps) {
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
            boxShadow: '0 8px 32px rgba(5,12,20,0.25)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 h-full w-full flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--color-navy)',
            border: '1px solid rgba(196,163,90,0.3)',
            borderRadius: '2px',
            padding: '0.5rem',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
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
            fontSize: '0.9rem',
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
  const sectionRef  = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Container size tracking
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height })
      }
    })
    observer.observe(containerRef.current)
    setContainerSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight })
    return () => observer.disconnect()
  }, [])

  // Virtual scroll — driven by GSAP ScrollTrigger after intro completes
  const virtualScroll = useMotionValue(0)
  const scrollRef     = useRef(0)

  // Intro: scatter → line → circle
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase('line'),   500)
    const t2 = setTimeout(() => setIntroPhase('circle'), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // GSAP ScrollTrigger pin — fires once intro reaches 'circle'.
  // Pins the section for MAX_SCROLL pixels of scroll distance, driving the animation.
  // Fully reversible: scrolling back drives morphValue back toward 0, restoring the title.
  useEffect(() => {
    if (introPhase !== 'circle' || !sectionRef.current) return

    const el = sectionRef.current
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: `+=${MAX_SCROLL}`,
        pin: true,
        scrub: 1.2,
        onUpdate: (self) => {
          const val = self.progress * MAX_SCROLL
          scrollRef.current = val
          virtualScroll.set(val)
        },
      })
    })

    return () => ctx.revert()
  }, [introPhase, virtualScroll])

  // Mouse parallax
  const mouseX = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseX.set(normalizedX * 80)
    }
    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX])

  // Animation springs
  const morphProgress      = useTransform(virtualScroll, [0, 600], [0, 1])
  const smoothMorph        = useSpring(morphProgress, { stiffness: 40, damping: 20 })
  const scrollRotate       = useTransform(virtualScroll, [600, 3000], [0, 360])
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 })

  // Subscribe to render values
  const [morphValue,   setMorphValue]   = useState(0)
  const [rotateValue,  setRotateValue]  = useState(0)
  const [parallaxValue, setParallaxValue] = useState(0)

  useEffect(() => {
    const u1 = smoothMorph.on('change', setMorphValue)
    const u2 = smoothScrollRotate.on('change', setRotateValue)
    const u3 = smoothMouseX.on('change', setParallaxValue)
    return () => { u1(); u2(); u3() }
  }, [smoothMorph, smoothScrollRotate, smoothMouseX])

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1])
  const contentY       = useTransform(smoothMorph, [0.8, 1], [20, 0])

  // Stable random scatter positions
  const scatterPositions = useMemo(() => IMAGES.map(() => ({
    x: (Math.random() - 0.5) * 1500,
    y: (Math.random() - 0.5) * 1000,
    rotation: (Math.random() - 0.5) * 180,
    scale: 0.6,
    opacity: 0,
  })), [])

  // Title is visible when morphValue is low (either never scrolled or scrolled back)
  const titleVisible = introPhase === 'circle' && morphValue < 0.5

  return (
    <section
      ref={sectionRef}
      style={{ height: '100vh', background: 'var(--color-cream)', position: 'relative', overflow: 'hidden' }}
    >
      <div
        ref={containerRef}
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          {/* Title — fades out as morph starts, fades BACK IN when scrolling up */}
          <div
            className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}
          >
            <motion.h2
              animate={{
                opacity: titleVisible ? Math.max(0, 1 - morphValue * 2) : 0,
                y:       titleVisible ? 0 : 20,
                filter:  titleVisible ? 'blur(0px)' : 'blur(10px)',
              }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 400,
                color: 'var(--color-navy)',
                lineHeight: 1.1,
              }}
            >
              El Corte como Lenguaje
            </motion.h2>
            <motion.p
              animate={{ opacity: titleVisible ? Math.max(0, 0.5 - morphValue) : 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
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

          {/* Arc-state label */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="absolute top-[22%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
          >
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.58rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(196,163,90,0.6)',
              marginBottom: '0.75rem',
            }}>
              Pase el cursor para descubrir · Continúe desplazando
            </p>
            <div style={{
              width: '2rem', height: '1px',
              background: 'var(--color-gold)',
              opacity: 0.5,
              margin: '0 auto 0.75rem',
            }} />
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 400,
              color: 'var(--color-navy)',
              lineHeight: 1.1,
            }}>
              El Corte como Lenguaje
            </p>
          </motion.div>

          {/* Cards */}
          <div className="relative flex items-center justify-center w-full h-full">
            {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
              let target: FlipCardTarget = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 }

              if (introPhase === 'scatter') {
                target = scatterPositions[i]
              } else if (introPhase === 'line') {
                const lineSpacing = 170
                const lineTotalWidth = TOTAL_IMAGES * lineSpacing
                target = { x: i * lineSpacing - lineTotalWidth / 2, y: 0, rotation: 0, scale: 1, opacity: 1 }
              } else {
                const isMobile    = containerSize.width < 768
                const minDimension = Math.min(containerSize.width, containerSize.height)

                // Circle position
                const circleRadius = Math.min(minDimension * 0.35, 350)
                const circleAngle  = (i / TOTAL_IMAGES) * 360
                const circleRad   = (circleAngle * Math.PI) / 180
                const circlePos   = {
                  x: Math.cos(circleRad) * circleRadius,
                  y: Math.sin(circleRad) * circleRadius,
                  rotation: circleAngle + 90,
                }

                // Arc position
                const baseRadius    = Math.min(containerSize.width, containerSize.height * 1.5)
                const arcRadius     = baseRadius * (isMobile ? 1.4 : 1.1)
                const arcApexY      = containerSize.height * (isMobile ? 0.35 : 0.25)
                const arcCenterY    = arcApexY + arcRadius
                const spreadAngle   = isMobile ? 100 : 130
                const startAngle    = -90 - spreadAngle / 2
                const step          = spreadAngle / (TOTAL_IMAGES - 1)
                const scrollProgress  = Math.min(Math.max(rotateValue / 360, 0), 1)
                const boundedRotation = -scrollProgress * spreadAngle * 0.8
                const currentArcAngle = startAngle + i * step + boundedRotation
                const arcRad         = (currentArcAngle * Math.PI) / 180
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
