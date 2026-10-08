'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics'
import { CONTACT, Crest, LOCALE_NAMES, LOCALES, WhatsAppIcon, useCloseAbove, useMenuContent, useMenuDialog, useScrolled } from './shared'

/*
 * A — Escaparate.
 * The house front on Jorge Juan, translated to a header: the crest on the
 * axis, the rooms of the house either side of it in spaced capitals, and a
 * thin strip above carrying the address, telephone and languages the way a
 * shop window carries its gilt lettering. On small screens the list becomes a
 * column of Cormorant lines that rise into place.
 */

const DESKTOP = 1200

export function DirectionA() {
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { open, toggle, close } = useMenuDialog(rootRef, toggleRef)
  useCloseAbove(DESKTOP, close)
  const scrolled = useScrolled()
  const { items, locale, setLocale, ui, address, hours } = useMenuContent()

  const half = Math.ceil(items.length / 2)
  const left = items.slice(0, half)
  const right = items.slice(half)

  const desktopLink = (item: (typeof items)[number]) => (
    <Link
      key={item.key}
      href={item.href}
      className="mA-link"
      aria-current={item.active ? 'page' : undefined}
    >
      {item.label}
    </Link>
  )

  return (
    <div ref={rootRef} className="mA" data-open={open || undefined} data-scrolled={scrolled || undefined}>
      <header className="mA-bar">
        <div className="mA-strip">
          <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" className="mA-strip-link">
            Jorge Juan 41 · Madrid
          </a>
          <div className="mA-strip-right">
            <a href={CONTACT.tel} className="mA-strip-link" onClick={() => track('phone_click', { location: 'nav' })}>
              {CONTACT.phoneDisplay}
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mA-strip-link"
              onClick={() => track('whatsapp_click', { location: 'nav' })}
            >
              WhatsApp
            </a>
            <div className="mA-langs" role="group" aria-label={ui.language}>
              {LOCALES.map((l) => (
                <button
                  key={l}
                  type="button"
                  className="mA-lang"
                  aria-pressed={locale === l}
                  aria-label={LOCALE_NAMES[l]}
                  onClick={() => setLocale(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mA-row">
          <nav className="mA-side mA-side--left" aria-label={ui.nav}>{left.map(desktopLink)}</nav>

          <Link href="/" className="mA-crest" aria-label="Sastrería Manuel Fernández — Inicio">
            <Crest height="100%" />
          </Link>

          <nav className="mA-side mA-side--right" aria-label={ui.nav}>{right.map(desktopLink)}</nav>

          <div className="mA-compact">
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mA-icon"
              aria-label="WhatsApp"
              onClick={() => track('whatsapp_click', { location: 'nav' })}
            >
              <WhatsAppIcon size={18} />
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="mA-toggle"
              aria-expanded={open}
              aria-controls="mA-panel"
              onClick={toggle}
            >
              <span className="mA-toggle-label">{open ? ui.close : ui.menu}</span>
              <span className="mA-toggle-lines" aria-hidden="true"><span /><span /></span>
            </button>
          </div>
        </div>
      </header>

      <div id="mA-panel" className="mA-panel" role="dialog" aria-modal="true" aria-label={ui.nav} inert={!open}>
        <nav className="mA-panel-inner" aria-label={ui.nav}>
          <ul className="mA-list">
            {items.map((item, i) => (
              <li key={item.key} style={{ ['--i' as string]: i }}>
                <Link
                  href={item.href}
                  data-menu-item
                  className="mA-item"
                  aria-current={item.active ? 'page' : undefined}
                  onClick={close}
                >
                  <span className="mA-mask"><span className="mA-rise">{item.label}</span></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mA-foot" style={{ ['--i' as string]: items.length }}>
            <div className="mA-foot-block">
              <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" className="mA-foot-link">{address}</a>
              <p className="mA-foot-note">{hours}</p>
            </div>
            <div className="mA-foot-actions">
              <a href={CONTACT.tel} className="mA-pill mA-pill--gold" onClick={() => track('phone_click', { location: 'nav' })}>
                {ui.call}
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mA-pill"
                onClick={() => track('whatsapp_click', { location: 'nav' })}
              >
                <WhatsAppIcon size={14} /> WhatsApp
              </a>
            </div>
            <div className="mA-foot-langs" role="group" aria-label={ui.language}>
              {LOCALES.map((l) => (
                <button key={l} type="button" className="mA-foot-lang" aria-pressed={locale === l} onClick={() => setLocale(l)}>
                  {LOCALE_NAMES[l]}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <style>{CSS}</style>
    </div>
  )
}

const CSS = `
.mA { --mA-ease: cubic-bezier(0.16, 1, 0.3, 1); }

.mA-bar {
  position: fixed; inset: 0 0 auto 0; z-index: 1001;
  color: var(--color-white);
  background: linear-gradient(to bottom, rgba(10,22,40,0.55), rgba(10,22,40,0));
  transition: background .5s ease, box-shadow .5s ease;
}
.mA[data-scrolled] .mA-bar,
.mA[data-open] .mA-bar {
  background: rgba(10,22,40,0.96);
  box-shadow: 0 1px 0 rgba(201,168,76,0.14);
}
@supports (backdrop-filter: blur(1px)) {
  .mA[data-scrolled] .mA-bar { background: rgba(10,22,40,0.86); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
  .mA[data-open] .mA-bar { background: transparent; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; }
}

/* Strip: address, phone, languages. Desktop only, folds away on scroll. */
.mA-strip {
  display: none;
  justify-content: space-between; align-items: center;
  padding: 0 var(--container-padding);
  height: 34px; overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  font-family: var(--font-sans); font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase;
  transition: height .5s var(--mA-ease), opacity .3s ease, border-color .5s ease;
}
.mA[data-scrolled] .mA-strip { height: 0; opacity: 0; border-color: transparent; }
.mA-strip-right { display: flex; align-items: center; gap: 1.75rem; }
.mA-strip-link { color: rgba(255,255,255,0.62); text-decoration: none; transition: color .25s ease; }
.mA-strip-link:hover { color: var(--color-gold-light); }
.mA-langs { display: flex; gap: 0.15rem; padding-left: 1.25rem; border-left: 1px solid rgba(255,255,255,0.14); }
.mA-lang {
  background: none; border: 0; cursor: pointer; padding: 0.35rem 0.4rem;
  font: inherit; letter-spacing: 0.16em; color: rgba(255,255,255,0.45);
  transition: color .25s ease;
}
.mA-lang:hover { color: var(--color-white); }
.mA-lang[aria-pressed="true"] { color: var(--color-gold); }

/* Main row */
.mA-row {
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  padding: 0 var(--container-padding);
  height: 76px;
  transition: height .5s var(--mA-ease);
}
.mA[data-scrolled] .mA-row { height: 64px; }
.mA-crest {
  grid-column: 1; justify-self: start;
  display: block; height: 44px;
  transition: height .5s var(--mA-ease);
}
.mA[data-scrolled] .mA-crest { height: 38px; }
.mA-side { display: none; }
.mA-compact { grid-column: 3; justify-self: end; display: flex; align-items: center; gap: 0.5rem; }

.mA-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; color: rgba(255,255,255,0.75);
  transition: color .25s ease;
}
.mA-icon:hover { color: var(--color-gold-light); }

.mA-toggle {
  display: inline-flex; align-items: center; gap: 0.85rem;
  min-height: 44px; padding: 0 0.25rem 0 0.75rem;
  background: none; border: 0; cursor: pointer; color: var(--color-white);
  font-family: var(--font-sans); font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
}
.mA-toggle-lines { position: relative; width: 22px; height: 8px; }
.mA-toggle-lines span {
  position: absolute; left: 0; right: 0; height: 1px; background: currentColor;
  transition: transform .45s var(--mA-ease), top .45s var(--mA-ease);
}
.mA-toggle-lines span:first-child { top: 0; }
.mA-toggle-lines span:last-child { top: 7px; }
.mA[data-open] .mA-toggle-lines span:first-child { top: 4px; transform: rotate(45deg); }
.mA[data-open] .mA-toggle-lines span:last-child { top: 4px; transform: rotate(-45deg); }

@media (min-width: ${DESKTOP}px) {
  .mA-strip { display: flex; }
  .mA-row { height: 92px; }
  .mA-crest { grid-column: 2; justify-self: center; height: 58px; }
  .mA[data-scrolled] .mA-crest { height: 42px; }
  .mA-side { display: flex; align-items: center; gap: clamp(1.5rem, 2.4vw, 2.75rem); }
  .mA-side--left { grid-column: 1; grid-row: 1; justify-self: end; padding-right: clamp(2rem, 3.5vw, 3.5rem); }
  .mA-side--right { grid-column: 3; grid-row: 1; justify-self: start; padding-left: clamp(2rem, 3.5vw, 3.5rem); }
  .mA-compact { display: none; }
}

.mA-link {
  position: relative; padding: 0.6rem 0;
  font-family: var(--font-sans); font-size: 0.7rem; font-weight: 400;
  letter-spacing: 0.2em; text-transform: uppercase; white-space: nowrap;
  color: rgba(255,255,255,0.82); text-decoration: none;
  transition: color .3s ease;
}
.mA-link::after {
  content: ''; position: absolute; left: 0; right: 0.2em; bottom: 0.2rem; height: 1px;
  background: var(--color-gold);
  transform: scaleX(0); transform-origin: center;
  transition: transform .5s var(--mA-ease);
}
.mA-link:hover { color: var(--color-white); }
.mA-link:hover::after, .mA-link[aria-current="page"]::after { transform: scaleX(1); }
.mA-link[aria-current="page"] { color: var(--color-gold-light); }

/* Panel */
.mA-panel {
  position: fixed; inset: 0; z-index: 1000;
  background: var(--color-navy);
  overflow-y: auto; overscroll-behavior: contain;
  visibility: hidden; opacity: 0;
  transition: opacity .45s ease, visibility 0s linear .45s;
}
.mA[data-open] .mA-panel { visibility: visible; opacity: 1; transition: opacity .45s ease, visibility 0s; }
.mA-panel-inner {
  min-height: 100%;
  display: flex; flex-direction: column; justify-content: space-between; gap: 2.5rem;
  padding: calc(76px + clamp(1.5rem, 6vh, 3.5rem)) var(--container-padding) max(2rem, env(safe-area-inset-bottom));
}
.mA-list { list-style: none; border-top: 1px solid rgba(255,255,255,0.08); }
.mA-list li { border-bottom: 1px solid rgba(255,255,255,0.08); }
.mA-item {
  display: block; padding: clamp(0.7rem, 2vh, 1rem) 0;
  font-family: var(--font-serif); font-weight: 300;
  font-size: clamp(2rem, 8.4vw, 3rem); line-height: 1.1;
  color: var(--color-white); text-decoration: none;
  transition: color .3s ease, padding-left .45s var(--mA-ease);
}
.mA-item:hover { color: var(--color-gold-light); padding-left: 0.4rem; }
.mA-item[aria-current="page"] { color: var(--color-gold); font-style: italic; }
.mA-mask { display: block; overflow: hidden; padding-bottom: 0.08em; }
.mA-rise {
  display: block; transform: translateY(105%);
  transition: transform .7s var(--mA-ease);
  transition-delay: calc(var(--i) * 45ms);
}
.mA[data-open] .mA-rise { transform: none; transition-delay: calc(120ms + var(--i) * 55ms); }

.mA-foot {
  display: grid; gap: 1.5rem;
  opacity: 0; transform: translateY(10px);
  transition: opacity .5s ease, transform .6s var(--mA-ease);
}
.mA[data-open] .mA-foot { opacity: 1; transform: none; transition-delay: calc(160ms + var(--i) * 55ms); }
.mA-foot-link {
  font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-white); text-decoration: none;
  border-bottom: 1px solid rgba(201,168,76,0.35); padding-bottom: 2px;
}
.mA-foot-note { margin-top: 0.6rem; font-family: var(--font-sans); font-size: 0.78rem; color: rgba(255,255,255,0.55); line-height: 1.6; }
.mA-foot-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.mA-pill {
  display: inline-flex; align-items: center; gap: 0.5rem;
  min-height: 46px; padding: 0 1.4rem;
  border: 1px solid rgba(255,255,255,0.28); color: var(--color-white); text-decoration: none;
  font-family: var(--font-sans); font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase;
  transition: background .25s ease, color .25s ease, border-color .25s ease;
}
.mA-pill:hover { border-color: var(--color-white); }
.mA-pill--gold { border-color: var(--color-gold); color: var(--color-gold); }
.mA-pill--gold:hover { background: var(--color-gold); color: var(--color-navy); }
.mA-foot-langs { display: flex; flex-wrap: wrap; gap: 0.25rem 1.25rem; }
.mA-foot-lang {
  background: none; border: 0; cursor: pointer; padding: 0.5rem 0;
  font-family: var(--font-sans); font-size: 0.78rem; letter-spacing: 0.04em;
  color: rgba(255,255,255,0.5); transition: color .25s ease;
}
.mA-foot-lang:hover { color: var(--color-white); }
.mA-foot-lang[aria-pressed="true"] { color: var(--color-gold); text-decoration: underline; text-underline-offset: 6px; text-decoration-thickness: 1px; }

.mA a:focus-visible, .mA button:focus-visible { outline: 1px solid var(--color-gold); outline-offset: 4px; }

@media (prefers-reduced-motion: reduce) {
  .mA *, .mA *::before, .mA *::after { transition-duration: 0s !important; transition-delay: 0s !important; }
  .mA-rise { transform: none; }
}
`
