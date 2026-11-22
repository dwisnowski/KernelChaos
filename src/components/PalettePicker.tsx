import { useState } from "react";
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

function initialState(): { stored: StoredPalette; colors: PaletteColors } {
  const stored = loadStoredPalette();
  return { stored, colors: resolveColors(stored) };
}

interface Props {
  /** Denser layout for the header popover. */
  compact?: boolean;
  /** Extra class on the root (e.g. popover body). */
  className?: string;
  /** Show the Reset button (default true). */
  showReset?: boolean;
}

export function PalettePicker({
  compact = false,
  className = "",
  showReset = true,
}: Props) {
  const [{ stored, colors }, setState] = useState(initialState);
  const [hexDrafts, setHexDrafts] = useState<Partial<Record<keyof PaletteColors, string>>>({});

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
  const idPrefix = compact ? "popover-palette" : "palette";

  return (
    <div
      className={`palette-picker${compact ? " is-compact" : ""}${className ? ` ${className}` : ""}`}
    >
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
                {!compact ? <p className="preset-card-blurb">{preset.blurb}</p> : null}
                <div className="preset-swatches" aria-hidden="true">
                  {[
                    preset.colors.accent,
                    preset.colors.accent2,
                    preset.colors.glow0,
                    preset.colors.bg0,
                  ].map((swatch, i) => (
                    <span
                      key={i}
                      className="preset-swatch"
                      style={{ background: swatch }}
                    />
                  ))}
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
            const inputId = `${idPrefix}-${key}`;
            return (
              <div key={key} className="custom-color-row">
                <label htmlFor={inputId}>{label}</label>
                <input
                  id={inputId}
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

      {showReset ? (
        <div className="settings-actions">
          <button type="button" className="btn" onClick={resetClassic}>
            Reset to {getPreset(DEFAULT_PALETTE_ID).name}
          </button>
        </div>
      ) : null}
    </div>
  );
}
