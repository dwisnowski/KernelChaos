/**
 * Layout-first Picture Hunt composer (ADR 0026).
 *
 * 1. Trim each scene catalog to a letter-balanced visible set (~160 objects).
 * 2. Pack non-overlapping normalized boxes.
 * 3. Rasterize a sticker-board JPG from that layout.
 * 4. Write boxes + trimmed objects back to JSON.
 *
 * Run: npm run hunt:compose
 */
import { createRequire } from "node:module";
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  unlinkSync,
  existsSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../worker/scattergories/hunt/data");
const outDir = join(__dirname, "../public/hunt");

const LETTER_DIE = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "R", "S", "T", "W",
];

const MIN_PER_LETTER = 10;
const TARGET_OBJECTS = 160;
const WIDTH = 1600;
const HEIGHT = 1200;
const PAD = 0.012;
const GAP = 0.006;

const THEME = {
  beach: { wash: "#e8f4fc", ink: "#0e1f35", accent: "#3a7ca5" },
  carnival: { wash: "#fff3e8", ink: "#0e1f35", accent: "#c45c26" },
  farm: { wash: "#eef6e8", ink: "#0e1f35", accent: "#5a7a3a" },
  kitchen: { wash: "#f7efe6", ink: "#0e1f35", accent: "#8a5a3a" },
  park: { wash: "#e9f5ea", ink: "#0e1f35", accent: "#3d7a4a" },
  playroom: { wash: "#f3eef8", ink: "#0e1f35", accent: "#6b4a8a" },
  shop: { wash: "#f0f0f0", ink: "#0e1f35", accent: "#4a5a6a" },
};

function normalize(raw) {
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function startsWithLetter(normalized, letter) {
  if (!normalized) return false;
  const target = letter.toUpperCase();
  for (const ch of normalized) {
    if (/[a-z0-9]/i.test(ch)) return ch.toUpperCase() === target;
  }
  return false;
}

function objectLetters(obj) {
  const letters = new Set();
  for (const raw of obj.names ?? []) {
    const n = normalize(raw);
    for (const L of LETTER_DIE) {
      if (startsWithLetter(n, L)) letters.add(L);
    }
  }
  return letters;
}

function primaryLabel(obj) {
  const names = (obj.names ?? []).map(normalize).filter(Boolean);
  const short = [...names].sort((a, b) => a.length - b.length)[0];
  return short || obj.id;
}

function hashId(id) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Keep letter floors, then fill toward TARGET_OBJECTS with remaining catalog items. */
function trimCatalog(objects) {
  const byLetter = Object.fromEntries(LETTER_DIE.map((L) => [L, []]));
  for (const obj of objects) {
    for (const L of objectLetters(obj)) byLetter[L].push(obj);
  }

  const picked = new Map();
  for (const L of LETTER_DIE) {
    const pool = [...byLetter[L]].sort(
      (a, b) => hashId(a.id) - hashId(b.id) || a.id.localeCompare(b.id),
    );
    let n = 0;
    for (const obj of pool) {
      if (n >= MIN_PER_LETTER) break;
      if (!picked.has(obj.id)) {
        picked.set(obj.id, obj);
        n += 1;
      } else {
        n += 1;
      }
    }
    // If still short, we cannot invent objects — coverage will fail loudly.
  }

  const rest = objects
    .filter((o) => !picked.has(o.id))
    .sort((a, b) => hashId(a.id) - hashId(b.id) || a.id.localeCompare(b.id));

  for (const obj of rest) {
    if (picked.size >= TARGET_OBJECTS) break;
    picked.set(obj.id, obj);
  }

  return [...picked.values()].sort(
    (a, b) => hashId(a.id) - hashId(b.id) || a.id.localeCompare(b.id),
  );
}

function packBoxes(count) {
  const cols = Math.ceil(Math.sqrt(count * (WIDTH / HEIGHT)));
  const rows = Math.ceil(count / cols);
  const cellW = (1 - 2 * PAD - (cols - 1) * GAP) / cols;
  const cellH = (1 - 2 * PAD - (rows - 1) * GAP) / rows;
  const boxes = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = PAD + col * (cellW + GAP);
    const y = PAD + row * (cellH + GAP);
    boxes.push({
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
      w: Math.round(cellW * 1000) / 1000,
      h: Math.round(cellH * 1000) / 1000,
    });
  }
  return boxes;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function glyphFor(label) {
  for (const ch of label) {
    if (/[a-z0-9]/i.test(ch)) return ch.toUpperCase();
  }
  return "?";
}

function buildSvg(sceneId, title, placed) {
  const theme = THEME[sceneId] ?? THEME.shop;
  const parts = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">`,
  );
  parts.push(`<rect width="100%" height="100%" fill="${theme.wash}"/>`);
  parts.push(
    `<text x="${WIDTH / 2}" y="36" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="700" fill="${theme.ink}">${escapeXml(title)}</text>`,
  );

  for (const { obj, box } of placed) {
    const x = box.x * WIDTH;
    const y = box.y * HEIGHT;
    const w = box.w * WIDTH;
    const h = box.h * HEIGHT;
    const label = primaryLabel(obj);
    const glyph = glyphFor(label);
    const r = Math.min(w, h) * 0.08;
    const cx = x + w / 2;
    const cy = y + h * 0.38;
    const gr = Math.min(w, h) * 0.22;
    const fontSize = Math.max(10, Math.min(18, w * 0.22));
    const labelY = y + h * 0.82;

    parts.push(
      `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${r.toFixed(1)}" fill="#fff" stroke="${theme.ink}" stroke-width="2"/>`,
    );
    parts.push(
      `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${gr.toFixed(1)}" fill="${theme.wash}" stroke="${theme.accent}" stroke-width="2.5"/>`,
    );
    parts.push(
      `<text x="${cx.toFixed(1)}" y="${(cy + gr * 0.35).toFixed(1)}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${(gr * 1.1).toFixed(1)}" font-weight="700" fill="${theme.ink}">${escapeXml(glyph)}</text>`,
    );
    parts.push(
      `<text x="${cx.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize.toFixed(1)}" font-weight="600" fill="${theme.ink}">${escapeXml(label)}</text>`,
    );
  }

  parts.push("</svg>");
  return parts.join("\n");
}

