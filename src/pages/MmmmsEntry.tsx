import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ActiveRooms } from "../components/ActiveRooms.tsx";
import { Layout } from "../components/Layout.tsx";
import { unlockAudio } from "../audio/sfx.ts";

export function MmmmsEntry() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [name, setName] = useState(() => localStorage.getItem("kernelchaos.name") ?? "");
  const [code, setCode] = useState(() => (params.get("code") ?? "").toUpperCase());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function postNewRoom(): Promise<string | null> {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ game: "mmmms" }),
      });
      const data = (await res.json()) as { code?: string; error?: string };
      if (!res.ok || !data.code) {
        setError(data.error ?? "Could not create room");
        setBusy(false);
        return null;
      }
      return data.code;
    } catch {
      setError("Network error");
      setBusy(false);
      return null;
    }
  }

  async function createRoom(e: FormEvent) {
    e.preventDefault();
    unlockAudio();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter your name");
      return;
    }
    localStorage.setItem("kernelchaos.name", trimmed);
    const roomCode = await postNewRoom();
    if (!roomCode) return;
    navigate(`/mmmms/room/${roomCode}`, { state: { name: trimmed, host: true } });
  }

  async function createRoomForTv() {
    unlockAudio();
    const roomCode = await postNewRoom();
    if (!roomCode) return;
    navigate(`/mmmms/room/${roomCode}/tv`);
  }

  function joinWithCode(room: string) {
    unlockAudio();
    const trimmed = name.trim();
    const normalized = room.trim().toUpperCase();
    if (!trimmed) {
      setError("Enter your name");
      return;
    }
    if (!/^[A-Z1-9]{4}$/.test(normalized)) {
      setError("Room code is 4 characters (A–Z, 1–9)");
      return;
    }
    localStorage.setItem("kernelchaos.name", trimmed);
    navigate(`/mmmms/room/${normalized}`, { state: { name: trimmed } });
  }

  function joinRoom(e: FormEvent) {
    e.preventDefault();
    joinWithCode(code);
  }

  function spectateRoom() {
    unlockAudio();
    const room = code.trim().toUpperCase();
    if (!/^[A-Z1-9]{4}$/.test(room)) {
      setError("Room code is 4 characters (A–Z, 1–9)");
      return;
    }
    setError(null);
    navigate(`/mmmms/room/${room}/tv`);
  }

  return (
    <Layout title="KernelChaos · M&Ms Smash">
      <section className="entry">
        <Link className="back-link" to="/">
          ← All games
        </Link>
        <h1>M&Ms Smash</h1>
        <p className="lede">Stack colored orbs, guess the attack, and watch the bottom explode.</p>

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

        <form className="entry-card" onSubmit={joinRoom}>
          <h2>Join a duel</h2>
          <ActiveRooms
            game="mmmms"
            onSelect={(roomCode) => {
              setCode(roomCode);
              joinWithCode(roomCode);
            }}
          />
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
          <button className="btn primary" type="submit">
            Join room
          </button>
          <div className="entry-tv-actions">
            <button className="btn" type="button" onClick={spectateRoom}>
              Spectate on TV
            </button>
            <p className="entry-tv-hint">Watch this duel on the living-room display.</p>
          </div>
        </form>

        <form className="entry-card" onSubmit={(e) => void createRoom(e)}>
          <h2>Start a duel</h2>
          <p>Exactly two players. Share the code or QR with your opponent.</p>
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Creating…" : "Create room"}
          </button>
          <div className="entry-tv-actions">
            <button className="btn" type="button" disabled={busy} onClick={() => void createRoomForTv()}>
              {busy ? "Creating…" : "Create for TV"}
            </button>
            <p className="entry-tv-hint">Big screen shows the lobby QR; phones join to play.</p>
          </div>
        </form>

        {error ? <p className="error">{error}</p> : null}
      </section>
    </Layout>
  );
}
