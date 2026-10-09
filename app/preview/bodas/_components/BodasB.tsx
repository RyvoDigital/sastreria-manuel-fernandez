'use client'

import { useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useScene, highlight, depth, speeds, type SceneEnv } from '@/lib/scroll-scene'
import { Words } from '@/components/el-hilo/Words'
import { useBodasContent, HERO, SUIT, type BodasContent } from './content'
import { Final, WearLists } from './shared'
import s from './bodas.module.css'

/* B · El pasillo: a thread down the centre like an aisle; the hero opens from
   it, the styles stack like cards, the photographs rise in columns. */
const HERO_RUN = 90
const CATS_RUN = 120
const COL_SPEED = ['0', '0.22', '0.08', '0.3']

function Shots({ shots, cols, className }: { shots: BodasContent['carousel']; cols: number; className: string }) {
  return (
    <div className={`${s.bCols} ${className}`}>
      {Array.from({ length: cols }, (_, ci) => (
        <ul key={ci} className={s.bCol} style={{ listStyle: 'none', padding: 0, margin: 0 }} data-speed={COL_SPEED[ci]}>
          {shots
            .filter((_, i) => i % cols === ci)
            .map((shot) => (
              <li key={shot.src}>
                <figure className={s.bShot} style={{ margin: 0 }}>
                  <div className={s.frame}>
                    <div className={s.depth} data-depth="5">
                      <Image src={shot.src} alt={shot.caption} fill sizes="(min-width: 900px) 24vw, 48vw" className={s.cover} />
                    </div>
                  </div>
                  <figcaption className={s.eyebrow}>{shot.caption}</figcaption>
                </figure>
              </li>
            ))}
        </ul>
      ))}
    </div>
  )
}

