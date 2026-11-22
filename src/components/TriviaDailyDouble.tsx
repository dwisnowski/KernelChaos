interface Props {
  stage: "reveal" | "wager";
  playerName?: string | null;
  maxWager?: number | null;
  category?: string | null;
}

export function TriviaDailyDouble({ stage, playerName, maxWager, category }: Props) {
  return (
    <div className={`trivia-dd trivia-dd-${stage}`} role="status">
      <p className="trivia-dd-title">DAILY DOUBLE</p>
      {stage === "wager" ? (
        <div className="trivia-dd-wager-meta">
          {playerName ? <p className="trivia-dd-player">{playerName}</p> : null}
          {category ? <p className="muted">{category}</p> : null}
          {maxWager != null ? <p className="trivia-dd-max">Max wager {maxWager}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
