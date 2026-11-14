import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { ORB_COLOR_HEX, ORB_COLOR_LABELS, type OrbColor } from "../mmmmsTypes.ts";

const LONG_PRESS_MS = 180;
const MOVE_CANCEL_PX = 8;
const EDGE_ZONE_PX = 40;
const AUTO_SCROLL_PX = 10;

interface Props {
  orbs: OrbColor[];
  /** When true, list is not interactive for reorder. */
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
  const [ghost, setGhost] = useState<{
    color: OrbColor;
    x: number;
    y: number;
  } | null>(null);

  const dragFromRef = useRef<number | null>(null);
  const dragOverRef = useRef<number | null>(null);
  const pendingRef = useRef<{
    index: number;
    pointerId: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    target: HTMLElement;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);
  const pointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const autoScrollRafRef = useRef<number | null>(null);
  const orbsRef = useRef(orbs);
  orbsRef.current = orbs;
  const onReorderRef = useRef(onReorder);
  onReorderRef.current = onReorder;

  function setDragFromBoth(v: number | null) {
    dragFromRef.current = v;
    setDragFrom(v);
  }

  function setDragOverBoth(v: number | null) {
    dragOverRef.current = v;
    setDragOver(v);
  }

  function clearPending() {
    const pending = pendingRef.current;
    if (pending) {
      clearTimeout(pending.timer);
      pendingRef.current = null;
    }
  }

  function stopAutoScroll() {
    if (autoScrollRafRef.current != null) {
      cancelAnimationFrame(autoScrollRafRef.current);
      autoScrollRafRef.current = null;
    }
  }

