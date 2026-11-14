import { QRCodeSVG } from "qrcode.react";
import { OpenTvButton } from "./OpenTvButton.tsx";
import { ORB_COUNT_OPTIONS, type MmmmsPlayerPublic, type MmmmsRoomState, type OrbCount } from "../mmmmsTypes.ts";

interface Props {
  state: MmmmsRoomState;
  me: MmmmsPlayerPublic | null;
  joinUrl: string;
  onSetOrbCount: (count: OrbCount) => void;
  onStart: () => void;
}

export function MmmmsLobby({ state, me, joinUrl, onSetOrbCount, onStart }: Props) {
  const isHost = me?.isHost ?? false;
  const canStart = state.players.length === 2;

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
        <OpenTvButton roomCode={state.code} game="mmmms" />
      </div>

      <div className="lobby-side">
        <div className="player-list">
          <h2>Players (2)</h2>
          <ul>
            {state.players.map((p) => (
              <li key={p.id}>
                <span>{p.name}</span>
                {p.isHost ? <em>host</em> : null}
              </li>
            ))}
            {state.players.length < 2 ? (
              <li className="muted">Waiting for opponent…</li>
            ) : null}
          </ul>
        </div>

        <div className="board-size">
          <h2>Orbs each</h2>
          <div className="size-pills" role="group" aria-label="Orb count">
            {ORB_COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                className={`size-pill${state.orbCount === n ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetOrbCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
          {!isHost ? <p className="muted">Only the host can change orb count.</p> : null}
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
