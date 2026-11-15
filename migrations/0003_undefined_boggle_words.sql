CREATE TABLE undefined_boggle_words (
  word TEXT PRIMARY KEY NOT NULL,
  first_seen_at INTEGER NOT NULL,
  report_count INTEGER NOT NULL DEFAULT 1
);
