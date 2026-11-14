# ADR 0017: M&Ms Smash guess/attack phone + TV UX

## Status

Accepted (implemented: pick-phase palette-only layout, select-then-submit, role-specific resolve boards, Blocked / Go Fish overlays on phone and TV, `colorInStack` on `lastAttack`).

## Context

After organize ([ADR 0016](./0016-mmmms-organize-ux.md)), the duel returns to a two-board phone layout for `guess` and `attack`. With tall stacks plus the color palette, active players scrolled heavily to reach swatches. Palette taps also auto-submitted, so mis-taps were final. Resolve already animated explosions, but clients could not tell a full wipe caused by a missing attack color (“go fish”) from a path that happened to clear the stack, and a successful defender halt had no strong living-room cue.

Server turn order stays sequential ([ADR 0014](./0014-mmmms.md)): defender guesses, then attacker picks.

## Decision

- **Sequential turns, palette-first pick UI:** Keep `guess` → `attack`. During those phases the phone **hides both stacks**. The active seat sees only a color palette with select-then-**Submit**; the waiting seat sees short centered waiting copy. HUD counts remain.
- **Resolve boards by role:** On `resolving`, the defender sees only their own stack (existing reconstruct + vanish FX); the attacker sees only the opponent’s count-only `HiddenOrbStack`.
- **Outcome overlays (phone + TV):** Short scale/fade overlays over the stage while bursts still run.
  - **Attack blocked!** when `guessCorrect` and at least one `halt` step (defender phone + TV).
  - **Go Fish!** when the attack color was absent from the defender stack (attacker phone + TV).
- **`colorInStack` on `lastAttack`:** `resolveAttack` reports whether the color was present; public state carries the flag so clients can show Go Fish without leaking the full stack.

## Consequences

- Phone layout for pick/resolve lives in `MmmmsRoom`; shared overlay in `MmmmsOutcomeOverlay`; TV mirrors outcomes in `MmmmsSpectator`.
- ADR 0016’s “two-board from guess onward” is superseded for pick phases; organize solo board is unchanged.
- Cross-links: extends [0014](./0014-mmmms.md), [0016](./0016-mmmms-organize-ux.md); SFX still [0015](./0015-mmmms-sfx.md).
