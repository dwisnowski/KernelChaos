# ADR 0035: Spot It Kawaii Animals pack

## Status

Accepted (lobby-selectable `kawaii` pack; Magnific 4-up art under `public/spot-it/kawaii/`).

## Context

Spot It ([ADR 0033](./0033-spot-it.md)) supports multiple symbol packs via the lobby. Funny Foods ships first; families want a second pack with cute animal characters. Asset authoring follows the masters vs 192² pipeline ([ADR 0034](./0034-spot-it-assets-and-card-ux.md)).

Required animals in the pack: seagull, rabbit, cat, dog, horse, lizard, raccoon (indices `00`–`06`). Remaining symbols are additional animals to fill the order-7 deck (57 total).

## Decision

- Add pack id `kawaii`, lobby label **Kawaii Animals**, paths `assets/spot-it/kawaii/masters/` and `public/spot-it/kawaii/`.
- Art: Magnific 1:1 four-up kawaii sheets → `make spot-it-process PACK=kawaii` (keep 57 of 60 crops).
- Default pack remains `food`.
- Authoring recipe: [`docs/spot-it-magnific.md`](../spot-it-magnific.md).

## Consequences

- `SpotItPackId` / lobby pills grow to include `kawaii`.
- Deal/tap protocol unchanged; only image URLs and labels differ by `packId`.
- Extends [0033](./0033-spot-it.md), [0034](./0034-spot-it-assets-and-card-ux.md).
