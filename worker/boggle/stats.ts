export interface NamedRecord {
  value: string | number;
  name: string;
  date: string;
}

export interface BoggleStats {
  gamesPlayed: number;
  totalWords: number;
  averageWordsPerGame: number | null;
  longestWord: NamedRecord | null;
  highestScore: NamedRecord | null;
  mostWords: NamedRecord | null;
}

function utcDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export async function fetchBoggleStats(db: D1Database): Promise<BoggleStats> {
  const [agg, longest, highest, mostWords] = await Promise.all([
    db
      .prepare(
        `SELECT COUNT(*) AS games, COALESCE(SUM(total_words), 0) AS words
         FROM completed_rounds`,
      )
      .first<{ games: number; words: number }>(),
    db
      .prepare(
        `SELECT p.longest_word AS word, p.player_name AS name, r.completed_at AS completed_at
         FROM player_round_stats p
         JOIN completed_rounds r
           ON r.room_code = p.room_code AND r.round = p.round
         WHERE p.longest_len > 0
         ORDER BY p.longest_len DESC, p.longest_word ASC, r.completed_at ASC
         LIMIT 1`,
      )
      .first<{ word: string; name: string; completed_at: number }>(),
    db
      .prepare(
        `SELECT p.score AS score, p.player_name AS name, r.completed_at AS completed_at
         FROM player_round_stats p
         JOIN completed_rounds r
           ON r.room_code = p.room_code AND r.round = p.round
         ORDER BY p.score DESC, r.completed_at ASC
         LIMIT 1`,
      )
      .first<{ score: number; name: string; completed_at: number }>(),
    db
      .prepare(
        `SELECT p.word_count AS word_count, p.player_name AS name, r.completed_at AS completed_at
         FROM player_round_stats p
         JOIN completed_rounds r
           ON r.room_code = p.room_code AND r.round = p.round
         ORDER BY p.word_count DESC, r.completed_at ASC
         LIMIT 1`,
      )
      .first<{ word_count: number; name: string; completed_at: number }>(),
  ]);

  const gamesPlayed = Number(agg?.games ?? 0);
  const totalWords = Number(agg?.words ?? 0);

  return {
    gamesPlayed,
    totalWords,
    averageWordsPerGame: gamesPlayed > 0 ? totalWords / gamesPlayed : null,
    longestWord:
      longest && longest.word
        ? { value: longest.word, name: longest.name, date: utcDate(longest.completed_at) }
        : null,
    highestScore:
      highest && highest.score > 0
        ? { value: highest.score, name: highest.name, date: utcDate(highest.completed_at) }
        : null,
    mostWords:
      mostWords && mostWords.word_count > 0
        ? {
            value: mostWords.word_count,
            name: mostWords.name,
            date: utcDate(mostWords.completed_at),
          }
        : null,
  };
}

export interface PlayerStatInput {
  id: string;
  name: string;
  score: number;
  wordCount: number;
  longestWord: string;
  longestLen: number;
}

export async function insertRoundStats(
  db: D1Database,
  input: {
    roomCode: string;
    round: number;
    completedAt: number;
    players: PlayerStatInput[];
  },
): Promise<void> {
  const totalWords = input.players.reduce((sum, p) => sum + p.wordCount, 0);
  const stmts: D1PreparedStatement[] = [
    db
      .prepare(
        `INSERT OR IGNORE INTO completed_rounds
         (room_code, round, completed_at, player_count, total_words)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(
        input.roomCode,
        input.round,
        input.completedAt,
        input.players.length,
        totalWords,
      ),
  ];

  for (const p of input.players) {
    stmts.push(
      db
        .prepare(
          `INSERT OR IGNORE INTO player_round_stats
           (room_code, round, player_id, player_name, score, word_count, longest_word, longest_len)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          input.roomCode,
          input.round,
          p.id,
          p.name,
          p.score,
          p.wordCount,
          p.longestWord,
          p.longestLen,
        ),
    );
  }

  await db.batch(stmts);
}

export function longestAcceptedWord(words: Iterable<string>): { word: string; len: number } {
  let best = "";
  let bestLen = 0;
  for (const word of words) {
    const len = word.length;
    if (len > bestLen || (len === bestLen && word < best)) {
      best = word;
      bestLen = len;
    }
  }
  return { word: best, len: bestLen };
}
