#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Step 6 of the ImageKit -> /public/img migration.
 * Rewrites every ImageKit URL listed in image-map.csv to its local /img path in
 * app/, components/, lib/ (.ts/.tsx) and scripts/setup-db.ts. Nothing else on the
 * line is touched (props such as `unoptimized`, width, height, sizes stay as they are).
 *
 * Usage: node scripts/image-rewrite.js [--dry-run]
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const DRY = process.argv.includes('--dry-run')

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

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) { if (!['node_modules', '.next'].includes(entry.name)) walk(p, acc) }
    else if (/\.(ts|tsx)$/.test(entry.name)) acc.push(p)
  }
  return acc
}

const map = parseCsv(fs.readFileSync(path.join(ROOT, 'image-map.csv'), 'utf8'))
const files = [
  ...walk(path.join(ROOT, 'app')),
  ...walk(path.join(ROOT, 'components')),
  ...walk(path.join(ROOT, 'lib')),
  path.join(ROOT, 'scripts', 'setup-db.ts'),
]

let total = 0
const perFile = []
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8')
  let after = before
  let n = 0
  for (const { original_url, new_path } of map) {
    const parts = after.split(original_url)
    if (parts.length > 1) { n += parts.length - 1; after = parts.join(new_path) }
  }
  if (n) {
    perFile.push(`${n.toString().padStart(3)}  ${path.relative(ROOT, file)}`)
    total += n
    if (!DRY) fs.writeFileSync(file, after)
  }
}
console.log(perFile.join('\n'))
console.log(`\n${DRY ? '[dry-run] would replace' : 'Replaced'} ${total} references in ${perFile.length} files`)
