import { Link } from "react-router-dom";
import { Layout } from "../components/Layout.tsx";
import { unlockAudio } from "../audio/sfx.ts";

export function Home() {
  return (
    <Layout>
      <section className="hero">
        <p className="hero-kicker">Family games over the internet</p>
        <h1 className="hero-brand">KernelChaos</h1>
        <p className="hero-lead">
          Shared boards, short room codes, and a living-room-friendly screen for the whole crew.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" to="/boggle" onClick={() => unlockAudio()}>
            Play Boggle
          </Link>
          <Link className="btn" to="/scattergories" onClick={() => unlockAudio()}>
            Play Scattergories
          </Link>
        </div>
      </section>
      <section className="game-shelf" aria-label="Games">
        <h2>Games</h2>
        <ul className="game-shelf-list">
          <li>
            <Link to="/boggle" onClick={() => unlockAudio()}>
              <strong>Boggle</strong>
              <span className="muted">Drag letters on a shared timed board</span>
            </Link>
          </li>
          <li>
            <Link to="/scattergories" onClick={() => unlockAudio()}>
              <strong>Scattergories</strong>
              <span className="muted">Fill categories · TV reveals answers</span>
            </Link>
          </li>
        </ul>
      </section>
    </Layout>
  );
}
