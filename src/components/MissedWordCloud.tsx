import { useMemo } from "react";
import { layoutWordCloud } from "../lib/wordCloudLayout.ts";

interface Props {
  words: string[];
  width?: number;
  height?: number;
}

export function MissedWordCloud({ words, width = 320, height = 420 }: Props) {
  const placements = useMemo(() => {
    if (words.length === 0) return [];
    return layoutWordCloud(
      words.map((text) => ({ text, weight: text.length })),
      { width, height, minFont: 11, maxFont: Math.min(40, Math.round(width / 8)) },
    );
  }, [words, width, height]);

  if (words.length === 0) {
    return (
      <div className="missed-word-cloud is-empty">
        <p>No missed words — you cleaned the board.</p>
      </div>
    );
  }

  const pad = 8;
  const xs = placements.flatMap((p) => [p.x - p.width / 2, p.x + p.width / 2]);
  const ys = placements.flatMap((p) => [p.y - p.height / 2, p.y + p.height / 2]);
  const minX = Math.min(...xs, -width / 2) - pad;
  const maxX = Math.max(...xs, width / 2) + pad;
  const minY = Math.min(...ys, -height / 2) - pad;
  const maxY = Math.max(...ys, height / 2) + pad;

  return (
    <div className="missed-word-cloud">
      <svg
        className="missed-word-cloud-svg"
        viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
        role="img"
        aria-label={`${words.length} missed words`}
      >
        {placements.map((p) => (
          <text
            key={p.text}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={p.color}
            fontSize={p.fontSize}
            fontFamily="var(--font-display)"
            fontWeight={600}
            className="missed-word-cloud-word"
          >
            {p.text.toUpperCase()}
          </text>
        ))}
      </svg>
      <ol className="visually-hidden">
        {words.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ol>
    </div>
  );
}
