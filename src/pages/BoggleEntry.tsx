import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BoggleStats } from "../components/BoggleStats.tsx";
import { Layout } from "../components/Layout.tsx";
import { unlockAudio } from "../audio/sfx.ts";

export function BoggleEntry() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isJoinFocus =
    location.pathname.endsWith("/join") || Boolean(params.get("code"));
  const [name, setName] = useState(() => localStorage.getItem("kernelchaos.name") ?? "");
  const [code, setCode] = useState(() => (params.get("code") ?? "").toUpperCase());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createRoom(e: FormEvent) {
    e.preventDefault();
    unlockAudio();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter your name");
      return;
    }
    setBusy(true);
    setError(null);
    localStorage.setItem("kernelchaos.name", trimmed);
    try {
      const res = await fetch("/api/rooms", { method: "POST" });
      const data = (await res.json()) as { code?: string; error?: string };
      if (!res.ok || !data.code) {
        setError(data.error ?? "Could not create room");
        setBusy(false);
        return;
      }
      navigate(`/boggle/room/${data.code}`, { state: { name: trimmed, host: true } });
    } catch {
      setError("Network error");
      setBusy(false);
    }
  }

  function joinRoom(e: FormEvent) {
    e.preventDefault();
    unlockAudio();
    const trimmed = name.trim();
    const room = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Enter your name");
      return;
    }
    if (!/^[A-Z1-9]{4}$/.test(room)) {
      setError("Room code is 4 characters (A–Z, 1–9)");
      return;
    }
    localStorage.setItem("kernelchaos.name", trimmed);
    navigate(`/boggle/room/${room}`, { state: { name: trimmed } });
  }

  const createCard = (
    <form className="entry-card" onSubmit={createRoom}>
      <h2>Start a session</h2>
      <p>Create a room and share the code or QR with family.</p>
      <button className={`btn${isJoinFocus ? "" : " primary"}`} type="submit" disabled={busy}>
        {busy ? "Creating…" : "Create room"}
      </button>
    </form>
  );

  const joinCard = (
    <form className="entry-card" onSubmit={joinRoom}>
      <h2>Join a session</h2>
      <label className="field">
        <span>Room code</span>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={4}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          placeholder="A7K3"
        />
      </label>
      <button className={`btn${isJoinFocus ? " primary" : ""}`} type="submit">
        Join room
      </button>
    </form>
  );

  return (
    <Layout title="KernelChaos · Boggle">
      <section className="entry">
        <Link className="back-link" to="/">
          ← All games
        </Link>
        <h1>Boggle</h1>
        <p className="lede">Same board. Same clock. Drag letters on your phone.</p>

        <label className="field">
          <span>Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoComplete="nickname"
            placeholder="Alex"
          />
        </label>

        {isJoinFocus ? (
          <>
            {joinCard}
            {createCard}
          </>
        ) : (
          <>
            {createCard}
            {joinCard}
          </>
        )}

        {error ? <p className="error">{error}</p> : null}

        <BoggleStats />
      </section>
    </Layout>
  );
}
