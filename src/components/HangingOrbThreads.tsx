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
  /** Unique phase seed for this bead's local sway. */
  swayPhase: number;
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

interface PointerGrab {
  thread: HangingThread;
  /** Bottom→top index of the grabbed orb, or -1 when only silk was hit. */
  bottomIndex: number;
  /** Pointer position in canvas pixels. */
  x: number;
  y: number;
}

interface SwayInput {
  t: number;
  /** Ambient lean from device tilt only (not pointer). */
  deviceLean: number;
  /** Active pointer grab for this thread, if any. */
  grab: PointerGrab | null;
  reduceMotion: boolean;
  /** Phase offset so the two threads don't move in lockstep. */
  threadPhase: number;
}

const HIDDEN_HEX = "#6b7c8f";
const SILK = "#d4af37";
const MAX_ORBS = 30;
/** Hit padding beyond orb radius / silk half-width (px). */
const ORB_HIT_PAD = 1.35;
const SILK_HIT_PX = 10;

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
): {
  color: string;
  hidden: boolean;
  vanish: boolean;
  hot: boolean;
  sparklePhase: number;
  swayPhase: number;
}[] {
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
      swayPhase: i * 1.6180339887 + 0.37,
    });
  }
  return out;
}

/**
 * Hang each orb from the previous with its own flexible segment angle so the
 * stack reads as linked beads, not a rigid column.
 */
function placeFlexibleThread(
  specs: ReturnType<typeof buildThreadOrbs>,
  baseX: number,
  anchorY: number,
  padTop: number,
  gap: number,
  r: number,
  sway: SwayInput,
): ThreadLayout {
  // Indexed by bottom→top storage order for getOrbCenter / vanish.
  const orbsByBottom: OrbLayout[] = [];
  let prevX = baseX;
  let prevY = anchorY;

  const grabFromTop =
    sway.grab && specs.length > 0
      ? sway.grab.bottomIndex < 0
        ? 0
        : specs.length - 1 - sway.grab.bottomIndex
      : null;

  // Walk top → bottom (high storage index first).
  for (let fromTop = 0; fromTop < specs.length; fromTop++) {
    const bottomIndex = specs.length - 1 - fromTop;
    const spec = specs[bottomIndex]!;
    const restY = padTop + gap * (fromTop + 0.55);
    const segmentLen = Math.max(r * 1.6, restY - prevY);

    let angle = 0;
    if (!sway.reduceMotion) {
      // Each link gets its own tempo + phase; amplitude grows gently down the chain.
      const local =
        Math.sin(sway.t * (1.05 + fromTop * 0.11) + spec.swayPhase + sway.threadPhase) *
          (0.07 + fromTop * 0.012) +
        Math.sin(sway.t * (1.85 + fromTop * 0.07) + spec.swayPhase * 1.7) *
          (0.035 + fromTop * 0.006);
      const deviceScale = 0.01 + fromTop * 0.0035;
      angle = local + sway.deviceLean * deviceScale;

      // Pointer only bends this thread from the grabbed link downward.
      if (sway.grab && grabFromTop != null && fromTop >= grabFromTop) {
        const toward = Math.atan2(sway.grab.x - prevX, Math.max(12, sway.grab.y - prevY));
        const depth = fromTop - grabFromTop;
        const strength = depth === 0 ? 0.55 : Math.max(0.12, 0.42 - depth * 0.05);
        angle += toward * strength;
      }

      // Keep segments from folding past ~32°.
      angle = Math.max(-0.56, Math.min(0.56, angle));
    }

    const x = prevX + Math.sin(angle) * segmentLen;
    const y = prevY + Math.cos(angle) * segmentLen;
    orbsByBottom[bottomIndex] = { x, y, r, ...spec };
    prevX = x;
    prevY = y;
  }

  return { orbs: orbsByBottom, anchorX: baseX, anchorY };
}

function distToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-6) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Hit-test orbs first, then silk segments. Returns null when empty space. */
function hitTestThreads(layout: LayoutSnapshot, x: number, y: number): PointerGrab | null {
  type Hit = PointerGrab & { score: number };
  const hits: Hit[] = [];

  for (const thread of ["player", "opponent"] as const) {
    const stack = thread === "player" ? layout.player : layout.opponent;
    for (let i = 0; i < stack.orbs.length; i++) {
      const orb = stack.orbs[i]!;
      if (orb.vanish) continue;
      const d = Math.hypot(x - orb.x, y - orb.y);
      if (d <= orb.r * ORB_HIT_PAD) {
        hits.push({ thread, bottomIndex: i, x, y, score: d });
      }
    }
  }

  if (hits.length === 0) {
    for (const thread of ["player", "opponent"] as const) {
      const stack = thread === "player" ? layout.player : layout.opponent;
      const visible = stack.orbs
        .map((orb, bottomIndex) => ({ orb, bottomIndex }))
        .filter((row) => !row.orb.vanish)
        .sort((a, b) => a.orb.y - b.orb.y);
      if (visible.length === 0) continue;

      let prevX = stack.anchorX;
      let prevY = stack.anchorY;
      for (const row of visible) {
        const endX = row.orb.x;
        const endY = row.orb.y - row.orb.r * 0.85;
        const d = distToSegment(x, y, prevX, prevY, endX, endY);
        if (d <= SILK_HIT_PX) {
          // Silk hit attaches to the orb below this segment; score prefers orbs.
          hits.push({ thread, bottomIndex: row.bottomIndex, x, y, score: 1000 + d });
        }
        prevX = endX;
        prevY = endY;
      }
    }
  }

  if (hits.length === 0) return null;
  hits.sort((a, b) => a.score - b.score);
  const best = hits[0]!;
  return { thread: best.thread, bottomIndex: best.bottomIndex, x: best.x, y: best.y };
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
  swayOpp: SwayInput,
  swayPlayer: SwayInput,
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

  return {
    width,
    height,
    opponent: placeFlexibleThread(oppSpecs, oppX, anchorY, padTop, gap, r, swayOpp),
    player: placeFlexibleThread(playerSpecs, playerX, anchorY, padTop, gap, r, swayPlayer),
  };
}

