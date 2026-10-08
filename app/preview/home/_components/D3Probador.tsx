'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { track } from '@/lib/analytics'
import { useHomeContent, PHONE_HREF, TESTIMONIAL_BG } from './content'
import { useDirectionMotion, MOTION_OK } from './motion'
import { HeroVideo } from './shared'
import { TLink } from './Transition'
import s from './d3.module.css'

/* The curtains open the homepage once, after the loading screen lifts. */
function useCurtains(left: React.RefObject<HTMLDivElement | null>, right: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const l = left.current
    const r = right.current
    if (!l || !r) return
    const mm = gsap.matchMedia()
    let timer = 0
    mm.add(MOTION_OK, () => {
      gsap.set([l, r], { visibility: 'visible', xPercent: 0 })
      const open = () => {
        gsap.to(l, { xPercent: -101, duration: 1.6, ease: 'power4.inOut' })
        gsap.to(r, { xPercent: 101, duration: 1.6, ease: 'power4.inOut', onComplete: () => { gsap.set([l, r], { visibility: 'hidden' }) } })
      }
      const check = () => {
        const ls = document.getElementById('loading-screen')
        if (!ls || ls.style.display === 'none' || Number(getComputedStyle(ls).opacity) < 0.05) open()
        else timer = window.setTimeout(check, 80)
      }
      check()
    })
    return () => {
      window.clearTimeout(timer)
      mm.revert()
    }
  }, [left, right])
}

export function D3Probador() {
  const c = useHomeContent()
  const root = useRef<HTMLDivElement>(null)
  const curtainL = useRef<HTMLDivElement>(null)
  const curtainR = useRef<HTMLDivElement>(null)
  const [quote, setQuote] = useState(0)
  useDirectionMotion(root, [c.locale, c.services.items.length])
  useCurtains(curtainL, curtainR)
  const q = c.testimonials.items[quote]

  return (
    <div ref={root} className={s.page}>
      {/* HERO — behind the curtains */}
      <section className={s.hero}>
        <HeroVideo className={s.heroVideo} />
        <div className={s.heroShade} />
        <div ref={curtainL} className={`${s.curtain} ${s.curtainL}`} aria-hidden="true" />
        <div ref={curtainR} className={`${s.curtain} ${s.curtainR}`} aria-hidden="true" />
        <div className={s.heroInner}>
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
            <a href={PHONE_HREF} className={s.btnGhost} onClick={() => track('phone_click', { location: 'hero' })}>
              {c.hero.ctaCall}
            </a>
            <TLink href="/contacto" className={s.btnGhost}>
              {c.hero.ctaContact}
            </TLink>
          </div>
        </div>
        <span className={s.discover} aria-hidden="true">
          {c.hero.discover}
        </span>
      </section>

      {/* INTRODUCTION */}
      <section className={`${s.section} ${s.intro}`}>
        <p className={s.lead} data-reveal="words">
          {c.seoIntro}
        </p>
      </section>

      {/* SERVICES — mirrors */}
      <section className={s.section} aria-labelledby="d3-services">
        <div className={s.head}>
          <span className={s.eyebrow}>{c.services.label}</span>
          <h2 id="d3-services" className={s.h2} data-reveal="words">
            {c.services.title}
          </h2>
        </div>
        <ul className={s.mirrors}>
          {c.services.items.map((item) => (
            <li key={item.key} className={s.mirrorItem}>
              <TLink href={item.href} className={s.mirror}>
                <span className={s.mirrorGlass}>
                  <Image src={item.image} alt={item.title} fill sizes="(min-width: 900px) 20vw, 78vw" className={s.cover} />
                </span>
                <span className={s.mirrorCaption}>
                  <h3 className={s.h3}>{item.title}</h3>
                  <span className={s.more}>{c.services.discover}</span>
                </span>
              </TLink>
            </li>
          ))}
        </ul>
      </section>

      {/* TU TRAJE EMPIEZA EN TI — the image holds the screen, text passes over it */}
      <section className={s.stage}>
        <div className={s.stageSticky}>
          <div className={s.stageImage} data-zoom>
            <Image src={c.traje.image} alt="" fill sizes="100vw" className={s.cover} />
          </div>
          <div className={s.stageShade} />
        </div>
        <div className={s.stageCard}>
          <span className={s.eyebrow}>{c.traje.label}</span>
          <h2 className={s.h2} data-reveal="words">
            {c.traje.title}
          </h2>
          <p className={s.body} data-reveal="fade">
            {c.traje.body}
          </p>
        </div>
      </section>

      {/* PROCESS */}
      <section className={s.section} aria-labelledby="d3-process">
        <div className={s.head}>
          <h2 id="d3-process" className={s.h2} data-reveal="words">
            {c.process.label}
          </h2>
        </div>
        <ol className={s.steps}>
          {c.process.steps.map((st) => (
            <li key={st.num} className={s.step}>
              <div className={s.stepGlass}>
                <div className={s.drift} data-parallax="10">
                  <Image src={st.image} alt="" fill sizes="(min-width: 900px) 34vw, 86vw" className={s.cover} />
                </div>
              </div>
              <div className={s.stepText}>
                <span className={s.stepNum}>{st.num}</span>
                <h3 className={s.h3}>{st.title}</h3>
                <p className={s.body} data-reveal="fade">
                  {st.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* TESTIMONIALS — one voice at a time, chosen by the reader */}
      <section className={s.voices} aria-labelledby="d3-voices">
        <div className={s.voicesBg} aria-hidden="true">
          <div className={s.drift} data-parallax="6">
            <Image src={TESTIMONIAL_BG} alt="" fill sizes="100vw" className={s.cover} />
          </div>
        </div>
        <div className={s.voicesInner}>
          <span className={s.eyebrow}>{c.testimonials.label}</span>
          <h2 id="d3-voices" className={s.h2} data-reveal="words">
            {c.testimonials.title}
          </h2>
          <figure className={s.quote} aria-live="polite">
            <blockquote className={s.quoteText} key={`${c.locale}-${quote}`}>
              {q.quote}
            </blockquote>
            <figcaption className={s.quoteBy}>
              {q.name} · <span>{q.occasion}</span>
            </figcaption>
          </figure>
          <div className={s.faces}>
            {c.testimonials.items.map((item, i) => (
              <button
                key={item.name}
                type="button"
                className={s.face}
                aria-label={item.name}
                aria-current={i === quote ? 'true' : undefined}
                onClick={() => setQuote(i)}
              >
                <Image src={item.photo} alt="" fill sizes="52px" className={s.cover} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
