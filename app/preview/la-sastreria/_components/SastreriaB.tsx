'use client'

import { useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useScene, highlight, depth, type SceneEnv } from '@/lib/scroll-scene'
import { Words } from '@/components/el-hilo/Words'
import { BookingLink } from '@/components/global/BookingLink'
import { useSastreriaContent, IMG, ALT } from './content'
import s from './sastreria.module.css'

/* B · El relevo: one frame per chapter; things hand over in place. */
const RUN = { hero: 80, filo: 110, oficio: 120, espacio: 100 }
const pin = (run: number) => ({ '--run': run }) as CSSProperties
const runPx = (run: number, vh: number) => (run * (window.innerWidth >= 900 ? 1 : 0.8) * vh) / 100

export function SastreriaB() {
  const c = useSastreriaContent()
  const root = useRef<HTMLDivElement>(null)
  const [oficio, setOficio] = useState(0)
  useScene(root, (env) => build(env, setOficio), [c.locale])

  return (
    <div ref={root} className={s.page}>
      {/* HERO: the title first; the photo opens out of a gold slit beneath it */}
      <section className={`${s.bHero} ${s.pin}`} style={pin(RUN.hero)} data-b-hero aria-labelledby="h-sastreria">
        <div className={s.stage}>
          <div className={s.bHeroMedia} data-b-media>
            <div className={s.bHeroImg} data-b-img>
              <Image src={IMG.hero} alt={ALT.hero} fill priority sizes="100vw" className={s.cover} />
            </div>
          </div>
          <span className={s.bHeroShade} aria-hidden="true" data-b-shade />
          <span className={s.bHeroSlit} aria-hidden="true" data-b-slit />
          <div className={s.bHeroText} data-b-title>
            <span className={s.eyebrow}>{c.hero.label}</span>
            <h1 id="h-sastreria" className={s.h1}>
              <span className={s.h1Line1}>{c.hero.headline_line1}</span>
              <span className={s.h1Line2}>{c.hero.headline_line2}</span>
            </h1>
            <p className={s.subline}>{c.hero.subline}</p>
          </div>
        </div>
      </section>

      {/* FILOSOFÍA: the three lines fill word by word, one after the other */}
      <section className={`${s.bSection} ${s.bFilo} ${s.pin}`} style={pin(RUN.filo)} data-b-filo>
        <div className={s.stage}>
          <span className={s.eyebrow}>{c.filosofia.label}</span>
          <p className={s.bFiloLines}>
            {c.filosofia.lines.map((line) => (
              <span key={line} className={s.bFiloLine}>
                <Words text={line} />
              </span>
            ))}
          </p>
        </div>
      </section>
      <section className={`${s.bSection} ${s.afterPin}`} style={{ paddingTop: '3rem' }}>
        <div className={s.bFiloParas}>
          {c.filosofia.paras.map((p) => (
            <p key={p} className={s.body} style={{ fontSize: '1.0625rem' }}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* EL OFICIO: one frame, four photographs; the words change beside it */}
      <section className={`${s.bSection} ${s.bOficio} ${s.pin}`} style={pin(RUN.oficio)} data-b-oficio aria-labelledby="h-oficio">
        <div className={s.stage}>
          <header className={s.bOficioHead}>
            <span className={s.eyebrow}>{c.oficio.label}</span>
            <h2 id="h-oficio" className={s.h2}>
              {c.oficio.title}
            </h2>
          </header>
          <ul className={s.bOficioList}>
            {c.oficio.items.map((o) => (
              <li key={o.image} className={s.bOficioItem}>
                <div className={`${s.frame} ${s.bOficioFrame}`} data-b-frame>
                  <div className={s.depth} data-b-img>
                    <Image src={o.image} alt="" fill sizes="(min-width: 900px) 55vw, 100vw" className={s.cover} />
                  </div>
                </div>
                <div className={s.bOficioMeta} data-b-meta>
                  <span className={s.bOficioCat}>{o.cat}</span>
                  <h3 className={s.bOficioTitle}>{o.title}</h3>
                  <span className={s.bOficioRight}>{o.right}</span>
                </div>
              </li>
            ))}
          </ul>
          <span className={s.bTicks} aria-hidden="true">
            {c.oficio.items.map((o, i) => (
              <i key={o.image} style={{ '--p': i <= oficio ? 1 : 0 } as CSSProperties} />
            ))}
          </span>
        </div>
      </section>

      {/* EL RELEVO: Manuel, then Evelyn; her portrait dissolves in over his */}
      <section className={`${s.bSection} ${s.bRelevoSection}`} data-b-relevo>
        <div className={s.bRelevo}>
          <div className={s.bRelevoMedia}>
            <div className={s.frame}>
              <div className={s.depth} data-depth="6">
                <Image src={IMG.manuel} alt={ALT.manuel} fill sizes="(min-width: 900px) 40vw, 100vw" className={s.cover} />
              </div>
            </div>
            <div className={s.frame} data-b-evelyn-photo>
              <div className={s.depth} data-depth="6">
                <Image src={IMG.evelyn} alt={ALT.evelyn} fill sizes="(min-width: 900px) 40vw, 100vw" className={s.cover} />
              </div>
            </div>
          </div>
          <div className={s.bRelevoText}>
            <div className={s.bRelevoBlock}>
              <span className={s.eyebrow}>{c.historia.label}</span>
              <h2 className={s.h2}>{c.historia.name}</h2>
              {c.historia.paras.map((p) => (
                <p key={p} className={s.body}>
                  {p}
                </p>
              ))}
            </div>
            <div className={s.bRelevoBlock} data-b-evelyn>
              <span className={s.eyebrow}>{c.evelyn.label}</span>
              <h2 className={s.h2}>{c.evelyn.name}</h2>
              {c.evelyn.paras.map((p) => (
                <p key={p} className={s.body}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EL ESPACIO: pull back from the wide photo to the whole room */}
      <section className={`${s.bSection} ${s.bEspacio} ${s.pin}`} style={pin(RUN.espacio)} data-b-espacio aria-labelledby="h-espacio">
        <div className={s.stage}>
          <header className={s.bEspacioHead} data-b-esphead>
            <span className={s.eyebrow}>{c.espacio.label}</span>
            <h2 id="h-espacio" className={s.h2}>
              {c.espacio.title}
            </h2>
          </header>
          <div className={s.bEspacioStage}>
            <div className={`${s.frame} ${s.bEspacioMain}`} data-b-room="0">
              <Image src={IMG.espacio} alt={ALT.espacio} fill sizes="100vw" className={s.cover} />
            </div>
            <div className={`${s.frame} ${s.bEspacioSide}`} data-b-room="1">
              <Image src={IMG.espacio2} alt={ALT.espacioSmall} fill sizes="(min-width: 900px) 20vw, 45vw" className={s.cover} />
            </div>
            <div className={`${s.frame} ${s.bEspacioSide}`} data-b-room="2">
              <Image src={IMG.espacio1} alt={ALT.espacioSmall} fill sizes="(min-width: 900px) 20vw, 45vw" className={s.cover} />
            </div>
          </div>
        </div>
      </section>
      <section className={s.bSection} style={{ paddingTop: '3rem' }}>
        <div className={s.bEspacioText}>
          <p className={s.statement} data-hl>
            <Words text={c.espacio.description} />
          </p>
          <div>
            <span className={s.eyebrow}>{c.espacio.subtitle}</span>
            <p className={s.body} style={{ marginTop: '1rem' }}>
              {c.espacio.body}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={s.bCta} aria-labelledby="h-cta">
        <div className={s.bCtaMedia}>
          <div className={s.depth} data-depth="10">
            <Image src={IMG.cta} alt="" fill sizes="100vw" className={s.cover} />
          </div>
        </div>
        <span className={s.bCtaShade} aria-hidden="true" />
        <div className={s.bCtaInner}>
          <span className={s.eyebrow}>{c.cta.label}</span>
          <h2 id="h-cta" className={s.statement} data-hl>
            <Words text={c.cta.headline} />
          </h2>
          <div className={s.actions}>
            <BookingLink className={s.btnPrimary}>{c.cta.btn_primary}</BookingLink>
            <Link href="/la-sastreria" className={s.btnGhost}>
              {c.cta.btn_secondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function build({ root, q, vh, touch, wide }: SceneEnv, setOficio: (i: number) => void) {
  depth(q('[data-depth]'), touch)
  q('[data-hl]').forEach((n) => highlight(n))
  const timeline = (el: Element, run: number) =>
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${runPx(run, vh)}`, scrub: true } })

  // HERO: the slit opens into the full photo; the title lifts away.
  {
    const hero = q('[data-b-hero]')[0]
    const media = q('[data-b-media]', hero)[0]
    const img = q('[data-b-img]', hero)[0]
    gsap.set(media, { clipPath: 'inset(56% 6% 36% 6%)' })
    gsap.set(img, { scale: 1.25 })
    gsap.set(q('[data-b-shade]', hero), { opacity: 0 })
    timeline(hero, RUN.hero)
      .to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' }, 0)
      .to(img, { scale: 1, duration: 1 }, 0)
      .to(q('[data-b-slit]', hero), { opacity: 0, duration: 0.15 }, 0)
      .to(q('[data-b-shade]', hero), { opacity: 1, duration: 0.4 }, 0.2)
      .to(q('[data-b-title]', hero), { yPercent: -18, duration: 1 }, 0)
  }

  // FILOSOFÍA: one line after the other fills, scrubbed.
  {
    const filo = q('[data-b-filo]')[0]
    const tl = timeline(filo, RUN.filo)
    q(':scope > span', filo.querySelector('p')!).forEach((line, i) => highlight(line, { tl, at: i * 0.32, span: 0.28, from: 0.18 }))
    tl.to({}, { duration: 0.05 }, 0.95)
  }

  // EL OFICIO: four photographs wipe in over one another in the same frame.
  {
    const of = q('[data-b-oficio]')[0]
    const frames = q('[data-b-frame]', of)
    const imgs = q('[data-b-img]', of)
    const metas = q('[data-b-meta]', of)
    gsap.set(frames.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' })
    gsap.set(metas.slice(1), { autoAlpha: 0, y: 24 })
    const tl = timeline(of, RUN.oficio)
    for (let i = 1; i < frames.length; i++) {
      const at = i - 1
      tl.to(frames[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, at)
        .fromTo(imgs[i], { scale: 1.2 }, { scale: 1, duration: 1 }, at)
        .to(metas[i - 1], { autoAlpha: 0, y: -24, duration: 0.35 }, at + 0.1)
        .to(metas[i], { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.55)
    }
    let last = -1
    tl.eventCallback('onUpdate', () => {
      const idx = Math.round(tl.progress() * (frames.length - 1))
      if (idx !== last) setOficio((last = idx))
    })
  }

  // EL RELEVO: Evelyn's portrait dissolves in over Manuel's as her text arrives.
  {
    const ev = q('[data-b-evelyn]')[0]
    gsap.fromTo(q('[data-b-evelyn-photo]')[0], { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: ev, start: wide ? 'top 85%' : 'top 95%', end: wide ? 'top 40%' : 'top 60%', scrub: true } })
  }

  // EL ESPACIO: start inside the wide photo at full screen, pull back to the room.
  {
    const esp = q('[data-b-espacio]')[0]
    const rooms = q('[data-b-room]', esp)
    const stage = esp.querySelector(`.${s.stage}`) as HTMLElement
    const tl = timeline(esp, RUN.espacio)
    const sr = stage.getBoundingClientRect()
    rooms.forEach((room, i) => {
      const r = room.getBoundingClientRect()
      // scale each layer about the stage centre so the main photo starts covering the screen
      const cover = Math.max(sr.width / r.width, sr.height / r.height) * 1.03
      const ox = sr.left + sr.width / 2 - (r.left + r.width / 2)
      const oy = sr.top + sr.height / 2 - (r.top + r.height / 2)
      if (i === 0) {
        tl.fromTo(room, { x: ox, y: oy, scale: cover }, { x: 0, y: 0, scale: 1, duration: 0.75, ease: 'power1.inOut' }, 0)
      } else {
        tl.fromTo(room, { autoAlpha: 0, y: vh * 0.25 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power1.out' }, 0.4 + i * 0.08)
      }
    })
    tl.fromTo(q('[data-b-esphead]', esp), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.55)
    tl.to({}, { duration: 0.15 })
  }
  void root
}
