import beachChaos from "./data/beach-chaos.json";
import castleTransylvania from "./data/castle-transylvania.json";
import spacePort from "./data/space-port.json";

/** Image-only hunt scene — no answer key; scoring is peer In/Out (ADR 0028 / 0041). */
export interface HuntScene {
  id: string;
  title: string;
  imageUrl: string;
}

/** Cap free-text finds per player per round. */
export const HUNT_MAX_ANSWERS = 40;

interface HuntSceneJson {
  id: string;
  title: string;
  imageUrl: string;
}

function loadScene(raw: HuntSceneJson): HuntScene {
  return {
    id: raw.id,
    title: raw.title,
    imageUrl: raw.imageUrl,
  };
}

export const HUNT_SCENES: HuntScene[] = [
  loadScene(spacePort as HuntSceneJson),
  loadScene(beachChaos as HuntSceneJson),
  loadScene(castleTransylvania as HuntSceneJson),
];

export function scenesCatalog(): HuntScene[] {
  return HUNT_SCENES.map((s) => ({ ...s }));
}

export function getScene(id: string): HuntScene | undefined {
  return HUNT_SCENES.find((s) => s.id === id);
}

export function isHuntSceneId(v: unknown): v is string {
  return typeof v === "string" && HUNT_SCENES.some((s) => s.id === v);
}

/** Pick a scene, preferring `preferredId` when still unused; else random unused (wrap when exhausted). */
export function pickScene(usedIds: Set<string>, preferredId: string | null): HuntScene {
  const all = HUNT_SCENES;
  if (preferredId) {
    const preferred = all.find((s) => s.id === preferredId);
    if (preferred && !usedIds.has(preferred.id)) {
      return { ...preferred };
    }
  }
  const available = all.filter((s) => !usedIds.has(s.id));
  const pool = available.length > 0 ? available : all;
  const bytes = crypto.getRandomValues(new Uint8Array(1));
  const scene = pool[bytes[0]! % pool.length]!;
  return { ...scene };
}
