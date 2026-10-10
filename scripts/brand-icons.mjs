#!/usr/bin/env node
/**
 * Small copies of the crest for the places it is drawn small, from the one
 * 2000x1317 master (public/img/logo-manuel-fernandez.png, 142 kB):
 *
 * - public/img/crest-{160,320,480}.webp  header and loading screen (drawn
 *   about 80px wide, so 480 covers a 6x display)
 * - app/favicon.ico                       16/32/48 px, PNG-in-ICO
 * - app/icon.png                          192 px
 * - app/apple-icon.png                    180 px, on navy (iOS ignores alpha)
 *
 * The crest is wider than tall, so the square icons centre it on a
 * transparent (or navy) square rather than squash it.
 *
 * Usage: node scripts/brand-icons.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MASTER = path.join(ROOT, 'public', 'img', 'logo-manuel-fernandez.png')
const NAVY = { r: 10, g: 22, b: 40, alpha: 1 }
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 }

for (const w of [160, 320, 480]) {
  await sharp(MASTER).resize({ width: w }).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(ROOT, 'public', 'img', `crest-${w}.webp`))
}

const square = async (size, background, padding = 0) => {
  let img = sharp(
    await sharp(MASTER)
      .resize({ width: size - padding * 2, height: size - padding * 2, fit: 'contain', background })
      .extend({ top: padding, bottom: padding, left: padding, right: padding, background })
      .png()
      .toBuffer(),
  )
  if (background.alpha === 1) img = img.flatten({ background })
  return img.png({ compressionLevel: 9 }).toBuffer()
}

await fs.promises.writeFile(path.join(ROOT, 'app', 'icon.png'), await square(192, CLEAR))
await fs.promises.writeFile(path.join(ROOT, 'app', 'apple-icon.png'), await square(180, NAVY, 14))

// ICO container holding PNG images (supported by every current browser).
const sizes = [16, 32, 48]
const pngs = await Promise.all(sizes.map((s) => square(s, CLEAR)))
const header = Buffer.alloc(6 + 16 * sizes.length)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
sizes.forEach((s, i) => {
  const e = 6 + 16 * i
  header.writeUInt8(s, e)
  header.writeUInt8(s, e + 1)
  header.writeUInt8(0, e + 2)
  header.writeUInt8(0, e + 3)
  header.writeUInt16LE(1, e + 4)
  header.writeUInt16LE(32, e + 6)
  header.writeUInt32LE(pngs[i].length, e + 8)
  header.writeUInt32LE(offset, e + 12)
  offset += pngs[i].length
})
await fs.promises.writeFile(path.join(ROOT, 'app', 'favicon.ico'), Buffer.concat([header, ...pngs]))

console.log('crest-160/320/480.webp, favicon.ico, icon.png, apple-icon.png written')
