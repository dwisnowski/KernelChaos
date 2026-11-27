# ADR 0044: Trivia Chaos Dash + powers

## Status

Accepted (amended: culled low-fun powers after playtest).

## Context

Trivia ([ADR 0043](./0043-trivia.md)) is a classic-full quiz show. Non-answering players need something to do while a contestant faces A–H, and KernelChaos wants mischievous living-room “chaos” without breaking server-authoritative scoring.

A friend playtest found Fake buzz, Cheer/boo, Screen zap, Challenge, Hot seat, and Phone a friend not fun enough to keep in the tray.

## Decision

- **Lobby:** `chaosMode: off | light | mayhem` (default `light`). `off` is pure classic.
- **Earn:** On normal (non–Daily Double, non-Final) `answering`, eligible seats race a **Chaos Dash** mini-game (`worker/trivia/chaosDash.ts`). First correct `solveChaos` gains one generic charge (cap 1 Light / 2 Mayhem). `chaosWinSeq` drives SFX/TV toast.
- **Spend:** `useChaos` with a power id when legal for the current phase.
  - **Light:** buzz jam, blindfold, party tax.
  - **Mayhem adds:** trap answer, steal buzz, pot siphon, swap stakes, alliance, spotlight, hint tax.
- **TV/phone:** Charge pips on the score rail; power outcome via `lastOutcome`; dash UI only on non-answerer phones.

## Consequences

- Extends [0043](./0043-trivia.md). Pack content unchanged.
- Smaller power set keeps the tray scannable; scoring hooks for cheer meters, too-easy votes, and phone-friend polling are gone.
- Power effects stay small and reversible; trivia skill still dominates scores.
