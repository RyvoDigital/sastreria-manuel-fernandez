'use client'

import { useCallback, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import {
  useHomeContent,
  ANATOMY_IMAGE,
  ANATOMY_ALT,
  BEFORE_IMAGE,
  BEFORE_ALT,
  AFTER_IMAGE,
  AFTER_ALT,
  TESTIMONIAL_BG,
} from './homeContent'
import s from './el-hilo.module.css'
import { useScene, highlight, depth, speeds, thread, blend, coverShade, scrollToStep, type SceneEnv } from '@/lib/scroll-scene'

type Styles = Record<string, string>

/* Real text stays real text: each word is a span so it can be filled by scroll. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        /^\s+$/.test(part) ? part : (
          <span key={i} className="w">
            {part}
          </span>
        )
      )}
    </>
  )
}

/* Pin lengths, in svh: `run` is the scrubbed sequence (kept ≤ 140), `cover` is
   the stretch the next chapter spends rising over this one. */
const PINS = {
  services: { run: 120, cover: 80 },
  traje: { run: 120, cover: 100 },
  zoom: { run: 130, cover: 0 },
  process: { run: 120, cover: 0 },
  voices: { run: 100, cover: 80 },
  ba: { run: 90, cover: 100 },
  anat: { run: 120, cover: 60 },
} as const
type PinKey = keyof typeof PINS
const pinVars = (k: PinKey) => ({ '--run': PINS[k].run, '--cover': PINS[k].cover }) as CSSProperties
/* Phones get 80% of each run (see --k in the CSS), so the page stays short. */
const RUN_K = { phone: 0.8, wide: 1 }
let runK = RUN_K.wide
const runPx = (k: PinKey, vh: number) => ((PINS[k].run * runK) / 100) * vh
const coverPx = (k: PinKey, vh: number) => (PINS[k].cover / 100) * vh

/* Zoom mosaic: tile boxes in % of the stage, mobile then desktop. Index 0 is the centre. */
const ZOOM_M = [
  [25, 35, 50, 30], [6, 8, 38, 22], [56, 6, 38, 24], [4, 68, 40, 24],
  [56, 70, 40, 22], [2, 38, 20, 26], [78, 36, 20, 28], [30, 74, 22, 18],
]
const ZOOM_D = [
  [37.5, 37.5, 25, 25], [37.5, 5, 30, 28], [10, 17.5, 22, 42], [65, 37.5, 22, 22],
  [42, 66, 20, 22], [8, 63, 30, 24], [68, 66, 18, 18], [72, 8, 18, 27],
]
const ZOOM_DRIFT = [0, 0.55, 0.3, 0.45, 0.62, 0.38, 0.5, 0.7]

const pad2 = (n: number) => String(n).padStart(2, '0')

export function ElHiloHome() {
  const c = useHomeContent()
  const root = useRef<HTMLDivElement>(null)
  const [voice, setVoice] = useState(0)
  const [spot, setSpot] = useState(0)
  const [service, setService] = useState(0)
  const baValue = useRef<(v: number) => void>(() => {})
  const vhRef = useRef(800)

  const sceneBuild = useCallback(
    (env: SceneEnv) => buildScene(env, { setVoice, setSpot, setService, baValue, vhRef }, s),
    []
  )
  useScene(root, sceneBuild, [c.locale, c.services.items.length, sceneBuild])

  const go = (key: PinKey, i: number, n: number) => {
    const el = root.current?.querySelector<HTMLElement>(`[data-ch="${key}"]`)
    if (el && root.current?.hasAttribute('data-staged')) scrollToStep(el, i, n, runPx(key, vhRef.current) * 0.92)
  }

  return (
    <div ref={root} className={s.page}>
      {/* 1 · INTRODUCTION: carries the hero's gold line down the page */}
      <div className={s.pair}>
        <section className={s.intro} data-ch="intro">
          <div className={s.introInner}>
            <span className={s.threadIn} aria-hidden="true" data-thread />
            <p className={s.statement} data-hl>
              <Words text={c.seoIntro} />
            </p>
            <span className={s.threadOut} aria-hidden="true" data-thread />
          </div>
        </section>

        {/* 2 · SERVICES: the heading stays, the services change beneath it */}
        <section className={`${s.services} ${s.pin}`} data-ch="services" style={pinVars('services')} aria-labelledby="h-services">
          <div className={s.stage}>
            <header className={s.sHead}>
              <span className={s.eyebrow}>{c.services.label}</span>
              <h2 id="h-services" className={s.h2}>
                {c.services.title}
              </h2>
            </header>
            <ul className={s.sList}>
              {c.services.items.map((item, i) => (
                <li key={item.key} className={s.sItem} data-active={i === service ? '' : undefined}>
                  <Link href={item.href} className={s.sLink} onFocus={() => go('services', i, c.services.items.length)}>
                    <span className={s.sFrame}>
                      <span className={s.sImg}>
                        <Image src={item.image} alt={item.title} fill sizes="(min-width: 900px) 70vw, 100vw" className={s.cover} />
                      </span>
                    </span>
                    <span className={s.sCap}>
                      <h3 className={s.sTitle}>{item.title}</h3>
                      <span className={s.more}>
                        {c.services.discover} <span aria-hidden="true">→</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <span className={s.sBar} aria-hidden="true">
              <i />
            </span>
            <span className={s.shade} aria-hidden="true" />
          </div>
        </section>
      </div>

      {/* 3 · DETAIL GALLERY: three depths */}
      <section className={s.gallery} data-ch="gallery">
        <div className={s.gGrid}>
          {c.gallery.map((src, i) => (
            <figure key={src + i} className={s.gFrame} data-g={i}>
              <div className={s.depth} data-depth="9">
                <Image src={src} alt={`Detail ${i}`} fill sizes="(min-width: 900px) 30vw, 50vw" className={s.cover} />
              </div>
            </figure>
          ))}
        </div>
        <span className={s.gThread} aria-hidden="true" data-thread />
      </section>

      {/* 4 · TU TRAJE EMPIEZA EN TI: the frame opens into the chapter's background */}
      <section className={`${s.traje} ${s.pin}`} data-ch="traje" style={pinVars('traje')} aria-labelledby="h-traje">
        <div className={s.stage}>
          <div className={s.tMedia}>
            <div className={s.tImg}>
              <Image src={c.traje.image} alt="" fill sizes="100vw" className={s.cover} />
            </div>
          </div>
          <span className={s.tSlit} aria-hidden="true" />
          <span className={s.tShade} aria-hidden="true" />
          <div className={s.tText}>
            <span className={s.eyebrow}>{c.traje.label}</span>
            <h2 id="h-traje" className={s.h2}>
              {c.traje.title}
            </h2>
            <p className={s.tBody}>
              <Words text={c.traje.body} />
            </p>
          </div>
        </div>
      </section>

      {/* 5 · ZOOM PARALLAX: one full-screen frame pulls back to the whole mosaic */}
      <section className={`${s.zoom} ${s.pin}`} data-ch="zoom" style={pinVars('zoom')}>
        <div className={s.stage}>
          {c.zoom.images.map((src, i) => {
            const [mx, my, mw, mh] = ZOOM_M[i]
            const [dx, dy, dw, dh] = ZOOM_D[i]
            const vars = { '--mx': mx, '--my': my, '--mw': mw, '--mh': mh, '--dx': dx, '--dy': dy, '--dw': dw, '--dh': dh } as CSSProperties
            return (
              <div key={src} className={s.zLayer} data-z={i} style={vars}>
                <div className={s.zTile}>
                  <Image src={src} alt={`${c.zoom.alt} ${i + 1}`} fill sizes={i === 0 ? '100vw' : '(min-width: 900px) 30vw, 50vw'} className={s.cover} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 6 · PROCESS: three steps on one stage (desktop), a stitched column (phone) */}
      <section className={`${s.process} ${s.pinWide}`} data-ch="process" style={pinVars('process')}>
        <div className={s.stage}>
          <span className={s.pThread} aria-hidden="true">
            <i className={s.pLine} />
            <i className={s.pDot} />
          </span>
          <ol className={s.pList}>
            {c.process.steps.map((st, i) => (
              <li key={st.num} className={s.pStep} data-step={i}>
                <figure className={s.pFrame}>
                  <div className={s.depth} data-depth="8">
                    <Image src={st.image} alt="" fill sizes="(min-width: 900px) 40vw, 80vw" className={s.cover} />
                  </div>
                </figure>
                <div className={s.pText}>
                  <span className={s.pNum} aria-hidden="true">
                    {st.num}
                  </span>
                  <span className={s.pLabel}>
                    {c.process.stepLabel} {st.num}
                  </span>
                  <h2 className={s.pTitle}>{st.title}</h2>
                  <p className={s.body}>{st.body}</p>
                  <span className={s.pCount}>{st.num} / 03</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7 · EDITORIAL: the reading room */}
      <section className={s.editorial} data-ch="editorial" aria-labelledby="h-editorial">
        <header className={s.eHead}>
          <span className={s.eyebrow}>{c.editorial.label}</span>
          <h2 id="h-editorial" className={s.h2}>
            {c.editorial.title}
          </h2>
        </header>
        <ul className={s.eList}>
          {c.editorial.articles.map((a) => (
            <li key={a.title} className={s.eRow}>
              <span className={s.eRule} aria-hidden="true" />
              <span className={s.eCat}>{a.category}</span>
              <h3 className={s.eTitle}>{a.title}</h3>
              <p className={s.eEx}>{a.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 8 · TESTIMONIALS: one voice at a time */}
      <section className={`${s.voices} ${s.pin}`} data-ch="voices" style={pinVars('voices')} aria-labelledby="h-voices">
        <div className={s.stage}>
          <div className={s.vBg} aria-hidden="true">
            <div className={s.depth} data-depth="10">
              <Image src={TESTIMONIAL_BG} alt="" fill sizes="100vw" className={s.cover} />
            </div>
          </div>
          <div className={s.vInner}>
            <header className={s.vHead}>
              <span className={s.eyebrow}>{c.testimonials.label}</span>
              <h2 id="h-voices" className={s.h2}>
                {c.testimonials.title}
              </h2>
              <p className={s.rating}>
                <span className={s.stars}>★ 4.9/5</span> <span>Google Reviews</span>
              </p>
            </header>
            <ul className={s.vList}>
              {c.testimonials.items.map((item) => (
                <li key={item.name} className={s.vItem}>
                  <figure>
                    <blockquote className={s.vQuote}>{item.quote}</blockquote>
                    <figcaption className={s.vBy}>
                      <span className={s.vPhoto}>
                        <Image src={item.photo} alt={item.name} fill sizes="56px" className={s.cover} />
                      </span>
                      <span>
                        <span className={s.vName}>{item.name}</span>
                        <span className={s.vOcc}>{item.occasion}</span>
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <div className={s.faces}>
              {c.testimonials.items.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  className={s.face}
                  aria-label={item.name}
                  aria-current={i === voice ? 'true' : undefined}
                  onClick={() => go('voices', i, c.testimonials.items.length)}
                >
                  <i style={{ transform: `scaleX(${i === voice ? 1 : 0})` }} />
                </button>
              ))}
            </div>
          </div>
          <span className={s.shade} aria-hidden="true" />
        </div>
      </section>

      {/* 9 · BEFORE AND AFTER: scroll moves the divider */}
      <section className={`${s.ba} ${s.pin}`} data-ch="ba" style={pinVars('ba')} aria-labelledby="h-ba">
        <div className={s.stage}>
          <header className={s.baHead}>
            <span className={s.eyebrow}>{c.beforeAfter.label}</span>
            <h2 id="h-ba" className={s.h2}>
              {c.beforeAfter.title}
            </h2>
            <p className={s.body}>{c.beforeAfter.subtitle}</p>
          </header>
          <div className={s.frame} data-ba-frame>
            <div className={s.baAfter}>
              <Image src={AFTER_IMAGE} alt={AFTER_ALT} fill sizes="(min-width: 900px) 40vw, 90vw" className={s.cover} />
              <span className={`${s.baTag} ${s.baTagAfter}`}>{c.beforeAfter.after}</span>
            </div>
            <div className={s.baBefore}>
              <Image src={BEFORE_IMAGE} alt={BEFORE_ALT} fill sizes="(min-width: 900px) 40vw, 90vw" className={s.cover} />
              <span className={`${s.baTag} ${s.baTagBefore}`}>{c.beforeAfter.before}</span>
            </div>
            <span className={s.baHandle} aria-hidden="true" />
            <input
              className={s.baRange}
              type="range"
              min={0}
              max={100}
              defaultValue={0}
              aria-label={c.beforeAfter.instruction}
              onChange={(e) => baValue.current(Number(e.currentTarget.value) / 100)}
            />
          </div>
          <p className={s.baHint}>{c.beforeAfter.instruction}</p>
        </div>
      </section>

      {/* 10 · ANATOMY: six details on one pinned photo */}
      <section className={`${s.anat} ${s.pin}`} data-ch="anat" style={pinVars('anat')} aria-labelledby="h-anat">
        <div className={s.stage}>
          <header className={s.aHead}>
            <span className={s.eyebrow}>{c.anatomy.label}</span>
            <h2 id="h-anat" className={s.h2}>
              {c.anatomy.title}
            </h2>
            <p className={s.aHint}>{c.anatomy.hint}</p>
          </header>
          <div className={s.frame} data-anat-frame>
            <div className={s.aImg}>
              <Image src={ANATOMY_IMAGE} alt={ANATOMY_ALT} fill sizes="(min-width: 900px) 40vw, 90vw" className={s.cover} />
            </div>
            {c.anatomy.spots.map((sp, i) => (
              <button
                key={sp.id}
                type="button"
                className={s.spot}
                style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
                aria-label={sp.title}
                aria-current={i === spot ? 'true' : undefined}
                onClick={() => go('anat', i, c.anatomy.spots.length)}
              >
                <span>{pad2(i + 1)}</span>
              </button>
            ))}
          </div>
          <ol className={s.aList}>
            {c.anatomy.spots.map((sp, i) => (
              <li key={sp.id} className={s.aItem}>
                <span className={s.aNum} aria-hidden="true">
                  {pad2(i + 1)}
                </span>
                <h3 className={s.aTitle}>{sp.title}</h3>
                <p className={s.body}>{sp.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 11 · FABRICS */}
      <section className={s.fabrics} data-ch="fabrics" aria-labelledby="h-fabrics">
        <header className={s.fHead}>
          <span className={s.eyebrow}>{c.fabrics.label}</span>
          <h2 id="h-fabrics" className={s.h2}>
            {c.fabrics.title}
          </h2>
          <p className={s.fSub} data-hl>
            <Words text={c.fabrics.subtitle} />
          </p>
        </header>
        <ul className={s.fList}>
          {c.fabrics.items.map((f, i) => (
            <li key={f.id} className={s.fItem} data-f={i}>
              <figure className={s.fFrame}>
                <div className={s.depth} data-depth="8" data-scale={i === 0 ? '1.25' : '1.1'}>
                  <Image src={f.image} alt={f.title} fill sizes="(min-width: 900px) 25vw, 50vw" className={s.cover} />
                </div>
              </figure>
              <h3 className={s.fTitle}>{f.title}</h3>
              {f.desc && <p className={s.fDesc}>{f.desc}</p>}
            </li>
          ))}
        </ul>
        <p className={s.fValues}>{c.fabrics.values}</p>
      </section>
    </div>
  )
}

/* ── The scroll scene ───────────────────────────────────────────────────── */

type Setters = {
  setVoice: (i: number) => void
  setSpot: (i: number) => void
  setService: (i: number) => void
  baValue: { current: (v: number) => void }
  vhRef: { current: number }
}

const COLORS = {
  navy: '#0A1628',
  navyMid: '#0D1D30',
  navyLight: '#122238',
  black: '#000000',
  white: '#FFFFFF',
}

/* A full-screen stage that dissolves in place over the one before: while its
   section scrolls up into view the stage is held still (counter-translated)
   and fades in, so the two frames cross-fade rather than slide. */
function dissolveIn(section: HTMLElement, stage: HTMLElement, vh: number) {
  gsap.fromTo(stage, { y: -vh }, { y: 0, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true } })
  gsap.fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 72%', end: 'top 20%', scrub: true } })
}

function pinTimeline(section: HTMLElement, key: PinKey, vh: number) {
  return gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${runPx(key, vh)}`, scrub: true },
  })
}

function buildScene(env: SceneEnv, set: Setters, s: Styles) {
  const { root, q, vh, touch, wide } = env
  const cleanups: (() => void)[] = []
  runK = wide ? RUN_K.wide : RUN_K.phone
  set.vhRef.current = vh
  const ch = (k: string) => root.querySelector<HTMLElement>(`[data-ch="${k}"]`)!

  /* Common: masked-frame parallax, threads, free-standing highlights. */
  depth(q('[data-depth]').filter((n) => !n.closest('[data-ch="process"]') || !wide), touch)
  thread(q('[data-thread]').filter((n) => !n.closest('[data-ch="process"]')))
  q('[data-hl]').forEach((n) => highlight(n))

  /* 1 → 2 ─────────────────────────────────────────────────────────────── */
  const services = ch('services')
  {
    // El hilo: the thread becomes the top edge of the frame, which opens downward like a blind.
    const list = services.querySelector<HTMLElement>('ul')!
    gsap.fromTo(
      list,
      { clipPath: 'inset(0% 50% 100% 50%)' },
      {
        keyframes: [{ clipPath: 'inset(0% 0% 100% 0%)', duration: 0.35 }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.65 }],
        ease: 'none',
        scrollTrigger: { trigger: services, start: 'top 85%', end: 'top top', scrub: true },
      }
    )
  }

  /* 2 · Services ─────────────────────────────────────────────────────── */
  {
    const items = q('li', services.querySelector('ul')!)
    const n = items.length
    const tl = pinTimeline(services, 'services', vh)
    const frames = items.map((li) => li.querySelector<HTMLElement>(`.${s.sFrame}`)!)
    const imgs = items.map((li) => li.querySelector<HTMLElement>(`.${s.sImg}`)!)
    const caps = items.map((li) => li.querySelector<HTMLElement>(`.${s.sCap}`)!)
    gsap.set(frames.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' })
    gsap.set(caps.slice(1), { autoAlpha: 0, y: 24 })
    for (let i = 1; i < n; i++) {
      const at = i - 1
      tl.to(frames[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, at)
        .fromTo(imgs[i], { scale: 1.22 }, { scale: 1, duration: 1 }, at)
        .to(imgs[i - 1], { yPercent: -12, duration: 1 }, at)
        .to(caps[i - 1], { autoAlpha: 0, y: -24, duration: 0.4 }, at + 0.1)
        .to(caps[i], { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.55)
    }
    tl.fromTo(services.querySelector(`.${s.sBar} i`), { scaleX: 1 / n }, { scaleX: 1, duration: Math.max(n - 1, 1) }, 0)
    let last = -1
    tl.eventCallback('onUpdate', () => {
      const idx = Math.round(tl.progress() * (n - 1))
      if (idx !== last) set.setService((last = idx))
    })
    coverShade(services, services.querySelector(`.${s.shade}`), coverPx('services', vh))
  }

  /* 3 · Gallery: three sizes, three speeds ─────────────────────────────── */
  {
    const gallery = ch('gallery')
    const frames = q('[data-g]', gallery)
    const SPEED_HILO = wide ? [0, 0.28, 0.12] : [0, 0.22]
    frames.forEach((f, i) => {
      const cols = wide ? 3 : 2
      const sp = SPEED_HILO[i % cols]
      f.dataset.speed = String(sp)
    })
    speeds(frames, vh, touch, gallery)
  }

  /* 4 · Traje: the frame opens and becomes the chapter's background ──── */
  {
    const traje = ch('traje')
    const media = traje.querySelector<HTMLElement>(`.${s.tMedia}`)!
    const img = traje.querySelector<HTMLElement>(`.${s.tImg}`)!
    const slit = traje.querySelector<HTMLElement>(`.${s.tSlit}`)!
    const shade = traje.querySelector<HTMLElement>(`.${s.tShade}`)!
    const text = traje.querySelector<HTMLElement>(`.${s.tText}`)!
    const body = traje.querySelector<HTMLElement>(`.${s.tBody}`)!
    const fromClip = 'inset(49.6% 7% 49.6% 7% round 0vw 0vw 0vw 0vw)'
    gsap.set(media, { clipPath: fromClip })
    gsap.set(img, { scale: 1.3 })
    gsap.set(shade, { opacity: 0 })
    gsap.set(text.children[0], { autoAlpha: 0, y: 28 })
    gsap.set(text.children[1], { autoAlpha: 0, y: 28 })
    gsap.set(body, { autoAlpha: 0 })
    const tl = pinTimeline(traje, 'traje', vh)
    tl.to(media, { clipPath: 'inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)', duration: 0.36, ease: 'power2.inOut' }, 0)
      .to(img, { scale: 1.04, duration: 0.5 }, 0)
      .to(slit, { opacity: 0, scaleX: 1.6, duration: 0.12 }, 0)
      .to(shade, { opacity: 0.66, duration: 0.18 }, 0.24)
      .to(text.children[0], { autoAlpha: 1, y: 0, duration: 0.12 }, 0.3)
      .to(text.children[1], { autoAlpha: 1, y: 0, duration: 0.14 }, 0.33)
      .set(body, { autoAlpha: 1 }, 0.42)
    highlight(body, { tl, at: 0.42, span: 0.5 })
    tl.to({}, { duration: 0.08 })
    // While the zoom chapter dissolves in, the paragraph steps back.
    gsap.to(text, {
      autoAlpha: 0,
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: traje, start: () => `top+=${runPx('traje', vh)} top`, end: () => `top+=${runPx('traje', vh) + vh * 0.25} top`, scrub: true },
    })
  }

  /* 5 · Zoom: dissolve in at full screen, pull back, then the tiles lift away */
  {
    const zoom = ch('zoom')
    const stage = zoom.querySelector<HTMLElement>(`.${s.stage}`)!
    const layers = q('[data-z]', zoom)
    const box = (i: number) => (wide ? ZOOM_D : ZOOM_M)[i]
    const [, , w0, h0] = box(0)
    const cover = Math.max(100 / w0, 100 / h0) * 1.04
    const mult = [1, 1.3, 1.22, 1.16, 1.34, 1.12, 1.26, 1.4]
    dissolveIn(zoom, stage, vh)
    const tl = pinTimeline(zoom, 'zoom', vh)
    layers.forEach((layer, i) => {
      tl.fromTo(layer, { scale: cover * mult[i] }, { scale: 1, duration: 0.72, ease: 'power1.inOut' }, 0)
      tl.to(layer, { y: -vh * (0.35 + ZOOM_DRIFT[i]), duration: 0.28, ease: 'power1.in' }, 0.72)
    })
    const next = COLORS.navyMid
    tl.fromTo(stage, { backgroundColor: COLORS.black }, { backgroundColor: next, duration: 0.28 }, 0.72)
  }

  /* 6 · Process ─────────────────────────────────────────────────────────── */
  {
    const proc = ch('process')
    const steps = q('[data-step]', proc)
    const line = proc.querySelector<HTMLElement>(`.${s.pLine}`)!
    const track = proc.querySelector<HTMLElement>(`.${s.pThread}`)!
    const dot = proc.querySelector<HTMLElement>(`.${s.pDot}`)!
    if (wide) {
      const frames = steps.map((st) => st.querySelector<HTMLElement>('figure')!)
      const imgs = steps.map((st) => st.querySelector<HTMLElement>('[data-depth]')!)
      const texts = steps.map((st) => st.querySelector<HTMLElement>(`.${s.pText}`)!)
      const enter = 'inset(0% 0% 0% 100%)'
      const open = 'inset(0% 0% 0% 0%)'
      gsap.set(frames.slice(1), { clipPath: enter })
      gsap.set(texts.slice(1), { autoAlpha: 0, y: 40 })
      const tl = pinTimeline(proc, 'process', vh)
      tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 2 }, 0)
      tl.fromTo(dot, { y: 0 }, { y: () => track.offsetHeight, duration: 2 }, 0)
      for (let i = 1; i < steps.length; i++) {
        const at = i - 1
        tl.to(frames[i], { clipPath: open, duration: 0.8, ease: 'power2.inOut' }, at + 0.1)
          .fromTo(imgs[i], { scale: 1.25 }, { scale: 1, duration: 0.9 }, at + 0.1)
          .to(imgs[i - 1], { scale: 0.94, duration: 0.8 }, at + 0.1)
          .to(texts[i - 1], { autoAlpha: 0, y: -40, duration: 0.35 }, at + 0.1)
          .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.5)
      }
    } else {
      // Phone: no pin. The thread sews down the column; each frame moves in its mask.
      thread([line], { start: 'top 75%', end: 'bottom 70%' })
      gsap.set(dot, { autoAlpha: 0 })
    }
  }

  /* 5/6 → 7 → 8: continuous colour ─────────────────────────────────────── */
  {
    const proc = ch('process')
    const ed = ch('editorial')
    const voices = ch('voices')
      blend(proc, ed, { bgA: COLORS.navyMid, bgB: COLORS.navy })
      blend(ed, voices, { bgA: COLORS.navy, bgB: COLORS.black })
    // Editorial rules draw across, titles fill as they arrive.
    q(`.${s.eRow}`, ed).forEach((row) => {
      const rule = row.querySelector(`.${s.eRule}`)
      const title = row.querySelector(`.${s.eTitle}`)
      gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: row, start: 'top 92%', end: 'top 62%', scrub: true } })
      gsap.fromTo(title, { opacity: 0.24 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: row, start: 'top 85%', end: 'top 52%', scrub: true } })
    })
  }

  /* 8 · Testimonials ─────────────────────────────────────────────────────── */
  {
    const voices = ch('voices')
    const items = q(`.${s.vItem}`, voices)
    const n = items.length
    gsap.set(items.slice(1), { autoAlpha: 0, y: 30 })
    const tl = pinTimeline(voices, 'voices', vh)
    for (let i = 1; i < n; i++) {
      const at = i - 1
      tl.to(items[i - 1], { autoAlpha: 0, y: -30, duration: 0.35 }, at + 0.25).to(items[i], { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.6)
    }
    let last = -1
    tl.eventCallback('onUpdate', () => {
      const idx = Math.min(n - 1, Math.floor(tl.progress() * (n - 1) + 0.42))
      if (idx !== last) set.setVoice((last = idx))
    })
    coverShade(voices, voices.querySelector(`.${s.shade}`), coverPx('voices', vh))
  }

  /* 9 · Before and after ──────────────────────────────────────────────── */
  {
    const ba = ch('ba')
    const before = ba.querySelector<HTMLElement>(`.${s.baBefore}`)!
    const handle = ba.querySelector<HTMLElement>(`.${s.baHandle}`)!
    const range = ba.querySelector<HTMLInputElement>('input[type="range"]')!
    const frame = ba.querySelector<HTMLElement>('[data-ba-frame]')!
    const state = { v: 0 }
    const apply = () => {
      const pct = state.v * 100
      before.style.clipPath = `inset(0% 0% 0% ${pct}%)`
      handle.style.transform = `translateX(${(frame.clientWidth * state.v).toFixed(1)}px)`
      range.value = String(Math.round(pct))
    }
    set.baValue.current = (val) => {
      state.v = val
      apply()
    }
    const tl = pinTimeline(ba, 'ba', vh)
    tl.fromTo(state, { v: 0 }, { v: 1, duration: 1, ease: 'power1.inOut', onUpdate: apply })
    apply()
    // Drag still works; the next scroll movement hands control back to the scroll.
    const drag = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect()
      state.v = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      apply()
    }
    // touch-action: pan-y on the frame: vertical swipes still scroll, sideways drags move the divider.
    const down = (e: PointerEvent) => {
      drag(e)
      frame.addEventListener('pointermove', drag)
      const up = () => frame.removeEventListener('pointermove', drag)
      window.addEventListener('pointerup', up, { once: true })
      window.addEventListener('pointercancel', up, { once: true })
    }
    frame.addEventListener('pointerdown', down)
    gsap.to([ba.querySelector(`.${s.baHead}`), ba.querySelector(`.${s.baHint}`)], {
      autoAlpha: 0,
      y: -30,
      ease: 'none',
      scrollTrigger: { trigger: ba, start: () => `top+=${runPx('ba', vh)} top`, end: () => `top+=${runPx('ba', vh) + vh * 0.22} top`, scrub: true },
    })
    cleanups.push(() => frame.removeEventListener('pointerdown', down))
  }

  /* 10 · Anatomy: dissolve in on the same frame, six details, zoom into "fabric" */
  {
    const anat = ch('anat')
    const stage = anat.querySelector<HTMLElement>(`.${s.stage}`)!
    const items = q(`.${s.aItem}`, anat)
    const frame = anat.querySelector<HTMLElement>('[data-anat-frame]')!
    const head = anat.querySelector<HTMLElement>(`.${s.aHead}`)!
    const list = anat.querySelector<HTMLElement>('ol')!
    const n = items.length
    dissolveIn(anat, stage, vh)
    gsap.set(items.slice(1), { autoAlpha: 0, y: 18 })
    const tl = pinTimeline(anat, 'anat', vh)
    const step = 0.8 / (n - 1)
    for (let i = 1; i < n; i++) {
      const at = (i - 1) * step
      tl.to(items[i - 1], { autoAlpha: 0, y: -18, duration: step * 0.35 }, at + step * 0.2).to(items[i], { autoAlpha: 1, y: 0, duration: step * 0.35 }, at + step * 0.55)
    }
    const last = anat.querySelectorAll<HTMLElement>(`.${s.spot}`)[n - 1]
    tl.to(frame, { scale: 2.4, transformOrigin: `${last.style.left} ${last.style.top}`, autoAlpha: 0.35, duration: 0.2, ease: 'power2.in' }, 0.8)
      .to([head, list], { autoAlpha: 0, duration: 0.12 }, 0.8)
    let cur = -1
    tl.eventCallback('onUpdate', () => {
      const idx = Math.min(n - 1, Math.floor(tl.progress() / step + 0.45))
      if (idx !== cur) set.setSpot((cur = idx))
    })
  }

  /* 11 · Fabrics: the four move at slightly different speeds */
  {
    const fab = ch('fabrics')
    const items = q('[data-f]', fab)
    items.forEach((it, i) => (it.dataset.speed = String([0, 0.14, 0.06, 0.2][i])))
    if (wide) speeds(items, vh, touch, fab.querySelector('ul')!)
  }
  return () => cleanups.forEach((f) => f())
}
