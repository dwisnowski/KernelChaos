import { isConsonant, isVowel } from "../wheelTypes.ts";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface Props {
  mode: "consonant" | "vowel";
  usedLetters: string[];
  disabled?: boolean;
  onPick: (letter: string) => void;
}

export function LetterPad({ mode, usedLetters, disabled, onPick }: Props) {
  const used = new Set(usedLetters.map((l) => l.toUpperCase()));
  return (
    <div
      className={`letter-pad letter-pad-${mode}`}
      role="group"
      aria-label={mode === "vowel" ? "Vowels" : "Consonants"}
    >
      {LETTERS.filter((L) => (mode === "vowel" ? isVowel(L) : isConsonant(L))).map((L) => {
        const taken = used.has(L);
        return (
          <button
            key={L}
            type="button"
            className={`letter-key${taken ? " used" : ""}`}
            disabled={disabled || taken}
            onClick={() => onPick(L)}
          >
            {L}
          </button>
        );
      })}
    </div>
  );
}
