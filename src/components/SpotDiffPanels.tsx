import { useRef, type PointerEvent } from "react";
import type { SpotBox, SpotDifference, SpotProp, SpotPuzzle } from "../spotdiffTypes.ts";

interface Props {
  puzzle: SpotPuzzle;
  foundDiffIds: string[];
  hintBox?: SpotBox | null;
  showAllDiffs?: boolean;
  interactive?: boolean;
  locked?: boolean;
  flash?: "ok" | "bad" | null;
  onTap?: (norm: { x: number; y: number }) => void;
  className?: string;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function propTransform(p: SpotProp): string | undefined {
  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;
  const parts: string[] = [];
  if (p.rotate) parts.push(`rotate(${p.rotate} ${cx} ${cy})`);
  if (p.flipX) parts.push(`translate(${cx} ${cy}) scale(-1 1) translate(${-cx} ${-cy})`);
  return parts.length ? parts.join(" ") : undefined;
}

function SpotPropEl({ prop }: { prop: SpotProp }) {
  const transform = propTransform(prop);
  const stroke = prop.stroke ?? "#37474f";
  const common = {
    fill: prop.fill,
    stroke,
    strokeWidth: 0.6,
    transform,
  };

  if (prop.shape === "circle") {
    return (
      <ellipse
        cx={prop.x + prop.w / 2}
        cy={prop.y + prop.h / 2}
        rx={prop.w / 2}
        ry={prop.h / 2}
        {...common}
      />
    );
  }
  if (prop.shape === "ellipse") {
    return (
      <ellipse
        cx={prop.x + prop.w / 2}
        cy={prop.y + prop.h / 2}
        rx={prop.w / 2}
        ry={prop.h / 2}
        {...common}
      />
    );
  }
  if (prop.shape === "triangle") {
    const x1 = prop.x + prop.w / 2;
    const y1 = prop.y;
    const x2 = prop.x;
    const y2 = prop.y + prop.h;
    const x3 = prop.x + prop.w;
    const y3 = prop.y + prop.h;
    return <polygon points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} {...common} />;
  }
  if (prop.shape === "star") {
    const cx = prop.x + prop.w / 2;
    const cy = prop.y + prop.h / 2;
    const rx = prop.w / 2;
    const ry = prop.h / 2;
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 2) * -1 + (i * Math.PI) / 5;
      const r = i % 2 === 0 ? 1 : 0.45;
      pts.push(`${cx + Math.cos(a) * rx * r},${cy + Math.sin(a) * ry * r}`);
    }
    return <polygon points={pts.join(" ")} {...common} />;
  }
  return <rect x={prop.x} y={prop.y} width={prop.w} height={prop.h} rx={1.2} {...common} />;
}

function PanelSvg({
  props,
  label,
  marks,
  hintBox,
  interactive,
  locked,
  onTap,
}: {
  props: SpotProp[];
  label: string;
  marks: SpotDifference[];
  hintBox?: SpotBox | null;
  interactive?: boolean;
  locked?: boolean;
  onTap?: (norm: { x: number; y: number }) => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);

  function handlePointer(e: PointerEvent<HTMLDivElement>) {
    if (!interactive || locked || !onTap) return;
    const svg = e.currentTarget.querySelector("svg.spot-panel-svg");
    if (!(svg instanceof SVGSVGElement)) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    onTap({
      x: clamp01((e.clientX - rect.left) / rect.width),
      y: clamp01((e.clientY - rect.top) / rect.height),
    });
  }

  return (
    <div className="spot-panel" ref={frameRef}>
      <p className="spot-panel-label">{label}</p>
      <div
        className={`spot-panel-frame${interactive ? " is-clickable" : ""}${locked ? " is-locked" : ""}`}
        onPointerDown={handlePointer}
      >
        <svg className="spot-panel-svg" viewBox="0 0 100 100" role="img" aria-label={label}>
          {props.map((p) => (
            <SpotPropEl key={p.id} prop={p} />
          ))}
          {marks.map((d) => (
            <ellipse
              key={`m-${d.id}`}
              className="spot-mark"
              cx={(d.box.x + d.box.w / 2) * 100}
              cy={(d.box.y + d.box.h / 2) * 100}
              rx={Math.max(d.box.w * 50, 4)}
              ry={Math.max(d.box.h * 50, 4)}
              fill="none"
              stroke="var(--accent-2)"
              strokeWidth={1.4}
            />
          ))}
          {hintBox ? (
            <rect
              className="spot-hint"
              x={hintBox.x * 100}
              y={hintBox.y * 100}
              width={hintBox.w * 100}
              height={hintBox.h * 100}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.6}
              strokeDasharray="3 2"
            />
          ) : null}
        </svg>
      </div>
    </div>
  );
}

export function SpotDiffPanels({
  puzzle,
  foundDiffIds,
  hintBox = null,
  showAllDiffs = false,
  interactive = false,
  locked = false,
  flash = null,
  onTap,
  className = "",
}: Props) {
  const foundSet = new Set(foundDiffIds);
  const marks = showAllDiffs
    ? puzzle.differences
    : puzzle.differences.filter((d) => foundSet.has(d.id));

  return (
    <div className={`spot-panels${flash ? ` spot-flash-${flash}` : ""} ${className}`.trim()}>
      <PanelSvg
        props={puzzle.panelA}
        label="A"
        marks={marks}
        hintBox={hintBox}
        interactive={interactive}
        locked={locked}
        onTap={onTap}
      />
      <PanelSvg
        props={puzzle.panelB}
        label="B"
        marks={marks}
        hintBox={hintBox}
        interactive={interactive}
        locked={locked}
        onTap={onTap}
      />
    </div>
  );
}
