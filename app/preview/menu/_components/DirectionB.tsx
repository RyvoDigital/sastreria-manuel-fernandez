'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { track } from '@/lib/analytics'
import type { Locale } from '@/lib/i18n'
import { CONTACT, Crest, LOCALE_NAMES, LOCALES, WhatsAppIcon, useMenuContent, useMenuDialog, useScrolled, type MenuItemKey } from './shared'

/*
 * B — Libro de pedidos.
 * The order book every bespoke house keeps: one ruled line per entry, a
 * margin rule down the left, and dotted leaders running from each entry to
 * what it covers. The header itself stays almost empty — a word, the crest,
 * an appointment — and the whole menu lives in the book, which draws its
 * leaders in as it opens.
 */

const NOTES: Record<MenuItemKey, Record<Locale, string>> = {
  inicio: { es: 'Jorge Juan 41 · Madrid', en: 'Jorge Juan 41 · Madrid', it: 'Jorge Juan 41 · Madrid', fr: 'Jorge Juan 41 · Madrid' },
  sastreria: { es: 'Manuel y Evelyn Fernández', en: 'Manuel & Evelyn Fernández', it: 'Manuel ed Evelyn Fernández', fr: 'Manuel et Evelyn Fernández' },
  bodas: { es: 'Novio, chaqué y frac', en: 'Grooms, morning coats, tailcoats', it: 'Sposo, tight e frac', fr: 'Marié, jaquette et frac' },
  servicios: { es: 'Traje, abrigo, smoking, camisas', en: 'Suits, coats, dinner suits, shirts', it: 'Abiti, cappotti, smoking, camicie', fr: 'Costumes, manteaux, smokings, chemises' },
  cursos: { es: 'Aprender el oficio', en: 'Learn the craft', it: 'Imparare il mestiere', fr: 'Apprendre le métier' },
  contacto: { es: 'Con cita previa', en: 'By appointment', it: 'Su appuntamento', fr: 'Sur rendez-vous' },
}

