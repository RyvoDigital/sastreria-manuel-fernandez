import { randomBytes } from 'node:crypto'
import type { PoolClient } from 'pg'
import { pool, query } from '../db'
import { normalizeDateString, normalizeTimeSlot } from './date-utils'

/*
 * One appointment per time slot, enforced by the database.
 *
 * - Bookings: a partial unique index on bookings (date, time) for every row
 *   that is not cancelled (scripts/setup-db.ts). A cancelled cita stays in
 *   Citas but frees its time. Two people submitting the same slot at the same
 *   second: the second INSERT fails with 23505 and gets 'conflict'.
 * - Video calls: the slot is held (booking_holds, unique on date + time) from
 *   the moment the client is sent to Stripe until the session expires, so two
 *   people can't pay for the same time. The hold becomes the booking when the
 *   payment completes, and is released when the client comes back without
 *   paying or the session expires.
 * - A booking and a hold live in different tables, so every write that claims
 *   a slot first takes a transaction-scoped advisory lock on that slot. Checks
 *   and inserts for one slot therefore run one at a time.
 */

/** Stripe's minimum Checkout lifetime is 30 minutes; one more for clock skew. */
export const CHECKOUT_MINUTES = 31
/** A hold outlives its Checkout session, so a payment made in the last minute still finds it. */
const HOLD_MINUTES = 40

export type SlotProblem = 'conflict' | 'unavailable'

const ACTIVE = `status IS DISTINCT FROM 'cancelled'`

export async function inTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  } finally {
    client.release()
  }
}

/** Serialises every claim on one slot until the transaction ends. */
export async function lockSlot(client: PoolClient, date: string, time: string) {
  await client.query(`SELECT pg_advisory_xact_lock(hashtext('booking-slot ' || $1::text || ' ' || $2::text))`, [date, time])
}

export function isUniqueViolation(err: unknown) {
  return (err as { code?: string })?.code === '23505'
}

/**
 * Why a slot can't be taken, or null when it is free. Call it after lockSlot()
 * inside the same transaction. Admin appointments (pruebas, entregas, Citas
 * edits) skip the web-only rules (blocked slots).
 */
export async function slotProblem(
  client: PoolClient,
  date: string,
  time: string,
  opts: { ignoreBookingId?: number; ignoreHoldToken?: string; adminRules?: boolean } = {}
): Promise<SlotProblem | null> {
  const booked = await client.query(
    `SELECT 1 FROM bookings WHERE date = $1 AND time = $2 AND ${ACTIVE} AND id <> $3 LIMIT 1`,
    [date, time, opts.ignoreBookingId ?? 0]
  )
  if (booked.rowCount) return 'conflict'
  const held = await client.query(
    `SELECT 1 FROM booking_holds WHERE date = $1 AND time = $2 AND expires_at > now() AND token <> $3 LIMIT 1`,
    [date, time, opts.ignoreHoldToken ?? '']
  )
  if (held.rowCount) return 'conflict'
  if (opts.adminRules) return null
  const blocked = await client.query(`SELECT 1 FROM blocked_slots WHERE date = $1 AND time = $2 LIMIT 1`, [date, time])
  if (blocked.rowCount) return 'unavailable'
  return null
}

/** Times the public calendar must show as taken: active bookings and live checkout holds. */
export async function getTakenTimes(date: string): Promise<string[]> {
  const d = normalizeDateString(date)
  const result = await query(
    `SELECT time FROM bookings WHERE date = $1 AND ${ACTIVE}
     UNION
     SELECT time FROM booking_holds WHERE date = $1 AND expires_at > now()`,
    [d]
  )
  return result.rows.map((r) => normalizeTimeSlot(r.time))
}

// ── Checkout holds (video calls paid through Stripe) ──────────────────────────

export interface Hold {
  token: string
  expiresAt: Date
}

/**
 * Holds a slot for the Checkout window. If the same email already holds it
 * (the client went back from Stripe and tried again), returns that hold's
 * session so the caller can expire it and retry.
 */
export async function createHold(
  date: string,
  time: string,
  email: string
): Promise<{ ok: true; hold: Hold } | { ok: false; error: SlotProblem; ownSessionId?: string; ownToken?: string }> {
  const d = normalizeDateString(date)
  const t = normalizeTimeSlot(time)
  const mail = email.trim().toLowerCase()
  try {
    return await inTransaction(async (client) => {
      await lockSlot(client, d, t)
      // An expired hold is just a leftover: clear it so the unique (date, time) accepts the new one
      await client.query(`DELETE FROM booking_holds WHERE date = $1 AND time = $2 AND expires_at <= now()`, [d, t])
      const problem = await slotProblem(client, d, t)
      if (problem) {
        if (problem === 'conflict') {
          const own = (await client.query(
            `SELECT token, stripe_session_id FROM booking_holds WHERE date = $1 AND time = $2 AND lower(email) = $3 AND expires_at > now()`,
            [d, t, mail]
          )).rows[0]
          if (own) return { ok: false as const, error: problem, ownSessionId: own.stripe_session_id ?? undefined, ownToken: own.token }
        }
        return { ok: false as const, error: problem }
      }
      const token = randomBytes(24).toString('base64url')
      const row = (await client.query(
        `INSERT INTO booking_holds (date, time, token, email, expires_at)
         VALUES ($1, $2, $3, $4, now() + make_interval(mins => $5)) RETURNING expires_at`,
        [d, t, token, mail, HOLD_MINUTES]
      )).rows[0]
      return { ok: true as const, hold: { token, expiresAt: row.expires_at } }
    })
  } catch (err) {
    if (isUniqueViolation(err)) return { ok: false, error: 'conflict' }
    throw err
  }
}

