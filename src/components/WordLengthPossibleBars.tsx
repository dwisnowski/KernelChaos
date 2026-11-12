import { LENGTH_BUCKET_COLORS, bucketLabel } from "../lib/wordLengthBuckets.ts";
import type { LengthCount } from "../types.ts";

interface Props {
  possibleByLength: LengthCount[];
  label?: string;
}

/** Vertical bars of board-wide possible word counts by length (TV results). */
export function WordLengthPossibleBars({
  possibleByLength,
  label = "On the board by length",
}: Props) {
  const rows = possibleByLength.filter((b) => b.count > 0);
  const max = rows.reduce((m, b) => Math.max(m, b.count), 0);

  if (rows.length === 0 || max === 0) {
    return (
      <div className="word-length-possible is-empty" role="img" aria-label={`${label}: none`}>
        <p className="muted">No words on this board</p>
      </div>
    );
  }

  return (
    <figure className="word-length-possible" aria-label={label}>
      <ul className="word-length-possible-list">
        {rows.map((row) => {
          const heightPct = Math.max(8, (row.count / max) * 100);
          const name = bucketLabel(row.key);
          return (
            <li key={row.key} className="word-length-possible-col">
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
