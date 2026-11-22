import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
import { LetterPad } from "../components/LetterPad.tsx";
import { PuzzleBoard } from "../components/PuzzleBoard.tsx";
import { WheelLobby } from "../components/WheelLobby.tsx";
import { WheelScoreRail } from "../components/WheelScoreRail.tsx";
import { useWheelRoom } from "../hooks/useWheelRoom.ts";
import { WHEEL_VOWEL_COST } from "../wheelTypes.ts";

export function WheelRoom() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const navigate = useNavigate();
  const location = useLocation();
  const navName = (location.state as { name?: string } | null)?.name;
  const [error, setError] = useState<string | null>(null);
  const [solveText, setSolveText] = useState("");
  const phaseRef = useRef<string | null>(null);
  const turnRef = useRef<string | null>(null);
  const spinnerIdRef = useRef<string | null>(null);
  const tickTimer = useRef<number | null>(null);

  const {
    state,
    playerId,
    me,
    connected,
    join,
    setWheelRounds,
    start,
    spin,
    guessLetter,
    buyVowel,
    chooseSolve,
    solve,
    playAgain,
  } = useWheelRoom({
    code: roomCode,
    onError: setError,
  });

  useEffect(() => {
    if (!navName) return;
    join(navName);
  }, [join, navName]);

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
    if (state.phase === "between" && prevPhase !== "between") {
      playWheelSolve();
    }
    if (state.phase === "results" && prevPhase !== "results") {
      playWinner();
    }
  }, [state]);

  useEffect(() => {
    return () => {
      if (tickTimer.current) window.clearInterval(tickTimer.current);
    };
  }, []);

  const joinUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/wheel/join?code=${roomCode}`;
  }, [roomCode]);

  const isMyTurn = Boolean(me && state?.currentPlayerId === me.id);

  function onGuess(letter: string) {
    unlockAudio();
    guessLetter(letter);
  }

  function onBuyVowel() {
    unlockAudio();
    buyVowel();
  }

  function onSolveSubmit(e: FormEvent) {
    e.preventDefault();
    const g = solveText.trim();
    if (!g) return;
    unlockAudio();
    solve(g);
    setSolveText("");
  }

  if (!navName && !state) {
    return (
      <Layout title="KernelChaos · Chaos Wheel">
        <section className="entry">
          <p className="muted">Join from the entry screen with your name.</p>
          <Link className="btn" to="/wheel">
            Back to Chaos Wheel
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      title="KernelChaos · Chaos Wheel"
      tvRoom={state ? { code: roomCode, game: "wheel" } : undefined}
    >
      {!connected ? <p className="muted status-line">Connecting…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {state?.phase === "lobby" ? (
        <WheelLobby
          state={state}
          me={me}
          joinUrl={joinUrl}
          onSetRounds={setWheelRounds}
          onStart={start}
        />
      ) : null}

      {state && (state.phase === "playing" || state.phase === "between") ? (
        <section className="wheel-play">
          <header className="wheel-play-header">
            <p className="wheel-round-label">
              Round {state.roundIndex + 1} / {state.roundCount}
            </p>
            <WheelScoreRail
              players={state.players}
              currentPlayerId={state.currentPlayerId}
              myId={playerId}
            />
          </header>

          <PuzzleBoard
            puzzle={state.puzzle}
            instant={state.phase === "between"}
            onLetterPlace={() => playWheelLetterCorrect()}
          />

          <div className="wheel-stage">
            <ChaosWheel wedges={state.wedges} lastSpin={state.lastSpin} size={280} />
          </div>

          {state.phase === "between" ? (
            <p className="wheel-banner">
              {state.lastSolverName ? `${state.lastSolverName} solved it!` : "Puzzle solved!"}
            </p>
          ) : null}

          {state.phase === "playing" && isMyTurn ? (
            <div className="wheel-controls">
              {state.turnPhase === "spin" || state.turnPhase === "action" ? (
                <div className="wheel-action-row">
                  <button
                    type="button"
                    className="btn primary wheel-spin-btn"
                    onClick={() => {
                      unlockAudio();
                      spin();
                    }}
                  >
                    Spin
                  </button>
                  {state.turnPhase === "action" ? (
                    <>
                      <button
                        type="button"
                        className="btn"
                        disabled={!me || me.roundBank < WHEEL_VOWEL_COST}
                        onClick={onBuyVowel}
                      >
                        Buy vowel ({WHEEL_VOWEL_COST})
                      </button>
                      <button type="button" className="btn" onClick={() => chooseSolve()}>
                        Solve
                      </button>
                    </>
                  ) : null}
                </div>
              ) : null}

              {state.turnPhase === "spinning" ? (
                <p className="wheel-banner">Wheel spinning…</p>
              ) : null}

              {state.turnPhase === "consonant" ? (
                <>
                  <p className="wheel-banner">
                    Call a consonant
                    {state.pendingCash != null ? ` · ${state.pendingCash} each` : ""}
                  </p>
                  <LetterPad
                    mode="consonant"
                    usedLetters={state.usedLetters}
                    onPick={onGuess}
                  />
                </>
              ) : null}

              {state.turnPhase === "vowel" ? (
                <>
                  <p className="wheel-banner">Pick a vowel</p>
                  <LetterPad mode="vowel" usedLetters={state.usedLetters} onPick={onGuess} />
                </>
              ) : null}

              {state.turnPhase === "solve" ? (
                <form className="wheel-solve-form" onSubmit={onSolveSubmit}>
                  <label className="field">
                    <span>Solve the puzzle</span>
                    <input
                      value={solveText}
                      onChange={(e) => setSolveText(e.target.value)}
                      autoComplete="off"
                      autoCapitalize="characters"
                      placeholder="Your guess"
                    />
                  </label>
                  <button className="btn primary" type="submit">
                    Submit solve
                  </button>
                </form>
              ) : null}
            </div>
          ) : null}

          {state.phase === "playing" && !isMyTurn ? (
            <p className="wheel-banner muted">
              Waiting on{" "}
              {state.players.find((p) => p.id === state.currentPlayerId)?.name ?? "someone"}…
            </p>
          ) : null}

          <p className="used-letters muted">
            Used: {state.usedLetters.length ? state.usedLetters.join(" ") : "—"}
          </p>
        </section>
      ) : null}

      {state?.phase === "results" ? (
        <section className="wheel-results">
          <h2>Final scores</h2>
          <ol>
            {state.results.map((r) => (
              <li key={r.id} className={state.winners.includes(r.id) ? "winner" : ""}>
                <span>{r.name}</span>
                <strong>{r.totalScore}</strong>
              </li>
            ))}
          </ol>
          {me?.isHost ? (
            <button type="button" className="btn primary" onClick={playAgain}>
              Back to lobby
            </button>
          ) : (
            <p className="muted">Waiting for host…</p>
          )}
          <button type="button" className="btn" onClick={() => navigate("/wheel")}>
            Leave
          </button>
        </section>
      ) : null}
    </Layout>
  );
}
