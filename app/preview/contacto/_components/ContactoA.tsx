'use client'

import { useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useScene, highlight, depth, type SceneEnv } from '@/lib/scroll-scene'
import { Words } from '@/components/el-hilo/Words'
import { useContacto, PHOTOS } from './content'
import { BookingScreen, ContactForm, Details, Hub } from './shared'
import s from './contacto.module.css'

/* A · La tarjeta: the three photographs are dealt one over another like
   cards while their lines are read; the details are a calling card in a
   stitched mount; the options are stitched in as they arrive. */
const HERO_RUN = 150

export function ContactoA() {
  const c = useContacto()
  if (c.booking.mode !== 'none') return <BookingScreen c={c} />
  return <Page c={c} />
}

function Page({ c }: { c: ReturnType<typeof useContacto> }) {
  const root = useRef<HTMLDivElement>(null)
  useScene(root, build, [c.locale, c.options.length, c.form.submitted])

  return (
    <div ref={root} className={s.page}>
      {/* HERO: three photographs dealt like cards, a line read with each */}
      <section className={`${s.pin} ${s.aHeroPin}`} style={{ '--run': HERO_RUN } as CSSProperties} aria-labelledby="h-contacto" data-a-hero>
        <div className={`${s.stage} ${s.aHero}`}>
          <ol className={s.aDeck} aria-hidden="true">
            {PHOTOS.map((p, i) => (
              <li key={p.src} className={s.aCard} data-a-card>
                <div className={s.depth} data-a-img>
                  <Image src={p.src} alt="" fill priority={i === 0} sizes="100vw" className={s.cover} />
                </div>
              </li>
            ))}
          </ol>
          <span className={s.aShade} aria-hidden="true" />
          <div className={s.aHeroText}>
            <span className={s.eyebrow}>{c.t.section_label} · Madrid</span>
            <h1 id="h-contacto" className={s.h1}>
              {c.t.headline}
            </h1>
            <ol className={s.aQuotes}>
              {c.quotes.map((q, i) => (
                <li key={i} className={s.aQuote} data-a-quote>
                  <span className={s.counter} aria-hidden="true">
                    <b>{String(i + 1).padStart(2, '0')}</b> / {String(PHOTOS.length).padStart(2, '0')}
                  </span>
                  <p className={s.quote}>
                    <Words text={q} />
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* THE CALLING CARD */}
      <section className={s.section} aria-label={c.t.section_label}>
        <p className={s.statement} data-hl>
          <Words text={c.t.subheadline} />
        </p>
        <div className={`${s.print} ${s.aCallCard}`} data-a-callcard>
          <Details c={c} />
        </div>
      </section>

      {/* THE OPTIONS: stitched in as they arrive */}
      <section className={s.section}>
        <Hub c={c} className={s.aHub} />
      </section>

      {/* THE MESSAGE */}
      <section className={s.section}>
        <div className={s.aFormBox}>
          <ContactForm c={c} />
        </div>
      </section>
    </div>
  )
}

function build({ q, vh, touch, wide }: SceneEnv) {
  const k = wide ? 1 : 0.8
  depth(q('[data-depth]'), touch)
  q('[data-hl]').forEach((n) => highlight(n))

  // Hero: each next photograph is dealt over the last from the right, settling
  // as it lands; its line replaces the last one and is read as it arrives.
  const hero = q('[data-a-hero]')[0]
  const cards = q('[data-a-card]')
  const imgs = q('[data-a-img]')
  const quotes = q('[data-a-quote]')
  gsap.set(cards.slice(1), { clipPath: 'inset(0% 0% 0% 100%)' })
  gsap.set(quotes.slice(1), { autoAlpha: 0, y: 24 })
  const run = (HERO_RUN * k * vh) / 100
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: () => `+=${run}`, scrub: true } })
  tl.fromTo(imgs[0], { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
  highlight(quotes[0].querySelector('p')!, { tl, at: 0, span: 0.6 })
  for (let i = 1; i < cards.length; i++) {
    const at = i
    tl.to(cards[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8 }, at - 0.2)
      .fromTo(imgs[i], { scale: 1.18, xPercent: 6 }, { scale: 1, xPercent: 0, duration: 1 }, at - 0.2)
      .to(cards[i - 1], { scale: 0.94, duration: 0.8 }, at - 0.2)
      .to(quotes[i - 1], { autoAlpha: 0, y: -24, duration: 0.3 }, at - 0.2)
      .to(quotes[i], { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.15)
    highlight(quotes[i].querySelector('p')!, { tl, at: at + 0.2, span: 0.6 })
  }
  tl.to({}, { duration: 0.3 })

  // The calling card: its stitching runs round as it comes up.
  q('[data-a-callcard]').forEach((card) =>
    gsap.fromTo(card, { '--stitch': 0 }, { '--stitch': 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 45%', scrub: true } })
  )
  q('[data-detail]').forEach((d) =>
    gsap.fromTo(d, { opacity: 0.25 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: d, start: 'top 88%', end: 'top 60%', scrub: true } })
  )

  // Options: each ticket is stitched in from its left edge.
  q('[data-option]').forEach((o) =>
    gsap.fromTo(o, { '--stitch': 0, opacity: 0.3 }, { '--stitch': 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: o, start: 'top 92%', end: 'top 62%', scrub: true } })
  )

  // The form's lines are drawn under each field as it is reached.
  q('[data-field]').forEach((f) =>
    gsap.fromTo(q('span', f), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: f, start: 'top 92%', end: 'top 65%', scrub: true } })
  )
}
