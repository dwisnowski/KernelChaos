import { useState } from "react";
import {
  ANSWER_STATUS_LABELS,
  type CategoryAnswerView,
  type ReviewPendingVoter,
  type ReviewVote,
  type ScatterPlayerPublic,
} from "../scatterTypes.ts";
import { HuntScenePins } from "./HuntScenePins.tsx";

interface Props {
  letter: string;
  sceneImageUrl: string;
  sceneTitle: string | null;
  answers: CategoryAnswerView[];
  me: ScatterPlayerPublic | null;
  reviewSubmittedBy: string[];
  reviewPendingVoters: ReviewPendingVoter[];
  reviewVotingComplete: boolean;
  onSubmitVotes: (votes: Record<string, ReviewVote>) => void;
  onSkipVoter?: (voterId: string) => void;
  onFinish: () => void;
  variant?: "player" | "tv";
}

function voteKey(a: CategoryAnswerView): string {
  return a.findKey ?? a.playerId;
}

function defaultVotes(answers: CategoryAnswerView[]): Record<string, ReviewVote> {
  const votes: Record<string, ReviewVote> = {};
  for (const a of answers) {
    if (a.raw.trim()) votes[voteKey(a)] = "in";
  }
  return votes;
}

export function HuntReview({
  letter,
  sceneImageUrl,
  sceneTitle,
  answers,
  me,
  reviewSubmittedBy,
  reviewPendingVoters,
  reviewVotingComplete,
  onSubmitVotes,
  onSkipVoter,
  onFinish,
  variant = "player",
}: Props) {
  const isHost = me?.isHost ?? false;
  const isPlayer = variant === "player" && me != null;
  const iSubmitted = me != null && reviewSubmittedBy.includes(me.id);
  const pendingNames = reviewPendingVoters.map((v) => v.name).join(", ");
  const hostCanPass =
    isHost && variant === "player" && !reviewVotingComplete && Boolean(onSkipVoter);

  const [votes, setVotes] = useState(() => defaultVotes(answers));
  const [focusKey, setFocusKey] = useState<string | null>(
    () => answers.find((a) => a.raw.trim())?.findKey ?? null,
  );

  function setVote(key: string, vote: ReviewVote) {
    setVotes((prev) => ({ ...prev, [key]: vote }));
  }

  const pins = answers
    .filter((a) => a.raw.trim() && a.x != null && a.y != null)
    .map((a) => ({
      key: voteKey(a),
      x: a.x!,
      y: a.y!,
      label: a.raw,
      active: focusKey === voteKey(a),
      tone: (a.hostRejected || a.status === "rejected"
        ? "bad"
        : a.status === "unique" && reviewVotingComplete
          ? "ok"
          : a.playerId === me?.id
            ? "mine"
            : "peer") as "mine" | "peer" | "ok" | "bad",
    }));

  return (
    <section className={`hunt-review hunt-review-${variant}`}>
      <header className="hunt-review-header">
        <p className="lobby-label">Review finds · Letter <strong>{letter}</strong></p>
        {!reviewVotingComplete && reviewPendingVoters.length > 0 ? (
          hostCanPass ? (
            <div className="scatter-review-waiting" aria-live="polite">
              <span className="scatter-review-waiting-label">Waiting on:</span>
              <ul className="scatter-pending-list">
                {reviewPendingVoters.map((v) => (
                  <li key={v.id} className="scatter-pending-item">
                    <span>{v.name}</span>
                    <button
                      type="button"
                      className="btn scatter-pass-btn"
                      onClick={() => onSkipVoter?.(v.id)}
                    >
                      Pass
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="scatter-review-waiting" aria-live="polite">
              Waiting on: {pendingNames}
            </p>
          )
        ) : null}
        {reviewVotingComplete ? (
          <p className="scatter-review-waiting is-complete" aria-live="polite">
            Votes in — majority applied
          </p>
        ) : null}
      </header>

      <div className="hunt-review-layout">
        <HuntScenePins
          imageUrl={sceneImageUrl}
          alt={sceneTitle ?? "Hidden object scene"}
          pins={pins}
          caption={sceneTitle}
          className="hunt-scene-review"
        />

        <div className="hunt-review-side">
          <ul className="scatter-answer-list hunt-review-list">
            {answers.map((a) => {
              const key = voteKey(a);
              const hasAnswer = Boolean(a.raw.trim());
              const vote = votes[key] ?? "in";
              return (
                <li
                  key={key}
                  className={`scatter-answer scatter-answer-${a.status}${a.hostRejected ? " is-rejected" : ""}${focusKey === key ? " is-focused" : ""}`}
                >
                  <button
                    type="button"
                    className="hunt-review-focus"
                    onClick={() => setFocusKey(key)}
                  >
                    <span className="scatter-answer-name">{a.playerName}</span>
                    <span className="scatter-answer-raw">{a.raw || "—"}</span>
                  </button>
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
                      <div
                        className="scatter-vote-toggle"
                        role="group"
                        aria-label={`Vote on ${a.raw}`}
                      >
                        <button
                          type="button"
                          className={`btn scatter-vote-btn${vote === "in" ? " is-active" : ""}`}
                          aria-pressed={vote === "in"}
                          onClick={() => setVote(key, "in")}
                        >
                          In
                        </button>
                        <button
                          type="button"
                          className={`btn scatter-vote-btn${vote === "out" ? " is-active out" : ""}`}
                          aria-pressed={vote === "out"}
                          onClick={() => setVote(key, "out")}
                        >
                          Out
                        </button>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>

          {isPlayer && !reviewVotingComplete ? (
            <div className="scatter-vote-actions">
              <button type="button" className="btn primary" onClick={() => onSubmitVotes(votes)}>
                {iSubmitted ? "Update votes" : "Submit votes"}
              </button>
              {iSubmitted ? (
                <p className="muted waiting">You can change votes until everyone submits.</p>
              ) : null}
            </div>
          ) : null}

          {isHost && variant === "player" ? (
            <div className="scatter-review-nav">
              <button
                type="button"
                className="btn primary"
                disabled={!reviewVotingComplete}
                onClick={onFinish}
              >
                See scores
              </button>
            </div>
          ) : variant === "player" && !isHost ? (
            <p className="muted waiting">
              {reviewVotingComplete ? "Waiting for the host…" : "Submit your votes above."}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
