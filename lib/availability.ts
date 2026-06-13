import { query } from './db'

export interface BlockedSlot {
  id: number
  date: string
  time: string
  reason: string | null
  created_at: string
}

export async function getBlockedSlots(date: string): Promise<BlockedSlot[]> {
  try {
    const result = await query(
      'SELECT id, date, time, reason, created_at FROM blocked_slots WHERE date = $1 ORDER BY time',
      [date]
    )
    return result.rows as BlockedSlot[]
  } catch (err) {
    console.error('Failed to get blocked slots:', err)
    return []
  }
}

export async function getBlockedTimes(date: string): Promise<string[]> {
  const slots = await getBlockedSlots(date)
  return slots.map((s) => s.time)
}

export async function blockSlot(
  date: string,
  time: string,
  reason?: string
): Promise<{ success: boolean; error?: string; slot?: BlockedSlot }> {
  try {
    const result = await query(
      'INSERT INTO blocked_slots (date, time, reason) VALUES ($1, $2, $3) RETURNING *',
      [date, time, reason || null]
    )
    return { success: true, slot: result.rows[0] as BlockedSlot }
  } catch (err: unknown) {
    const pgErr = err as { code?: string }
    if (pgErr.code === '23505') {
      return { success: false, error: 'Slot already blocked' }
    }
    console.error('Failed to block slot:', err)
    return { success: false, error: 'Database error' }
  }
}

export async function unblockSlot(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await query('DELETE FROM blocked_slots WHERE id = $1 RETURNING *', [id])
    if (result.rowCount === 0) {
      return { success: false, error: 'Blocked slot not found' }
    }
    return { success: true }
  } catch (err) {
    console.error('Failed to unblock slot:', err)
    return { success: false, error: 'Database error' }
  }
}

export async function unblockSlotByDateTime(
  date: string,
  time: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await query('DELETE FROM blocked_slots WHERE date = $1 AND time = $2', [date, time])
    return { success: true }
  } catch (err) {
    console.error('Failed to unblock slot:', err)
    return { success: false, error: 'Database error' }
  }
}
