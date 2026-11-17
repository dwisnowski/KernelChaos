# ADR 0029: Spot the Difference (procedural)

## Status

Accepted (implemented: polymorphic `GameRoom` `spotdiff` type, race/coop/solo modes, procedural SVG panel pairs).

## Context

KernelChaos already supports Boggle, Scattergories (including Picture Hunt), and M&Ms Smash through a shared phone+TV shell and a polymorphic Durable Object ([ADR 0009](./0009-scattergories-and-game-shell.md)). Picture Hunt uses a single dense scene image ([ADR 0019](./0019-scattergories-picture-hunt.md)); Spot the Difference needs **paired** panels and authoritative region hits.

Hand-authored PNG A/B pairs are heavy for a feel-test. A procedural SVG graph (one base prop list, edits only on panel B) keeps every unchanged pixel identical and ships without photo assets.

## Decision

- **Shell:** New game type `spotdiff` (display **Spot the Difference**) — `/spotdiff` entry, `/spotdiff/room/:code`, `/spotdiff/room/:code/tv`; QR / 4-char codes; Web Audio; no accounts; server-authoritative clock, hits, and scores.
- **Modes (lobby):** `race` | `coop` | `solo`.
  - `solo`: Start with ≥1 seat; private finds; personal results.
  - `race`: ≥1 seats; private `foundDiffIds` per seat; first to clear all wins early, else most found when the timer ends (ties allowed).
  - `coop`: ≥1 seats; shared finds; anyone’s correct tap marks for the room; ends when all found or timer.
- **Phases:** `lobby` → `countdown` → `playing` → `results`.
- **Lobby options:** timer `60 | 90 | 120` (default 90); difference count `3 | 5 | 7` (default 5). Scene clutter difficulty is [ADR 0030](./0030-spotdiff-scene-difficulty.md).
- **Puzzle:** Server picks a template (`kitchen` | `toyshelf` | `park`), seeds prop placement, clones panel A → B, applies mixed edits (`remove`, `recolor`, `flip`, `resize`, `swapShape`) with quadrant spread and one near-center hook. Clients render the published SVG graphs; taps send normalized `{ x, y }` on a panel; server point-in-box validates.
- **Miss / hint:** Three misses lock that seat’s input ~1.5s. Hint outlines one unfound box ~2s (private in race/solo; room-wide in coop).
- **TV:** Dual panels; race shows per-player counts without marking private finds until results; coop mirrors shared marks.

## Consequences

- `GameType` / active-room unions grow to include `"spotdiff"`.
- Domain lives under `worker/spotdiff/`; `GameRoom` only dispatches.
- Procedural art is a feel-test; curated A/B image pairs can replace templates later without changing the tap/hit protocol.
- Cross-links: extends [0009](./0009-scattergories-and-game-shell.md), [0003](./0003-tv-spectator-screen.md), [0007](./0007-spectator-room-entry.md). Distinct from Hunt ([0019](./0019-scattergories-picture-hunt.md)).
