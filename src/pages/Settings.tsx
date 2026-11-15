import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout.tsx";
import {
  COLOR_FIELDS,
  DEFAULT_PALETTE_ID,
  PRESETS,
  applyPalette,
  getPreset,
  loadStoredPalette,
  normalizeHex,
  resolveColors,
  saveStoredPalette,
  type PaletteColors,
  type PalettePresetId,
  type StoredPalette,
} from "../theme/palettes.ts";

type UndefinedEntry = {
  word: string;
  reportCount: number;
  firstSeenAt: number;
};

type UndefinedWordsLoad =
  | { status: "loading" }
  | { status: "ready"; entries: UndefinedEntry[] }
  | { status: "error" };

function initialState(): { stored: StoredPalette; colors: PaletteColors } {
  const stored = loadStoredPalette();
  return { stored, colors: resolveColors(stored) };
}

function fetchUndefinedWords(): Promise<UndefinedEntry[]> {
  return fetch("/api/boggle/undefined-words").then(async (res) => {
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as {
      entries?: UndefinedEntry[];
      words?: string[];
    };
    return (
      data.entries ??
      (data.words ?? []).map((word) => ({
        word,
        reportCount: 1,
        firstSeenAt: 0,
      }))
    );
  });
}

export function Settings() {
  const [{ stored, colors }, setState] = useState(initialState);
  const [hexDrafts, setHexDrafts] = useState<Partial<Record<keyof PaletteColors, string>>>({});
  const [undefinedWords, setUndefinedWords] = useState<UndefinedWordsLoad>({ status: "loading" });
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setUndefinedWords({ status: "loading" });
    void fetchUndefinedWords()
      .then((entries) => {
        if (!cancelled) setUndefinedWords({ status: "ready", entries });
      })
      .catch(() => {
        if (!cancelled) setUndefinedWords({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  function commit(next: StoredPalette) {
    const nextColors = resolveColors(next);
    applyPalette(nextColors);
    saveStoredPalette(next);
    setState({ stored: next, colors: nextColors });
    setHexDrafts({});
  }

  function selectPreset(id: PalettePresetId) {
    commit({ mode: "preset", id });
  }

  function updateCustomColor(key: keyof PaletteColors, hex: string) {
    const nextColors = { ...colors, [key]: hex };
    commit({ mode: "custom", colors: nextColors });
  }

  function onColorInput(key: keyof PaletteColors, value: string) {
    updateCustomColor(key, value.toLowerCase());
  }

  function onHexTextChange(key: keyof PaletteColors, value: string) {
    setHexDrafts((prev) => ({ ...prev, [key]: value }));
    const normalized = normalizeHex(value);
    if (normalized) updateCustomColor(key, normalized);
  }

  function onHexBlur(key: keyof PaletteColors) {
    setHexDrafts((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function resetClassic() {
    commit({ mode: "preset", id: DEFAULT_PALETTE_ID });
  }

  const selectedPresetId = stored.mode === "preset" ? stored.id : null;

  return (
    <Layout title="Colors">
      <section className="settings-page">
        <div>
          <h1>Color palettes</h1>
          <p className="settings-lede">
            Pick a fun preset or tune every chrome color. Choices stay on this device.
          </p>
        </div>

        <div className="settings-section">
          <h2>Presets</h2>
          <div className="preset-grid" role="listbox" aria-label="Palette presets">
            {PRESETS.map((preset) => {
              const selected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`preset-card${selected ? " is-selected" : ""}`}
                  onClick={() => selectPreset(preset.id)}
                >
                  <p className="preset-card-name">{preset.name}</p>
                  <p className="preset-card-blurb">{preset.blurb}</p>
                  <div className="preset-swatches" aria-hidden="true">
                    {[preset.colors.accent, preset.colors.accent2, preset.colors.glow0, preset.colors.bg0].map(
                      (swatch, i) => (
                        <span
                          key={i}
                          className="preset-swatch"
                          style={{ background: swatch }}
                        />
                      ),
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="settings-section">
          <h2>Custom{stored.mode === "custom" ? "" : " (edit to switch)"}</h2>
          <div className="custom-color-list">
            {COLOR_FIELDS.map(({ key, label }) => {
              const draft = hexDrafts[key];
              const display = draft ?? colors[key];
              const invalid = draft !== undefined && normalizeHex(draft) === null;
              return (
                <div key={key} className="custom-color-row">
                  <label htmlFor={`palette-${key}`}>{label}</label>
                  <input
                    id={`palette-${key}`}
                    type="color"
                    value={colors[key]}
                    aria-label={label}
                    onChange={(e) => onColorInput(key, e.target.value)}
                  />
                  <input
                    type="text"
                    value={display}
                    spellCheck={false}
                    aria-label={`${label} hex`}
                    className={invalid ? "is-invalid" : undefined}
                    onChange={(e) => onHexTextChange(key, e.target.value)}
                    onBlur={() => onHexBlur(key)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="settings-actions">
          <button type="button" className="btn" onClick={resetClassic}>
            Reset to {getPreset(DEFAULT_PALETTE_ID).name}
          </button>
          <Link className="btn primary" to="/">
            Back home
          </Link>
        </div>

        <div className="settings-section admin-section">
          <div className="admin-section-head">
            <h2>
              Admin
              {undefinedWords.status === "ready"
                ? ` · ${undefinedWords.entries.length} undefined word${
                    undefinedWords.entries.length === 1 ? "" : "s"
                  }`
                : ""}
            </h2>
            <button type="button" className="btn" onClick={() => setRefreshToken((n) => n + 1)}>
              Refresh
            </button>
          </div>
          <p className="settings-lede">
            Free Dictionary misses queued for Boggle dictionary cleanup. Not gated —
            anyone can open this list.
          </p>
          {undefinedWords.status === "loading" ? (
            <p className="muted">Loading…</p>
          ) : null}
          {undefinedWords.status === "error" ? (
            <p className="muted">Couldn’t load the undefined-word list.</p>
          ) : null}
          {undefinedWords.status === "ready" && undefinedWords.entries.length === 0 ? (
            <p className="muted">No undefined words recorded yet.</p>
          ) : null}
          {undefinedWords.status === "ready" && undefinedWords.entries.length > 0 ? (
            <ul className="admin-undefined-list">
              {undefinedWords.entries.map((entry) => (
                <li key={entry.word}>
                  <strong>{entry.word.toUpperCase()}</strong>
                  <span className="muted">
                    · reported {entry.reportCount}×
                    {entry.firstSeenAt
                      ? ` · first ${new Date(entry.firstSeenAt).toISOString().slice(0, 10)}`
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </Layout>
  );
}
