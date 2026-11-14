import type { MmmmsAttackResult } from "../mmmmsTypes.ts";

export type MmmmsOutcomeKind = "blocked" | "go-fish";

/** Prefer blocked when both somehow apply (rare); otherwise go fish. */
export function resolveMmmmsOutcome(attack: MmmmsAttackResult): MmmmsOutcomeKind | null {
  const blocked = attack.guessCorrect && attack.steps.some((s) => s.kind === "halt");
  if (blocked) return "blocked";
  if (!attack.colorInStack) return "go-fish";
  return null;
}

const TITLES: Record<MmmmsOutcomeKind, string> = {
  blocked: "Attack blocked!",
  "go-fish": "Go Fish!",
};

export function MmmmsOutcomeOverlay({
  kind,
  className = "",
}: {
  kind: MmmmsOutcomeKind;
  className?: string;
}) {
  return (
    <div
      className={`mmmms-outcome-overlay is-${kind}${className ? ` ${className}` : ""}`}
      aria-live="polite"
      role="status"
    >
      <p className="mmmms-outcome-title">{TITLES[kind]}</p>
    </div>
  );
}
