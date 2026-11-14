import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  playCountdownTick,
  playDupeCancel,
  playLetterRoll,
  playReviewAdvance,
  playRoundEnd,
  playWinner,
  unlockAudio,
} from "../audio/sfx.ts";
import { Layout } from "../components/Layout.tsx";
import { LetterDie } from "../components/LetterDie.tsx";
import { ScatterReview } from "../components/ScatterReview.tsx";
import { useScattergoriesRoom } from "../hooks/useScattergoriesRoom.ts";

export function ScattergoriesSpectator() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [joined, setJoined] = useState(false);
  const phaseRef = useRef<string | null>(null);
  const reviewIdxRef = useRef<number | null>(null);
  const lastTick = useRef<number | null>(null);

  const { state, connected, diePose, spectate } = useScattergoriesRoom({
    code: roomCode,
    role: "spectator",
    onError: (message) => setError(message),
  });

  useEffect(() => {
    if (joined) return;
    spectate();
    setJoined(true);
  }, [joined, spectate]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!state) return;
    unlockAudio();
    if (state.phase === "countdown" && state.countdownEndsAt) {
      const left = Math.ceil((state.countdownEndsAt - now) / 1000);
      if (left >= 1 && left <= 3 && lastTick.current !== left) {
        lastTick.current = left;
        playCountdownTick();
      }
      if (phaseRef.current !== "countdown") playLetterRoll();
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
      if (state.reviewAnswers?.some((a) => a.status === "duplicate")) playDupeCancel();
    }
    phaseRef.current = state.phase;
    reviewIdxRef.current = state.reviewIndex;
  }, [now, state]);

  const joinUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/scattergories/join?code=${roomCode}`;
  }, [roomCode]);

  const countdownLeft =
    state?.countdownEndsAt != null
      ? Math.max(0, Math.ceil((state.countdownEndsAt - now) / 1000))
      : 0;
  const playLeft =
    state?.endsAt != null ? Math.max(0, Math.ceil((state.endsAt - now) / 1000)) : 0;

  return (
    <Layout
      title="KernelChaos · TV"
      playerRoom={{ code: roomCode, game: "scattergories" }}
    >
      <section className="spectator-screen">
        {!connected ? <p className="muted connecting">Connecting…</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {!state ? (
          <p className="muted">Opening room {roomCode}…</p>
        ) : state.phase === "lobby" ? (
          <div className="spectator-lobby">
            <div className="spectator-lobby-main">
              <p className="lobby-label">Room code</p>
              <p className="room-code" aria-label={`Room code ${state.code}`}>
                {state.code}
              </p>
              <p className="spectator-tag">TV spectator · Scattergories</p>
              <div className="qr-wrap">
                <QRCodeSVG
                  value={joinUrl}
                  size={240}
                  level="M"
                  includeMargin
                  bgColor="#f2f5fa"
                  fgColor="#0e1f35"
                />
              </div>
              <p className="muted qr-hint">Players scan to join on their phones</p>
            </div>
            <ul className="spectator-roster" aria-label="Players">
              {state.players.map((p) => (
                <li key={p.id}>
                  <span>{p.name}</span>
                  {p.isHost ? <em>host</em> : null}
                </li>
              ))}
              {state.players.length === 0 ? <li className="muted">Waiting for players…</li> : null}
            </ul>
          </div>
        ) : null}

        {state?.phase === "rolling" ? (
          <div className="spectator-rolling rise">
            <p className="lobby-label">{state.rollerName ?? "Someone"} is rolling…</p>
            <LetterDie
              key={`tv-roll-${state.round}-${state.rollerId ?? ""}`}
              mode="remote"
              pose={diePose}
              size={360}
            />
          </div>
        ) : null}

        {state?.phase === "countdown" ? (
          <div className="spectator-countdown rise">
            <p className="lobby-label">Letter</p>
            <p className="scatter-letter">{state.letter}</p>
            <p className="timer">{countdownLeft || "…"}</p>
          </div>
        ) : null}

        {state?.phase === "playing" && state.categories ? (
          <div className="spectator-scatter-play">
            <header className="spectator-scatter-header">
              <div>
                <p className="lobby-label">Letter</p>
                <p className="scatter-letter">{state.letter}</p>
              </div>
              <div className={`timer${playLeft <= 5 ? " is-urgent" : ""}`}>
                {formatClock(playLeft)}
              </div>
            </header>
            <ol className="spectator-category-list">
              {state.categories.map((cat, i) => (
                <li key={`${state.listId}-${i}`}>{cat}</li>
              ))}
            </ol>
            <ul className="spectator-progress" aria-label="Player progress">
              {[...state.players]
                .sort((a, b) => b.answerCount - a.answerCount || a.name.localeCompare(b.name))
                .map((p) => (
                  <li key={p.id}>
                    <span>{p.name}</span>
                    <strong>
                      {p.answerCount}/{state.categories!.length}
                    </strong>
                  </li>
                ))}
            </ul>
          </div>
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
            me={null}
            reviewSubmittedBy={state.reviewSubmittedBy}
            reviewPendingVoters={state.reviewPendingVoters}
            reviewVotingComplete={state.reviewVotingComplete}
            onPrev={() => undefined}
            onNext={() => undefined}
            onSubmitVotes={() => undefined}
            onFinish={() => undefined}
            variant="tv"
          />
        ) : null}

        {state?.phase === "results" && state.results ? (
          <div className="spectator-results">
            <h2>Scores</h2>
            {state.winners && state.winners.length > 0 ? (
              <p className="winner-banner rise">
                {state.winners.length === 1
                  ? `${state.results.find((r) => r.id === state.winners![0])?.name ?? "Winner"} wins!`
                  : "It's a tie!"}
              </p>
            ) : null}
            <ol className="scoreboard spectator-scoreboard">
              {state.results.map((r) => (
                <li key={r.id} className={state.winners?.includes(r.id) ? "is-winner" : ""}>
                  <span>{r.name}</span>
                  <strong>{r.score}</strong>
                </li>
              ))}
            </ol>
            <p className="muted">
              <Link to="/scattergories">Back to Scattergories</Link>
            </p>
          </div>
        ) : null}
      </section>
    </Layout>
  );
}

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