export async function attachHoldSession(token: string, sessionId: string) {
  await query(`UPDATE booking_holds SET stripe_session_id = $1 WHERE token = $2`, [sessionId, token])
}

export function isHoldTokenShape(token: unknown): token is string {
  return typeof token === 'string' && /^[A-Za-z0-9_-]{32}$/.test(token)
}

/** The Checkout session a hold belongs to: undefined if there is no such hold, null if it has no session yet. */
export async function findHoldSession(token: string): Promise<string | null | undefined> {
  const row = (await query(`SELECT stripe_session_id FROM booking_holds WHERE token = $1`, [token])).rows[0]
  return row ? (row.stripe_session_id ?? null) : undefined
}

/** Frees a held slot. Returns the Stripe session it belonged to, if any. */
export async function releaseHold(token: string): Promise<{ sessionId: string | null } | null> {
  const result = await query(`DELETE FROM booking_holds WHERE token = $1 RETURNING stripe_session_id`, [token])
  const row = result.rows[0]
  return row ? { sessionId: row.stripe_session_id ?? null } : null
}

export async function releaseHoldBySession(sessionId: string) {
  await query(`DELETE FROM booking_holds WHERE stripe_session_id = $1`, [sessionId])
}

// ── Inserting bookings ────────────────────────────────────────────────────────

export interface NewBooking {
  date: string
  time: string
  type: 'inperson' | 'videocall'
  name: string
  email: string
  phone?: string | null
  locale?: string | null
  cancelToken: string
  stripeSessionId?: string | null
}

async function insertBooking(client: PoolClient, b: NewBooking): Promise<number> {
  const result = await client.query(
    `INSERT INTO bookings (date, time, type, name, email, phone, locale, cancel_token, stripe_session_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [b.date, b.time, b.type, b.name, b.email, b.phone || null, b.locale || 'es', b.cancelToken, b.stripeSessionId ?? null]
  )
  return result.rows[0].id
}

/** A free web booking (in person). The database rejects a second one for the same slot. */
export async function insertWebBooking(b: NewBooking): Promise<{ ok: true; bookingId: number } | { ok: false; error: SlotProblem }> {
  const d = normalizeDateString(b.date)
  const t = normalizeTimeSlot(b.time)
  try {
    return await inTransaction(async (client) => {
      await lockSlot(client, d, t)
      const problem = await slotProblem(client, d, t)
      if (problem) return { ok: false as const, error: problem }
      return { ok: true as const, bookingId: await insertBooking(client, { ...b, date: d, time: t }) }
    })
  } catch (err) {
    if (isUniqueViolation(err)) return { ok: false, error: 'conflict' }
    throw err
  }
}

/**
 * Turns a paid video call into its booking. Called by both the Stripe webhook
 * and the success page, in any order and any number of times: the session id
 * on the booking makes it idempotent, and only the call that creates the
 * booking gets created = true (and sends the emails).
 */
export async function confirmPaidBooking(
  b: NewBooking & { stripeSessionId: string; holdToken?: string | null }
): Promise<{ ok: true; created: boolean; bookingId: number } | { ok: false; error: SlotProblem }> {
  const d = normalizeDateString(b.date)
  const t = normalizeTimeSlot(b.time)
  try {
    return await inTransaction(async (client) => {
      await lockSlot(client, d, t)
      const existing = (await client.query(`SELECT id FROM bookings WHERE stripe_session_id = $1`, [b.stripeSessionId])).rows[0]
      if (existing) return { ok: true as const, created: false, bookingId: existing.id as number }
      // Our own hold (even if it just expired) doesn't count against us; a block added
      // after the client paid doesn't undo a paid booking either: the shop sees it in Citas.
      const hold = (await client.query(
        `SELECT token FROM booking_holds WHERE stripe_session_id = $1 OR (token = $2 AND $2 <> '')`,
        [b.stripeSessionId, b.holdToken ?? '']
      )).rows[0]
      const problem = await slotProblem(client, d, t, { ignoreHoldToken: hold?.token, adminRules: true })
      if (problem) {
        // Paid before this change shipped: that booking carries no session id, only the same email
        const legacy = (await client.query(
          `SELECT id FROM bookings WHERE date = $1 AND time = $2 AND status IS DISTINCT FROM 'cancelled'
             AND type = 'videocall' AND stripe_session_id IS NULL AND lower(email) = lower($3)`,
          [d, t, b.email]
        )).rows[0]
        if (legacy) return { ok: true as const, created: false, bookingId: legacy.id as number }
        return { ok: false as const, error: problem }
      }
      const bookingId = await insertBooking(client, { ...b, date: d, time: t })
      if (hold) await client.query(`DELETE FROM booking_holds WHERE token = $1`, [hold.token])
      return { ok: true as const, created: true, bookingId }
    })
  } catch (err) {
    if (isUniqueViolation(err)) {
      // The other confirmation (webhook or success page) got there first
      const existing = (await query(`SELECT id FROM bookings WHERE stripe_session_id = $1`, [b.stripeSessionId])).rows[0]
      if (existing) return { ok: true, created: false, bookingId: existing.id }
      return { ok: false, error: 'conflict' }
    }
    throw err
  }
}
