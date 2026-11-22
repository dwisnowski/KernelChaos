import { QRCodeSVG } from "qrcode.react";
import { OpenTvButton } from "./OpenTvButton.tsx";
import {
  DEFAULT_TRIVIA_CHAOS_MODE,
  TRIVIA_PACK_IDS,
  type TriviaChaosMode,
  type TriviaPackId,
  type TriviaPlayerPublic,
  type TriviaRoomState,
} from "../triviaTypes.ts";

const PACK_LABELS: Record<TriviaPackId, string> = {
  family: "Family",
};

const CHAOS_MODE_LABELS: Record<TriviaChaosMode, string> = {
  off: "Off",
  light: "Light",
  mayhem: "Mayhem",
};

const CHAOS_MODES: TriviaChaosMode[] = ["off", "light", "mayhem"];

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
          <h2>Pack</h2>
          <div className="size-pills" role="group" aria-label="Question pack">
            {TRIVIA_PACK_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={`size-pill${state.packId === id ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetPack(id)}
              >
                {PACK_LABELS[id]}
              </button>
            ))}
          </div>
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
