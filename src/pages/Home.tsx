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
          <article className="game-card">
            <BoggleIcon />
            <h2>Boggle</h2>
            <p>
              Drag adjacent letters on a shared timed board. Short room codes and a TV-friendly view for
              the whole crew.
            </p>
            <Link className="btn primary" to="/boggle" onClick={() => unlockAudio()}>
              Play
            </Link>
          </article>
          <article className="game-card">
            <ScattergoriesIcon />
            <h2>Scattergories</h2>
            <p>
              Fill categories for a rolled letter. The TV reveals answers and scores the round together.
            </p>
            <Link className="btn primary" to="/scattergories" onClick={() => unlockAudio()}>
              Play
            </Link>
          </article>
          <article className="game-card">
            <MmmmsIcon />
            <h2>M&Ms Smash</h2>
            <p>
              Two players stack colored orbs, guess the attack, and explode from the bottom up.
            </p>
            <Link className="btn primary" to="/mmmms" onClick={() => unlockAudio()}>
              Play
            </Link>
          </article>
        </div>
      </section>
    </Layout>
  );
}
