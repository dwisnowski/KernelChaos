import { LENGTH_BUCKET_COLORS, wordLengthBuckets } from "../lib/wordLengthBuckets.ts";

interface Props {
  words: Iterable<string>;
  /** Accessible name, e.g. player name */
  label?: string;
  size?: number;
}

export function WordLengthPie({ words, label = "Word lengths", size = 148 }: Props) {
  const buckets = wordLengthBuckets(words);
  const total = buckets.reduce((sum, b) => sum + b.count, 0);
  const cx = size / 2;
  const cy = size / 2;
  const outer = size * 0.42;
  const inner = size * 0.26;

  if (total === 0) {
    return (
      <div className="word-length-pie is-empty" role="img" aria-label={`${label}: no words`}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          <circle cx={cx} cy={cy} r={outer} className="word-length-pie-empty-ring" />
          <circle cx={cx} cy={cy} r={inner} className="word-length-pie-hole" />
        </svg>
        <div className="word-length-pie-center">
          <strong>0</strong>
          <span>words</span>
        </div>
      </div>
    );
  }

  let angle = -Math.PI / 2;
  const slices = buckets.map((b) => {
    const sweep = (b.count / total) * Math.PI * 2;
    // Full-circle arcs are invalid as a single SVG A command — nudge the end.
    const drawSweep = sweep >= Math.PI * 2 - 1e-6 ? Math.PI * 2 - 0.001 : sweep;
    const start = angle;
    const end = angle + drawSweep;
    angle += sweep;
    const large = drawSweep > Math.PI ? 1 : 0;
    const mid = start + drawSweep / 2;
    const labelR = (inner + outer) / 2;
    return {
      ...b,
      path: donutSlice(cx, cy, outer, inner, start, end, large),
      labelX: cx + Math.cos(mid) * labelR,
      labelY: cy + Math.sin(mid) * labelR,
      showLabel: sweep >= 0.28 || buckets.length === 1,
    };
  });

  return (
    <figure className="word-length-pie">
      <div className="word-length-pie-chart" role="img" aria-label={`${label}: ${total} words`}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          {slices.map((s) => (
            <path
              key={s.key}
              d={s.path}
              fill={LENGTH_BUCKET_COLORS[s.key]}
              className="word-length-pie-slice"
            />
          ))}
          {slices.map((s) =>
            s.showLabel ? (
              <text
                key={`${s.key}-n`}
                x={s.labelX}
                y={s.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="word-length-pie-slice-label"
              >
                {s.count}
              </text>
            ) : null,
          )}
        </svg>
        <div className="word-length-pie-center">
          <strong>{total}</strong>
          <span>words</span>
        </div>
      </div>
      <ul className="word-length-pie-legend" aria-label="Length breakdown">
        {slices.map((s) => (
          <li key={s.key}>
            <span
              className="word-length-pie-swatch"
              style={{ background: LENGTH_BUCKET_COLORS[s.key] }}
            />
            <span>{s.label} letters</span>
            <em>{s.count}</em>
          </li>
        ))}
      </ul>
    </figure>
  );
}

function donutSlice(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  start: number,
  end: number,
  large: number,
): string {
  const ox1 = cx + Math.cos(start) * outer;
  const oy1 = cy + Math.sin(start) * outer;
  const ox2 = cx + Math.cos(end) * outer;
  const oy2 = cy + Math.sin(end) * outer;
  const ix1 = cx + Math.cos(end) * inner;
  const iy1 = cy + Math.sin(end) * inner;
  const ix2 = cx + Math.cos(start) * inner;
  const iy2 = cy + Math.sin(start) * inner;
  return [
    `M ${ox1} ${oy1}`,
    `A ${outer} ${outer} 0 ${large} 1 ${ox2} ${oy2}`,
    `L ${ix1} ${iy1}`,
    `A ${inner} ${inner} 0 ${large} 0 ${ix2} ${iy2}`,
    "Z",
  ].join(" ");
}
