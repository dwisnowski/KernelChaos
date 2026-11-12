import {
  LENGTH_BUCKET_COLORS,
  wordLengthCoverage,
} from "../lib/wordLengthBuckets.ts";
import type { LengthCount } from "../types.ts";

interface Props {
  words: Iterable<string>;
  possibleByLength: LengthCount[];
  label?: string;
}

/** Vertical found-vs-possible bar chart per length bucket (phone results). */
export function WordLengthCoverageBars({
  words,
  possibleByLength,
  label = "Words found by length",
}: Props) {
  const rows = wordLengthCoverage(words, possibleByLength);
  const maxPossible = rows.reduce((m, row) => Math.max(m, row.possible), 0);

  if (rows.length === 0 || maxPossible === 0) {
    return (
      <div className="word-length-bars is-empty" role="img" aria-label={`${label}: none`}>
        <p className="muted">No words on this board</p>
      </div>
    );
  }

  return (
    <figure className="word-length-bars" aria-label={label}>
      <ul className="word-length-bars-list">
        {rows.map((row) => {
          const trackPct = Math.max(10, (row.possible / maxPossible) * 100);
          const fillPct = row.possible > 0 ? Math.min(100, (row.found / row.possible) * 100) : 0;
          return (
            <li key={row.key} className="word-length-bars-col">
              <strong className="word-length-bars-count">
                {row.found}/{row.possible}
              </strong>
              <div
                className="word-length-bars-track"
                role="img"
                aria-label={`${row.label} letters: ${row.found} of ${row.possible}`}
                style={{ height: `${trackPct}%` }}
              >
                <span
                  className="word-length-bars-fill"
                  style={{
                    height: `${fillPct}%`,
                    background: LENGTH_BUCKET_COLORS[row.key],
                  }}
                />
              </div>
              <span className="word-length-bars-label">{row.label}</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
