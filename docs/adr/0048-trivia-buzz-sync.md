# ADR 0048: Trivia synchronized buzzer enable

## Status

Accepted (implemented: `buzzOpenAt` wall-clock arm; phones render early, server rejects early buzzes).

## Context

Trivia first-buzz is server-authoritative ([ADR 0043](./0043-trivia.md)): the Durable Object accepts the first valid `{ type: "buzz" }` after `phase === "buzzOpen"`. Clients only mounted the buzzer when they received that phase over WebSocket. Delivery order meant some phones could tap sooner than others — especially after wrong-answer reopen, which broadcast `buzzOpen` with no grace.

## Decision

- Add `buzzOpenAt` (unix ms) to trivia room state.
- On non–Daily Double clue reveal, set `buzzOpenAt = endsAt` (same instant as the `clueToBuzz` alarm). Phones show a disabled BUZZ under the prompt during reveal and arm when local time reaches `buzzOpenAt`, without waiting for the later `buzzOpen` message.
- On wrong-answer reopen, set `buzzOpenAt = now + TRIVIA_BUZZ_SYNC_MS` (500ms).
- `buzz()` rejects when `now < buzzOpenAt` (in addition to lockout / buzz jam). Clear `buzzOpenAt` when leaving the buzz window (answering / reveal / board reset).
- TV `BUZZ!` pulse only after `buzzOpen` **and** `now >= buzzOpenAt`. Same `Date.now()` vs server-ms pattern as other KernelChaos timers (no NTP offset).

## Consequences

- Extends [ADR 0043](./0043-trivia.md); chaos buzz jam ([ADR 0044](./0044-trivia-chaos.md)) still stacks via `max(buzzOpenAt, jamUntil)` on the client.
- Slightly longer wait after wrong answers (500ms) for fairness.
- Clock skew can still shift perceived arm time by a few tens of ms; acceptance remains DO-ordered after `buzzOpenAt`.
