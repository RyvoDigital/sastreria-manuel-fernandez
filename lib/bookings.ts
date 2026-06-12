import { query } from './db'

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
    return result.rows as BookingRecord[]
  } catch {
    return []
  }
}

export async function isSlotBooked(date: string, time: string): Promise<boolean> {
  try {
    const result = await query(
      'SELECT 1 FROM bookings WHERE date = $1 AND time = $2 LIMIT 1',
      [date, time]
    )
    return result.rowCount !== null && result.rowCount > 0
  } catch {
    return false
  }
}

export async function bookSlot(record: BookingRecord): Promise<{ success: boolean; error?: string; bookingId?: number }> {
  try {
    const result = await query(
      'INSERT INTO bookings (date, time, type, name, email, phone, locale) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [record.date, record.time, record.type, record.name, record.email, record.phone || null, record.locale || 'es']
    )
    return { success: true, bookingId: result.rows[0]?.id }
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
