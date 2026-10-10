'use client'

import { useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScene, highlight, depth, type SceneEnv } from '@/lib/scroll-scene'
import { Words } from '@/components/el-hilo/Words'
import { HERO, BADGE, type CursosContent, type CourseItem } from './content'
import { CursosShell, CourseFacts } from './shared'
import s from './cursos.module.css'

/* B · La lección: the hero photograph is held while the title is chalked on
   it; the six courses run past on one thread, sideways, like lessons pinned
   along a rail, each knot tied as its course reaches the middle. */
const HERO_RUN = 70

export function CursosB() {
  return <CursosShell>{(c, watch) => <Page c={c} watch={watch} />}</CursosShell>
}

function Page({ c, watch }: { c: CursosContent; watch: (course: CourseItem) => void }) {
  const root = useRef<HTMLDivElement>(null)
  const n = c.courses.length
  useScene(root, build, [c.locale, n, c.purchasesOpen])

  return (
    <div ref={root} className={s.page}>
      {/* HERO: the photograph, held; a chalk line is drawn and the title sits on it */}
      <section className={s.pin} style={{ '--run': HERO_RUN } as CSSProperties} aria-labelledby="h-cursos" data-b-hero>
        <div className={`${s.stage} ${s.bHero}`}>
          <div className={s.bHeroPhoto}>
            <div className={s.depth} data-b-hero-img>
              <Image src={HERO.src} alt={HERO.alt} fill priority sizes="100vw" className={s.cover} />
            </div>
            <span className={s.bHeroShade} data-b-shade aria-hidden="true" />
          </div>
          <div className={s.bHeroText}>
            <span className={s.eyebrow}>{BADGE}</span>
            <h1 id="h-cursos" className={`${s.h1} ${s.italic}`}>
              {c.layout.title}
            </h1>
            <span className={s.bChalk} aria-hidden="true" data-b-chalk />
            <p className={s.lead} data-hl>
              <Words text={c.layout.desc} />
            </p>
          </div>
        </div>
      </section>

      {/* CURSOS ARTESANALES */}
      <section className={`${s.section} ${s.center}`} aria-labelledby="h-list">
        <span className={s.eyebrow}>{c.list.subtitle}</span>
        <h2 id="h-list" className={s.h2}>
          {c.list.title}
        </h2>
        <p className={`${s.statement} ${s.center}`} style={{ marginTop: '1.75rem' }} data-hl>
          <Words text={c.list.description} />
        </p>
      </section>

      {/* THE RAIL: the courses run past sideways on one thread */}
      <section className={`${s.section} ${s.bRailSection}`} aria-label={c.list.title} data-b-rail>
        <div className={`${s.stage} ${s.bRailStage}`}>
          <div className={s.bTrackWrap} data-b-track>
          <span className={s.bLine} aria-hidden="true">
            <span data-b-line />
          </span>
          <ol className={s.bTrack}>
            {c.courses.map((course, i) => (
              <li key={course.id} className={s.bCard} data-b-card>
                <span className={s.bKnot} aria-hidden="true" data-b-knot />
                <div className={s.bPhoto}>
                  <div className={s.bPhotoInner} data-b-pan>
                    <Image src={course.image} alt={course.title} fill sizes="(min-width: 900px) 34vw, 82vw" className={s.cover} />
                  </div>
                </div>
                <span className={s.num} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={s.h3}>{course.title}</h3>
                <p className={s.body} style={{ marginTop: '0.6rem' }}>
                  {course.desc}
                </p>
                <CourseFacts course={course} c={c} onWatch={() => watch(course)} />
              </li>
            ))}
          </ol>
          </div>
        </div>
      </section>
    </div>
  )
}

function build({ q, vh, touch, wide }: SceneEnv) {
  const k = wide ? 1 : 0.8
  depth(q('[data-depth]'), touch)
  q('[data-hl]').forEach((node) => highlight(node))

  // Hero: held still; the photograph settles and darkens, the chalk line is drawn.
  const hero = q('[data-b-hero]')[0]
  const htl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: () => `+=${(HERO_RUN * k * vh) / 100}`, scrub: true } })
  htl.fromTo(q('[data-b-hero-img]'), { scale: 1.18, yPercent: -3 }, { scale: 1, yPercent: 3, duration: 1 }, 0)
  htl.fromTo(q('[data-b-shade]'), { opacity: 0.35 }, { opacity: 0.8, duration: 1 }, 0)
  htl.fromTo(q('[data-b-chalk]'), { scaleX: 0 }, { scaleX: 1, duration: 0.55 }, 0.05)

  // Rail: pinned for as long as the track is wider than the screen.
  const rail = q('[data-b-rail]')[0]
  const track = q('[data-b-track]')[0]
  const cards = q('[data-b-card]')
  const knots = q('[data-b-knot]')
  const travel = () => Math.max(0, track.scrollWidth - window.innerWidth)
  // Sticky like every other stage: the section is as tall as the screen plus the travel.
  const size = () => {
    rail.style.height = `${vh + travel()}px`
  }
  size()
  ScrollTrigger.addEventListener('refreshInit', size)
  const rtl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: rail, start: 'top top', end: () => `+=${travel()}`, scrub: true, invalidateOnRefresh: true },
  })
  rtl.to(track, { x: () => -travel(), duration: 1 }, 0)
  rtl.fromTo(q('[data-b-line]'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)

  // Inside each frame the photograph pans against the travel, so it has depth.
  q('[data-b-pan]').forEach((pan) => {
    gsap.fromTo(pan, { xPercent: touch ? -5 : -9 }, { xPercent: touch ? 5 : 9, ease: 'none', scrollTrigger: { trigger: pan, containerAnimation: rtl, start: 'left right', end: 'right left', scrub: true } })
  })

  // Each knot is tied, and its card comes up to full colour, as it reaches the middle.
  cards.forEach((card, i) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, containerAnimation: rtl, start: 'left 85%', end: 'left 40%', scrub: true } })
    tl.fromTo(card, { opacity: 0.35 }, { opacity: 1, ease: 'none' }, 0).fromTo(knots[i], { backgroundColor: 'rgba(10,22,40,1)' }, { backgroundColor: 'rgba(201,168,76,1)', ease: 'none' }, 0)
  })

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', size)
    rail.style.height = ''
  }
}
