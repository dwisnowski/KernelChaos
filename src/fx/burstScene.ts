const TAU = Math.PI * 2;

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  color: string;
}

interface Ring {
  x: number;
  y: number;
  r: number;
  reach: number;
  life: number;
  duration: number;
  color: string;
}

export interface BurstScene {
  explode(x: number, y: number, opts?: { color?: string; count?: number; power?: number }): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

function outExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  const tip = r;
  const notch = r * 0.35;
  ctx.moveTo(x, y - tip);
  ctx.quadraticCurveTo(x, y, x + tip, y);
  ctx.quadraticCurveTo(x, y, x, y + tip);
  ctx.quadraticCurveTo(x, y, x - tip, y);
  ctx.quadraticCurveTo(x, y, x, y - tip);
  ctx.moveTo(x + notch, y - notch);
  ctx.quadraticCurveTo(x, y, x + notch, y + notch);
  ctx.quadraticCurveTo(x, y, x - notch, y + notch);
  ctx.quadraticCurveTo(x, y, x - notch, y - notch);
  ctx.quadraticCurveTo(x, y, x + notch, y - notch);
}

export function createBurstScene(canvas: HTMLCanvasElement): BurstScene {
  const ctx = canvas.getContext("2d")!;
  let width = 0;
  let height = 0;
  let dpr = 1;
  const sparks: Spark[] = [];
  const rings: Ring[] = [];
  let raf = 0;
  let last = 0;
  let disposed = false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ensureLoop(): void {
    if (raf || disposed) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stopIfIdle(): void {
    if (sparks.length === 0 && rings.length === 0 && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
    }
  }

  function frame(now: number): void {
    raf = 0;
    if (disposed) return;
    const dt = Math.min(32, now - last) / 16.67;
    last = now;

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]!;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vx *= 0.96;
      s.vy = s.vy * 0.96 + 0.04 * dt;
      s.life -= s.decay * dt;
      if (s.life <= 0) sparks.splice(i, 1);
    }

    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i]!;
      ring.life += (16.67 * dt) / ring.duration;
      if (ring.life >= 1) {
        rings.splice(i, 1);
        continue;
      }
      ring.r = ring.reach * outExpo(ring.life);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    for (const s of sparks) {
      ctx.globalAlpha = Math.min(1, s.life * 1.4);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      star(ctx, s.x, s.y, s.size * Math.max(0.15, s.life));
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    for (const ring of rings) {
      const alpha = 1 - ring.life;
      ctx.globalAlpha = alpha * 0.85;
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 0.5 + alpha * 2.5;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.r, 0, TAU);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    if (sparks.length || rings.length) {
      raf = requestAnimationFrame(frame);
    } else {
      stopIfIdle();
    }
  }

  function resize(w: number, h: number): void {
    width = Math.max(1, Math.round(w));
    height = Math.max(1, Math.round(h));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  function explode(x: number, y: number, opts?: { color?: string; count?: number; power?: number }): void {
    if (disposed) return;
    const color = opts?.color ?? "#fff6d2";
    const count = opts?.count ?? 18;
    const power = opts?.power ?? 4.5;

    if (reducedMotion) {
      rings.push({ x, y, r: 0, reach: 36, life: 0, duration: 400, color });
      ensureLoop();
      return;
    }

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * TAU;
      const speed = 1 + Math.random() * power;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        life: 1,
        decay: 0.035 + Math.random() * 0.04,
        size: 2.5 + Math.random() * 3.5,
        color,
      });
    }
    rings.push({
      x,
      y,
      r: 0,
      reach: 28 + power * 8,
      life: 0,
      duration: 900,
      color,
    });
    ensureLoop();
  }

  function dispose(): void {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    sparks.length = 0;
    rings.length = 0;
  }

  return { explode, resize, dispose };
}
