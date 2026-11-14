import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { ORB_COLOR_HEX, ORB_COLOR_LABELS, type OrbColor } from "../mmmmsTypes.ts";

interface Props {
  orbs: OrbColor[];
  /** When true, list is not interactive for reorder. */
  disabled?: boolean;
  /** Called with full bottom→top array after a drag reorder. */
  onReorder?: (orbs: OrbColor[]) => void;
  className?: string;
}

interface SortableOrbRowProps {
  id: string;
  color: OrbColor;
  disabled: boolean;
}

function SortableOrbRow({ id, color, disabled }: SortableOrbRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ["--orb-color" as string]: ORB_COLOR_HEX[color],
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`orb-item${isDragging ? " is-dragging" : ""}`}
      data-orb-color={color}
    >
      <button
        type="button"
        className="orb-drag-handle"
        aria-label={`Reorder ${ORB_COLOR_LABELS[color]}`}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <span className="orb-drag-handle-bars" aria-hidden="true" />
      </button>
      <span className="orb-bead" aria-hidden="true" />
      <span className="orb-label">{ORB_COLOR_LABELS[color]}</span>
    </li>
  );
}

/**
 * Visual stack for organize: top of column = top of stack (high index),
 * bottom of column = index 0. Storage remains bottom→top.
 */
export function OrbList({ orbs, disabled = false, onReorder, className }: Props) {
  // Top→bottom visual order; id = storage index (bottom→top).
  const visual = useMemo(
    () => orbs.map((color, index) => ({ id: String(index), color })).reverse(),
    [orbs],
  );
  const itemIds = useMemo(() => visual.map((row) => row.id), [visual]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(event: DragEndEvent) {
    if (disabled || !onReorder) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    if (!Number.isFinite(oldIndex) || !Number.isFinite(newIndex)) return;
    if (oldIndex === newIndex) return;
    onReorder(arrayMove(orbs, oldIndex, newIndex));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy} disabled={disabled}>
        <ul
          className={`orb-list${className ? ` ${className}` : ""}${disabled ? " is-locked" : ""}`}
          aria-label="Orb stack"
        >
          {visual.map((row) => (
            <SortableOrbRow key={row.id} id={row.id} color={row.color} disabled={disabled} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

/** Hidden-count stack for opponent / TV (anonymous beads). Kept for non-canvas fallbacks. */
export function HiddenOrbStack({ count, className }: { count: number; className?: string }) {
  const shown = Math.min(count, 30);
  return (
    <ul
      className={`orb-list orb-list-hidden${className ? ` ${className}` : ""}`}
      aria-label={`${count} orbs`}
    >
      {Array.from({ length: shown }, (_, i) => (
        <li key={i} className="orb-item is-hidden" data-orb-index={i}>
          <span className="orb-bead" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}
