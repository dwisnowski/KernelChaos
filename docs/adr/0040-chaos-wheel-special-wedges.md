# ADR 0040: Chaos Wheel special wedges

## Status

Accepted (superseded in part by [ADR 0047](./0047-chaos-wheel-guess-timer.md): Mirror / Lose Turn / Speed removed; guess timer is universal).

## Context

ADR 0039 shipped Chaos Wheel with cash, Bankrupt, Lose a Turn, and Free Spin. Family play needed more variety without turning the show into a rules manual—short canvas labels and server-authoritative settle.

## Decision

Rebuild the wheel to ~30 mixed cash slices plus specials (two Free Spins). Specials:

| Kind | On land (summary) |
| --- | --- |
| `payEach` | Pay $50×rivals from round bank or lose turn; else transfer and call consonant at $0 |
| `double` / `flatBonus` / `half` | Bank math → `action` |
| `jackpot` | Claim pot; pot grows +50 on every successful spin settle (before claim). Full Bankrupt dumps the lost round bank into the pot. Wheel has one `BANKRUPT`; former `½ BANKRUPT` is a second cash `1000`. |
| `swapBanks` / `steal` | Versus others (solo no-op) → `action` |
| `freeLetter` / `mystery` / `wildVowel` | Reveal or free vowel path |
| `passWheel` | Advance seat; Free Spin does not cancel |
| `chaosTax` | Each pays min(100, bank) into jackpot → spinner `action` |
| `insurance` | Next full Bankrupt does not change your round bank (token consumed; turn still advances). Banner uses `insurance` outcome. |

Public state exposes `jackpot`, `guessEndsAt` (see ADR 0047), `lastOutcome`; players show `insurance`. Client colors, outcome banners, and `playWheelSpecial` map settle cues; TV mirrors jackpot + banners and shows `WHEEL_OUTCOME_BLURBS` under the outcome title so the audience knows what the landed tile does.

## Consequences

- Cross-links [ADR 0039](./0039-chaos-wheel.md); wedge table lives in `worker/wheel/wheel.ts`.
- More room fields and alarm paths on `GameRoom`; keep Free Spin / insurance edge cases covered in resolve helpers.
- Labels stay short for Canvas; human copy is `WHEEL_OUTCOME_LABELS` on phone + TV.
- Guess timing and removal of Mirror / Lose Turn / Speed are in [ADR 0047](./0047-chaos-wheel-guess-timer.md).
