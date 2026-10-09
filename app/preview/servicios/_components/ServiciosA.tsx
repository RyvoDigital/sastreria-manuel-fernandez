'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScene, highlight, depth, enter, type SceneEnv } from '@/lib/scroll-scene'
import { Words } from '@/components/el-hilo/Words'
import { BookingLink } from '@/components/global/BookingLink'
import { useServiciosContent, HERO_IMG, GARMENTS, OVERVIEW, HOUSES } from './content'
import { CredLinks, HERO_EYEBROW, HERO_TITLE, MundoGlobe, Stats } from './shared'
import s from './servicios.module.css'

/*
 * A · El muestrario, to the motion budget.
 *   The one moment: the repertoire index (the frame shows the garment named).
 *   The one highlight: the Credenciales paragraph.
 *   Drift (5%): the cloth swatch and the showroom photograph.
 *   Everything else is still, or enters once.
 */
export function ServiciosA() {
  const c = useServiciosContent()
  const root = useRef<HTMLDivElement>(null)
  useScene(root, build, [c.locale])

  return (
    <div ref={root} className={s.page}>
      {/* HERO: a swatch of the cloth in a stitched mount */}
      <section className={s.hero}>
        <div className={s.swatch}>
          <div className={s.swatchPhoto}>
            <div className={s.drift} data-depth="5">
              <Image src={HERO_IMG} alt="" fill priority sizes="100vw" className={s.cover} />
            </div>
            <div className={s.shade} />
          </div>
          <div className={s.caption}>
            <span className={s.eyebrow}>{HERO_EYEBROW}</span>
            <p className={s.pure}>{HERO_TITLE}</p>
          </div>
        </div>
      </section>

      {/* The four garments, edge to edge */}
      <div className={s.garments}>
        {GARMENTS.map((g) => (
          <div key={g.src} className={`${s.frame} ${s.garment}`}>
            <Image src={g.src} alt={g.alt} fill sizes="(min-width: 900px) 25vw, 50vw" className={s.cover} />
          </div>
        ))}
      </div>

      {/* EL REPERTORIO: the index; the frame shows the garment on the line */}
      <section className={s.section} aria-labelledby="h-servicios">
        <h1 id="h-servicios" className={s.eyebrow} data-enter>
          {c.label}
        </h1>
        <div className={s.repGrid}>
          <div className={s.repFrame} aria-hidden="true">
            {c.services.map((sv) => (
              <div key={sv.image} className={s.repImg} data-rep-img>
                <Image src={sv.image} alt="" fill sizes="(min-width: 900px) 42vw, 100vw" className={s.cover} />
              </div>
            ))}
          </div>
          <ul className={s.repList}>
            {c.services.map((sv) => (
              <li key={sv.title} className={s.repRow} data-rep-row>
                <span className={s.repName}>{sv.title}</span>
                <span className={s.repThumb}>
                  <Image src={sv.image} alt="" fill sizes="64px" className={s.cover} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CREDENCIALES */}
      <section className={s.section} aria-labelledby="h-cred">
        <div className={s.credGrid}>
          <div>
            <span className={s.eyebrow}>{c.cred.badge}</span>
            <h2 id="h-cred" className={s.h2} data-enter>
              {c.cred.headline1} <em>{c.cred.headline2}</em>
            </h2>
            <p className={s.statement} style={{ marginTop: '2rem' }} data-hl>
              <Words text={c.cred.body} />
            </p>
            <CredLinks c={c.cred} />
            <div className={s.actions}>
              <BookingLink className={s.btnPrimary}>{c.cred.btn_primary}</BookingLink>
            </div>
          </div>
          <div className={`${s.frame} ${s.overview}`}>
            <div className={s.drift} data-depth="5">
              <Image src={OVERVIEW.src} alt={OVERVIEW.alt} fill sizes="(min-width: 900px) 42vw, 100vw" className={s.cover} />
            </div>
          </div>
        </div>
        <div data-enter>
          <Stats c={c.cred} />
          <span className={`${s.eyebrow} ${s.master}`}>{c.master}</span>
        </div>
        <div className={s.houses} data-enter>
          <span className={s.eyebrow}>{c.housesLabel}</span>
          <ul className={s.housesList}>
            {HOUSES.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* EN EL MUNDO */}
      <section className={s.section} aria-labelledby="h-mundo">
        <div className={s.mundoGrid}>
          <div>
            <span className={s.eyebrow}>{c.mundo.label}</span>
            <h2 id="h-mundo" className={s.h2} data-enter>
              {c.mundo.title}
            </h2>
            <p className={s.statement} style={{ marginTop: '1.75rem' }}>
              {c.mundo.p1}
            </p>
            <p className={s.body} style={{ marginTop: '1.25rem' }}>
              {c.mundo.p2}
            </p>
            <ul className={s.cities}>
              {c.cities.map(([city, country]) => (
                <li key={city}>
                  <span className={s.city}>{city}</span>
                  {country}
                </li>
              ))}
            </ul>
          </div>
          <div data-enter>
            <MundoGlobe />
          </div>
        </div>
      </section>
    </div>
  )
}

function build({ q, touch, wide }: SceneEnv) {
  depth(q('[data-depth]'), touch)
  q('[data-hl]').forEach((n) => highlight(n))
  enter(q('[data-enter]'))

  // The one moment: each name crossing the line takes the frame.
  const rows = q('[data-rep-row]')
  const imgs = q('[data-rep-img]')
  let cur = -1
  const show = (i: number) => {
    if (i === cur) return
    if (cur >= 0) {
      rows[cur].removeAttribute('data-on')
      imgs[cur].removeAttribute('data-on')
    }
    rows[i].setAttribute('data-on', '')
    imgs[i].setAttribute('data-on', '')
    cur = i
  }
  show(0)
  const line = wide ? '52%' : '70%'
  rows.forEach((r, i) =>
    ScrollTrigger.create({ trigger: r, start: `top ${line}`, end: `bottom ${line}`, onEnter: () => show(i), onEnterBack: () => show(i), onLeaveBack: i === 0 ? () => show(0) : undefined })
  )

  return () => {
    rows.forEach((r) => r.removeAttribute('data-on'))
    imgs.forEach((r) => r.removeAttribute('data-on'))
  }
}
