import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { isMuted, setMuted, unlockAudio } from "../audio/sfx.ts";
import { useState } from "react";
import { OpenTvButton } from "./OpenTvButton.tsx";

export function Layout({
  children,
  title = "KernelChaos",
  tvRoom,
}: {
  children: ReactNode;
  title?: string;
  /** When set, shows “Open TV spectator” next to the mute control. */
  tvRoom?: { code: string; game: "boggle" | "scattergories" };
}) {
  const [mute, setMute] = useState(isMuted);

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
            />
          ) : null}
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
