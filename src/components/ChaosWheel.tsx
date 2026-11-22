import { animate } from "animejs";
import { useEffect, useRef, useState } from "react";
import type { WheelLastSpin, WheelWedge } from "../wheelTypes.ts";
import { createBurstScene, type BurstScene } from "../fx/burstScene.ts";

const TAU = Math.PI * 2;

const CASH_COLORS = ["#1a6bff", "#ff3d8b", "#0e9f6e", "#7c3aed", "#0891b2", "#ea580c"];
const SPECIAL: Record<string, string> = {
  bankrupt: "#1a1a1a",
  loseTurn: "#4b5563",
  freeSpin: "#e6a100",
  payEach: "#0d9488",
  double: "#db2777",
  flatBonus: "#16a34a",
  jackpot: "#ca8a04",
  half: "#64748b",
  swapBanks: "#7c3aed",
  steal: "#dc2626",
  freeLetter: "#2563eb",
  wildVowel: "#c026d3",
  mystery: "#9333ea",
  passWheel: "#57534e",
  chaosTax: "#b45309",
  bankruptLite: "#334155",
  mirror: "#0891b2",
  speed: "#ea580c",
  insurance: "#059669",
};

function drawWheel(
  ctx: CanvasRenderingContext2D,
  size: number,
  wedges: WheelWedge[],
  angle: number,
): void {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.46;
  ctx.clearRect(0, 0, size, size);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  const n = wedges.length || 1;
  const slice = TAU / n;
  for (let i = 0; i < n; i++) {
    const start = -Math.PI / 2 + i * slice;
    const wedge = wedges[i]!;
    let fill = CASH_COLORS[i % CASH_COLORS.length]!;
    if (wedge.kind !== "cash") fill = SPECIAL[wedge.kind] ?? fill;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, start, start + slice);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.save();
    ctx.rotate(start + slice / 2);
    ctx.fillStyle = wedge.kind === "bankrupt" ? "#fbbf24" : "#fff";
    ctx.font = `700 ${Math.max(10, size * 0.035)}px "Space Grotesk", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = wedge.label.length > 8 ? `${wedge.label.slice(0, 7)}…` : wedge.label;
    ctx.fillText(label, r * 0.62, 0);
    ctx.restore();
  }

  const hub = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.16);
  hub.addColorStop(0, "#ffe7a0");
  hub.addColorStop(0.55, "#e6a100");
  hub.addColorStop(1, "#b45309");
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.14, 0, TAU);
  ctx.fillStyle = hub;
  ctx.fill();
  ctx.strokeStyle = "#fff8e7";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(cx, cy - r - 2);
  ctx.lineTo(cx - 12, cy - r - 22);
  ctx.lineTo(cx + 12, cy - r - 22);
  ctx.closePath();
  ctx.fillStyle = "#ffd35c";
  ctx.fill();
  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 2;
  ctx.stroke();
}

interface Props {
  wedges: WheelWedge[];
  lastSpin: WheelLastSpin | null;
  size?: number;
  className?: string;
  onSettled?: (wedgeIndex: number) => void;
}

export function ChaosWheel({ wedges, lastSpin, size: sizeProp, className, onSettled }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const burstRef = useRef<BurstScene | null>(null);
  const settledKey = useRef<string | null>(null);
  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;
  const [autoSize, setAutoSize] = useState(320);
  const size = sizeProp ?? autoSize;

  useEffect(() => {
    if (sizeProp != null) return;
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0]?.contentRect.width ?? 0);
      if (w > 0) setAutoSize(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [sizeProp]);

  useEffect(() => {
    const fx = fxRef.current;
    if (!fx) return;
    const scene = createBurstScene(fx);
    burstRef.current = scene;
    scene.resize(size, size);
    return () => {
      scene.dispose();
      burstRef.current = null;
    };
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawWheel(ctx, size, wedges, angleRef.current);
  }, [wedges, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !lastSpin) return;
    const key = `${lastSpin.startedAt}:${lastSpin.wedgeIndex}:${lastSpin.targetAngle}`;
    if (settledKey.current === key) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = angleRef.current;
    const to = lastSpin.targetAngle;
    const remaining = Math.max(0, lastSpin.endsAt - Date.now());

    const paint = (angle: number) => {
      angleRef.current = angle;
      drawWheel(ctx, size, wedges, angle);
    };

    if (reduced || remaining < 80) {
      paint(to);
      settledKey.current = key;
      burstRef.current?.explode(size / 2, size / 2, { color: "#ffd35c", count: 28, power: 1.2 });
      onSettledRef.current?.(lastSpin.wedgeIndex);
      return;
    }

    const proxy = { angle: from };
    const anim = animate(proxy, {
      angle: to,
      duration: remaining,
      ease: "outCubic",
      onUpdate: () => paint(proxy.angle),
      onComplete: () => {
        paint(to);
        settledKey.current = key;
        burstRef.current?.explode(size / 2, size / 2, { color: "#ffd35c", count: 36, power: 1.4 });
        onSettledRef.current?.(lastSpin.wedgeIndex);
      },
    });

    return () => {
      anim.pause();
    };
  }, [lastSpin, wedges, size]);

  return (
    <div
      ref={rootRef}
      className={className ? `chaos-wheel ${className}` : "chaos-wheel"}
      style={sizeProp != null ? { width: sizeProp, height: sizeProp } : undefined}
    >
      <canvas ref={canvasRef} className="chaos-wheel-canvas" aria-hidden="true" />
      <canvas ref={fxRef} className="chaos-wheel-fx" aria-hidden="true" />
    </div>
  );
}
