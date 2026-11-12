/** Trim, casefold, collapse internal whitespace for duplicate matching. */
export function normalizeAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** First alphanumeric character must equal the round letter (case-insensitive). */
export function startsWithLetter(normalized: string, letter: string): boolean {
  if (!normalized) return false;
  const target = letter.toUpperCase();
  for (const ch of normalized) {
    if (/[a-z0-9]/i.test(ch)) {
      return ch.toUpperCase() === target;
    }
  }
  return false;
}
