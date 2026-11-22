import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
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
  /** Rendered at the draft pin (popover) or in the overlay sheet. */
  draftPopover?: ReactNode;
  onImageClick?: (norm: { x: number; y: number }) => void;
  /** Optional circular loupe that follows the pointer (desktop). */
  magnify?: boolean;
  /** Enable pinch/pan zoom viewport (touch hunt play). */
  mobileZoom?: boolean;
  /** Bump to snap zoom/pan back to 1×. */
  zoomResetKey?: number;
  /** Temp draft pin is tappable (mobile two-step annotate). */
  draftInteractive?: boolean;
  onDraftActivate?: () => void;
  /** When true + overlay mode, show draftPopover in a bottom sheet. */
  annotating?: boolean;
  annotateMode?: "popover" | "overlay";
  caption?: ReactNode;
  className?: string;
}

const LOUPE_ZOOM = 2.25;
  /** Diameter in rem; keep in sync with `.hunt-loupe` CSS. Zoom stays at LOUPE_ZOOM. */
  const LOUPE_DIAMETER_REM = 30;
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const TAP_MOVE_PX = 10;

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function remToPx(rem: number): number {
  const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  return rem * (Number.isFinite(root) && root > 0 ? root : 16);
}

interface LoupeState {
  left: number;
  top: number;
  nx: number;
  ny: number;
  imgW: number;
  imgH: number;
}

interface ZoomState {
  scale: number;
  tx: number;
  ty: number;
}

