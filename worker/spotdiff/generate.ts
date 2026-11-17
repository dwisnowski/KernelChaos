import {
  type SpotDiffCount,
  type SpotDifficulty,
  type SpotDifference,
  type SpotEditKind,
  type SpotProp,
  type SpotPuzzle,
  type SpotShape,
} from "./protocol.ts";
import {
  SPOT_FILLS,
  SPOT_SHAPES,
  getTemplate,
  pickTemplate,
  slotsForDifficulty,
  type SpotSlot,
  type SpotTemplate,
} from "./scenes.ts";

/** Mulberry32 — deterministic PRNG from a 32-bit seed. */
function makeRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length) % items.length]!;
}

function slotBox(slot: SpotSlot): SpotDifference["box"] {
  return {
    x: slot.x / 100,
    y: slot.y / 100,
    w: slot.w / 100,
    h: slot.h / 100,
  };
}

function propForSlot(slot: SpotSlot, rng: () => number): SpotProp {
  const shapes = slot.preferredShapes?.length ? slot.preferredShapes : SPOT_SHAPES;
  return {
    id: slot.id,
    shape: pick(rng, shapes),
    x: slot.x,
    y: slot.y,
    w: slot.w,
    h: slot.h,
    fill: pick(rng, SPOT_FILLS),
    stroke: "#37474f",
    rotate: 0,
    flipX: false,
  };
}

function cloneProp(p: SpotProp): SpotProp {
  return { ...p };
}

function applyEdit(prop: SpotProp, kind: SpotEditKind, rng: () => number): SpotProp | null {
  if (kind === "remove") return null;
  const next = cloneProp(prop);
  if (kind === "recolor") {
    const others = SPOT_FILLS.filter((c) => c !== prop.fill);
    next.fill = pick(rng, others.length ? others : SPOT_FILLS);
  } else if (kind === "flip") {
    next.flipX = !prop.flipX;
    next.rotate = ((prop.rotate ?? 0) + 180) % 360;
  } else if (kind === "resize") {
    const scale = rng() > 0.5 ? 1.35 : 0.65;
    const cx = prop.x + prop.w / 2;
    const cy = prop.y + prop.h / 2;
    next.w = Math.max(4, prop.w * scale);
    next.h = Math.max(4, prop.h * scale);
    next.x = cx - next.w / 2;
    next.y = cy - next.h / 2;
  } else if (kind === "swapShape") {
    const others = SPOT_SHAPES.filter((s) => s !== prop.shape);
    next.shape = pick(rng, others.length ? others : SPOT_SHAPES) as SpotShape;
  }
  return next;
}

const EDIT_KINDS: SpotEditKind[] = ["remove", "recolor", "flip", "resize", "swapShape"];

function pickDiffSlots(slots: SpotSlot[], count: number, rng: () => number): SpotSlot[] {
  const byQ = new Map<string, SpotSlot[]>();
  for (const s of slots) {
    const list = byQ.get(s.quadrant) ?? [];
    list.push(s);
    byQ.set(s.quadrant, list);
  }

  const chosen: SpotSlot[] = [];
  const used = new Set<string>();

  const hookPool = slots.filter((s) => s.nearCenter);
  if (hookPool.length > 0) {
    const hook = pick(rng, hookPool);
    chosen.push(hook);
    used.add(hook.id);
  }

  const order = ["tl", "tr", "bl", "br", "c"];
  for (const q of order) {
    if (chosen.length >= count) break;
    const pool = (byQ.get(q) ?? []).filter((s) => !used.has(s.id));
    if (pool.length === 0) continue;
    const s = pick(rng, pool);
    chosen.push(s);
    used.add(s.id);
  }

  const rest = slots.filter((s) => !used.has(s.id));
  while (chosen.length < count && rest.length > 0) {
    const idx = Math.floor(rng() * rest.length);
    const [s] = rest.splice(idx, 1);
    if (!s) break;
    chosen.push(s);
    used.add(s.id);
  }

  return chosen.slice(0, count);
}

function backdropProps(template: SpotTemplate): SpotProp[] {
  return template.backdrop.map((b) => ({
    id: b.id,
    shape: b.shape,
    x: b.x,
    y: b.y,
    w: b.w,
    h: b.h,
    fill: b.fill,
    stroke: b.stroke,
  }));
}

export function generatePuzzle(opts: {
  seed?: number;
  diffCount: SpotDiffCount;
  difficulty?: SpotDifficulty;
  templateId?: SpotTemplate["id"];
}): SpotPuzzle {
  const seed =
    opts.seed ??
    (crypto.getRandomValues(new Uint32Array(1))[0] ?? Math.floor(Math.random() * 0xffffffff));
  const rng = makeRng(seed >>> 0);
  const template = opts.templateId ? getTemplate(opts.templateId) : pickTemplate(seed);
  const difficulty = opts.difficulty ?? "easy";
  const activeSlots = slotsForDifficulty(template.slots, difficulty);

  const slotProps = activeSlots.map((slot) => propForSlot(slot, rng));
  const panelA: SpotProp[] = [...backdropProps(template), ...slotProps.map(cloneProp)];

  const diffSlots = pickDiffSlots(activeSlots, opts.diffCount, rng);
  const propById = new Map(slotProps.map((p) => [p.id, p]));
  const panelBMap = new Map(slotProps.map((p) => [p.id, cloneProp(p)]));
  const differences: SpotDifference[] = [];

  let kindIdx = 0;
  for (const slot of diffSlots) {
    const base = propById.get(slot.id);
    if (!base) continue;
    const kind = EDIT_KINDS[kindIdx % EDIT_KINDS.length]!;
    kindIdx += 1;
    const edited = applyEdit(base, kind, rng);
    if (edited) panelBMap.set(slot.id, edited);
    else panelBMap.delete(slot.id);
    differences.push({
      id: `d-${slot.id}`,
      box: slotBox(slot),
      kind,
    });
  }

  const panelB: SpotProp[] = [
    ...backdropProps(template),
    ...activeSlots.map((s) => panelBMap.get(s.id)).filter((p): p is SpotProp => Boolean(p)),
  ];

  return {
    templateId: template.id,
    seed: seed >>> 0,
    title: template.title,
    panelA,
    panelB,
    differences,
  };
}
