# ADR 0046: Trivia audience packs

## Status

Accepted

## Context

Trivia shipped with a single general-knowledge board ([ADR 0043](./0043-trivia.md)). Living-room hosts want themed boards and clear age/party filters, similar to Scattergories’ kids / family / adult tiers ([ADR 0009](./0009-scattergories-and-game-shell.md)), plus a separate after-dark collection.

Jeopardy-shaped geometry (6×5 Single + 6×5 Double + Final, A–H choices) stays fixed. Bluey fan trivia is requested for kids; default spicy packs stay crude/party. Opt-in anything-goes NSFW packs are allowed behind a host warning ([ADR 0049](./0049-trivia-urban-dictionary-pack.md)).

## Decision

- **Audiences:** `kids` | `family` | `adult` | `spicy` — four collections, not nested under adult.
- **Packs:** themed packs per audience with ids `{audience}-{slug}` (e.g. `kids-bluey`, `family-movies`). Baseline was ten each; spicy may add opt-in packs beyond that count ([0049](./0049-trivia-urban-dictionary-pack.md)). Default pack: `family-classics` (migrated from the original `family` pack).
- **Lobby:** host picks audience pills, then pack pills filtered to that audience. Room state stores only `packId`; audience is derived from the pack. Explicit packs require a warning icon + confirm before selection ([0049](./0049-trivia-urban-dictionary-pack.md)).
- **Content boundaries:** Kids ~ages 6–10; Family all-ages; Adult mild party (pop culture, sports, R-ish media, no NSFW); default Spicy crude/dating/after-dark TV/party tone. Opt-in anything-goes packs may be explicit adult NSFW; never content involving minors ([0049](./0049-trivia-urban-dictionary-pack.md)).
- **Bluey:** dedicated kids pack with original fan-trivia questions. Living-room fan content; not licensed IP / not an official product.
- **Persistence:** legacy `packId: "family"` loads as `family-classics`.

## Consequences

- `TriviaPack` gains `audience`; pack id unions and labels expand in worker + client mirrors.
- Content lives under `worker/trivia/packs/{kids,family,adult,spicy}/`.
- Extends [0043](./0043-trivia.md); lobby vocabulary updated in `docs/screens.md`. Anything-goes Urban Dictionary pack: [0049](./0049-trivia-urban-dictionary-pack.md).
