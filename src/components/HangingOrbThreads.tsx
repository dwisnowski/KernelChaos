import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ORB_COLOR_HEX, type OrbColor } from "../mmmmsTypes.ts";

export type HangingThread = "player" | "opponent";

export interface HangingOrbThreadsHandle {
  /** Center of an orb in coordinates relative to this component's box. */
  getOrbCenter(thread: HangingThread, bottomIndex: number): { x: number; y: number } | null;
}

interface Props {
  /** Player stack bottom→top, or null when colors are hidden (TV / anonymous). */
  playerOrbs: OrbColor[] | null;
  /** When playerOrbs is null, draw this many anonymous beads on the player (right) thread. */
  playerCount?: number;
  /** Opponent anonymous bead count (left thread). */
  opponentCount: number;
  vanishingPlayer?: Set<number>;
  vanishingOpponent?: Set<number>;
  highlightPlayerBottom?: boolean;
  /** Pointer + DeviceMotion tilt. Off for TV / reduced motion. */
  enableTilt?: boolean;
  className?: string;
}

interface OrbLayout {
  x: number;
  y: number;
  r: number;
  color: string;
  hidden: boolean;
  vanish: boolean;
  hot: boolean;
  sparklePhase: number;
}

interface ThreadLayout {
  orbs: OrbLayout[];
  anchorX: number;
  anchorY: number;
}

interface LayoutSnapshot {
  width: number;
  height: number;
  opponent: ThreadLayout;
  player: ThreadLayout;
}

const HIDDEN_HEX = "#6b7c8f";
const SILK = "#d4af37";
const MAX_ORBS = 30;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

function buildThreadOrbs(
  count: number,
  colors: OrbColor[] | null,
  vanishing: Set<number> | undefined,
  highlightBottom: boolean,
): { color: string; hidden: boolean; vanish: boolean; hot: boolean; sparklePhase: number }[] {
  const n = Math.min(Math.max(0, count), MAX_ORBS);
  const out = [];
  for (let i = 0; i < n; i++) {
    const c = colors?.[i];
    out.push({
      color: c ? ORB_COLOR_HEX[c] : HIDDEN_HEX,
      hidden: !c,
      vanish: vanishing?.has(i) ?? false,
      hot: highlightBottom && i === 0 && !(vanishing?.has(i) ?? false),
      sparklePhase: (i * 0.73) % (Math.PI * 2),
    });
  }
  return out;
}

function layoutThreads(
  width: number,
  height: number,
  opponentCount: number,
  playerOrbs: OrbColor[] | null,
  playerCount: number,
  vanishingOpponent: Set<number> | undefined,
  vanishingPlayer: Set<number> | undefined,
  highlightPlayerBottom: boolean,
  swayOpp: number,
  swayPlayer: number,
): LayoutSnapshot {
  const padTop = Math.max(12, height * 0.04);
  const padBottom = Math.max(16, height * 0.06);
  const usable = Math.max(40, height - padTop - padBottom);

  const oppSpecs = buildThreadOrbs(opponentCount, null, vanishingOpponent, false);
  const playerSpecs = buildThreadOrbs(
    playerOrbs?.length ?? playerCount,
    playerOrbs,
    vanishingPlayer,
    highlightPlayerBottom,
  );

  const maxCount = Math.max(oppSpecs.length, playerSpecs.length, 1);
  const gap = usable / (maxCount + 0.35);
  const r = Math.min(width * 0.11, gap * 0.38, 22);

  const oppX = width * 0.32;
  const playerX = width * 0.68;
  const anchorY = padTop * 0.35;

  function place(
    specs: ReturnType<typeof buildThreadOrbs>,
    baseX: number,
    sway: number,
  ): ThreadLayout {
    const orbs: OrbLayout[] = [];
    for (let i = 0; i < specs.length; i++) {
      // Bottom index 0 at bottom of canvas; high index toward top (hanging down from anchor).
      const fromTop = specs.length - 1 - i;
      const y = padTop + gap * (fromTop + 0.55);
      const x = baseX + sway * (0.55 + fromTop * 0.08);
      orbs.push({ x, y, r, ...specs[i]! });
    }
    return { orbs, anchorX: baseX, anchorY };
  }

  return {
    width,
    height,
    opponent: place(oppSpecs, oppX, swayOpp),
    player: place(playerSpecs, playerX, swayPlayer),
  };
}

