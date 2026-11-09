# ADR 0005: TV post-game scores

## Status

Accepted

## Context

ADR 0003 kept the TV score-blind through results so phones alone revealed winners and points. After shipping length pies and the missed-word cloud (ADR 0004), the living-room screen still ended rounds with “check your phone,” which undercuts the TV as the shared celebration surface. Play-time drama (hidden provisional scores, anonymous badges) remains valuable; the post-game reveal does not need the same secrecy.

## Decision

- **During play** the TV stays score-blind: word counts + anonymous badge feed only (ADR 0003).
- **On results** the TV shows the winner (or tie), a ranked scoreboard with each player’s **points** (and word count), and continues to show length pies and the missed-word cloud.
- Phones keep the full per-word point and badge breakdown.

## Consequences

- Supersedes ADR 0003’s and ADR 0004’s “winners and points remain phone-only” for the results phase; play-phase score-blind UI is unchanged.
- The shared `state.results` payload already carried scores — this is a spectator UI change, not a protocol change.
- Code anchors: `src/pages/BoggleSpectator.tsx`, `src/index.css`.
