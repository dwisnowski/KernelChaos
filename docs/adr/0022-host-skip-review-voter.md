# ADR 0022: Host skip (Pass) pending review voter

## Status

Accepted

## Context

[ADR 0010](./0010-scattergories-review-voting.md) requires every seated player to submit a ballot before the host can advance review. A player who steps away (phone left behind, bathroom break) still occupies a seat and blocks “Waiting on …”, so the table cannot finish the category.

## Decision

- **Host Pass:** during open voting on the current category, the host may Pass any pending voter from the phone review UI.
- **Empty ballot:** Pass records `skipReviewVoter` → an empty ballot map entry for that voter on the current `reviewIndex`. They count as submitted for `reviewVotingComplete`, but contribute **no** `in`/`out` tallies (majority uses only explicit votes; ties still stay in).
- **Current category only:** Pass does not carry forward; each category still needs a ballot entry from every seat (real submit or another Pass).
- **TV unchanged:** spectators see the pending list without Pass controls; host advances from their player seat.

## Consequences

- AFK seats no longer permanently stall review when the host chooses to Pass them.
- Skipping shrinks the effective electorate for that category without inventing votes.
- Extends [0010](./0010-scattergories-review-voting.md).
