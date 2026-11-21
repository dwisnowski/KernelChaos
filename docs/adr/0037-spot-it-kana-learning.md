# ADR 0037: Spot It kana Learning mode + Restaurant pack

## Status

Accepted (implemented: `learning` mode, `quiz` phase, `kana-restaurant` pack, Unicode kana glyphs).

## Context

Spot It already races Shared and Tower modes with image packs ([ADR 0033](./0033-spot-it.md), [0034](./0034-spot-it-assets-and-card-ux.md)–[0036](./0036-spot-it-cyber-vehicles-pack.md)). Families also want a lightweight **Japanese kana drill**: same visual race, then confirm English meaning so the match sticks.

AI image packs mangle kana; restaurant vocabulary needs **crisp Unicode** glyphs and a Japanese webfont, not Magnific sheets.

## Decision

- **Mode:** Lobby `learning` alongside Shared / Tower. Uses the same **shared two-card** deal as `shared` (no tower hands).
- **Scoring:** Correct symbol tap does **not** score. Server enters **`quiz`** with the matched symbol. All players race to pick the correct English among **4** options (correct + 3 pack distractors, server-seeded). Wrong English → **2s** personal lock (`SPOT_IT_QUIZ_MISS_LOCK_MS`). First correct English scores and starts a **7s `between`** teach window (`SPOT_IT_LEARNING_BETWEEN_MS`; Shared/Tower stay at 3s).
- **Between UI:** Show matched kana + romaji syllable chips + English, then countdown.
- **Pack:** `kana-restaurant` — 57 restaurant / eating-out words (`kana`, `reading[]`, English `label`). Pack `kind: "kana"`; cards render text glyphs (Noto Sans JP), not `<img>`.
- **Gating:** Selecting Learning auto-selects `kana-restaurant` if the current pack is not kana. Host may only pick kana packs in Learning, and only image packs in Shared/Tower. Default pack for Shared/Tower remains `food`.
- **Protocol:** `tapQuizChoice { english }`; public quiz fields (`quizSymbolIndex`, `quizChoices`, `quizKana`, `quizReading`) and between teach fields (`lastMatchKana`, `lastMatchReading`, `lastMatchEnglish`).

## Consequences

- Phases become `lobby` → `playing` → (`quiz` when learning) → `between` → … → `results`.
- Image Magnific pipeline ([0034](./0034-spot-it-assets-and-card-ux.md), `docs/spot-it-magnific.md`) does **not** apply to kana packs.
- Extends [0033](./0033-spot-it.md). Client types / lobby filters / TV quiz mirror stay in sync with `worker/spot-it/`.
