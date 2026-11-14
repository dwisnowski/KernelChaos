# ADR 0012: Active room directory + empty-room teardown

## Status

Accepted

## Context

Most visitors to `/boggle` and `/scattergories` are joiners, not hosts. Entry pages led with create, and the only join path was typing a 4-character code. Families wanted open lobbies visible for one-tap join.

Room state lives in Durable Objects keyed by code (ADR 0001). DOs are not enumerable, so a cross-room directory needs shared storage. Abandoned rooms also kept DO storage forever (`init` returned 409 once a code was claimed), which wasted capacity and blocked code reuse — a problem once rooms appear in a public list.

Constraints:

- No accounts (display name + code only).
- Join is allowed only in `lobby` and `results` (server already enforces this).
- Idle rooms must not hold WebSockets, round alarms, or pinned codes longer than needed.

## Decision

- **Join-first entry UX:** Join card above Create on both game entry pages; **Join room** is the primary button; **Create room** is secondary.
- **D1 directory:** Table `active_rooms` on existing `STATS_DB` (same pattern as ADR 0006). Each `GameRoom` upserts when the phase is joinable and at least one WebSocket is open; deletes otherwise.
- **List API:** `GET /api/rooms?game=boggle|scattergories` returns open rooms (code, phase, player count, host name). Stale rows older than ~2h are pruned as a safety net.
- **Empty-room teardown:** When open WebSocket count hits zero, schedule a ~30s grace alarm. If still empty, destroy the room: cancel alarms, delete the D1 row, `storage.deleteAll()`, reset in-memory state so the code can be `init`’d again. A reconnect during grace cancels teardown and restores the phase alarm.

## Consequences

- Open lobbies (and between-rounds rooms) are publicly discoverable on the entry page — accepted for this family hub.
- Codes become reusable after teardown; mid-round total disconnect ends the session instead of burning alarm/DO time through an empty timer.
- Brief grace avoids killing a room on a phone refresh; Create-for-TV lobbies stay listed while the spectator socket is open and tear down when that last connection leaves.
- Code anchors: `migrations/0002_active_rooms.sql`, `worker/activeRooms.ts`, `worker/room.ts`, `worker/index.ts`, `src/components/ActiveRooms.tsx`, `src/pages/BoggleEntry.tsx`, `src/pages/ScattergoriesEntry.tsx`.
