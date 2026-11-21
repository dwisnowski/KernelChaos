import type { SpotItCardView, SpotItPackId } from "../spotItTypes.ts";
import { spotItSymbolLabel, spotItSymbolSrc } from "../spotItTypes.ts";

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
  return (
    <div className={`spot-it-card-wrap ${className}`.trim()}>
      {label ? <p className="spot-it-card-label">{label}</p> : null}
      <div className="spot-it-card" role="img" aria-label={label ?? "Spot It card"}>
        {card.placements.map((p, i) => {
          const src = spotItSymbolSrc(packId, p.symbolIndex);
          const name = spotItSymbolLabel(packId, p.symbolIndex);
          const style = {
            left: `${p.x * 100}%`,
            top: `${p.y * 100}%`,
            transform: `translate(-50%, -50%) rotate(${p.rotateDeg}deg) scale(${p.scale})`,
          } as const;
          if (interactive) {
            return (
              <button
                key={`${card.cardIndex}-${p.symbolIndex}-${i}`}
                type="button"
                className="spot-it-symbol"
                style={style}
                disabled={disabled}
                aria-label={name}
                onClick={() => onTapSymbol?.(p.symbolIndex)}
              >
                <img src={src} alt="" draggable={false} />
              </button>
            );
          }
          return (
            <span
              key={`${card.cardIndex}-${p.symbolIndex}-${i}`}
              className="spot-it-symbol is-static"
              style={style}
            >
              <img src={src} alt={name} draggable={false} />
            </span>
          );
        })}
      </div>
    </div>
  );
}
