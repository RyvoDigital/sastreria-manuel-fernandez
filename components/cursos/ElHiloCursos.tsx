'use client'

import { useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useScene, highlight, depth, type SceneEnv } from '@/lib/scroll-scene'
import { Words } from '@/components/el-hilo/Words'
import { HERO, BADGE, type CursosContent, type CourseItem } from './cursosContent'
import { CursosShell, CourseFacts } from './cursosShared'
import s from './el-hilo-cursos.module.css'

/* Cursos, El temario: the hero opens like cloth unrolled on the cutting table;
   the six courses are one pinned syllabus, read line by line, each photograph
   laid over the last. */
const HERO_RUN = 80
const STEP_RUN = 42

export function ElHiloCursos() {
  return <CursosShell>{(c, watch) => <Page c={c} watch={watch} />}</CursosShell>
}

function Page({ c, watch }: { c: CursosContent; watch: (course: CourseItem) => void }) {
  const root = useRef<HTMLDivElement>(null)
  const n = c.courses.length
  useScene(root, (env) => build(env, n), [c.locale, n, c.purchasesOpen])

  return (
    <div ref={root} className={s.page}>
      {/* HERO: the cloth unrolls from a band across the table */}
      <section className={`${s.pin}`} style={{ '--run': HERO_RUN } as CSSProperties} aria-labelledby="h-cursos" data-a-hero>
        <div className={`${s.stage} ${s.aHero}`}>
          <div className={s.aHeroPhoto} data-a-cloth>
            <div className={s.depth} data-a-hero-img>
              <Image src={HERO.src} alt={HERO.alt} fill priority sizes="100vw" className={s.cover} />
            </div>
          </div>
          <span className={s.aRule} aria-hidden="true" data-a-rule />
          <div className={s.aHeroText}>
            <span className={s.eyebrow}>{BADGE}</span>
            <h1 id="h-cursos" className={`${s.h1} ${s.italic}`}>
              {c.layout.title}
            </h1>
            <p className={s.lead} data-a-lead>
              {c.layout.desc}
            </p>
          </div>
        </div>
      </section>

      {/* CURSOS ARTESANALES */}
      <section className={s.section} aria-labelledby="h-list">
        <span className={s.eyebrow}>{c.list.subtitle}</span>
        <h2 id="h-list" className={s.h2}>
          {c.list.title}
        </h2>
        <p className={s.statement} style={{ marginTop: '1.75rem' }} data-hl>
          <Words text={c.list.description} />
        </p>
      </section>

      {/* EL TEMARIO: one pinned page, a line per course */}
      <section className={`${s.section} ${s.pin}`} style={{ '--run': STEP_RUN * (n - 1) + 30 } as CSSProperties} aria-label={c.list.title} data-a-syl>
        <div className={`${s.stage} ${s.aSylStage}`}>
          <ol className={s.aIndex} aria-hidden="true">
            {c.courses.map((course, i) => (
              <li key={course.id} className={s.aIndexItem} data-a-line>
                <span className={s.aIndexNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.aIndexTitle}>{course.title}</span>
              </li>
            ))}
          </ol>
          <span className={s.aThread} aria-hidden="true">
            <span data-a-thread />
          </span>
          <ol className={s.aCourses}>
            {c.courses.map((course, i) => (
              <li key={course.id} className={s.aCourse} data-a-course>
                <div className={s.aPhoto} data-a-photo>
                  <div className={s.depth} data-depth="6">
                    <Image src={course.image} alt={course.title} fill sizes="(min-width: 900px) 44vw, 100vw" className={s.cover} />
                  </div>
                </div>
                <div className={s.aCourseText} data-a-text>
                  <span className={s.num} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={s.h3}>{course.title}</h3>
                  <p className={s.body} style={{ marginTop: '0.75rem' }}>
                    {course.desc}
                  </p>
                  <CourseFacts course={course} c={c} onWatch={() => watch(course)} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}

function build({ q, vh, touch, wide }: SceneEnv, n: number) {
  const k = wide ? 1 : 0.8
  depth(q('[data-depth]'), touch)
  q('[data-hl]').forEach((node) => highlight(node))

  // Hero: the photograph opens from a band across the middle, the gold rule
  // runs out along its edge, and the description is read as it opens.
  const hero = q('[data-a-hero]')[0]
  const htl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: () => `+=${(HERO_RUN * k * vh) / 100}`, scrub: true } })
  htl.fromTo(q('[data-a-cloth]'), { clipPath: 'inset(34% 0% 34% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0)
  htl.fromTo(q('[data-a-hero-img]'), { scale: 1.2 }, { scale: 1, duration: 1 }, 0)
  htl.fromTo(q('[data-a-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, 0)
  htl.fromTo(q('[data-a-lead]'), { opacity: 0.25 }, { opacity: 1, duration: 0.6 }, 0.3)

  // Syllabus: each course's photograph is laid over the last from below, its
  // text replaces the last, its line in the index lights and the thread runs on.
  const syl = q('[data-a-syl]')[0]
  const courses = q('[data-a-course]')
  const photos = q('[data-a-photo]')
  const texts = q('[data-a-text]')
  const lines = q('[data-a-line]')
  gsap.set(photos.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' })
  gsap.set(texts.slice(1), { autoAlpha: 0, y: 30 })
  gsap.set(courses.slice(1), { zIndex: (i) => i + 2 })
  gsap.set(lines, { opacity: 0.3 })
  gsap.set(lines[0], { opacity: 1 })
  const run = ((STEP_RUN * (n - 1) + 30) * k * vh) / 100
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: syl, start: 'top top', end: () => `+=${run}`, scrub: true } })
  tl.fromTo(q('[data-a-thread]'), { scaleY: 1 / n }, { scaleY: 1, duration: n - 1 }, 0)
  for (let i = 1; i < n; i++) {
    const at = i - 1
    tl.to(photos[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7 }, at + 0.15)
      .to(texts[i - 1], { autoAlpha: 0, y: -30, duration: 0.3 }, at + 0.15)
      .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.42)
      .to(lines[i - 1], { opacity: 0.3, duration: 0.3 }, at + 0.4)
      .to(lines[i], { opacity: 1, duration: 0.3 }, at + 0.4)
  }
  tl.to({}, { duration: 0.3 })
}
