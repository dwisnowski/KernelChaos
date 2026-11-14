import { QRCodeSVG } from "qrcode.react";
import { OpenTvButton } from "./OpenTvButton.tsx";
import {
  PACK_TIERS,
  PACK_TIER_LABELS,
  PLAY_MODE_LABELS,
  SCATTER_PLAY_MODES,
  SCATTER_ROUND_SECONDS_OPTIONS,
  type PackTier,
  type ScatterPlayMode,
  type ScatterPlayerPublic,
  type ScatterRoundSeconds,
  type ScatterRoomState,
} from "../scatterTypes.ts";

interface Props {
  state: ScatterRoomState;
  me: ScatterPlayerPublic | null;
  joinUrl: string;
  onSetPackTier: (tier: PackTier) => void;
  onSetPlayMode: (mode: ScatterPlayMode) => void;
  onSetPreferredScene: (sceneId: string | null) => void;
  onSetRoundSeconds: (seconds: ScatterRoundSeconds) => void;
  onStart: () => void;
}

function formatRoundLabel(seconds: ScatterRoundSeconds): string {
  if (seconds === 120) return "2:00";
  if (seconds === 150) return "2:30";
  return "3:00";
}

export function ScatterLobby({
  state,
  me,
  joinUrl,
  onSetPackTier,
  onSetPlayMode,
  onSetPreferredScene,
  onSetRoundSeconds,
  onStart,
}: Props) {
  const isHost = me?.isHost ?? false;
  const roundSeconds = state.roundSeconds ?? 150;
  const sliderIndex = Math.max(0, SCATTER_ROUND_SECONDS_OPTIONS.indexOf(roundSeconds));
  const playMode = state.playMode ?? "categories";
  const isHunt = playMode === "hunt";

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
        <OpenTvButton roomCode={state.code} game="scattergories" />
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
          <h2>Mode</h2>
          <div className="size-pills" role="group" aria-label="Play mode">
            {SCATTER_PLAY_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={`size-pill${playMode === mode ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetPlayMode(mode)}
              >
                {PLAY_MODE_LABELS[mode]}
              </button>
            ))}
          </div>
        </div>

        {!isHunt ? (
          <div className="board-size">
            <h2>Category pack</h2>
            <div className="size-pills" role="group" aria-label="Category pack">
              {PACK_TIERS.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  className={`size-pill${state.packTier === tier ? " is-active" : ""}`}
                  disabled={!isHost}
                  onClick={() => onSetPackTier(tier)}
                >
                  {PACK_TIER_LABELS[tier]}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="board-size">
            <h2>Picture</h2>
            <div className="size-pills" role="group" aria-label="Picture scene">
              <button
                type="button"
                className={`size-pill${state.preferredSceneId == null ? " is-active" : ""}`}
                disabled={!isHost}
                onClick={() => onSetPreferredScene(null)}
              >
                Random
              </button>
              {(state.huntScenes ?? []).map((scene) => (
                <button
                  key={scene.id}
                  type="button"
                  className={`size-pill${state.preferredSceneId === scene.id ? " is-active" : ""}`}
                  disabled={!isHost}
                  onClick={() => onSetPreferredScene(scene.id)}
                >
                  {scene.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="round-time">
          <div className="round-time-header">
            <h2>Round time</h2>
            <strong aria-live="polite">{formatRoundLabel(roundSeconds)}</strong>
          </div>
          <input
            className="round-slider"
            type="range"
            min={0}
            max={SCATTER_ROUND_SECONDS_OPTIONS.length - 1}
            step={1}
            value={sliderIndex}
            disabled={!isHost}
            aria-label="Round time"
            aria-valuetext={formatRoundLabel(roundSeconds)}
            onChange={(e) => {
              const next = SCATTER_ROUND_SECONDS_OPTIONS[Number(e.target.value)];
              if (next) onSetRoundSeconds(next);
            }}
          />
          <div className="round-ticks" aria-hidden="true">
            {SCATTER_ROUND_SECONDS_OPTIONS.map((s) => (
              <span key={s}>{formatRoundLabel(s)}</span>
            ))}
          </div>
          {!isHost ? (
            <p className="muted">Only the host can change mode and time.</p>
          ) : null}
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
