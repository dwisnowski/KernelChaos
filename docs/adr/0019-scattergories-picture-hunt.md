# ADR 0019: Scattergories Picture Hunt mode

## Status

Accepted

## Context

Scattergories today is category-list play: twelve prompts, free-text answers, then peer In/Out review ([ADR 0009](./0009-scattergories-and-game-shell.md), [ADR 0010](./0010-scattergories-review-voting.md)) with a shared letter die ([ADR 0011](./0011-scattergories-letter-die-roll.md)). Families also enjoy dense “find it in the picture” games. That loop needs a different play surface (one scene image, growable finds) and different scoring (curated synonyms, not debate), but the same room shell, timers, and letter roll.

A separate top-level `GameType` would duplicate lobby/QR/TV wiring. Overloading pack tiers would confuse category content with scene catalogs.

## Decision

- **Lobby play mode** on Scattergories rooms: `categories` (default, existing flow) or `hunt` (Picture Hunt). Host toggles in lobby; not a new `GameType`.
- **Timers** stay `120 | 150 | 180` seconds for both modes.
- **Letter die / rolling / countdown** stay shared. Hunt skips **review**: `playing` → `results`.
- **Scene catalog** under `worker/scattergories/hunt/` with static images in `public/hunt/`. Each scene lists objects with synonym `names`. Host may pick a scene or leave random; server tracks `usedSceneIds` like category `usedListIds`.
- **Scoring:** normalize submissions; match against synonyms that start with the round letter; uniqueness by **object id** across players (synonym collisions cancel); 1 point per unique matched object; unknown / wrong letter / empty → 0. Cap submissions (40) per player.
- **UI:** phone shows scene + letter + free-text find list; TV shows scene + letter + find counts (answer-blind) then results. Category pack controls hide in hunt mode.

## Consequences

- `ScatterRoomState` gains `playMode`, `sceneId`, `sceneImageUrl`, and hunt-aware results; category fields remain null during hunt rounds.
- Pack-tier messages are no-ops while `playMode === "hunt"`.
- Authoring cost moves to scene synonym keys instead of peer review UX for this mode.
- Cross-links: extends [0009](./0009-scattergories-and-game-shell.md), [0010](./0010-scattergories-review-voting.md), [0011](./0011-scattergories-letter-die-roll.md).