/** Draw each silk link as its own soft curve between consecutive hang points. */
function drawSilk(
  ctx: CanvasRenderingContext2D,
  anchorX: number,
  anchorY: number,
  orbs: OrbLayout[],
  t: number,
) {
  const visible = orbs.filter((o) => !o.vanish);
  if (visible.length === 0) return;

  const topFirst = [...visible].sort((a, b) => a.y - b.y);
  const lineW = Math.max(1.2, Math.min(2.4, orbs[0]!.r * 0.18));

  ctx.save();
  ctx.strokeStyle = SILK;
  ctx.lineWidth = lineW;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(212, 175, 55, 0.45)";
  ctx.shadowBlur = 6;

  let prevX = anchorX;
  let prevY = anchorY;
  for (let i = 0; i < topFirst.length; i++) {
    const orb = topFirst[i]!;
    const endX = orb.x;
    const endY = orb.y - orb.r * 0.85;
    const dx = endX - prevX;
    const dy = endY - prevY;
    const len = Math.hypot(dx, dy) || 1;
    // Perpendicular bulge so each segment reads as a separate flexible thread.
    const nx = -dy / len;
    const ny = dx / len;
    const bulge =
      (3.5 + Math.min(8, len * 0.08)) *
      Math.sin(t * (1.3 + i * 0.17) + orb.swayPhase) *
      (i % 2 === 0 ? 1 : -0.85);
    const cpx = (prevX + endX) / 2 + nx * bulge;
    const cpy = (prevY + endY) / 2 + ny * bulge * 0.35;

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.quadraticCurveTo(cpx, cpy, endX, endY);
    ctx.stroke();

    prevX = endX;
    prevY = endY;
  }
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
    const grabRef = useRef<PointerGrab | null>(null);
    /** Once a press starts on an orb/silk, stay attached until release. */
    const stickyGrabRef = useRef<Omit<PointerGrab, "x" | "y"> | null>(null);
    const tiltRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number | null>(null);
    const cursorHotRef = useRef(false);
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

        // Device tilt is ambient; pointer only affects a hit-tested grab.
        const deviceLean = tiltOn ? tiltRef.current.x * 10 : 0;
        const grab = p.enableTilt && !reduceMotion ? grabRef.current : null;

        const layout = layoutThreads(
          width,
          height,
          p.opponentCount,
          p.playerOrbs,
          p.playerCount,
          p.vanishingOpponent,
          p.vanishingPlayer,
          p.highlightPlayerBottom,
          {
            t,
            deviceLean: deviceLean * 0.55 + (reduceMotion ? 0 : Math.sin(t * 0.95) * 3.2),
            grab: grab?.thread === "opponent" ? grab : null,
            reduceMotion,
            threadPhase: 0.4,
          },
          {
            t,
            deviceLean: deviceLean * 0.75 + (reduceMotion ? 0 : Math.sin(t * 1.05 + 1.2) * -3),
            grab: grab?.thread === "player" ? grab : null,
            reduceMotion,
            threadPhase: 2.1,
          },
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

    function canvasPoint(e: ReactPointerEvent): { x: number; y: number } | null {
      const wrap = wrapRef.current;
      if (!wrap) return null;
      const rect = wrap.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function setCursorHot(hot: boolean) {
      if (hot === cursorHotRef.current || !wrapRef.current) return;
      wrapRef.current.style.cursor = hot ? (stickyGrabRef.current ? "grabbing" : "grab") : "";
      cursorHotRef.current = hot;
    }

    function clearGrab() {
      grabRef.current = null;
      stickyGrabRef.current = null;
      setCursorHot(false);
    }

    function applyHoverOrSticky(pt: { x: number; y: number }) {
      if (stickyGrabRef.current) {
        grabRef.current = { ...stickyGrabRef.current, x: pt.x, y: pt.y };
        setCursorHot(true);
        return;
      }
      const layout = layoutRef.current;
      if (!layout) {
        grabRef.current = null;
        setCursorHot(false);
        return;
      }
      const hit = hitTestThreads(layout, pt.x, pt.y);
      grabRef.current = hit;
      setCursorHot(hit != null);
    }

    function onPointerMove(e: ReactPointerEvent) {
      if (!enableTilt) return;
      const pt = canvasPoint(e);
      if (!pt) return;

      // Touch with no contact: ignore (and clear).
      if (e.pointerType === "touch" && e.buttons === 0 && !stickyGrabRef.current) {
        clearGrab();
        return;
      }
      applyHoverOrSticky(pt);
    }

    function onPointerDown(e: ReactPointerEvent) {
      if (!enableTilt) return;
      const pt = canvasPoint(e);
      if (!pt) return;
      const layout = layoutRef.current;
      const hit = layout ? hitTestThreads(layout, pt.x, pt.y) : null;
      if (!hit) {
        // Pressed empty canvas — do not affect sway.
        clearGrab();
        return;
      }
      stickyGrabRef.current = { thread: hit.thread, bottomIndex: hit.bottomIndex };
      grabRef.current = hit;
      setCursorHot(true);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }

    function onPointerUp() {
      if (!enableTilt) return;
      clearGrab();
    }

    function onPointerLeave() {
      // Keep sticky grabs (captured); only clear hover when not pressing.
      if (!stickyGrabRef.current) clearGrab();
    }

    const playerShown = playerOrbs?.length ?? playerCount;
    const label = `Hanging orb threads · you ${playerShown} · opponent ${opponentCount}`;

    return (
      <div
        ref={wrapRef}
        className={`hanging-orb-threads${className ? ` ${className}` : ""}`}
        aria-label={label}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
      >
        <canvas ref={canvasRef} />
      </div>
    );
  },
);
