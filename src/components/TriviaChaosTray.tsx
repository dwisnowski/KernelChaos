import {
  LIGHT_CHAOS_POWERS,
  MAYHEM_CHAOS_POWERS,
  type TriviaChaosMode,
  type TriviaChaosPower,
  type TriviaPhase,
  type TriviaPlayerPublic,
} from "../triviaTypes.ts";

const LABELS: Record<TriviaChaosPower, string> = {
  fakeBuzz: "Fake buzz",
  buzzJam: "Buzz jam",
  blindfold: "Blindfold",
  cheerBoo: "Cheer/boo",
  partyTax: "Party tax",
  screenZap: "Screen zap",
  trapAnswer: "Trap answer",
  stealBuzz: "Steal buzz",
  potSiphon: "Pot siphon",
  swapStakes: "Swap stakes",
  challenge: "Challenge",
  hotSeat: "Hot seat",
  alliance: "Alliance",
  spotlightSteal: "Spotlight",
  hintTax: "Hint tax",
  phoneFriend: "Phone a friend",
};

interface Props {
  mode: TriviaChaosMode;
  phase: TriviaPhase;
  me: TriviaPlayerPublic;
  players: TriviaPlayerPublic[];
  onUse: (power: TriviaChaosPower, targetPlayerId?: string) => void;
  onCheer?: (delta: 1 | -1) => void;
}

function legal(power: TriviaChaosPower, phase: TriviaPhase): boolean {
  switch (power) {
    case "fakeBuzz":
    case "spotlightSteal":
      return phase === "buzzOpen";
    case "buzzJam":
      return phase === "board" || phase === "clue" || phase === "buzzOpen";
    case "blindfold":
    case "screenZap":
    case "cheerBoo":
    case "trapAnswer":
    case "stealBuzz":
    case "hintTax":
    case "phoneFriend":
    case "partyTax":
      return phase === "answering";
    case "challenge":
    case "hotSeat":
      return phase === "reveal";
    case "potSiphon":
    case "swapStakes":
    case "alliance":
      return phase === "board" || phase === "between" || phase === "reveal";
    default:
      return false;
  }
}

export function TriviaChaosTray({ mode, phase, me, players, onUse, onCheer }: Props) {
  if (mode === "off" || me.chaosCharges < 1) return null;
  const powers = mode === "mayhem" ? MAYHEM_CHAOS_POWERS : LIGHT_CHAOS_POWERS;
  const rivals = players.filter((p) => p.id !== me.id);

  return (
    <div className="trivia-chaos-tray">
      <p className="trivia-chaos-tray-title">
        Chaos · {me.chaosCharges} charge{me.chaosCharges === 1 ? "" : "s"}
      </p>
      <div className="trivia-chaos-tray-powers">
        {powers.map((power) => {
          const ok = legal(power, phase);
          const needsTarget =
            power === "buzzJam" ||
            power === "fakeBuzz" ||
            power === "alliance" ||
            power === "spotlightSteal";
          return (
            <div key={power} className="trivia-chaos-power">
              <button
                type="button"
                className="btn"
                disabled={!ok}
                onClick={() => {
                  if (needsTarget && rivals[0]) {
                    onUse(power, rivals[0].id);
                  } else {
                    onUse(power);
                  }
                }}
              >
                {LABELS[power]}
              </button>
              {needsTarget && ok ? (
                <select
                  className="trivia-chaos-target"
                  aria-label={`Target for ${LABELS[power]}`}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (id) onUse(power, id);
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Target…
                  </option>
                  {rivals.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          );
        })}
      </div>
      {phase === "answering" && onCheer ? (
        <div className="trivia-cheer">
          <button type="button" className="btn" onClick={() => onCheer(1)}>
            Cheer
          </button>
          <button type="button" className="btn" onClick={() => onCheer(-1)}>
            Boo
          </button>
        </div>
      ) : null}
    </div>
  );
}
