#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = path.resolve(__dirname, "..");
const PACK = path.join(ROOT, "raw/site-image-pack");
const SITE_BASE = "https://sastreria-five.vercel.app";

const MEDIA_EXT = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".heic",
  ".mp4", ".mov", ".glb", ".ico", ".svg",
]);

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "site-image-pack"]);

function nameFromUrl(url) {
  const clean = url.split("?")[0].split("#")[0];
  let seg = clean.split("/").filter(Boolean).pop() || clean;
  seg = seg.replace(/\.(jpg|jpeg|png|gif|webp|avif|heic|mp4|mov|glb|ico|svg)$/i, "");
  seg = seg.replace(/_[a-z0-9]{5,8}$/i, "");
  return seg;
}

function walk(dir, files = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (MEDIA_EXT.has(path.extname(e.name).toLowerCase())) files.push(full);
  }
  return files;
}

function indexLocal(files) {
  const map = new Map();
  for (const f of files) {
    const base = path.basename(f, path.extname(f)).toLowerCase();
    if (!map.has(base)) map.set(base, []);
    map.get(base).push(f);
  }
  return map;
}

function pickBest(candidates) {
  const score = (f) => {
    const rel = path.relative(ROOT, f);
    if (rel.startsWith(`public${path.sep}photos`)) return 1;
    if (rel.startsWith(`public${path.sep}`)) return 2;
    if (rel.startsWith(`raw${path.sep}images`)) return 3;
    if (rel.includes("salvaged")) return 99;
    return 50;
  };
  return [...candidates].sort((a, b) => score(a) - score(b))[0];
}

function head(url) {
  return new Promise((resolve) => {
    https
      .request(url, { method: "HEAD", timeout: 12000 }, (res) => {
        res.resume();
        resolve(res.statusCode || 0);
      })
      .on("error", () => resolve(0))
      .end();
  });
}

async function isReachable(url) {
  const absolute = url.startsWith("http")
    ? url
    : `${SITE_BASE}${url.startsWith("/") ? url : `/${url}`}`;
  const status = await head(absolute);
  return status === 200 || status === 206;
}

async function main() {
  const links = fs
    .readFileSync(path.join(PACK, "links.txt"), "utf8")
    .trim()
    .split("\n")
    .filter(Boolean);

  const localFiles = walk(path.join(ROOT, "public")).concat(walk(path.join(ROOT, "raw")));
  const byName = indexLocal(localFiles);

  const reachable = [];
  const unreachable = [];

  for (const url of links) {
    if (await isReachable(url)) reachable.push(url);
    else unreachable.push(url);
  }

  const have = [];
  const dontHave = [];

  for (const url of unreachable) {
    const name = nameFromUrl(url);
    const key = name.toLowerCase();
    const cands = byName.get(key) || [];
    if (cands.length === 1) {
      have.push({ url, name, local: path.relative(ROOT, cands[0]) });
    } else if (cands.length > 1) {
      have.push({ url, name, local: path.relative(ROOT, pickBest(cands)), note: "picked from duplicates" });
    } else {
      dontHave.push({ url, name });
    }
  }

  // reachable vs our files
  const reachableLocal = [];
  for (const url of reachable) {
    const rel = url.replace(SITE_BASE, "");
    const localPath = rel.startsWith("/")
      ? path.join(ROOT, "public", rel.replace(/^\//, ""))
      : null;
    const exists = localPath && fs.existsSync(localPath);
    reachableLocal.push({
      url: url.startsWith("http") ? url : `${SITE_BASE}${url}`,
      local: exists ? path.relative(ROOT, localPath) : null,
    });
  }

  fs.writeFileSync(
    path.join(PACK, "unreachable-links.txt"),
    unreachable.join("\n") + "\n"
  );

  fs.writeFileSync(
    path.join(PACK, "unreachable-we-have.txt"),
    have.map((h) => `${h.url}\n  → ${h.local}${h.note ? " (" + h.note + ")" : ""}`).join("\n\n") + "\n"
  );

  fs.writeFileSync(
    path.join(PACK, "unreachable-we-dont-have.txt"),
    dontHave.map((d) => d.url).join("\n") + "\n"
  );

  const summary = [
    "REACHABLE (from links.txt)",
    `Count: ${reachable.length}`,
    "All are already in public/ locally:",
    ...reachableLocal.map((r) => `  ${r.local || "MISSING LOCAL"}  ←  ${r.url}`),
    "",
    "UNREACHABLE (dead Cloudinary etc.)",
    `Total links: ${unreachable.length}`,
    `We HAVE local file: ${have.length}`,
    `We DON'T HAVE:     ${dontHave.length}`,
    "",
    "Files:",
    "  unreachable-links.txt",
    "  unreachable-we-have.txt",
    "  unreachable-we-dont-have.txt",
  ].join("\n");

  fs.writeFileSync(path.join(PACK, "status.txt"), summary);

  console.log(summary);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});