# ADR 0041: Picture Hunt Magnific scene prompt pipeline (image-only)

## Status

Accepted

## Context

Shipped Hunt JPGs felt generic, and mega synonym catalogs (≥250 objects, letter coverage floors from [ADR 0020](./0020-hunt-scene-authoring.md)) fought the product: families enjoy pinning finds and arguing **In/Out** ([ADR 0028](./0028-hunt-click-annotate-review.md)), not matching a hidden answer key. Art also lacked a reusable, repo-owned prompt system for themed packs.

## Decision

- **Prompt library** under `assets/hunt/prompts/`: shared `style.md` (dense seek-and-find ink + light watercolor) plus per-scene foundations in `scenes/<id>.md`. Compose with `npm run hunt:prompt -- <id>` (`compose.mjs`). Style is shared; **object weaves are scene-local** — no cross-scene/pack object checklist.
- **Image-only runtime scenes:** `worker/scattergories/hunt/data/<id>.json` holds `id`, `title`, `imageUrl` only. No `objects[]`, no synonym key, no coverage floors. Images live at `public/hunt/<id>.jpg`.
- **Scoring** remains peer In/Out + uniqueness ([ADR 0028](./0028-hunt-click-annotate-review.md)); soft letter/cap checks only. Retire catalog matching / `hunt:coverage` as a ship gate for new art.
- **Generation:** Magnific text-to-image from the composed prompt; optional Creative densify later. Pilot scenes: `space-port`, `beach-chaos`, `castle-transylvania`. Full catalog target: **~50** foundations (shipped).

## Consequences

- Extends [0027](./0027-hunt-hidden-object-art.md) (hidden-object art) and [0028](./0028-hunt-click-annotate-review.md) (peer review).
- Supersedes [0020](./0020-hunt-scene-authoring.md)’s mega-catalog floors and curated-key authoring loop for **new** Hunt scenes; 0020 remains historical for the old JSON catalogs.
- Packs later = same style + scene foundation with framing/time variations — still no shared answer key.
- Recipe: [hunt-magnific.md](../hunt-magnific.md).
