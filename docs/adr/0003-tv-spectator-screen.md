# ADR 0003: TV spectator screen

## Status

Accepted

## Context

Family sessions often put a living-room TV on the room code / board while everyone plays on phones. ADR 0001 treated “TV mode” as responsive CSS on the same player client, so the host could still play from the big screen. That leaks provisional scores and badge owners if the TV is showing the player UI, and it fights the goal of a drama-safe central display: keep the race exciting without revealing who is winning or who earned chaos badges.

## Decision

- Add an explicit **spectator** WebSocket role (`{ type: "spectate" }`) that does not create a player, cannot host or submit words, and may connect during any phase.
- Ship a dedicated route `/boggle/room/:code/tv` for the central display. Lobby links open it in a new tab.
- During play the TV shows: large timer, read-only board, **per-player word counts only** (no points, no winner), and a **Chaos hits** feed of badge pills.
- Badge pops are broadcast as anonymous `badgeEvent` messages (bonus ids + timestamp only — never player id/name/word). Live submit bonuses and end-of-round awards both feed the TV.
- Results on the TV originally stayed score-blind (word counts + badge feed). **Superseded for results** by [ADR 0005](./0005-tv-post-game-scores.md): TV now shows winner + points after the round; play remains score-blind.

## Consequences

- Supersedes ADR 0001’s “TV is only CSS breakpoints, not a separate spectator role” for the living-room display use case; player clients keep the existing responsive shell.
- Spectators do not count toward host assignment or “start with ≥1 player.”
- Anyone inspecting the shared `state` payload can still see provisional scores; the product guarantee is UI-level for the TV route, not cryptographic secrecy.
- Code anchors: `worker/room.ts`, `worker/boggle/protocol.ts`, `src/pages/BoggleSpectator.tsx`, `src/hooks/useRoom.ts`.