mkdirSync(outDir, { recursive: true });

const files = readdirSync(dataDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

if (files.length === 0) {
  console.error("No hunt JSON in", dataDir);
  process.exit(1);
}

// Remove prior hunt images (jpg/svg) so stale art cannot linger.
for (const name of readdirSync(outDir)) {
  if (/\.(jpe?g|png|svg|webp)$/i.test(name)) {
    unlinkSync(join(outDir, name));
  }
}

for (const file of files) {
  const path = join(dataDir, file);
  const scene = JSON.parse(readFileSync(path, "utf8"));
  const trimmed = trimCatalog(scene.objects ?? []);
  const boxes = packBoxes(trimmed.length);
  const placed = trimmed.map((obj, i) => ({
    obj: {
      id: obj.id,
      names: [...new Set((obj.names ?? []).map(normalize).filter(Boolean))],
    },
    box: boxes[i],
  }));

  const svg = buildSvg(scene.id, scene.title ?? scene.id, placed);
  const jpgName = `${scene.id}.jpg`;
  const jpgPath = join(outDir, jpgName);
  await sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toFile(jpgPath);

  const next = {
    id: scene.id,
    title: scene.title,
    imageUrl: `/hunt/${jpgName}`,
    objects: placed.map(({ obj, box }) => ({ ...obj, box })),
  };
  writeFileSync(path, JSON.stringify(next, null, 2) + "\n");
  console.log(
    `${scene.id}: ${placed.length} stickers → ${jpgName} (${existsSync(jpgPath) ? "ok" : "MISSING"})`,
  );
}

console.log("Done. Run npm run hunt:coverage next.");
