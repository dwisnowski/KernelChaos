import { useEffect, useRef } from "react";
import { LETTER_DIE, type DiePose, type LetterDieFace } from "../scatterTypes.ts";

export interface LetterDieProps {
  mode: "interactive" | "remote";
  /** Remote pose from the network; ignored in interactive mode except as initial. */
  pose?: DiePose | null;
  onPose?: (pose: DiePose) => void;
  onSettle?: (letter: LetterDieFace) => void;
  disabled?: boolean;
  className?: string;
  /** CSS pixel size hint; canvas fills the element. */
  size?: number;
}

const PHI = (1 + Math.sqrt(5)) / 2;
const MAX_ROLL_MS = 5000;
const DAMPING = 3.2;
const SETTLE_SPEED = 0.35;
const POSE_MIN_INTERVAL_MS = 50;

type Vec3 = [number, number, number];
type Quat = [number, number, number, number]; // x,y,z,w

function vAdd(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
function vSub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function vScale(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s];
}
function vDot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function vCross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function vLen(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2]);
}
function vNorm(a: Vec3): Vec3 {
  const l = vLen(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
}

/** Slightly elevated eye so the die reads in 3D; result face snaps toward this view. */
const CAMERA_EYE: Vec3 = [0, 1.05, 2.95];
const VIEW_DIR: Vec3 = vNorm(CAMERA_EYE);

function qIdentity(): Quat {
  return [0, 0, 0, 1];
}
function qNormalize(q: Quat): Quat {
  const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
}
function qMul(a: Quat, b: Quat): Quat {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}
function qConj(q: Quat): Quat {
  return [-q[0], -q[1], -q[2], q[3]];
}
function qRotate(q: Quat, v: Vec3): Vec3 {
  const p: Quat = [v[0], v[1], v[2], 0];
  const r = qMul(qMul(q, p), qConj(q));
  return [r[0], r[1], r[2]];
}
function qFromAxisAngle(axis: Vec3, angle: number): Quat {
  const n = vNorm(axis);
  const h = angle * 0.5;
  const s = Math.sin(h);
  return qNormalize([n[0] * s, n[1] * s, n[2] * s, Math.cos(h)]);
}
function qFromTo(from: Vec3, to: Vec3): Quat {
  const a = vNorm(from);
  const b = vNorm(to);
  const d = vDot(a, b);
  if (d > 0.999999) return qIdentity();
  if (d < -0.999999) {
    let axis: Vec3 = vCross([1, 0, 0], a);
    if (vLen(axis) < 1e-6) axis = vCross([0, 1, 0], a);
    return qFromAxisAngle(axis, Math.PI);
  }
  const axis = vCross(a, b);
  const w = 1 + d;
  return qNormalize([axis[0], axis[1], axis[2], w]);
}
function qSlerp(a: Quat, b: Quat, t: number): Quat {
  let ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  let bx = b[0],
    by = b[1],
    bz = b[2],
    bw = b[3];
  let cos = ax * bx + ay * by + az * bz + aw * bw;
  if (cos < 0) {
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
    cos = -cos;
  }
  if (cos > 0.9995) {
    return qNormalize([
      ax + (bx - ax) * t,
      ay + (by - ay) * t,
      az + (bz - az) * t,
      aw + (bw - aw) * t,
    ]);
  }
  const theta = Math.acos(cos);
  const sin = Math.sin(theta);
  const w1 = Math.sin((1 - t) * theta) / sin;
  const w2 = Math.sin(t * theta) / sin;
  return [ax * w1 + bx * w2, ay * w1 + by * w2, az * w1 + bz * w2, aw * w1 + bw * w2];
}
function poseFromQuat(q: Quat): DiePose {
  return { qx: q[0], qy: q[1], qz: q[2], qw: q[3] };
}
function quatFromPose(p: DiePose): Quat {
  return qNormalize([p.qx, p.qy, p.qz, p.qw]);
}

/** Unit icosahedron vertices (golden-rectangle construction). */
function icosaVertices(): Vec3[] {
  const raw: Vec3[] = [
    [0, 1, PHI],
    [0, -1, PHI],
    [0, 1, -PHI],
    [0, -1, -PHI],
    [1, PHI, 0],
    [-1, PHI, 0],
    [1, -PHI, 0],
    [-1, -PHI, 0],
    [PHI, 0, 1],
    [-PHI, 0, 1],
    [PHI, 0, -1],
    [-PHI, 0, -1],
  ];
  return raw.map(vNorm);
}

/** 20 faces as triples of vertex indices. */
const ICOSA_FACES: [number, number, number][] = [
  [0, 1, 8],
  [0, 8, 4],
  [0, 4, 5],
  [0, 5, 9],
  [0, 9, 1],
  [1, 9, 7],
  [1, 7, 6],
  [1, 6, 8],
  [8, 6, 10],
  [8, 10, 4],
  [4, 10, 2],
  [4, 2, 5],
  [5, 2, 11],
  [5, 11, 9],
  [9, 11, 7],
  [3, 6, 7],
  [3, 7, 11],
  [3, 11, 2],
  [3, 2, 10],
  [3, 10, 6],
];

interface FaceGeom {
  letter: LetterDieFace;
  normal: Vec3;
  verts: [Vec3, Vec3, Vec3];
  fill: string;
}

function buildFaces(letters: readonly LetterDieFace[]): FaceGeom[] {
  const verts = icosaVertices();
  return ICOSA_FACES.map((idx, fi) => {
    const a = verts[idx[0]]!;
    const b = verts[idx[1]]!;
    const c = verts[idx[2]]!;
    const normal = vNorm(vCross(vSub(b, a), vSub(c, a)));
    const mid = vNorm(vAdd(vAdd(a, b), c));
    const n = vDot(normal, mid) < 0 ? vScale(normal, -1) : normal;
    const tri = (vDot(normal, mid) < 0 ? [a, c, b] : [a, b, c]) as [Vec3, Vec3, Vec3];
    return {
      letter: letters[fi]!,
      normal: n,
      verts: tri,
      fill: fi % 2 === 0 ? "#245a8a" : "#1e4d78",
    };
  });
}

function mat4Perspective(fovy: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  const out = new Float32Array(16);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
  return out;
}

function mat4LookAt(eye: Vec3, center: Vec3, up: Vec3): Float32Array {
  const z = vNorm(vSub(eye, center));
  const x = vNorm(vCross(up, z));
  const y = vCross(z, x);
  const out = new Float32Array(16);
  out[0] = x[0];
  out[1] = y[0];
  out[2] = z[0];
  out[4] = x[1];
  out[5] = y[1];
  out[6] = z[1];
  out[8] = x[2];
  out[9] = y[2];
  out[10] = z[2];
  out[12] = -vDot(x, eye);
  out[13] = -vDot(y, eye);
  out[14] = -vDot(z, eye);
  out[15] = 1;
  return out;
}

function mat4FromQuat(q: Quat): Float32Array {
  const [x, y, z, w] = q;
  const xx = x * x,
    yy = y * y,
    zz = z * z;
  const xy = x * y,
    xz = x * z,
    yz = y * z;
  const wx = w * x,
    wy = w * y,
    wz = w * z;
  const out = new Float32Array(16);
  out[0] = 1 - 2 * (yy + zz);
  out[1] = 2 * (xy + wz);
  out[2] = 2 * (xz - wy);
  out[3] = 0;
  out[4] = 2 * (xy - wz);
  out[5] = 1 - 2 * (xx + zz);
  out[6] = 2 * (yz + wx);
  out[7] = 0;
  out[8] = 2 * (xz + wy);
  out[9] = 2 * (yz - wx);
  out[10] = 1 - 2 * (xx + yy);
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

function mat4Mul(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] =
        a[r]! * b[c * 4]! +
        a[4 + r]! * b[c * 4 + 1]! +
        a[8 + r]! * b[c * 4 + 2]! +
        a[12 + r]! * b[c * 4 + 3]!;
    }
  }
  return out;
}

