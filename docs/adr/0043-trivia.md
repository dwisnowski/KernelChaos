# ADR 0043: Trivia (`trivia`)

## Status

Accepted (implemented: polymorphic `GameRoom` `trivia` type, classic-full Single/Double/Final, buzzers + A–H, Daily Double show beat, original family pack).

## Context

KernelChaos ships living-room games through a shared phone + TV shell ([ADR 0009](./0009-scattergories-and-game-shell.md)). Families want a Jeopardy-shaped quiz show: category board on the TV, phones as buzzers and answer pads, Single then Double rounds, Daily Doubles, and Final.

Jeopardy! branding and official clues are copyrighted. KernelChaos already avoids branded clones ([ADR 0039](./0039-chaos-wheel.md)). Answers are multiple-choice (A–H) with convincing distractors so scoring stays server-authoritative without free-text judging.

## Decision

- **Shell:** Game type `trivia` (display **Trivia**) — `/trivia` entry, `/trivia/room/:code`, `/trivia/room/:code/tv`; QR / 4-char codes; Web Audio; no accounts; server-authoritative board, buzz, scores.
- **Lobby:** Pack picker (originally `family`; audience + themed packs in [ADR 0046](./0046-trivia-audience-packs.md)); start requires ≥2 seats. Chaos mode pills arrive in [ADR 0044](./0044-trivia-chaos.md).
- **Phases:** `lobby` → `board` → `clue` → (`dailyWager` |) `buzzOpen` → `answering` → `reveal` → … → `between` (Double) → … → `finalCategory` → `finalWager` → `finalAnswer` → `results`.
- **Boards:** 6×5 Single (`200–1000`) then Double (`400–2000`). Correct player picks next; wrong subtracts value and locks that player out of the clue; buzz reopens. One hidden Daily Double per board; selector-only wager then A–H.
- **Buzz:** First valid buzz stamps `buzzedPlayerId` and bumps `buzzLockSeq` for phone flash + SFX + TV score-rail glow. Fair open timing via `buzzOpenAt`: [ADR 0048](./0048-trivia-buzz-sync.md).
- **Choices:** Eight shuffled options when a clue opens; `correctIndex` never broadcast until reveal.
- **Final:** Category teaser → everyone wagers → simultaneous A–H → results (ties = co-winners). Negative scores allowed.
- **Content:** Original family pack under `worker/trivia/`.
- **TV:** Show stage — live scores, oversized board/clue, Daily Double full-bleed reveal ([ADR 0003](./0003-tv-spectator-screen.md), [ADR 0007](./0007-spectator-room-entry.md)).

## Consequences

- `GameType` / active-room unions include `"trivia"`.
- Domain lives under `worker/trivia/`; `GameRoom` dispatches.
- Chaos Dash + spendable powers: [ADR 0044](./0044-trivia-chaos.md).
- Synchronized buzzer arm: [ADR 0048](./0048-trivia-buzz-sync.md).
- Cross-links: extends [0009](./0009-scattergories-and-game-shell.md), [0003](./0003-tv-spectator-screen.md), [0007](./0007-spectator-room-entry.md).
