import type { WheelPlayerPublic } from "../wheelTypes.ts";

interface Props {
  players: WheelPlayerPublic[];
  currentPlayerId: string | null;
  myId?: string | null;
  jackpot?: number;
}

export function WheelScoreRail({ players, currentPlayerId, myId, jackpot }: Props) {
  return (
    <div className="wheel-score-wrap">
      {typeof jackpot === "number" ? (
        <p className="wheel-jackpot" aria-label={`Jackpot ${jackpot}`}>
          Jackpot <strong>{jackpot}</strong>
        </p>
      ) : null}
      <ul className="wheel-score-rail">
        {players.map((p) => (
          <li
            key={p.id}
            className={[
              "wheel-score-seat",
              p.id === currentPlayerId ? "active" : "",
              p.id === myId ? "me" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="wheel-score-name">
              {p.name}
              {p.freeSpins > 0 ? <em className="wheel-free-spin">×{p.freeSpins}</em> : null}
              {p.insurance ? <em className="wheel-insurance">INS</em> : null}
            </span>
            <span className="wheel-score-banks">
              <span className="wheel-round-bank">{p.roundBank}</span>
              <span className="wheel-total-score">{p.totalScore}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
