'use client'

import { useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScene, highlight, depth, speeds, type SceneEnv } from '@/lib/scroll-scene'
import { Words } from '@/components/el-hilo/Words'
import { BookingLink } from '@/components/global/BookingLink'
import { useServiciosContent, HERO_IMG, GARMENTS, OVERVIEW, HOUSES } from './content'
import { CredLinks, HERO_EYEBROW, HERO_TITLE, MundoGlobe, Stats } from './shared'
import s from './servicios.module.css'

/* A · El muestrario: the hero opens from a stitched swatch; the repertoire is
   an index whose sticky frame shows the garment being named. */
const HERO_RUN = 90
const GARMENT_SPEED = ['0.04', '0.22', '0.1', '0.3']

export function ServiciosA() {
  const c = useServiciosContent()
  const root = useRef<HTMLDivElement>(null)
  useScene(root, build, [c.locale])

  return (
    <div ref={root} className={s.page}>
      {/* HERO: a swatch of the cloth opens to the full screen */}
      <section className={`${s.aHero} ${s.pin}`} style={{ '--run': HERO_RUN } as CSSProperties} data-a-hero>
        <div className={s.stage}>
          <div className={s.aSwatch} data-a-swatch>
            <Image src={HERO_IMG} alt="" fill priority sizes="100vw" className={s.cover} data-a-swatch-img />
            <div className={s.heroShade} />
          </div>
          <span className={s.aStitch} aria-hidden="true" data-a-stitch />
          <div className={s.heroCaption}>
            <span className={s.eyebrow}>{HERO_EYEBROW}</span>
            <p className={s.pure}>{HERO_TITLE}</p>
          </div>
        </div>
      </section>

      {/* The four garments rise past it, each at its own depth */}
      <div className={s.aGarments}>
        {GARMENTS.map((g, i) => (
          <div key={g.src} className={`${s.frame} ${s.aGarment}`} data-speed={GARMENT_SPEED[i]}>
            <div className={s.depth} data-depth="7">
              <Image src={g.src} alt={g.alt} fill sizes="(min-width: 900px) 40vw, 90vw" className={s.cover} />
            </div>
          </div>
        ))}
      </div>

      {/* EL REPERTORIO: the index; the frame shows the garment on the line */}
      <section className={s.aRep} aria-labelledby="h-servicios">
        <span className={s.aRule} aria-hidden="true" data-a-rule />
        <h1 id="h-servicios" className={s.eyebrow}>
          {c.label}
        </h1>
        <div className={s.aRepGrid}>
          <div className={s.aRepFrame} aria-hidden="true">
            {c.services.map((sv) => (
              <div key={sv.image} className={s.aRepImg} data-a-img>
                <Image src={sv.image} alt="" fill sizes="(min-width: 900px) 45vw, 100vw" className={s.cover} />
              </div>
            ))}
          </div>
          <ul className={s.aRepList}>
            {c.services.map((sv) => (
              <li key={sv.title} className={s.aRepRow} data-a-row>
                <span className={s.aRepName}>{sv.title}</span>
                <span className={s.aRepThumb}>
                  <Image src={sv.image} alt="" fill sizes="72px" className={s.cover} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CREDENCIALES */}
      <section className={s.section} aria-labelledby="h-cred">
        <span className={s.eyebrow}>{c.cred.badge}</span>
        <h2 id="h-cred" className={s.h2}>
          {c.cred.headline1} <em>{c.cred.headline2}</em>
        </h2>
        <div className={s.aCredGrid}>
          <div>
            <p className={s.statement} data-hl>
              <Words text={c.cred.body} />
            </p>
            <CredLinks c={c.cred} />
            <div className={s.actions}>
              <BookingLink className={s.btnPrimary}>{c.cred.btn_primary}</BookingLink>
            </div>
          </div>
          <div className={`${s.frame} ${s.aOverview}`} data-a-cut>
            <div className={s.depth} data-depth="8">
              <Image src={OVERVIEW.src} alt={OVERVIEW.alt} fill sizes="(min-width: 900px) 45vw, 100vw" className={s.cover} />
            </div>
          </div>
        </div>
        <Stats c={c.cred} />
        <span className={`${s.eyebrow} ${s.master}`}>{c.master}</span>
        <div className={s.houses} data-a-houses-wrap>
          <span className={s.eyebrow}>{c.housesLabel}</span>
          <ul className={`${s.housesList} ${s.aHouses}`} data-a-houses>
            {HOUSES.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* EN EL MUNDO */}
      <section className={s.section} aria-labelledby="h-mundo">
        <span className={s.eyebrow}>{c.mundo.label}</span>
        <h2 id="h-mundo" className={s.h2}>
          {c.mundo.title}
        </h2>
        <div className={s.mundoGrid}>
          <div>
            <p className={s.statement} data-hl>
              <Words text={c.mundo.p1} />
            </p>
            <p className={s.body} style={{ marginTop: '1.5rem' }}>
              {c.mundo.p2}
            </p>
            <ul className={s.cities} data-a-cities>
              {c.cities.map(([city, country]) => (
                <li key={city}>
                  <span>
                    <span className={s.city}>{city}</span> · {country}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div data-speed="0.1">
            <MundoGlobe />
          </div>
        </div>
      </section>
    </div>
  )
}

function build({ q, vh, touch, wide }: SceneEnv) {
  // Hero: the swatch (and its stitched edge) opens out to the full screen.
  const hero = q('[data-a-hero]')[0]
  const from = wide ? { t: 24, x: 35 } : { t: 28, x: 10 }
  const run = (HERO_RUN * (wide ? 1 : 0.8) * vh) / 100
  const htl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: () => `+=${run}`, scrub: true } })
  htl
    .fromTo(q('[data-a-swatch]'), { clipPath: `inset(${from.t}% ${from.x}% ${from.t}% ${from.x}%)` }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0)
    .fromTo(q('[data-a-stitch]'), { top: `${from.t}%`, bottom: `${from.t}%`, left: `${from.x}%`, right: `${from.x}%` }, { top: '0%', bottom: '0%', left: '0%', right: '0%', duration: 1 }, 0)
    .to(q('[data-a-stitch]'), { opacity: 0, duration: 0.2 }, 0.8)
    .fromTo(q('[data-a-swatch-img]'), { scale: 1.3 }, { scale: 1, duration: 1 }, 0)

  depth(q('[data-depth]'), touch)
  speeds(q('[data-speed]'), vh, touch)
  q('[data-hl]').forEach((n) => highlight(n))

  // Repertorio: the rule draws, then each name crossing the line takes the frame.
  q('[data-a-rule]').forEach((r) => gsap.fromTo(r, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: r, start: 'top 90%', end: 'top 55%', scrub: true } }))
  const rows = q('[data-a-row]')
  const imgs = q('[data-a-img]')
  let cur = 0
  rows[0]?.setAttribute('data-on', '')
  const show = (i: number) => {
    if (i === cur) return
    gsap.to(imgs[cur], { opacity: 0, duration: 0.5, overwrite: true })
    gsap.to(imgs[i], { opacity: 1, duration: 0.5, overwrite: true })
    rows[cur].removeAttribute('data-on')
    rows[i].setAttribute('data-on', '')
    cur = i
  }
  const line = wide ? '52%' : '70%'
  // Entering a row from either direction takes the frame; above the first row the first garment shows.
  rows.forEach((r, i) =>
    ScrollTrigger.create({ trigger: r, start: `top ${line}`, end: `bottom ${line}`, onEnter: () => show(i), onEnterBack: () => show(i), onLeaveBack: i === 0 ? () => show(0) : undefined })
  )

  // The overview photograph is cut open from the left as it arrives.
  q('[data-a-cut]').forEach((f) =>
    gsap.fromTo(f, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: f, start: 'top 90%', end: 'top 45%', scrub: true } })
  )

  // The figures settle in one after another.
  gsap.fromTo(q('[data-stat]'), { opacity: 0.2, y: 24 }, { opacity: 1, y: 0, ease: 'none', stagger: 0.3, scrollTrigger: { trigger: q('[data-stat]')[0], start: 'top 92%', end: 'top 60%', scrub: true } })

  // The fabric houses run past like the names on a row of cloth bolts.
  const houses = q('[data-a-houses]')[0]
  const wrap = q('[data-a-houses-wrap]')[0]
  if (houses && wrap) {
    gsap.fromTo(houses, { x: () => window.innerWidth * 0.35 }, { x: () => -(houses.scrollWidth - window.innerWidth * 0.6), ease: 'none', scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } })
  }

  // Each place lights up in turn.
  const cities = q('li', q('[data-a-cities]')[0])
  gsap.fromTo(cities, { opacity: 0.3 }, { opacity: 1, ease: 'none', stagger: 0.15, scrollTrigger: { trigger: cities[0], start: 'top 85%', end: () => `+=${vh * 0.5}`, scrub: true } })

  return () => rows.forEach((r) => r.removeAttribute('data-on'))
}
