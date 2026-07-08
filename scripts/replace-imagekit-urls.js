/**
 * Replace Cloudinary URLs in the codebase with ImageKit URLs
 * using IMAGEKIT_MIGRATION_REPORT.json from migrate-to-imagekit.js
 *
 * Usage: node scripts/replace-imagekit-urls.js
 */

const fs = require('fs')
const path = require('path')

const REPORT_PATH = path.join(__dirname, '..', 'IMAGEKIT_MIGRATION_REPORT.json')
const ROOT = path.join(__dirname, '..')

if (!fs.existsSync(REPORT_PATH)) {
  console.error('Run migrate-to-imagekit.js first to create IMAGEKIT_MIGRATION_REPORT.json')
  process.exit(1)
}

const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'))
const mapping = Object.fromEntries(report.migrated.map((r) => [r.oldUrl, r.newUrl]))

const EXTENSIONS = ['.tsx', '.ts', '.js', '.json']
const SKIP_DIRS = ['node_modules', '.next', '.git']

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.includes(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) files.push(full)
  }
  return files
}

let totalReplacements = 0
const files = walk(ROOT)

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8')
  let changed = false

  for (const [oldUrl, newUrl] of Object.entries(mapping)) {
    if (content.includes(oldUrl)) {
      content = content.split(oldUrl).join(newUrl)
      changed = true
      totalReplacements++
    }
  }

  if (changed) {
    fs.writeFileSync(file, content)
    console.log('Updated:', path.relative(ROOT, file))
  }
}

console.log(`\nDone. ${totalReplacements} URL replacements across codebase.`)
console.log('Also update next.config.ts remotePatterns if not already done.')