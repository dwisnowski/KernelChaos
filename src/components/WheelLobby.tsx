import { QRCodeSVG } from "qrcode.react";
import { OpenTvButton } from "./OpenTvButton.tsx";
import {
  WHEEL_ROUND_OPTIONS,
  type WheelPlayerPublic,
  type WheelRoomState,
  type WheelRoundCount,
} from "../wheelTypes.ts";

interface Props {
  state: WheelRoomState;
  me: WheelPlayerPublic | null;
  joinUrl: string;
  onSetRounds: (roundCount: WheelRoundCount) => void;
  onStart: () => void;
}

export function WheelLobby({ state, me, joinUrl, onSetRounds, onStart }: Props) {
  const isHost = me?.isHost ?? false;
  const canStart = state.players.length >= 2;

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
        <OpenTvButton roomCode={state.code} game="wheel" />
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
          {!canStart ? <p className="muted">Need at least 2 players to start.</p> : null}
        </div>

        <div className="board-size">
          <h2>Rounds</h2>
          <div className="size-pills" role="group" aria-label="Number of rounds">
            {WHEEL_ROUND_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                className={`size-pill${state.roundCount === n ? " active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetRounds(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="muted">Puzzles per show. Highest total after the last round wins.</p>
        </div>

        {isHost ? (
          <button className="btn primary" type="button" disabled={!canStart} onClick={onStart}>
            Start show
          </button>
        ) : (
          <p className="muted">Waiting for host to start…</p>
        )}
      </div>
    </section>
  );
}