function project(mvp: Float32Array, v: Vec3, width: number, height: number): { x: number; y: number; z: number } {
  const x = mvp[0]! * v[0] + mvp[4]! * v[1] + mvp[8]! * v[2] + mvp[12]!;
  const y = mvp[1]! * v[0] + mvp[5]! * v[1] + mvp[9]! * v[2] + mvp[13]!;
  const z = mvp[2]! * v[0] + mvp[6]! * v[1] + mvp[10]! * v[2] + mvp[14]!;
  const w = mvp[3]! * v[0] + mvp[7]! * v[1] + mvp[11]! * v[2] + mvp[15]!;
  const inv = 1 / (w || 1);
  return {
    x: (x * inv * 0.5 + 0.5) * width,
    y: (1 - (y * inv * 0.5 + 0.5)) * height,
    z: z * inv,
  };
}

/** Face whose outward normal points most toward the camera — what the player reads. */
function resultFaceIndex(faces: FaceGeom[], q: Quat): number {
  let best = 0;
  let bestDot = -Infinity;
  for (let i = 0; i < faces.length; i++) {
    const worldN = qRotate(q, faces[i]!.normal);
    const d = vDot(worldN, VIEW_DIR);
    if (d > bestDot) {
      bestDot = d;
      best = i;
    }
  }
  return best;
}

