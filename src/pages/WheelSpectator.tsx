import { useEffect, useMemo, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useParams } from "react-router-dom";
import {
  playWheelLand,
  playWheelLetterCorrect,
  playWheelSolve,
  playWheelSpecial,
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
import { WHEEL_OUTCOME_BLURBS, WHEEL_OUTCOME_LABELS } from "../wheelTypes.ts";

export function WheelSpectator() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const phaseRef = useRef<string | null>(null);
  const turnRef = useRef<string | null>(null);
  const outcomeRef = useRef<string | null>(null);
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
      if (tickTimer.current) window.clearInterval(tickTimer.current);
      tickTimer.current = window.setInterval(() => playWheelSpinTick(), 90);
    }
    if (prevTurn === "spinning" && state.turnPhase !== "spinning") {
      if (tickTimer.current) {
        window.clearInterval(tickTimer.current);
        tickTimer.current = null;
      }
      playWheelLand();
      if (state.lastOutcome) playWheelSpecial(state.lastOutcome);
      outcomeRef.current = state.lastOutcome;
    } else if (state.lastOutcome && state.lastOutcome !== outcomeRef.current) {
      if (state.lastOutcome === "speedTimeout" || state.lastOutcome === "payEachFail") {
        playWheelSpecial(state.lastOutcome);
      }
      outcomeRef.current = state.lastOutcome;
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

  const joinUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/wheel/join?code=${roomCode}`;
  }, [roomCode]);

  const currentName =
    state?.players.find((p) => p.id === state.currentPlayerId)?.name ?? null;

  return (
    <Layout title="KernelChaos · TV" playerRoom={{ code: roomCode, game: "wheel" }}>
      {!connected ? <p className="muted status-line">Connecting…</p> : null}

      {state?.phase === "lobby" ? (
        <section className="spectator-screen">
          <div className="spectator-lobby">
            <div className="spectator-lobby-main">
              <p className="lobby-label">Room code</p>
              <p className="room-code" aria-label={`Room code ${state.code}`}>
                {state.code}
              </p>
              <p className="spectator-tag">
                TV spectator · Chaos Wheel · {state.roundCount} rounds
              </p>
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
              {state.players.length === 0 ? (
                <li className="muted">Waiting for players…</li>
              ) : null}
            </ul>
          </div>
        </section>
      ) : null}

      {state && (state.phase === "playing" || state.phase === "between") ? (
        <section className="wheel-tv-play">
          <header className="wheel-tv-title">
            <div className="wheel-tv-title-main">
              <h1>Chaos Wheel</h1>
              <p className="wheel-tv-rounds">{state.roundCount} rounds</p>
              <p className="room-code wheel-tv-code" aria-label={`Room code ${state.code}`}>
                {state.code}
              </p>
            </div>
            <div className="wheel-tv-join">
              <div className="qr-wrap wheel-tv-qr">
                <QRCodeSVG
                  value={joinUrl}
                  size={96}
                  level="M"
                  includeMargin
                  bgColor="#f2f5fa"
                  fgColor="#0e1f35"
                />
              </div>
              <p className="muted wheel-tv-join-hint">Scan to join</p>
            </div>
          </header>
          <PuzzleBoard
            puzzle={state.puzzle}
            large
            instant={state.phase === "between"}
            onLetterPlace={() => playWheelLetterCorrect()}
          />
          <div className="wheel-tv-stage">
            <div className="wheel-tv-wheel-col">
              <p className="wheel-jackpot wheel-jackpot-tv" aria-label={`Jackpot ${state.jackpot}`}>
                Jackpot <strong>{state.jackpot}</strong>
              </p>
              <ChaosWheel wedges={state.wedges} lastSpin={state.lastSpin} size={420} />
            </div>
            <div className="wheel-tv-side">
              <div className="wheel-tv-meta">
                <p className="wheel-round-label">
                  Round {state.roundIndex + 1} / {state.roundCount}
                </p>
                {state.phase === "playing" && state.lastOutcome ? (
                  <div className="wheel-outcome-block">
                    {state.lastOutcomePlayerName ? (
                      <p className="wheel-outcome-who">
                        Player {state.lastOutcomePlayerName} just:
                      </p>
                    ) : null}
                    <p className="wheel-banner wheel-outcome">
                      {WHEEL_OUTCOME_LABELS[state.lastOutcome]}
                    </p>
                    <p className="wheel-outcome-blurb">
                      {WHEEL_OUTCOME_BLURBS[state.lastOutcome]}
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="wheel-tv-players">
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
                <WheelScoreRail
                  players={state.players}
                  currentPlayerId={state.currentPlayerId}
                  showJackpot={false}
                />
              </div>
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