export function BodasB() {
  const c = useBodasContent()
  const root = useRef<HTMLDivElement>(null)
  useScene(root, build, [c.locale])

  return (
    <div ref={root} className={s.page}>
      <span className={s.bAisle} aria-hidden="true" data-b-aisle />

      {/* HERO: the aisle opens into the photograph */}
      <section className={`${s.bHero} ${s.pin}`} style={{ '--run': HERO_RUN } as CSSProperties} aria-labelledby="h-bodas" data-b-hero>
        <div className={`${s.stage} ${s.bHeroStatic}`}>
          <div className={s.bHeroBack} aria-hidden="true">
            <Image src={HERO.src} alt="" fill priority sizes="100vw" className={s.cover} />
          </div>
          <div className={s.bHeroPhoto} data-b-strip>
            <Image src={HERO.src} alt={HERO.alt} fill priority sizes="100vw" className={`${s.cover} ${s.top}`} data-b-hero-img />
          </div>
          <div className={s.bHeroText}>
            <span className={s.eyebrow}>{c.hero.label}</span>
            <h1 id="h-bodas" className={`${s.h1} ${s.center}`} style={{ maxWidth: '14ch' }}>
              {c.hero.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ¿TE CASAS? */}
      <section className={s.bSection} aria-labelledby="h-tecasas">
        <div className={s.bPanel}>
          <h2 id="h-tecasas" className={s.eyebrow}>
            {c.teCasas.label}
          </h2>
          <p className={s.statement} style={{ marginTop: '1.5rem' }} data-hl>
            <Words text={c.teCasas.p1} />
          </p>
          <p className={s.body} style={{ marginTop: '1.5rem' }}>
            {c.teCasas.p2}
          </p>
        </div>
      </section>

      {/* STATEMENT */}
      <section className={s.bSection}>
        <div className={s.bPanel}>
          <span className={s.eyebrow}>{c.statement.label}</span>
          <p className={`${s.h2} ${s.center}`} style={{ maxWidth: '20ch' }} data-hl>
            <Words text={c.statement.headline} />
          </p>
          <p className={s.body} style={{ marginTop: '1.5rem' }}>
            {c.statement.body}
          </p>
        </div>
      </section>

      {/* ESTILOS DE CEREMONIA: the cards stack */}
      <section className={`${s.bSection} ${s.pin}`} style={{ '--run': CATS_RUN } as CSSProperties} aria-labelledby="h-cats" data-b-cats>
        <div className={`${s.stage} ${s.bCatsStage} ${s.bPanel}`}>
          <h2 id="h-cats" className={s.eyebrow}>
            {c.catLabel}
          </h2>
          <ul className={s.bCats}>
            {c.cats.map((cat) => (
              <li key={cat.src} className={s.bCat} data-b-card>
                <div className={s.frame}>
                  <Image src={cat.src} alt={cat.title} fill sizes="(min-width: 900px) 45vw, 90vw" className={`${s.cover} ${s.top}`} />
                </div>
                <div className={s.bCatText}>
                  <h3 className={s.h3}>{cat.title}</h3>
                  <p className={s.body} style={{ marginTop: '0.5rem' }}>
                    {cat.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* VESTIMENTA & ACCESORIOS: the invitation */}
      <section className={s.bSection} aria-labelledby="h-wear">
        <div className={s.bPanel}>
          <span className={s.eyebrow}>{c.wearHeading}</span>
          <h2 id="h-wear" className={s.h2}>
            {c.wear.title}
          </h2>
        </div>
        <div className={s.bInvite}>
          <WearLists c={c} />
        </div>
        <div className={s.bPanel} style={{ marginTop: '2.5rem' }}>
          <p className={s.statement} data-hl>
            <Words text={c.keyMessage} />
          </p>
        </div>
      </section>

      {/* TRAJE A MEDIDA: the photograph opens from the aisle */}
      <section className={s.bSection} aria-labelledby="h-suit">
        <div className={`${s.bSuit} ${s.bPanel}`}>
          <div className={s.frame} data-b-open>
            <div className={s.depth} data-depth="8">
              <Image src={SUIT.src} alt={SUIT.alt} fill sizes="(min-width: 900px) 45vw, 90vw" className={s.cover} />
            </div>
          </div>
          <div>
            <span className={s.eyebrow}>{c.suit.label}</span>
            <h2 id="h-suit" className={s.h2}>
              {c.suit.title}
            </h2>
            <p className={s.body} style={{ marginTop: '1.5rem' }}>
              {c.suit.body}
            </p>
          </div>
        </div>
      </section>

      {/* EL PROCESO NUPCIAL: steps on either side of the aisle */}
      <section className={s.bSection} aria-labelledby="h-proc">
        <div className={s.bPanel}>
          <span className={s.eyebrow}>{c.proceso.label}</span>
          <h2 id="h-proc" className={s.h2}>
            {c.proceso.title}
          </h2>
        </div>
        <ol className={s.bSteps}>
          {c.proceso.steps.map((st) => (
            <li key={st.num} className={s.bStep} data-b-step>
              <span className={s.bKnot} aria-hidden="true" data-b-knot />
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
      </section>

      {/* BODAS MEMORABLES: the photographs rise in columns */}
      <section className={s.bSection} style={{ paddingLeft: 0, paddingRight: 0 }} aria-labelledby="h-album">
        <div className={s.bPanel}>
          <h2 id="h-album" className={s.eyebrow}>
            {c.carouselLabel}
          </h2>
        </div>
        <Shots shots={c.carousel} cols={2} className={s.bColsM} />
        <Shots shots={c.carousel} cols={4} className={s.bColsD} />
      </section>

      <Final c={c} centered />
    </div>
  )
}

function build({ q, vh, touch, wide }: SceneEnv) {
  const k = wide ? 1 : 0.8

  // The aisle draws itself down the page as you walk it.
  gsap.fromTo(q('[data-b-aisle]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: q('[data-b-aisle]')[0], start: 'top 80%', end: 'bottom bottom', scrub: true } })

  // Hero: the photograph opens out from a strip down the middle.
  const hero = q('[data-b-hero]')[0]
  const x = wide ? 40 : 30
  const htl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: () => `+=${(HERO_RUN * k * vh) / 100}`, scrub: true } })
  htl.fromTo(q('[data-b-strip]'), { clipPath: `inset(0% ${x}% 0% ${x}%)` }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0)
  htl.fromTo(q('[data-b-hero-img]'), { scale: 1.15 }, { scale: 1, duration: 1 }, 0)

  depth(q('[data-depth]'), touch)
  speeds(q('[data-speed]'), vh, touch)
  q('[data-hl]').forEach((n) => highlight(n))

  // Estilos: each card rises over the one before, which steps back.
  const cats = q('[data-b-cats]')[0]
  const cards = q('[data-b-card]')
  gsap.set(cards.slice(1), { yPercent: 105 })
  const ctl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: cats, start: 'top top', end: () => `+=${(CATS_RUN * k * vh) / 100}`, scrub: true } })
  for (let i = 1; i < cards.length; i++) {
    ctl.to(cards[i], { yPercent: 0, duration: 1 }, i - 1).to(cards[i - 1], { scale: 0.92, autoAlpha: 0.25, duration: 1 }, i - 1)
  }
  ctl.to({}, { duration: 0.3 })

  // The two lists are read item by item.
  q('[data-list]').forEach((l) =>
    gsap.fromTo(q('li', l), { opacity: 0.25 }, { opacity: 1, ease: 'none', stagger: 0.2, scrollTrigger: { trigger: l, start: 'top 85%', end: 'bottom 60%', scrub: true } })
  )

  // The suit photograph opens from the aisle.
  q('[data-b-open]').forEach((f) =>
    gsap.fromTo(f, { clipPath: 'inset(0% 46% 0% 46%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: f, start: 'top 90%', end: 'top 35%', scrub: true } })
  )

  // Each step's knot is tied as it reaches the middle of the screen.
  q('[data-b-step]').forEach((st) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: st, start: 'top 75%', end: 'top 45%', scrub: true } })
    tl.fromTo(st, { opacity: 0.25 }, { opacity: 1, ease: 'none' }, 0).fromTo(q('[data-b-knot]', st), { backgroundColor: 'rgba(10,22,40,1)' }, { backgroundColor: 'rgba(201,168,76,1)', ease: 'none' }, 0)
  })

  // The closing photograph opens from the aisle too.
  q('[data-final-photo]').forEach((p) =>
    gsap.fromTo(p, { clipPath: `inset(0% ${x + 5}% 0% ${x + 5}%)` }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: p, start: 'top 90%', end: 'top 15%', scrub: true } })
  )
}
