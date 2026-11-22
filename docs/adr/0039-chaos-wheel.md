# ADR 0039: Chaos Wheel (`wheel`)

## Status

Accepted (implemented: polymorphic `GameRoom` `wheel` type, full puzzle show, Canvas 2D + anime.js wheel, original family puzzles).

## Context

KernelChaos ships living-room games through a shared phone + TV shell ([ADR 0009](./0009-scattergories-and-game-shell.md)). Families want a Wheel-of-Fortune–style show: spin for cash, guess letters, buy vowels, and solve a phrase — with a big spectator screen.

Hasbro / “Wheel of Fortune” branding and official puzzles are copyrighted. WebGL is unreliable in some Chrome GPU fallbacks ([ADR 0011](./0011-scattergories-letter-die-roll.md)). The Wild Idea Zone hub hero uses Canvas 2D + anime.js particles, already echoed lightly by M&Ms bursts ([ADR 0014](./0014-mmmms.md)).

## Decision

- **Shell:** Game type `wheel` (display **Chaos Wheel**) — `/wheel` entry, `/wheel/room/:code`, `/wheel/room/:code/tv`; QR / 4-char codes; Web Audio; no accounts; server-authoritative spin, letters, and scores.
- **Lobby:** Host picks rounds `3 | 5 | 7` (default 3). Start requires ≥2 seated players.
- **Phases:** `lobby` → `playing` → `between` → `playing` … → `results`. Inside `playing`, `turnPhase`: `spin` | `spinning` | `consonant` | `action` | `vowel` | `solve`.
- **Wheel:** Fixed wedge table (cash, Bankrupt, Lose a Turn, Free Spin). Server RNG picks wedge + `targetAngle` / `endsAt`; all clients animate with **Canvas 2D + anime.js** to the same settle. Free Spin grants a token only, then returns to the action menu. Free Spin tokens cancel one Lose a Turn.
- **Puzzle:** Original family pack under `worker/wheel/puzzles.ts`. Public state shows masked `display[]` + category; never the raw answer until reveal / solve.
- **Economy:** Correct consonant → cash × count into round bank; buy vowel costs 250 from round bank; correct solve banks round into total; Bankrupt clears round bank.
- **TV:** Oversized board + wheel + scores; no letter controls ([ADR 0003](./0003-tv-spectator-screen.md), [ADR 0007](./0007-spectator-room-entry.md)).

## Consequences

- `GameType` / active-room unions include `"wheel"`.
- Domain lives under `worker/wheel/`; `GameRoom` only dispatches.
- Adds `animejs` dependency for wheel choreography (WIZ-aligned; not used for Morse/glyph scenes).
- Special-wedge set and jackpot/speed/insurance are recorded in [ADR 0040](./0040-chaos-wheel-special-wedges.md).
- Cross-links: extends [0009](./0009-scattergories-and-game-shell.md), [0003](./0003-tv-spectator-screen.md), [0007](./0007-spectator-room-entry.md); spin sync pattern related to [0011](./0011-scattergories-letter-die-roll.md) / [0014](./0014-mmmms.md).
