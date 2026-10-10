'use client'

import { useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useScene, highlight, depth, speeds, type SceneEnv } from '@/lib/scroll-scene'
import { Words } from '@/components/el-hilo/Words'
import { useBodasContent, HERO, SUIT } from './bodasContent'
import { Final, WearLists } from './bodasShared'
import s from './el-hilo-bodas.module.css'

/* El álbum: every photograph is a print in a stitched mount; the process
   turns its pages in one place; the album drifts past in two rows. */
const PROC_RUN = 120

export function ElHiloBodas() {
  const c = useBodasContent()
  const root = useRef<HTMLDivElement>(null)
  useScene(root, build, [c.locale])
  const rows = [c.carousel.slice(0, 7), c.carousel.slice(7)]

  return (
    <div ref={root} className={s.page}>
      {/* HERO: the first print of the album */}
      <section className={s.aHero} aria-labelledby="h-bodas">
        <div className={s.aHeroBack} data-speed="-0.12" aria-hidden="true">
          <Image src={HERO.src} alt="" fill priority sizes="100vw" className={s.cover} />
        </div>
        <div className={`${s.print} ${s.aHeroPrint}`} data-speed="0.08">
          <div className={s.frame}>
            <div className={s.depth} data-depth="6">
              <Image src={HERO.src} alt={HERO.alt} fill priority sizes="(min-width: 900px) 32vw, 80vw" className={`${s.cover} ${s.top}`} />
            </div>
          </div>
        </div>
        <div className={s.aHeroText}>
          <span className={s.eyebrow}>{c.hero.label}</span>
          <h1 id="h-bodas" className={s.h1}>
            {c.hero.title}
          </h1>
        </div>
      </section>

      {/* ¿TE CASAS? */}
      <section className={s.section} aria-labelledby="h-tecasas">
        <h2 id="h-tecasas" className={s.eyebrow}>
          {c.teCasas.label}
        </h2>
        <p className={s.statement} style={{ marginTop: '1.5rem' }} data-hl>
          <Words text={c.teCasas.p1} />
        </p>
        <p className={s.body} style={{ marginTop: '1.5rem' }}>
          {c.teCasas.p2}
        </p>
      </section>

      {/* STATEMENT */}
      <section className={s.section}>
        <span className={s.eyebrow}>{c.statement.label}</span>
        <p className={s.h2} data-hl>
          <Words text={c.statement.headline} />
        </p>
        <p className={s.body} style={{ marginTop: '1.5rem' }}>
          {c.statement.body}
        </p>
      </section>

      {/* ESTILOS DE CEREMONIA: four prints */}
      <section className={s.section} aria-labelledby="h-cats">
        <h2 id="h-cats" className={s.eyebrow}>
          {c.catLabel}
        </h2>
        <ul className={s.aCats} style={{ listStyle: 'none', padding: 0 }}>
          {c.cats.map((cat) => (
            <li key={cat.src} className={s.aCat}>
              <div className={s.print}>
                <div className={s.frame} data-a-lift>
                  <div className={s.depth} data-depth="8">
                    <Image src={cat.src} alt={cat.title} fill sizes="(min-width: 900px) 24vw, 90vw" className={`${s.cover} ${s.top}`} />
                  </div>
                </div>
              </div>
              <div className={s.aCatText}>
                <h3 className={s.h3}>{cat.title}</h3>
                <p className={s.body} style={{ marginTop: '0.5rem' }}>
                  {cat.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* VESTIMENTA & ACCESORIOS: the card in the album */}
      <section className={s.section} aria-labelledby="h-wear">
        <span className={s.eyebrow}>{c.wearHeading}</span>
        <h2 id="h-wear" className={s.h2}>
          {c.wear.title}
        </h2>
        <div className={`${s.print} ${s.aCard}`}>
          <WearLists c={c} />
        </div>
        <p className={s.statement} style={{ marginTop: '3rem' }} data-hl>
          <Words text={c.keyMessage} />
        </p>
      </section>

      {/* TRAJE A MEDIDA */}
      <section className={s.section} aria-labelledby="h-suit">
        <div className={s.aSuit}>
          <div className={s.print}>
            <div className={s.frame} data-a-lift>
              <div className={s.depth} data-depth="8">
                <Image src={SUIT.src} alt={SUIT.alt} fill sizes="(min-width: 900px) 40vw, 90vw" className={s.cover} />
              </div>
            </div>
          </div>
          <div>
            <span className={s.eyebrow}>{c.suit.label}</span>
            <h2 id="h-suit" className={s.h2}>
              {c.suit.title}
            </h2>
            <p className={s.statement} style={{ marginTop: '1.5rem', fontSize: 'clamp(1.35rem, 1.1rem + 1.2vw, 2.1rem)' }} data-hl>
              <Words text={c.suit.body} />
            </p>
          </div>
        </div>
      </section>

      {/* EL PROCESO NUPCIAL: the pages turn in one place */}
      <section className={`${s.section} ${s.pin}`} style={{ '--run': PROC_RUN, paddingTop: 0 } as CSSProperties} aria-labelledby="h-proc" data-a-proc>
        <div className={`${s.stage} ${s.aProcStage}`} style={{ paddingTop: 'clamp(5rem, 4rem + 6vw, 9rem)' }}>
          <span className={s.eyebrow}>{c.proceso.label}</span>
          <h2 id="h-proc" className={s.h2}>
            {c.proceso.title}
          </h2>
          <ol className={s.aSteps}>
            {c.proceso.steps.map((st) => (
              <li key={st.num} className={s.aStep} data-a-step>
                <span className={s.stepNum} aria-hidden="true">
                  {st.num}
                </span>
                <h3 className={`${s.h3} ${s.stepTitle}`}>{st.title}</h3>
                <p className={s.body} style={{ marginTop: '0.75rem' }}>
                  {st.body}
                </p>
              </li>
            ))}
          </ol>
          <div className={s.aKnots} aria-hidden="true">
            <span className={s.aKnotLine} data-a-knotline />
            {c.proceso.steps.map((st) => (
              <span key={st.num} className={s.aKnot} data-a-knot />
            ))}
          </div>
        </div>
      </section>

      {/* BODAS MEMORABLES: the album drifts past */}
      <section className={s.section} style={{ paddingLeft: 0, paddingRight: 0 }} aria-labelledby="h-album" data-a-album>
        <h2 id="h-album" className={s.eyebrow} style={{ padding: '0 var(--pad)' }}>
          {c.carouselLabel}
        </h2>
        <div className={s.aRows}>
          {rows.map((row, r) => (
            <ul key={r} className={s.aRow} data-a-row={r}>
              {row.map((shot) => (
                <li key={shot.src}>
                  <figure className={s.aShot} style={{ margin: 0 }}>
                    <div className={s.frame}>
                      <Image src={shot.src} alt={shot.caption} fill sizes="(min-width: 900px) 22vw, 62vw" className={s.cover} />
                    </div>
                    <figcaption className={s.eyebrow}>{shot.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      <Final c={c} />
    </div>
  )
}

function build({ q, vh, touch, wide }: SceneEnv) {
  depth(q('[data-depth]'), touch)
  speeds(q('[data-speed]'), vh, touch)
  q('[data-hl]').forEach((n) => highlight(n))

  // Each print is lifted out of its tissue paper: it opens from the top down.
  q('[data-a-lift]').forEach((f) =>
    gsap.fromTo(f, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: f, start: 'top 92%', end: 'top 45%', scrub: true } })
  )

  // The two lists are read item by item.
  q('[data-list]').forEach((l) =>
    gsap.fromTo(q('li', l), { opacity: 0.25 }, { opacity: 1, ease: 'none', stagger: 0.2, scrollTrigger: { trigger: l, start: 'top 85%', end: 'bottom 60%', scrub: true } })
  )

  // Proceso: the four steps replace one another; the thread runs knot to knot.
  const proc = q('[data-a-proc]')[0]
  const steps = q('[data-a-step]')
  const knots = q('[data-a-knot]')
  gsap.set(steps.slice(1), { autoAlpha: 0, y: 40 })
  gsap.set(knots[0], { backgroundColor: 'var(--color-gold)' })
  const run = (PROC_RUN * (wide ? 1 : 0.8) * vh) / 100
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: proc, start: 'top top', end: () => `+=${run}`, scrub: true } })
  tl.to(q('[data-a-knotline]'), { scaleX: 1, duration: steps.length - 1 }, 0)
  for (let i = 1; i < steps.length; i++) {
    tl.to(steps[i - 1], { autoAlpha: 0, y: -40, duration: 0.35 }, i - 1 + 0.3)
      .to(steps[i], { autoAlpha: 1, y: 0, duration: 0.35 }, i - 1 + 0.6)
      .to(knots[i], { backgroundColor: 'var(--color-gold)', duration: 0.1 }, i)
  }
  tl.to({}, { duration: 0.3 })

  // Bodas memorables: two rows drift in opposite directions as you read.
  const album = q('[data-a-album]')[0]
  q('[data-a-row]').forEach((row, r) => {
    const travel = () => Math.max(0, row.scrollWidth - window.innerWidth)
    gsap.fromTo(
      row,
      { x: () => (r ? -travel() : 0) },
      { x: () => (r ? 0 : -travel()), ease: 'none', scrollTrigger: { trigger: album, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } }
    )
  })

  // The closing photograph opens out from a framed print.
  q('[data-final-photo]').forEach((p) =>
    gsap.fromTo(p, { clipPath: 'inset(12% 14% 12% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: p, start: 'top 90%', end: 'top 20%', scrub: true } })
  )
}
