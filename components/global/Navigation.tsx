'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n, type Locale } from '@/lib/i18n'
import { track } from '@/lib/analytics'
import { useSettings } from '@/lib/settings-provider'
import { useMenuDialog, useScrolled } from '@/lib/use-menu-dialog'
import { SITE_PHONE_DISPLAY, SITE_PHONE_E164 } from '@/lib/site'
import { BookingLink } from '@/components/global/BookingLink'

/*
 * Escaparate: the house front on Jorge Juan, translated to a header. On wide
 * screens the crest sits on the axis with the pages of the site either side
 * in spaced capitals, and a thin strip above carries the address, telephone
 * and languages the way a shop window carries its gilt lettering. The strip
 * folds away on scroll. Below DESKTOP the bar is crest + "Menú", and the menu
 * opens as a column of Cormorant lines that rise into place.
 */

const DESKTOP = 1200

const ALL_NAV_ITEMS = [
  { key: 'inicio', href: '/', settingId: null },
  { key: 'sastreria', href: '/la-sastreria', settingId: null },
  { key: 'bodas', href: '/bodas-y-ceremonia', settingId: 'bodas' },
  { key: 'servicios', href: '/servicios', settingId: null },
  { key: 'cursos', href: '/cursos', settingId: 'cursos' },
  { key: 'contacto', href: '/contacto', settingId: 'contacto' },
] as const

const LOCALES: Locale[] = ['es', 'en', 'it', 'fr']

const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  it: 'Italiano',
  fr: 'Français',
}

const CONTACT = {
  tel: `tel:${SITE_PHONE_E164}`,
  whatsapp: 'https://wa.me/34682192944',
  maps: 'https://www.google.com/maps/search/?api=1&query=Sastrería+Manuel+Fernández,+C.+de+Jorge+Juan,+41,+Salamanca,+28001+Madrid',
}

const UI: Record<Locale, { menu: string; close: string; call: string; language: string; nav: string; home: string }> = {
  es: { menu: 'Menú', close: 'Cerrar', call: 'Llámanos', language: 'Idioma', nav: 'Navegación principal', home: 'Inicio' },
  en: { menu: 'Menu', close: 'Close', call: 'Call us', language: 'Language', nav: 'Main navigation', home: 'Home' },
  it: { menu: 'Menu', close: 'Chiudi', call: 'Chiamaci', language: 'Lingua', nav: 'Navigazione principale', home: 'Home' },
  fr: { menu: 'Menu', close: 'Fermer', call: 'Appelez-nous', language: 'Langue', nav: 'Navigation principale', home: 'Accueil' },
}

/** WhatsApp's own glyph rather than a generic speech bubble. */
function WhatsAppIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  )
}

