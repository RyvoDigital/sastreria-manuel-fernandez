import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

async function verify() {
  const rawDatabaseUrl = process.env.DATABASE_URL
  if (!rawDatabaseUrl) {
    console.log('DATABASE_URL not set')
    process.exit(1)
  }

  const databaseUrl = rawDatabaseUrl.replace(/\?sslmode=[^&]*/, '').replace(/&sslmode=[^&]*/, '')

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: rawDatabaseUrl.includes('localhost') || rawDatabaseUrl.includes('127.0.0.1') || rawDatabaseUrl.includes('::1')
      ? false
      : { rejectUnauthorized: false },
  })

  try {
    const result = await pool.query(`SELECT * FROM admins WHERE email = 'admin@sastreria.com'`)
    if (result.rows.length === 0) {
      console.log('Admin NOT found')
      
      const password = process.env.ADMIN_PASSWORD
      if (!password) {
        console.log('ADMIN_PASSWORD not set')
        process.exit(1)
      }
      
      const hash = await bcrypt.hash(password, 12)
      await pool.query(
        `INSERT INTO admins (name, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
        ['Admin', 'admin@sastreria.com', hash, 'owner']
      )
      console.log('Admin CREATED successfully')
    } else {
      const admin = result.rows[0]
      console.log('Admin found:', admin.email, 'role:', admin.role)
      
      const password = process.env.ADMIN_PASSWORD
      if (password) {
        const valid = await bcrypt.compare(password, admin.password_hash)
        console.log('Password matches:', valid)
        
        if (!valid) {
          console.log('Password mismatch — updating password...')
          const hash = await bcrypt.hash(password, 12)
          await pool.query(
            `UPDATE admins SET password_hash = $1 WHERE email = $2`,
            [hash, 'admin@sastreria.com']
          )
          console.log('Password UPDATED successfully')
        }
      }
    }
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

verify()
