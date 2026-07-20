#!/usr/bin/env node
/**
 * One-shot: apply media-library-export-2026-07-20 CSV to remaining Cloudinary URLs.
 * Skips hero video.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CSV = path.join(ROOT, "media-library-export-2026-07-20_08-39-08.csv");
const REPORT = path.join(ROOT, "IMAGEKIT_URL_REPLACEMENT_REPORT.json");
const SCAN_DIRS = ["components", "app", "scripts"];
const EXTENSIONS = [".tsx", ".ts", ".js", ".jsx"];
const SKIP = new Set(["node_modules", ".next", ".git"]);

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQ = !inQ;
      continue;
    }
    if (c === "," && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

function loadCsvMap() {
  const lines = fs.readFileSync(CSV, "utf8").trim().split("\n");
  const byBase = new Map();
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const name = cols[2];
    const url = (cols[5] || "").split("?")[0];
    if (!name || name === "MANIFEST.json" || !url.includes("ik.imagekit.io")) continue;
    const base = path.basename(name, path.extname(name)).toLowerCase();
    byBase.set(base, url);
  }
  return byBase;
}

function nameFromReference(ref) {
  const clean = ref.split("?")[0].split("#")[0];
  let seg = clean.split("/").filter(Boolean).pop() || clean;
  seg = seg.replace(/\.(jpg|jpeg|png|gif|webp|avif|heic|mp4|mov|glb|ico|svg)$/i, "");
  return seg.replace(/_[a-z0-9]{5,8}$/i, "").toLowerCase();
}

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (EXTENSIONS.some((x) => e.name.endsWith(x))) files.push(full);
  }
  return files;
}

const ikMap = loadCsvMap();
const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
const replacements = [];
const unmatched = new Set();
const re = /https?:\/\/res\.cloudinary\.com\/[^"'\s`\)]+/g;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const found = new Set();
  for (const m of content.match(re) || []) {
    const raw = m.replace(/[),;]+$/, "");
    if (raw.includes("/video/") || raw.endsWith(".mp4")) continue;
    found.add(raw);
  }

  const subs = [];
  for (const old of [...found].sort((a, b) => b.length - a.length)) {
    const base = nameFromReference(old);
    const neu = ikMap.get(base);
    if (!neu) {
      unmatched.add(`${base}  ←  ${old.slice(0, 100)}`);
      continue;
    }
    if (content.includes(old)) {
      content = content.split(old).join(neu);
      subs.push({ old, new: neu, base });
    }
  }

  if (subs.length) {
    fs.writeFileSync(file, content);
    replacements.push({
      file: path.relative(ROOT, file),
      count: subs.length,
      subs,
    });
  }
}

fs.writeFileSync(
  REPORT,
  JSON.stringify(
    {
      generated: new Date().toISOString(),
      csv: path.basename(CSV),
      imagekitAssets: ikMap.size,
      filesUpdated: replacements.length,
      totalReplacements: replacements.reduce((n, r) => n + r.count, 0),
      replacements,
      unmatched: [...unmatched].sort(),
    },
    null,
    2
  )
);

console.log("ImageKit assets:", ikMap.size);
console.log("Files updated:", replacements.length);
console.log(
  "Total swaps:",
  replacements.reduce((n, r) => n + r.count, 0)
);
console.log("Unmatched:", unmatched.size);
[...unmatched].forEach((u) => console.log(" ", u));
replacements.forEach((r) => console.log(" +", r.file, r.count));
