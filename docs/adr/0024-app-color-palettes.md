# ADR 0024: App color palette settings

## Status

Accepted (implemented: `/settings` presets + custom chrome colors, `localStorage` persistence).

## Context

The KernelChaos shell used a single fixed `:root` palette in CSS (navy / gold / mint). Family players—especially kids—want happier, more exciting looks without waiting on a deploy, and some want full control over the chrome colors. There are no accounts ([ADR 0001](./0001-family-games-architecture.md)), so preferences must stay on-device. Game-piece colors (M&Ms orbs, cream Boggle tiles, chart series) are semantic or physical and should not ride the chrome theme.

## Decision

- **Route:** `/settings` (Colors) linked from the home hero for the full page + Admin. Layout header “Colors” opens an in-place popover instead of navigating ([ADR 0045](./0045-colors-header-popover.md)).
- **Tokens:** Editable chrome roles — `--bg0` / `--bg1` / `--bg2`, `--glow0` / `--glow1`, `--bg-end`, `--ink`, `--muted`, `--accent`, `--accent-2`, `--danger`. `--card` / `--stroke` are derived from `--ink` via `color-mix` so light and dark shells stay coherent. Fonts and radius stay fixed.
- **Presets (5):** Classic Chaos (default / current look), Sunset Punch, Candy Carnival, Citrus Splash, Neon Fairground. Selecting a preset leaves custom mode; editing any swatch switches to custom starting from the last applied colors.
- **Persistence:** `localStorage` key `kernelchaos.palette` stores either `{ mode: "preset", id }` or `{ mode: "custom", colors }`. Applied on boot via `document.documentElement` style properties; `theme-color` meta tracks `--bg0`.
- **Out of scope:** Cross-device / TV room sync; recoloring M&Ms orb hexes, Boggle tile creams, QR fg/bg, canvas die faces.

## Consequences

- Chrome UI that already uses `var(--*)` follows the chosen palette immediately on that browser; TV/phone each keep their own storage.
- Hardcoded hex in charts, canvases, and game pieces may still reflect Classic Chaos until separately tokenized.
- Extends the shared shell from [0009](./0009-scattergories-and-game-shell.md) with client-only appearance prefs, consistent with mute persistence.
