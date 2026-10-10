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
 *
 * Phone and WhatsApp taps are not sent from React: those links carry
 * data-track="event:location" and TAP_SCRIPT, inlined in the page head by
 * app/layout.tsx, pushes them. It runs as the HTML is parsed, so a tap in the
 * first second, before the page has hydrated, is recorded too, and there is
 * one code path so nothing is counted twice.
 */

export type TrackLocation = 'nav' | 'footer' | 'hero' | 'contacto' | 'booking'

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...params })
}

/** Inline in <head>: one capture-phase listener for every [data-track] link. */
export const TAP_SCRIPT =
  "document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('[data-track]');if(!a)return;var p=a.getAttribute('data-track').split(':');(window.dataLayer=window.dataLayer||[]).push({event:p[0],location:p[1]})},true)"