  function indexFromPoint(clientY: number): number | null {
    const list = listRef.current;
    if (!list) return null;
    const items = [...list.querySelectorAll<HTMLElement>("[data-orb-index]")];
    let best: { idx: number; dist: number } | null = null;
    for (const el of items) {
      const rect = el.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        const idx = Number(el.dataset.orbIndex);
        return Number.isFinite(idx) ? idx : null;
      }
      const mid = (rect.top + rect.bottom) / 2;
      const dist = Math.abs(clientY - mid);
      const idx = Number(el.dataset.orbIndex);
      if (!Number.isFinite(idx)) continue;
      if (!best || dist < best.dist) best = { idx, dist };
    }
    return best?.idx ?? null;
  }

  function tickAutoScroll() {
    autoScrollRafRef.current = null;
    if (dragFromRef.current == null) return;
    const list = listRef.current;
    const pos = pointerPosRef.current;
    if (!list || !pos) return;

    // column-reverse: increasing scrollTop reveals the visual top of the stack
    const rect = list.getBoundingClientRect();
    let delta = 0;
    if (pos.y < rect.top + EDGE_ZONE_PX) {
      delta = AUTO_SCROLL_PX;
    } else if (pos.y > rect.bottom - EDGE_ZONE_PX) {
      delta = -AUTO_SCROLL_PX;
    }

    if (delta !== 0) {
      const prev = list.scrollTop;
      list.scrollTop += delta;
      if (list.scrollTop !== prev) {
        const next = indexFromPoint(pos.y);
        if (next != null && next !== dragOverRef.current) setDragOverBoth(next);
      }
    }

    autoScrollRafRef.current = requestAnimationFrame(tickAutoScroll);
  }

  function startAutoScroll() {
    if (autoScrollRafRef.current != null) return;
    autoScrollRafRef.current = requestAnimationFrame(tickAutoScroll);
  }

  function beginDrag(index: number, pointerId: number, x: number, y: number, target: HTMLElement) {
    const color = orbsRef.current[index];
    if (!color) return;
    clearPending();
    try {
      target.setPointerCapture(pointerId);
    } catch {
      /* already released */
    }
    pointerPosRef.current = { x, y };
    setDragFromBoth(index);
    setDragOverBoth(index);
    setGhost({ color, x, y });
    startAutoScroll();
  }

  function endDrag(commit: boolean) {
    clearPending();
    stopAutoScroll();
    const from = dragFromRef.current;
    const over = dragOverRef.current;
    const reorder = onReorderRef.current;
    if (commit && from != null && over != null && over !== from && reorder) {
      const next = [...orbsRef.current];
      const [moved] = next.splice(from, 1);
      if (moved) {
        next.splice(over, 0, moved);
        reorder(next);
      }
    }
    pointerPosRef.current = null;
    setDragFromBoth(null);
    setDragOverBoth(null);
    setGhost(null);
  }

  useEffect(() => {
    return () => {
      clearPending();
      stopAutoScroll();
    };
  }, []);

  function onPointerDown(e: ReactPointerEvent, index: number) {
    if (disabled || !onReorder) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;

    const target = e.currentTarget as HTMLElement;
    const startX = e.clientX;
    const startY = e.clientY;
    clearPending();

    const timer = setTimeout(() => {
      const pending = pendingRef.current;
      if (!pending || pending.index !== index) return;
      pendingRef.current = null;
      beginDrag(index, pending.pointerId, pending.lastX, pending.lastY, pending.target);
    }, LONG_PRESS_MS);

    pendingRef.current = {
      index,
      pointerId: e.pointerId,
      startX,
      startY,
      lastX: startX,
      lastY: startY,
      target,
      timer,
    };
  }

  function onPointerMove(e: ReactPointerEvent) {
    const pending = pendingRef.current;
    if (pending && pending.pointerId === e.pointerId) {
      pending.lastX = e.clientX;
      pending.lastY = e.clientY;
      const dx = e.clientX - pending.startX;
      const dy = e.clientY - pending.startY;
      if (dx * dx + dy * dy > MOVE_CANCEL_PX * MOVE_CANCEL_PX) {
        clearPending();
      }
      return;
    }

    if (dragFromRef.current == null) return;
    pointerPosRef.current = { x: e.clientX, y: e.clientY };
    setGhost((g) => (g ? { ...g, x: e.clientX, y: e.clientY } : g));
    const next = indexFromPoint(e.clientY);
    if (next != null && next !== dragOverRef.current) setDragOverBoth(next);
  }

  function onPointerUp(e: ReactPointerEvent) {
    if (pendingRef.current?.pointerId === e.pointerId) {
      clearPending();
      return;
    }
    if (dragFromRef.current == null) return;
    endDrag(true);
  }

  function onPointerCancel(e: ReactPointerEvent) {
    if (pendingRef.current?.pointerId === e.pointerId) {
      clearPending();
      return;
    }
    if (dragFromRef.current == null) return;
    endDrag(false);
  }

  const dragging = dragFrom != null;

  return (
    <>
      <ul
        ref={listRef}
        className={`orb-list${className ? ` ${className}` : ""}${disabled ? " is-locked" : ""}${
          dragging ? " is-dragging-active" : ""
        }`}
        aria-label="Orb stack"
      >
        {orbs.map((color, index) => {
          const isVanishing = vanishing?.has(index) ?? false;
          const isBottomHighlight = highlightBottom && index === 0 && !isVanishing;
          const isSource = dragFrom === index;
          const isDrop =
            dragOver === index && dragFrom != null && dragFrom !== index;
          return (
            <li
              key={`${index}-${color}`}
              data-orb-index={index}
              data-orb-color={color}
              className={[
                "orb-item",
                isSource ? "is-dragging is-placeholder" : "",
                isDrop ? "is-drop-target" : "",
                isVanishing ? "is-vanishing" : "",
                isBottomHighlight ? "is-bottom-hot" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ ["--orb-color" as string]: ORB_COLOR_HEX[color] }}
              onPointerDown={(ev) => onPointerDown(ev, index)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            >
              <span className="orb-bead" aria-hidden="true" />
              <span className="orb-label">{ORB_COLOR_LABELS[color]}</span>
            </li>
          );
        })}
      </ul>
      {ghost && typeof document !== "undefined"
        ? createPortal(
            <div
              className="orb-drag-ghost"
              style={{
                left: ghost.x,
                top: ghost.y,
                ["--orb-color" as string]: ORB_COLOR_HEX[ghost.color],
              }}
              aria-hidden="true"
            >
              <span className="orb-bead" />
              <span className="orb-label">{ORB_COLOR_LABELS[ghost.color]}</span>
            </div>,
            document.body,
          )
        : null}
    </>
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
