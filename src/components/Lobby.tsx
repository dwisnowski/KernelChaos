import { QRCodeSVG } from "qrcode.react";
import { OpenTvButton } from "./OpenTvButton.tsx";
import {
  ROUND_SECONDS_OPTIONS,
  type BoardSize,
  type PlayerPublic,
  type RoundSeconds,
  type RoomState,
} from "../types.ts";

interface Props {
  state: RoomState;
  me: PlayerPublic | null;
  joinUrl: string;
  onSetBoardSize: (size: BoardSize) => void;
  onSetRoundSeconds: (seconds: RoundSeconds) => void;
  onStart: () => void;
}

const SIZES: BoardSize[] = [4, 5, 6];

function formatRoundLabel(seconds: RoundSeconds): string {
  if (seconds === 60) return "1:00";
  if (seconds === 90) return "1:30";
  return "2:00";
}

export function Lobby({
  state,
  me,
  joinUrl,
  onSetBoardSize,
  onSetRoundSeconds,
  onStart,
}: Props) {
  const isHost = me?.isHost ?? false;
  const roundSeconds = state.roundSeconds ?? 90;
  const sliderIndex = Math.max(0, ROUND_SECONDS_OPTIONS.indexOf(roundSeconds));

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
        <OpenTvButton roomCode={state.code} />
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
          </ul>
        </div>

        <div className="board-size">
          <h2>Board size</h2>
          <div className="size-pills" role="group" aria-label="Board size">
            {SIZES.map((n) => (
              <button
                key={n}
                type="button"
                className={`size-pill${state.boardSize === n ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetBoardSize(n)}
              >
                {n}×{n}
              </button>
            ))}
          </div>
        </div>

        <div className="round-time">
          <div className="round-time-header">
            <h2>Round time</h2>
            <strong aria-live="polite">{formatRoundLabel(roundSeconds)}</strong>
          </div>
          <input
            className="round-slider"
            type="range"
            min={0}
            max={ROUND_SECONDS_OPTIONS.length - 1}
            step={1}
            value={sliderIndex}
            disabled={!isHost}
            aria-label="Round time"
            aria-valuetext={formatRoundLabel(roundSeconds)}
            onChange={(e) => {
              const next = ROUND_SECONDS_OPTIONS[Number(e.target.value)];
              if (next) onSetRoundSeconds(next);
            }}
          />
          <div className="round-ticks" aria-hidden="true">
            {ROUND_SECONDS_OPTIONS.map((s) => (
              <span key={s}>{formatRoundLabel(s)}</span>
            ))}
          </div>
          {!isHost ? <p className="muted">Only the host can change size and time.</p> : null}
        </div>

        {isHost ? (
          <button type="button" className="btn primary start-btn" onClick={onStart}>
            Start game
          </button>
        ) : (
          <p className="waiting">Waiting for the host to start…</p>
        )}
      </div>
    </section>
  );
}
