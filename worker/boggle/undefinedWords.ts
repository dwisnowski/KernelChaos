import { isDictionaryWord } from "./dictionary.ts";

export type UndefinedWordRow = {
  word: string;
  reportCount: number;
  firstSeenAt: number;
};

/** Record a Free Dictionary miss. Returns false if the word is not in our dictionary. */
export async function reportUndefinedWord(
  db: D1Database,
  rawWord: string,
): Promise<{ ok: true } | { ok: false; reason: "invalid" | "not_in_dictionary" }> {
  const word = rawWord.trim().toLowerCase();
  if (!word || !/^[a-z]+$/.test(word) || word.length < 3 || word.length > 10) {
    return { ok: false, reason: "invalid" };
  }
  if (!isDictionaryWord(word)) {
    return { ok: false, reason: "not_in_dictionary" };
  }

  const now = Date.now();
  await db
    .prepare(
      `INSERT INTO undefined_boggle_words (word, first_seen_at, report_count)
       VALUES (?, ?, 1)
       ON CONFLICT(word) DO UPDATE SET report_count = report_count + 1`,
    )
    .bind(word, now)
    .run();

  return { ok: true };
}

export async function listUndefinedWords(db: D1Database): Promise<UndefinedWordRow[]> {
  const { results } = await db
    .prepare(
      `SELECT word, report_count, first_seen_at
       FROM undefined_boggle_words
       ORDER BY word ASC`,
    )
    .all<{ word: string; report_count: number; first_seen_at: number }>();

  return (results ?? []).map((row) => ({
    word: row.word,
    reportCount: Number(row.report_count),
    firstSeenAt: Number(row.first_seen_at),
  }));
}
