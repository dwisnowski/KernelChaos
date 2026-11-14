import { ORB_COLORS, ORB_COLOR_HEX, ORB_COLOR_LABELS, type OrbColor } from "../mmmmsTypes.ts";

interface Props {
  disabled?: boolean;
  selected?: OrbColor | null;
  onSelect: (color: OrbColor) => void;
  label: string;
}

export function ColorPalette({ disabled = false, selected = null, onSelect, label }: Props) {
  return (
    <div className="color-palette" role="group" aria-label={label}>
      {ORB_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={`color-swatch${selected === color ? " is-selected" : ""}`}
          style={{ ["--orb-color" as string]: ORB_COLOR_HEX[color] }}
          disabled={disabled}
          aria-label={ORB_COLOR_LABELS[color]}
          aria-pressed={selected === color}
          onClick={() => onSelect(color)}
        >
          <span className="color-swatch-dot" aria-hidden="true" />
          <span className="color-swatch-name">{ORB_COLOR_LABELS[color]}</span>
        </button>
      ))}
    </div>
  );
}
