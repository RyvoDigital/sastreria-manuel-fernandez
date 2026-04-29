'use client'

import { useRef, useState } from 'react'
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
        backgroundImage: "url('https://res.cloudinary.com/dwruvre6o/image/upload/v1777471216/photos/others/IMG_1261_zlo3zc')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(10,22,40,0.3) 0%, rgba(10,22,40,0.1) 50%, rgba(10,22,40,0.5) 100%)',
      }} />
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
          color: 'rgba(201,168,76,0.8)',
          marginBottom: '1rem',
        }}>
          Sastrería Manuel Fernández
        </div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          fontWeight: 400,
          color: '#FFFFFF',
          lineHeight: 1.1,
        }}>
          Pure Bespoke
        </div>
      </div>
    </motion.div>
  )
}

// ─── Parallax floating images ─────────────────────────────────────────────────

interface ParallaxImgProps {
  imgStyle: React.CSSProperties
  alt: string
  src: string
  start: number
  end: number
}

const ParallaxImg = ({ imgStyle, alt, src, start, end }: ParallaxImgProps) => {
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
      ref={ref}
      style={{ ...imgStyle, transform, opacity, display: 'block' }}
    />
  )
}

const ParallaxImages = () => {
  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '200px 2rem 0' }}>
      <ParallaxImg
        src="https://res.cloudinary.com/dwruvre6o/image/upload/v1777471119/photos/others/IMG_1435_brue5b"
        alt="Cinta métrica sobre patrón"
        start={-200}
        end={200}
        imgStyle={{ width: '32%' }}
      />
      <ParallaxImg
        src="https://res.cloudinary.com/dwruvre6o/image/upload/v1777471137/photos/others/IMG_0884_vcpsgb"
        alt="Consulta de tejidos"
        start={200}
        end={-250}
        imgStyle={{ width: '60%', margin: '0 auto' }}
      />
      <ParallaxImg
        src="https://res.cloudinary.com/dwruvre6o/image/upload/v1776797368/photos/scissors-cutting_vyt9my"
        alt="Corte con tijeras"
        start={-200}
        end={200}
        imgStyle={{ width: '32%', marginLeft: 'auto' }}
      />
      <ParallaxImg
        src="https://res.cloudinary.com/dwruvre6o/image/upload/v1776797407/photos/showroom-suits_zqmscd"
        alt="Showroom trajes"
        start={0}
        end={-500}
        imgStyle={{ width: '40%', marginLeft: '8rem' }}
      />
    </div>
  )
}

// ─── Services list with hover animations ─────────────────────────────────────

const ServiceItem = ({
  num, title, duration, index,
}: { num: string; title: string; duration: string; index: number }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.75, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        padding: '1.4rem 0.75rem',
        gap: '1rem',
        cursor: 'default',
        transition: 'background 0.3s ease',
        background: hovered ? 'rgba(201,168,76,0.05)' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem' }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.55rem',
          letterSpacing: '0.18em',
          color: hovered ? '#C9A84C' : 'rgba(201,168,76,0.5)',
          transition: 'color 0.3s ease',
          minWidth: '1.6rem',
        }}>{num}</span>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
          fontWeight: 400,
          color: hovered ? '#E8D5A3' : '#FFFFFF',
          letterSpacing: '0.02em',
          transition: 'color 0.3s ease, transform 0.3s ease',
          transform: hovered ? 'translateX(6px)' : 'translateX(0)',
          display: 'inline-block',
        }}>{title}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Expanding gold rule on hover */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, #C9A84C, transparent)',
          transition: 'width 0.4s ease',
          width: hovered ? '4rem' : '0',
          overflow: 'hidden',
        }} />
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.58rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: hovered ? '#C9A84C' : 'rgba(201,168,76,0.6)',
          whiteSpace: 'nowrap',
          transition: 'color 0.3s ease',
        }}>{duration}</span>
      </div>
    </motion.div>
  )
}

const ServiciosList = () => {
  const { t } = useI18n()
  const s = t.servicios.services

  return (
    <section style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1rem 8rem' }}>

      {/* Gold sweep line */}
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        viewport={{ once: true }}
        style={{
          height: '1px',
          background: 'linear-gradient(to right, #C9A84C, rgba(201,168,76,0.2))',
          marginBottom: '2rem',
          opacity: 0.45,
        }}
      />

      {/* Small caps label */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.6rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.6)',
          marginBottom: '1rem',
        }}
      >
        {t.servicios.hero.label}
      </motion.p>

      <ServiceItem num={s.s1_num} title={s.s1_title} duration={s.s1_duration} index={0} />
      <ServiceItem num={s.s2_num} title={s.s2_title} duration={s.s2_duration} index={1} />
      <ServiceItem num={s.s3_num} title={s.s3_title} duration={s.s3_duration} index={2} />
      <ServiceItem num={s.s4_num} title={s.s4_title} duration={s.s4_duration} index={3} />
      <ServiceItem num={s.s5_num} title={s.s5_title} duration={s.s5_duration} index={4} />
      <ServiceItem num={s.s6_num} title={s.s6_title} duration={s.s6_duration} index={5} />
      <ServiceItem num={s.s7_num} title={s.s7_title} duration={s.s7_duration} index={6} />
      <ServiceItem num={s.s8_num} title={s.s8_title} duration={s.s8_duration} index={7} />
      <ServiceItem num={s.s9_num} title={s.s9_title} duration={s.s9_duration} index={8} />
      <ServiceItem num={s.s10_num} title={s.s10_title} duration={s.s10_duration} index={9} />
    </section>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ServiciosHero() {
  return (
    <div style={{ background: '#0A1628' }}>
      <div style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)`, position: 'relative', width: '100%' }}>
        <CenterImage />
        <ParallaxImages />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '24rem',
          background: 'linear-gradient(to bottom, rgba(10,22,40,0) 0%, #0A1628 100%)',
        }} />
      </div>
      <ServiciosList />
    </div>
  )
}
