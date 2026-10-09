'use client'

import { useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useScene, highlight, depth, type SceneEnv } from '@/lib/scroll-scene'
import { Words } from '@/components/el-hilo/Words'
import { BookingLink } from '@/components/global/BookingLink'
import { useServiciosContent, HERO_IMG, GARMENTS, OVERVIEW, HOUSES } from './content'
import { CredLinks, HERO_EYEBROW, HERO_TITLE, MundoGlobe, Stats } from './shared'
import s from './servicios.module.css'

/* B · El probador: the garments part like a rail to show Pure Bespoke; the
   repertoire is one frame where each name is tried on in turn. */
const HERO_RUN = 100
const REP_RUN = 150
const DIM = 'rgba(255, 255, 255, 0.24)'

export function ServiciosB() {
  const c = useServiciosContent()
  const root = useRef<HTMLDivElement>(null)
  useScene(root, build, [c.locale])

  return (
    <div ref={root} className={s.page}>
      {/* HERO: the rail of garments parts to show the cloth and Pure Bespoke */}
      <section className={`${s.bHero} ${s.pin}`} style={{ '--run': HERO_RUN } as CSSProperties} data-b-hero>
        <div className={s.stage}>
          <div className={s.bHeroStatic}>
            <div className={s.bBack} data-b-back>
              <Image src={HERO_IMG} alt="" fill priority sizes="100vw" className={s.cover} />
              <div className={s.heroShade} />
            </div>
            <div className={s.heroCaption} data-b-caption>
              <span className={s.eyebrow}>{HERO_EYEBROW}</span>
              <p className={s.pure}>{HERO_TITLE}</p>
            </div>
          </div>
          <div className={s.bRail}>
            {GARMENTS.map((g, i) => (
              <div key={g.src} className={s.frame} data-b-garment>
                <Image src={g.src} alt={g.alt} fill priority={i < 2} sizes="(min-width: 900px) 25vw, 50vw" className={s.cover} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EL REPERTORIO: one frame, each garment tried on in turn */}
      <section className={`${s.bRep} ${s.pin}`} style={{ '--run': REP_RUN } as CSSProperties} aria-labelledby="h-servicios" data-b-rep>
        <div className={s.stage}>
          <div className={s.bRepBack} aria-hidden="true">
            {c.services.map((sv) => (
              <div key={sv.image} data-b-img>
                <Image src={sv.image} alt="" fill sizes="100vw" className={s.cover} />
              </div>
            ))}
          </div>
          <div className={s.bRepInner}>
            <h1 id="h-servicios" className={s.eyebrow}>
              {c.label}
            </h1>
            <div className={s.bRepTrack}>
            <span className={s.bProgress} aria-hidden="true" data-b-progress />
            <ul className={s.bRepList}>
              {c.services.map((sv) => (
                <li key={sv.title} className={s.bRepRow}>
                  <span className={s.bRepName} data-b-name>
                    {sv.title}
                  </span>
                  <span className={s.bRepThumb}>
                    <Image src={sv.image} alt="" fill sizes="64px" className={s.cover} />
                  </span>
                </li>
              ))}
            </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CREDENCIALES: the showroom opens from a slit, the headline over it */}
      <section aria-labelledby="h-cred" style={{ paddingTop: 'clamp(2rem, 1rem + 3vw, 5rem)' }}>
        <div className={s.bCredHead}>
          <div className={s.bCredPhoto} data-b-slit>
            <div className={s.depth} data-depth="6">
              <Image src={OVERVIEW.src} alt={OVERVIEW.alt} fill sizes="100vw" className={s.cover} />
            </div>
          </div>
          <div className={s.bCredText}>
            <span className={s.eyebrow}>{c.cred.badge}</span>
            <h2 id="h-cred" className={s.h2}>
              {c.cred.headline1} <em>{c.cred.headline2}</em>
            </h2>
          </div>
        </div>
        <div className={s.section} style={{ paddingTop: '3rem' }}>
          <div className={s.bCredBody}>
            <div>
              <p className={s.statement} data-hl>
                <Words text={c.cred.body} />
              </p>
              <CredLinks c={c.cred} />
              <div className={s.actions}>
                <BookingLink className={s.btnPrimary}>{c.cred.btn_primary}</BookingLink>
              </div>
            </div>
            <div>
              <Stats c={c.cred} className={s.bStats} />
              <span className={`${s.eyebrow} ${s.master}`}>{c.master}</span>
            </div>
          </div>
          <div className={s.houses}>
            <span className={s.eyebrow}>{c.housesLabel}</span>
            <ul className={s.bHousesList} data-b-houses>
              {HOUSES.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* EN EL MUNDO: the globe holds while the places are read */}
      <section className={s.section} aria-labelledby="h-mundo">
        <div className={`${s.mundoGrid} ${s.bMundoGrid}`}>
          <div className={s.bMundoText}>
            <span className={s.eyebrow}>{c.mundo.label}</span>
            <h2 id="h-mundo" className={s.h2}>
              {c.mundo.title}
            </h2>
            <p className={s.statement} style={{ marginTop: '2rem' }} data-hl>
              <Words text={c.mundo.p1} />
            </p>
            <p className={s.body} style={{ marginTop: '1.5rem' }}>
              {c.mundo.p2}
            </p>
            <ul className={s.cities} data-b-cities>
              {c.cities.map(([city, country]) => (
                <li key={city}>
                  <span>
                    <span className={s.city}>{city}</span> · {country}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={s.bGlobeCol}>
            <MundoGlobe />
          </div>
        </div>
      </section>
    </div>
  )
}

function build({ q, vh, touch, wide }: SceneEnv) {
  const k = wide ? 1 : 0.8

  // Hero: the garments part to either side; the cloth settles behind them.
  const hero = q('[data-b-hero]')[0]
  const garments = q('[data-b-garment]')
  // phone: a 2×2 rail, columns part left/right, top row first; desktop: four across, from the centre out
  const dx = wide ? [-105, -205, 205, 105] : [-105, 105, -105, 105]
  const at = wide ? [0.1, 0, 0, 0.1] : [0, 0, 0.15, 0.15]
  const htl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: () => `+=${(HERO_RUN * k * vh) / 100}`, scrub: true } })
  garments.forEach((g, i) => htl.to(g, { xPercent: dx[i], duration: 0.75 }, at[i]))
  htl.fromTo(q('[data-b-back]'), { scale: 1.18 }, { scale: 1, duration: 1 }, 0)
  htl.fromTo(q('[data-b-caption]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.45)

  depth(q('[data-depth]'), touch)
  q('[data-hl]').forEach((n) => highlight(n))

  // Repertorio: one name at a time is lit, its garment behind it.
  const rep = q('[data-b-rep]')[0]
  const names = q('[data-b-name]')
  const imgs = q('[data-b-img]')
  gsap.set(names, { color: DIM })
  gsap.set(names[0], { color: '#FFFFFF' })
  gsap.set(imgs[0], { opacity: 1 })
  const rtl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: rep, start: 'top top', end: () => `+=${(REP_RUN * k * vh) / 100}`, scrub: true } })
  for (let i = 1; i < names.length; i++) {
    rtl
      .to(names[i - 1], { color: DIM, duration: 0.3 }, i)
      .to(imgs[i - 1], { opacity: 0, duration: 0.3 }, i)
      .to(names[i], { color: '#FFFFFF', duration: 0.3 }, i)
      .to(imgs[i], { opacity: 1, duration: 0.3 }, i)
  }
  rtl.fromTo(q('[data-b-progress]'), { scaleY: 0.1 }, { scaleY: 1, duration: names.length - 0.7 }, 0)
  rtl.to({}, { duration: 0.5 })

  // Credenciales: the showroom opens from a slit across the middle.
  q('[data-b-slit]').forEach((p) =>
    gsap.fromTo(p, { clipPath: 'inset(46% 0% 46% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'top 25%', scrub: true } })
  )
  gsap.fromTo(q('[data-stat]'), { opacity: 0.2, y: 24 }, { opacity: 1, y: 0, ease: 'none', stagger: 0.3, scrollTrigger: { trigger: q('[data-stat]')[0], start: 'top 92%', end: 'top 60%', scrub: true } })

  // The fabric houses are read one after another.
  const houses = q('li', q('[data-b-houses]')[0])
  gsap.fromTo(houses, { opacity: 0.22 }, { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: houses[0], start: 'top 85%', end: () => `+=${vh * 0.6}`, scrub: true } })

  // Each place lights up in turn.
  const cities = q('li', q('[data-b-cities]')[0])
  gsap.fromTo(cities, { opacity: 0.3 }, { opacity: 1, ease: 'none', stagger: 0.15, scrollTrigger: { trigger: cities[0], start: 'top 85%', end: () => `+=${vh * 0.5}`, scrub: true } })
}
