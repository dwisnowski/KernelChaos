# Spot It — Magnific MCP symbol packs

Offline authoring recipe for Spot It symbol packs ([ADR 0033](./adr/0033-spot-it.md), [ADR 0034](./adr/0034-spot-it-assets-and-card-ux.md)). Generate **4 symbols per image** (one per quadrant), then process into masters + small game rasters.

Run from Cursor via the **Magnific MCP** (`user-Magnific`), not the website.

## Asset layout

```text
assets/spot-it/<pack>/
  sheets/          # gitignored — raw Magnific 4-up outputs
  masters/00.png…  # committed authoring masters (≤512²)
public/spot-it/<pack>/
  00.png…          # deployed game rasters (192²)
```

Order-7 packs need **57** symbols → **15** four-up sheets (14×4 + one leftover sheet with 1 used).

## 4-up generation rules

- One distinct anthropomorphic character per quadrant (top-left, top-right, bottom-left, bottom-right).
- Leave a clear **gutter** between quadrants so crops do not bleed.
- Flat transparent or solid background; no shared scene furniture across quadrants.
- No text, letters, numbers, labels, watermarks, or borders.
- Keep characters readable at small size (bold silhouette, limited fine detail).

### Prompt template (Funny Foods)

```text
Four funny anthropomorphic food characters in a 2x2 grid, one per quadrant with clear empty gutters between them. Top-left: <A>. Top-right: <B>. Bottom-left: <C>. Bottom-right: <D>. Each has a face, arms, and legs, standing alone on a transparent background. Bold cartoon shapes, high contrast, no text, no letters, no numbers, no labels, no watermark, no shared background props.
```

### Prompt template (Kawaii Animals — pack `kawaii`)

```text
Four kawaii animals in a 2x2 grid, one per quadrant with clear empty gutters between them. Top-left: <A>. Top-right: <B>. Bottom-left: <C>. Bottom-right: <D>. Soft pastel kawaii style, big sparkly eyes, rounded cute proportions, each standing alone on a transparent background. Bold readable silhouettes, high contrast, no text, no letters, no numbers, no labels, no watermark, no shared background props.
```

Swap A–D for pack-specific subjects. Prefer a dedicated Magnific folder per pack (e.g. under KernelChaos Spot It → Kawaii Animals).

## Tool chain

1. `magnific_start` — confirm plan / credits; pass `folderReference` when using a project folder.
2. `images_generate` (or the pack’s preferred image tool) with the 4-up prompt; square canvas.
3. `creations_wait` until terminal — do **not** re-queue while still processing.
4. `creations_read` — confirm four distinct, separable characters.
5. Download into `assets/spot-it/<pack>/sheets/` (PNG preferred).
6. Process:

```bash
make spot-it-process PACK=<pack>
```

This crops each sheet into four symbols (3% gutter inset), writes masters capped at 512², and emits `public/spot-it/<pack>/NN.png` at **192×192**.

Rebuild game rasters from existing masters:

```bash
make spot-it-from-masters PACK=<pack>
```

One-shot migrate of an existing public pack into masters + 192 game files:

```bash
make spot-it-downsample-food   # food only
```

## Do not

- Ship sheet images under `public/` (they are gitignored and never deployed).
- Commit masters larger than 512² — the process script caps them.
- Put game logic URLs on masters; clients always load `/spot-it/<pack>/NN.png`.
