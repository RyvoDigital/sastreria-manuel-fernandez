import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.warn('DATABASE_URL is not set. Bookings will not persist.')
}

function getSslConfig(url: string | undefined) {
  if (!url) return false
  // Disable SSL for local/Docker connections
  if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('::1')) {
    return false
  }
  return { rejectUnauthorized: false }
}

export const pool = new Pool({
  connectionString: connectionString || '',
  ssl: getSslConfig(connectionString),
})

export async function query(text: string, params?: unknown[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}
