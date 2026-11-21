# ADR 0020: Picture Hunt scene authoring

## Status

Accepted

## Context

[ADR 0019](./0019-scattergories-picture-hunt.md) scores Picture Hunt against curated per-scene synonym keys. Inline TypeScript catalogs do not scale when scenes need **hundreds** of objects with synonyms that cover every classic letter-die face (A–P, R–T, W). Image models also will not guarantee every named object is drawn, so authoring must be **metadata-first** with a verify loop.

## Decision

- **JSON catalogs** under `worker/scattergories/hunt/data/<id>.json` (`id`, `title`, `imageUrl`, `objects[]` with `id` + `names[]`). Images remain in `public/hunt/<id>.jpg`.
- **Loader** in `worker/scattergories/hunt/scenes.ts` imports all JSON files; `pickScene` / `getScene` APIs stay stable for the Durable Object.
- **Coverage floors** (enforced by `npm run hunt:coverage`; art policy in [ADR 0027](./0027-hunt-hidden-object-art.md)):
  - ≥ **250** objects per scene for authored dense catalogs
  - ≥ **10** distinct objectIds findable for **each** of the 20 die letters (via `startsWithLetter` on synonyms)
- **Authoring loop:** write JSON → run coverage → generate dense family-friendly **hidden-object** illustration into `public/hunt/<id>.jpg` → optional Magnific MCP Creative densify/sharpen ([hunt-magnific.md](../hunt-magnific.md)) → vision-check → trim ghosts → re-run coverage → lint/build/ship. Optional review boxes only when visually authored ([0021](./0021-hunt-find-feedback-and-boxes.md), [0027](./0027-hunt-hidden-object-art.md)).
- Legacy `shop` / `carnival` migrate to the same JSON format; new scenes (`kitchen`, `playroom`, `farm`, `beach`, `park`) ship at the floors above.

## Consequences

- Answer keys are editable without touching DO logic; lobby scene pills grow with the catalog.
- Coverage CI-style script fails the ship gate when floors regress.
- Image generation remains approximate; the key is authoritative for scoring after verify.
- Magnific adds detail and tiny clutter; it does not replace the vision trim against the catalog.
- Cross-links: extends [0019](./0019-scattergories-picture-hunt.md); art pass detail in [hunt-magnific.md](../hunt-magnific.md).
