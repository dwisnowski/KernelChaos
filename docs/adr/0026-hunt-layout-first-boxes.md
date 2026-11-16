# ADR 0026: Layout-first Picture Hunt scenes and boxes

## Status

Superseded by [ADR 0027](./0027-hunt-hidden-object-art.md) for shipped scene art (sticker boards rejected; hidden-object illustrations restored).

## Context

Picture Hunt catalogs ([ADR 0020](./0020-hunt-scene-authoring.md)) were authored as text, then one-shot image models produced dense JPGs. Models do not return coordinates and do not guarantee every keyed object is drawn. [ADR 0021](./0021-hunt-find-feedback-and-boxes.md) added normalized boxes for results review, but those boxes were filled by a hash-grid seed script — placeholders, not real locations — so review overlays never matched the art.

Families need review highlights that land on the find they selected. The only reliable way is **positions known before pixels exist**.

## Decision

- **Layout first:** a compose script packs each scene’s objects into non-overlapping normalized `{ x, y, w, h }` boxes, then **composites** a sticker-board scene image from that layout.
- **Boxes are ground truth** by construction: the same boxes are written into `worker/scattergories/hunt/data/<id>.json` and used for review overlays.
- **Catalog honesty:** only objects placed on the board remain in the key. Prefer ~120–180 readable stickers per scene over ~400 ghost keys. Keep the letter floor: **≥10** distinct findable objectIds per die letter. Soften the old **≥250** object floor to **≥120**.
- **Retire** hash-grid seeding (`hunt:seed-boxes`) as a box source; authoring loop is `compose` → coverage → ship.
- Client review overlay stays percentage-based; the scene frame **shrink-wraps** the image so `%` tracks the bitmap.

## Consequences

- Existing one-shot hunt JPGs are replaced by composited sticker boards (clear labels over a light thematic wash).
- Coverage script floors update (min objects 120; letter floor unchanged).
- Extends [0020](./0020-hunt-scene-authoring.md) and [0021](./0021-hunt-find-feedback-and-boxes.md).
