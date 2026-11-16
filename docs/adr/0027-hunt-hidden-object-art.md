# ADR 0027: Picture Hunt keeps hidden-object illustration art

## Status

Accepted

## Context

[ADR 0026](./0026-hunt-layout-first-boxes.md) replaced scene JPGs with layout-packed **sticker boards** so review boxes matched pixels by construction. That solved coordinate honesty but destroyed the product: Picture Hunt is a family **hidden-object** game (dense illustrated scenes you scan for named things), not a labeled icon grid.

Classic references (Highlights-style seek-and-find, Hidden Folks, mobile “Seek It / Spot It” art) use cluttered hand-drawn or digital-cartoon environments with props nested in a living place—not spreadsheet tiles.

## Decision

- **Revert** sticker-board JPGs; restore dense **hidden-object** scene illustrations under `public/hunt/`.
- **Catalogs** stay metadata-first ([ADR 0020](./0020-hunt-scene-authoring.md)) with coverage floors restored to ≥**250** objects and ≥**10** findable objectIds per die letter.
- **Boxes** ([ADR 0021](./0021-hunt-find-feedback-and-boxes.md)) are optional: ship `box` only when visually authored for that object; otherwise omit/`null` and the client shows “No location marked”. Do **not** invent hash-grid or sticker-layout placeholders.
- **Retire** `hunt:compose` sticker compositing as the scene pipeline. Image authoring is again: curated key → generate dense family-friendly hidden-object art → verify visible items → ship.
- ADR 0026 remains on record as the rejected box-first experiment; this ADR supersedes it for shipped art.

## Consequences

- Results review highlights are correct when a box exists, and honest when it does not.
- Visual play stays a seek-and-find picture, which is the genre families expect.
- Extends [0019](./0019-scattergories-picture-hunt.md), [0020](./0020-hunt-scene-authoring.md), [0021](./0021-hunt-find-feedback-and-boxes.md); supersedes [0026](./0026-hunt-layout-first-boxes.md) for production art.
