import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type PointerEvent,
} from "react";

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
  /** Optional circular loupe that follows the pointer over the scene. */
  magnify?: boolean;
  caption?: ReactNode;
  className?: string;
}

const LOUPE_ZOOM = 2.25;
/** Diameter in rem; keep in sync with `.hunt-loupe` CSS. */
const LOUPE_DIAMETER_REM = 7.5;
const TOUCH_OFFSET_FRAC = 0.6;

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function remToPx(rem: number): number {
  const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  return rem * (Number.isFinite(root) && root > 0 ? root : 16);
}

interface LoupeState {
  /** Loupe center relative to the frame (px). */
  left: number;
  top: number;
  /** Normalized image coords under the pointer (0–1). */
  nx: number;
  ny: number;
  imgW: number;
  imgH: number;
}

export function HuntScenePins({
  imageUrl,
  alt,
  pins = [],
  draft = null,
  draftPopover = null,
  onImageClick,
  magnify = false,
  caption,
  className = "",
}: Props) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [loupe, setLoupe] = useState<LoupeState | null>(null);

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

  useEffect(() => {
    if (!magnify) setLoupe(null);
  }, [magnify]);

  function imageRectFromFrame(frame: HTMLDivElement): DOMRect | null {
    const img = frame.querySelector("img.hunt-scene-img");
    if (!(img instanceof HTMLImageElement)) return null;
    const rect = img.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    return rect;
  }

  function updateLoupe(e: PointerEvent<HTMLDivElement>) {
    if (!magnify || draft) {
      setLoupe(null);
      return;
    }
    const frame = e.currentTarget;
    const frameBox = frame.getBoundingClientRect();
    const rect = imageRectFromFrame(frame);
    if (!rect) {
      setLoupe(null);
      return;
    }
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setLoupe(null);
      return;
    }
    const nx = clamp01((e.clientX - rect.left) / rect.width);
    const ny = clamp01((e.clientY - rect.top) / rect.height);
    const diameter = remToPx(LOUPE_DIAMETER_REM);
    const isTouch = e.pointerType === "touch";
    const offsetY = isTouch ? -diameter * TOUCH_OFFSET_FRAC : 0;
    // Position relative to frame; image may be letterboxed inside the frame.
    const pointerInFrameX = e.clientX - frameBox.left;
    const pointerInFrameY = e.clientY - frameBox.top;
    setLoupe({
      left: pointerInFrameX,
      top: pointerInFrameY + offsetY,
      nx,
      ny,
      imgW: rect.width,
      imgH: rect.height,
    });
  }

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
  const showLoupe = magnify && !draft && loupe != null;

  let loupeStyle: CSSProperties | undefined;
  if (showLoupe && loupe) {
    const radius = remToPx(LOUPE_DIAMETER_REM) / 2;
    loupeStyle = {
      left: loupe.left,
      top: loupe.top,
      backgroundImage: `url(${JSON.stringify(imageUrl)})`,
      backgroundSize: `${loupe.imgW * LOUPE_ZOOM}px ${loupe.imgH * LOUPE_ZOOM}px`,
      backgroundPosition: `${-(loupe.nx * loupe.imgW * LOUPE_ZOOM - radius)}px ${-(
        loupe.ny * loupe.imgH * LOUPE_ZOOM - radius
      )}px`,
    };
  }

  return (
    <figure className={`hunt-scene hunt-scene-pins ${className}`.trim()}>
      <div
        className={`hunt-scene-frame${onImageClick ? " is-clickable" : ""}${
          magnify ? " is-magnify" : ""
        }${showLoupe ? " is-loupe-active" : ""}`}
        onPointerDown={(e) => {
          if (magnify) updateLoupe(e);
          if (onImageClick) handlePointer(e);
        }}
        onPointerMove={magnify ? updateLoupe : undefined}
        onPointerEnter={magnify ? updateLoupe : undefined}
        onPointerLeave={magnify ? () => setLoupe(null) : undefined}
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
        {showLoupe ? (
          <div className="hunt-loupe" style={loupeStyle} aria-hidden />
        ) : null}
      </div>
      {caption ? <figcaption className="muted">{caption}</figcaption> : null}
    </figure>
  );
}
