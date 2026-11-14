CREATE TABLE active_rooms (
  code TEXT PRIMARY KEY NOT NULL,
  game TEXT NOT NULL,
  phase TEXT NOT NULL,
  player_count INTEGER NOT NULL,
  host_name TEXT,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_active_rooms_game_updated
  ON active_rooms(game, updated_at DESC);
