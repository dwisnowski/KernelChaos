import beach from "./data/beach.json";
import carnival from "./data/carnival.json";
import farm from "./data/farm.json";
import kitchen from "./data/kitchen.json";
import park from "./data/park.json";
import playroom from "./data/playroom.json";
import shop from "./data/shop.json";
import { normalizeAnswer } from "../normalize.ts";

/** Normalized bounding box (fractions of image width/height). */
export interface HuntBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HuntObject {
  id: string;
  names: string[];
  box?: HuntBox | null;
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
  objects: { id: string; names: string[]; box?: HuntBox | null }[];
}

function normalizeBox(raw: HuntBox | null | undefined): HuntBox | null {
  if (!raw || typeof raw !== "object") return null;
  const x = Number(raw.x);
  const y = Number(raw.y);
  const w = Number(raw.w);
  const h = Number(raw.h);
  if (![x, y, w, h].every((n) => Number.isFinite(n))) return null;
  if (w <= 0 || h <= 0) return null;
  return {
    x: Math.min(1, Math.max(0, x)),
    y: Math.min(1, Math.max(0, y)),
    w: Math.min(1 - Math.min(1, Math.max(0, x)), Math.max(0.01, w)),
    h: Math.min(1 - Math.min(1, Math.max(0, y)), Math.max(0.01, h)),
  };
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
      box: normalizeBox(o.box),
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

function cloneObjects(objects: HuntObject[]): HuntObject[] {
  return objects.map((o) => ({
    id: o.id,
    names: [...o.names],
    box: o.box ? { ...o.box } : null,
  }));
}

export function scenesCatalog(): HuntScene[] {
  return HUNT_SCENES.map((s) => ({
    id: s.id,
    title: s.title,
    imageUrl: s.imageUrl,
    objects: cloneObjects(s.objects),
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
        objects: cloneObjects(preferred.objects),
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
    objects: cloneObjects(scene.objects),
  };
}
