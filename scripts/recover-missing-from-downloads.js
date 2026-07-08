#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOWNLOADS = path.join(process.env.HOME || "", "Downloads");
const MISSING_FILE = path.join(ROOT, "raw/site-image-pack/unreachable-we-dont-have.txt");
const OUT_DIR = path.join(ROOT, "raw/recovered-from-downloads");
const REPORT = path.join(ROOT, "raw/site-image-pack/RECOVERY_REPORT.json");

const MEDIA = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".mp4", ".mov", ".avif",
]);

function nameFromUrl(url) {
  const clean = url.split("?")[0].split("#")[0];
  let seg = clean.split("/").filter(Boolean).pop() || clean;
  seg = seg.replace(/\.(jpg|jpeg|png|gif|webp|heic|mp4|mov|avif)$/i, "");
  return seg.replace(/_[a-z0-9]{5,8}$/i, "");
}

function stripAccents(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function norm(s) {
  return stripAccents(s).toLowerCase().replace(/[\s._-]+/g, "_").replace(/[^a-z0-9_]/g, "");
}

function walk(dir, files = []) {
  try {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, files);
      else if (MEDIA.has(path.extname(e.name).toLowerCase())) files.push(full);
    }
  } catch {}
  return files;
}

function pickBest(cands) {
  const score = (f) => {
    const rel = path.relative(DOWNLOADS, f);
    if (rel.startsWith("FOTOS WEB")) return 1;
    if (rel.startsWith("fotos sastre")) return 2;
    if (rel.startsWith("WhatsApp Image")) return 3;
    if (rel.includes("Telegram Desktop")) return 90;
    if (rel.includes("/1/front/") || rel.includes("Badger")) return 95;
    return 50;
  };
  return [...cands].sort((a, b) => score(a) - score(b))[0];
}

function haveLocal(name) {
  const key = name.toLowerCase();
  const dirs = [
    path.join(ROOT, "public/photos"),
    path.join(ROOT, "public/models"),
    path.join(ROOT, "public"),
    path.join(ROOT, "raw/web_lista_images"),
    path.join(ROOT, "raw/recovered-from-downloads"),
  ];
  for (const d of dirs) {
    if (!fs.existsSync(d)) continue;
    for (const e of fs.readdirSync(d)) {
      const base = path.basename(e, path.extname(e)).toLowerCase();
      if (base === key) return path.join(d, e);
    }
  }
  return null;
}

function main() {
  const missingUrls = fs
    .readFileSync(MISSING_FILE, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean);

  const uniqueNames = [...new Set(missingUrls.map(nameFromUrl))];
  const stillNeed = uniqueNames.filter((n) => !haveLocal(n));

  const dlFiles = walk(DOWNLOADS);
  const exact = new Map();
  const normalized = new Map();
  for (const f of dlFiles) {
    const base = path.basename(f, path.extname(f));
    const ek = base.toLowerCase();
    const nk = norm(base);
    if (!exact.has(ek)) exact.set(ek, []);
    exact.get(ek).push(f);
    if (!normalized.has(nk)) normalized.set(nk, []);
    normalized.get(nk).push(f);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const copied = [];
  const notFound = [];

  for (const name of stillNeed) {
    let cands = exact.get(name.toLowerCase()) || [];
    if (!cands.length) cands = normalized.get(norm(name)) || [];
    if (!cands.length) {
      notFound.push(name);
      continue;
    }
    const src = pickBest(cands);
    const ext = path.extname(src);
    const dest = path.join(OUT_DIR, `${name}${ext}`);
    fs.copyFileSync(src, dest);
    copied.push({
      name,
      from: path.relative(DOWNLOADS, src),
      to: path.relative(ROOT, dest),
    });
  }

  const report = {
    generated: new Date().toISOString(),
    missingUniqueNames: uniqueNames.length,
    alreadyHad: uniqueNames.length - stillNeed.length,
    searchedDownloads: dlFiles.length,
    recovered: copied.length,
    stillNotFound: notFound.length,
    copied,
    notFound,
  };

  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log(`Unique missing names: ${uniqueNames.length}`);
  console.log(`Already had locally:    ${uniqueNames.length - stillNeed.length}`);
  console.log(`Recovered from Downloads: ${copied.length} → raw/recovered-from-downloads/`);
  console.log(`Still not found:        ${notFound.length}`);
}

main();