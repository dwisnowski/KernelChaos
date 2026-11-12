import {
  ANSWER_STATUS_LABELS,
  type CategoryAnswerView,
  type ScatterPlayerPublic,
} from "../scatterTypes.ts";

interface Props {
  category: string;
  letter: string;
  index: number;
  total: number;
  answers: CategoryAnswerView[];
  me: ScatterPlayerPublic | null;
  onPrev: () => void;
  onNext: () => void;
  onToggleInvalid: (playerId: string) => void;
  onFinish: () => void;
  /** Compact phone layout vs big TV. */
  variant?: "player" | "tv";
}

export function ScatterReview({
  category,
  letter,
  index,
  total,
  answers,
  me,
  onPrev,
  onNext,
  onToggleInvalid,
  onFinish,
  variant = "player",
}: Props) {
  const isHost = me?.isHost ?? false;
  const isLast = index >= total - 1;

  return (
    <section className={`scatter-review scatter-review-${variant}`}>
      <p className="scatter-review-meta">
        Category {index + 1} of {total} · Letter <strong>{letter}</strong>
      </p>
      <h2 className="scatter-review-category rise">{category}</h2>
      <ul className="scatter-answer-list">
        {answers.map((a) => (
          <li
            key={a.playerId}
            className={`scatter-answer scatter-answer-${a.status}${a.hostRejected ? " is-rejected" : ""}`}
          >
            <div className="scatter-answer-main">
              <span className="scatter-answer-name">{a.playerName}</span>
              <span className="scatter-answer-raw">{a.raw || "—"}</span>
            </div>
            <div className="scatter-answer-meta">
              <em>{ANSWER_STATUS_LABELS[a.status]}</em>
              {a.points > 0 ? <strong>+{a.points}</strong> : null}
              {isHost && variant === "player" && a.raw.trim() ? (
                <button
                  type="button"
                  className="btn scatter-invalid-btn"
                  onClick={() => onToggleInvalid(a.playerId)}
                >
                  {a.hostRejected ? "Count it" : "Reject"}
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      {isHost && variant === "player" ? (
        <div className="scatter-review-nav">
          <button type="button" className="btn" disabled={index <= 0} onClick={onPrev}>
            Previous
          </button>
          {isLast ? (
            <button type="button" className="btn primary" onClick={onFinish}>
              See scores
            </button>
          ) : (
            <button type="button" className="btn primary" onClick={onNext}>
              Next category
            </button>
          )}
        </div>
      ) : (
        <p className="muted waiting">Host is revealing categories…</p>
      )}
    </section>
  );
}
