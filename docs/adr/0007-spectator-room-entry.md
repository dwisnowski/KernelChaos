# ADR 0007: Spectator room entry

## Status

Accepted

## Context

[ADR 0003](./0003-tv-spectator-screen.md) defined the spectator WebSocket role and `/boggle/room/:code/tv` display, but the only path onto that screen was “Open TV spectator” after a player had already created and joined the room. Living-room setups want the TV itself to open the empty lobby (code + QR) with no player seat, and to attach as spectator to a room that already exists—without entering a name.

## Decision

- On the Boggle entry screen, add **Create for TV**: `POST /api/rooms`, then navigate to `/boggle/room/${code}/tv`. No name; no player created.
- Add **Spectate on TV**: validate the 4-character room code, then navigate to the same `/tv` route. No name.
- Keep player create/join and the in-lobby “Open TV spectator” link unchanged.
- Host assignment and lobby settings remain as in ADR 0003: first *player* to join becomes host; spectators never host or submit words.

## Consequences

- A TV can stand up the group lobby alone; phones scan the QR and play as before.
- Empty rooms may exist with only spectators until a player joins (or the session is abandoned)—same DO occupancy tradeoff as player-created rooms.
- Code anchors: `src/pages/BoggleEntry.tsx`, `src/pages/BoggleSpectator.tsx`, `src/hooks/useRoom.ts`.
