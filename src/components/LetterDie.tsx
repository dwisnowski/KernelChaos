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
  /** 9 floats: 3 vertices × xyz */
  positions: Float32Array;
  uvs: Float32Array;
}

function buildFaces(letters: readonly LetterDieFace[]): FaceGeom[] {
  const verts = icosaVertices();
  return ICOSA_FACES.map((idx, fi) => {
    const a = verts[idx[0]]!;
    const b = verts[idx[1]]!;
    const c = verts[idx[2]]!;
    const normal = vNorm(vCross(vSub(b, a), vSub(c, a)));
    // Ensure outward (away from origin)
    const mid = vNorm(vAdd(vAdd(a, b), c));
    const n = vDot(normal, mid) < 0 ? vScale(normal, -1) : normal;
    const tri = vDot(normal, mid) < 0 ? [a, c, b] : [a, b, c];
    const positions = new Float32Array([
      tri[0]![0],
      tri[0]![1],
      tri[0]![2],
      tri[1]![0],
      tri[1]![1],
      tri[1]![2],
      tri[2]![0],
      tri[2]![1],
      tri[2]![2],
    ]);
    // Atlas UV: 5 columns × 4 rows — triangle covering the letter cell
    const col = fi % 5;
    const row = Math.floor(fi / 5);
    const u0 = col / 5;
    const u1 = (col + 1) / 5;
    const v0 = 1 - (row + 1) / 4;
    const v1 = 1 - row / 4;
    const um = (u0 + u1) / 2;
    const vm = (v0 + v1) / 2;
    const uvs = new Float32Array([
      um,
      vm + (v1 - vm) * 0.55,
      um + (u1 - u0) * 0.38,
      vm - (vm - v0) * 0.35,
      um - (u1 - u0) * 0.38,
      vm - (vm - v0) * 0.35,
    ]);

    return {
      letter: letters[fi]!,
      normal: n,
      positions,
      uvs,
    };
  });
}

function bakeAtlas(letters: readonly LetterDieFace[]): HTMLCanvasElement {
  const cell = 128;
  const cols = 5;
  const rows = 4;
  const canvas = document.createElement("canvas");
  canvas.width = cell * cols;
  canvas.height = cell * rows;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#1a3a5c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < letters.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cell;
    const y = row * cell;
    ctx.fillStyle = i % 2 === 0 ? "#245a8a" : "#1e4d78";
    ctx.beginPath();
    ctx.moveTo(x + cell / 2, y + 10);
    ctx.lineTo(x + cell - 10, y + cell - 14);
    ctx.lineTo(x + 10, y + cell - 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f4f7fb";
    ctx.font = `bold ${Math.floor(cell * 0.48)}px "Space Grotesk", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letters[i]!, x + cell / 2, y + cell * 0.52);
  }
  return canvas;
}

const VERT_SRC = `
attribute vec3 aPos;
attribute vec2 aUv;
uniform mat4 uMVP;
varying vec2 vUv;
varying vec3 vN;
void main() {
  vUv = aUv;
  gl_Position = uMVP * vec4(aPos, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
void main() {
  gl_FragColor = texture2D(uTex, vUv);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
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
  // Column-major 4×4 rotation
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
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) return;

    const faces = buildFaces(LETTER_DIE);
    const atlas = bakeAtlas(LETTER_DIE);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT_SRC));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const aPos = gl.getAttribLocation(prog, "aPos");
    const aUv = gl.getAttribLocation(prog, "aUv");
    const uMVP = gl.getUniformLocation(prog, "uMVP");
    const uTex = gl.getUniformLocation(prog, "uTex");

    const posData = new Float32Array(faces.length * 9);
    const uvData = new Float32Array(faces.length * 6);
    for (let i = 0; i < faces.length; i++) {
      posData.set(faces[i]!.positions, i * 9);
      uvData.set(faces[i]!.uvs, i * 6);
    }

    const posBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, posData, gl.STATIC_DRAW);

    const uvBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uvData, gl.STATIC_DRAW);

    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0, 0, 0, 0);

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
      const w = canvas.clientWidth || size;
      const h = canvas.clientHeight || size;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const aspect = canvas.width / Math.max(canvas.height, 1);
      const proj = mat4Perspective((42 * Math.PI) / 180, aspect, 0.1, 20);
      const view = mat4LookAt(CAMERA_EYE, [0, 0, 0], [0, 1, 0]);
      const model = mat4FromQuat(quat);
      const mvp = mat4Mul(mat4Mul(proj, view), model);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniformMatrix4fv(uMVP, false, mvp);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uTex, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
      gl.enableVertexAttribArray(aUv);
      gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, faces.length * 3);
    };

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
          // integrate angular velocity in world space → local
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

      draw();
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
        // Map screen flick to angular velocity (world axes)
        angVel = [-velSample.y * 18, -velSample.x * 18, (velSample.x - velSample.y) * 4];
        // Cap so settle stays within 5s
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
