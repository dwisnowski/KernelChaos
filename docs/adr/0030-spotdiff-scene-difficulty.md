# ADR 0030: Spot the Difference scene difficulty

## Status

Accepted (implemented: lobby Difficulty pills; clutter slots gated by `minDifficulty`).

## Context

[ADR 0029](./0029-spot-the-difference.md) shipped procedural Spot the Difference with lobby timer and difference count. Scene density was fixed per template: every authored slot always appeared on both panels. Families wanted denser “harder to scan” scenes without tying that to difference count or edit subtlety.

## Decision

- Add lobby **Difficulty** `easy` | `medium` | `hard` (default **`easy`**), host-only in lobby/results, independent of mode / timer / diff count.
- Difficulty controls **scene clutter only**: templates keep current slots as the easy baseline; additional slots carry `minDifficulty: "medium" | "hard"` and are filled only when the room difficulty meets that floor (easy ⊂ medium ⊂ hard).
- Diffs are still chosen with the existing quadrant-spread rules, but only from the **active** slot pool for that difficulty.
- Edit kinds, hit padding, and difference count stay unchanged.

## Consequences

- Protocol / client types grow `difficulty` + `setSpotDifficulty`; `GameRoom` persists and passes it into `generatePuzzle`.
- Template authoring in `worker/spotdiff/scenes.ts` can add denser clutter without redesigning easy scenes.
- Cross-links: extends [0029](./0029-spot-the-difference.md).
