# ADR 0011: Scattergories interactive letter die

## Status

Accepted

## Context

[ADR 0009](./0009-scattergories-and-game-shell.md) rolled the round letter server-side with `rollLetter()` on the classic 20-face set (no Q/U/V/X/Y/Z) and revealed it instantly in countdown. Family play wants a physical moment: someone spins a letter die, the living-room TV follows the toss, and the landed face is the round letter.

A true alphabet d26 would change scoring difficulty versus the classic game. Live mirroring needs pose fan-out without persisting every frame into Durable Object storage.

## Decision

- **Keep classic 20 letters** on a regular **icosahedron** (one face per `LETTER_DIE` letter).
- **New `rolling` phase** after host `start`: server picks a uniform random seated player as roller; letter and category list are not chosen yet.
- **Interactive WebGL die** on the roller’s phone (drag + flick). Settle in **≤5 seconds**; face whose outward normal is closest to world up is the result.
- **Live mirror:** roller sends throttled `diePose` quaternions; server rebroadcasts to all sockets (TV and other phones) without persistence. Remote clients render the same die read-only.
- **Commit:** roller `submitLetterRoll` with a letter in `LETTER_DIE`; server validates, `pickList`, sets letter, clears roller, enters countdown.
- **AFK fallback:** if no commit within **30 seconds**, server `rollLetter()` and continues into countdown so the round cannot stall.

## Consequences

- Phase order is `lobby → rolling → countdown → playing → review → results`.
- Letter selection is theatrical and player-driven but still server-validated; AFK keeps rooms moving.
- Pose traffic is ephemeral (not in room snapshots); late joiners during roll see the die at identity until the next pose.
- Cross-links: extends [0009](./0009-scattergories-and-game-shell.md).
