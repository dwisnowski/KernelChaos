import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout.tsx";
import { PalettePicker } from "../components/PalettePicker.tsx";

type UndefinedEntry = {
  word: string;
  reportCount: number;
  firstSeenAt: number;
};

type UndefinedWordsLoad =
  | { status: "loading" }
  | { status: "ready"; entries: UndefinedEntry[] }
  | { status: "error" };

function fetchUndefinedWords(): Promise<UndefinedEntry[]> {
  return fetch("/api/boggle/undefined-words").then(async (res) => {
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as {
      entries?: UndefinedEntry[];
      words?: string[];
    };
    return (
      data.entries ??
      (data.words ?? []).map((word) => ({
        word,
        reportCount: 1,
        firstSeenAt: 0,
      }))
    );
  });
}

export function Settings() {
  const [undefinedWords, setUndefinedWords] = useState<UndefinedWordsLoad>({ status: "loading" });
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setUndefinedWords({ status: "loading" });
    void fetchUndefinedWords()
      .then((entries) => {
        if (!cancelled) setUndefinedWords({ status: "ready", entries });
      })
      .catch(() => {
        if (!cancelled) setUndefinedWords({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  return (
    <Layout title="Colors">
      <section className="settings-page">
        <div>
          <h1>Color palettes</h1>
          <p className="settings-lede">
            Pick a fun preset or tune every chrome color. Choices stay on this device.
          </p>
        </div>

        <PalettePicker />

        <div className="settings-actions">
          <Link className="btn primary" to="/">
            Back home
          </Link>
        </div>

        <div className="settings-section admin-section">
          <div className="admin-section-head">
            <h2>
              Admin
              {undefinedWords.status === "ready"
                ? ` · ${undefinedWords.entries.length} undefined word${
                    undefinedWords.entries.length === 1 ? "" : "s"
                  }`
                : ""}
            </h2>
            <button type="button" className="btn" onClick={() => setRefreshToken((n) => n + 1)}>
              Refresh
            </button>
          </div>
          <p className="settings-lede">
            Free Dictionary misses queued for Boggle dictionary cleanup. Not gated —
            anyone can open this list.
          </p>
          {undefinedWords.status === "loading" ? (
            <p className="muted">Loading…</p>
          ) : null}
          {undefinedWords.status === "error" ? (
            <p className="muted">Couldn’t load the undefined-word list.</p>
          ) : null}
          {undefinedWords.status === "ready" && undefinedWords.entries.length === 0 ? (
            <p className="muted">No undefined words recorded yet.</p>
          ) : null}
          {undefinedWords.status === "ready" && undefinedWords.entries.length > 0 ? (
            <ul className="admin-undefined-list">
              {undefinedWords.entries.map((entry) => (
                <li key={entry.word}>
                  <strong>{entry.word.toUpperCase()}</strong>
                  <span className="muted">
                    · reported {entry.reportCount}×
                    {entry.firstSeenAt
                      ? ` · first ${new Date(entry.firstSeenAt).toISOString().slice(0, 10)}`
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </Layout>
  );
}
