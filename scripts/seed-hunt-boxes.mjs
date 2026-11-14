/**
 * Assign approximate normalized bounding boxes to hunt catalog objects.
 * Uses a deterministic hash grid so every object gets a stable location for
 * results review (vision refinement can overwrite later).
 *
 * Run: node scripts/seed-hunt-boxes.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../worker/scattergories/hunt/data",
);

function hashId(id) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function boxFor(id, index, total) {
  const h = hashId(id);
  const cols = 12;
  const rows = Math.max(8, Math.ceil(total / cols) + 2);
  const col = (h + index) % cols;
  const row = Math.floor(h / cols) % rows;
  const cellW = 1 / cols;
  const cellH = 1 / rows;
  const jitterX = ((h % 1000) / 1000) * cellW * 0.35;
  const jitterY = (((h >> 10) % 1000) / 1000) * cellH * 0.35;
  const w = Math.max(0.04, cellW * (0.55 + ((h >> 4) % 40) / 100));
  const hgt = Math.max(0.04, cellH * (0.5 + ((h >> 8) % 45) / 100));
  const x = Math.min(Math.max(0, 1 - w), Math.max(0, col * cellW + jitterX));
  const y = Math.min(Math.max(0, 1 - hgt), Math.max(0, row * cellH + jitterY));
  return {
    x: Math.round(x * 1000) / 1000,
    y: Math.round(y * 1000) / 1000,
    w: Math.round(w * 1000) / 1000,
    h: Math.round(hgt * 1000) / 1000,
  };
}

for (const file of readdirSync(dataDir).filter((f) => f.endsWith(".json"))) {
  const path = join(dataDir, file);
  const scene = JSON.parse(readFileSync(path, "utf8"));
  const total = scene.objects.length;
  let withBox = 0;
  scene.objects = scene.objects.map((obj, i) => {
    const box = boxFor(obj.id, i, total);
    withBox += 1;
    return { ...obj, box };
  });
  writeFileSync(path, JSON.stringify(scene, null, 2) + "\n");
  console.log(`${scene.id}: ${withBox}/${total} boxes`);
}
