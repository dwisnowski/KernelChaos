import { useState } from "react";
import {
  ANSWER_STATUS_LABELS,
  type CategoryAnswerView,
  type ReviewPendingVoter,
  type ReviewVote,
  type ScatterPlayerPublic,
} from "../scatterTypes.ts";

interface Props {
  category: string;
  letter: string;
  index: number;
  total: number;
  answers: CategoryAnswerView[];
  me: ScatterPlayerPublic | null;
  reviewSubmittedBy: string[];
  reviewPendingVoters: ReviewPendingVoter[];
  reviewVotingComplete: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmitVotes: (votes: Record<string, ReviewVote>) => void;
  onFinish: () => void;
  /** Compact phone layout vs big TV. */
  variant?: "player" | "tv";
}

function defaultVotes(answers: CategoryAnswerView[]): Record<string, ReviewVote> {
  const votes: Record<string, ReviewVote> = {};
  for (const a of answers) {
    if (a.raw.trim()) votes[a.playerId] = "in";
  }
  return votes;
}

export function ScatterReview({
  category,
  letter,
  index,
  total,
  answers,
  me,
  reviewSubmittedBy,
  reviewPendingVoters,
  reviewVotingComplete,
  onPrev,
  onNext,
  onSubmitVotes,
  onFinish,
  variant = "player",
}: Props) {
  const isHost = me?.isHost ?? false;
  const isLast = index >= total - 1;
  const isPlayer = variant === "player" && me != null;
  const iSubmitted = me != null && reviewSubmittedBy.includes(me.id);
  const pendingNames = reviewPendingVoters.map((v) => v.name).join(", ");

  // Parent remounts with key={reviewIndex} so toggles reset per category.
  const [votes, setVotes] = useState<Record<string, ReviewVote>>(() => defaultVotes(answers));

  function setVote(playerId: string, vote: ReviewVote) {
    setVotes((prev) => ({ ...prev, [playerId]: vote }));
  }

  function handleSubmit() {
    onSubmitVotes(votes);
  }

  return (
    <section className={`scatter-review scatter-review-${variant}`}>
      <p className="scatter-review-meta">
        Category {index + 1} of {total} · Letter <strong>{letter}</strong>
      </p>
      <h2 className="scatter-review-category rise">{category}</h2>

      {!reviewVotingComplete && pendingNames ? (
        <p className="scatter-review-waiting" aria-live="polite">
          Waiting on: {pendingNames}
        </p>
      ) : null}
      {reviewVotingComplete ? (
        <p className="scatter-review-waiting is-complete" aria-live="polite">
          Votes in — majority applied
        </p>
      ) : null}

      <ul className="scatter-answer-list">
        {answers.map((a) => {
          const hasAnswer = Boolean(a.raw.trim());
          const vote = votes[a.playerId] ?? "in";
          return (
            <li
              key={a.playerId}
              className={`scatter-answer scatter-answer-${a.status}${a.hostRejected ? " is-rejected" : ""}`}
            >
              <div className="scatter-answer-main">
                <span className="scatter-answer-name">{a.playerName}</span>
                <span className="scatter-answer-raw">{a.raw || "—"}</span>
              </div>
              <div className="scatter-answer-meta">
                {reviewVotingComplete || !isPlayer ? (
                  <>
                    <em>{ANSWER_STATUS_LABELS[a.status]}</em>
                    {a.points > 0 ? <strong>+{a.points}</strong> : null}
                    {reviewVotingComplete && hasAnswer ? (
                      <span className="scatter-vote-tally">
                        In {a.votesIn} · Out {a.votesOut}
                      </span>
                    ) : null}
                  </>
                ) : null}
                {isPlayer && !reviewVotingComplete && hasAnswer ? (
                  <div className="scatter-vote-toggle" role="group" aria-label={`Vote on ${a.playerName}`}>
                    <button
                      type="button"
                      className={`btn scatter-vote-btn${vote === "in" ? " is-active" : ""}`}
                      aria-pressed={vote === "in"}
                      onClick={() => setVote(a.playerId, "in")}
                    >
                      In
                    </button>
                    <button
                      type="button"
                      className={`btn scatter-vote-btn${vote === "out" ? " is-active out" : ""}`}
                      aria-pressed={vote === "out"}
                      onClick={() => setVote(a.playerId, "out")}
                    >
                      Out
                    </button>
                  </div>
                ) : null}
                {isPlayer && !reviewVotingComplete && !hasAnswer ? (
                  <em>{ANSWER_STATUS_LABELS.empty}</em>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {isPlayer && !reviewVotingComplete ? (
        <div className="scatter-vote-actions">
          <button type="button" className="btn primary" onClick={handleSubmit}>
            {iSubmitted ? "Update votes" : "Submit votes"}
          </button>
          {iSubmitted ? <p className="muted waiting">You can change votes until everyone submits.</p> : null}
        </div>
      ) : null}

      {isHost && variant === "player" ? (
        <div className="scatter-review-nav">
          <button type="button" className="btn" disabled={index <= 0} onClick={onPrev}>
            Previous
          </button>
          {isLast ? (
            <button
              type="button"
              className="btn primary"
              disabled={!reviewVotingComplete}
              onClick={onFinish}
            >
              See scores
            </button>
          ) : (
            <button
              type="button"
              className="btn primary"
              disabled={!reviewVotingComplete}
              onClick={onNext}
            >
              Next category
            </button>
          )}
        </div>
      ) : variant === "player" && !isHost ? (
        <p className="muted waiting">
          {reviewVotingComplete ? "Host is revealing categories…" : "Submit your votes above."}
        </p>
      ) : null}
    </section>
  );
}
