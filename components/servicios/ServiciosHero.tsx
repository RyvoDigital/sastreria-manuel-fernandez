'use client'

import { useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useI18n } from '@/lib/i18n'

const SECTION_HEIGHT = 1500

// ─── Center image — expands from clipped box as you scroll ────────────────────

const CenterImage = () => {
  const { scrollY } = useScroll()

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0])
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100])
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`

  const backgroundSize = useTransform(scrollY, [0, SECTION_HEIGHT + 500], ['170%', '100%'])
  const opacity = useTransform(scrollY, [SECTION_HEIGHT, SECTION_HEIGHT + 500], [1, 0])

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: 'url(/photos/cutting-fabric-wide.jpg)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(5,12,20,0.3) 0%, rgba(5,12,20,0.1) 50%, rgba(5,12,20,0.5) 100%)',
      }} />
      {/* Gold label centered on image */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.55rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(196,163,90,0.7)',
          marginBottom: '1rem',
        }}>
          Sastrería Manuel Fernández
        </div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          fontWeight: 400,
          color: 'rgba(245,240,234,0.92)',
          lineHeight: 1.1,
        }}>
          El Repertorio
        </div>
      </div>
    </motion.div>
  )
}

// ─── Parallax floating images ─────────────────────────────────────────────────

interface ParallaxImgProps {
  className: string
  alt: string
  src: string
  start: number
  end: number
}

const ParallaxImg = ({ className, alt, src, start, end }: ParallaxImgProps) => {
  const ref = useRef<HTMLImageElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  })

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85])
  const y = useTransform(scrollYProgress, [0, 1], [start, end])
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
    />
  )
}

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src="/photos/measuring-tape.jpg"
        alt="Cinta métrica sobre patrón"
        start={-200}
        end={200}
        className="w-1/3"
      />
      <ParallaxImg
        src="/photos/fabric-consultation.jpg"
        alt="Consulta de tejidos"
        start={200}
        end={-250}
        className="mx-auto w-2/3"
      />
      <ParallaxImg
        src="/photos/scissors-cutting.jpg"
        alt="Corte con tijeras"
        start={-200}
        end={200}
        className="ml-auto w-1/3"
      />
      <ParallaxImg
        src="/photos/showroom-suits.jpg"
        alt="Showroom trajes"
        start={0}
        end={-500}
        className="ml-24 w-5/12"
      />
    </div>
  )
}

// ─── Services list ────────────────────────────────────────────────────────────

const ServiceItem = ({
  num, title, duration,
}: { num: string; title: string; duration: string }) => (
  <motion.div
    initial={{ y: 48, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ ease: 'easeInOut', duration: 0.75 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(196,163,90,0.12)',
      padding: '1.4rem 0.75rem',
      gap: '1rem',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem' }}>
      <span style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.55rem',
        letterSpacing: '0.18em',
        color: 'rgba(196,163,90,0.45)',
      }}>{num}</span>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
        fontWeight: 400,
        color: 'var(--color-offwhite)',
        letterSpacing: '0.02em',
      }}>{title}</span>
    </div>
    <span style={{
      fontFamily: 'var(--font-sans)',
      fontSize: '0.58rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(196,163,90,0.5)',
      whiteSpace: 'nowrap',
    }}>{duration}</span>
  </motion.div>
)

const ServiciosList = () => {
  const { t } = useI18n()
  const s = t.servicios.services

  return (
    <section
      style={{
        maxWidth: '56rem',
        margin: '0 auto',
        padding: '0 1rem 8rem',
      }}
    >
      <motion.h2
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: 0.75 }}
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.6rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(196,163,90,0.55)',
          marginBottom: '3rem',
        }}
      >
        {t.servicios.hero.label}
      </motion.h2>

      <ServiceItem num={s.s1_num} title={s.s1_title} duration={s.s1_duration} />
      <ServiceItem num={s.s2_num} title={s.s2_title} duration={s.s2_duration} />
      <ServiceItem num={s.s3_num} title={s.s3_title} duration={s.s3_duration} />
      <ServiceItem num={s.s4_num} title={s.s4_title} duration={s.s4_duration} />
      <ServiceItem num={s.s5_num} title={s.s5_title} duration={s.s5_duration} />
      <ServiceItem num={s.s6_num} title={s.s6_title} duration={s.s6_duration} />
    </section>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ServiciosHero() {
  return (
    <div style={{ background: 'var(--color-navy)' }}>
      <div style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)`, position: 'relative', width: '100%' }}>
        <CenterImage />
        <ParallaxImages />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '24rem',
          background: 'linear-gradient(to bottom, rgba(5,12,20,0) 0%, #050C14 100%)',
        }} />
      </div>
      <ServiciosList />
    </div>
  )
}
