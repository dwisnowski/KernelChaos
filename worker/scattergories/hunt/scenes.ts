import beach from "./data/beach.json";
import carnival from "./data/carnival.json";
import farm from "./data/farm.json";
import kitchen from "./data/kitchen.json";
import park from "./data/park.json";
import playroom from "./data/playroom.json";
import shop from "./data/shop.json";
import { normalizeAnswer } from "../normalize.ts";

export interface HuntObject {
  id: string;
  names: string[];
}

export interface HuntScene {
  id: string;
  title: string;
  imageUrl: string;
  objects: HuntObject[];
}

/** Cap free-text finds per player per round. */
export const HUNT_MAX_ANSWERS = 40;

interface HuntSceneJson {
  id: string;
  title: string;
  imageUrl: string;
  objects: { id: string; names: string[] }[];
}

function loadScene(raw: HuntSceneJson): HuntScene {
  return {
    id: raw.id,
    title: raw.title,
    imageUrl: raw.imageUrl,
    objects: raw.objects.map((o) => ({
      id: o.id,
      names: [
        ...new Set(
          o.names.map((n) => normalizeAnswer(n)).filter(Boolean),
        ),
      ],
    })),
  };
}

/** Catalog order: legacy scenes first, then new dense packs. */
export const HUNT_SCENES: HuntScene[] = [
  loadScene(shop as HuntSceneJson),
  loadScene(carnival as HuntSceneJson),
  loadScene(kitchen as HuntSceneJson),
  loadScene(playroom as HuntSceneJson),
  loadScene(farm as HuntSceneJson),
  loadScene(beach as HuntSceneJson),
  loadScene(park as HuntSceneJson),
];

export function scenesCatalog(): HuntScene[] {
  return HUNT_SCENES.map((s) => ({
    id: s.id,
    title: s.title,
    imageUrl: s.imageUrl,
    objects: s.objects.map((o) => ({ id: o.id, names: [...o.names] })),
  }));
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
      return {
        id: preferred.id,
        title: preferred.title,
        imageUrl: preferred.imageUrl,
        objects: preferred.objects.map((o) => ({ id: o.id, names: [...o.names] })),
      };
    }
  }
  const available = all.filter((s) => !usedIds.has(s.id));
  const pool = available.length > 0 ? available : all;
  const bytes = crypto.getRandomValues(new Uint8Array(1));
  const scene = pool[bytes[0]! % pool.length]!;
  return {
    id: scene.id,
    title: scene.title,
    imageUrl: scene.imageUrl,
    objects: scene.objects.map((o) => ({ id: o.id, names: [...o.names] })),
  };
}
