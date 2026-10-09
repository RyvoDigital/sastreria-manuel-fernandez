/**
 * Where "Reservar cita" leads from anywhere on the site: the booking options
 * on Contacto (measurements, style consultation, video call), which open the
 * booking calendar. Contacto listens for BOOKING_EVENT so the action also works
 * when the visitor is already on that page.
 */
export const BOOKING_PATH = '/contacto'
export const BOOKING_ANCHOR = 'reservar'
export const BOOKING_HREF = `${BOOKING_PATH}#${BOOKING_ANCHOR}`
export const BOOKING_EVENT = 'smf:reservar'
