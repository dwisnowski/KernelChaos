import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { isMuted, setMuted, unlockAudio } from "../audio/sfx.ts";
import { useState } from "react";

export function Layout({ children, title = "KernelChaos" }: { children: ReactNode; title?: string }) {
  const [mute, setMute] = useState(isMuted);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-row">
          <a
            className="wiz-home"
            href="https://www.wildideazone.com/"
            title="Wild Idea Zone: more projects"
          >
            <img src="/wild-idea-zone.svg" alt="Wild Idea Zone" width="28" height="28" />
          </a>
          <Link to="/" className="brand-title">
            {title}
          </Link>
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
      </header>
      <main className="app-main">{children}</main>
      <footer className="wiz-footer">
        A <a href="https://www.wildideazone.com/">Wild Idea Zone</a> project ·{" "}
        <a href="https://www.wildideazone.com/projects/kernelchaos">About this build</a> ·{" "}
        <a href="https://www.wildideazone.com/projects">More projects</a>
      </footer>
    </div>
  );
}
