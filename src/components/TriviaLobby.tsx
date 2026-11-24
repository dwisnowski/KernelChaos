import { useEffect, useId, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { OpenTvButton } from "./OpenTvButton.tsx";
import {
  DEFAULT_TRIVIA_CHAOS_MODE,
  TRIVIA_AUDIENCE_LABELS,
  TRIVIA_AUDIENCES,
  TRIVIA_EXPLICIT_PACK_IDS,
  TRIVIA_PACK_LABELS,
  audienceForPack,
  packsForAudience,
  type TriviaChaosMode,
  type TriviaPackId,
  type TriviaPlayerPublic,
  type TriviaRoomState,
} from "../triviaTypes.ts";

const CHAOS_MODE_LABELS: Record<TriviaChaosMode, string> = {
  off: "Off",
  light: "Light",
  mayhem: "Mayhem",
};

const CHAOS_MODES: TriviaChaosMode[] = ["off", "light", "mayhem"];

function isExplicitPack(id: TriviaPackId): boolean {
  return (TRIVIA_EXPLICIT_PACK_IDS as readonly string[]).includes(id);
}

function WarningIcon() {
  return (
    <svg
      className="pack-warning-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2L1 21h22L12 2zm0 4.5L19.5 19h-15L12 6.5zM11 10v5h2v-5h-2zm0 6v2h2v-2h-2z"
      />
    </svg>
  );
}

interface Props {
  state: TriviaRoomState;
  me: TriviaPlayerPublic | null;
  joinUrl: string;
  onSetPack: (packId: TriviaPackId) => void;
  onSetChaosMode: (mode: TriviaChaosMode) => void;
  onStart: () => void;
}

export function TriviaLobby({
  state,
  me,
  joinUrl,
  onSetPack,
  onSetChaosMode,
  onStart,
}: Props) {
  const isHost = me?.isHost ?? false;
  const canStart = state.players.length >= 2;
  const chaosMode = state.chaosMode ?? DEFAULT_TRIVIA_CHAOS_MODE;
  const audience = audienceForPack(state.packId);
  const packIds = packsForAudience(audience);
  const [pendingExplicit, setPendingExplicit] = useState<TriviaPackId | null>(null);
  const packWrapRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!pendingExplicit) return;

    function onPointerDown(event: PointerEvent) {
      if (packWrapRef.current && !packWrapRef.current.contains(event.target as Node)) {
        setPendingExplicit(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPendingExplicit(null);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pendingExplicit]);

  function requestPack(id: TriviaPackId) {
    if (!isHost) return;
    if (id === state.packId) {
      setPendingExplicit(null);
      return;
    }
    if (isExplicitPack(id)) {
      setPendingExplicit(id);
      return;
    }
    setPendingExplicit(null);
    onSetPack(id);
  }

  function confirmExplicitPack() {
    if (!pendingExplicit) return;
    onSetPack(pendingExplicit);
    setPendingExplicit(null);
  }

  return (
    <section className="lobby">
      <div className="lobby-join">
        <p className="lobby-label">Room code</p>
        <p className="room-code" aria-label={`Room code ${state.code}`}>
          {state.code}
        </p>
        <div className="qr-wrap">
          <QRCodeSVG value={joinUrl} size={220} level="M" includeMargin bgColor="#f2f5fa" fgColor="#0e1f35" />
        </div>
        <p className="muted qr-hint">Scan to join · {joinUrl.replace(/^https?:\/\//, "")}</p>
        <OpenTvButton roomCode={state.code} game="trivia" />
      </div>

      <div className="lobby-side">
        <div className="player-list">
          <h2>Players</h2>
          <ul>
            {state.players.map((p) => (
              <li key={p.id}>
                <span>{p.name}</span>
                {p.isHost ? <em>host</em> : null}
              </li>
            ))}
            {state.players.length === 0 ? <li className="muted">Waiting for players…</li> : null}
          </ul>
        </div>

        <div className="board-size">
          <h2>Audience</h2>
          <div className="size-pills" role="group" aria-label="Audience">
            {TRIVIA_AUDIENCES.map((id) => (
              <button
                key={id}
                type="button"
                className={`size-pill${audience === id ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => {
                  const first = packsForAudience(id)[0];
                  if (first) requestPack(first);
                }}
              >
                {TRIVIA_AUDIENCE_LABELS[id]}
              </button>
            ))}
          </div>
        </div>

        <div className="board-size pack-select" ref={packWrapRef}>
          <h2>Pack</h2>
          <div className="size-pills" role="group" aria-label="Question pack">
            {packIds.map((id) => {
              const explicit = isExplicitPack(id);
              return (
                <button
                  key={id}
                  type="button"
                  className={`size-pill${state.packId === id ? " is-active" : ""}${explicit ? " is-explicit" : ""}`}
                  disabled={!isHost}
                  aria-label={explicit ? `${TRIVIA_PACK_LABELS[id]} — NSFW warning` : undefined}
                  aria-expanded={explicit ? pendingExplicit === id : undefined}
                  aria-haspopup={explicit ? "dialog" : undefined}
                  onClick={() => requestPack(id)}
                >
                  {explicit ? <WarningIcon /> : null}
                  {TRIVIA_PACK_LABELS[id]}
                </button>
              );
            })}
          </div>
          {pendingExplicit ? (
            <div
              className="tv-confirm-popover pack-confirm-popover"
              role="dialog"
              aria-modal="false"
              aria-labelledby={titleId}
              aria-describedby={descId}
            >
              <p className="tv-confirm-title" id={titleId}>
                Anything-goes NSFW pack
              </p>
              <p className="tv-confirm-copy" id={descId}>
                <strong>{TRIVIA_PACK_LABELS[pendingExplicit]}</strong> includes explicit adult slang
                (sex, drugs, insults, crude language). Clues appear on phones and the TV. 18+ only —
                you accept the risk for everyone in this room.
              </p>
              <div className="tv-confirm-actions">
                <button type="button" className="btn" onClick={() => setPendingExplicit(null)}>
                  Cancel
                </button>
                <button type="button" className="btn primary" onClick={confirmExplicitPack}>
                  I understand — use this pack
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="board-size">
          <h2>Chaos</h2>
          <div className="size-pills" role="group" aria-label="Chaos mode">
            {CHAOS_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={`size-pill${chaosMode === mode ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetChaosMode(mode)}
              >
                {CHAOS_MODE_LABELS[mode]}
              </button>
            ))}
          </div>
          <p className="muted lobby-hint">
            Dash mini-games award chaos powers while someone answers.
          </p>
          {!isHost ? <p className="muted">Only the host can change pack and Chaos.</p> : null}
        </div>

        {isHost ? (
          <button
            type="button"
            className="btn primary start-btn"
            onClick={onStart}
            disabled={!canStart}
          >
            {canStart ? "Start game" : "Need 2 players"}
          </button>
        ) : (
          <p className="waiting">Waiting for the host to start…</p>
        )}
      </div>
    </section>
  );
}
