import { randomBytes } from 'node:crypto'
import { query } from './db'
import { normalizeDateString, normalizeTimeSlot } from './booking/date-utils'

/*
 * Public cancellation needs proof that you made the booking: a random,
 * unguessable token (256 bits) stored with each booking and sent only to the
 * person who booked it (the booking response and their confirmation email).
 * A booking number alone cancels nothing. The admin cancels through its own
 * login (app/api/admin/bookings).
 *
 * The column is added here, once per server instance, because the schema
 * script is not run on deploys. Bookings made before it existed get a token in
 * the same step; none of their emails ever carried a cancel link.
 */
let cancelTokenSchema: Promise<void> | null = null

export function ensureCancelTokens(): Promise<void> {
  if (!cancelTokenSchema) {
    cancelTokenSchema = (async () => {
      await query('ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancel_token TEXT')
      await query(
        "UPDATE bookings SET cancel_token = replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '') WHERE cancel_token IS NULL"
      )
      await query('CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_cancel_token ON bookings (cancel_token)')
    })().catch((err) => {
      cancelTokenSchema = null
      throw err
    })
  }
  return cancelTokenSchema
}

function newCancelToken(): string {
  return randomBytes(32).toString('base64url')
}

/** A token as issued: 43 base64url characters, or 64 hex for the backfilled ones. */
export function isCancelTokenShape(token: unknown): token is string {
  return typeof token === 'string' && /^[A-Za-z0-9_-]{43,64}$/.test(token)
}

export interface BookingRecord {
  date: string
  time: string
  type: 'inperson' | 'videocall'
  name: string
  email: string
  phone?: string
  locale?: string
  createdAt: string
}

export async function getBookedSlots(date: string): Promise<BookingRecord[]> {
  try {
    const result = await query(
      'SELECT date, time, type, name, email, created_at as "createdAt" FROM bookings WHERE date = $1',
      [date]
    )
    return (result.rows as BookingRecord[]).map((row) => ({
      ...row,
      date: normalizeDateString(row.date),
      time: normalizeTimeSlot(row.time),
    }))
  } catch {
    return []
  }
}

export async function isSlotBooked(date: string, time: string): Promise<boolean> {
  try {
    const normalizedDate = normalizeDateString(date)
    const normalizedTime = normalizeTimeSlot(time)
    const result = await query(
      'SELECT 1 FROM bookings WHERE date = $1 AND time = $2 LIMIT 1',
      [normalizedDate, normalizedTime]
    )
    return result.rowCount !== null && result.rowCount > 0
  } catch {
    return false
  }
}

export async function bookSlot(
  record: BookingRecord
): Promise<{ success: boolean; error?: string; bookingId?: number; cancelToken?: string }> {
  try {
    await ensureCancelTokens()
    const normalizedDate = normalizeDateString(record.date)
    const normalizedTime = normalizeTimeSlot(record.time)
    const cancelToken = newCancelToken()
    const result = await query(
      'INSERT INTO bookings (date, time, type, name, email, phone, locale, cancel_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [normalizedDate, normalizedTime, record.type, record.name, record.email, record.phone || null, record.locale || 'es', cancelToken]
    )
    return { success: true, bookingId: result.rows[0]?.id, cancelToken }
  } catch (err: unknown) {
    const pgErr = err as { code?: string; detail?: string }
    if (pgErr.code === '23505') {
      return { success: false, error: 'Slot already booked' }
    }
    console.error('Database error booking slot:', err)
    return { success: false, error: 'Database error' }
  }
}

export async function getAllBookedDates(): Promise<string[]> {
  try {
    const result = await query(
      'SELECT DISTINCT date FROM bookings ORDER BY date'
    )
    return result.rows.map((r) => r.date as string)
  } catch {
    return []
  }
}

export interface CancellableBooking {
  id: number
  date: string
  time: string
  type: 'inperson' | 'videocall'
  locale: string
}

/** The booking a cancel token belongs to, if it is still upcoming. */
export async function findBookingByCancelToken(token: string): Promise<CancellableBooking | null> {
  if (!isCancelTokenShape(token)) return null
  await ensureCancelTokens()
  const result = await query(
    "SELECT id, date, time, type, locale FROM bookings WHERE cancel_token = $1 AND date >= (now() AT TIME ZONE 'Europe/Madrid')::date LIMIT 1",
    [token]
  )
  const row = result.rows[0]
  if (!row) return null
  return { id: row.id, date: normalizeDateString(row.date), time: normalizeTimeSlot(row.time), type: row.type, locale: row.locale || 'es' }
}

/**
 * Cancels (deletes, which frees the slot, as before) the upcoming in-person
 * booking this token belongs to. Paid video calls are not cancelled here:
 * they need a refund, so the client contacts the shop.
 */
export async function cancelBookingByToken(
  token: string
): Promise<{ success: true; booking: CancellableBooking } | { success: false; error: 'not_found' | 'paid_booking' }> {
  const booking = await findBookingByCancelToken(token)
  if (!booking) return { success: false, error: 'not_found' }
  if (booking.type !== 'inperson') return { success: false, error: 'paid_booking' }
  const result = await query('DELETE FROM bookings WHERE id = $1 AND cancel_token = $2', [booking.id, token])
  if (!result.rowCount) return { success: false, error: 'not_found' }
  return { success: true, booking }
}
