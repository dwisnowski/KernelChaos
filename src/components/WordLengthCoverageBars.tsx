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

/** Horizontal found-vs-possible bars per length bucket (phone results). */
export function WordLengthCoverageBars({
  words,
  possibleByLength,
  label = "Words found by length",
}: Props) {
  const rows = wordLengthCoverage(words, possibleByLength);

  if (rows.length === 0) {
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
          const pct = row.possible > 0 ? Math.min(100, (row.found / row.possible) * 100) : 0;
          return (
            <li key={row.key} className="word-length-bars-row">
              <span className="word-length-bars-label">{row.label}</span>
              <div
                className="word-length-bars-track"
                role="img"
                aria-label={`${row.label} letters: ${row.found} of ${row.possible}`}
              >
                <span
                  className="word-length-bars-fill"
                  style={{
                    width: `${pct}%`,
                    background: LENGTH_BUCKET_COLORS[row.key],
                  }}
                />
              </div>
              <em className="word-length-bars-count">
                {row.found}/{row.possible}
              </em>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
