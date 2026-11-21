# ADR 0033: Spot It (`spot-it`)

## Status

Accepted (implemented: polymorphic `GameRoom` `spot-it` type, Shared + Tower modes, order-7 deck, Funny Foods pack).

## Context

KernelChaos already ships Boggle, Scattergories (including Picture Hunt), M&Ms Smash, and Spot the Difference through a shared phone+TV shell ([ADR 0009](./0009-scattergories-and-game-shell.md)). Families want the classic **Spot It!** / Dobble race: any two cards share exactly one symbol; players race to spot it.

This must not be confused with **Spot the Difference** (`spotdiff`, [ADR 0029](./0029-spot-the-difference.md)), which compares paired A/B scenes for edits.

Digital play removes physical-card constraints, so symbol art can be generated assets placed on on-screen cards with randomized rotation, scale, and position. Multiple phones enable a many-player race that classic table play cannot host cleanly.

## Decision

- **Shell:** New game type `spot-it` (display **Spot It**) — `/spot-it` entry, `/spot-it/room/:code`, `/spot-it/room/:code/tv`; QR / 4-char codes; Web Audio; no accounts; server-authoritative deals, taps, and scores.
- **Deck:** Finite projective plane of order 7 — 57 symbols, 8 per card, 57 cards. Any two cards share exactly one symbol.
- **Modes (lobby):**
  - `shared` — Same two cards for every seat (+ TV). Race to tap the shared symbol.
  - `tower` — Shared center card + each player’s own card. First correct match scores; winner takes the center as their new hand card; next center after intermission.
  - `learning` — Shared two-card deal + English meaning quiz after a correct kana tap ([ADR 0037](./0037-spot-it-kana-learning.md)).
- **Win:** First to lobby target `10 | 25 | 50 | 75` (default 25). Start with ≥1 seat; no player cap.
- **Phases:** `lobby` → `playing` → (`quiz` when learning) → `between` (3s) → `playing` … → `results`.
- **Packs:** Lobby-selectable symbol packs; v1 ships `food` (funny anthropomorphic food characters under `public/spot-it/food/`). Asset masters vs 192² game rasters and 4-up Magnific processing: [ADR 0034](./0034-spot-it-assets-and-card-ux.md). Packs `kawaii` ([ADR 0035](./0035-spot-it-kawaii-animals-pack.md)), `cyber` ([ADR 0036](./0036-spot-it-cyber-vehicles-pack.md)), and kana `kana-restaurant` ([ADR 0037](./0037-spot-it-kana-learning.md); Unicode glyphs, not Magnific).
- **Layouts:** Server seeds per-card placements (position / rotate / scale) so phone and TV match.
- **Taps:** Client sends `tapSymbol { symbolId }`; server validates the authoritative match for that seat. Wrong taps get a short private lock; first correct tap of the round scores.
- **TV:** Leaderboard toward target, mode, last scorer, live cards (shared pair, or center-only during Tower play), lobby QR.

## Consequences

- `GameType` / active-room unions grow to include `"spot-it"`.
- Domain lives under `worker/spot-it/`; `GameRoom` only dispatches.
- Distinct routes and CSS from `spotdiff` avoid naming collisions.
- Future packs plug into the same pack registry without changing deal/tap protocol.
- Cross-links: extends [0009](./0009-scattergories-and-game-shell.md), [0003](./0003-tv-spectator-screen.md), [0007](./0007-spectator-room-entry.md). Asset/card UX follow-up: [0034](./0034-spot-it-assets-and-card-ux.md). Distinct from [0029](./0029-spot-the-difference.md).
