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
import { Layout } from "../components/Layout.tsx";
import { MmmmsLobby } from "../components/MmmmsLobby.tsx";
import {
  MmmmsOutcomeOverlay,
  resolveMmmmsOutcome,
} from "../components/MmmmsOutcomeOverlay.tsx";
import { HiddenOrbStack, OrbList } from "../components/OrbList.tsx";
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

export function MmmmsRoom() {
  const { code = "" } = useParams();
  const location = useLocation();
  const navName = (location.state as { name?: string } | null)?.name;
  const [name] = useState(() => navName || localStorage.getItem("kernelchaos.name") || "");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localOrbs, setLocalOrbs] = useState<OrbColor[]>([]);
  const [vanishing, setVanishing] = useState<Set<number>>(() => new Set());
  const [animExploded, setAnimExploded] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<OrbColor | null>(null);
  const phaseRef = useRef<string | null>(null);
  const resolveKeyRef = useRef<string | null>(null);
  const burstRef = useRef<BurstOverlayHandle>(null);
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
      setVanishing(new Set());
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

    setVanishing(new Set());
    setAnimExploded(0);

    (async () => {
      let exploded = 0;
      for (let i = 0; i < attack.steps.length; i++) {
        if (cancelled) return;
        const step = attack.steps[i]!;
        const stage = stageRef.current;
        const selector = isDefender
          ? `.mmmms-board.mine [data-orb-index="${i}"]`
          : `.mmmms-board.theirs [data-orb-index="${i}"]`;
        const el = stage?.querySelector<HTMLElement>(selector);
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
          if (isDefender) {
            setVanishing((prev) => new Set(prev).add(i));
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
  const isActivePicker =
    (state?.phase === "guess" && amDefender) || (state?.phase === "attack" && amAttacker);
  const showOwnBoard =
    state?.phase === "organize" || (state?.phase === "resolving" && amDefender);
  const showOpponentBoard = state?.phase === "resolving" && amAttacker;

  const hiddenCount =
    state?.phase === "resolving" && state.lastAttack && playerId === state.lastAttack.attackerId
      ? (opponent?.remainingCount ?? 0) + state.lastAttack.explodedCount
      : (opponent?.remainingCount ?? 0);

  const phoneOutcome =
    state?.phase === "resolving" && state.lastAttack
      ? resolveMmmmsOutcome(state.lastAttack)
      : null;
  const showBlockedOverlay = phoneOutcome === "blocked" && amDefender;
  const showGoFishOverlay = phoneOutcome === "go-fish" && amAttacker;

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

            {isPickPhase && !isActivePicker ? (
              <div className="mmmms-pick-wait" aria-live="polite">
                <p>
                  {state.phase === "guess"
                    ? "Opponent is guessing…"
                    : "Opponent is attacking…"}
                </p>
              </div>
            ) : null}

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

            {showOwnBoard || showOpponentBoard ? (
              <div
                className={`mmmms-boards${state.phase === "organize" || state.phase === "resolving" ? " is-organize-solo" : ""}`}
              >
                {showOwnBoard ? (
                  <div className="mmmms-board mine">
                    <h2>Your stack</h2>
                    <p className="muted orb-stack-hint">
                      {state.phase === "organize"
                        ? "Bottom explodes first · hold to drag"
                        : "Bottom explodes first"}
                    </p>
                    <OrbList
                      orbs={localOrbs}
                      disabled={state.phase !== "organize" || ready}
                      vanishing={vanishing}
                      highlightBottom={state.phase === "resolving" && amDefender}
                      onReorder={(next) => {
                        setLocalOrbs(next);
                        reorder(next);
                      }}
                    />
                    {state.phase === "organize" ? (
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
                    ) : null}
                  </div>
                ) : null}

                {showOpponentBoard ? (
                  <div className="mmmms-board theirs">
                    <h2>{opponent?.name ?? "Opponent"}</h2>
                    <p className="muted orb-stack-hint">Hidden colors · count only</p>
                    <HiddenOrbStack count={hiddenCount} />
                  </div>
                ) : null}
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
              <h2>{state.winnerId === playerId ? "You win!" : `${state.winnerName ?? "Opponent"} wins`}</h2>
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
