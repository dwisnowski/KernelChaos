/**
 * Remove lowercase words from worker/boggle/words.ts WORD_LIST.
 *
 * The source stores separators as literal \n escape sequences inside a
 * template literal (runtime value has real newlines).
 *
 * Usage: node --experimental-strip-types scripts/remove-boggle-words.ts word1 word2 …
 *    or: node --experimental-strip-types scripts/remove-boggle-words.ts --file words.txt
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const wordsPath = join(root, "worker/boggle/words.ts");
const HEADER = "/** Enable1-derived Boggle dictionary (3–10 letters). */\n";
const PREFIX = "export const WORD_LIST = `";
const SUFFIX = "`;\n";

function parseArgs(argv: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--file") {
      const path = argv[++i];
      if (!path) throw new Error("--file requires a path");
      const text = readFileSync(path, "utf8");
      for (const line of text.split(/\r?\n/)) {
        const w = line.trim().toLowerCase();
        if (w && !w.startsWith("#")) out.push(w);
      }
      continue;
    }
    if (arg.startsWith("-")) throw new Error(`Unknown flag: ${arg}`);
    out.push(arg.trim().toLowerCase());
  }
  return [...new Set(out.filter(Boolean))];
}

function main() {
  const remove = new Set(parseArgs(process.argv.slice(2)));
  if (remove.size === 0) {
    console.error("Usage: remove-boggle-words.ts word1 word2 …  |  --file list.txt");
    process.exit(1);
  }

  const raw = readFileSync(wordsPath, "utf8");
  const start = raw.indexOf(PREFIX);
  const end = raw.lastIndexOf(SUFFIX);
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`Could not find WORD_LIST template in ${wordsPath}`);
  }

  const body = raw.slice(start + PREFIX.length, end);
  // Source uses literal \n between words (template escapes → real newlines at runtime).
  const words = body.split("\\n").filter(Boolean);
  const before = words.length;
  const kept = words.filter((w) => !remove.has(w.toLowerCase()));
  const removed = before - kept.length;

  const next = `${HEADER}${PREFIX}${kept.join("\\n")}${SUFFIX}`;
  writeFileSync(wordsPath, next);

  console.log(`Removed ${removed} of ${remove.size} requested (${before} → ${kept.length}).`);
  const missing = [...remove].filter((w) => !words.some((x) => x.toLowerCase() === w));
  if (missing.length) {
    console.log(`Not in list (skipped): ${missing.join(", ")}`);
  }
}

main();
