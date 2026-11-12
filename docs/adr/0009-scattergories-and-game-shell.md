# ADR 0009: Scattergories + shared KernelChaos game shell

## Status

Accepted (implemented: polymorphic `GameRoom` with `gameType`, Scattergories routes and TV/player flow, original family/kids/adult packs).

## Context

KernelChaos began as Boggle-first ([ADR 0001](./0001-family-games-architecture.md)) with living-room TV spectator ([ADR 0003](./0003-tv-spectator-screen.md), [ADR 0007](./0007-spectator-room-entry.md)). The hub home page reserved a shelf for more games. Scattergories needs the same join friction (4-character code + QR), dual screens (phone player + TV spectator), and Web Audio / motion cues — these should be treated as **core KernelChaos game shell** patterns, not Boggle-only accidents.

Official Milton Bradley / Hasbro Scattergories category lists are copyrighted. Public “free” dumps often reproduce those lists or lack a clear license, so shipping them would be unsafe for an MIT Wild Idea Zone project.

Scattergories also needs a **review** phase after the timer: the TV reveals one category at a time with every player’s answer; duplicates cancel; the host can mark answers invalid after family debate.

## Decision

- **Shared game shell (every KernelChaos game):** player route + `/tv` spectator route; 4-character room codes (`A–Z`, `1–9`) and QR deep links to `/{game}/join?code=`; Web Audio SFX + CSS motion; WIZ branding; no accounts; server-authoritative clock and scores; Create for TV / Spectate on TV without a name (first phone joiner is host).
- **Polymorphic Durable Object:** single `GAME_ROOMS` binding. `POST /api/rooms` accepts `{ game: "boggle" | "scattergories" }` (default `boggle`). The DO persists `gameType` at init and dispatches protocol / phase logic accordingly. WebSocket path remains `/api/room/:code`.
- **Scattergories phases:** `lobby` → `countdown` → `playing` → `review` → `results`. During play the TV is answer-blind (letter, categories, fill progress only). During review the host (player seat) advances categories; TV shows all answers for the active category.
- **Scoring v1:** normalize (trim, casefold, collapse whitespace); auto-cancel exact duplicates; reject answers whose first alphanumeric character is not the round letter; 1 point per unique valid answer; host may toggle invalid. No alliteration bonus yet.
- **Letter die:** classic set excluding Q, U, V, X, Y, Z.
- **Category packs:** original KernelChaos JSON under `worker/scattergories/packs/` — tiers `family`, `kids`, and clean `adult`, each with **20 lists × 12 categories**. Host picks a tier in lobby; server picks a random unused list for the session.
- **Frontend:** parallel routes under `/scattergories/*` mirroring Boggle entry / room / TV; parameterized TV/join URLs by game slug.

## Consequences

- Boggle rooms stay compatible when `game` is omitted or `"boggle"`.
- Room codes do not encode game type; joining the wrong game’s UI against a room of the other type must surface a clear error from state/`gameType`.
- Pack content is original and MIT-safe; future community packs can be added without touching Hasbro lists.
- `GameRoom` grows a dispatch layer; further games should keep domain logic under `worker/{game}/` rather than inlining into the DO.
- Cross-links: extends [0001](./0001-family-games-architecture.md), [0003](./0003-tv-spectator-screen.md), [0007](./0007-spectator-room-entry.md).
