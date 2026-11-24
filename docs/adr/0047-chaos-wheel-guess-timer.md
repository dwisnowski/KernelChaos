# ADR 0047: Chaos Wheel guess timer (drop Mirror / Lose Turn / Speed)

## Status

Accepted (implemented: 10s per-guess alarm; Mirror / Lose Turn / Speed wedges removed).

## Context

ADR 0040 put Mirror, Lose a Turn, and Speed Call on the wheel. Speed’s 8s consonant alarm was the only timed guess. Family play wanted less obscure specials and a consistent clock on every letter/solve attempt.

## Decision

- Remove `mirror`, `loseTurn`, and `speed` wedges (replace with cash slices so the wheel stays dense).
- Every consonant, vowel, and solve phase arms a **10s** server alarm (`WHEEL_GUESS_MS`). Public state uses `guessEndsAt`.
- On timeout: outcome `guessTimeout`, Free Spin may cancel, else seat advances. Clients play a double beep (`playWheelGuessTimeout`).
- Spin / action choice (Spin · Buy vowel · Solve) is untimed; the clock starts when the player enters a guess phase.

## Consequences

- Extends [ADR 0040](./0040-chaos-wheel-special-wedges.md); wedge table remains in `worker/wheel/wheel.ts`.
- Durable Object persistence accepts legacy `wheelSpeedEndsAt` on load and writes `wheelGuessEndsAt`.
- Phone + TV show the countdown while `guessEndsAt` is set.