function snapQuatToFace(faces: FaceGeom[], q: Quat, faceIndex: number): Quat {
  const worldN = qRotate(q, faces[faceIndex]!.normal);
  const align = qFromTo(worldN, VIEW_DIR);
  return qNormalize(qMul(align, q));
}

function drawDie(
  ctx: CanvasRenderingContext2D,
  faces: FaceGeom[],
  quat: Quat,
  width: number,
  height: number,
): void {
  const aspect = width / Math.max(height, 1);
  const proj = mat4Perspective((42 * Math.PI) / 180, aspect, 0.1, 20);
  const view = mat4LookAt(CAMERA_EYE, [0, 0, 0], [0, 1, 0]);
  const model = mat4FromQuat(quat);
  const mvp = mat4Mul(mat4Mul(proj, view), model);

  type Drawn = {
    depth: number;
    pts: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
    letter: LetterDieFace;
    fill: string;
    facing: number;
  };
  const visible: Drawn[] = [];

  for (const face of faces) {
    const worldN = qRotate(quat, face.normal);
    const facing = vDot(worldN, VIEW_DIR);
    if (facing <= 0.02) continue;
    const p0 = project(mvp, qRotate(quat, face.verts[0]), width, height);
    const p1 = project(mvp, qRotate(quat, face.verts[1]), width, height);
    const p2 = project(mvp, qRotate(quat, face.verts[2]), width, height);
    visible.push({
      depth: (p0.z + p1.z + p2.z) / 3,
      pts: [p0, p1, p2],
      letter: face.letter,
      fill: face.fill,
      facing,
    });
  }

  visible.sort((a, b) => b.depth - a.depth);

  ctx.clearRect(0, 0, width, height);
  for (const face of visible) {
    const [a, b, c] = face.pts;
    const shade = 0.72 + face.facing * 0.28;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.closePath();
    ctx.fillStyle = face.fill;
    ctx.globalAlpha = Math.min(1, shade);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(8, 20, 36, 0.55)";
    ctx.lineWidth = Math.max(1, width * 0.004);
    ctx.stroke();

    const cx = (a.x + b.x + c.x) / 3;
    const cy = (a.y + b.y + c.y) / 3;
    const edge = Math.hypot(a.x - b.x, a.y - b.y);
    const fontPx = Math.max(12, Math.min(edge * 0.55, width * 0.14));
    ctx.fillStyle = "#f4f7fb";
    ctx.font = `700 ${fontPx}px "Space Grotesk", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(face.letter, cx, cy + fontPx * 0.04);
  }
}

export function LetterDie({
  mode,
  pose = null,
  onPose,
  onSettle,
  disabled = false,
  className,
  size = 280,
}: LetterDieProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onPoseRef = useRef(onPose);
  const onSettleRef = useRef(onSettle);
  onPoseRef.current = onPose;
  onSettleRef.current = onSettle;

  const remotePoseRef = useRef<DiePose | null>(pose);
  remotePoseRef.current = pose;

  const modeRef = useRef(mode);
  modeRef.current = mode;
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const faces = buildFaces(LETTER_DIE);

    let quat = qIdentity();
    let angVel: Vec3 = [0, 0, 0];
    let dragging = false;
    let lastPtr: { x: number; y: number; t: number } | null = null;
    let velSample: { x: number; y: number } = { x: 0, y: 0 };
    let spinning = false;
    let spinStartedAt = 0;
    let snapping = false;
    let snapFrom = qIdentity();
    let snapTo = qIdentity();
    let snapT = 0;
    let settled = false;
    let lastPoseSent = 0;
    let raf = 0;
    let lastTs = performance.now();
    let cssW = size;
    let cssH = size;

    const emitPose = (force = false) => {
      const now = performance.now();
      if (!force && now - lastPoseSent < POSE_MIN_INTERVAL_MS) return;
      lastPoseSent = now;
      onPoseRef.current?.(poseFromQuat(quat));
    };

    const finishSettle = () => {
      if (settled) return;
      settled = true;
      spinning = false;
      snapping = false;
      angVel = [0, 0, 0];
      const fi = resultFaceIndex(faces, quat);
      quat = snapQuatToFace(faces, quat, fi);
      emitPose(true);
      onSettleRef.current?.(faces[fi]!.letter);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = canvas.clientWidth || size;
      cssH = canvas.clientHeight || size;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const tick = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;

      if (modeRef.current === "remote") {
        const rp = remotePoseRef.current;
        if (rp) quat = quatFromPose(rp);
      } else if (!disabledRef.current) {
        if (snapping) {
          snapT = Math.min(1, snapT + dt * 4);
          quat = qSlerp(snapFrom, snapTo, snapT);
          emitPose();
          if (snapT >= 1) finishSettle();
        } else if (spinning && !dragging) {
          const elapsed = ts - spinStartedAt;
          const speed = vLen(angVel);
          if (speed > 1e-4) {
            const axis = vNorm(angVel);
            const angle = speed * dt;
            quat = qNormalize(qMul(qFromAxisAngle(axis, angle), quat));
            const decay = Math.exp(-DAMPING * dt);
            angVel = vScale(angVel, decay);
          }
          emitPose();
          if (elapsed >= MAX_ROLL_MS || vLen(angVel) < SETTLE_SPEED) {
            const fi = resultFaceIndex(faces, quat);
            snapFrom = quat;
            snapTo = snapQuatToFace(faces, quat, fi);
            snapping = true;
            snapT = 0;
            spinning = false;
            angVel = [0, 0, 0];
          }
        }
      }

      drawDie(ctx, faces, quat, cssW, cssH);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const ptrPos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() };
    };

    const onDown = (e: PointerEvent) => {
      if (modeRef.current !== "interactive" || disabledRef.current || settled) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      dragging = true;
      spinning = false;
      snapping = false;
      angVel = [0, 0, 0];
      lastPtr = ptrPos(e);
      velSample = { x: 0, y: 0 };
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging || !lastPtr) return;
      const p = ptrPos(e);
      const dx = p.x - lastPtr.x;
      const dy = p.y - lastPtr.y;
      const dt = Math.max(1, p.t - lastPtr.t);
      velSample = { x: dx / dt, y: dy / dt };
      const sens = 0.008;
      const qx = qFromAxisAngle([0, 1, 0], dx * sens);
      const qy = qFromAxisAngle([1, 0, 0], dy * sens);
      quat = qNormalize(qMul(qx, qMul(qy, quat)));
      lastPtr = p;
      emitPose();
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      const flick = Math.hypot(velSample.x, velSample.y);
      if (flick > 0.15 && !settled) {
        angVel = [-velSample.y * 18, -velSample.x * 18, (velSample.x - velSample.y) * 4];
        const s = vLen(angVel);
        if (s > 22) angVel = vScale(angVel, 22 / s);
        spinning = true;
        spinStartedAt = performance.now();
      }
      lastPtr = null;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className={className ? `letter-die ${className}` : "letter-die"}
      style={{ width: size, height: size, touchAction: "none" }}
      width={size}
      height={size}
      aria-label={mode === "interactive" ? "Letter die — drag and flick to roll" : "Letter die"}
    />
  );
}
