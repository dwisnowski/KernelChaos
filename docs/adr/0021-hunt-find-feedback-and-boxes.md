# ADR 0021: Picture Hunt find feedback and location boxes

## Status

Accepted

## Context

Picture Hunt ([ADR 0019](./0019-scattergories-picture-hunt.md), [ADR 0020](./0020-hunt-scene-authoring.md)) accepted free-text finds against synonym keys with no immediate feedback and no way to show *where* a find lived in the scene. Families want green/red confirmation plus a personal “remaining” count during play, and after the round a way to review matched objects on the picture.

Scene catalogs had names only. Accurate freehand drawing is unreliable across devices; authored normalized bounding boxes keep review deterministic.

## Decision

- **Immediate find validation** via `submitHuntFind` → private `huntFindResult` (`ok`, `status`, `remaining`, `matchedCount`, `letterTotal`). Success flash (green) + `playWordFound`; failure flash (red) + `playReject`. Duplicate self-claims and unknown/wrong-letter words are failures.
- **Personal remaining** on the left during play: distinct letter-findable objectIds in the scene minus objectIds this seat has matched. Public snapshot may include `huntLetterTotal` (count only).
- **Bounding boxes** on hunt objects as optional normalized `{ x, y, w, h }` (0–1). Results include `findLocations` for each seat’s matched finds so the client can overlay boxes without shipping the full catalog. Missing box → “No location marked”.
- Box authoring is vision-assisted / approximate; coverage script reports box % without failing floors yet.

## Consequences

- Play UX is snappier and less ambiguous; answer keys remain server-authoritative.
- Results review depends on metadata quality; null boxes degrade gracefully.
- Cross-links: extends [0019](./0019-scattergories-picture-hunt.md), [0020](./0020-hunt-scene-authoring.md).
