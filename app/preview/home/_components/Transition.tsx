'use client'

import { createContext, useCallback, useContext, useEffect, useRef, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import styles from './transition.module.css'

export type TransitionKind = 'hilvan' | 'medida' | 'probador'

const FLAG = 'smf-preview-transition'

const Ctx = createContext<(href: string) => void>(() => {})

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* Cover the screen. Each direction has its own gesture; reduced motion fades. */
function cover(root: HTMLElement, kind: TransitionKind) {
  const tl = gsap.timeline()
  if (reducedMotion()) return tl.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 })
  gsap.set(root, { autoAlpha: 1 })
  if (kind === 'hilvan') {
    tl.fromTo(`.${styles.panel}`, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' }, 0)
      .fromTo(`.${styles.stitch}`, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, 0.25)
  } else if (kind === 'medida') {
    tl.fromTo(`.${styles.panel}`, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.65, ease: 'expo.inOut' }, 0)
      .fromTo(`.${styles.stitch}`, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.35)
  } else {
    tl.fromTo(`.${styles.curtainL}`, { xPercent: -101 }, { xPercent: 0, duration: 0.8, ease: 'power4.inOut' }, 0)
      .fromTo(`.${styles.curtainR}`, { xPercent: 101 }, { xPercent: 0, duration: 0.8, ease: 'power4.inOut' }, 0)
  }
  return tl
}

/* Uncover. Plays on arrival when the previous screen left through cover(). */
function reveal(root: HTMLElement, kind: TransitionKind) {
  const tl = gsap.timeline({ onComplete: () => { gsap.set(root, { autoAlpha: 0 }) } })
  if (reducedMotion()) return tl.to(root, { autoAlpha: 0, duration: 0.2 })
  gsap.set(root, { autoAlpha: 1 })
  if (kind === 'hilvan') {
    gsap.set(`.${styles.panel}`, { yPercent: 0 })
    gsap.set(`.${styles.stitch}`, { scaleX: 1 })
    tl.to(`.${styles.stitch}`, { scaleX: 0, transformOrigin: 'right center', duration: 0.4, ease: 'power2.in' }, 0)
      .to(`.${styles.panel}`, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, 0.15)
  } else if (kind === 'medida') {
    gsap.set(`.${styles.panel}`, { scaleX: 1 })
    gsap.set(`.${styles.stitch}`, { scaleX: 1 })
    tl.to(`.${styles.stitch}`, { autoAlpha: 0, duration: 0.2 }, 0)
      .to(`.${styles.panel}`, { scaleX: 0, transformOrigin: 'right center', duration: 0.75, ease: 'expo.inOut' }, 0.1)
      .set(`.${styles.stitch}`, { autoAlpha: 1 })
  } else {
    gsap.set(`.${styles.curtainL}`, { xPercent: 0 })
    gsap.set(`.${styles.curtainR}`, { xPercent: 0 })
    tl.to(`.${styles.curtainL}`, { xPercent: -101, duration: 1, ease: 'power4.inOut' }, 0.1)
      .to(`.${styles.curtainR}`, { xPercent: 101, duration: 1, ease: 'power4.inOut' }, 0.1)
  }
  return tl
}

export function TransitionProvider({ kind, children }: { kind: TransitionKind; children: React.ReactNode }) {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  // Arrival: if we left the previous screen with a transition, open it now.
  useEffect(() => {
    const root = ref.current
    if (!root) return
    let arriving = false
    try { arriving = sessionStorage.getItem(FLAG) === '1'; sessionStorage.removeItem(FLAG) } catch {}
    busy.current = false
    if (arriving) reveal(root, kind)
  }, [kind])

  const go = useCallback((href: string) => {
    const root = ref.current
    if (!root || busy.current) return
    busy.current = true
    try { sessionStorage.setItem(FLAG, '1') } catch {}
    cover(root, kind).then(() => router.push(href))
  }, [kind, router])

  return (
    <Ctx.Provider value={go}>
      {children}
      <div ref={ref} className={`${styles.root} ${styles[kind]}`} aria-hidden="true">
        {kind === 'probador' ? (
          <>
            <div className={styles.curtainL} />
            <div className={styles.curtainR} />
          </>
        ) : (
          <div className={styles.panel}>
            <div className={styles.stitch} />
          </div>
        )}
      </div>
    </Ctx.Provider>
  )
}

/** A link that leaves through the direction's page transition. */
export function TLink({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const go = useContext(Ctx)
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (!href.startsWith('/') || rest.target) return
    e.preventDefault()
    go(href)
  }
  return <a href={href} onClick={handle} {...rest} />
}

export function useTransitionTo() {
  return useContext(Ctx)
}
