# ADR 0042: Picture Hunt themed packs

## Status

Accepted

## Context

The Hunt catalog grew to ~50 image-only scenes ([ADR 0041](./0041-hunt-scene-prompt-pipeline.md)). The lobby listed every scene for host pick (`preferredSceneId`), which does not scale and fights “fresh picture each round.” Hosts want a **theme** (pack); the round should surprise with a random scene from that theme. More packs will be added later.

## Decision

- Introduce **Hunt packs** under `worker/scattergories/hunt/packs.ts`: `id`, `title`, `tagline`, `sceneIds[]`.
- Lobby host selects **`huntPackId`** (not a scene). Default: first themed pack (`seaside`).
- On round start, server picks a **random unused** scene from that pack (`pickSceneFromPack`); wrap within the pack when exhausted.
- Public state exposes `huntPacks` + `huntPackId`; retire lobby `preferredSceneId` / per-scene pills and `setPreferredScene`.
- Existing 50 scenes are partitioned into themed packs (Seaside, Wilds, Legends, Neighborhood, Fairgrounds, Horizons). New packs = new entries + scene membership.

## Consequences

- Extends [0019](./0019-scattergories-picture-hunt.md) and [0041](./0041-hunt-scene-prompt-pipeline.md).
- Scene catalog remains image-only; packs are the product grouping layer.
- Old rooms with `preferredSceneId` ignore it and use `huntPackId` (or default).
