# ADR 0040: Chaos Wheel special wedges

## Status

Accepted (implemented: full special-wedge set on the Chaos Wheel, jackpot / speed / insurance state, client banners + SFX).

## Context

ADR 0039 shipped Chaos Wheel with cash, Bankrupt, Lose a Turn, and Free Spin. Family play needed more variety without turning the show into a rules manual—short canvas labels and server-authoritative settle.

## Decision

Rebuild the wheel to ~30 mixed cash slices plus one of each special (two Free Spins; only one Lose a Turn). Specials:

| Kind | On land (summary) |
| --- | --- |
| `payEach` | Pay $50×rivals from round bank or lose turn; else transfer and call consonant at $0 |
| `double` / `flatBonus` / `half` | Bank math → `action` |
| `jackpot` | Claim pot; pot grows +50 on every successful spin settle (before claim) |
| `swapBanks` / `steal` | Versus others (solo no-op) → `action` |
| `freeLetter` / `mystery` / `wildVowel` | Reveal or free vowel path |
| `passWheel` | Advance seat; Free Spin does not cancel |
| `chaosTax` | Each pays min(100, bank) into jackpot → spinner `action` |
| `bankruptLite` | Half bank then advance (Free Spin may save) |
| `mirror` | Pending cash = last cash value (or 500) → consonant |
| `speed` | Consonant at 500 with 8s alarm → lose turn on timeout |
| `insurance` | Softens next full Bankrupt to half-bank |

Public state exposes `jackpot`, `speedEndsAt`, `lastOutcome`; players show `insurance`. Client colors, outcome banners, and `playWheelSpecial` map settle cues; TV mirrors jackpot + banners.

## Consequences

- Cross-links [ADR 0039](./0039-chaos-wheel.md); wedge table lives in `worker/wheel/wheel.ts`.
- More room fields and alarm paths on `GameRoom`; keep Free Spin / insurance edge cases covered in resolve helpers.
- Labels stay short for Canvas; human copy is `WHEEL_OUTCOME_LABELS` on phone + TV.
