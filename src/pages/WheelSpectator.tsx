import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  playWheelBankrupt,
  playWheelLand,
  playWheelLetterCorrect,
  playWheelLoseTurn,
  playWheelSolve,
  playWheelSpinTick,
  playWheelVowel,
  playWinner,
  unlockAudio,
} from "../audio/sfx.ts";
import { ChaosWheel } from "../components/ChaosWheel.tsx";
import { Layout } from "../components/Layout.tsx";
import { PuzzleBoard } from "../components/PuzzleBoard.tsx";
import { WheelScoreRail } from "../components/WheelScoreRail.tsx";
import { useWheelRoom } from "../hooks/useWheelRoom.ts";

export function WheelSpectator() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const phaseRef = useRef<string | null>(null);
  const turnRef = useRef<string | null>(null);
  const spinnerIdRef = useRef<string | null>(null);
  const tickTimer = useRef<number | null>(null);

  const { state, spectate, connected } = useWheelRoom({
    code: roomCode,
    role: "spectator",
  });

  useEffect(() => {
    spectate();
  }, [spectate]);

  useEffect(() => {
    if (!state) return;
    const prevPhase = phaseRef.current;
    const prevTurn = turnRef.current;
    phaseRef.current = state.phase;
    turnRef.current = state.turnPhase;

    if (state.turnPhase === "spinning" && prevTurn !== "spinning") {
      unlockAudio();
      spinnerIdRef.current = state.currentPlayerId;
      if (tickTimer.current) window.clearInterval(tickTimer.current);
      tickTimer.current = window.setInterval(() => playWheelSpinTick(), 90);
    }
    if (prevTurn === "spinning" && state.turnPhase !== "spinning") {
      if (tickTimer.current) {
        window.clearInterval(tickTimer.current);
        tickTimer.current = null;
      }
      playWheelLand();
      const wedge = state.lastSpin ? state.wedges[state.lastSpin.wedgeIndex] : null;
      if (wedge?.kind === "bankrupt") playWheelBankrupt();
      if (
        wedge?.kind === "loseTurn" &&
        spinnerIdRef.current &&
        state.currentPlayerId !== spinnerIdRef.current
      ) {
        playWheelLoseTurn();
      }
    }
    if (state.turnPhase === "vowel" && prevTurn !== "vowel") {
      unlockAudio();
      playWheelVowel();
    }
    if (state.phase === "between" && prevPhase !== "between") playWheelSolve();
    if (state.phase === "results" && prevPhase !== "results") playWinner();
  }, [state]);

  useEffect(() => {
    return () => {
      if (tickTimer.current) window.clearInterval(tickTimer.current);
    };
  }, []);

  const currentName =
    state?.players.find((p) => p.id === state.currentPlayerId)?.name ?? null;

  return (
    <Layout title="KernelChaos · TV" playerRoom={{ code: roomCode, game: "wheel" }}>
      {!connected ? <p className="muted status-line">Connecting…</p> : null}

      {state?.phase === "lobby" ? (
        <section className="tv-lobby wheel-tv">
          <h1>Chaos Wheel</h1>
          <p className="room-code">{state.code}</p>
          <p className="muted">
            {state.players.length} player{state.players.length === 1 ? "" : "s"} · {state.roundCount}{" "}
            rounds
          </p>
          <ul className="tv-player-list">
            {state.players.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {state && (state.phase === "playing" || state.phase === "between") ? (
        <section className="wheel-tv-play">
          <PuzzleBoard
            puzzle={state.puzzle}
            large
            instant={state.phase === "between"}
            onLetterPlace={() => playWheelLetterCorrect()}
          />
          <div className="wheel-tv-stage">
            <ChaosWheel wedges={state.wedges} lastSpin={state.lastSpin} size={420} />
            <div className="wheel-tv-side">
              <p className="wheel-round-label">
                Round {state.roundIndex + 1} / {state.roundCount}
              </p>
              {currentName && state.phase === "playing" ? (
                <p className="wheel-banner">
                  {currentName}
                  {state.turnPhase === "spinning"
                    ? " spinning…"
                    : state.turnPhase === "consonant"
                      ? " calling a letter…"
                      : state.turnPhase === "vowel"
                        ? " buying a vowel…"
                        : state.turnPhase === "solve"
                          ? " solving…"
                          : " at the wheel"}
                </p>
              ) : null}
              {state.phase === "between" ? (
                <p className="wheel-banner">
                  {state.lastSolverName ? `${state.lastSolverName} solved it!` : "Solved!"}
                </p>
              ) : null}
              <WheelScoreRail players={state.players} currentPlayerId={state.currentPlayerId} />
            </div>
          </div>
        </section>
      ) : null}

      {state?.phase === "results" ? (
        <section className="wheel-tv-results">
          <h1>Final scores</h1>
          <ol>
            {state.results.map((r) => (
              <li key={r.id} className={state.winners.includes(r.id) ? "winner" : ""}>
                <span>{r.name}</span>
                <strong>{r.totalScore}</strong>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </Layout>
  );
}
