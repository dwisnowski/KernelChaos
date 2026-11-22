# ADR 0046: Trivia audience packs

## Status

Accepted

## Context

Trivia shipped with a single general-knowledge board ([ADR 0043](./0043-trivia.md)). Living-room hosts want themed boards and clear age/party filters, similar to Scattergories’ kids / family / adult tiers ([ADR 0009](./0009-scattergories-and-game-shell.md)), plus a separate after-dark collection.

Jeopardy-shaped geometry (6×5 Single + 6×5 Double + Final, A–H choices) stays fixed. Bluey fan trivia is requested for kids; spicy party content must stay crude/party-appropriate without explicit sexual content.

## Decision

- **Audiences:** `kids` | `family` | `adult` | `spicy` — four collections, not nested under adult.
- **Packs:** ten themed packs per audience (40 total). Pack ids are `{audience}-{slug}` (e.g. `kids-bluey`, `family-movies`). Default pack: `family-classics` (migrated from the original `family` pack).
- **Lobby:** host picks audience pills, then pack pills filtered to that audience. Room state stores only `packId`; audience is derived from the pack.
- **Content boundaries:** Kids ~ages 6–10; Family all-ages; Adult mild party (pop culture, sports, R-ish media, no NSFW); Spicy crude/dating/after-dark TV/party tone — not pornographic.
- **Bluey:** dedicated kids pack with original fan-trivia questions. Living-room fan content; not licensed IP / not an official product.
- **Persistence:** legacy `packId: "family"` loads as `family-classics`.

## Consequences

- `TriviaPack` gains `audience`; pack id unions and labels expand in worker + client mirrors.
- Content lives under `worker/trivia/packs/{kids,family,adult,spicy}/`.
- Extends [0043](./0043-trivia.md); lobby vocabulary updated in `docs/screens.md`.
