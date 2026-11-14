import { useEffect, useId, useRef, useState } from "react";

interface Props {
  roomCode: string;
  /** Game path slug — defaults to boggle for existing callers. */
  game?: "boggle" | "scattergories" | "mmmms";
  className?: string;
  /**
   * When true, intercept the click and ask before opening the spectator
   * (used while a round is underway).
   */
  requireConfirm?: boolean;
}

/** Opens the TV spectator screen for this room in a new window/tab. */
export function OpenTvButton({
  roomCode,
  game = "boggle",
  className = "btn tv-link",
  requireConfirm = false,
}: Props) {
  const href = `/${game}/room/${roomCode}/tv`;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function openSpectator() {
    window.open(href, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <div className="tv-link-wrap" ref={wrapRef}>
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-expanded={requireConfirm ? open : undefined}
        aria-haspopup={requireConfirm ? "dialog" : undefined}
        onClick={(event) => {
          if (!requireConfirm) return;
          event.preventDefault();
          setOpen(true);
        }}
      >
        Open TV spectator
      </a>
      {open ? (
        <div
          className="tv-confirm-popover"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          <p className="tv-confirm-title" id={titleId}>
            Round in progress
          </p>
          <p className="tv-confirm-copy" id={descId}>
            Open the TV spectator in a new tab? You can keep playing in this window.
          </p>
          <div className="tv-confirm-actions">
            <button type="button" className="btn" onClick={() => setOpen(false)}>
              Stay here
            </button>
            <button type="button" className="btn primary" onClick={openSpectator}>
              Open TV
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
