import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { isMuted, setMuted, unlockAudio } from "../audio/sfx.ts";
import { BackToPlayerButton } from "./BackToPlayerButton.tsx";
import { OpenTvButton } from "./OpenTvButton.tsx";
import { PalettePicker } from "./PalettePicker.tsx";

export function Layout({
  children,
  title = "KernelChaos",
  tvRoom,
  playerRoom,
}: {
  children: ReactNode;
  title?: string;
  /** When set, shows “Open TV spectator” next to the mute control. */
  tvRoom?: {
    code: string;
    game: "boggle" | "scattergories" | "mmmms" | "spotdiff" | "spot-it" | "wheel" | "trivia";
    /** Confirm before opening while a round is underway. */
    roundActive?: boolean;
  };
  /** When set, shows “Back to player mode” next to the mute control. */
  playerRoom?: {
    code: string;
    game: "boggle" | "scattergories" | "mmmms" | "spotdiff" | "spot-it" | "wheel" | "trivia";
  };
}) {
  const [mute, setMute] = useState(isMuted);
  const [colorsOpen, setColorsOpen] = useState(false);
  const colorsPanelId = useId();
  const colorsWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!colorsOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setColorsOpen(false);
    }
    function onPointer(e: MouseEvent | PointerEvent) {
      const root = colorsWrapRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) {
        setColorsOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [colorsOpen]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-row">
          <Link to="/" className="brand-title" title="KernelChaos home">
            <img src="/kernelchaos.svg" alt="" width="28" height="28" className="brand-mark" />
            <span>{title}</span>
          </Link>
        </div>
        <div className="header-actions">
          {tvRoom ? (
            <OpenTvButton
              roomCode={tvRoom.code}
              game={tvRoom.game}
              className="btn tv-link header-tv-link"
              requireConfirm={tvRoom.roundActive === true}
            />
          ) : null}
          {playerRoom ? (
            <BackToPlayerButton
              roomCode={playerRoom.code}
              game={playerRoom.game}
              className="btn tv-link header-tv-link"
            />
          ) : null}
          <div className="colors-popover-wrap" ref={colorsWrapRef}>
            <button
              type="button"
              className="settings-link"
              title="Color palettes"
              aria-expanded={colorsOpen}
              aria-controls={colorsPanelId}
              aria-haspopup="dialog"
              onClick={() => setColorsOpen((open) => !open)}
            >
              Colors
            </button>
            {colorsOpen ? (
              <div
                id={colorsPanelId}
                className="colors-popover"
                role="dialog"
                aria-label="Color palettes"
              >
                <p className="colors-popover-lede">
                  Pick a preset or tune chrome colors. Stays on this device.
                </p>
                <PalettePicker compact />
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="mute-btn"
            aria-pressed={mute}
            aria-label={mute ? "Unmute sounds" : "Mute sounds"}
            onClick={() => {
              unlockAudio();
              const next = !mute;
              setMuted(next);
              setMute(next);
            }}
          >
            {mute ? "Sound off" : "Sound on"}
          </button>
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="wiz-footer">
        <a
          className="wiz-home"
          href="https://www.wildideazone.com/"
          title="Wild Idea Zone: more projects"
        >
          <img src="/wild-idea-zone.svg" alt="Wild Idea Zone" width="28" height="28" />
        </a>
        <span>
          A <a href="https://www.wildideazone.com/">Wild Idea Zone</a> project ·{" "}
          <a href="https://www.wildideazone.com/projects/kernelchaos">About this build</a> ·{" "}
          <a href="https://www.wildideazone.com/projects">More projects</a>
        </span>
      </footer>
    </div>
  );
}
