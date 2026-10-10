#!/usr/bin/env node
/**
 * Responsive widths for every photograph in public/img.
 *
 * Vercel image optimisation is deliberately off (metered on this plan, see
 * next.config.ts), so the site serves files from public/img as they are. The
 * originals are up to 2000px wide, which is what every phone was downloading.
 * This writes smaller copies to public/img/w/<name>-<width>.webp, same WebP
 * q82 as the originals (scripts/image-optimize.js), never upscaling, and a
 * manifest of which widths exist so lib/responsive-image.ts can build srcset.
 *
 * public/img/w is generated, gitignored and rebuilt by `pnpm build` and
 * `pnpm dev`; existing files are skipped, so reruns are fast. The manifest
 * (lib/image-widths.json) is committed and must match: run this script after
 * adding or replacing a photo.
 *
 * Usage: node scripts/image-variants.mjs [--check]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'public', 'img')
const OUT = path.join(SRC, 'w')
const MANIFEST = path.join(ROOT, 'lib', 'image-widths.json')
const WIDTHS = [480, 828, 1200, 1600]
const check = process.argv.includes('--check')

fs.mkdirSync(OUT, { recursive: true })

// crest-*.webp are already small (scripts/brand-icons.mjs).
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.webp') && !f.startsWith('crest-')).sort()
const manifest = {}
let written = 0

await Promise.all(
  files.map(async (file) => {
    const input = path.join(SRC, file)
    const { width } = await sharp(input).metadata()
    const name = file.replace(/\.webp$/, '')
    const inputSize = fs.statSync(input).size
    const kept = []
    for (const w of WIDTHS.filter((w) => w < width)) {
      const out = path.join(OUT, `${name}-${w}.webp`)
      const fresh = fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(input).mtimeMs
      if (!fresh && !check) {
        await sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out)
        written++
      }
      // A copy that saves less than 10% over the original is not worth a
      // srcset entry (some originals were re-encoded at q75 to stay small).
      if (fs.existsSync(out) && fs.statSync(out).size < inputSize * 0.9) kept.push(w)
      else if (fs.existsSync(out) && !check) fs.unlinkSync(out)
    }
    manifest[file] = [width, kept]
  }),
)

// One line per image: "file.webp": [originalWidth, [variant widths]]
const json =
  '{\n' +
  Object.keys(manifest)
    .sort()
    .map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(manifest[k])}`)
    .join(',\n') +
  '\n}\n'
const current = fs.existsSync(MANIFEST) ? fs.readFileSync(MANIFEST, 'utf8') : ''

if (check) {
  if (current !== json) {
    console.error('lib/image-widths.json is out of date: run node scripts/image-variants.mjs')
    process.exit(1)
  }
  console.log(`image-widths.json matches ${files.length} images`)
} else {
  if (current !== json) fs.writeFileSync(MANIFEST, json)
  console.log(`image variants: ${files.length} images, ${written} files written`)
}
