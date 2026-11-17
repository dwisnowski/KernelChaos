# ADR 0028: Picture Hunt click-annotate + peer In/Out review

## Status

Accepted

## Context

Picture Hunt ([ADR 0019](./0019-scattergories-picture-hunt.md)) used free-text finds scored against a curated synonym catalog and **skipped review** (`playing` → `results`). Catalog matching fought the seek-and-find fantasy (wrong boxes, ghost keys), while families already understand Categories peer In/Out ([ADR 0010](./0010-scattergories-review-voting.md)).

Players should mark *where* they found something on the picture, then debate validity together.

## Decision

- **Play:** click/tap the scene to place a private pin at normalized `{ x, y }` and annotate with a word that starts with the round letter. Soft server checks only (letter, non-empty, cap). No synonym/catalog matching for points.
- **Privacy:** pins and words stay private to each seat until review; TV play stays answer-blind (counts only).
- **Phases:** Hunt uses `playing` → `review` → `results` (no longer skips review).
- **Review:** single ballot over all finds (vote target `playerId:findIndex`); reuse In/Out, majority Out rejects, host Pass ([ADR 0022](./0022-host-skip-review-voter.md)), Finish when complete. Reveal all pins on the shared scene.
- **Scoring:** letter + peer acceptance; **1 point per unique accepted** normalized find (duplicates cancel), same spirit as Categories. Scene JSON remains for pick/image only.

## Consequences

- Supersedes ADR 0019’s “skip review” and curated scoring for Hunt; extends ADR 0010’s ballot model to find keys.
- Remaining/letterTotal catalog rail goes away; `huntFindResult` signals soft accept/reject only.
- Cross-links: [0010](./0010-scattergories-review-voting.md), [0019](./0019-scattergories-picture-hunt.md), [0021](./0021-hunt-find-feedback-and-boxes.md), [0027](./0027-hunt-hidden-object-art.md).
