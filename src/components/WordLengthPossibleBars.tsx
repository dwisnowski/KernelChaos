import { LENGTH_BUCKET_COLORS, bucketLabel } from "../lib/wordLengthBuckets.ts";
import type { LengthBucketKey, LengthCount } from "../types.ts";

interface Props {
  possibleByLength: LengthCount[];
  label?: string;
  selectedKey?: LengthBucketKey | null;
  onSelectKey?: (key: LengthBucketKey) => void;
}

/** Vertical bars of board-wide possible word counts by length (TV results). */
export function WordLengthPossibleBars({
  possibleByLength,
  label = "On the board by length",
  selectedKey = null,
  onSelectKey,
}: Props) {
  const rows = possibleByLength.filter((b) => b.count > 0);
  const max = rows.reduce((m, b) => Math.max(m, b.count), 0);
  const interactive = typeof onSelectKey === "function";

  if (rows.length === 0 || max === 0) {
    return (
      <div className="word-length-possible is-empty" role="img" aria-label={`${label}: none`}>
        <p className="muted">No words on this board</p>
      </div>
    );
  }

  return (
    <figure className="word-length-possible" aria-label={label}>
      <ul className="word-length-possible-list" role={interactive ? "tablist" : undefined}>
        {rows.map((row) => {
          const heightPct = Math.max(8, (row.count / max) * 100);
          const name = bucketLabel(row.key);
          const selected = selectedKey === row.key;
          const className = `word-length-possible-col${selected ? " is-selected" : ""}${
            interactive ? " is-interactive" : ""
          }`;

          if (interactive) {
            return (
              <li key={row.key} className={className}>
                <button
                  type="button"
                  className="word-length-possible-btn"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`${row.count} words of length ${name}`}
                  onClick={() => onSelectKey(row.key)}
                >
                  <strong className="word-length-possible-value">{row.count}</strong>
                  <div className="word-length-possible-track" aria-hidden>
                    <span
                      className="word-length-possible-fill"
                      style={{
                        height: `${heightPct}%`,
                        background: LENGTH_BUCKET_COLORS[row.key],
                      }}
                    />
                  </div>
                  <span className="word-length-possible-label">{name}</span>
                </button>
              </li>
            );
          }

          return (
            <li key={row.key} className={className}>
              <strong className="word-length-possible-value">{row.count}</strong>
              <div className="word-length-possible-track" aria-hidden>
                <span
                  className="word-length-possible-fill"
                  style={{
                    height: `${heightPct}%`,
                    background: LENGTH_BUCKET_COLORS[row.key],
                  }}
                />
              </div>
              <span className="word-length-possible-label">{name}</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
