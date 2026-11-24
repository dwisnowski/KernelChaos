# ADR 0049: Trivia Urban Dictionary anything-goes pack

## Status

Accepted

## Context

Spicy Trivia packs under [ADR 0046](./0046-trivia-audience-packs.md) stayed crude/party and explicitly not pornographic. Hosts asked for an opt-in **Urban Dictionary**-style board: x-rated slang definition trivia (sex, body, drugs, insults, internet vernacular). Urban Dictionary itself is copyrighted; we cannot scrape, call an API, or paste verbatim entries.

Living-room play still needs a clear host gate so someone cannot silently flip the room onto NSFW content that also appears on the TV.

## Decision

- Add spicy pack id **`spicy-urban-dictionary`** (lobby label **Urban Dictionary**): static, **original** A–H MCQs about adult slang meanings. Inspired by the *kind* of slang people look up — not licensed UD content.
- **Anything-goes for adults** in this pack: explicit language and sexual/drug/insult definitions are allowed. **Hard floor:** never content involving minors / CSAM.
- Amends [0046](./0046-trivia-audience-packs.md): Spicy may include opt-in anything-goes packs; pack count is not a hard “10 per audience” (spicy gains this 11th pack). Other spicy packs keep their existing tone unless separately changed.
- **Lobby gate:** packs in `TRIVIA_EXPLICIT_PACK_IDS` show a warning icon on the pack pill; selecting one (when not already active) requires a host confirmation dialog explaining NSFW risk (phones + TV, 18+). Confirm then sends `setTriviaPack`; Cancel leaves the current pack. No second gate on Start.

## Consequences

- New board under `worker/trivia/packs/spicy/urban-dictionary.ts`; ids mirrored in worker `protocol.ts` and `src/triviaTypes.ts`.
- `TriviaLobby` warning + confirm UX; light CSS for icon / popover.
- Extends [0046](./0046-trivia-audience-packs.md); lobby note in `docs/screens.md`.
