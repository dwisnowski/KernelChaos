import { Link } from "react-router-dom";
import { Layout } from "../components/Layout.tsx";
import { unlockAudio } from "../audio/sfx.ts";

function BoggleIcon() {
  return (
    <svg className="game-card-icon" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="4" y="4" width="40" height="40" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="10" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <rect x="26" y="10" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <rect x="10" y="26" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <rect x="26" y="26" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <text x="16" y="19" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">
        B
      </text>
      <text x="32" y="19" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">
        O
      </text>
      <text x="16" y="35" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">
        G
      </text>
      <text x="32" y="35" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">
        G
      </text>
    </svg>
  );
}

function ScattergoriesIcon() {
  return (
    <svg className="game-card-icon" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="6" y="8" width="28" height="34" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16h16M12 23h16M12 30h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="34" cy="34" r="10" fill="var(--bg1)" stroke="currentColor" strokeWidth="2" />
      <text x="34" y="38" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
        A
      </text>
    </svg>
  );
}

function MmmmsIcon() {
  return (
    <svg className="game-card-icon" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="38" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="26" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="15" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="6" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function SpotdiffIcon() {
  return (
    <svg className="game-card-icon" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="4" y="10" width="18" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="26" y="10" width="18" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="13" cy="22" r="3" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="35" cy="22" r="3" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M10 32h6M32 30h6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function SpotItIcon() {
  return (
    <svg className="game-card-icon" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="18" r="3.5" fill="currentColor" opacity="0.85" />
      <circle cx="30" cy="16" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="28" cy="28" r="4" fill="currentColor" opacity="0.9" />
      <circle cx="17" cy="30" r="2" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

function WheelIcon() {
  return (
    <svg className="game-card-icon" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M24 6v12M24 30v12M6 24h12M30 24h12M12.5 12.5l8.5 8.5M27 27l8.5 8.5M35.5 12.5L27 21M21 27l-8.5 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Home() {
  return (
    <Layout>
      <section className="hero">
        <p className="hero-kicker">Family games over the internet</p>
        <h1 className="hero-brand">KernelChaos</h1>
        <p className="hero-lead">
          Shared boards, short room codes, and a living-room-friendly screen for the whole crew.
        </p>
        <div className="hero-games" aria-label="Games">
          <Link className="game-card" to="/boggle" onClick={() => unlockAudio()}>
            <BoggleIcon />
            <h2>Boggle</h2>
            <p>
              Drag adjacent letters on a shared timed board. Short room codes and a TV-friendly view for
              the whole crew.
            </p>
            <span className="btn primary">Play</span>
          </Link>
          <Link className="game-card" to="/scattergories" onClick={() => unlockAudio()}>
            <ScattergoriesIcon />
            <h2>Scattergories</h2>
            <p>
              Fill categories for a rolled letter. The TV reveals answers and scores the round together.
            </p>
            <span className="btn primary">Play</span>
          </Link>
          <Link className="game-card" to="/mmmms" onClick={() => unlockAudio()}>
            <MmmmsIcon />
            <h2>M&Ms Smash</h2>
            <p>
              Two players stack colored orbs, guess the attack, and explode from the bottom up.
            </p>
            <span className="btn primary">Play</span>
          </Link>
          <Link className="game-card" to="/spotdiff" onClick={() => unlockAudio()}>
            <SpotdiffIcon />
            <h2>Spot the Difference</h2>
            <p>
              Side-by-side scenes with hidden changes. Race, co-op, or solo against the clock.
            </p>
            <span className="btn primary">Play</span>
          </Link>
          <Link className="game-card" to="/spot-it" onClick={() => unlockAudio()}>
            <SpotItIcon />
            <h2>Spot It</h2>
            <p>
              Race to tap the one matching symbol between cards. Shared pair or Tower — first to the
              target wins.
            </p>
            <span className="btn primary">Play</span>
          </Link>
          <Link className="game-card" to="/wheel" onClick={() => unlockAudio()}>
            <WheelIcon />
            <h2>Chaos Wheel</h2>
            <p>
              Spin for cash, call letters, buy vowels, and solve the puzzle on the living-room TV.
            </p>
            <span className="btn primary">Play</span>
          </Link>
        </div>
        <Link className="btn hero-settings" to="/settings">
          Color palettes
        </Link>
      </section>
    </Layout>
  );
}
