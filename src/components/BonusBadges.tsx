import { BONUS_LABELS, type BonusId } from "../types.ts";

interface BonusBadgesProps {
  bonuses: BonusId[];
  className?: string;
}

export function BonusBadges({ bonuses, className = "" }: BonusBadgesProps) {
  if (!bonuses.length) return null;
  return (
    <span className={`bonus-badges${className ? ` ${className}` : ""}`}>
      {bonuses.map((id) => (
        <span key={id} className={`bonus-badge bonus-${id}`} title={BONUS_LABELS[id]}>
          {BONUS_LABELS[id]}
        </span>
      ))}
    </span>
  );
}