export function HuntScenePins({
  imageUrl,
  alt,
  pins = [],
  draft = null,
  draftPopover = null,
  onImageClick,
  magnify = false,
  mobileZoom = false,
  zoomResetKey = 0,
  draftInteractive = false,
  onDraftActivate,
  annotating = false,
  annotateMode = "popover",
  caption,
  className = "",
}: Props) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loupe, setLoupe] = useState<LoupeState | null>(null);
  const [zoom, setZoom] = useState<ZoomState>({ scale: 1, tx: 0, ty: 0 });
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<{
    startDist: number;
    startScale: number;
    startTx: number;
    startTy: number;
    midX: number;
    midY: number;
  } | null>(null);
  const panRef = useRef<{
    startX: number;
    startY: number;
    originTx: number;
    originTy: number;
    moved: boolean;
  } | null>(null);
  const tapRef = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    if (!annotating || annotateMode !== "popover" || !draft) return;
    const root = popoverRef.current;
    if (!root) return;
    const input = root.querySelector("input, textarea") as HTMLInputElement | null;
    if (!input) return;
    const id = window.requestAnimationFrame(() => {
      input.focus({ preventScroll: true });
      input.select();
    });
    return () => window.cancelAnimationFrame(id);
  }, [draft?.x, draft?.y, annotating, annotateMode]);

  useEffect(() => {
    if (!annotating || annotateMode !== "overlay") return;
    const root = overlayRef.current;
    if (!root) return;
    const input = root.querySelector("input, textarea") as HTMLInputElement | null;
    if (!input) return;
    const id = window.requestAnimationFrame(() => {
      input.focus({ preventScroll: true });
      input.select();
    });
    return () => window.cancelAnimationFrame(id);
  }, [annotating, annotateMode]);

  useEffect(() => {
    if (!magnify) setLoupe(null);
  }, [magnify]);

  useEffect(() => {
    setZoom({ scale: 1, tx: 0, ty: 0 });
  }, [zoomResetKey]);

  function imageRectFromFrame(frame: HTMLElement): DOMRect | null {
    const img = frame.querySelector("img.hunt-scene-img");
    if (!(img instanceof HTMLImageElement)) return null;
    const rect = img.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    return rect;
  }

  function updateLoupe(e: ReactPointerEvent<HTMLDivElement>) {
    if (!magnify || annotating) {
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
    setLoupe({
      left: e.clientX - frameBox.left,
      top: e.clientY - frameBox.top,
      nx,
      ny,
      imgW: rect.width,
      imgH: rect.height,
    });
  }

  function normFromClient(clientX: number, clientY: number, root: HTMLElement): {
    x: number;
    y: number;
  } | null {
    const rect = imageRectFromFrame(root);
    if (!rect) return null;
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }
    return {
      x: clamp01((clientX - rect.left) / rect.width),
      y: clamp01((clientY - rect.top) / rect.height),
    };
  }

  function handleDesktopPointer(e: ReactPointerEvent<HTMLDivElement>) {
    if (magnify) updateLoupe(e);
    if (!onImageClick) return;
    const norm = normFromClient(e.clientX, e.clientY, e.currentTarget);
    if (!norm) return;
    onImageClick(norm);
  }

  function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function onViewportPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!mobileZoom || annotating) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      viewport.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    if (pointersRef.current.size === 1) {
      const z = zoomRef.current;
      tapRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
      panRef.current =
        z.scale > 1
          ? {
              startX: e.clientX,
              startY: e.clientY,
              originTx: z.tx,
              originTy: z.ty,
              moved: false,
            }
          : {
              startX: e.clientX,
              startY: e.clientY,
              originTx: z.tx,
              originTy: z.ty,
              moved: false,
            };
      pinchRef.current = null;
    } else if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      const [a, b] = pts;
      if (!a || !b) return;
      const z = zoomRef.current;
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      pinchRef.current = {
        startDist: Math.max(1, dist(a, b)),
        startScale: z.scale,
        startTx: z.tx,
        startTy: z.ty,
        midX,
        midY,
      };
      panRef.current = null;
      tapRef.current = null;
    }
  }

  function onViewportPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!mobileZoom || annotating) return;
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size >= 2 && pinchRef.current) {
      const pts = [...pointersRef.current.values()];
      const [a, b] = pts;
      if (!a || !b) return;
      const p = pinchRef.current;
      const nextDist = Math.max(1, dist(a, b));
      const nextScale = clamp(p.startScale * (nextDist / p.startDist), MIN_SCALE, MAX_SCALE);
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const vp = viewportRef.current?.getBoundingClientRect();
      if (!vp) return;
      const cx = vp.left + vp.width / 2;
      const cy = vp.top + vp.height / 2;
      // Keep the pinch midpoint stable relative to content while scaling.
      const nextTx =
        midX - cx - ((p.midX - cx - p.startTx) * nextScale) / p.startScale;
      const nextTy =
        midY - cy - ((p.midY - cy - p.startTy) * nextScale) / p.startScale;
      setZoom({ scale: nextScale, tx: nextTx, ty: nextTy });
      return;
    }

    if (panRef.current && pointersRef.current.size === 1) {
      const dx = e.clientX - panRef.current.startX;
      const dy = e.clientY - panRef.current.startY;
      if (Math.hypot(dx, dy) > TAP_MOVE_PX) panRef.current.moved = true;
      if (zoomRef.current.scale > 1) {
        setZoom({
          scale: zoomRef.current.scale,
          tx: panRef.current.originTx + dx,
          ty: panRef.current.originTy + dy,
        });
      }
    }
  }

  function onViewportPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!mobileZoom) return;
    const wasTapCandidate = tapRef.current;
    const pan = panRef.current;
    pointersRef.current.delete(e.pointerId);
    const viewport = viewportRef.current;
    if (viewport) {
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }

    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) {
      const moved = pan?.moved ?? false;
      panRef.current = null;
      if (
        !annotating &&
        onImageClick &&
        wasTapCandidate &&
        !moved &&
        Date.now() - wasTapCandidate.t < 450
      ) {
        const root = contentRef.current ?? viewport;
        if (root) {
          const norm = normFromClient(wasTapCandidate.x, wasTapCandidate.y, root);
          if (norm) onImageClick(norm);
        }
      }
      tapRef.current = null;
    }
  }

  const popoverBelow = draft ? draft.y < 0.72 : true;
  const showLoupe = magnify && !annotating && loupe != null;
  const showPopover =
    annotateMode === "popover" && annotating && draft && draftPopover;
  const showOverlay =
    annotateMode === "overlay" && annotating && draftPopover;

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

  const frame = (
    <div
      className={`hunt-scene-frame${onImageClick ? " is-clickable" : ""}${
        magnify ? " is-magnify" : ""
      }${showLoupe ? " is-loupe-active" : ""}${mobileZoom ? " is-mobile-zoom" : ""}`}
      onPointerDown={
        mobileZoom
          ? undefined
          : onImageClick || magnify
            ? handleDesktopPointer
            : undefined
      }
      onPointerMove={!mobileZoom && magnify ? updateLoupe : undefined}
      onPointerEnter={!mobileZoom && magnify ? updateLoupe : undefined}
      onPointerLeave={!mobileZoom && magnify ? () => setLoupe(null) : undefined}
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
        <button
          type="button"
          className={`hunt-pin hunt-pin-draft${draftInteractive ? " is-interactive" : ""}`}
          style={{ left: `${draft.x * 100}%`, top: `${draft.y * 100}%` }}
          aria-label={draftInteractive ? "Name this find" : undefined}
          tabIndex={draftInteractive ? 0 : -1}
          onPointerDown={
            draftInteractive
              ? (ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  onDraftActivate?.();
                }
              : undefined
          }
        />
      ) : null}
      {showPopover ? (
        <div
          ref={popoverRef}
          className={`hunt-draft-popover${popoverBelow ? " is-below" : " is-above"}`}
          style={{ left: `${draft!.x * 100}%`, top: `${draft!.y * 100}%` }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {draftPopover}
        </div>
      ) : null}
      {showLoupe ? (
        <div className="hunt-loupe" style={loupeStyle} aria-hidden>
          <span className="hunt-loupe-reticle" />
        </div>
      ) : null}
    </div>
  );

  return (
    <figure
      className={`hunt-scene hunt-scene-pins${mobileZoom ? " is-mobile-zoom" : ""} ${className}`.trim()}
    >
      {mobileZoom ? (
        <div
          ref={viewportRef}
          className="hunt-zoom-viewport"
          onPointerDown={onViewportPointerDown}
          onPointerMove={onViewportPointerMove}
          onPointerUp={onViewportPointerUp}
          onPointerCancel={onViewportPointerUp}
        >
          <div
            ref={contentRef}
            className="hunt-zoom-content"
            style={{
              transform: `translate(${zoom.tx}px, ${zoom.ty}px) scale(${zoom.scale})`,
            }}
          >
            {frame}
          </div>
        </div>
      ) : (
        frame
      )}
      {showOverlay ? (
        <div
          className="hunt-annotate-overlay"
          ref={overlayRef}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="hunt-annotate-sheet">{draftPopover}</div>
        </div>
      ) : null}
      {caption ? <figcaption className="muted">{caption}</figcaption> : null}
    </figure>
  );
}
