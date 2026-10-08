'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { track } from '@/lib/analytics'
import { useHomeContent, PHONE_HREF } from './content'
import { useDirectionMotion } from './motion'
import { HeroVideo } from './shared'
import { TLink } from './Transition'
import s from './d1.module.css'

/* The thread: a gold basting stitch that sews itself down the page as you read. */
function useThread(main: React.RefObject<HTMLElement | null>, thread: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = thread.current
    if (!el || !main.current) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: main.current, start: 'top 60%', end: 'bottom bottom', scrub: 0.6 },
        }
      )
    })
    return () => mm.revert()
  }, [main, thread])
}

export function D1Hilvan() {
  const c = useHomeContent()
  const root = useRef<HTMLDivElement>(null)
  const sewn = useRef<HTMLDivElement>(null)
  const thread = useRef<HTMLDivElement>(null)
  const [quote, setQuote] = useState(0)
  useDirectionMotion(root, [c.locale, c.services.items.length])
  useThread(sewn, thread)

  return (
    <div ref={root} className={s.page}>
      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroMedia}>
          <HeroVideo className={s.heroVideo} />
          <div className={s.heroShade} />
        </div>
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
          <div className={s.heroActions} data-hero>
            <TLink href="/contacto" className={s.btnPrimary}>
              {c.hero.ctaBook}
            </TLink>
            <div className={s.heroLinks}>
              <a href={PHONE_HREF} className={s.stitchLink} onClick={() => track('phone_click', { location: 'hero' })}>
                {c.hero.ctaCall}
              </a>
              <TLink href="/contacto" className={s.stitchLink}>
                {c.hero.ctaContact}
              </TLink>
            </div>
          </div>
        </div>
        <span className={s.discover} aria-hidden="true">
          {c.hero.discover}
        </span>
      </section>

      <div ref={sewn} className={s.sewn}>
        <div className={s.threadTrack} aria-hidden="true">
          <div ref={thread} className={s.thread} />
        </div>

        {/* INTRODUCTION */}
        <section className={`${s.section} ${s.intro}`}>
          <p className={s.lead} data-reveal="lines">
            {c.seoIntro}
          </p>
        </section>

        {/* SERVICES */}
        <section className={s.section} aria-labelledby="d1-services">
          <div className={s.head}>
            <span className={s.label}>{c.services.label}</span>
            <h2 id="d1-services" className={s.h2} data-reveal="lines">
              {c.services.title}
            </h2>
          </div>
          <ul className={s.services}>
            {c.services.items.map((item) => (
              <li key={item.key} className={s.service}>
                <TLink href={item.href} className={s.serviceLink} data-reveal="fade">
                  <span className={s.serviceFrame}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 900px) 40vw, 100vw"
                      className={s.serviceImg}
                    />
                  </span>
                  <span className={s.serviceRow}>
                    <h3 className={s.h3}>{item.title}</h3>
                    <span className={s.stitchLink} aria-hidden="true">
                      {c.services.discover}
                    </span>
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
        </section>

        {/* TU TRAJE EMPIEZA EN TI — parallax */}
        <section className={`${s.section} ${s.traje}`}>
          <div className={s.trajeFrame}>
            <div className={s.drift} data-parallax="9">
              <Image src={c.traje.image} alt="" fill sizes="(min-width: 900px) 55vw, 100vw" className={s.cover} />
            </div>
          </div>
          <div className={s.trajeText}>
            <span className={s.label}>{c.traje.label}</span>
            <h2 className={s.h2} data-reveal="lines">
              {c.traje.title}
            </h2>
            <p className={s.body} data-reveal="fade">
              {c.traje.body}
            </p>
          </div>
        </section>

        {/* PROCESS */}
        <section className={s.section} aria-labelledby="d1-process">
          <div className={s.head}>
            <span className={s.label} aria-hidden="true">
              {c.process.steps.map((st) => st.num).join(' · ')}
            </span>
            <h2 id="d1-process" className={s.h2} data-reveal="lines">
              {c.process.label}
            </h2>
          </div>
          <ol className={s.steps}>
            {c.process.steps.map((st) => (
              <li key={st.num} className={s.step}>
                <div className={s.stepFrame}>
                  <div className={s.drift} data-parallax="8">
                    <Image src={st.image} alt="" fill sizes="(min-width: 900px) 30vw, 100vw" className={s.cover} />
                  </div>
                </div>
                <div className={s.stepText}>
                  <span className={s.stepNum}>{st.num}</span>
                  <h3 className={s.h3} data-reveal="lines">
                    {st.title}
                  </h3>
                  <p className={s.body} data-reveal="fade">
                    {st.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* TESTIMONIALS */}
        <section className={`${s.section} ${s.voices}`} aria-labelledby="d1-voices">
          <div className={s.head}>
            <span className={s.label}>{c.testimonials.label}</span>
            <h2 id="d1-voices" className={s.h2} data-reveal="lines">
              {c.testimonials.title}
            </h2>
          </div>
          <figure className={s.quote} aria-live="polite">
            <blockquote className={s.quoteText} key={`${c.locale}-${quote}`}>
              {c.testimonials.items[quote].quote}
            </blockquote>
            <figcaption className={s.quoteBy}>
              <span className={s.avatar}>
                <Image src={c.testimonials.items[quote].photo} alt="" fill sizes="48px" />
              </span>
              <span>
                <span className={s.quoteName}>{c.testimonials.items[quote].name}</span>
                <span className={s.quoteOcc}>{c.testimonials.items[quote].occasion}</span>
              </span>
            </figcaption>
          </figure>
          <div className={s.quoteNav}>
            {c.testimonials.items.map((item, i) => (
              <button
                key={item.name}
                type="button"
                className={s.quoteDot}
                aria-label={item.name}
                aria-current={i === quote ? 'true' : undefined}
                onClick={() => setQuote(i)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
