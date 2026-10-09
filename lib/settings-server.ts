import { query } from '@/lib/db'

/**
 * Server-side read of one show/hide setting from the admin Ajustes table, so a
 * gated page can be rendered in full on the server. Same rule as the client
 * (useSettings().isEnabled): a missing row means enabled. If the database
 * cannot be read the page is rendered (enabled) and the client check, which
 * still runs, has the last word.
 */
export async function isSettingEnabled(id: string): Promise<boolean> {
  try {
    const result = await query('SELECT enabled FROM settings WHERE id = $1', [id])
    const row = result.rows[0] as { enabled?: boolean } | undefined
    return row ? row.enabled !== false : true
  } catch (err) {
    console.error(`Setting lookup failed for "${id}":`, err)
    return true
  }
}
