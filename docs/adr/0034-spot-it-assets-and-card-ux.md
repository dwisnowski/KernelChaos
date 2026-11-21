# ADR 0034: Spot It assets pipeline + large square cards

## Status

Accepted (masters vs 192² game rasters, 4-up Magnific process, square card UX, harder layout RNG).

## Context

Spot It ([ADR 0033](./0033-spot-it.md)) ships Funny Foods symbols under `public/spot-it/food/`. Clients download every symbol at full file resolution even though on-card glyphs are small. Circular cards capped at `16rem` made matches hard to see. Layout rotation was limited to roughly ±25–35°, which reduced challenge.

Future packs should generate art more efficiently (fewer Magnific calls) without bloating the deploy bundle.

## Decision

- **Masters vs game:** Authoring masters live in `assets/spot-it/<pack>/masters/` (committed, ≤512²). Deployed rasters are **192×192** under `public/spot-it/<pack>/`. Magnific 4-up sheets stay in `assets/spot-it/<pack>/sheets/` (gitignored).
- **Pipeline:** `scripts/spot-it-process-pack.py` + Makefile targets `spot-it-downsample-food`, `spot-it-from-masters`, `spot-it-process`. Documented in [`docs/spot-it-magnific.md`](../spot-it-magnific.md). Four symbols per sheet; crop with gutter inset.
- **Cards:** Large **rounded squares** (`border-radius` ~14%) that fill most of the play viewport (side-by-side on wide; stacked full-width on phone). Compact score chrome so cards dominate.
- **Layout RNG:** Full **0–360°** rotation; scale roughly **[0.70, 1.30]** (±30% around 1.0); slightly tighter ring radius so large scales stay on-card.

## Consequences

- Food pack public size drops (~10 MB → ~3 MB); masters remain available for re-emitting game sizes.
- New packs follow the 4-up → process path without changing deal/tap protocol or `/spot-it/<pack>/NN.png` URLs.
- Harder visual matching; phone and TV still share server-seeded placements.
- Extends [0033](./0033-spot-it.md). First multi-pack consumer: [0035](./0035-spot-it-kawaii-animals-pack.md).
