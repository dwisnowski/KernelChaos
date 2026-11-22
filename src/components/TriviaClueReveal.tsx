import { useEffect, useRef, useState, type ReactNode } from "react";

const EXPAND_MS = 600;

interface Props {
  categoryIndex: number;
  tier: number;
  /** When true, run grow-from-cell then show children. */
  active: boolean;
  children: ReactNode;
  className?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TriviaClueReveal({
  categoryIndex,
  tier,
  active,
  children,
  className = "",
}: Props) {
  const [phase, setPhase] = useState<"idle" | "expanding" | "settled">("idle");
  const overlayRef = useRef<HTMLDivElement>(null);
  const ranFor = useRef<string | null>(null);

  useEffect(() => {
    if (!active) {
      setPhase("idle");
      ranFor.current = null;
      return;
    }
    const key = `${categoryIndex}-${tier}`;
    if (ranFor.current === key) return;
    ranFor.current = key;

    if (prefersReducedMotion()) {
      setPhase("settled");
      return;
    }

    const cell = document.querySelector<HTMLElement>(
      `[data-trivia-cell="${categoryIndex}-${tier}"]`,
    );
    const from = cell?.getBoundingClientRect();
    setPhase("expanding");

    const id = window.requestAnimationFrame(() => {
      const el = overlayRef.current;
      if (!el || !from) {
        setPhase("settled");
        return;
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sx = from.width / vw;
      const sy = from.height / vh;
      const tx = from.left + from.width / 2 - vw / 2;
      const ty = from.top + from.height / 2 - vh / 2;
      el.style.setProperty("--trivia-flip-sx", String(sx || 0.08));
      el.style.setProperty("--trivia-flip-sy", String(sy || 0.08));
      el.style.setProperty("--trivia-flip-tx", `${tx}px`);
      el.style.setProperty("--trivia-flip-ty", `${ty}px`);
      el.classList.add("is-animating");
      // Force reflow then expand to identity
      void el.offsetWidth;
      el.classList.add("is-expanded");
    });

    const done = window.setTimeout(() => setPhase("settled"), EXPAND_MS);
    return () => {
      window.cancelAnimationFrame(id);
      window.clearTimeout(done);
    };
  }, [active, categoryIndex, tier]);

  if (!active) return null;

  const showContent = phase === "settled" || prefersReducedMotion();

  return (
    <div
      ref={overlayRef}
      className={`trivia-clue-expand${phase === "settled" ? " is-settled" : ""}${
        className ? ` ${className}` : ""
      }`}
      aria-live="polite"
    >
      {showContent ? children : null}
    </div>
  );
}
