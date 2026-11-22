# ADR 0045: Colors header popover

## Status

Accepted

## Context

[ADR 0024](./0024-app-color-palettes.md) put color presets on `/settings` and linked that route from the shared Layout header. Opening Colors mid-game navigated away, unmounted the room WebSocket client, and left players unable to rejoin an in-progress seat. Palette choice is device-local chrome only; it does not need a full-page route from every screen.

## Decision

- Header **Colors** is a toggle that opens an in-place **popover** (shared `PalettePicker`) over the current shell — no route change, room stays mounted.
- `/settings` remains the full page (picker + ungated Admin undefined-word list from [ADR 0025](./0025-undefined-boggle-words-queue.md)), linked from the home hero and deep links. Admin is not in the popover.
- Close the popover on Escape and outside pointer; presets/custom/`localStorage` behavior unchanged from ADR 0024.

## Consequences

- Players can retheme without leaving a live room.
- Extends ADR 0024: header entry point is no longer a navigation to `/settings`.
