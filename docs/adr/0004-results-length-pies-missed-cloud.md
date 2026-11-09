# ADR 0004: Results length pies and missed-word cloud

## Status

Accepted

## Context

After a round, phones already list each player’s scored words, and the TV stays score-blind (ADR 0003). Families still want a quick sense of *how* each player scored words (short vs long) and a living-room reveal of words that were on the board but nobody found. Computing that reveal requires a full dictionary solve of the current board; neither phones nor the TV should invent their own word lists.

## Decision

- At results finalize, the Durable Object runs a **prefix-trie board solver** against the Enable1 dictionary and publishes `RoomState.missedWords`: dictionary words on the board that no player found, sorted longest-first and **capped** (~120) for the WebSocket payload.
- Phone and TV results show a per-player **SVG donut** of word counts by length (total in the center; slice labels for each length bucket). Point totals on the TV results chrome are specified in [ADR 0005](./0005-tv-post-game-scores.md).
- The TV results layout puts a **missed-word cloud** in the side panel: spiral/AABB placement sized by word length, deterministic palette colors, accessible list fallback.

## Consequences

- Extends ADR 0003’s score-blind TV guarantee for length breakdowns and missed words. Winners/points on TV results are covered by [ADR 0005](./0005-tv-post-game-scores.md) (supersedes the phone-only scores note).
- First results broadcast after a round may spend tens–hundreds of ms building/using the cached trie; the trie is process-cached after the first solve.
- Dense 6×6 boards can exceed the missed-word cap; the cloud shows the longest misses, not necessarily every miss.
- Code anchors: `worker/boggle/solver.ts`, `worker/room.ts`, `src/components/WordLengthPie.tsx`, `src/components/MissedWordCloud.tsx`, `src/pages/BoggleSpectator.tsx`, `src/pages/BoggleRoom.tsx`.
