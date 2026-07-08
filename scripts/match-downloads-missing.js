#!/usr/bin/env node
/**
 * Match MIGRATION_MISSING names against ~/Downloads using strict rules only:
 * - exact basename (case-insensitive), OR
 * - normalized basename (spaces/underscores/dashes, accents stripped)
 * No fuzzy/partial matching. Skips duplicate basename matches.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOWNLOADS = path.join(process.env.HOME || "", "Downloads");
const MISSING_FILE = path.join(ROOT, "MIGRATION_MISSING.json");
const OUT_DIR = path.join(ROOT, "raw/migration-ready/from-downloads");
const REPORT_JSON = path.join(ROOT, "DOWNLOADS_MATCH_REPORT.json");
const REPORT_TXT = path.join(ROOT, "DOWNLOADS_MATCH_REPORT.txt");

const MEDIA_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".heic",
  ".mp4",
  ".mov",
  ".glb",
]);

function stripAccents(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeBase(name) {
  return stripAccents(name)
    .toLowerCase()
    .replace(/[\s._-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function walk(dir, files = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (MEDIA_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

function indexDownloads(files) {
  const exact = new Map();
  const normalized = new Map();

  for (const file of files) {
    const base = path.basename(file, path.extname(file));
    const exactKey = base.toLowerCase();
    const normKey = normalizeBase(base);

    if (!exact.has(exactKey)) exact.set(exactKey, []);
    exact.get(exactKey).push(file);

    if (!normalized.has(normKey)) normalized.set(normKey, []);
    normalized.get(normKey).push(file);
  }

  return { exact, normalized };
}

function pickBest(candidates) {
  const preferred = candidates.filter((f) => {
    const rel = path.relative(DOWNLOADS, f);
    return (
      rel.startsWith("FOTOS WEB") ||
      rel.startsWith("fotos sastre") ||
      rel.startsWith("WhatsApp Image") ||
      !rel.includes(path.sep + "1" + path.sep) // skip random vendor junk
    );
  });
  const pool = preferred.length ? preferred : candidates;
  return pool.sort((a, b) => a.length - b.length)[0];
}

function main() {
  const missing = JSON.parse(fs.readFileSync(MISSING_FILE, "utf8"));
  const assets = missing.assets;

  const dlFiles = walk(DOWNLOADS);
  const { exact, normalized } = indexDownloads(dlFiles);

  if (fs.existsSync(OUT_DIR)) {
    for (const f of fs.readdirSync(OUT_DIR)) {
      fs.unlinkSync(path.join(OUT_DIR, f));
    }
  } else {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const copied = [];
  const stillMissing = [];
  const ambiguous = [];

  for (const asset of assets) {
    const name = asset.name;
    const exactKey = name.toLowerCase();
    const normKey = normalizeBase(name);

    let candidates = exact.get(exactKey) || [];
    let matchType = "exact";

    if (!candidates.length) {
      candidates = normalized.get(normKey) || [];
      matchType = candidates.length ? "normalized" : null;
    }

    if (!candidates.length) {
      stillMissing.push(asset);
      continue;
    }

    if (candidates.length > 1 && matchType === "exact") {
      // Multiple exact basename matches — still OK if same file size? Prefer FOTOS WEB.
      const best = pickBest(candidates);
      const ext = path.extname(best);
      const destName = `${name}${ext}`;
      const dest = path.join(OUT_DIR, destName);
      fs.copyFileSync(best, dest);
      copied.push({
        name,
        matchType,
        from: path.relative(DOWNLOADS, best),
        to: path.relative(ROOT, dest),
        dupes: candidates.length,
        site: asset.usedIn,
        url: asset.url,
      });
      continue;
    }

    if (candidates.length > 1 && matchType === "normalized") {
      const uniqueBases = new Set(
        candidates.map((c) => normalizeBase(path.basename(c, path.extname(c))))
      );
      if (uniqueBases.size > 1) {
        ambiguous.push({ name, candidates: candidates.map((c) => path.relative(DOWNLOADS, c)) });
        stillMissing.push(asset);
        continue;
      }
    }

    const best = pickBest(candidates);
    const ext = path.extname(best);
    const destName = `${name}${ext}`;
    const dest = path.join(OUT_DIR, destName);
    fs.copyFileSync(best, dest);
    copied.push({
      name,
      matchType,
      from: path.relative(DOWNLOADS, best),
      to: path.relative(ROOT, dest),
      dupes: candidates.length,
      site: asset.usedIn,
      url: asset.url,
    });
  }

  const report = {
    generated: new Date().toISOString(),
    rules: [
      "Exact basename match (case-insensitive)",
      "OR normalized basename (spaces/underscores/dashes, accents stripped)",
      "No fuzzy/partial matching",
      "Duplicates prefer FOTOS WEB / fotos sastre / WhatsApp paths",
    ],
    downloadsScanned: DOWNLOADS,
    totalFilesInDownloads: dlFiles.length,
    missingChecked: assets.length,
    matched: copied.length,
    stillMissing: stillMissing.length,
    ambiguous: ambiguous.length,
    copied,
    stillMissingList: stillMissing.map((a) => ({
      name: a.name,
      site: a.usedIn,
      localCandidates: a.localCandidates || [],
    })),
    ambiguous,
  };

  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2));

  const lines = [
    "DOWNLOADS FOLDER MATCH REPORT (STRICT)",
    `Scanned: ${DOWNLOADS} (${dlFiles.length} media files)`,
    `Missing names checked: ${assets.length}`,
    `Matched & copied: ${copied.length}`,
    `Still missing: ${stillMissing.length}`,
    ambiguous.length ? `Ambiguous (skipped): ${ambiguous.length}` : null,
    "",
    "=== COPIED TO raw/migration-ready/from-downloads/ ===",
    "",
  ].filter(Boolean);

  for (const item of copied) {
    lines.push(item.name);
    lines.push(`  match: ${item.matchType}${item.dupes > 1 ? ` (${item.dupes} candidates)` : ""}`);
    lines.push(`  from Downloads: ${item.from}`);
    lines.push(`  copied to: ${item.to}`);
    lines.push(`  site: ${item.site.join(", ")}`);
    lines.push("");
  }

  lines.push("=== STILL NOT IN DOWNLOADS ===", "");
  for (const item of stillMissing) {
    lines.push(`- ${item.name}`);
    if (item.localCandidates?.length) {
      lines.push(`  (exists in project: ${item.localCandidates.join(", ")})`);
    }
  }

  if (ambiguous.length) {
    lines.push("", "=== AMBIGUOUS (NOT COPIED) ===", "");
    for (const item of ambiguous) {
      lines.push(`- ${item.name}`);
      for (const c of item.candidates) lines.push(`    ${c}`);
    }
  }

  fs.writeFileSync(REPORT_TXT, lines.join("\n"));
  fs.writeFileSync(path.join(OUT_DIR, "MATCH_REPORT.txt"), lines.join("\n"));

  console.log(`Downloads scan complete.`);
  console.log(`  Matched: ${copied.length}`);
  console.log(`  Still missing: ${stillMissing.length}`);
  console.log(`  Reports: ${REPORT_TXT}`);
}

main();