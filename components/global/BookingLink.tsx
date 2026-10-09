'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { useSettings } from '@/lib/settings-provider'
import { BOOKING_ANCHOR, BOOKING_EVENT, BOOKING_HREF, BOOKING_PATH } from '@/lib/booking'

/*
 * The site-wide "Reservar cita" link. Goes straight to the booking options on
 * Contacto; on Contacto itself it brings them back into view (closing an open
 * calendar step). Hidden when Contacto is switched off in the admin, because
 * there is nowhere to book then.
 */
export function BookingLink({
  className,
  style,
  children,
  onClick,
}: {
  className?: string
  style?: CSSProperties
  children: ReactNode
  onClick?: () => void
}) {
  const pathname = usePathname()
  const { isEnabled } = useSettings()
  if (!isEnabled('contacto')) return null

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.()
    if (pathname === BOOKING_PATH) {
      e.preventDefault()
      history.replaceState(null, '', `#${BOOKING_ANCHOR}`)
      window.dispatchEvent(new Event(BOOKING_EVENT))
    }
  }

  return (
    <Link href={BOOKING_HREF} className={className} style={style} onClick={handle}>
      {children}
    </Link>
  )
}
