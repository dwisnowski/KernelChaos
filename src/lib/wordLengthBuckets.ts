import type { LengthBucketKey, LengthCount } from "../types.ts";

export type { LengthBucketKey, LengthCount };

export interface LengthBucket {
  key: LengthBucketKey;
  label: string;
  count: number;
}

export interface LengthCoverageRow {
  key: LengthBucketKey;
  label: string;
  found: number;
  possible: number;
}

export const LENGTH_BUCKET_ORDER: LengthBucketKey[] = ["3", "4", "5", "6", "7", "8+"];

export const LENGTH_BUCKET_COLORS: Record<LengthBucketKey, string> = {
  "3": "#5a8f7b",
  "4": "#3ecf8e",
  "5": "#f0a202",
  "6": "#e07a3a",
  "7": "#c45c4a",
  "8+": "#8ecfff",
};

export function bucketKeyForLength(len: number): LengthBucketKey | null {
  if (len < 3) return null;
  if (len >= 8) return "8+";
  return String(len) as LengthBucketKey;
}

export function bucketLabel(key: LengthBucketKey): string {
  return key === "8+" ? "8+" : key;
}

export function wordLengthBuckets(words: Iterable<string>): LengthBucket[] {
  const counts = new Map<LengthBucketKey, number>();
  for (const key of LENGTH_BUCKET_ORDER) counts.set(key, 0);
  for (const word of words) {
    const key = bucketKeyForLength(word.length);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return LENGTH_BUCKET_ORDER.map((key) => ({
    key,
    label: bucketLabel(key),
    count: counts.get(key) ?? 0,
  })).filter((b) => b.count > 0);
}

/** Found vs possible rows for buckets that exist on the board (possible > 0). */
export function wordLengthCoverage(
  foundWords: Iterable<string>,
  possibleByLength: Iterable<LengthCount>,
): LengthCoverageRow[] {
  const possibleMap = new Map<LengthBucketKey, number>();
  for (const entry of possibleByLength) {
    possibleMap.set(entry.key, entry.count);
  }

  const foundMap = new Map<LengthBucketKey, number>();
  for (const key of LENGTH_BUCKET_ORDER) foundMap.set(key, 0);
  for (const word of foundWords) {
    const key = bucketKeyForLength(word.length);
    if (!key) continue;
    foundMap.set(key, (foundMap.get(key) ?? 0) + 1);
  }

  return LENGTH_BUCKET_ORDER.filter((key) => (possibleMap.get(key) ?? 0) > 0).map((key) => ({
    key,
    label: bucketLabel(key),
    found: foundMap.get(key) ?? 0,
    possible: possibleMap.get(key) ?? 0,
  }));
}
