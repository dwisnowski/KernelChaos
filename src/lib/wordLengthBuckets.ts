export type LengthBucketKey = "3" | "4" | "5" | "6" | "7" | "8+";

export interface LengthBucket {
  key: LengthBucketKey;
  label: string;
  count: number;
}

const ORDER: LengthBucketKey[] = ["3", "4", "5", "6", "7", "8+"];

export function bucketKeyForLength(len: number): LengthBucketKey | null {
  if (len < 3) return null;
  if (len >= 8) return "8+";
  return String(len) as LengthBucketKey;
}

export function wordLengthBuckets(words: Iterable<string>): LengthBucket[] {
  const counts = new Map<LengthBucketKey, number>();
  for (const key of ORDER) counts.set(key, 0);
  for (const word of words) {
    const key = bucketKeyForLength(word.length);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return ORDER.map((key) => ({
    key,
    label: key === "8+" ? "8+" : `${key}`,
    count: counts.get(key) ?? 0,
  })).filter((b) => b.count > 0);
}