export function Navigation() {
  const { t, locale, setLocale } = useI18n()
  const { isEnabled } = useSettings()
  const pathname = usePathname() ?? '/'
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { open, toggle, close } = useMenuDialog(rootRef, toggleRef, DESKTOP)
  const scrolled = useScrolled()

  if (pathname.startsWith('/admin')) return null

  const ui = UI[locale]
  const items = ALL_NAV_ITEMS.filter((i) => !i.settingId || isEnabled(i.settingId)).map((i) => ({
    key: i.key,
    href: i.href,
    label: t.nav[i.key],
    active: i.href === '/' ? pathname === '/' : pathname.startsWith(i.href),
  }))
  // Desktop bar: the crest is the link home, so "Inicio" lives only in the menu
  // panel; that leaves room for "Reservar cita" at the end of the right side.
  const barItems = items.filter((i) => i.key !== 'inicio')
  const half = Math.ceil(barItems.length / 2)

  const trackPhone = () => track('phone_click', { location: 'nav' })
  const trackWhatsApp = () => track('whatsapp_click', { location: 'nav' })

  const desktopLink = (item: (typeof items)[number]) => (
    <Link key={item.key} href={item.href} className="mf-nav-link" aria-current={item.active ? 'page' : undefined}>
      {item.label}
    </Link>
  )

  return (
    <div ref={rootRef} className="mf-nav" data-open={open || undefined} data-scrolled={scrolled || undefined}>
      <header className="mf-nav-bar">
        <div className="mf-nav-strip">
          <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" className="mf-nav-strip-link">
            Jorge Juan 41 · Madrid
          </a>
          <div className="mf-nav-strip-right">
            <a href={CONTACT.tel} className="mf-nav-strip-link" onClick={trackPhone}>{SITE_PHONE_DISPLAY}</a>
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="mf-nav-strip-link" onClick={trackWhatsApp}>
              WhatsApp
            </a>
            <div className="mf-nav-langs" role="group" aria-label={ui.language}>
              {LOCALES.map((l) => (
                <button
                  key={l}
                  type="button"
                  className="mf-nav-lang"
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

        <div className="mf-nav-row">
          <nav className="mf-nav-side mf-nav-side--left" aria-label={ui.nav}>{barItems.slice(0, half).map(desktopLink)}</nav>

          <Link href="/" className="mf-nav-crest" aria-label={`Sastrería Manuel Fernández — ${ui.home}`} onClick={close}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/crest-160.webp" srcSet="/img/crest-160.webp 160w, /img/crest-320.webp 320w, /img/crest-480.webp 480w" sizes="80px" alt="" width={2000} height={1317} />
          </Link>

          <div className="mf-nav-side mf-nav-side--right">
            <nav className="mf-nav-side-links" aria-label={ui.nav}>{barItems.slice(half).map(desktopLink)}</nav>
            <BookingLink className="mf-nav-book mf-nav-book--row">{t.hero.cta_book}</BookingLink>
          </div>

          <div className="mf-nav-compact">
            <BookingLink className="mf-nav-book mf-nav-book--compact" onClick={close}>{t.hero.cta_book}</BookingLink>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mf-nav-icon"
              aria-label="WhatsApp"
              onClick={trackWhatsApp}
            >
              <WhatsAppIcon size={18} />
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="mf-nav-toggle"
              aria-expanded={open}
              aria-controls="mf-nav-panel"
              onClick={toggle}
            >
              <span className="mf-nav-toggle-label">{open ? ui.close : ui.menu}</span>
              <span className="mf-nav-toggle-lines" aria-hidden="true"><span /><span /></span>
            </button>
          </div>
        </div>
      </header>

      <div id="mf-nav-panel" className="mf-nav-panel" role="dialog" aria-modal="true" aria-label={ui.nav} inert={!open}>
        <nav className="mf-nav-panel-inner" aria-label={ui.nav}>
          <ul className="mf-nav-list">
            {items.map((item, i) => (
              <li key={item.key} style={{ ['--i' as string]: i }}>
                <Link
                  href={item.href}
                  data-menu-item
                  className="mf-nav-item"
                  aria-current={item.active ? 'page' : undefined}
                  onClick={close}
                >
                  <span className="mf-nav-mask"><span className="mf-nav-rise">{item.label}</span></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mf-nav-foot" style={{ ['--i' as string]: items.length }}>
            <div className="mf-nav-foot-block">
              <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" className="mf-nav-foot-link">{t.footer.address}</a>
              <p className="mf-nav-foot-note">{t.footer.hours}</p>
            </div>
            <div className="mf-nav-foot-actions">
              <BookingLink className="mf-nav-pill mf-nav-pill--solid" onClick={close}>{t.hero.cta_book}</BookingLink>
              <a href={CONTACT.tel} className="mf-nav-pill mf-nav-pill--gold" onClick={trackPhone}>{ui.call}</a>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="mf-nav-pill" onClick={trackWhatsApp}>
                <WhatsAppIcon size={14} /> WhatsApp
              </a>
            </div>
            <div className="mf-nav-foot-langs" role="group" aria-label={ui.language}>
              {LOCALES.map((l) => (
                <button key={l} type="button" className="mf-nav-foot-lang" aria-pressed={locale === l} onClick={() => setLocale(l)}>
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
.mf-nav { --mf-nav-ease: cubic-bezier(0.16, 1, 0.3, 1); }

.mf-nav-bar {
  position: fixed; inset: 0 0 auto 0; z-index: 1001;
  color: var(--color-white);
  background: linear-gradient(to bottom, rgba(10,22,40,0.55), rgba(10,22,40,0));
  transition: background .5s ease, box-shadow .5s ease;
}
.mf-nav[data-scrolled] .mf-nav-bar,
.mf-nav[data-open] .mf-nav-bar {
  background: rgba(10,22,40,0.96);
  box-shadow: 0 1px 0 rgba(201,168,76,0.14);
}
@supports (backdrop-filter: blur(1px)) {
  .mf-nav[data-scrolled] .mf-nav-bar { background: rgba(10,22,40,0.86); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
  .mf-nav[data-open] .mf-nav-bar { background: transparent; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; }
}

/* Strip: address, phone, languages. Desktop only, folds away on scroll. */
.mf-nav-strip {
  display: none;
  justify-content: space-between; align-items: center;
  padding: 0 var(--container-padding);
  height: 30px; overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  font-family: var(--font-sans); font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase;
  transition: height .5s var(--mf-nav-ease), opacity .3s ease, border-color .5s ease;
}
.mf-nav[data-scrolled] .mf-nav-strip { height: 0; opacity: 0; border-color: transparent; }
.mf-nav-strip-right { display: flex; align-items: center; gap: 1.75rem; }
.mf-nav-strip-link { color: rgba(255,255,255,0.62); text-decoration: none; transition: color .25s ease; }
.mf-nav-strip-link:hover { color: var(--color-gold-light); }
.mf-nav-langs { display: flex; gap: 0.15rem; padding-left: 1.25rem; border-left: 1px solid rgba(255,255,255,0.14); }
.mf-nav-lang {
  background: none; border: 0; cursor: pointer; padding: 0.35rem 0.4rem;
  font: inherit; letter-spacing: 0.16em; color: rgba(255,255,255,0.45);
  transition: color .25s ease;
}
.mf-nav-lang:hover { color: var(--color-white); }
.mf-nav-lang[aria-pressed="true"] { color: var(--color-gold); }

/* Main row */
.mf-nav-row {
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  padding: 0 var(--container-padding);
  height: 76px;
  transition: height .5s var(--mf-nav-ease);
}
.mf-nav[data-scrolled] .mf-nav-row { height: 64px; }
.mf-nav-crest {
  grid-column: 1; justify-self: start;
  display: block; height: 44px;
  transition: height .5s var(--mf-nav-ease);
}
.mf-nav[data-scrolled] .mf-nav-crest { height: 38px; }
.mf-nav-crest img { display: block; height: 100%; width: auto; }
.mf-nav-side { display: none; }
.mf-nav-compact { grid-column: 3; justify-self: end; display: flex; align-items: center; gap: 0.5rem; }

.mf-nav-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; color: rgba(255,255,255,0.75);
  transition: color .25s ease;
}
.mf-nav-icon:hover { color: var(--color-gold-light); }

.mf-nav-toggle {
  display: inline-flex; align-items: center; gap: 0.85rem;
  min-height: 44px; padding: 0 0.25rem 0 0.75rem;
  background: none; border: 0; cursor: pointer; color: var(--color-white);
  font-family: var(--font-sans); font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
}
.mf-nav-toggle-lines { position: relative; width: 22px; height: 8px; }
.mf-nav-toggle-lines span {
  position: absolute; left: 0; right: 0; height: 1px; background: currentColor;
  transition: transform .45s var(--mf-nav-ease), top .45s var(--mf-nav-ease);
}
.mf-nav-toggle-lines span:first-child { top: 0; }
.mf-nav-toggle-lines span:last-child { top: 7px; }
.mf-nav[data-open] .mf-nav-toggle-lines span:first-child { top: 4px; transform: rotate(45deg); }
.mf-nav[data-open] .mf-nav-toggle-lines span:last-child { top: 4px; transform: rotate(-45deg); }

/* "Reservar cita": always in the bar. Right end of the row on desktop; next to
   Menú below that (the Menú word folds into the icon on narrow phones, and the
   WhatsApp icon moves into the menu panel on the narrowest ones). */
.mf-nav-row { position: relative; }
.mf-nav-book {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 40px; padding: 0 1.1rem;
  background: var(--color-gold); color: var(--color-navy); text-decoration: none; white-space: nowrap;
  font-family: var(--font-sans); font-weight: 500; font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase;
  transition: background .25s ease;
}
.mf-nav-book:hover { background: var(--color-gold-light); }
.mf-nav-book--row { display: none; }
.mf-nav-book--compact { min-height: 36px; padding: 0 0.8rem; font-size: 0.58rem; letter-spacing: 0.12em; }
.mf-nav[data-open] .mf-nav-book--compact { visibility: hidden; }
@media (max-width: 419px) {
  .mf-nav-toggle { padding-left: 0.5rem; }
  .mf-nav-toggle-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
}
@media (max-width: 374px) {
  .mf-nav-compact .mf-nav-icon { display: none; }
}

@media (min-width: ${DESKTOP}px) {
  .mf-nav-book--row { display: inline-flex; margin-left: auto; }
  .mf-nav-side-links { display: flex; align-items: center; gap: inherit; }
  .mf-nav-strip { display: flex; }
  .mf-nav-row { height: 78px; }
  .mf-nav-crest { grid-column: 2; justify-self: center; height: 52px; }
  .mf-nav[data-scrolled] .mf-nav-crest { height: 40px; }
  .mf-nav-side { display: flex; align-items: center; gap: clamp(1.5rem, 2.4vw, 2.75rem); }
  .mf-nav-side--left { grid-column: 1; grid-row: 1; justify-self: end; padding-right: clamp(2rem, 3.5vw, 3.5rem); }
  .mf-nav-side--right { grid-column: 3; grid-row: 1; justify-self: stretch; padding-left: clamp(2rem, 3.5vw, 3.5rem); }
  .mf-nav-compact { display: none; }
}

.mf-nav-link {
  position: relative; padding: 0.6rem 0;
  font-family: var(--font-sans); font-size: 0.7rem; font-weight: 400;
  letter-spacing: 0.2em; text-transform: uppercase; white-space: nowrap;
  color: rgba(255,255,255,0.82); text-decoration: none;
  transition: color .3s ease;
}
.mf-nav-link::after {
  content: ''; position: absolute; left: 0; right: 0.2em; bottom: 0.2rem; height: 1px;
  background: var(--color-gold);
  transform: scaleX(0); transform-origin: center;
  transition: transform .5s var(--mf-nav-ease);
}
.mf-nav-link:hover { color: var(--color-white); }
.mf-nav-link:hover::after, .mf-nav-link[aria-current="page"]::after { transform: scaleX(1); }
.mf-nav-link[aria-current="page"] { color: var(--color-gold-light); }

/* Panel */
.mf-nav-panel {
  position: fixed; inset: 0; z-index: 1000;
  background: var(--color-navy);
  overflow-y: auto; overscroll-behavior: contain;
  visibility: hidden; opacity: 0;
  transition: opacity .45s ease, visibility 0s linear .45s;
}
.mf-nav[data-open] .mf-nav-panel { visibility: visible; opacity: 1; transition: opacity .45s ease, visibility 0s; }
.mf-nav-panel-inner {
  min-height: 100%;
  display: flex; flex-direction: column; justify-content: space-between; gap: 2.5rem;
  padding: calc(76px + clamp(1.5rem, 6vh, 3.5rem)) var(--container-padding) max(2rem, env(safe-area-inset-bottom));
}
.mf-nav-list { list-style: none; border-top: 1px solid rgba(255,255,255,0.08); }
.mf-nav-list li { border-bottom: 1px solid rgba(255,255,255,0.08); }
.mf-nav-item {
  display: block; padding: clamp(0.7rem, 2vh, 1rem) 0;
  font-family: var(--font-serif); font-weight: 300;
  font-size: clamp(2rem, 8.4vw, 3rem); line-height: 1.1;
  color: var(--color-white); text-decoration: none;
  transition: color .3s ease, padding-left .45s var(--mf-nav-ease);
}
.mf-nav-item:hover { color: var(--color-gold-light); padding-left: 0.4rem; }
.mf-nav-item[aria-current="page"] { color: var(--color-gold); font-style: italic; }
.mf-nav-mask { display: block; overflow: hidden; padding-bottom: 0.08em; }
.mf-nav-rise {
  display: block; transform: translateY(105%);
  transition: transform .7s var(--mf-nav-ease);
  transition-delay: calc(var(--i) * 45ms);
}
.mf-nav[data-open] .mf-nav-rise { transform: none; transition-delay: calc(120ms + var(--i) * 55ms); }

.mf-nav-foot {
  display: grid; gap: 1.5rem;
  opacity: 0; transform: translateY(10px);
  transition: opacity .5s ease, transform .6s var(--mf-nav-ease);
}
.mf-nav[data-open] .mf-nav-foot { opacity: 1; transform: none; transition-delay: calc(160ms + var(--i) * 55ms); }
.mf-nav-foot-link {
  font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-white); text-decoration: none;
  border-bottom: 1px solid rgba(201,168,76,0.35); padding-bottom: 2px;
}
.mf-nav-foot-note { margin-top: 0.6rem; font-family: var(--font-sans); font-size: 0.78rem; color: rgba(255,255,255,0.55); line-height: 1.6; }
.mf-nav-foot-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.mf-nav-pill {
  display: inline-flex; align-items: center; gap: 0.5rem;
  min-height: 46px; padding: 0 1.4rem;
  border: 1px solid rgba(255,255,255,0.28); color: var(--color-white); text-decoration: none;
  font-family: var(--font-sans); font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase;
  transition: background .25s ease, color .25s ease, border-color .25s ease;
}
.mf-nav-pill:hover { border-color: var(--color-white); }
.mf-nav-pill--gold { border-color: var(--color-gold); color: var(--color-gold); }
.mf-nav-pill--gold:hover { background: var(--color-gold); color: var(--color-navy); }
.mf-nav-pill--solid { background: var(--color-gold); border-color: var(--color-gold); color: var(--color-navy); }
.mf-nav-pill--solid:hover { background: var(--color-gold-light); border-color: var(--color-gold-light); }
.mf-nav-foot-langs { display: flex; flex-wrap: wrap; gap: 0.25rem 1.25rem; }
.mf-nav-foot-lang {
  background: none; border: 0; cursor: pointer; padding: 0.5rem 0;
  font-family: var(--font-sans); font-size: 0.78rem; letter-spacing: 0.04em;
  color: rgba(255,255,255,0.5); transition: color .25s ease;
}
.mf-nav-foot-lang:hover { color: var(--color-white); }
.mf-nav-foot-lang[aria-pressed="true"] { color: var(--color-gold); text-decoration: underline; text-underline-offset: 6px; text-decoration-thickness: 1px; }

.mf-nav a:focus-visible, .mf-nav button:focus-visible { outline: 1px solid var(--color-gold); outline-offset: 4px; }

@media (prefers-reduced-motion: reduce) {
  .mf-nav *, .mf-nav *::before, .mf-nav *::after { transition-duration: 0s !important; transition-delay: 0s !important; }
  .mf-nav-rise { transform: none; }
}
`
