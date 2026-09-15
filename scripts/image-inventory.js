#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Step 1 of the ImageKit -> /public/img migration.
 *
 * Produces image-inventory.json listing every distinct ImageKit asset URL found in:
 *   - app/, components/, lib/ (.ts / .tsx)
 *   - scripts/setup-db.ts
 *   - the live database (courses.image, garments.thumbnail_url, editable_content.value)
 *     when DATABASE_URL is set. Without it the DB part is skipped with a loud warning.
 *
 * Usage:  DATABASE_URL=... node scripts/image-inventory.js
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'image-inventory.json')
const URL_RE = /https:\/\/ik\.imagekit\.io\/[^\s"'`)]+/g

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      walk(p, acc)
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      acc.push(p)
    }
  }
  return acc
}

function scanCode() {
  const files = [
    ...walk(path.join(ROOT, 'app')),
    ...walk(path.join(ROOT, 'components')),
    ...walk(path.join(ROOT, 'lib')),
    path.join(ROOT, 'scripts', 'setup-db.ts'),
  ]
  const hits = [] // { url, file, line }
  for (const file of files) {
    const rel = path.relative(ROOT, file)
    if (rel === path.join('lib', 'imagekit.ts')) continue // dead helper, placeholder URL only
    const lines = fs.readFileSync(file, 'utf8').split('\n')
    lines.forEach((text, i) => {
      for (const m of text.matchAll(URL_RE)) {
        hits.push({ url: m[0], file: rel, line: i + 1 })
      }
    })
  }
  return hits
}

async function scanDb() {
  const raw = process.env.DATABASE_URL
  if (!raw) {
    console.warn('\n!! DATABASE_URL not set – database NOT scanned. Do not treat this inventory as complete.\n')
    return []
  }
  const { Pool } = require('pg')
  const connectionString = raw.replace(/\?sslmode=[^&]*/, '').replace(/&sslmode=[^&]*/, '')
  const local = /localhost|127\.0\.0\.1|::1/.test(raw)
  const pool = new Pool({ connectionString, ssl: local ? false : { rejectUnauthorized: false } })
  try {
    const { rows } = await pool.query(`
      SELECT 'courses' AS t, id::text AS id, image AS url FROM courses WHERE image LIKE '%imagekit%'
      UNION ALL
      SELECT 'garments', id::text, thumbnail_url FROM garments WHERE thumbnail_url LIKE '%imagekit%'
      UNION ALL
      SELECT 'editable_content', id::text, value FROM editable_content WHERE value LIKE '%imagekit%'
    `)
    return rows.map((r) => ({ url: r.url.trim(), table: r.t, id: r.id }))
  } finally {
    await pool.end()
  }
}

async function main() {
  const codeHits = scanCode()
  const dbHits = await scanDb()

  const byUrl = new Map()
  const get = (url) => {
    if (!byUrl.has(url)) {
      byUrl.set(url, {
        url,
        filename: decodeURIComponent(url.split('/').pop()),
        code: [],
        db: [],
      })
    }
    return byUrl.get(url)
  }
  for (const h of codeHits) get(h.url).code.push({ file: h.file, line: h.line })
  for (const h of dbHits) get(h.url).db.push({ table: h.table, id: h.id })

  const assets = [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url))
  const dbOnly = assets.filter((a) => a.code.length === 0)
  const summary = {
    generatedAt: new Date().toISOString(),
    dbScanned: Boolean(process.env.DATABASE_URL),
    codeReferences: codeHits.length,
    codeFiles: new Set(codeHits.map((h) => h.file)).size,
    dbRows: dbHits.length,
    distinctAssets: assets.length,
    dbOnlyAssets: dbOnly.map((a) => a.url),
  }
  fs.writeFileSync(OUT, JSON.stringify({ summary, assets }, null, 2) + '\n')

  console.log(`Code references : ${summary.codeReferences} across ${summary.codeFiles} files`)
  console.log(`DB rows         : ${summary.dbRows}${summary.dbScanned ? '' : ' (NOT SCANNED)'}`)
  console.log(`Distinct assets : ${summary.distinctAssets}`)
  if (dbOnly.length) console.log(`DB-only assets  : ${dbOnly.length}\n  ` + dbOnly.map((a) => a.url).join('\n  '))
  console.log(`Wrote ${path.relative(ROOT, OUT)}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
