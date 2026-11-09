import { useEffect, useState } from "react";

export interface NamedRecord {
  value: string | number;
  name: string;
  date: string;
}

export interface BoggleStatsPayload {
  gamesPlayed: number;
  totalWords: number;
  averageWordsPerGame: number | null;
  longestWord: NamedRecord | null;
  highestScore: NamedRecord | null;
  mostWords: NamedRecord | null;
}

function formatAvg(n: number | null): string {
  if (n == null) return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function RecordLine({
  label,
  record,
  formatValue,
}: {
  label: string;
  record: NamedRecord | null;
  formatValue: (v: string | number) => string;
}) {
  if (!record) {
    return (
      <div className="hof-stat">
        <span className="hof-label">{label}</span>
        <span className="hof-value">—</span>
      </div>
    );
  }
  return (
    <div className="hof-stat">
      <span className="hof-label">{label}</span>
      <span className="hof-value">{formatValue(record.value)}</span>
      <span className="hof-meta">
        {record.name} · {record.date}
      </span>
    </div>
  );
}

export function BoggleStats() {
  const [stats, setStats] = useState<BoggleStatsPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/boggle/stats");
        if (!res.ok) return;
        const data = (await res.json()) as BoggleStatsPayload;
        if (!cancelled) setStats(data);
      } catch {
        /* soft-fail: leave section empty */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats) return null;

  if (stats.gamesPlayed === 0) {
    return (
      <section className="hof" aria-label="Hall of fame">
        <h2>Hall of fame</h2>
        <p className="hof-empty">Play a round to start the board.</p>
      </section>
    );
  }

  return (
    <section className="hof" aria-label="Hall of fame">
      <h2>Hall of fame</h2>
      <div className="hof-grid">
        <div className="hof-stat">
          <span className="hof-label">Games played</span>
          <span className="hof-value">{stats.gamesPlayed}</span>
        </div>
        <div className="hof-stat">
          <span className="hof-label">Words found</span>
          <span className="hof-value">{stats.totalWords}</span>
        </div>
        <div className="hof-stat">
          <span className="hof-label">Avg words / game</span>
          <span className="hof-value">{formatAvg(stats.averageWordsPerGame)}</span>
        </div>
        <RecordLine
          label="Longest word"
          record={stats.longestWord}
          formatValue={(v) => String(v).toUpperCase()}
        />
        <RecordLine
          label="Highest score"
          record={stats.highestScore}
          formatValue={(v) => `${v} pts`}
        />
        <RecordLine
          label="Most words"
          record={stats.mostWords}
          formatValue={(v) => String(v)}
        />
      </div>
    </section>
  );
}
