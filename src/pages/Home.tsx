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
        </div>
      </section>
      <section className="game-shelf" aria-label="More games soon">
        <h2>Coming soon</h2>
        <p className="muted">More family games will land here. Boggle is ready tonight.</p>
      </section>
    </Layout>
  );
}
