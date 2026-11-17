import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";

export interface HuntPinView {
  key: string;
  x: number;
  y: number;
  label?: string;
  active?: boolean;
  tone?: "mine" | "peer" | "ok" | "bad";
}

interface Props {
  imageUrl: string;
  alt: string;
  pins?: HuntPinView[];
  draft?: { x: number; y: number } | null;
  /** Rendered at the draft pin (e.g. annotate form). */
  draftPopover?: ReactNode;
  onImageClick?: (norm: { x: number; y: number }) => void;
  caption?: ReactNode;
  className?: string;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function HuntScenePins({
  imageUrl,
  alt,
  pins = [],
  draft = null,
  draftPopover = null,
  onImageClick,
  caption,
  className = "",
}: Props) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!draft) return;
    const root = popoverRef.current;
    if (!root) return;
    const input = root.querySelector("input, textarea") as HTMLInputElement | null;
    if (!input) return;
    // Defer so the popover is painted before focusing (esp. mobile).
    const id = window.requestAnimationFrame(() => {
      input.focus({ preventScroll: true });
      input.select();
    });
    return () => window.cancelAnimationFrame(id);
  }, [draft?.x, draft?.y]);

  function handlePointer(e: PointerEvent<HTMLDivElement>) {
    if (!onImageClick) return;
    const img = e.currentTarget.querySelector("img.hunt-scene-img");
    if (!(img instanceof HTMLImageElement)) return;
    const rect = img.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = clamp01((e.clientX - rect.left) / rect.width);
    const y = clamp01((e.clientY - rect.top) / rect.height);
    onImageClick({ x, y });
  }

  const popoverBelow = draft ? draft.y < 0.72 : true;

  return (
    <figure className={`hunt-scene hunt-scene-pins ${className}`.trim()}>
      <div
        className={`hunt-scene-frame${onImageClick ? " is-clickable" : ""}`}
        onPointerDown={onImageClick ? handlePointer : undefined}
      >
        <img src={imageUrl} alt={alt} className="hunt-scene-img" draggable={false} />
        {pins.map((p) => (
          <span
            key={p.key}
            className={`hunt-pin hunt-pin-${p.tone ?? "peer"}${p.active ? " is-active" : ""}`}
            style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
            title={p.label}
          >
            {p.label ? <em>{p.label}</em> : null}
          </span>
        ))}
        {draft ? (
          <span
            className="hunt-pin hunt-pin-draft"
            style={{ left: `${draft.x * 100}%`, top: `${draft.y * 100}%` }}
          />
        ) : null}
        {draft && draftPopover ? (
          <div
            ref={popoverRef}
            className={`hunt-draft-popover${popoverBelow ? " is-below" : " is-above"}`}
            style={{ left: `${draft.x * 100}%`, top: `${draft.y * 100}%` }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {draftPopover}
          </div>
        ) : null}
      </div>
      {caption ? <figcaption className="muted">{caption}</figcaption> : null}
    </figure>
  );
}
