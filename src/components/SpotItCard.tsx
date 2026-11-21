import type { SpotItCardView, SpotItPackId } from "../spotItTypes.ts";
import { isKanaPack, spotItSymbolKana, spotItSymbolLabel, spotItSymbolSrc } from "../spotItTypes.ts";

interface Props {
  card: SpotItCardView;
  packId: SpotItPackId;
  label?: string;
  interactive?: boolean;
  disabled?: boolean;
  onTapSymbol?: (symbolIndex: number) => void;
  className?: string;
}

export function SpotItCard({
  card,
  packId,
  label,
  interactive = false,
  disabled = false,
  onTapSymbol,
  className = "",
}: Props) {
  const kana = isKanaPack(packId);

  return (
    <div className={`spot-it-card-wrap ${className}`.trim()}>
      {label ? <p className="spot-it-card-label">{label}</p> : null}
      <div className="spot-it-card" role="img" aria-label={label ?? "Spot It card"}>
        {card.placements.map((p, i) => {
          const name = spotItSymbolLabel(packId, p.symbolIndex);
          const style = {
            left: `${p.x * 100}%`,
            top: `${p.y * 100}%`,
            transform: `translate(-50%, -50%) rotate(${p.rotateDeg}deg) scale(${p.scale})`,
          } as const;
          const glyph = kana ? (
            <span className="spot-it-kana-glyph" aria-hidden>
              {spotItSymbolKana(packId, p.symbolIndex) ?? "?"}
            </span>
          ) : (
            <img src={spotItSymbolSrc(packId, p.symbolIndex) ?? ""} alt="" draggable={false} />
          );
          if (interactive) {
            return (
              <button
                key={`${card.cardIndex}-${p.symbolIndex}-${i}`}
                type="button"
                className={`spot-it-symbol${kana ? " is-kana" : ""}`}
                style={style}
                disabled={disabled}
                aria-label={name}
                onClick={() => onTapSymbol?.(p.symbolIndex)}
              >
                {glyph}
              </button>
            );
          }
          return (
            <span
              key={`${card.cardIndex}-${p.symbolIndex}-${i}`}
              className={`spot-it-symbol is-static${kana ? " is-kana" : ""}`}
              style={style}
              aria-label={name}
            >
              {kana ? (
                glyph
              ) : (
                <img
                  src={spotItSymbolSrc(packId, p.symbolIndex) ?? ""}
                  alt={name}
                  draggable={false}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
