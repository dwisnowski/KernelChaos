/**
 * Picture Hunt catalog coverage (ADR 0020).
 *
 * Authoring loop:
 * 1. Write worker/scattergories/hunt/data/<id>.json (objects + synonyms) first.
 * 2. Run this script until floors pass.
 * 3. Generate dense family-friendly B&W line art into public/hunt/<id>.jpg.
 * 4. Vision-check; replace missing keyed items; re-run coverage.
 * 5. make lint && make build; ship.
 *
 * Floors: ≥250 objects; ≥10 distinct objectIds findable per die letter.
 *
 * Run: npm run hunt:coverage
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LETTER_DIE = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "R",
  "S",
  "T",
  "W",
] as const;

const MIN_OBJECTS = 250;
const MIN_PER_LETTER = 10;

function normalizeAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function startsWithLetter(normalized: string, letter: string): boolean {
  if (!normalized) return false;
  const target = letter.toUpperCase();
  for (const ch of normalized) {
    if (/[a-z0-9]/i.test(ch)) {
      return ch.toUpperCase() === target;
    }
  }
  return false;
}

interface HuntObject {
  id: string;
  names: string[];
}

interface HuntSceneFile {
  id: string;
  title: string;
  imageUrl: string;
  objects: HuntObject[];
}

const dataDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../worker/scattergories/hunt/data",
);

const files = readdirSync(dataDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

if (files.length === 0) {
  console.error("No hunt data JSON files in", dataDir);
  process.exit(1);
}

let failed = false;

for (const file of files) {
  const scene = JSON.parse(readFileSync(join(dataDir, file), "utf8")) as HuntSceneFile;
  const counts: Record<string, Set<string>> = Object.fromEntries(
    LETTER_DIE.map((l) => [l, new Set<string>()]),
  );

  for (const obj of scene.objects ?? []) {
    for (const raw of obj.names ?? []) {
      const n = normalizeAnswer(raw);
      for (const letter of LETTER_DIE) {
        if (startsWithLetter(n, letter)) counts[letter]!.add(obj.id);
      }
    }
  }

  const objectCount = scene.objects?.length ?? 0;
  const withBox = (scene.objects ?? []).filter(
    (o) =>
      o.box &&
      typeof o.box.x === "number" &&
      typeof o.box.y === "number" &&
      typeof o.box.w === "number" &&
      typeof o.box.h === "number" &&
      o.box.w > 0 &&
      o.box.h > 0,
  ).length;
  const boxPct = objectCount > 0 ? Math.round((withBox / objectCount) * 100) : 0;
  const perLetter = Object.fromEntries(
    LETTER_DIE.map((l) => [l, counts[l]!.size]),
  ) as Record<string, number>;
  const weak = LETTER_DIE.filter((l) => perLetter[l]! < MIN_PER_LETTER);

  console.log(`\n${scene.id} (${scene.title}) — ${file}`);
  console.log(`  objects: ${objectCount} (need ≥${MIN_OBJECTS})`);
  console.log(`  boxes: ${withBox}/${objectCount} (${boxPct}%)`);
  console.log(
    "  letters:",
    LETTER_DIE.map((l) => `${l}:${perLetter[l]}`).join(" "),
  );

  if (objectCount < MIN_OBJECTS) {
    console.error(`  FAIL: object count ${objectCount} < ${MIN_OBJECTS}`);
    failed = true;
  }
  if (weak.length > 0) {
    console.error(
      `  FAIL: letters below ${MIN_PER_LETTER}: ${weak
        .map((l) => `${l}=${perLetter[l]}`)
        .join(", ")}`,
    );
    failed = true;
  }
  if (objectCount >= MIN_OBJECTS && weak.length === 0) {
    console.log("  OK");
  }
}

if (failed) {
  console.error("\nhunt:coverage failed");
  process.exit(1);
}
console.log("\nhunt:coverage passed");