function drawSilk(
  ctx: CanvasRenderingContext2D,
  anchorX: number,
  anchorY: number,
  orbs: OrbLayout[],
  t: number,
) {
  const visible = orbs.filter((o) => !o.vanish);
  if (visible.length === 0) return;

  ctx.save();
  ctx.strokeStyle = SILK;
  ctx.lineWidth = Math.max(1.2, Math.min(2.4, orbs[0]!.r * 0.18));
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(212, 175, 55, 0.45)";
  ctx.shadowBlur = 6;

  // Draw from top orb down to bottom.
  const topFirst = [...visible].sort((a, b) => a.y - b.y);
  ctx.beginPath();
  ctx.moveTo(anchorX, anchorY);
  for (let i = 0; i < topFirst.length; i++) {
    const orb = topFirst[i]!;
    const prev = i === 0 ? { x: anchorX, y: anchorY } : topFirst[i - 1]!;
    const midY = (prev.y + orb.y) / 2;
    const wobble = Math.sin(t * 1.4 + i * 0.7) * 2.2;
    ctx.quadraticCurveTo(prev.x + wobble, midY, orb.x, orb.y - orb.r * 0.85);
  }
  ctx.stroke();
  ctx.restore();
}

function drawOrb(ctx: CanvasRenderingContext2D, orb: OrbLayout, t: number, reduceMotion: boolean) {
  if (orb.vanish) return;
  const shimmer = reduceMotion ? 0.15 : 0.35 + 0.25 * Math.sin(t * 2.2 + orb.sparklePhase);
  const pulse = reduceMotion ? 1 : 1 + 0.04 * Math.sin(t * 1.8 + orb.sparklePhase);

  ctx.save();
  ctx.translate(orb.x, orb.y);
  ctx.scale(pulse, pulse);

  if (orb.hot) {
    ctx.beginPath();
    ctx.arc(0, 0, orb.r * 1.35, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 220, 120, ${0.22 + shimmer * 0.15})`;
    ctx.fill();
  }

  const grad = ctx.createRadialGradient(-orb.r * 0.35, -orb.r * 0.4, orb.r * 0.1, 0, 0, orb.r);
  grad.addColorStop(0, "rgba(255,255,255,0.75)");
  grad.addColorStop(0.35, orb.color);
  grad.addColorStop(1, orb.hidden ? "#3d4a58" : orb.color);

  ctx.beginPath();
  ctx.arc(0, 0, orb.r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-orb.r * 0.28, -orb.r * 0.32, orb.r * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,${0.25 + shimmer * 0.45})`;
  ctx.fill();

  // Tiny sparkles
  if (!reduceMotion) {
    for (let s = 0; s < 3; s++) {
      const a = orb.sparklePhase + t * 1.6 + s * 2.1;
      const dist = orb.r * (0.55 + 0.35 * Math.sin(t + s));
      const sx = Math.cos(a) * dist;
      const sy = Math.sin(a) * dist;
      const sr = 0.8 + shimmer * 1.4;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.35 + shimmer * 0.4})`;
      ctx.fill();
    }
  }

  ctx.restore();
}

export const HangingOrbThreads = forwardRef<HangingOrbThreadsHandle, Props>(
  function HangingOrbThreads(
    {
      playerOrbs,
      playerCount = 0,
      opponentCount,
      vanishingPlayer,
      vanishingOpponent,
      highlightPlayerBottom = false,
      enableTilt = true,
      className,
    },
    ref,
  ) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const layoutRef = useRef<LayoutSnapshot | null>(null);
    const pointerRef = useRef({ x: 0.5, y: 0.5 });
    const tiltRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number | null>(null);
    const propsRef = useRef({
      playerOrbs,
      playerCount,
      opponentCount,
      vanishingPlayer,
      vanishingOpponent,
      highlightPlayerBottom,
      enableTilt,
    });
    propsRef.current = {
      playerOrbs,
      playerCount,
      opponentCount,
      vanishingPlayer,
      vanishingOpponent,
      highlightPlayerBottom,
      enableTilt,
    };

    useImperativeHandle(ref, () => ({
      getOrbCenter(thread, bottomIndex) {
        const layout = layoutRef.current;
        const wrap = wrapRef.current;
        if (!layout || !wrap) return null;
        const stack = thread === "player" ? layout.player : layout.opponent;
        const orb = stack.orbs[bottomIndex];
        if (!orb || orb.vanish) return null;
        return { x: orb.x, y: orb.y };
      },
    }));

    useEffect(() => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let width = 0;
      let height = 0;
      let dpr = 1;
      const reduceMotion = prefersReducedMotion();
      const start = performance.now();

      function resize() {
        const rect = wrap!.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas!.width = Math.floor(width * dpr);
        canvas!.height = Math.floor(height * dpr);
        canvas!.style.width = `${width}px`;
        canvas!.style.height = `${height}px`;
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      const ro = new ResizeObserver(() => resize());
      ro.observe(wrap);
      resize();

      function frame(now: number) {
        const t = (now - start) / 1000;
        const p = propsRef.current;
        const tiltOn = p.enableTilt && !reduceMotion;

        let swayBase = reduceMotion ? 0 : Math.sin(t * 1.15) * 5;
        let swayOpp = swayBase;
        let swayPlayer = -swayBase * 0.85;

        if (tiltOn) {
          const px = (pointerRef.current.x - 0.5) * 18;
          const tx = tiltRef.current.x * 14;
          swayOpp += px * 0.55 + tx;
          swayPlayer += px * 0.85 + tx * 0.7;
          swayOpp += Math.sin(t * 2.4 + 1) * 2.2;
          swayPlayer += Math.sin(t * 2.1) * 2.5;
        }

        const layout = layoutThreads(
          width,
          height,
          p.opponentCount,
          p.playerOrbs,
          p.playerCount,
          p.vanishingOpponent,
          p.vanishingPlayer,
          p.highlightPlayerBottom,
          swayOpp,
          swayPlayer,
        );
        layoutRef.current = layout;

        ctx!.clearRect(0, 0, width, height);

        // Soft vignette hang bar
        ctx!.fillStyle = "rgba(20, 28, 40, 0.18)";
        ctx!.fillRect(0, 0, width, Math.max(8, height * 0.02));

        drawSilk(ctx!, layout.opponent.anchorX, layout.opponent.anchorY, layout.opponent.orbs, t);
        drawSilk(ctx!, layout.player.anchorX, layout.player.anchorY, layout.player.orbs, t + 0.6);

        for (const orb of layout.opponent.orbs) drawOrb(ctx!, orb, t, reduceMotion);
        for (const orb of layout.player.orbs) drawOrb(ctx!, orb, t + 0.4, reduceMotion);

        rafRef.current = requestAnimationFrame(frame);
      }

      rafRef.current = requestAnimationFrame(frame);

      return () => {
        ro.disconnect();
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      };
    }, []);

    useEffect(() => {
      if (!enableTilt || prefersReducedMotion()) return;

      function onMotion(ev: DeviceMotionEvent) {
        const ax = ev.accelerationIncludingGravity?.x ?? 0;
        const ay = ev.accelerationIncludingGravity?.y ?? 0;
        // Normalize roughly to -1..1
        tiltRef.current = {
          x: Math.max(-1, Math.min(1, ax / 6)),
          y: Math.max(-1, Math.min(1, ay / 6)),
        };
      }

      let motionAttached = false;

      async function tryAttachMotion() {
        const DOE = DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<"granted" | "denied">;
        };
        try {
          if (typeof DOE.requestPermission === "function") {
            // iOS requires a user gesture; we attach after first pointer down instead.
            return;
          }
        } catch {
          /* ignore */
        }
        window.addEventListener("devicemotion", onMotion, { passive: true });
        motionAttached = true;
      }

      void tryAttachMotion();

      async function onFirstPointer() {
        const DOE = DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<"granted" | "denied">;
        };
        try {
          if (typeof DOE.requestPermission === "function") {
            const result = await DOE.requestPermission();
            if (result === "granted" && !motionAttached) {
              window.addEventListener("devicemotion", onMotion, { passive: true });
              motionAttached = true;
            }
          } else if (!motionAttached) {
            window.addEventListener("devicemotion", onMotion, { passive: true });
            motionAttached = true;
          }
        } catch {
          /* permission denied / unavailable */
        }
        wrapRef.current?.removeEventListener("pointerdown", onFirstPointer);
      }

      wrapRef.current?.addEventListener("pointerdown", onFirstPointer);

      return () => {
        window.removeEventListener("devicemotion", onMotion);
        wrapRef.current?.removeEventListener("pointerdown", onFirstPointer);
      };
    }, [enableTilt]);

    function onPointerMove(e: ReactPointerEvent) {
      if (!enableTilt) return;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointerRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    }

    function onPointerLeave() {
      pointerRef.current = { x: 0.5, y: 0.5 };
    }

    const playerShown = playerOrbs?.length ?? playerCount;
    const label = `Hanging orb threads · you ${playerShown} · opponent ${opponentCount}`;

    return (
      <div
        ref={wrapRef}
        className={`hanging-orb-threads${className ? ` ${className}` : ""}`}
        aria-label={label}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <canvas ref={canvasRef} />
      </div>
    );
  },
);
