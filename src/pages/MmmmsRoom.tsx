import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  playMmmmsDeal,
  playMmmmsDefeat,
  playMmmmsExplode,
  playMmmmsGuess,
  playMmmmsHalt,
  playMmmmsLock,
  playMmmmsSmash,
  playWinner,
  unlockAudio,
} from "../audio/sfx.ts";
import { BurstOverlay, type BurstOverlayHandle } from "../components/BurstOverlay.tsx";
import { ColorPalette } from "../components/ColorPalette.tsx";
import {
  HangingOrbThreads,
  type HangingOrbThreadsHandle,
} from "../components/HangingOrbThreads.tsx";
import { Layout } from "../components/Layout.tsx";
import { MmmmsLobby } from "../components/MmmmsLobby.tsx";
import {
  MmmmsOutcomeOverlay,
  resolveMmmmsOutcome,
} from "../components/MmmmsOutcomeOverlay.tsx";
import { OrbList } from "../components/OrbList.tsx";
import { useMmmmsRoom } from "../hooks/useMmmmsRoom.ts";
import {
  ORB_COLOR_HEX,
  ORB_COLOR_LABELS,
  type AttackStep,
  type OrbColor,
} from "../mmmmsTypes.ts";

const STEP_MS = 220;

/** Rebuild the pre-attack bottom→top stack from post-attack remaining + resolve steps. */
function reconstructPreAttack(remaining: OrbColor[], steps: AttackStep[]): OrbColor[] {
  let rem = [...remaining];
  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i]!;
    if (step.kind === "explode") {
      rem = [step.color, ...rem];
    }
  }
  return rem;
}

function combatActionCopy(opts: {
  phase: string;
  amAttacker: boolean;
  amDefender: boolean;
  isActivePicker: boolean;
}): string {
  const { phase, amAttacker, amDefender, isActivePicker } = opts;
  if (phase === "guess") {
    if (amDefender && isActivePicker) {
      return "Attempt to block the attack by guessing your opponent's selection";
    }
    return "Wait for other player to select their attack";
  }
  if (phase === "attack") {
    if (amAttacker && isActivePicker) {
      return "Choose an attack color to smash their stack";
    }
    return "Waiting on opponent";
  }
  if (phase === "resolving") return "Orbs exploding…";
  return "";
}

