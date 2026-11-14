import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  playMmmmsDeal,
  playMmmmsExplode,
  playMmmmsHalt,
  playMmmmsSmash,
  playWinner,
  unlockAudio,
} from "../audio/sfx.ts";
import { BurstOverlay, type BurstOverlayHandle } from "../components/BurstOverlay.tsx";
import { Layout } from "../components/Layout.tsx";
import {
  MmmmsOutcomeOverlay,
  resolveMmmmsOutcome,
} from "../components/MmmmsOutcomeOverlay.tsx";
import { HiddenOrbStack } from "../components/OrbList.tsx";
import { useMmmmsRoom } from "../hooks/useMmmmsRoom.ts";
import { ORB_COLOR_HEX, ORB_COLOR_LABELS } from "../mmmmsTypes.ts";

const STEP_MS = 220;

export function MmmmsSpectator() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [animExploded, setAnimExploded] = useState<number | null>(null);
  const phaseRef = useRef<string | null>(null);
  const resolveKeyRef = useRef<string | null>(null);
  const burstRef = useRef<BurstOverlayHandle>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const { state, connected, spectate } = useMmmmsRoom({
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
    if (!state) return;
    unlockAudio();
    const prev = phaseRef.current;
    if (prev === "lobby" && state.phase === "organize") {
      playMmmmsDeal();
    }
    if (prev && prev !== "resolving" && state.phase === "resolving") {
      playMmmmsSmash();
    }
    if (prev && prev !== "results" && state.phase === "results") {
      playWinner();
    }
    phaseRef.current = state.phase;
  }, [state]);

  useEffect(() => {
    if (!state || state.phase !== "resolving" || !state.lastAttack) return;
    const attack = state.lastAttack;
    const key = `${state.round}-${attack.attackerId}-${attack.explodedCount}-${attack.steps.length}`;
    if (resolveKeyRef.current === key) return;
    resolveKeyRef.current = key;

    let cancelled = false;
    setAnimExploded(0);

    (async () => {
      let exploded = 0;
      for (let i = 0; i < attack.steps.length; i++) {
        if (cancelled) return;
        const step = attack.steps[i]!;
        const stage = stageRef.current;
        const el = stage?.querySelector<HTMLElement>(
          `.mmmms-board[data-player="${attack.defenderId}"] [data-orb-index="${i}"]`,
        );
        if (el && burstRef.current && stage) {
          const rect = el.getBoundingClientRect();
          const stageRect = stage.getBoundingClientRect();
          burstRef.current.explode(
            rect.left - stageRect.left + rect.width / 2,
            rect.top - stageRect.top + rect.height / 2,
            ORB_COLOR_HEX[step.color],
          );
        }
        if (step.kind === "explode") {
          playMmmmsExplode(i);
          exploded += 1;
          setAnimExploded(exploded);
        } else {
          playMmmmsHalt();
        }
        await new Promise((r) => setTimeout(r, STEP_MS));
      }
      if (!cancelled) setAnimExploded(attack.explodedCount);
      // Spectators do not ack; server advances on player acks / timeout.
    })();

    return () => {
      cancelled = true;
    };
  }, [state]);

  const joinUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/mmmms/join?code=${roomCode}`;
  }, [roomCode]);

  const tvOutcome =
    state?.phase === "resolving" && state.lastAttack
      ? resolveMmmmsOutcome(state.lastAttack)
      : null;

  return (
    <Layout title="KernelChaos · TV" playerRoom={{ code: roomCode, game: "mmmms" }}>
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
              <p className="spectator-tag">TV spectator · M&Ms Smash · 2 players</p>
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
              {state.players.length < 2 ? <li className="muted">Waiting for opponent…</li> : null}
            </ul>
          </div>
        ) : (
          <div className="mmmms-tv">
            <p className="mmmms-phase">
              {state.phase === "organize"
                ? "Players organizing stacks"
                : state.phase === "guess"
                  ? "Defender guessing…"
                  : state.phase === "attack"
                    ? "Attacker choosing…"
                    : state.phase === "resolving"
                      ? "Explosion!"
                      : state.phase === "results"
                        ? `${state.winnerName ?? "Winner"} wins`
                        : state.phase}
            </p>

            <div className="mmmms-stage mmmms-tv-stage" ref={stageRef}>
              <BurstOverlay ref={burstRef} className="burst-overlay mmmms-burst" />
              {tvOutcome ? <MmmmsOutcomeOverlay kind={tvOutcome} className="is-tv" /> : null}
              <div className="mmmms-boards mmmms-tv-boards">
                {state.players.map((p) => {
                  const role =
                    p.id === state.attackerId ? "Attacker" : p.id === state.defenderId ? "Defender" : "";
                  const count =
                    state.phase === "resolving" &&
                    state.lastAttack &&
                    p.id === state.lastAttack.defenderId
                      ? p.remainingCount + state.lastAttack.explodedCount
                      : p.remainingCount;
                  return (
                    <div key={p.id} className="mmmms-board" data-player={p.id}>
                      <h2>
                        {p.name}
                        {role ? <em>{role}</em> : null}
                      </h2>
                      <p className="muted">{p.remainingCount} left</p>
                      <HiddenOrbStack count={count} />
                    </div>
                  );
                })}
              </div>
            </div>

            {state.phase === "resolving" && state.lastAttack ? (
              <div className="mmmms-attack-result" aria-live="polite">
                <p>
                  Attack · {ORB_COLOR_LABELS[state.lastAttack.attackColor]}
                  {state.lastAttack.guessCorrect ? " · save!" : ""}
                </p>
                <p className="mmmms-exploded-count">Exploded {animExploded ?? state.lastAttack.explodedCount}</p>
              </div>
            ) : null}

            {state.phase === "results" ? (
              <div className="mmmms-results">
                <h2>{state.winnerName ?? "Winner"} wins!</h2>
                <Link className="btn" to="/mmmms">
                  Back to M&Ms Smash
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </Layout>
  );
}