export function DirectionB() {
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { open, toggle, close } = useMenuDialog(rootRef, toggleRef)
  const scrolled = useScrolled()
  const { items, locale, setLocale, ui, address, hours, book } = useMenuContent()

  return (
    <div ref={rootRef} className="mB" data-open={open || undefined} data-scrolled={scrolled || undefined}>
      <header className="mB-bar">
        <button
          ref={toggleRef}
          type="button"
          className="mB-toggle"
          aria-expanded={open}
          aria-controls="mB-panel"
          onClick={toggle}
        >
          <span className="mB-toggle-lines" aria-hidden="true"><span /><span /><span /></span>
          <span className="mB-toggle-label">{open ? ui.close : ui.menu}</span>
        </button>

        <Link href="/" className="mB-crest" aria-label="Sastrería Manuel Fernández — Inicio" onClick={close}>
          <Crest height="100%" />
        </Link>

        <div className="mB-right">
          <Link href="/contacto" className="mB-book" onClick={close}>{book}</Link>
          <a href={CONTACT.tel} className="mB-icon" aria-label={ui.call} onClick={() => track('phone_click', { location: 'nav' })}>
            <Phone size={17} strokeWidth={1.4} />
          </a>
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mB-icon"
            aria-label="WhatsApp"
            onClick={() => track('whatsapp_click', { location: 'nav' })}
          >
            <WhatsAppIcon size={17} />
          </a>
        </div>
      </header>

      <div id="mB-panel" className="mB-panel" role="dialog" aria-modal="true" aria-label={ui.nav} inert={!open}>
        <div className="mB-sheet">
          <nav className="mB-ledger" aria-label={ui.nav}>
            <ol className="mB-rows">
              {items.map((item, i) => (
                <li key={item.key} className="mB-row" style={{ ['--i' as string]: i }}>
                  <Link
                    href={item.href}
                    data-menu-item
                    className="mB-entry"
                    aria-current={item.active ? 'page' : undefined}
                    onClick={close}
                  >
                    <span className="mB-name">{item.label}</span>
                    <span className="mB-leader" aria-hidden="true" />
                    <span className="mB-note">{NOTES[item.key][locale]}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <aside className="mB-aside" style={{ ['--i' as string]: items.length }}>
            <Link href="/contacto" className="mB-cta" onClick={close}>{book}</Link>
            <dl className="mB-facts">
              <div>
                <dt>{ui.find}</dt>
                <dd><a href={CONTACT.maps} target="_blank" rel="noopener noreferrer">{address}</a></dd>
              </div>
              <div>
                <dt>{ui.call}</dt>
                <dd>
                  <a href={CONTACT.tel} onClick={() => track('phone_click', { location: 'nav' })}>{CONTACT.phoneDisplay}</a>
                  <span className="mB-sep" aria-hidden="true">·</span>
                  <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { location: 'nav' })}>WhatsApp</a>
                </dd>
              </div>
              <div>
                <dt aria-hidden="true">&nbsp;</dt>
                <dd className="mB-hours">{hours}</dd>
              </div>
            </dl>
            <div className="mB-langs" role="group" aria-label={ui.language}>
              {LOCALES.map((l) => (
                <button key={l} type="button" className="mB-lang" aria-pressed={locale === l} onClick={() => setLocale(l)}>
                  {LOCALE_NAMES[l]}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <style>{CSS}</style>
    </div>
  )
}

const CSS = `
.mB { --mB-ease: cubic-bezier(0.16, 1, 0.3, 1); --mB-rule: rgba(255,255,255,0.09); --mB-paper: #0D1D30; }

.mB-bar {
  position: fixed; inset: 0 0 auto 0; z-index: 1001;
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  height: 84px; padding: 0 var(--container-padding);
  color: var(--color-white);
  background: linear-gradient(to bottom, rgba(10,22,40,0.5), rgba(10,22,40,0));
  transition: height .5s var(--mB-ease), background .5s ease, box-shadow .5s ease;
}
.mB[data-scrolled] .mB-bar { height: 64px; background: rgba(10,22,40,0.94); box-shadow: 0 1px 0 var(--mB-rule); }
.mB[data-open] .mB-bar { background: transparent; box-shadow: none; }
@supports (backdrop-filter: blur(1px)) {
  .mB[data-scrolled]:not([data-open]) .mB-bar { background: rgba(10,22,40,0.82); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
}

.mB-toggle {
  justify-self: start;
  display: inline-flex; align-items: center; gap: 0.9rem;
  min-height: 44px; min-width: 44px; padding: 0;
  background: none; border: 0; cursor: pointer; color: inherit;
  font-family: var(--font-sans); font-size: 0.68rem; letter-spacing: 0.24em; text-transform: uppercase;
}
.mB-toggle-label { display: none; }
.mB-toggle-lines { position: relative; width: 24px; height: 11px; }
.mB-toggle-lines span {
  position: absolute; left: 0; height: 1px; background: currentColor;
  transition: transform .45s var(--mB-ease), opacity .3s ease, width .45s var(--mB-ease), top .45s var(--mB-ease);
}
.mB-toggle-lines span:nth-child(1) { top: 0; width: 24px; }
.mB-toggle-lines span:nth-child(2) { top: 5px; width: 16px; }
.mB-toggle-lines span:nth-child(3) { top: 10px; width: 24px; }
.mB-toggle:hover .mB-toggle-lines span:nth-child(2) { width: 24px; }
.mB[data-open] .mB-toggle-lines span:nth-child(1) { top: 5px; transform: rotate(45deg); }
.mB[data-open] .mB-toggle-lines span:nth-child(2) { opacity: 0; }
.mB[data-open] .mB-toggle-lines span:nth-child(3) { top: 5px; transform: rotate(-45deg); }

.mB-crest { display: block; height: 46px; transition: height .5s var(--mB-ease); }
.mB[data-scrolled] .mB-crest { height: 38px; }

.mB-right { justify-self: end; display: flex; align-items: center; gap: 0.25rem; }
.mB-book {
  display: none; align-items: center; min-height: 40px; padding: 0 1.25rem; margin-right: 0.75rem;
  border: 1px solid rgba(201,168,76,0.7); color: var(--color-gold-light); text-decoration: none;
  font-family: var(--font-sans); font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase;
  transition: background .3s ease, color .3s ease, opacity .3s ease;
}
.mB-book:hover { background: var(--color-gold); color: var(--color-navy); }
.mB[data-open] .mB-book { opacity: 0; pointer-events: none; }
.mB-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; color: rgba(255,255,255,0.78); transition: color .25s ease;
}
.mB-icon:hover { color: var(--color-gold-light); }

@media (min-width: 640px) { .mB-toggle-label { display: inline; } }
@media (min-width: 900px) {
  .mB-bar { height: 96px; }
  .mB-crest { height: 58px; }
  .mB[data-scrolled] .mB-crest { height: 42px; }
  .mB-book { display: inline-flex; }
}

/* The book */
.mB-panel {
  position: fixed; inset: 0; z-index: 1000;
  background: var(--mB-paper);
  overflow-y: auto; overscroll-behavior: contain;
  clip-path: inset(0 0 100% 0);
  visibility: hidden;
  transition: clip-path .55s cubic-bezier(0.7, 0, 0.84, 0), visibility 0s linear .55s;
}
.mB[data-open] .mB-panel {
  clip-path: inset(0 0 0 0); visibility: visible;
  transition: clip-path .8s var(--mB-ease), visibility 0s;
}
.mB-sheet {
  min-height: 100%;
  display: grid; gap: 2.75rem; align-content: start;
  padding: calc(84px + 1.5rem) var(--container-padding) max(2.25rem, env(safe-area-inset-bottom));
}
.mB-ledger { position: relative; padding-left: 1.4rem; }
.mB-ledger::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px;
  background: rgba(201,168,76,0.45);
  transform: scaleY(0); transform-origin: top;
  transition: transform .5s ease;
}
.mB[data-open] .mB-ledger::before { transform: none; transition: transform 1s var(--mB-ease) .2s; }
.mB-rows { list-style: none; border-top: 1px solid var(--mB-rule); }
.mB-row {
  border-bottom: 1px solid var(--mB-rule);
  opacity: 0; transform: translateY(14px);
  transition: opacity .3s ease, transform .4s ease;
}
.mB[data-open] .mB-row {
  opacity: 1; transform: none;
  transition: opacity .6s ease, transform .8s var(--mB-ease);
  transition-delay: calc(180ms + var(--i) * 60ms);
}
.mB-entry {
  position: relative;
  display: grid; grid-template-columns: auto 1fr; grid-template-areas: "name leader" "note note";
  align-items: baseline; column-gap: 0.9rem; row-gap: 0.15rem;
  padding: 0.85rem 0 0.9rem;
  color: var(--color-white); text-decoration: none;
}
.mB-name {
  grid-area: name;
  font-family: var(--font-serif); font-weight: 400; font-size: clamp(1.75rem, 7vw, 3.1rem); line-height: 1.1;
  transition: color .3s ease, transform .5s var(--mB-ease);
}
.mB-leader {
  grid-area: leader; align-self: end; margin-bottom: 0.55em;
  height: 0; border-bottom: 2px dotted rgba(201,168,76,0.4);
  transform: scaleX(0); transform-origin: left;
  transition: transform .3s ease, border-color .3s ease;
}
.mB[data-open] .mB-leader { transform: none; transition: transform 1s var(--mB-ease), border-color .3s ease; transition-delay: calc(380ms + var(--i) * 70ms), 0s; }
.mB-note {
  grid-area: note;
  font-family: var(--font-sans); font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(255,255,255,0.5); transition: color .3s ease;
}
.mB-entry::before {
  content: ''; position: absolute; left: -1.4rem; top: 50%; width: 7px; height: 7px; margin: -3px 0 0 -3px;
  background: var(--color-gold); transform: rotate(45deg) scale(0); transition: transform .4s var(--mB-ease);
}
.mB-entry[aria-current="page"]::before { transform: rotate(45deg) scale(1); }
.mB-entry[aria-current="page"] .mB-name { color: var(--color-gold-light); font-style: italic; }
.mB-entry:hover .mB-name { color: var(--color-gold-light); transform: translateX(0.35rem); }
.mB-entry:hover .mB-leader { border-color: var(--color-gold); }
.mB-entry:hover .mB-note { color: rgba(255,255,255,0.85); }

@media (min-width: 900px) {
  .mB-sheet {
    grid-template-columns: minmax(0, 1.75fr) minmax(16rem, 1fr);
    gap: clamp(3rem, 6vw, 6rem); align-content: center;
    padding-top: calc(96px + 2rem); padding-bottom: 3rem;
  }
  .mB-ledger { padding-left: 2.2rem; }
  .mB-entry { grid-template-columns: auto 1fr auto; grid-template-areas: "name leader note"; padding: 0.95rem 0; }
  .mB-entry::before { left: -2.2rem; }
  .mB-note { white-space: nowrap; }
}

.mB-aside {
  display: grid; gap: 2rem; align-content: start;
  opacity: 0; transition: opacity .3s ease;
}
.mB[data-open] .mB-aside { opacity: 1; transition: opacity .8s ease; transition-delay: calc(300ms + var(--i) * 60ms); }
@media (min-width: 900px) { .mB-aside { padding-left: clamp(2rem, 3vw, 3rem); border-left: 1px solid var(--mB-rule); } }
.mB-cta {
  display: inline-flex; align-items: center; justify-content: center; justify-self: start;
  min-height: 50px; padding: 0 1.75rem;
  background: var(--color-gold); color: var(--color-navy); text-decoration: none;
  font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
  transition: background .3s ease;
}
.mB-cta:hover { background: var(--color-gold-light); }
.mB-facts { display: grid; gap: 1.1rem; }
.mB-facts dt {
  font-family: var(--font-sans); font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--color-gold); margin-bottom: 0.3rem;
}
.mB-facts dd { font-family: var(--font-serif); font-size: 1.15rem; line-height: 1.45; color: var(--color-white); }
.mB-facts a { color: inherit; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.2); transition: border-color .25s ease; }
.mB-facts a:hover { border-color: var(--color-gold); }
.mB-sep { margin: 0 0.6rem; color: rgba(255,255,255,0.35); }
.mB-facts .mB-hours { font-family: var(--font-sans); font-size: 0.8rem; color: rgba(255,255,255,0.55); }
.mB-langs { display: flex; flex-wrap: wrap; gap: 0.25rem 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--mB-rule); }
.mB-lang {
  background: none; border: 0; cursor: pointer; padding: 0.45rem 0;
  font-family: var(--font-sans); font-size: 0.78rem; color: rgba(255,255,255,0.5); transition: color .25s ease;
}
.mB-lang:hover { color: var(--color-white); }
.mB-lang[aria-pressed="true"] { color: var(--color-gold); }

.mB a:focus-visible, .mB button:focus-visible { outline: 1px solid var(--color-gold); outline-offset: 4px; }

@media (prefers-reduced-motion: reduce) {
  .mB *, .mB *::before, .mB *::after, .mB-panel { transition-duration: 0s !important; transition-delay: 0s !important; }
}
`
