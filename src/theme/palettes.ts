/** App chrome color tokens (CSS custom properties). Game piece colors are separate. */

export type PaletteColors = {
  bg0: string;
  bg1: string;
  bg2: string;
  glow0: string;
  glow1: string;
  bgEnd: string;
  ink: string;
  muted: string;
  accent: string;
  accent2: string;
  danger: string;
};

export type PalettePresetId =
  | "classic-chaos"
  | "sunset-punch"
  | "candy-carnival"
  | "citrus-splash"
  | "neon-fairground";

export type StoredPalette =
  | { mode: "preset"; id: PalettePresetId }
  | { mode: "custom"; colors: PaletteColors };

export type PalettePreset = {
  id: PalettePresetId;
  name: string;
  blurb: string;
  colors: PaletteColors;
};

const STORAGE_KEY = "kernelchaos.palette";

const HEX_RE = /^#([0-9a-fA-F]{6})$/;

export const DEFAULT_PALETTE_ID: PalettePresetId = "classic-chaos";

export const PRESETS: readonly PalettePreset[] = [
  {
    id: "classic-chaos",
    name: "Classic Chaos",
    blurb: "Navy depth, gold punch, mint highlights — the original look.",
    colors: {
      bg0: "#0e1f35",
      bg1: "#16304a",
      bg2: "#1f4268",
      glow0: "#245a8c",
      glow1: "#3a2a12",
      bgEnd: "#101e32",
      ink: "#f2f5fa",
      muted: "#b7c2cf",
      accent: "#f0a202",
      accent2: "#3ecf8e",
      danger: "#ff6b6b",
    },
  },
  {
    id: "sunset-punch",
    name: "Sunset Punch",
    blurb: "Warm dusk blues with coral and mango energy.",
    colors: {
      bg0: "#1a1540",
      bg1: "#2a1f55",
      bg2: "#3d2a6b",
      glow0: "#ff6b4a",
      glow1: "#ffb347",
      bgEnd: "#120e28",
      ink: "#fff5f0",
      muted: "#d4b8c8",
      accent: "#ff6b6b",
      accent2: "#ffc857",
      danger: "#ff3d71",
    },
  },
  {
    id: "candy-carnival",
    name: "Candy Carnival",
    blurb: "Deep grape with hot pink and lime pops.",
    colors: {
      bg0: "#1c0a2e",
      bg1: "#2d1248",
      bg2: "#4a1d6e",
      glow0: "#ff4ecd",
      glow1: "#b8ff3c",
      bgEnd: "#12061f",
      ink: "#fef7ff",
      muted: "#c9a8d8",
      accent: "#ff4ecd",
      accent2: "#b8ff3c",
      danger: "#ff6b9d",
    },
  },
  {
    id: "citrus-splash",
    name: "Citrus Splash",
    blurb: "Teal lagoon with lemon and orange zest.",
    colors: {
      bg0: "#053a3a",
      bg1: "#0a4f4c",
      bg2: "#0f6b66",
      glow0: "#2dd4bf",
      glow1: "#fbbf24",
      bgEnd: "#032828",
      ink: "#f0fffb",
      muted: "#9ec9c4",
      accent: "#fde047",
      accent2: "#fb923c",
      danger: "#f87171",
    },
  },
  {
    id: "neon-fairground",
    name: "Neon Fairground",
    blurb: "Near-black with electric cyan and magenta.",
    colors: {
      bg0: "#0a0a12",
      bg1: "#141422",
      bg2: "#1e1e36",
      glow0: "#22d3ee",
      glow1: "#e879f9",
      bgEnd: "#05050a",
      ink: "#f5f5ff",
      muted: "#a0a0c0",
      accent: "#22d3ee",
      accent2: "#e879f9",
      danger: "#fb7185",
    },
  },
] as const;

const PRESET_BY_ID: Record<PalettePresetId, PalettePreset> = Object.fromEntries(
  PRESETS.map((p) => [p.id, p]),
) as Record<PalettePresetId, PalettePreset>;

export const COLOR_FIELDS: readonly {
  key: keyof PaletteColors;
  cssVar: string;
  label: string;
}[] = [
  { key: "bg0", cssVar: "--bg0", label: "Background deep" },
  { key: "bg1", cssVar: "--bg1", label: "Background mid" },
  { key: "bg2", cssVar: "--bg2", label: "Background lift" },
  { key: "glow0", cssVar: "--glow0", label: "Glow primary" },
  { key: "glow1", cssVar: "--glow1", label: "Glow secondary" },
  { key: "bgEnd", cssVar: "--bg-end", label: "Background end" },
  { key: "ink", cssVar: "--ink", label: "Text" },
  { key: "muted", cssVar: "--muted", label: "Muted text" },
  { key: "accent", cssVar: "--accent", label: "Accent" },
  { key: "accent2", cssVar: "--accent-2", label: "Accent secondary" },
  { key: "danger", cssVar: "--danger", label: "Danger" },
] as const;

export function isValidHex(value: string): boolean {
  return HEX_RE.test(value);
}

export function normalizeHex(value: string): string | null {
  const trimmed = value.trim();
  if (HEX_RE.test(trimmed)) return trimmed.toLowerCase();
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed.toLowerCase()}`;
  return null;
}

function isPresetId(value: unknown): value is PalettePresetId {
  return typeof value === "string" && value in PRESET_BY_ID;
}

function parseColors(raw: unknown): PaletteColors | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const colors = {} as PaletteColors;
  for (const { key } of COLOR_FIELDS) {
    const hex = typeof obj[key] === "string" ? normalizeHex(obj[key]) : null;
    if (!hex) return null;
    colors[key] = hex;
  }
  return colors;
}

export function getPreset(id: PalettePresetId): PalettePreset {
  return PRESET_BY_ID[id];
}

export function resolveColors(stored: StoredPalette): PaletteColors {
  if (stored.mode === "preset") return getPreset(stored.id).colors;
  return stored.colors;
}

export function applyPalette(colors: PaletteColors): void {
  const root = document.documentElement;
  for (const { key, cssVar } of COLOR_FIELDS) {
    root.style.setProperty(cssVar, colors[key]);
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", colors.bg0);
}

export function loadStoredPalette(): StoredPalette {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { mode: "preset", id: DEFAULT_PALETTE_ID };
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return { mode: "preset", id: DEFAULT_PALETTE_ID };
    }
    const obj = parsed as { mode?: unknown; id?: unknown; colors?: unknown };
    if (obj.mode === "preset" && isPresetId(obj.id)) {
      return { mode: "preset", id: obj.id };
    }
    if (obj.mode === "custom") {
      const colors = parseColors(obj.colors);
      if (colors) return { mode: "custom", colors };
    }
  } catch {
    /* ignore corrupt storage */
  }
  return { mode: "preset", id: DEFAULT_PALETTE_ID };
}

export function saveStoredPalette(stored: StoredPalette): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

/** Apply whatever is in storage (or Classic Chaos). Call before first paint. */
export function bootPalette(): StoredPalette {
  const stored = loadStoredPalette();
  applyPalette(resolveColors(stored));
  return stored;
}
