/**
 * dataLayer push helper.
 *
 * GTM is already installed site-wide (components/global/GoogleTagManager.tsx,
 * container GTM-526N8S4Q) but nothing pushed to it, so there were no events to
 * build GA4 conversions from. This is the whole of the code half of that: no
 * second analytics library, no network calls of its own, no consent handling
 * beyond what GTM already does.
 *
 * Creating the GA4 property and marking these as key events is done in the GA4
 * and GTM interfaces, not here.
 *
 * Event names are fixed by the brief and are what the GTM triggers will match:
 *   whatsapp_click · phone_click · contact_form_submit · booking_complete
 *
 * Forms and bookings fire on success only. A failed submit is not a conversion.
 */

export type TrackLocation = 'nav' | 'footer' | 'hero' | 'contacto' | 'booking'

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...params })
}
