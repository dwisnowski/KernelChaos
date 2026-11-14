# ADR 0010: Scattergories review voting (batch In/Out)

## Status

Accepted

## Context

[ADR 0009](./0009-scattergories-and-game-shell.md) defined Scattergories review as host-driven: one category at a time on the TV, exact duplicates cancel, and the host could toggle answers invalid after family debate. In practice the table wants a say — rejecting or keeping answers should not be a single-player host decision.

Showing one answer, voting, then the next would slow review. Players need to see **all** answers for the current category, mark each In or Out, and submit once.

## Decision

- **Batch ballot per category:** every seated player (including the answer’s author) sees all non-empty answers with `In` | `Out` toggles and a single **Submit**. Spectators do not vote.
- **Majority binds:** when all seated players have submitted for the current category, each answer with majority `out` is rejected (0 pts). Majority `in` or a **tie stays in** (benefit of the doubt). Duplicate / wrong-letter rules still apply after the reject flag.
- **No host Reject/Count:** remove `toggleAnswerInvalid`. Host still advances categories (Previous / Next / See scores), but **Next and See scores stay disabled** until voting is complete for the current category. Votes persist when navigating back.
- **TV:** while voting is open, show who has not submitted yet (“Waiting on …”). When complete, show In/Out tallies beside answers.
- **Protocol:** `submitReviewVotes` with a map of target player id → `in` | `out` for the current `reviewIndex`; room state exposes `reviewSubmittedBy`, `reviewPendingVoters`, and `reviewVotingComplete`.

## Consequences

- Host is no longer the sole judge of validity; the table’s majority is authoritative.
- Review cannot skip ahead until every seated player ballots the current category (disconnected players still block until they reconnect or leave the seated set).
- Ties favor counting the answer, matching a generous family-game bias.
- Cross-links: extends [0009](./0009-scattergories-and-game-shell.md).
