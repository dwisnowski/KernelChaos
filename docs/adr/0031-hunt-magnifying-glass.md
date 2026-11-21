# ADR 0031: Picture Hunt magnifying-glass loupe

## Status

Accepted

## Context

Picture Hunt scenes are dense seek-and-find illustrations ([ADR 0027](./0027-hunt-hidden-object-art.md)). Players place private pins by tapping the scene ([ADR 0028](./0028-hunt-click-annotate-review.md)), but small objects are hard to resolve on phone and TV-distance screens when the image is letterboxed to fit the viewport. Full-image pan/zoom would complicate pin hit-testing and the existing layout.

## Decision

- During Hunt **playing** only, offer an optional **Magnify** toggle (default off) in the sticky play header.
- When on, a circular **loupe** (~2.25×) follows the pointer over the scene image, showing a magnified crop of that area. Touch offsets the loupe above the finger so the contact point stays visible.
- The loupe is `pointer-events: none`; pin placement and annotate popover stay on the existing image-rect hit path.
- State is **local to the player client** — not synced to peers or the TV spectator view.
- Hide the loupe while the draft annotate popover is open, and when the pointer leaves the image.

## Consequences

- Extends Hunt play UX without worker/protocol changes.
- Cross-links: [0027](./0027-hunt-hidden-object-art.md), [0028](./0028-hunt-click-annotate-review.md).
