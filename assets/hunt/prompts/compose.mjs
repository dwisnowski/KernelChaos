#!/usr/bin/env node
/**
 * Compose Magnific prompts: shared style + scene foundation.
 * Usage: node assets/hunt/prompts/compose.mjs <scene-id>
 * Prints the full prompt to stdout.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const stylePath = join(root, "style.md");
const scenesDir = join(root, "scenes");

function stripFrontmatter(md) {
  if (!md.startsWith("---")) return { meta: {}, body: md.trim() };
  const end = md.indexOf("\n---", 3);
  if (end < 0) return { meta: {}, body: md.trim() };
  const raw = md.slice(3, end).trim();
  const body = md.slice(end + 4).trim();
  const meta = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) continue;
    meta[m[1]] = m[2].replace(/^\[|\]$/g, "").trim();
  }
  return { meta, body };
}

function compose(sceneId) {
  const style = readFileSync(stylePath, "utf8").trim();
  const scenePath = join(scenesDir, `${sceneId}.md`);
  const { meta, body } = stripFrontmatter(readFileSync(scenePath, "utf8"));
  const title = meta.title || sceneId;
  return [
    `Create a dense hidden-object seek-and-find illustration titled "${title}".`,
    "",
    "STYLE:",
    style.replace(/^#.*$/m, "").trim(),
    "",
    "SCENE:",
    body,
    "",
    "Output a single packed illustration matching the style and scene. No text of any kind.",
  ].join("\n");
}

const id = process.argv[2];
if (!id || id === "--list") {
  const ids = readdirSync(scenesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
  if (!id) {
    console.error("Usage: node assets/hunt/prompts/compose.mjs <scene-id>");
    console.error("Scenes:", ids.join(", "));
    process.exit(1);
  }
  console.log(ids.join("\n"));
  process.exit(0);
}

console.log(compose(id));
