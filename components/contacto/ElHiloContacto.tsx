'use client'

import { useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useScene, highlight, type SceneEnv } from '@/lib/scroll-scene'
import { Words } from '@/components/el-hilo/Words'
import { useContacto, PHOTOS } from './contactoContent'
import { BookingScreen, ContactForm, Details, Hub } from './contactoShared'
import s from './el-hilo-contacto.module.css'

/* Contacto, El mostrador: the photographs stay at your side while you read, each
   giving way to the next as you go down; one thread runs down the page and
   is knotted at every option. On a phone the three photographs pass first
   in a short held band. */
const BAND_RUN = 90

export function ElHiloContacto() {
  const c = useContacto()
  if (c.booking.mode !== 'none') return <BookingScreen c={c} />
  return <Page c={c} />
}

function Page({ c }: { c: ReturnType<typeof useContacto> }) {
  const root = useRef<HTMLDivElement>(null)
  useScene(root, build, [c.locale, c.options.length, c.form.submitted])

  return (
    <div ref={root} className={s.page}>
      <div className={s.bWrap} data-b-wrap>
        {/* THE PHOTOGRAPHS: at your side on desktop, a held band on a phone */}
        <section className={`${s.bSide} ${s.pin}`} style={{ '--run': BAND_RUN } as CSSProperties} data-b-side>
          <div className={`${s.stage} ${s.bSideStage}`}>
            {PHOTOS.map((p, i) => (
              <figure key={p.src} className={s.bPhoto} data-b-photo>
                <div className={s.bPhotoImg} data-b-img>
                  <Image src={p.src} alt="" fill priority={i === 0} sizes="(min-width: 900px) 50vw, 100vw" className={s.cover} />
                </div>
                <figcaption className={s.bCaption}>
                  <span className={s.counter}>
                    <b>{String(i + 1).padStart(2, '0')}</b> / {String(PHOTOS.length).padStart(2, '0')}
                  </span>
                  <span className={s.quote} data-b-quote>
                    <Words text={c.quotes[i]} />
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* THE COUNTER: what you read, along one thread */}
        <div className={s.bMain} data-b-main>
          <span className={s.bThread} aria-hidden="true">
            <span data-b-thread />
          </span>
          <header className={s.bHead}>
            <span className={s.eyebrow}>{c.t.section_label} · Madrid</span>
            <h1 id="h-contacto" className={s.h1}>
              {c.t.headline}
            </h1>
            <span className={s.rule} aria-hidden="true" />
            <p className={s.sub} data-hl>
              <Words text={c.t.subheadline} />
            </p>
          </header>
          <Details c={c} className={s.bDetails} />
          <Hub c={c} className={s.bHub} knots />
          <ContactForm c={c} />
        </div>
      </div>
    </div>
  )
}

function build({ q, vh, touch, wide }: SceneEnv) {
  q('[data-hl]').forEach((n) => highlight(n))
  const photos = q('[data-b-photo]')
  const imgs = q('[data-b-img]')
  const quotes = q('[data-b-quote]')
  gsap.set(photos.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' })

  // The photographs give way to one another: on desktop across the reading
  // column's whole length, on a phone while the band is held.
  const side = q('[data-b-side]')[0]
  const main = q('[data-b-main]')[0]
  const trigger = wide
    ? { trigger: main, start: 'top top', end: 'bottom bottom', scrub: true }
    : { trigger: side, start: 'top top', end: () => `+=${(BAND_RUN * 0.8 * vh) / 100}`, scrub: true }
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: trigger })
  tl.fromTo(imgs[0], { scale: 1.12, yPercent: -4 }, { scale: 1, yPercent: 4, duration: 1 }, 0)
  highlight(quotes[0], { tl, at: 0, span: 0.6 })
  for (let i = 1; i < photos.length; i++) {
    tl.to(photos[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7 }, i - 0.3)
      .fromTo(imgs[i], { scale: 1.16, yPercent: -4 }, { scale: 1, yPercent: 4, duration: 1.3 }, i - 0.3)
    highlight(quotes[i], { tl, at: i + 0.1, span: 0.6 })
  }
  tl.to({}, { duration: 0.2 })

  // One thread down the reading column; each option's knot is tied as it is passed.
  gsap.fromTo(q('[data-b-thread]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: main, start: 'top 70%', end: 'bottom bottom', scrub: true } })
  q('[data-option]').forEach((o) => {
    const t = gsap.timeline({ scrollTrigger: { trigger: o, start: 'top 80%', end: 'top 55%', scrub: true } })
    t.fromTo(o, { opacity: 0.35, x: touch ? 0 : 16 }, { opacity: 1, x: 0, ease: 'none' }, 0).fromTo(q('[data-knot]', o), { backgroundColor: 'rgba(10,22,40,1)' }, { backgroundColor: 'rgba(201,168,76,1)', ease: 'none' }, 0)
  })
  q('[data-detail]').forEach((d) =>
    gsap.fromTo(d, { opacity: 0.3 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: d, start: 'top 90%', end: 'top 65%', scrub: true } })
  )
  q('[data-field]').forEach((f) =>
    gsap.fromTo(q('span', f), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: f, start: 'top 92%', end: 'top 65%', scrub: true } })
  )
}
