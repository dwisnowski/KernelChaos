import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ORB_COLOR_HEX, ORB_COLOR_LABELS, type OrbColor } from "../mmmmsTypes.ts";

interface Props {
  orbs: OrbColor[];
  /** When true, index 0 (bottom) is interactive for explosions via data attributes. */
  disabled?: boolean;
  /** Called with full bottom→top array after a drag reorder. */
  onReorder?: (orbs: OrbColor[]) => void;
  /** Indices (bottom→top) currently vanishing during resolve animation. */
  vanishing?: Set<number>;
  /** Highlight the bottom-most remaining orb during resolve. */
  highlightBottom?: boolean;
  className?: string;
}

/**
 * Visual stack: top of column = top of stack (high index), bottom of column = index 0.
 * Uses flex-direction column-reverse so DOM order matches bottom→top storage.
 */
export function OrbList({
  orbs,
  disabled = false,
  onReorder,
  vanishing,
  highlightBottom = false,
  className,
}: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  function indexFromPoint(clientY: number): number | null {
    const list = listRef.current;
    if (!list) return null;
    const items = [...list.querySelectorAll<HTMLElement>("[data-orb-index]")];
    for (const el of items) {
      const rect = el.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        const idx = Number(el.dataset.orbIndex);
        return Number.isFinite(idx) ? idx : null;
      }
    }
    return null;
  }

  function onPointerDown(e: ReactPointerEvent, index: number) {
    if (disabled || !onReorder) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragFrom(index);
    setDragOver(index);
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (dragFrom == null) return;
    const next = indexFromPoint(e.clientY);
    if (next != null) setDragOver(next);
  }

  function onPointerUp() {
    if (dragFrom == null) {
      setDragFrom(null);
      setDragOver(null);
      return;
    }
    if (dragOver != null && dragOver !== dragFrom && onReorder) {
      const next = [...orbs];
      const [moved] = next.splice(dragFrom, 1);
      if (moved) {
        next.splice(dragOver, 0, moved);
        onReorder(next);
      }
    }
    setDragFrom(null);
    setDragOver(null);
  }

  return (
    <ul
      ref={listRef}
      className={`orb-list${className ? ` ${className}` : ""}${disabled ? " is-locked" : ""}`}
      aria-label="Orb stack"
    >
      {orbs.map((color, index) => {
        const isVanishing = vanishing?.has(index) ?? false;
        const isBottomHighlight = highlightBottom && index === 0 && !isVanishing;
        return (
          <li
            key={`${index}-${color}`}
            data-orb-index={index}
            data-orb-color={color}
            className={[
              "orb-item",
              dragFrom === index ? "is-dragging" : "",
              dragOver === index && dragFrom != null && dragFrom !== index ? "is-drop-target" : "",
              isVanishing ? "is-vanishing" : "",
              isBottomHighlight ? "is-bottom-hot" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ ["--orb-color" as string]: ORB_COLOR_HEX[color] }}
            onPointerDown={(e) => onPointerDown(e, index)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="orb-bead" aria-hidden="true" />
            <span className="orb-label">{ORB_COLOR_LABELS[color]}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Hidden-count stack for opponent / TV (anonymous beads). */
export function HiddenOrbStack({ count, className }: { count: number; className?: string }) {
  const shown = Math.min(count, 30);
  return (
    <ul className={`orb-list orb-list-hidden${className ? ` ${className}` : ""}`} aria-label={`${count} orbs`}>
      {Array.from({ length: shown }, (_, i) => (
        <li key={i} className="orb-item is-hidden" data-orb-index={i}>
          <span className="orb-bead" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}
