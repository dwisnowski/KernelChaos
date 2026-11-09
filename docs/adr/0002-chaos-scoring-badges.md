# ADR 0002: Chaos scoring, badges, and SFX

## Status

Accepted

## Context

Classic Boggle length scoring (ADR 0001) made multiplayer rounds feel flat: shared words still paid full value, paths were discarded after validation, and there was little drama around first/last finds or inventive routes. KernelChaos aims for lively family play, so scoring should reward uniqueness, geometry, clutch timing, and board exploration while staying server-authoritative.

## Decision

- Replace classic length points with: 3→1, 4→2, 5→3, 6→4, then ramp 7→5 … 10+→8.
- Score formula: `(base × lineMult × uniqueMult) + flatBonuses`.
  - `lineMult` = 2 for a constant-step straight path (row / col / diagonal); otherwise 1 and a Snake flat +1.
  - `uniqueMult` = 2 when no other player found the same word (applied only at results).
  - Flats include last-10s Clutch (+1), speed ladder on global accepts 1/2/3 (+3/+2/+1), last word of the round (+4), rare letters Q/Z/X/J (+1 each), no-vowel Odd (+1), Center (+1), Span (+2), Thief (+2 when stealing a shared word in the last 15s).
- Round awards: Lone wolf (+5 if sole player with any ≥6-letter word) and Coverage (+1 per distinct cell used across your paths).
- Persist full `WordRecord` (word, path, timestamps, base, bonuses, points) on the Durable Object so hibernation does not drop geometry or provisional scores.
- Live scores are provisional (omit unique / last / lone wolf / coverage). Finalize once when entering results.
- Each `BonusId` has a short badge label and a distinct Web Audio cue; the client plays up to three highest-priority cues per event so stacks stay readable.
- Shared words still score base (not classic cancel); they only miss the Solo 2×.

## Consequences

- Results UI shows per-word badges and round awards; families need a one-line legend to learn the chaos rules.
- Path retention slightly increases DO storage per round; acceptable for family session sizes.
- Provisional → final score jumps at round end are intentional; clients refresh word chips from results.
- Supersedes classic length scoring and independent-only uniqueness described in ADR 0001 for Boggle play.
- Code anchors: `worker/boggle/scoring.ts`, `worker/room.ts`, `src/audio/sfx.ts`, `src/components/BonusBadges.tsx`, `src/pages/BoggleRoom.tsx`.
