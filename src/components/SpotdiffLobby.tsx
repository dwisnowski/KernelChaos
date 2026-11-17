import { QRCodeSVG } from "qrcode.react";
import { OpenTvButton } from "./OpenTvButton.tsx";
import {
  SPOT_DIFFICULTIES,
  SPOT_DIFFICULTY_LABELS,
  SPOT_DIFF_OPTIONS,
  SPOT_MODE_LABELS,
  SPOT_PLAY_MODES,
  SPOT_ROUND_OPTIONS,
  type SpotDiffCount,
  type SpotDifficulty,
  type SpotPlayMode,
  type SpotRoundSeconds,
  type SpotdiffPlayerPublic,
  type SpotdiffRoomState,
} from "../spotdiffTypes.ts";

interface Props {
  state: SpotdiffRoomState;
  me: SpotdiffPlayerPublic | null;
  joinUrl: string;
  onSetMode: (mode: SpotPlayMode) => void;
  onSetTimer: (seconds: SpotRoundSeconds) => void;
  onSetDiffCount: (count: SpotDiffCount) => void;
  onSetDifficulty: (difficulty: SpotDifficulty) => void;
  onStart: () => void;
}

export function SpotdiffLobby({
  state,
  me,
  joinUrl,
  onSetMode,
  onSetTimer,
  onSetDiffCount,
  onSetDifficulty,
  onStart,
}: Props) {
  const isHost = me?.isHost ?? false;
  const canStart = state.players.length >= 1;

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
        <OpenTvButton roomCode={state.code} game="spotdiff" />
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
          <h2>Mode</h2>
          <div className="size-pills" role="group" aria-label="Play mode">
            {SPOT_PLAY_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={`size-pill${state.spotMode === mode ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetMode(mode)}
              >
                {SPOT_MODE_LABELS[mode]}
              </button>
            ))}
          </div>
        </div>

        <div className="board-size">
          <h2>Timer</h2>
          <div className="size-pills" role="group" aria-label="Round timer">
            {SPOT_ROUND_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                className={`size-pill${state.roundSeconds === n ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetTimer(n)}
              >
                {n}s
              </button>
            ))}
          </div>
        </div>

        <div className="board-size">
          <h2>Differences</h2>
          <div className="size-pills" role="group" aria-label="Difference count">
            {SPOT_DIFF_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                className={`size-pill${state.diffCount === n ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetDiffCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="board-size">
          <h2>Difficulty</h2>
          <div className="size-pills" role="group" aria-label="Scene difficulty">
            {SPOT_DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                className={`size-pill${state.difficulty === d ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetDifficulty(d)}
              >
                {SPOT_DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
          {!isHost ? <p className="muted">Only the host can change settings.</p> : null}
        </div>

        {isHost ? (
          <button
            type="button"
            className="btn primary start-btn"
            onClick={onStart}
            disabled={!canStart}
          >
            {canStart ? "Start game" : "Need a player"}
          </button>
        ) : (
          <p className="waiting">Waiting for the host to start…</p>
        )}
      </div>
    </section>
  );
}
