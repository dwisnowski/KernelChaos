# ADR 0008: Results word coverage bars

## Status

Accepted

## Context

ADR 0004 publishes a capped `missedWords` list and per-player length donuts of words found. Families also want to know how complete a round was — each player’s found count against the full board dictionary, and how those finds break down by length versus what was possible. The missed-word cap (~120) means clients cannot reconstruct the true board total from `missedWords` alone.

## Decision

- At results finalize, the same board solve that builds missed words also publishes **`possibleWordCount`** (all unique dictionary words on the board, length ≥ 3) and **`possibleByLength`** (counts for buckets 3, 4, 5, 6, 7, 8+).
- Phone results replace the per-player length pie with **horizontal found-vs-possible bars** per length bucket, and show **`found / possible`** next to each player’s score.
- TV results keep per-player length pies and the missed-word cloud, and add a board-wide **vertical bar chart of possible words by length**, plus **`n / possible`** on the scoreboard.

## Consequences

- Extends ADR 0004’s solver path; one `findAllWords` pass still drives misses and coverage.
- WebSocket payload grows by a small fixed-size length histogram (not the full word list).
- Dense boards remain accurate for totals even when the missed-word cloud is truncated.
- Code anchors: `worker/boggle/solver.ts` (`computeBoardCoverage`), `worker/room.ts`, `src/components/WordLengthCoverageBars.tsx`, `src/components/WordLengthPossibleBars.tsx`, `src/pages/BoggleRoom.tsx`, `src/pages/BoggleSpectator.tsx`.
