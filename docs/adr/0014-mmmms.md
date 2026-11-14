# ADR 0014: M&Ms Smash two-player orb duel

## Status

Accepted (implemented: polymorphic `GameRoom` `mmmms` type, organize → guess → attack phases, particle burst FX). Display name: **M&Ms Smash** (internal id remains `mmmms`).

## Context

KernelChaos already supports Boggle and Scattergories through a shared phone+TV shell and a polymorphic Durable Object ([ADR 0009](./0009-scattergories-and-game-shell.md)). A third family game, **M&Ms Smash**, needs the same join friction (4-character code + QR) but is a strict **two-player** duel: each seat gets a private stack of colored orbs, reorders them, then alternates attack/defend until one stack is empty.

Attack resolution is intentional and mind-game heavy: the defender’s remaining colors stay hidden (count only); the defender guesses the attack color just before the attacker picks; a correct guess grants per-orb 50% “survive and halt” saves along the explosion path.

## Decision

- **Shell:** Same as other games — `/mmmms` entry, `/mmmms/room/:code`, `/mmmms/room/:code/tv`; WIZ branding; Web Audio; no accounts; server-authoritative rules and RNG.
- **Capacity:** Exactly two seated players. Lobby Start requires two; further joins are rejected while the room is full.
- **Orb counts:** Host selects **12 / 20 / 30** in lobby (default **20**). Colors: Red, Orange, Yellow, Green, Brown, Indigo, Violet (independent random with duplicates).
- **Phases:** `lobby` → `organize` → `guess` → `attack` → (client animates server `steps`) → alternate → `results`.
- **Stack convention:** Index `0` is the **bottom** of the list (first to explode). Players drag-reorder during `organize`, then submit to lock.
- **Explosion:** From bottom upward, explode through and **including** the first orb matching the attack color, then stop. If the color is absent, explode the entire remaining stack.
- **Correct guess:** For each orb in that path, independently: 50% survive and **halt** the chain; 50% explode and continue. Wrong guess → no saves.
- **Visibility:** Opponent remaining colors are never published. Public state exposes counts, roles, ready flags, and post-resolve `attackResult` (exploded count + steps + whether the guess was correct). Own orbs are private on `welcome` / targeted updates.
- **FX:** Phone and TV play sequential WIZ-style spark/shockwave bursts from a lightweight canvas layer (no animejs / Morse glyph scene).

## Consequences

- `GameType` grows to `"boggle" | "scattergories" | "mmmms"` across Worker and UI unions.
- Domain logic lives under `worker/mmmms/`; `GameRoom` only dispatches.
- Two-player cap is M&Ms Smash-specific; Boggle/Scattergories remain unbounded.
- Organize phone UI hides the opponent board (counts remain in the HUD); drag/scroll details in [0016](./0016-mmmms-organize-ux.md).
- Cross-links: extends [0009](./0009-scattergories-and-game-shell.md), [0003](./0003-tv-spectator-screen.md), [0007](./0007-spectator-room-entry.md). SFX cues: [0015](./0015-mmmms-sfx.md). Organize UX: [0016](./0016-mmmms-organize-ux.md). Guess/attack UX: [0017](./0017-mmmms-guess-attack-ux.md). Combat hanging threads: [0018](./0018-mmmms-combat-hanging-threads.md).

