# ADR 0036: Spot It Cyber Vehicles pack

## Status

Accepted (lobby-selectable `cyber` pack; Magnific 4-up art under `public/spot-it/cyber/`).

## Context

Spot It supports multiple symbol packs ([ADR 0033](./0033-spot-it.md), [ADR 0035](./0035-spot-it-kawaii-animals-pack.md)). A third pack should cover vehicles in a Japanese anime / cyberpunk visual style, authored through the masters vs 192² pipeline ([ADR 0034](./0034-spot-it-assets-and-card-ux.md)).

## Decision

- Add pack id `cyber`, lobby label **Cyber Vehicles**, paths `assets/spot-it/cyber/masters/` and `public/spot-it/cyber/`.
- Art: Magnific 1:1 four-up anime cyberpunk vehicle sheets → `make spot-it-process PACK=cyber` (keep 57 of 60 crops; punch near-black backgrounds to alpha).
- Default pack remains `food`.
- Authoring recipe: [`docs/spot-it-magnific.md`](../spot-it-magnific.md).

## Consequences

- `SpotItPackId` / lobby pills include `cyber`.
- Deal/tap protocol unchanged.
- Extends [0033](./0033-spot-it.md), [0034](./0034-spot-it-assets-and-card-ux.md), [0035](./0035-spot-it-kawaii-animals-pack.md).
