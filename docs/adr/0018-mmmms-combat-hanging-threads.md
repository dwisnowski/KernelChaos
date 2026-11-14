# ADR 0018: M&Ms Smash combat hanging threads + organize handles

## Status

Accepted (implemented: combat-phase dual hanging orb canvas; left action prompt + palette; `@dnd-kit` organize reorder with row handles).

## Context

After stacks lock ([ADR 0014](./0014-mmmms.md)), pick phases hid both stacks so the palette could fit ([ADR 0017](./0017-mmmms-guess-attack-ux.md)). That removed living-room presence of the duel stacks while players waited or chose colors. Resolve still used DOM lists for burst targeting. Organize reorder used a custom long-press drag that remained fiddly on touch ([ADR 0016](./0016-mmmms-organize-ux.md)).

Combat no longer needs stack rearrangement, so a canvas can carry richer FX without drag/scroll conflicts. Organize still needs a reliable list reorder.

## Decision

- **Combat phone layout (`guess` / `attack` / `resolving`):** Split stage — left action pane (role prompt + select-then-submit palette when active, or waiting copy); right pane is a full-height canvas of **two hanging orb threads** linked by golden silk. Rightmost thread = player’s colored orbs; leftmost = opponent’s anonymous (hidden-color) orbs. Right pane width ≈ **1/4** viewport under ~768px, **1/3** on larger screens.
- **Motion:** Canvas orbs shimmer and sway gently. Phone/desktop pointer position biases sway; mobile `DeviceMotion` (when permitted) adds tilt. Respect `prefers-reduced-motion` by damping/stopping sway. Burst overlay still paints explosions; centers come from the canvas layout API (not DOM beads).
- **Organize:** Keep a scrollable list UI. Replace custom long-press DnD with **`@dnd-kit`** sortable rows and an explicit **row drag handle** so scroll and reorder no longer fight. Hint copy updates to “drag the handle.”
- **TV:** Dual hanging threads (both anonymous / count-only), no device tilt; resolve bursts target the defender thread via the same canvas center API.
- **Server / secrecy:** Unchanged — opponent colors never leave the Durable Object.

## Consequences

- ADR 0017’s “hide both stacks during pick phases” is superseded for phone combat layout; select-then-submit and outcome overlays remain.
- ADR 0016’s long-press ghost drag is superseded for organize; solo board and scrollable full stack remain.
- New UI: `HangingOrbThreads` (+ CSS); `OrbList` uses `@dnd-kit`; `MmmmsRoom` / `MmmmsSpectator` combat stages restructured.
- Cross-links: extends [0014](./0014-mmmms.md), [0016](./0016-mmmms-organize-ux.md), [0017](./0017-mmmms-guess-attack-ux.md); SFX [0015](./0015-mmmms-sfx.md).
