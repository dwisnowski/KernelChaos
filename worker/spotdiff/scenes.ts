import type { SpotShape, SpotTemplateId } from "./protocol.ts";

export interface SpotSlot {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  quadrant: "tl" | "tr" | "bl" | "br" | "c";
  nearCenter?: boolean;
  preferredShapes?: SpotShape[];
}

export interface SpotTemplate {
  id: SpotTemplateId;
  title: string;
  /** Static props that never differ (furniture / backdrop accents). */
  backdrop: Array<{
    id: string;
    shape: SpotShape;
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
    stroke?: string;
  }>;
  slots: SpotSlot[];
  bg: string;
}

const FILLS = [
  "#e57373",
  "#ffb74d",
  "#fff176",
  "#81c784",
  "#4fc3f7",
  "#9575cd",
  "#f06292",
  "#a1887f",
  "#90a4ae",
  "#ff8a65",
] as const;

export const SPOT_FILLS: readonly string[] = FILLS;

export const SPOT_SHAPES: SpotShape[] = ["rect", "circle", "ellipse", "triangle", "star"];

export const SPOT_TEMPLATES: SpotTemplate[] = [
  {
    id: "kitchen",
    title: "Busy Kitchen",
    bg: "#f5e6d3",
    backdrop: [
      { id: "k-counter", shape: "rect", x: 4, y: 62, w: 92, h: 28, fill: "#c4a484" },
      { id: "k-backsplash", shape: "rect", x: 4, y: 18, w: 92, h: 44, fill: "#dce8f0" },
      { id: "k-shelf", shape: "rect", x: 10, y: 22, w: 80, h: 4, fill: "#8d6e63" },
      { id: "k-sink", shape: "ellipse", x: 38, y: 70, w: 24, h: 12, fill: "#b0bec5", stroke: "#78909c" },
    ],
    slots: [
      { id: "k1", x: 12, y: 28, w: 10, h: 10, quadrant: "tl" },
      { id: "k2", x: 28, y: 28, w: 10, h: 10, quadrant: "tl" },
      { id: "k3", x: 48, y: 30, w: 12, h: 8, quadrant: "c", nearCenter: true },
      { id: "k4", x: 68, y: 28, w: 10, h: 10, quadrant: "tr" },
      { id: "k5", x: 82, y: 30, w: 8, h: 8, quadrant: "tr" },
      { id: "k6", x: 10, y: 48, w: 12, h: 10, quadrant: "bl" },
      { id: "k7", x: 26, y: 50, w: 8, h: 8, quadrant: "bl" },
      { id: "k8", x: 44, y: 48, w: 14, h: 10, quadrant: "c", nearCenter: true },
      { id: "k9", x: 64, y: 48, w: 10, h: 10, quadrant: "br" },
      { id: "k10", x: 80, y: 50, w: 10, h: 8, quadrant: "br" },
      { id: "k11", x: 12, y: 76, w: 10, h: 8, quadrant: "bl" },
      { id: "k12", x: 28, y: 78, w: 8, h: 8, quadrant: "bl" },
      { id: "k13", x: 70, y: 76, w: 10, h: 10, quadrant: "br" },
      { id: "k14", x: 84, y: 78, w: 8, h: 8, quadrant: "br" },
      { id: "k15", x: 52, y: 78, w: 10, h: 8, quadrant: "c", nearCenter: true },
    ],
  },
  {
    id: "toyshelf",
    title: "Toy Shelf",
    bg: "#e8f5e9",
    backdrop: [
      { id: "t-wall", shape: "rect", x: 6, y: 10, w: 88, h: 80, fill: "#fff8e1" },
      { id: "t-shelf1", shape: "rect", x: 10, y: 28, w: 80, h: 3, fill: "#6d4c41" },
      { id: "t-shelf2", shape: "rect", x: 10, y: 52, w: 80, h: 3, fill: "#6d4c41" },
      { id: "t-shelf3", shape: "rect", x: 10, y: 76, w: 80, h: 3, fill: "#6d4c41" },
    ],
    slots: [
      { id: "t1", x: 14, y: 14, w: 12, h: 12, quadrant: "tl" },
      { id: "t2", x: 32, y: 14, w: 10, h: 12, quadrant: "tl" },
      { id: "t3", x: 48, y: 16, w: 12, h: 10, quadrant: "c", nearCenter: true },
      { id: "t4", x: 66, y: 14, w: 10, h: 12, quadrant: "tr" },
      { id: "t5", x: 80, y: 16, w: 10, h: 10, quadrant: "tr" },
      { id: "t6", x: 14, y: 36, w: 12, h: 12, quadrant: "tl" },
      { id: "t7", x: 34, y: 38, w: 10, h: 10, quadrant: "c", nearCenter: true },
      { id: "t8", x: 50, y: 36, w: 12, h: 12, quadrant: "c", nearCenter: true },
      { id: "t9", x: 68, y: 38, w: 10, h: 10, quadrant: "tr" },
      { id: "t10", x: 82, y: 36, w: 8, h: 12, quadrant: "tr" },
      { id: "t11", x: 14, y: 60, w: 12, h: 12, quadrant: "bl" },
      { id: "t12", x: 34, y: 62, w: 10, h: 10, quadrant: "bl" },
      { id: "t13", x: 50, y: 60, w: 12, h: 12, quadrant: "c" },
      { id: "t14", x: 68, y: 62, w: 10, h: 10, quadrant: "br" },
      { id: "t15", x: 82, y: 60, w: 8, h: 12, quadrant: "br" },
      { id: "t16", x: 24, y: 82, w: 10, h: 8, quadrant: "bl" },
      { id: "t17", x: 46, y: 82, w: 12, h: 8, quadrant: "c" },
      { id: "t18", x: 70, y: 82, w: 10, h: 8, quadrant: "br" },
    ],
  },
  {
    id: "park",
    title: "Park Picnic",
    bg: "#c8e6c9",
    backdrop: [
      { id: "p-sky", shape: "rect", x: 0, y: 0, w: 100, h: 42, fill: "#bbdefb" },
      { id: "p-grass", shape: "rect", x: 0, y: 42, w: 100, h: 58, fill: "#81c784" },
      { id: "p-blanket", shape: "rect", x: 28, y: 58, w: 44, h: 28, fill: "#ef9a9a" },
      { id: "p-tree", shape: "circle", x: 8, y: 28, w: 22, h: 22, fill: "#388e3c" },
      { id: "p-trunk", shape: "rect", x: 16, y: 48, w: 6, h: 18, fill: "#6d4c41" },
    ],
    slots: [
      { id: "p1", x: 12, y: 8, w: 10, h: 8, quadrant: "tl" },
      { id: "p2", x: 36, y: 10, w: 12, h: 8, quadrant: "tl" },
      { id: "p3", x: 58, y: 8, w: 10, h: 10, quadrant: "tr" },
      { id: "p4", x: 78, y: 12, w: 12, h: 10, quadrant: "tr" },
      { id: "p5", x: 42, y: 30, w: 14, h: 10, quadrant: "c", nearCenter: true },
      { id: "p6", x: 64, y: 32, w: 10, h: 8, quadrant: "tr" },
      { id: "p7", x: 32, y: 48, w: 10, h: 8, quadrant: "c", nearCenter: true },
      { id: "p8", x: 48, y: 50, w: 12, h: 8, quadrant: "c", nearCenter: true },
      { id: "p9", x: 66, y: 48, w: 10, h: 8, quadrant: "br" },
      { id: "p10", x: 14, y: 62, w: 10, h: 10, quadrant: "bl" },
      { id: "p11", x: 34, y: 66, w: 8, h: 8, quadrant: "bl" },
      { id: "p12", x: 50, y: 68, w: 10, h: 8, quadrant: "c" },
      { id: "p13", x: 68, y: 66, w: 10, h: 10, quadrant: "br" },
      { id: "p14", x: 84, y: 62, w: 8, h: 10, quadrant: "br" },
      { id: "p15", x: 22, y: 84, w: 10, h: 8, quadrant: "bl" },
      { id: "p16", x: 46, y: 84, w: 12, h: 8, quadrant: "c" },
      { id: "p17", x: 72, y: 84, w: 10, h: 8, quadrant: "br" },
    ],
  },
];

export function getTemplate(id: SpotTemplateId): SpotTemplate {
  const t = SPOT_TEMPLATES.find((s) => s.id === id);
  if (!t) return SPOT_TEMPLATES[0]!;
  return t;
}

export function pickTemplate(seed: number): SpotTemplate {
  const idx = Math.abs(seed) % SPOT_TEMPLATES.length;
  return SPOT_TEMPLATES[idx]!;
}
