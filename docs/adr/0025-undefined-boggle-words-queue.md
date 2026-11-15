# ADR 0025: Undefined Boggle words queue

## Status

Accepted

## Context

TV results word explorer (ADR 0023) looks up Free Dictionary glosses for board words. Some Enable1 entries (e.g. `duit`) return no definition. Families see those as junk; we want a lightweight queue of misses so a later cleanup can drop them from `worker/boggle/words.ts` without baking third-party definitions into the server.

## Decision

- When the client gets a Free Dictionary **missing** result (not a transport/error), fire-and-forget `POST /api/boggle/undefined-words` with the word. The Worker accepts only words already in our dictionary and upserts into D1 table `undefined_boggle_words` (`word` PK, `first_seen_at`, `report_count`).
- TV results copy states the word was recorded and will be removed in a future release.
- Ungated **Admin** section on `/settings` lists the queue via `GET /api/boggle/undefined-words` (no roles or passwords).
- Cleanup is an agent skill (`.cursor/skills/cleanup-undefined-boggle-words/`) driven by `make undef-words-cleanup-prompt`; a script removes entries from the Enable1 TS template string, then rows are deleted from prod D1 and the app is redeployed.

## Consequences

- Extends ADR 0023 and ADR 0006’s D1 usage; migrations under `migrations/0003_undefined_boggle_words.sql`.
- Public POST/GET for the queue is acceptable: only dictionary words can be stored; list is low sensitivity.
- False Free Dictionary misses can still queue valid English words — cleanup is intentional and reversible only via git history / re-adding to the list.
- Code anchors: `worker/boggle/undefinedWords.ts`, `worker/index.ts`, `src/lib/reportUndefinedWord.ts`, `src/hooks/useWordDefinition.ts`, `src/pages/BoggleSpectator.tsx`, `src/pages/Settings.tsx`, `scripts/remove-boggle-words.ts`, `.cursor/skills/cleanup-undefined-boggle-words/SKILL.md`.
