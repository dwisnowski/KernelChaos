# ADR 0032: Picture Hunt desktop loupe + mobile pinch annotate

## Status

Accepted

## Context

The optional loupe from [ADR 0031](./0031-hunt-magnifying-glass.md) works on desktop but is awkward on phones (finger covers the glass; no hover cursor). Mobile players still need a way to inspect dense scenes ([ADR 0027](./0027-hunt-hidden-object-art.md)) and place pins ([ADR 0028](./0028-hunt-click-annotate-review.md)) without fighting the UI chrome for viewport space.

## Decision

- **Desktop** (`(hover: hover)`): keep the optional Magnify loupe; diameter **15rem** (~2× the original). One tap still opens the inline annotate popover.
- **Touch / no-hover** (`(hover: none)`): no loupe and no Magnify toggle. Near-fullscreen pinch-zoom + pan of the scene; tap places a **temp marker** only; tap that marker opens a **bottom-sheet overlay** to enter the word; tap elsewhere moves the temp marker; successful Pin **resets zoom/pan to 1×**. Cancel keeps the temp marker.
- Touch play chrome stays minimal (compact play bar + find chips); WIZ footer hidden during touch hunt play so the zoom surface can use remaining `dvh`.
- State remains **local to the player client**.

## Consequences

- Supersedes ADR 0031’s touch/loupe-offset path; desktop loupe remains (enlarged).
- Cross-links: [0031](./0031-hunt-magnifying-glass.md), [0028](./0028-hunt-click-annotate-review.md), [0027](./0027-hunt-hidden-object-art.md).
