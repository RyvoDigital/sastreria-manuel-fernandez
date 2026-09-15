#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Step 2 of the ImageKit -> /public/img migration.
 * Downloads every asset in image-inventory.json into .image-migration/original/
 * (kept out of git). Verifies HTTP 200 and non-zero size; exits non-zero if any fail.
 *
 * Usage: node scripts/image-download.js
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, '.image-migration', 'original')
const { assets } = JSON.parse(fs.readFileSync(path.join(ROOT, 'image-inventory.json'), 'utf8'))

async function fetchOne(asset) {
  const dest = path.join(OUT_DIR, asset.filename)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return { ok: true, bytes: fs.statSync(dest).size, cached: true }
  const res = await fetch(asset.url)
  if (res.status !== 200) return { ok: false, error: `HTTP ${res.status}` }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length === 0) return { ok: false, error: 'empty body' }
  fs.writeFileSync(dest, buf)
  return { ok: true, bytes: buf.length }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const failures = []
  let total = 0
  let i = 0
  const queue = [...assets]
  async function worker() {
    while (queue.length) {
      const a = queue.shift()
      let r
      try { r = await fetchOne(a) } catch (e) { r = { ok: false, error: e.message } }
      i++
      if (r.ok) {
        total += r.bytes
        console.log(`[${i}/${assets.length}] ok  ${(r.bytes / 1024).toFixed(0).padStart(6)} KB  ${a.filename}${r.cached ? ' (cached)' : ''}`)
      } else {
        failures.push({ url: a.url, error: r.error })
        console.log(`[${i}/${assets.length}] FAIL ${a.url} -> ${r.error}`)
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker))
  console.log(`\nDownloaded ${assets.length - failures.length}/${assets.length}, ${(total / 1024 / 1024).toFixed(1)} MB total`)
  if (failures.length) {
    console.error(`\n${failures.length} FAILED:`)
    failures.forEach((f) => console.error(`  ${f.url}  (${f.error})`))
    process.exit(1)
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
