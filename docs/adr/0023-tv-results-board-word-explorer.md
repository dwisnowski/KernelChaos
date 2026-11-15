# ADR 0023: TV results board word explorer

## Status

Accepted

## Context

TV results already show how many dictionary words were on the board by length (`possibleByLength`, ADR 0008) and a capped missed-word cloud (ADR 0004). Families often doubt the totals — they want the board still visible and a way to prove each word was really there by tracing it on the tiles.

## Decision

- At results finalize, publish the full sorted **`possibleWords`** list (same solve pass as coverage), not only counts and capped misses.
- TV results keep the **Boggle board** on screen. Length bars are selectable: choosing a bucket lists every possible word of that length. Selecting a word highlights **one valid path** on the board (client-side path find; server stays authoritative for the word list) and shows a short **definition** under the board (client fetch from Free Dictionary API; not stored on the server).
- The missed-word cloud is replaced by this board + length explorer on TV.

## Consequences

- WebSocket results payloads grow with the full board word list (dense 6×6 boards can be large); acceptable for a one-shot results broadcast.
- Definition lookup depends on a third-party HTTP API and may be missing or fail offline; the path highlight still works without it.
- Extends ADR 0008; phone results unchanged.
- Code anchors: `worker/boggle/solver.ts`, `worker/room.ts`, `src/lib/findWordPath.ts`, `src/lib/wordDefinition.ts`, `src/hooks/useWordDefinition.ts`, `src/components/BoggleBoard.tsx`, `src/components/WordLengthPossibleBars.tsx`, `src/pages/BoggleSpectator.tsx`.
