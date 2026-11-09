export interface CloudWord {
  text: string;
  weight: number;
}

export interface CloudPlacement {
  text: string;
  weight: number;
  x: number;
  y: number;
  fontSize: number;
  width: number;
  height: number;
  color: string;
}

const PALETTE = ["#3ecf8e", "#f0a202", "#8ecfff", "#e07a3a", "#b7c9c0", "#f4f7f2", "#5a8f7b"];

export function hashWord(text: string): number {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = (h * 33) ^ text.charCodeAt(i);
  }
  return h >>> 0;
}

function measure(text: string, fontSize: number, fontFamily: string): { width: number; height: number } {
  if (typeof document === "undefined") {
    return { width: text.length * fontSize * 0.58, height: fontSize * 1.05 };
  }
  const canvas = measure.canvas ?? (measure.canvas = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: text.length * fontSize * 0.58, height: fontSize * 1.05 };
  ctx.font = `600 ${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  return {
    width: metrics.width,
    height: fontSize * 1.05,
  };
}
measure.canvas = null as HTMLCanvasElement | null;

function overlaps(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
  pad: number,
): boolean {
  return !(
    a.x + a.width / 2 + pad < b.x - b.width / 2 ||
    a.x - a.width / 2 - pad > b.x + b.width / 2 ||
    a.y + a.height / 2 + pad < b.y - b.height / 2 ||
    a.y - a.height / 2 - pad > b.y + b.height / 2
  );
}

/**
 * Wordle-style spiral layout: largest weight first, Archimedean spiral + AABB collision.
 * Coordinates are centered at (0,0); caller sets SVG viewBox from bounds.
 */
export function layoutWordCloud(
  words: CloudWord[],
  opts: {
    width: number;
    height: number;
    minFont?: number;
    maxFont?: number;
    fontFamily?: string;
  },
): CloudPlacement[] {
  const minFont = opts.minFont ?? 12;
  const maxFont = opts.maxFont ?? 42;
  const fontFamily = opts.fontFamily ?? "Space Grotesk, system-ui, sans-serif";
  const halfW = opts.width / 2;
  const halfH = opts.height / 2;

  const sorted = [...words].sort((a, b) => b.weight - a.weight || a.text.localeCompare(b.text));
  const weights = sorted.map((w) => w.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const span = maxW - minW || 1;

  const placed: CloudPlacement[] = [];

  for (const word of sorted) {
    const t = (word.weight - minW) / span;
    const fontSize = Math.round(minFont + t * (maxFont - minFont));
    const { width, height } = measure(word.text.toUpperCase(), fontSize, fontFamily);
    const color = PALETTE[hashWord(word.text) % PALETTE.length]!;

    let placedOk = false;
    for (let step = 0; step < 2500; step++) {
      const angle = step * 0.35;
      const radius = 2 + step * 0.55;
      const x = Math.cos(angle) * radius * 0.85;
      const y = Math.sin(angle) * radius * 0.55;
      if (Math.abs(x) + width / 2 > halfW - 4 || Math.abs(y) + height / 2 > halfH - 4) {
        continue;
      }
      const candidate = { x, y, width, height };
      if (placed.some((p) => overlaps(candidate, p, 3))) continue;
      placed.push({
        text: word.text,
        weight: word.weight,
        x,
        y,
        fontSize,
        width,
        height,
        color,
      });
      placedOk = true;
      break;
    }
    if (!placedOk && placed.length < 8) {
      // Always try to keep a few words even if packing is tight.
      placed.push({
        text: word.text,
        weight: word.weight,
        x: 0,
        y: placed.length * (minFont + 4),
        fontSize: minFont,
        width,
        height: minFont * 1.05,
        color,
      });
    }
  }

  return placed;
}
