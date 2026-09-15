#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Step 8 of the ImageKit -> /public/img migration. ONE-OFF. Not part of the build.
 *
 * Reads image-map.csv and rewrites remote image URLs stored in the live database
 * (courses.image, garments.thumbnail_url, editable_content.value) to the local
 * /img paths. Also maps dead Cloudinary URLs whose public id matches a migrated
 * asset (e.g. .../photos/wedding-morning-coat_xxxx -> /img/novio-chaque-roma.webp).
 *
 *   DATABASE_URL=... node scripts/migrate-images-to-local.js            # dry run, prints the diff
 *   DATABASE_URL=... node scripts/migrate-images-to-local.js --apply    # asks for confirmation, then writes
 *
 * Before writing, the affected rows are dumped to .image-migration/db-backup.json.
 * All writes run inside one transaction.
 */
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { Pool } = require('pg')

const ROOT = path.resolve(__dirname, '..')
const APPLY = process.argv.includes('--apply')

function parseCsv(text) {
  const rows = []
  let row = [], field = '', q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') q = false
      else field += c
    } else if (c === '"') q = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  const [header, ...data] = rows
  return data.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])))
}

const map = parseCsv(fs.readFileSync(path.join(ROOT, 'image-map.csv'), 'utf8'))
const byUrl = new Map(map.map((m) => [m.original_url, m.new_path]))
const stem = (u) => decodeURIComponent(u.split('/').pop()).replace(/\.[a-z0-9]+$/i, '').toLowerCase()
const byStem = new Map(map.map((m) => [stem(m.original_url), m.new_path]))

function translate(value) {
  if (!value || typeof value !== 'string') return null
  let out = value
  for (const [url, local] of byUrl) out = out.split(url).join(local)
  // Cloudinary: https://res.cloudinary.com/<cloud>/image/upload/<transforms>/photos/<name>_<hash>
  out = out.replace(/https:\/\/res\.cloudinary\.com\/[^\s"'`)]+/g, (u) => {
    const s = stem(u).replace(/_[a-z0-9]{5,8}$/i, '')
    return byStem.get(s) || u
  })
  return out === value ? null : out
}

const TARGETS = [
  { table: 'courses', id: 'id', col: 'image' },
  { table: 'garments', id: 'id', col: 'thumbnail_url' },
  { table: 'editable_content', id: 'id', col: 'value' },
]

async function main() {
  const raw = process.env.DATABASE_URL
  if (!raw) { console.error('DATABASE_URL not set'); process.exit(1) }
  const connectionString = raw.replace(/\?sslmode=[^&]*/, '').replace(/&sslmode=[^&]*/, '')
  const local = /localhost|127\.0\.0\.1|::1/.test(raw)
  const pool = new Pool({ connectionString, ssl: local ? false : { rejectUnauthorized: false } })
  const client = await pool.connect()
  try {
    const changes = []
    for (const t of TARGETS) {
      const { rows } = await client.query(
        `SELECT ${t.id}::text AS id, ${t.col} AS value FROM ${t.table}
         WHERE ${t.col} LIKE '%ik.imagekit.io%' OR ${t.col} LIKE '%res.cloudinary.com%'`
      )
      for (const r of rows) {
        const next = translate(r.value)
        changes.push({ ...t, rowId: r.id, before: r.value, after: next })
      }
    }
    const applicable = changes.filter((c) => c.after !== null)
    const untranslatable = changes.filter((c) => c.after === null)

    console.log(`Rows with remote image URLs: ${changes.length}`)
    for (const c of changes) {
      console.log(`\n${c.table}#${c.rowId}.${c.col}`)
      console.log(`  - ${c.before}`)
      console.log(`  + ${c.after ?? '(no mapping – left unchanged)'}`)
    }
    const perTable = {}
    for (const c of applicable) perTable[c.table] = (perTable[c.table] || 0) + 1
    console.log(`\nWould change: ${JSON.stringify(perTable)}   unchanged (no mapping): ${untranslatable.length}`)

    if (!APPLY) { console.log('\nDry run only. Re-run with --apply to write.'); return }
    if (!applicable.length) { console.log('Nothing to apply.'); return }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const answer = await new Promise((res) => rl.question('\nApply these changes? (yes/no) ', res))
    rl.close()
    if (answer.trim().toLowerCase() !== 'yes') { console.log('Aborted.'); return }

    fs.mkdirSync(path.join(ROOT, '.image-migration'), { recursive: true })
    const backupPath = path.join(ROOT, '.image-migration', 'db-backup.json')
    fs.writeFileSync(backupPath, JSON.stringify({ takenAt: new Date().toISOString(), rows: changes }, null, 2))
    console.log(`Backup written to ${path.relative(ROOT, backupPath)}`)

    await client.query('BEGIN')
    try {
      const done = {}
      for (const c of applicable) {
        const r = await client.query(
          `UPDATE ${c.table} SET ${c.col} = $1, updated_at = CURRENT_TIMESTAMP WHERE ${c.id}::text = $2`,
          [c.after, c.rowId]
        )
        done[c.table] = (done[c.table] || 0) + (r.rowCount ?? 0)
      }
      await client.query('COMMIT')
      console.log(`Committed. Rows changed per table: ${JSON.stringify(done)}`)
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    }
  } finally {
    client.release()
    await pool.end()
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
