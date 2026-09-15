#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Step 3-5 of the ImageKit -> /public/img migration.
 *
 * Reads scripts/image-name-map.json (original filename -> new name + local source),
 * converts each source with sharp and writes it to public/img/, then writes
 * image-map.csv at the repo root (the audit trail used by image-rewrite.js and
 * migrate-images-to-local.js).
 *
 * Rules: WebP q82, longest edge <= 2000px, never upscale, EXIF stripped
 * (orientation is applied first). If a WebP is still > 400KB, retry at q75 and
 * report it. PNG is kept only when the source actually uses its alpha channel.
 *
 * Usage: node scripts/image-optimize.js
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'img')
const MAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-name-map.json'), 'utf8'))
const MAX_EDGE = 2000
const TARGET = 300 * 1024
const HARD = 400 * 1024

const expand = (p) => path.resolve(ROOT, p.replace(/^~/, os.homedir()))

async function usesAlpha(file) {
  const meta = await sharp(file).metadata()
  if (!meta.hasAlpha) return false
  const { data } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 3; i < data.length; i += 4) if (data[i] < 255) return true
  return false
}

async function encode(file, alpha, quality) {
  const base = sharp(file).rotate().resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
  if (alpha) return { buf: await base.png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toBuffer(), ext: 'png' }
  return { buf: await base.webp({ quality, effort: 6 }).toBuffer(), ext: 'webp' }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const rows = []
  const over = []
  let before = 0
  let after = 0
  const entries = Object.entries(MAP)
  let i = 0
  for (const [orig, e] of entries) {
    i++
    const src = expand(e.source)
    if (!fs.existsSync(src)) throw new Error(`Source missing for ${orig}: ${src}`)
    const bytesBefore = fs.statSync(src).size
    const alpha = await usesAlpha(src)
    let quality = 82
    let { buf, ext } = await encode(src, alpha, quality)
    let note = ''
    if (!alpha && buf.length > HARD) {
      quality = 75
      ;({ buf, ext } = await encode(src, alpha, quality))
      note = `still ${(buf.length / 1024).toFixed(0)}KB at q82, re-encoded at q75`
      if (buf.length > HARD) note += ` -> STILL OVER 400KB (${(buf.length / 1024).toFixed(0)}KB)`
      over.push(`${e.name}.${ext}: ${note}`)
    } else if (alpha && buf.length > HARD) {
      over.push(`${e.name}.${ext}: PNG (alpha) ${(buf.length / 1024).toFixed(0)}KB`)
    }
    const newPath = `/img/${e.name}.${ext}`
    fs.writeFileSync(path.join(OUT_DIR, `${e.name}.${ext}`), buf)
    before += bytesBefore
    after += buf.length
    rows.push({ original_url: e.url, new_path: newPath, bytes_before: bytesBefore, bytes_after: buf.length, used_in: e.used_in.join(';'), source_method: e.method, note: e.note })
    console.log(`[${i}/${entries.length}] ${(bytesBefore / 1024).toFixed(0).padStart(6)}KB -> ${(buf.length / 1024).toFixed(0).padStart(4)}KB  ${newPath}${alpha ? ' (alpha, png)' : ''}${quality !== 82 ? ' q' + quality : ''}`)
  }
  const csvEsc = (v) => `"${String(v).replace(/"/g, '""')}"`
  const header = ['original_url', 'new_path', 'bytes_before', 'bytes_after', 'used_in', 'source_method', 'note']
  const csv = [header.join(','), ...rows.map((r) => header.map((h) => csvEsc(r[h])).join(','))].join('\n') + '\n'
  fs.writeFileSync(path.join(ROOT, 'image-map.csv'), csv)
  const mb = (b) => (b / 1024 / 1024).toFixed(1) + ' MB'
  console.log(`\n${rows.length} assets written to public/img/`)
  console.log(`Bytes before: ${mb(before)}   after: ${mb(after)}   (${((1 - after / before) * 100).toFixed(0)}% smaller)`)
  console.log(`Over 300KB: ${rows.filter((r) => r.bytes_after > TARGET).length}   Over 400KB: ${rows.filter((r) => r.bytes_after > HARD).length}`)
  if (over.length) console.log('Flagged:\n  ' + over.join('\n  '))
  console.log('Wrote image-map.csv')
}
main().catch((e) => { console.error(e); process.exit(1) })
