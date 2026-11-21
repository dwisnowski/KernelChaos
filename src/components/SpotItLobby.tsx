import { QRCodeSVG } from "qrcode.react";
import { OpenTvButton } from "./OpenTvButton.tsx";
import {
  SPOT_IT_MODES,
  SPOT_IT_MODE_LABELS,
  SPOT_IT_PACK_IDS,
  SPOT_IT_PACK_LABELS,
  SPOT_IT_TARGETS,
  isKanaPack,
  type SpotItMode,
  type SpotItPackId,
  type SpotItPlayerPublic,
  type SpotItRoomState,
  type SpotItTarget,
} from "../spotItTypes.ts";

interface Props {
  state: SpotItRoomState;
  me: SpotItPlayerPublic | null;
  joinUrl: string;
  onSetMode: (mode: SpotItMode) => void;
  onSetTarget: (target: SpotItTarget) => void;
  onSetPack: (packId: SpotItPackId) => void;
  onStart: () => void;
}

export function SpotItLobby({
  state,
  me,
  joinUrl,
  onSetMode,
  onSetTarget,
  onSetPack,
  onStart,
}: Props) {
  const isHost = me?.isHost ?? false;
  const canStart = state.players.length >= 1;
  const learning = state.spotItMode === "learning";
  const visiblePacks = SPOT_IT_PACK_IDS.filter((id) =>
    learning ? isKanaPack(id) : !isKanaPack(id),
  );

  const modeHint =
    state.spotItMode === "shared"
      ? "Everyone sees the same two cards — race to tap the match."
      : state.spotItMode === "learning"
        ? "Match the shared kana, then race to pick its English meaning."
        : "Shared center + your own card — first correct match scores and takes the center.";

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
        <OpenTvButton roomCode={state.code} game="spot-it" />
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
            {SPOT_IT_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={`size-pill${state.spotItMode === mode ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetMode(mode)}
              >
                {SPOT_IT_MODE_LABELS[mode]}
              </button>
            ))}
          </div>
          <p className="muted lobby-hint">{modeHint}</p>
        </div>

        <div className="board-size">
          <h2>First to</h2>
          <div className="size-pills" role="group" aria-label="Target score">
            {SPOT_IT_TARGETS.map((n) => (
              <button
                key={n}
                type="button"
                className={`size-pill${state.targetScore === n ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetTarget(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="board-size">
          <h2>Symbol pack</h2>
          <div className="size-pills" role="group" aria-label="Symbol pack">
            {visiblePacks.map((id) => (
              <button
                key={id}
                type="button"
                className={`size-pill${state.packId === id ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetPack(id)}
              >
                {SPOT_IT_PACK_LABELS[id]}
              </button>
            ))}
          </div>
        </div>

        {isHost ? (
          <button className="btn primary" type="button" disabled={!canStart} onClick={onStart}>
            Start game
          </button>
        ) : (
          <p className="muted">Waiting for host to start…</p>
        )}
      </div>
    </section>
  );
}
