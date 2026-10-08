import { query } from '@/lib/db'
import { COURSE_PURCHASES_SETTING_ID } from '@/lib/course-purchases'

/** Server-side check behind /api/stripe. Fails closed. */
export async function areCoursePurchasesOpen(): Promise<boolean> {
  try {
    const result = await query('SELECT enabled FROM settings WHERE id = $1', [COURSE_PURCHASES_SETTING_ID])
    return result.rows[0]?.enabled === true
  } catch (err) {
    console.error('Course purchase flag lookup failed:', err)
    return false
  }
}
