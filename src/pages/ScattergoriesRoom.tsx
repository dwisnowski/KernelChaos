import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

function subscribeHoverNone(onStoreChange: () => void): () => void {
  const mq = window.matchMedia("(hover: none)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getHoverNone(): boolean {
  return window.matchMedia("(hover: none)").matches;
}
import {
  playCountdownTick,
  playDupeCancel,
  playInvalidToggle,
  playLastSeconds,
  playLetterRoll,
  playReject,
  playReviewAdvance,
  playRoundEnd,
  playWinner,
  playWordFound,
  unlockAudio,
} from "../audio/sfx.ts";
import type { HuntFindResultMessage, HuntMark, ReviewVote } from "../scatterTypes.ts";
import { HuntReview } from "../components/HuntReview.tsx";
import { HuntScenePins } from "../components/HuntScenePins.tsx";
import { Layout } from "../components/Layout.tsx";
import { LetterDie } from "../components/LetterDie.tsx";
import { ScatterLobby } from "../components/ScatterLobby.tsx";
import { ScatterReview } from "../components/ScatterReview.tsx";
import { useScattergoriesRoom } from "../hooks/useScattergoriesRoom.ts";
import { CATEGORIES_PER_LIST, HUNT_MAX_ANSWERS } from "../scatterTypes.ts";

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
  const [huntDraft, setHuntDraft] = useState("");
  const [huntDraftMark, setHuntDraftMark] = useState<HuntMark | null>(null);
  const [huntAnnotating, setHuntAnnotating] = useState(false);
  const [huntFlash, setHuntFlash] = useState<"ok" | "bad" | null>(null);
  const [huntMagnify, setHuntMagnify] = useState(false);
  const [huntZoomReset, setHuntZoomReset] = useState(0);
  const touchHunt = useSyncExternalStore(subscribeHoverNone, getHoverNone, () => false);
  const lastTick = useRef<number | null>(null);
  const lastUrgent = useRef<number | null>(null);
  const phaseRef = useRef<string | null>(null);
  const reviewIdxRef = useRef<number | null>(null);
  const syncTimer = useRef<number | null>(null);
  const flashTimer = useRef<number | null>(null);

  const roomCode = code.toUpperCase();

  const settledRef = useRef(false);

  const onHuntFindResult = (msg: HuntFindResultMessage) => {
    unlockAudio();
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    if (msg.ok) {
      playWordFound(Math.max(3, msg.word?.length ?? 4));
      setHuntFlash("ok");
      setHuntDraft("");
      setHuntDraftMark(null);
      setHuntAnnotating(false);
      setHuntZoomReset((n) => n + 1);
    } else {
      playReject();
      setHuntFlash("bad");
    }
    flashTimer.current = window.setTimeout(() => setHuntFlash(null), 420);
  };

  const {
    state,
    me,
    connected,
    diePose,
    myAnswers,
    myFindMarks,
    huntProgress,
    join,
    setPackTier,
    setPlayMode,
    setHuntPack,
    setRoundSeconds,
    start,
    playAgain,
    sendDiePose,
    submitLetterRoll,
    submitAnswers,
    submitHuntFind,
    reviewNext,
    reviewPrev,
    submitReviewVotes,
    skipReviewVoter,
    finishReview,
  } = useScattergoriesRoom({
    code: roomCode,
    onError: (message) => setError(message),
    onHuntFindResult,
  });

  const isHunt = state?.playMode === "hunt";
  const huntFinds = isHunt ? (myAnswers ?? []) : [];
  const huntMarks = isHunt ? (myFindMarks ?? []) : [];

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
    if (
      phaseRef.current &&
      phaseRef.current === "playing" &&
      state.phase === "results" &&
      state.playMode === "hunt"
    ) {
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
      setAnswers(
        state.playMode === "hunt" ? [] : Array(CATEGORIES_PER_LIST).fill(""),
      );
      setHuntDraft("");
      setHuntDraftMark(null);
      lastTick.current = null;
      lastUrgent.current = null;
    }
    phaseRef.current = state.phase;
    reviewIdxRef.current = state.reviewIndex;
  }, [now, state]);

  // Debounced answer sync while playing (categories only — hunt uses submitHuntFind)
  useEffect(() => {
    if (!state || state.phase !== "playing") return;
    if (state.playMode === "hunt") return;
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
          onSetPlayMode={(mode) => {
            unlockAudio();
            setPlayMode(mode);
          }}
          onSetHuntPack={(packId) => {
            unlockAudio();
            setHuntPack(packId);
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
          {isHunt && state.sceneTitle ? (
            <p className="muted">{state.sceneTitle}</p>
          ) : null}
          <p className="timer">{countdownLeft || "…"}</p>
        </section>
      ) : null}

      {state?.phase === "playing" && isHunt && state.sceneImageUrl ? (
        <section
          className={`scatter-play scatter-hunt-play${touchHunt ? " is-touch-hunt" : ""}${
            huntFlash === "ok" ? " hunt-flash-ok" : huntFlash === "bad" ? " hunt-flash-bad" : ""
          }`}
        >
          <header className="scatter-play-header">
            <div>
              <p className="lobby-label">Letter</p>
              <p className="scatter-letter-sm">{state.letter}</p>
            </div>
            <p className="muted hunt-find-count">
              {huntProgress?.matchedCount ?? huntFinds.length}/{HUNT_MAX_ANSWERS} finds
            </p>
            {!touchHunt ? (
              <button
                type="button"
                className={`size-pill hunt-magnify-toggle${huntMagnify ? " is-active" : ""}`}
                aria-pressed={huntMagnify}
                onClick={() => {
                  unlockAudio();
                  setHuntMagnify((v) => !v);
                }}
              >
                Magnify
              </button>
            ) : null}
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
          {touchHunt && huntFinds.length > 0 ? (
            <ul className="hunt-find-chips" aria-label="Your finds">
              {huntFinds.map((word, i) => (
                <li key={`${word}-${i}`}>
                  <span>{word}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className={`hunt-play-layout${!touchHunt && huntFinds.length === 0 ? " is-scene-only" : ""}`}>
            {!touchHunt && huntFinds.length > 0 ? (
              <div className="hunt-play-side">
                <ul className="hunt-find-list" aria-label="Your finds">
                  {huntFinds.map((word, i) => (
                    <li key={`${word}-${i}`}>
                      <span>{word}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="hunt-play-main">
              <HuntScenePins
                imageUrl={state.sceneImageUrl}
                alt={state.sceneTitle ?? "Hidden object scene"}
                draft={huntDraftMark}
                magnify={!touchHunt && huntMagnify}
                mobileZoom={touchHunt}
                zoomResetKey={huntZoomReset}
                draftInteractive={touchHunt && !!huntDraftMark && !huntAnnotating}
                onDraftActivate={() => {
                  unlockAudio();
                  setHuntAnnotating(true);
                }}
                annotating={huntAnnotating}
                annotateMode={touchHunt ? "overlay" : "popover"}
                pins={huntFinds.map((word, i) => ({
                  key: `mine-${i}`,
                  x: huntMarks[i]?.x ?? 0.5,
                  y: huntMarks[i]?.y ?? 0.5,
                  label: word,
                  tone: "mine" as const,
                }))}
                onImageClick={(norm) => {
                  if (huntFinds.length >= HUNT_MAX_ANSWERS) return;
                  unlockAudio();
                  setHuntDraftMark(norm);
                  setHuntDraft("");
                  if (touchHunt) setHuntAnnotating(false);
                  else setHuntAnnotating(true);
                }}
                draftPopover={
                  huntDraftMark && huntAnnotating ? (
                    <form
                      className={`scatter-form hunt-find-form${
                        touchHunt ? " hunt-find-form-overlay" : " hunt-find-form-popover"
                      }`}
                      onSubmit={(e) => {
                        e.preventDefault();
                        const next = huntDraft.trim();
                        if (!next || !huntDraftMark || huntFinds.length >= HUNT_MAX_ANSWERS)
                          return;
                        unlockAudio();
                        submitHuntFind(next, huntDraftMark.x, huntDraftMark.y);
                      }}
                    >
                      <label className="scatter-field">
                        <span>
                          Starts with <em>{state.letter}</em>
                        </span>
                        <input
                          value={huntDraft}
                          onChange={(e) => setHuntDraft(e.target.value)}
                          maxLength={80}
                          autoComplete="off"
                          spellCheck
                          placeholder={`${state.letter}…`}
                        />
                      </label>
                      <div className="hunt-find-form-actions">
                        <button
                          type="submit"
                          className="btn primary"
                          disabled={!huntDraft.trim()}
                        >
                          Pin
                        </button>
                        <button
                          type="button"
                          className="btn ghost"
                          onClick={() => {
                            setHuntAnnotating(false);
                            setHuntDraft("");
                            if (!touchHunt) setHuntDraftMark(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : null
                }
                caption={touchHunt ? undefined : state.sceneTitle}
                className="hunt-scene-play"
              />
            </div>
          </div>
        </section>
      ) : null}

      {state?.phase === "playing" && !isHunt && state.categories ? (
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
      isHunt &&
      state.letter &&
      state.sceneImageUrl &&
      state.reviewAnswers ? (
        <HuntReview
          key={`hunt-review-${state.round}`}
          letter={state.letter}
          sceneImageUrl={state.sceneImageUrl}
          sceneTitle={state.sceneTitle}
          answers={state.reviewAnswers}
          me={me}
          reviewSubmittedBy={state.reviewSubmittedBy}
          reviewPendingVoters={state.reviewPendingVoters}
          reviewVotingComplete={state.reviewVotingComplete}
          onSubmitVotes={onSubmitVotes}
          onSkipVoter={(voterId) => {
            unlockAudio();
            skipReviewVoter(voterId);
          }}
          onFinish={() => {
            unlockAudio();
            finishReview();
          }}
        />
      ) : null}

      {state?.phase === "review" &&
      !isHunt &&
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
          onSkipVoter={(voterId) => {
            unlockAudio();
            skipReviewVoter(voterId);
          }}
          onFinish={() => {
            unlockAudio();
            finishReview();
          }}
        />
      ) : null}

      {state?.phase === "results" && state.results ? (
        <section
          className={`results scatter-results${isHunt ? " hunt-results" : ""}`}
        >
          <div className={isHunt ? "hunt-results-layout" : undefined}>
            <div className={isHunt ? "hunt-results-side" : undefined}>
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
                  <li
                    key={r.id}
                    className={state.winners?.includes(r.id) ? "is-winner" : ""}
                  >
                    <span>{r.name}</span>
                    <strong>{r.score}</strong>
                  </li>
                ))}
              </ol>
              {isHunt
                ? state.results.map((r) => (
                    <div key={`finds-${r.id}`} className="hunt-result-block">
                      <h3>
                        {r.name} · {r.score} pt{r.score === 1 ? "" : "s"}
                      </h3>
                      <ul className="hunt-find-list is-results">
                        {r.answers
                          .map((word, i) => ({
                            word,
                            pts: r.categoryPoints[i] ?? 0,
                          }))
                          .filter((x) => x.word.trim())
                          .map((x, i) => (
                            <li
                              key={`${r.id}-${i}`}
                              className={x.pts > 0 ? "is-scored" : "is-miss"}
                            >
                              <span>{x.word}</span>
                              <strong>{x.pts > 0 ? "+1" : "0"}</strong>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))
                : null}
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
            </div>
            {isHunt && state.sceneImageUrl ? (
              <HuntScenePins
                imageUrl={state.sceneImageUrl}
                alt={state.sceneTitle ?? "Hidden object scene"}
                pins={state.results.flatMap((r) =>
                  r.answers
                    .map((word, i) => ({
                      word,
                      pts: r.categoryPoints[i] ?? 0,
                      mark: r.findMarks?.[i],
                    }))
                    .filter((x) => x.word.trim() && x.pts > 0 && x.mark)
                    .map((x, i) => ({
                      key: `${r.id}-${i}`,
                      x: x.mark!.x,
                      y: x.mark!.y,
                      label: x.word,
                      tone: "ok" as const,
                    })),
                )}
                caption={state.sceneTitle}
                className="hunt-scene-review"
              />
            ) : null}
          </div>
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
