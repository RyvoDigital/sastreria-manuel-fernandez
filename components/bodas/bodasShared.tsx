'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Words } from '@/components/el-hilo/Words'
import { BookingLink } from '@/components/global/BookingLink'
import { FINAL, type BodasContent } from './bodasContent'
import s from './el-hilo-bodas.module.css'

/* BodasFormalWear: what the groom wears, and everything that comes with it. */
export function WearLists({ c }: { c: BodasContent }) {
  return (
    <div className={s.lists}>
      <div>
        <span className={s.eyebrow}>{c.wear.label}</span>
        <ul className={s.list} data-list>
          {c.wear.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <span className={s.eyebrow}>{c.acc.label}</span>
        <ul className={`${s.list} ${s.listTwo}`} data-list>
          {c.acc.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* BodasFinal: the closing invitation; its booking button ends the page. */
export function Final({ c }: { c: BodasContent }) {
  return (
    <section className={s.final} aria-labelledby="h-final" data-final>
      <div className={s.finalPhoto} data-final-photo>
        <div className={s.depth} data-depth="6">
          <Image src={FINAL.src} alt={FINAL.alt} fill sizes="100vw" className={s.cover} />
        </div>
      </div>
      <div className={s.finalInner}>
        <span className={s.eyebrow}>{c.cta.label}</span>
        <h2 id="h-final" className={s.statement} style={{ marginTop: '1.25rem' }} data-hl>
          <Words text={c.cta.headline} />
        </h2>
        <div className={s.actions}>
          <BookingLink end className={s.btnPrimary}>
            {c.cta.btn_primary}
          </BookingLink>
          <Link href="/la-sastreria" className={s.btnGhost}>
            {c.cta.btn_secondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
