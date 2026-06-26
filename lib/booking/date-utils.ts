// Booking date utilities using Europe/Madrid timezone.
// Dates and times are business hours in Madrid, so all comparisons use that zone.

const BUSINESS_TIMEZONE = 'Europe/Madrid'
const MAX_DAYS_AHEAD = 30

/**
 * Convert a JS Date to a YYYY-MM-DD string in Europe/Madrid.
 * Prevents UTC-shift issues when the user is in a different timezone.
 */
export function toMadridDateString(date: Date): string {
  if (!date || Number.isNaN(date.getTime())) {
    return ''
  }
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: BUSINESS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const getPart = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'
  return `${getPart('year')}-${getPart('month')}-${getPart('day')}`
}

/**
 * Build a Date object for a given Madrid date + time string.
 * The returned Date is in the local system time but represents the same
 * wall-clock instant in Madrid (use only for comparison with now).
 */
function toMadridDateTime(dateStr: string, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number)
  // Parse the Madrid date as if it were local to avoid off-by-one shifts
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

/**
 * Check whether a slot (date + time) is in the past relative to Madrid now.
 */
export function isSlotInPast(dateStr: string, timeStr: string): boolean {
  const slot = toMadridDateTime(dateStr, timeStr)
  const now = new Date()
  return slot.getTime() < now.getTime()
}

/**
 * Check whether the date is before today in Madrid.
 */
export function isDateBeforeToday(dateStr: string): boolean {
  const nowMadrid = toMadridDateString(new Date())
  return dateStr < nowMadrid
}

/**
 * Check whether the date is beyond the allowed booking window.
 */
export function isDateBeyondWindow(dateStr: string, daysAhead = MAX_DAYS_AHEAD): boolean {
  const today = new Date()
  const max = new Date(today)
  max.setDate(today.getDate() + daysAhead)
  const maxStr = toMadridDateString(max)
  return dateStr > maxStr
}

/**
 * Validate a booking date/time string pair.
 */
/** Normalize HH:MM or HH:MM:SS to HH:MM for consistent slot comparison. */
export function normalizeTimeSlot(time: string): string {
  if (!time) return time
  const [hours = '00', minutes = '00'] = time.split(':')
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
}

/** Normalize DB/API date values to YYYY-MM-DD. */
export function normalizeDateString(date: string | Date): string {
  if (date instanceof Date) {
    return toMadridDateString(date)
  }
  if (typeof date === 'string') {
    return date.split('T')[0]
  }
  return date
}

export function validateBookingSlot(
  dateStr: string,
  timeStr: string
): { valid: boolean; error?: string } {
  if (!dateStr || !timeStr) {
    return { valid: false, error: 'Date and time are required' }
  }

  if (isDateBeforeToday(dateStr)) {
    return { valid: false, error: 'Selected date is in the past' }
  }

  if (isDateBeyondWindow(dateStr)) {
    return { valid: false, error: 'Selected date is too far in the future' }
  }

  if (isSlotInPast(dateStr, timeStr)) {
    return { valid: false, error: 'Selected time slot has already passed' }
  }

  return { valid: true }
}
