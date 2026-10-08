'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { track } from '@/lib/analytics'
import { useHomeContent, PHONE_HREF } from './content'
import { useDirectionMotion } from './motion'
import { HeroVideo } from './shared'
import { TLink } from './Transition'
import s from './d2.module.css'

/* 0–200 cm of tape; one tick per cm, a number every 10. */
const TICKS = Array.from({ length: 201 }, (_, i) => i)

/* The tape measure on the right edge counts the centimetres you have read. */
function useTape(tape: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const el = tape.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(el, {
        yPercent: -100,
        y: () => window.innerHeight,
        ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.4, invalidateOnRefresh: true },
      })
    })
    return () => mm.revert()
  }, [tape])
}

export function D2Medida() {
  const c = useHomeContent()
  const root = useRef<HTMLDivElement>(null)
  const tape = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  useDirectionMotion(root, [c.locale, c.services.items.length])
  useTape(tape)

  return (
    <div ref={root} className={s.page}>
      <div className={s.tapeWindow} aria-hidden="true">
        <div ref={tape} className={s.tape}>
          {TICKS.map((cm) => (
            <span key={cm} className={cm % 10 === 0 ? s.tickMajor : cm % 5 === 0 ? s.tickMid : s.tick}>
              {cm % 10 === 0 && cm > 0 ? <b>{cm}</b> : null}
            </span>
          ))}
        </div>
      </div>

      {/* HERO — a spread: words on the left page, film on the right */}
      <section className={s.hero}>
        <div className={s.heroText}>
          <h1 className={s.heroH1}>
            <span className={s.eyebrow} data-hero>
              {c.hero.seoHeading}
            </span>
            <span className={s.heroTitle} data-hero>
              {c.hero.title}
            </span>
          </h1>
          <p className={s.heroSub} data-hero>
            {c.hero.subtitle}
          </p>
          <div className={s.actions} data-hero>
            <TLink href="/contacto" className={s.btnPrimary}>
              {c.hero.ctaBook}
            </TLink>
            <a href={PHONE_HREF} className={s.btnLine} onClick={() => track('phone_click', { location: 'hero' })}>
              <span>{c.hero.ctaCall}</span>
            </a>
            <TLink href="/contacto" className={s.btnLine}>
              <span>{c.hero.ctaContact}</span>
            </TLink>
          </div>
        </div>
        <div className={s.heroFilm}>
          <HeroVideo className={s.heroVideo} />
          <span className={s.marks} aria-hidden="true" />
          <span className={s.discover} aria-hidden="true">
            {c.hero.discover} ↓
          </span>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className={`${s.section} ${s.intro}`}>
        <p className={s.lead} data-reveal="words">
          {c.seoIntro}
        </p>
      </section>

      {/* SERVICES — an index you read down; the photograph follows */}
      <section className={`${s.section} ${s.index}`} aria-labelledby="d2-services">
        <div className={s.indexHead}>
          <span className={s.eyebrow}>{c.services.label}</span>
          <h2 id="d2-services" className={s.h2} data-reveal="lines">
            {c.services.title}
          </h2>
        </div>
        <ul className={s.indexList}>
          {c.services.items.map((item, i) => (
            <li key={item.key} className={s.indexItem}>
              <TLink
                href={item.href}
                className={s.indexLink}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className={s.indexThumb}>
                  <Image src={item.image} alt="" fill sizes="96px" className={s.cover} />
                </span>
                <h3 className={s.indexTitle}>{item.title}</h3>
                <span className={s.indexMore}>
                  {c.services.discover} <span aria-hidden="true">→</span>
                </span>
              </TLink>
            </li>
          ))}
        </ul>
        <div className={s.indexStage} aria-hidden="true">
          {c.services.items.map((item, i) => (
            <span key={item.key} className={s.indexPhoto} data-on={i === active || undefined}>
              <Image src={item.image} alt="" fill sizes="(min-width: 900px) 34vw, 1px" className={s.cover} />
            </span>
          ))}
          <span className={s.marks} />
        </div>
      </section>

      {/* TU TRAJE EMPIEZA EN TI — cut reveal + parallax */}
      <section className={`${s.section} ${s.traje}`}>
        <div className={s.trajeFrame}>
          <div className={s.drift} data-parallax="7">
            <Image src={c.traje.image} alt="" fill sizes="(min-width: 900px) 50vw, 100vw" className={s.cover} />
          </div>
          <span className={s.cut} data-cut="left" />
          <span className={s.marks} aria-hidden="true" />
        </div>
        <div className={s.trajeText}>
          <span className={s.eyebrow}>{c.traje.label}</span>
          <h2 className={s.h2} data-reveal="lines">
            {c.traje.title}
          </h2>
          <p className={s.body} data-reveal="fade">
            {c.traje.body}
          </p>
        </div>
      </section>

      {/* PROCESS — a real sequence, so it is numbered */}
      <section className={`${s.section} ${s.process}`} aria-labelledby="d2-process">
        <h2 id="d2-process" className={s.h2} data-reveal="lines">
          {c.process.label}
        </h2>
        <ol className={s.steps}>
          {c.process.steps.map((st, i) => (
            <li key={st.num} className={s.step}>
              <span className={s.stepNum}>{st.num}</span>
              <div className={s.stepFrame}>
                <Image src={st.image} alt="" fill sizes="(min-width: 900px) 28vw, 100vw" className={s.cover} />
                <span className={s.cut} data-cut={i % 2 ? 'right' : 'left'} />
              </div>
              <h3 className={s.h3}>{st.title}</h3>
              <p className={s.body} data-reveal="fade">
                {st.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* TESTIMONIALS — inverse band */}
      <section className={s.voices} aria-labelledby="d2-voices">
        <div className={s.voicesInner}>
          <span className={s.eyebrowInv}>{c.testimonials.label}</span>
          <h2 id="d2-voices" className={s.h2} data-reveal="lines">
            {c.testimonials.title}
          </h2>
          <ul className={s.quotes}>
            {c.testimonials.items.map((q) => (
              <li key={q.name} className={s.quote} data-reveal="fade">
                <blockquote className={s.quoteText}>{q.quote}</blockquote>
                <p className={s.quoteBy}>
                  <span className={s.avatar}>
                    <Image src={q.photo} alt="" fill sizes="40px" className={s.cover} />
                  </span>
                  <span>
                    <span className={s.quoteName}>{q.name}</span>
                    <span className={s.quoteOcc}>{q.occasion}</span>
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
