import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  playCountdownTick,
  playDupeCancel,
  playInvalidToggle,
  playLastSeconds,
  playLetterRoll,
  playReviewAdvance,
  playRoundEnd,
  playWinner,
  unlockAudio,
} from "../audio/sfx.ts";
import type { ReviewVote } from "../scatterTypes.ts";
import { Layout } from "../components/Layout.tsx";
import { LetterDie } from "../components/LetterDie.tsx";
import { OpenTvButton } from "../components/OpenTvButton.tsx";
import { ScatterLobby } from "../components/ScatterLobby.tsx";
import { ScatterReview } from "../components/ScatterReview.tsx";
import { useScattergoriesRoom } from "../hooks/useScattergoriesRoom.ts";
import { CATEGORIES_PER_LIST } from "../scatterTypes.ts";

export function ScattergoriesRoom() {
  const { code = "" } = useParams();
  const location = useLocation();
  const navName = (location.state as { name?: string } | null)?.name;
  const [name] = useState(
    () => navName || localStorage.getItem("kernelchaos.name") || "",
  );
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [answers, setAnswers] = useState<string[]>(() => Array(CATEGORIES_PER_LIST).fill(""));
  const lastTick = useRef<number | null>(null);
  const lastUrgent = useRef<number | null>(null);
  const phaseRef = useRef<string | null>(null);
  const reviewIdxRef = useRef<number | null>(null);
  const syncTimer = useRef<number | null>(null);

  const roomCode = code.toUpperCase();

  const settledRef = useRef(false);

  const {
    state,
    me,
    connected,
    diePose,
    myAnswers,
    join,
    setPackTier,
    setRoundSeconds,
    start,
    playAgain,
    sendDiePose,
    submitLetterRoll,
    submitAnswers,
    reviewNext,
    reviewPrev,
    submitReviewVotes,
    finishReview,
  } = useScattergoriesRoom({
    code: roomCode,
    onError: (message) => setError(message),
  });

  useEffect(() => {
    if (state?.phase === "rolling") settledRef.current = false;
  }, [state?.phase, state?.round]);

  useEffect(() => {
    if (!name || joined) return;
    join(name);
    setJoined(true);
  }, [join, joined, name]);

  // Restore category answers after reclaiming a seat (e.g. back from spectator).
  useEffect(() => {
    if (!myAnswers) return;
    setAnswers(myAnswers);
  }, [myAnswers]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!state) return;
    if (state.phase === "countdown" && state.countdownEndsAt) {
      const left = Math.ceil((state.countdownEndsAt - now) / 1000);
      if (left >= 1 && left <= 3 && lastTick.current !== left) {
        lastTick.current = left;
        playCountdownTick();
      }
      if (left === 3 && phaseRef.current !== "countdown") {
        playLetterRoll();
      }
    }
    if (state.phase === "playing" && state.endsAt) {
      const left = Math.ceil((state.endsAt - now) / 1000);
      if (left >= 1 && left <= 5 && lastUrgent.current !== left) {
        lastUrgent.current = left;
        playLastSeconds(left);
      }
    }
    if (phaseRef.current && phaseRef.current !== "review" && state.phase === "review") {
      playRoundEnd();
    }
    if (phaseRef.current && phaseRef.current !== "results" && state.phase === "results") {
      playWinner();
    }
    if (
      state.phase === "review" &&
      state.reviewIndex != null &&
      reviewIdxRef.current != null &&
      reviewIdxRef.current !== state.reviewIndex
    ) {
      playReviewAdvance();
      if (state.reviewAnswers?.some((a) => a.status === "duplicate")) {
        playDupeCancel();
      }
    }
    if (state.phase === "lobby" || state.phase === "rolling" || state.phase === "countdown") {
      setAnswers(Array(CATEGORIES_PER_LIST).fill(""));
      lastTick.current = null;
      lastUrgent.current = null;
    }
    phaseRef.current = state.phase;
    reviewIdxRef.current = state.reviewIndex;
  }, [now, state]);

  // Debounced answer sync while playing
  useEffect(() => {
    if (!state || state.phase !== "playing") return;
    if (syncTimer.current) window.clearTimeout(syncTimer.current);
    syncTimer.current = window.setTimeout(() => {
      submitAnswers(answers);
    }, 400);
    return () => {
      if (syncTimer.current) window.clearTimeout(syncTimer.current);
    };
  }, [answers, state, submitAnswers]);

  const joinUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/scattergories/join?code=${roomCode}`;
  }, [roomCode]);

  if (!name) {
    return (
      <Layout title="KernelChaos · Scattergories">
        <section className="entry-card">
          <p>Enter a name to join this room.</p>
          <Link className="btn primary" to={`/scattergories/join?code=${roomCode}`}>
            Join with name
          </Link>
        </section>
      </Layout>
    );
  }

  const countdownLeft =
    state?.countdownEndsAt != null
      ? Math.max(0, Math.ceil((state.countdownEndsAt - now) / 1000))
      : 0;
  const playLeft =
    state?.endsAt != null ? Math.max(0, Math.ceil((state.endsAt - now) / 1000)) : 0;

  function updateAnswer(index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function onSubmitVotes(votes: Record<string, ReviewVote>) {
    unlockAudio();
    playInvalidToggle();
    submitReviewVotes(votes);
  }

  return (
    <Layout
      title="KernelChaos · Scattergories"
      tvRoom={{
        code: roomCode,
        game: "scattergories",
        roundActive:
          state?.phase === "rolling" ||
          state?.phase === "countdown" ||
          state?.phase === "playing" ||
          state?.phase === "review",
      }}
    >
      {!connected ? <p className="muted connecting">Connecting…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {state?.phase === "lobby" ? (
        <ScatterLobby
          state={state}
          me={me}
          joinUrl={joinUrl}
          onSetPackTier={(t) => {
            unlockAudio();
            setPackTier(t);
          }}
          onSetRoundSeconds={(s) => {
            unlockAudio();
            setRoundSeconds(s);
          }}
          onStart={() => {
            unlockAudio();
            start();
          }}
        />
      ) : null}

      {state?.phase === "rolling" ? (
        <section className="scatter-rolling rise">
          <p className="lobby-label">
            {me?.id === state.rollerId
              ? "Your roll"
              : `${state.rollerName ?? "Someone"} is rolling…`}
          </p>
          <LetterDie
            key={`roll-${state.round}-${state.rollerId ?? ""}`}
            mode={me?.id === state.rollerId ? "interactive" : "remote"}
            pose={me?.id === state.rollerId ? null : diePose}
            size={280}
            onPose={
              me?.id === state.rollerId
                ? (pose) => {
                    sendDiePose(pose);
                  }
                : undefined
            }
            onSettle={
              me?.id === state.rollerId
                ? (letter) => {
                    if (settledRef.current) return;
                    settledRef.current = true;
                    unlockAudio();
                    playLetterRoll();
                    submitLetterRoll(letter);
                  }
                : undefined
            }
          />
          {me?.id === state.rollerId ? (
            <p className="muted">Drag to aim, then flick to roll</p>
          ) : null}
        </section>
      ) : null}

      {state?.phase === "countdown" ? (
        <section className="scatter-countdown rise">
          <p className="lobby-label">Get ready</p>
          <p className="scatter-letter" aria-label={`Letter ${state.letter ?? ""}`}>
            {state.letter}
          </p>
          <p className="timer">{countdownLeft || "…"}</p>
        </section>
      ) : null}

      {state?.phase === "playing" && state.categories ? (
        <section className="scatter-play">
          <header className="scatter-play-header">
            <div>
              <p className="lobby-label">Letter</p>
              <p className="scatter-letter-sm">{state.letter}</p>
            </div>
            <div
              className={`timer${
                playLeft <= 5
                  ? " is-urgent"
                  : playLeft <= 30
                    ? " is-warning"
                    : ""
              }`}
              aria-live="polite"
            >
              {formatClock(playLeft)}
            </div>
          </header>
          <form
            className="scatter-form"
            onSubmit={(e) => {
              e.preventDefault();
              submitAnswers(answers);
            }}
          >
            {state.categories.map((cat, i) => (
              <label key={`${state.listId}-${i}`} className="scatter-field">
                <span>
                  <em>{i + 1}.</em> {cat}
                </span>
                <input
                  value={answers[i] ?? ""}
                  onChange={(e) => updateAnswer(i, e.target.value)}
                  maxLength={80}
                  autoComplete="off"
                  spellCheck
                  placeholder={`${state.letter}…`}
                />
              </label>
            ))}
          </form>
        </section>
      ) : null}

      {state?.phase === "review" &&
      state.categories &&
      state.letter &&
      state.reviewIndex != null &&
      state.reviewAnswers ? (
        <ScatterReview
          key={state.reviewIndex}
          category={state.categories[state.reviewIndex] ?? ""}
          letter={state.letter}
          index={state.reviewIndex}
          total={state.categories.length}
          answers={state.reviewAnswers}
          me={me}
          reviewSubmittedBy={state.reviewSubmittedBy}
          reviewPendingVoters={state.reviewPendingVoters}
          reviewVotingComplete={state.reviewVotingComplete}
          onPrev={() => {
            unlockAudio();
            reviewPrev();
          }}
          onNext={() => {
            unlockAudio();
            reviewNext();
          }}
          onSubmitVotes={onSubmitVotes}
          onFinish={() => {
            unlockAudio();
            finishReview();
          }}
        />
      ) : null}

      {state?.phase === "results" && state.results ? (
        <section className="results scatter-results">
          <h2>Round results</h2>
          {state.winners && state.winners.length > 0 ? (
            <p className="winner-banner rise">
              {state.winners.length === 1
                ? `${state.results.find((r) => r.id === state.winners![0])?.name ?? "Winner"} wins!`
                : "It's a tie!"}
            </p>
          ) : null}
          <ol className="scoreboard">
            {state.results.map((r) => (
              <li key={r.id} className={state.winners?.includes(r.id) ? "is-winner" : ""}>
                <span>{r.name}</span>
                <strong>{r.score}</strong>
              </li>
            ))}
          </ol>
          {me?.isHost ? (
            <div className="results-actions">
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  unlockAudio();
                  start();
                }}
              >
                Play again
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  unlockAudio();
                  playAgain();
                }}
              >
                Back to lobby
              </button>
            </div>
          ) : (
            <p className="waiting">Waiting for the host…</p>
          )}
          <OpenTvButton roomCode={roomCode} game="scattergories" />
        </section>
      ) : null}
    </Layout>
  );
}

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
