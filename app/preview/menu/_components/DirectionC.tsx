'use client'

import { useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { track } from '@/lib/analytics'
import { CONTACT, Crest, LOCALE_NAMES, LOCALES, WhatsAppIcon, useCloseAbove, useMenuContent, useMenuDialog, useScrollProgress, useScrolled } from './shared'

/*
 * C — Cinta.
 * A tailor's tape runs the full width under the header. It measures the page:
 * as you scroll, the tape fills in gold from left to right. A small brass tab,
 * the hook at the end of a real tape, sits under the current page and slides
 * to whichever link you point at. On small screens the tape stands upright
 * down the left edge of the open menu, with the tab beside the current page.
 */

const DESKTOP = 1100

export function DirectionC() {
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const linksRef = useRef<HTMLElement>(null)
  const tabRef = useRef<HTMLSpanElement>(null)
  const { open, toggle, close } = useMenuDialog(rootRef, toggleRef)
  useCloseAbove(DESKTOP, close)
  const scrolled = useScrolled()
  useScrollProgress(rootRef)
  const { items, locale, setLocale, ui, address, hours } = useMenuContent()

  // Brass tab: follows hover/focus, rests on the current page.
  const placeTab = useCallback((el: HTMLElement | null) => {
    const tab = tabRef.current
    const nav = linksRef.current
    if (!tab || !nav) return
    if (!el) { tab.style.opacity = '0'; return }
    // The tape spans the viewport, so the link's viewport x is the tab's x.
    const box = el.getBoundingClientRect()
    tab.style.opacity = '1'
    tab.style.transform = `translateX(${box.left + box.width / 2 - 5}px)`
  }, [])
  const restTab = useCallback(() => {
    placeTab(linksRef.current?.querySelector<HTMLElement>('[aria-current="page"]') ?? null)
  }, [placeTab])

  useEffect(() => {
    restTab()
    window.addEventListener('resize', restTab)
    document.fonts?.ready.then(restTab)
    return () => window.removeEventListener('resize', restTab)
  }, [restTab, items.length, locale])

  return (
    <div ref={rootRef} className="mC" data-open={open || undefined} data-scrolled={scrolled || undefined}>
      <header className="mC-bar">
        <div className="mC-row">
          <Link href="/" className="mC-crest" aria-label="Sastrería Manuel Fernández — Inicio" onClick={close}>
            <Crest height="100%" />
          </Link>

          <nav ref={linksRef} className="mC-links" aria-label={ui.nav} onMouseLeave={restTab} onBlur={restTab}>
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="mC-link"
                aria-current={item.active ? 'page' : undefined}
                onMouseEnter={(e) => placeTab(e.currentTarget)}
                onFocus={(e) => placeTab(e.currentTarget)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mC-tools">
            <a href={CONTACT.tel} className="mC-icon" aria-label={ui.call} onClick={() => track('phone_click', { location: 'nav' })}>
              <Phone size={16} strokeWidth={1.4} />
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mC-icon"
              aria-label="WhatsApp"
              onClick={() => track('whatsapp_click', { location: 'nav' })}
            >
              <WhatsAppIcon size={16} />
            </a>
            <div className="mC-langs" role="group" aria-label={ui.language}>
              {LOCALES.map((l) => (
                <button key={l} type="button" className="mC-lang" aria-pressed={locale === l} aria-label={LOCALE_NAMES[l]} onClick={() => setLocale(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              ref={toggleRef}
              type="button"
              className="mC-toggle"
              aria-expanded={open}
              aria-controls="mC-panel"
              aria-label={open ? ui.close : ui.menu}
              onClick={toggle}
            >
              <span aria-hidden="true"><span /><span /></span>
            </button>
          </div>
        </div>

        <div className="mC-tape" aria-hidden="true">
          <span className="mC-tape-base" />
          <span className="mC-tape-fill" />
          <span ref={tabRef} className="mC-tab" />
        </div>
      </header>

      <div id="mC-panel" className="mC-panel" role="dialog" aria-modal="true" aria-label={ui.nav} inert={!open}>
        <div className="mC-sheet">
          <span className="mC-vtape" aria-hidden="true" />
          <nav aria-label={ui.nav}>
            <ul className="mC-list">
              {items.map((item, i) => (
                <li key={item.key} style={{ ['--i' as string]: i }}>
                  <Link
                    href={item.href}
                    data-menu-item
                    className="mC-item"
                    aria-current={item.active ? 'page' : undefined}
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mC-foot" style={{ ['--i' as string]: items.length }}>
            <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" className="mC-address">{address}</a>
            <p className="mC-hours">{hours}</p>
            <div className="mC-actions">
              <a href={CONTACT.tel} className="mC-btn mC-btn--gold" onClick={() => track('phone_click', { location: 'nav' })}>
                <Phone size={14} strokeWidth={1.5} /> {ui.call}
              </a>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="mC-btn" onClick={() => track('whatsapp_click', { location: 'nav' })}>
                <WhatsAppIcon size={14} /> WhatsApp
              </a>
            </div>
            <div className="mC-flangs" role="group" aria-label={ui.language}>
              {LOCALES.map((l) => (
                <button key={l} type="button" className="mC-flang" aria-pressed={locale === l} onClick={() => setLocale(l)}>
                  {LOCALE_NAMES[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{CSS}</style>
    </div>
  )
}

// Tape graduations: a short tick every 8px, a long one every 80px.
const TICKS = `
  repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 80px),
  repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 8px)
`
const VTICKS = `
  repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 80px),
  repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 8px)
`

const CSS = `
.mC { --mC-ease: cubic-bezier(0.16, 1, 0.3, 1); --progress: 0; }

.mC-bar {
  position: fixed; inset: 0 0 auto 0; z-index: 1001; color: var(--color-white);
  background: linear-gradient(to bottom, rgba(10,22,40,0.5), rgba(10,22,40,0));
  transition: background .5s ease;
}
.mC[data-scrolled] .mC-bar { background: rgba(10,22,40,0.94); }
.mC[data-open] .mC-bar { background: var(--color-navy); }
@supports (backdrop-filter: blur(1px)) {
  .mC[data-scrolled]:not([data-open]) .mC-bar { background: rgba(10,22,40,0.82); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
}
.mC-row {
  display: flex; align-items: center; justify-content: space-between; gap: 2rem;
  height: 78px; padding: 0 var(--container-padding);
  transition: height .5s var(--mC-ease);
}
.mC[data-scrolled] .mC-row { height: 62px; }
.mC-crest { display: block; height: 44px; flex-shrink: 0; transition: height .5s var(--mC-ease); }
.mC[data-scrolled] .mC-crest { height: 36px; }

.mC-links { display: none; }
.mC-link {
  position: relative; padding: 0.5rem 0;
  font-family: var(--font-serif); font-size: 1.12rem; font-weight: 400; letter-spacing: 0.01em; white-space: nowrap;
  color: rgba(255,255,255,0.78); text-decoration: none; transition: color .3s ease;
}
.mC-link:hover, .mC-link:focus-visible { color: var(--color-white); }
.mC-link[aria-current="page"] { color: var(--color-gold-light); font-style: italic; }

.mC-tools { display: flex; align-items: center; gap: 0.1rem; }
.mC-icon {
  display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px;
  color: rgba(255,255,255,0.72); transition: color .25s ease;
}
.mC-icon:hover { color: var(--color-gold-light); }
.mC-icon:first-child { display: none; }
.mC-langs { display: none; margin-left: 0.5rem; padding-left: 0.9rem; border-left: 1px solid rgba(255,255,255,0.15); }
.mC-lang {
  background: none; border: 0; cursor: pointer; padding: 0.4rem 0.32rem;
  font-family: var(--font-sans); font-size: 0.64rem; letter-spacing: 0.14em; color: rgba(255,255,255,0.45);
  transition: color .25s ease;
}
.mC-lang:hover { color: var(--color-white); }
.mC-lang[aria-pressed="true"] { color: var(--color-gold); }

.mC-toggle { width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; background: none; border: 0; cursor: pointer; color: inherit; }
.mC-toggle > span { position: relative; width: 22px; height: 8px; }
.mC-toggle > span > span { position: absolute; left: 0; right: 0; height: 1px; background: currentColor; transition: transform .45s var(--mC-ease), top .45s var(--mC-ease); }
.mC-toggle > span > span:first-child { top: 0; }
.mC-toggle > span > span:last-child { top: 7px; }
.mC[data-open] .mC-toggle > span > span:first-child { top: 4px; transform: rotate(45deg); }
.mC[data-open] .mC-toggle > span > span:last-child { top: 4px; transform: rotate(-45deg); }

@media (min-width: ${DESKTOP}px) {
  .mC-row { height: 92px; }
  .mC-crest { height: 56px; }
  .mC[data-scrolled] .mC-crest { height: 40px; }
  .mC-links { display: flex; align-items: center; gap: clamp(1.4rem, 2.3vw, 2.6rem); margin-left: auto; }
  .mC-icon:first-child { display: inline-flex; }
  .mC-langs { display: flex; }
  .mC-toggle { display: none; }
}

/* The tape */
.mC-tape { position: relative; height: 10px; }
.mC-tape-base, .mC-tape-fill {
  position: absolute; inset: 0;
  background: ${TICKS};
  background-size: 100% 10px, 100% 4px; background-repeat: repeat-x; background-position: 0 0, 0 0;
}
.mC-tape-base { color: rgba(201,168,76,0.28); border-top: 1px solid rgba(201,168,76,0.28); }
.mC-tape-fill {
  color: var(--color-gold); border-top: 1px solid var(--color-gold);
  clip-path: inset(0 calc((1 - var(--progress)) * 100%) 0 0);
}
.mC-tab {
  position: absolute; left: 0; top: -1px; width: 10px; height: 7px;
  background: var(--color-gold); clip-path: polygon(0 0, 100% 0, 50% 100%);
  opacity: 0; transition: transform .55s var(--mC-ease), opacity .3s ease;
}
@media (max-width: ${DESKTOP - 1}px) { .mC-tab { display: none; } }
.mC[data-open] .mC-tape { opacity: 0; }

/* Panel */
.mC-panel {
  position: fixed; inset: 0; z-index: 1000; background: var(--color-navy);
  overflow-y: auto; overscroll-behavior: contain;
  visibility: hidden; opacity: 0;
  transition: opacity .4s ease, visibility 0s linear .4s;
}
.mC[data-open] .mC-panel { visibility: visible; opacity: 1; transition: opacity .35s ease, visibility 0s; }
.mC-sheet {
  position: relative; min-height: 100%;
  display: flex; flex-direction: column; justify-content: space-between; gap: 2.5rem;
  padding: calc(78px + 1.75rem) var(--container-padding) max(2rem, env(safe-area-inset-bottom)) calc(var(--container-padding) + 2.4rem);
}
.mC-vtape {
  position: absolute; left: var(--container-padding); top: 78px; bottom: 0; width: 12px;
  color: rgba(201,168,76,0.45); border-left: 1px solid rgba(201,168,76,0.45);
  background: ${VTICKS}; background-size: 12px 100%, 5px 100%; background-repeat: repeat-y;
  transform: scaleY(0); transform-origin: top; transition: transform .4s ease;
}
.mC[data-open] .mC-vtape { transform: none; transition: transform 1.1s var(--mC-ease); }
.mC-list { list-style: none; display: grid; gap: clamp(0.2rem, 1.2vh, 0.6rem); }
.mC-list li {
  opacity: 0; transform: translateX(-14px);
  transition: opacity .25s ease, transform .3s ease;
}
.mC[data-open] .mC-list li {
  opacity: 1; transform: none;
  transition: opacity .6s ease, transform .8s var(--mC-ease);
  transition-delay: calc(200ms + var(--i) * 65ms);
}
.mC-item {
  position: relative; display: inline-block; padding: 0.35rem 0;
  font-family: var(--font-serif); font-weight: 300; font-size: clamp(2rem, 8.6vw, 2.9rem); line-height: 1.15;
  color: var(--color-white); text-decoration: none; transition: color .3s ease;
}
.mC-item::before {
  content: ''; position: absolute; top: 50%; left: calc(-2.4rem + 12px); width: 0; height: 1px; background: var(--color-gold);
  transition: width .45s var(--mC-ease);
}
.mC-item:hover { color: var(--color-gold-light); }
.mC-item:hover::before, .mC-item:focus-visible::before { width: 1.4rem; }
.mC-item[aria-current="page"] { color: var(--color-gold); font-style: italic; }
.mC-item[aria-current="page"]::before { width: 1.4rem; }
.mC-item[aria-current="page"]::after {
  content: ''; position: absolute; top: 50%; left: calc(-2.4rem - 1px); width: 7px; height: 10px; margin-top: -5px;
  background: var(--color-gold); clip-path: polygon(0 0, 100% 50%, 0 100%);
}

.mC-foot { display: grid; gap: 1.1rem; opacity: 0; transition: opacity .25s ease; }
.mC[data-open] .mC-foot { opacity: 1; transition: opacity .8s ease; transition-delay: calc(260ms + var(--i) * 65ms); }
.mC-address { font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-white); text-decoration: none; }
.mC-address:hover { color: var(--color-gold-light); }
.mC-hours { font-family: var(--font-sans); font-size: 0.78rem; color: rgba(255,255,255,0.55); line-height: 1.6; }
.mC-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.4rem; }
.mC-btn {
  display: inline-flex; align-items: center; gap: 0.55rem; min-height: 46px; padding: 0 1.3rem;
  border: 1px solid rgba(255,255,255,0.28); color: var(--color-white); text-decoration: none;
  font-family: var(--font-sans); font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
  transition: background .25s ease, color .25s ease, border-color .25s ease;
}
.mC-btn:hover { border-color: var(--color-white); }
.mC-btn--gold { border-color: var(--color-gold); color: var(--color-gold); }
.mC-btn--gold:hover { background: var(--color-gold); color: var(--color-navy); }
.mC-flangs { display: flex; flex-wrap: wrap; gap: 0.25rem 1.25rem; }
.mC-flang {
  background: none; border: 0; cursor: pointer; padding: 0.45rem 0;
  font-family: var(--font-sans); font-size: 0.78rem; color: rgba(255,255,255,0.5); transition: color .25s ease;
}
.mC-flang:hover { color: var(--color-white); }
.mC-flang[aria-pressed="true"] { color: var(--color-gold); }

.mC a:focus-visible, .mC button:focus-visible { outline: 1px solid var(--color-gold); outline-offset: 4px; }

@media (prefers-reduced-motion: reduce) {
  .mC *, .mC *::before, .mC *::after, .mC-panel { transition-duration: 0s !important; transition-delay: 0s !important; }
}
`
