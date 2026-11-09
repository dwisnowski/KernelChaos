# ADR 0006: Boggle global stats (D1 hall of fame)

## Status

Accepted

## Context

The Boggle entry page (`/boggle`) only offered create/join. Families wanted a lightweight hall of fame — games played, longest word, averages, high scores — across all rooms. Room Durable Objects hold only current-round state and cannot answer cross-room questions. Players remain display names only (ADR 0001); there are no accounts.

## Decision

- Add a Cloudflare **D1** database (`STATS_DB` / `kernelchaos-stats`) for site-wide Boggle aggregates.
- On round end in `GameRoom.alarm()`, after `finalizeScores()`, write an idempotent snapshot (`completed_rounds` + `player_round_stats`) keyed by `(room_code, round)`. Write failures must not block results UI.
- Expose `GET /api/boggle/stats` with games played, total words, average words per game, longest word, highest score, and most words in a game. Named records show **display name + UTC date**.
- Render a “Hall of fame” section on the Boggle entry page. Empty until the first completed round after deploy (no backfill).

## Consequences

- Extends ADR 0001’s storage model beyond per-room Durable Objects without introducing accounts.
- Name collisions are accepted; records are not identity-verified.
- Alarm retries stay safe via `INSERT OR IGNORE`. Stats start at zero for existing historical play.
- Code anchors: `migrations/0001_boggle_stats.sql`, `worker/boggle/stats.ts`, `worker/room.ts`, `worker/index.ts`, `src/components/BoggleStats.tsx`, `src/pages/BoggleEntry.tsx`.
