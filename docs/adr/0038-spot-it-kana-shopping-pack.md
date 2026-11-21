# ADR 0038: Spot It Shopping Kana pack

## Status

Accepted (implemented: lobby pack `kana-shopping`, 57 tourist shopping words, Unicode glyphs).

## Context

Learning mode ([ADR 0037](./0037-spot-it-kana-learning.md)) already ships Restaurant Kana. Tourists also need retail vocabulary: stores, money, sizes, souvenirs, and common buy/show phrases. Same constraints as restaurant: order-7 deck needs **57** symbols; AI image packs mangle kana, so glyphs stay Unicode text.

## Decision

- **Pack id:** `kana-shopping` (lobby label **Shopping Kana**).
- **Kind:** `kana` — cards render `kana` + Noto Sans JP; no Magnific / no `public/spot-it/kana-shopping/` assets.
- **Content:** 57 tourist shopping / retail words (`kana`, `reading[]`, English `label`), unique English labels within the pack for quiz distractors.
- **Gating:** Appears only in Learning (existing `isKanaPack` filter). Default Learning pack remains `kana-restaurant`.

## Consequences

- `SpotItPackId` / lobby pills include `kana-shopping`.
- Client helpers look up kana packs via a shared entries map (restaurant + shopping).
- Extends [0037](./0037-spot-it-kana-learning.md) and [0033](./0033-spot-it.md). Magnific pipeline ([0034](./0034-spot-it-assets-and-card-ux.md)) still does not apply.
