# ADR 0044: Trivia Chaos Dash + powers

## Status

Accepted (implemented with Trivia `chaosMode` lobby pills, Chaos Dash earn loop, Light/Mayhem power set).

## Context

Trivia ([ADR 0043](./0043-trivia.md)) is a classic-full quiz show. Non-answering players need something to do while a contestant faces A–H, and KernelChaos wants mischievous living-room “chaos” without breaking server-authoritative scoring.

## Decision

- **Lobby:** `chaosMode: off | light | mayhem` (default `light`). `off` is pure classic.
- **Earn:** On normal (non–Daily Double, non-Final) `answering`, eligible seats race a **Chaos Dash** mini-game (`worker/trivia/chaosDash.ts`). First correct `solveChaos` gains one generic charge (cap 1 Light / 2 Mayhem). `chaosWinSeq` drives SFX/TV toast.
- **Spend:** `useChaos` with a power id when legal for the current phase. Light: fake buzz, buzz jam, blindfold, cheer/boo, party tax. Mayhem adds screen zap, trap, steal buzz, pot siphon, swap stakes, challenge, hot seat, alliance, spotlight, hint tax, phone a friend.
- **TV/phone:** Charge pips on the score rail; power outcome via `lastOutcome`; dash UI only on non-answerer phones.

## Consequences

- Extends [0043](./0043-trivia.md). Pack content unchanged.
- Power effects stay small and reversible; trivia skill still dominates scores.
