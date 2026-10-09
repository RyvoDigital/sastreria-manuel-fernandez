'use client'

import { useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useScene, highlight, depth, speeds, type SceneEnv } from '@/lib/scroll-scene'
import { Words } from '@/components/el-hilo/Words'
import { BookingLink } from '@/components/global/BookingLink'
import { useSastreriaContent, IMG, ALT } from './sastreriaContent'
import s from './el-hilo-sastreria.module.css'

/* A · La costura: one thread down the left margin sews every chapter. */
const FILO_RUN = 110

export function ElHiloSastreria() {
  const c = useSastreriaContent()
  const root = useRef<HTMLDivElement>(null)
  useScene(root, build, [c.locale])

  return (
    <div ref={root} className={s.page}>
      <span className={s.aThread} aria-hidden="true" data-a-thread />

      {/* HERO */}
      <section className={s.aHero} aria-labelledby="h-sastreria">
        <div className={s.aHeroMedia} data-a-hero>
          <Image src={IMG.hero} alt={ALT.hero} fill priority sizes="100vw" className={s.cover} />
        </div>
        <div className={s.aHeroShade} aria-hidden="true" />
        <div className={s.aHeroText}>
          <span className={s.eyebrow}>{c.hero.label}</span>
          <h1 id="h-sastreria" className={s.h1}>
            <span className={s.h1Line1}>{c.hero.headline_line1}</span>{' '}
            <span className={s.h1Line2}>{c.hero.headline_line2}</span>
          </h1>
          <p className={s.subline}>{c.hero.subline}</p>
        </div>
      </section>

      {/* FILOSOFÍA: the three lines replace one another; the label stays */}
      <section className={`${s.aSection} ${s.aFilo} ${s.pin}`} style={{ '--run': FILO_RUN } as CSSProperties} data-a-filo>
        <div className={s.stage}>
          <span className={`${s.eyebrow} ${s.aTie}`}>{c.filosofia.label}</span>
          <div className={s.aFiloLines}>
            {c.filosofia.lines.map((line) => (
              <p key={line} className={s.aFiloLine}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className={`${s.aSection} ${s.afterPin}`} style={{ paddingTop: 0 }}>
        <div className={s.aFiloParas}>
          {c.filosofia.paras.map((p) => (
            <p key={p} className={s.statement} data-hl>
              <Words text={p} />
            </p>
          ))}
        </div>
      </section>

      {/* EL OFICIO */}
      <section className={s.aSection} aria-labelledby="h-oficio">
        <span className={s.eyebrow}>{c.oficio.label}</span>
        <h2 id="h-oficio" className={s.h2}>
          {c.oficio.title}
        </h2>
        <ul className={s.aOficioList}>
          {c.oficio.items.map((o) => (
            <li key={o.image} className={s.aOficioItem}>
              <div className={`${s.frame} ${s.aOficioFrame}`} data-a-cut>
                <div className={s.depth} data-depth="9">
                  <Image src={o.image} alt="" fill sizes="(min-width: 900px) 45vw, 100vw" className={s.cover} />
                </div>
              </div>
              <span className={s.eyebrow}>{o.cat}</span>
              <div className={s.aOficioMeta}>
                <h3 className={s.aOficioTitle}>{o.title}</h3>
                <span className={s.aOficioRight}>{o.right}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* MANUEL */}
      <section className={s.aSection} aria-labelledby="h-manuel">
        <span className={s.eyebrow}>{c.historia.label}</span>
        <div className={s.aPerson} style={{ marginTop: '2.5rem' }}>
          <div className={`${s.frame} ${s.aPersonFrame}`} data-a-cut>
            <div className={s.depth} data-depth="8">
              <Image src={IMG.manuel} alt={ALT.manuel} fill sizes="(min-width: 900px) 40vw, 100vw" className={s.cover} />
            </div>
          </div>
          <div className={s.aPersonText}>
            <h2 id="h-manuel" className={s.h2}>
              {c.historia.name}
            </h2>
            <p className={s.body}>{c.historia.paras[0]}</p>
            <p className={s.body}>{c.historia.paras[1]}</p>
            <p className={s.statement} data-hl>
              <Words text={c.historia.paras[2]} />
            </p>
          </div>
        </div>
        {/* The stitch that hands the story from Manuel to Evelyn */}
        <span className={s.aHandover} aria-hidden="true" data-a-handover />
      </section>

      {/* EVELYN */}
      <section className={s.aSection} aria-labelledby="h-evelyn">
        <span className={s.eyebrow}>{c.evelyn.label}</span>
        <div className={`${s.aPerson} ${s.aPersonEvelyn}`} style={{ marginTop: '2.5rem' }}>
          <div className={`${s.frame} ${s.aPersonFrame}`} data-a-cut>
            <div className={s.depth} data-depth="8">
              <Image src={IMG.evelyn} alt={ALT.evelyn} fill sizes="(min-width: 900px) 40vw, 100vw" className={s.cover} />
            </div>
          </div>
          <div className={s.aPersonText}>
            <h2 id="h-evelyn" className={s.h2}>
              {c.evelyn.name}
            </h2>
            {c.evelyn.paras.map((p) => (
              <p key={p} className={s.body}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* EL ESPACIO: the wide photo widens to the full page */}
      <section className={s.aSection} aria-labelledby="h-espacio">
        <span className={s.eyebrow}>{c.espacio.label}</span>
        <h2 id="h-espacio" className={s.h2}>
          {c.espacio.title}
        </h2>
        <div className={s.aEspacioWide} data-a-widen>
          <div className={s.depth} data-depth="6">
            <Image src={IMG.espacio} alt={ALT.espacio} fill sizes="100vw" className={s.cover} />
          </div>
        </div>
        <div className={s.aEspacioBottom}>
          <div>
            <p className={`${s.statement} ${s.aEspacioDesc}`} data-hl>
              <Words text={c.espacio.description} />
            </p>
            <span className={`${s.eyebrow} ${s.aEspacioSub}`}>{c.espacio.subtitle}</span>
            <p className={s.body} style={{ marginTop: '1rem' }}>
              {c.espacio.body}
            </p>
          </div>
          <div className={s.aEspacioPair}>
            {[IMG.espacio2, IMG.espacio1].map((src, i) => (
              <div key={src} className={s.frame} data-speed={i ? '0.18' : '0.04'}>
                <div className={s.depth} data-depth="8">
                  <Image src={src} alt={ALT.espacioSmall} fill sizes="(min-width: 900px) 25vw, 50vw" className={s.cover} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${s.aSection} ${s.aCta}`} aria-labelledby="h-cta">
        <div className={s.aCtaInner}>
          <div className={`${s.frame} ${s.aCtaFrame}`} data-a-cut>
            <div className={s.depth} data-depth="8">
              <Image src={IMG.cta} alt="" fill sizes="(min-width: 900px) 50vw, 100vw" className={s.cover} />
            </div>
          </div>
          <div>
            <span className={`${s.eyebrow} ${s.aTie}`}>{c.cta.label}</span>
            <h2 id="h-cta" className={`${s.statement} ${s.aCtaHead}`} data-hl>
              <Words text={c.cta.headline} />
            </h2>
            <div className={s.actions}>
              <BookingLink end className={s.btnPrimary}>{c.cta.btn_primary}</BookingLink>
              <Link href="/la-sastreria" className={s.btnGhost}>
                {c.cta.btn_secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function build({ root, q, vh, touch }: SceneEnv) {
  // The thread draws itself down the whole page as you read.
  gsap.fromTo(q('[data-a-thread]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: true } })

  // Hero: the photo settles and darkens as you leave it.
  gsap.fromTo(q('[data-a-hero]'), { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${vh}`, scrub: true } })

  depth(q('[data-depth]'), touch)
  speeds(q('[data-speed]'), vh, touch)
  q('[data-hl]').forEach((n) => highlight(n))

  // Filosofía: the three lines replace one another in place.
  const filo = q('[data-a-filo]')[0]
  const lines = q('p', filo)
  gsap.set(lines.slice(1), { autoAlpha: 0, yPercent: 40 })
  const run = (FILO_RUN * (window.innerWidth >= 900 ? 1 : 0.8) * vh) / 100
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: filo, start: 'top top', end: () => `+=${run}`, scrub: true } })
  for (let i = 1; i < lines.length; i++) {
    tl.to(lines[i - 1], { autoAlpha: 0, yPercent: -40, duration: 0.4 }, i - 1 + 0.25).to(lines[i], { autoAlpha: 1, yPercent: 0, duration: 0.4 }, i - 1 + 0.55)
  }
  tl.to({}, { duration: 0.3 })

  // Photographs are cut open from the thread side as they arrive.
  q('[data-a-cut]').forEach((f) =>
    gsap.fromTo(f, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: f, start: 'top 90%', end: 'top 45%', scrub: true } })
  )

  // The hand-over stitch draws across from Manuel to Evelyn.
  q('[data-a-handover]').forEach((h) => gsap.fromTo(h, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: h, start: 'top 85%', end: 'top 45%', scrub: true } }))

  // El Espacio: the wide photo opens from a framed picture to the full page.
  q('[data-a-widen]').forEach((w) =>
    gsap.fromTo(w, { clipPath: 'inset(8% 10% 8% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: w, start: 'top 85%', end: 'center 55%', scrub: true } })
  )
}