export function MmmmsRoom() {
  const { code = "" } = useParams();
  const location = useLocation();
  const navName = (location.state as { name?: string } | null)?.name;
  const [name] = useState(() => navName || localStorage.getItem("kernelchaos.name") || "");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localOrbs, setLocalOrbs] = useState<OrbColor[]>([]);
  const [vanishingPlayer, setVanishingPlayer] = useState<Set<number>>(() => new Set());
  const [vanishingOpponent, setVanishingOpponent] = useState<Set<number>>(() => new Set());
  const [animExploded, setAnimExploded] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<OrbColor | null>(null);
  const phaseRef = useRef<string | null>(null);
  const resolveKeyRef = useRef<string | null>(null);
  const burstRef = useRef<BurstOverlayHandle>(null);
  const threadsRef = useRef<HangingOrbThreadsHandle>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const roomCode = code.toUpperCase();

  const {
    state,
    me,
    playerId,
    connected,
    myOrbs,
    join,
    setOrbCount,
    start,
    reorder,
    submitOrder,
    guessColor,
    attackColor,
    resolveDone,
    playAgain,
  } = useMmmmsRoom({
    code: roomCode,
    onError: (message) => setError(message),
  });

  useEffect(() => {
    if (!name || joined) return;
    join(name);
    setJoined(true);
  }, [join, joined, name]);

  useEffect(() => {
    if (!myOrbs) return;
    if (state?.phase === "resolving") return;
    setLocalOrbs(myOrbs);
  }, [myOrbs, state?.phase]);

  useEffect(() => {
    setSelectedColor(null);
  }, [state?.phase, state?.round]);

  useEffect(() => {
    if (!state) return;
    const prev = phaseRef.current;
    if (prev === "lobby" && state.phase === "organize") {
      playMmmmsDeal();
    }
    if (prev && prev !== "resolving" && state.phase === "resolving") {
      playMmmmsSmash();
    }
    if (prev && prev !== "results" && state.phase === "results") {
      if (playerId != null && state.winnerId === playerId) playWinner();
      else playMmmmsDefeat();
    }
    if (state.phase === "lobby" || state.phase === "organize") {
      setVanishingPlayer(new Set());
      setVanishingOpponent(new Set());
      setAnimExploded(null);
      resolveKeyRef.current = null;
    }
    phaseRef.current = state.phase;
  }, [state, playerId]);

  useEffect(() => {
    if (!state || state.phase !== "resolving" || !state.lastAttack) return;
    const attack = state.lastAttack;
    const key = `${state.round}-${attack.attackerId}-${attack.steps.map((s) => s.kind).join("")}-${attack.explodedCount}`;
    if (resolveKeyRef.current === key) return;
    resolveKeyRef.current = key;

    let cancelled = false;
    const isDefender = playerId === attack.defenderId;
    const isAttacker = playerId === attack.attackerId;

    if (isDefender) {
      const remaining = myOrbs ?? [];
      setLocalOrbs(reconstructPreAttack(remaining, attack.steps));
    }

    setVanishingPlayer(new Set());
    setVanishingOpponent(new Set());
    setAnimExploded(0);

    (async () => {
      let exploded = 0;
      for (let i = 0; i < attack.steps.length; i++) {
        if (cancelled) return;
        const step = attack.steps[i]!;
        const stage = stageRef.current;
        const threadsBox = stage?.querySelector<HTMLElement>(".mmmms-combat-threads");
        const center = threadsRef.current?.getOrbCenter(isDefender ? "player" : "opponent", i);
        if (center && burstRef.current && stage && threadsBox) {
          const stageRect = stage.getBoundingClientRect();
          const threadsRect = threadsBox.getBoundingClientRect();
          burstRef.current.explode(
            threadsRect.left - stageRect.left + center.x,
            threadsRect.top - stageRect.top + center.y,
            ORB_COLOR_HEX[step.color],
          );
        }
        if (step.kind === "explode") {
          playMmmmsExplode(i);
          exploded += 1;
          setAnimExploded(exploded);
          if (isDefender) {
            setVanishingPlayer((prev) => new Set(prev).add(i));
          } else if (isAttacker) {
            setVanishingOpponent((prev) => new Set(prev).add(i));
          }
        } else {
          playMmmmsHalt();
        }
        await new Promise((r) => setTimeout(r, STEP_MS));
      }
      if (cancelled) return;
      if (isDefender && myOrbs) setLocalOrbs(myOrbs);
      if (isAttacker) setAnimExploded(attack.explodedCount);
      resolveDone();
    })();

    return () => {
      cancelled = true;
    };
  }, [state, playerId, myOrbs, resolveDone]);

  const joinUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/mmmms/join?code=${roomCode}`;
  }, [roomCode]);

  if (!name) {
    return (
      <Layout title="KernelChaos · M&Ms Smash">
        <section className="entry-card">
          <p>Enter a name to join this room.</p>
          <Link className="btn primary" to={`/mmmms/join?code=${roomCode}`}>
            Join with name
          </Link>
        </section>
      </Layout>
    );
  }

  const opponent = state?.players.find((p) => p.id !== playerId) ?? null;
  const amAttacker = playerId != null && playerId === state?.attackerId;
  const amDefender = playerId != null && playerId === state?.defenderId;
  const ready = me?.ready ?? false;

  const isPickPhase = state?.phase === "guess" || state?.phase === "attack";
  const isCombatPhase =
    state?.phase === "guess" || state?.phase === "attack" || state?.phase === "resolving";
  const isActivePicker =
    (state?.phase === "guess" && amDefender) || (state?.phase === "attack" && amAttacker);

  const opponentThreadCount =
    state?.phase === "resolving" && state.lastAttack && playerId === state.lastAttack.attackerId
      ? (opponent?.remainingCount ?? 0) + state.lastAttack.explodedCount
      : (opponent?.remainingCount ?? 0);

  const phoneOutcome =
    state?.phase === "resolving" && state.lastAttack
      ? resolveMmmmsOutcome(state.lastAttack)
      : null;
  const showBlockedOverlay = phoneOutcome === "blocked" && amDefender;
  const showGoFishOverlay = phoneOutcome === "go-fish" && amAttacker;

  const actionCopy =
    state && isCombatPhase
      ? combatActionCopy({
          phase: state.phase,
          amAttacker,
          amDefender,
          isActivePicker,
        })
      : "";

  return (
    <Layout
      title="KernelChaos · M&Ms Smash"
      tvRoom={{
        code: roomCode,
        game: "mmmms",
        roundActive:
          state?.phase === "organize" ||
          state?.phase === "guess" ||
          state?.phase === "attack" ||
          state?.phase === "resolving",
      }}
    >
      {!connected ? <p className="muted connecting">Connecting…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {state?.phase === "lobby" ? (
        <MmmmsLobby
          state={state}
          me={me}
          joinUrl={joinUrl}
          onSetOrbCount={(n) => {
            unlockAudio();
            setOrbCount(n);
          }}
          onStart={() => {
            unlockAudio();
            start();
          }}
        />
      ) : null}

      {state && state.phase !== "lobby" ? (
        <section className="mmmms-play">
          <header className="mmmms-hud">
            <p className="mmmms-phase">
              {state.phase === "organize"
                ? "Organize your orbs"
                : state.phase === "guess"
                  ? amDefender
                    ? "Guess the attack color"
                    : "Opponent is guessing…"
                  : state.phase === "attack"
                    ? amAttacker
                      ? "Pick an attack color"
                      : "Opponent is attacking…"
                    : state.phase === "resolving"
                      ? "Orbs exploding…"
                      : state.phase === "results"
                        ? "Duel over"
                        : state.phase}
            </p>
            <div className="mmmms-counts">
              <span>You · {me?.remainingCount ?? localOrbs.length}</span>
              <span>
                {opponent?.name ?? "Opponent"} · {opponent?.remainingCount ?? "—"}
              </span>
            </div>
          </header>

          <div className="mmmms-stage" ref={stageRef}>
            <BurstOverlay ref={burstRef} className="burst-overlay mmmms-burst" />

            {showBlockedOverlay ? <MmmmsOutcomeOverlay kind="blocked" /> : null}
            {showGoFishOverlay ? <MmmmsOutcomeOverlay kind="go-fish" /> : null}

            {state.phase === "organize" ? (
              <div className="mmmms-boards is-organize-solo">
                <div className="mmmms-board mine">
                  <h2>Your stack</h2>
                  <p className="muted orb-stack-hint">
                    Bottom explodes first · drag the handle to reorder
                  </p>
                  <OrbList
                    orbs={localOrbs}
                    disabled={ready}
                    onReorder={(next) => {
                      setLocalOrbs(next);
                      reorder(next);
                    }}
                  />
                  <div className="mmmms-organize-actions">
                    {ready ? (
                      <p className="waiting">Locked in — waiting for opponent…</p>
                    ) : (
                      <button
                        type="button"
                        className="btn primary"
                        onClick={() => {
                          unlockAudio();
                          playMmmmsLock();
                          submitOrder();
                        }}
                      >
                        Submit order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {isCombatPhase ? (
              <div className="mmmms-combat">
                <div className="mmmms-combat-action" aria-live="polite">
                  <p className="mmmms-combat-prompt">{actionCopy}</p>
                  {isActivePicker ? (
                    <div className="mmmms-palette-wrap">
                      <ColorPalette
                        label={state.phase === "guess" ? "Guess color" : "Attack color"}
                        selected={selectedColor}
                        onSelect={(color) => {
                          unlockAudio();
                          setSelectedColor(color);
                        }}
                      />
                      <button
                        type="button"
                        className="btn primary"
                        disabled={selectedColor == null}
                        onClick={() => {
                          if (selectedColor == null) return;
                          unlockAudio();
                          if (state.phase === "guess") {
                            playMmmmsGuess();
                            guessColor(selectedColor);
                          } else {
                            attackColor(selectedColor);
                          }
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  ) : null}
                  {isPickPhase && !isActivePicker ? (
                    <p className="mmmms-combat-wait muted">Hang tight…</p>
                  ) : null}
                </div>
                <div className="mmmms-combat-threads">
                  <HangingOrbThreads
                    ref={threadsRef}
                    playerOrbs={localOrbs}
                    opponentCount={opponentThreadCount}
                    vanishingPlayer={vanishingPlayer}
                    vanishingOpponent={vanishingOpponent}
                    highlightPlayerBottom={state.phase === "resolving" && amDefender}
                    enableTilt
                  />
                </div>
              </div>
            ) : null}
          </div>

          {state.phase === "resolving" && state.lastAttack ? (
            <div className="mmmms-attack-result" aria-live="polite">
              <p>
                Attack · {ORB_COLOR_LABELS[state.lastAttack.attackColor]}
                {state.lastAttack.guessCorrect ? " · guess saved!" : ""}
              </p>
              {amAttacker || animExploded != null ? (
                <p className="mmmms-exploded-count">
                  Exploded {animExploded ?? state.lastAttack.explodedCount}
                </p>
              ) : null}
            </div>
          ) : null}

          {state.phase === "results" ? (
            <div className="mmmms-results">
              <h2>
                {state.winnerId === playerId
                  ? "You win!"
                  : `${state.winnerName ?? "Opponent"} wins`}
              </h2>
              {me?.isHost ? (
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => {
                    unlockAudio();
                    playAgain();
                  }}
                >
                  Play again
                </button>
              ) : (
                <p className="waiting">Waiting for host…</p>
              )}
              <Link className="btn" to="/mmmms">
                Leave
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}
    </Layout>
  );
}
