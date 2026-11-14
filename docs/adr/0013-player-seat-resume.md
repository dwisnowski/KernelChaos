# ADR 0013: Player seat resume after spectator

## Status

Accepted

## Context

Players can open the TV spectator route from the in-room header, then return via **Back to player mode**. That navigation tears down the player WebSocket and remounts the player client. Round data (Boggle words, Scattergories answers) lived only in client memory and in private DO fields that were never returned on `welcome`, so returning wiped the form even though the server still had the seat during play.

## Decision

- Persist the seat id in `localStorage` (`kernelchaos.resume.<CODE>`) when a player is welcomed (shared across tabs, including `_blank` TV).
- Extend `join` with optional `resumeId`. If that id still exists in the room, reclaim the seat in **any** phase (not only lobby/results), demoting any other live socket that held it to spectator.
- Include private payload on player `welcome`: `myWords` (Boggle) or `myAnswers` (Scattergories). The client hydrates local entry UI from that payload.

## Consequences

- **Back to player mode** (or a refresh) restores in-progress entries when the browser still has the resume id.
- A second tab that rejoins with the same resume id takes over the seat; the previous tab is demoted to spectator attachment (it will not receive further player-only actions until it rejoins).
- TV open-in-new-tab behavior from the lobby/header is unchanged.
- Code anchors: `worker/room.ts`, `src/lib/playerResume.ts`, `src/hooks/useRoom.ts`, `src/hooks/useScattergoriesRoom.ts`, `src/pages/ScattergoriesRoom.tsx`.
