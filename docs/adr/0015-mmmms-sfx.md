# ADR 0015: M&Ms Smash Web Audio cues

## Status

Accepted (implemented: synthesized `playMmmms*` helpers in shared `sfx.ts`; phone + TV wired to phase edges and resolve steps).

## Context

[ADR 0014](./0014-mmmms.md) shipped M&Ms Smash with canvas particle bursts and the shared game-shell Web Audio mute/unlock path, but the client only reused generic cues: `playRoundEnd` when explosions started and `playWinner` on results. Per-step explode/halt animation had no sound, and `playRoundEnd` was a semantic mismatch for a smash sting.

## Decision

- Keep all M&Ms cues as **synthesized oscillators** in [`src/audio/sfx.ts`](../../src/audio/sfx.ts) (no sample files), alongside Boggle/Scatter helpers and the shared mute key.
- Dedicated helpers: `playMmmmsDeal` (lobby → organize), `playMmmmsLock` / `playMmmmsGuess` (local actions), `playMmmmsSmash` (enter resolving), `playMmmmsExplode(stepIndex)` / `playMmmmsHalt` (each resolve step, synced with the 220ms burst loop), `playMmmmsDefeat` (local loss).
- Reuse `playWinner` for local win and TV results; phone plays `playMmmmsDefeat` when the local seat is not the winner.
- Do not add drag-reorder ticks (too noisy at 12–30 orbs).

## Consequences

- Phone and TV stay on the same resolve beat as the particle overlay.
- M&Ms no longer misuses `playRoundEnd` for attack resolve.
- Cross-links: extends [0014](./0014-mmmms.md), [0009](./0009-scattergories-and-game-shell.md) (shared SFX shell).
- Code anchors: `src/audio/sfx.ts`, `src/pages/MmmmsRoom.tsx`, `src/pages/MmmmsSpectator.tsx`.
