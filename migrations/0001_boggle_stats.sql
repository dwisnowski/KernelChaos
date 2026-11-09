CREATE TABLE completed_rounds (
  room_code TEXT NOT NULL,
  round INTEGER NOT NULL,
  completed_at INTEGER NOT NULL,
  player_count INTEGER NOT NULL,
  total_words INTEGER NOT NULL,
  PRIMARY KEY (room_code, round)
);

CREATE TABLE player_round_stats (
  room_code TEXT NOT NULL,
  round INTEGER NOT NULL,
  player_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  word_count INTEGER NOT NULL,
  longest_word TEXT NOT NULL,
  longest_len INTEGER NOT NULL,
  PRIMARY KEY (room_code, round, player_id)
);

CREATE INDEX idx_prs_score ON player_round_stats(score DESC);
CREATE INDEX idx_prs_longest ON player_round_stats(longest_len DESC);
CREATE INDEX idx_prs_words ON player_round_stats(word_count DESC);
