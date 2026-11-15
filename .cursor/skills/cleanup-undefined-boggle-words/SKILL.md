---
name: cleanup-undefined-boggle-words
description: >-
  Remove Boggle dictionary words that Free Dictionary marked missing (queued in
  D1 / Admin Settings). Use when the user pastes the make undef-words-cleanup-prompt
  text, asks to clean up undefined Boggle words, or to purge the undefined-word queue
  from production into worker/boggle/words.ts.
---

# Cleanup undefined Boggle words

## When this applies

The TV word explorer records Free Dictionary **missing** hits into D1
(`undefined_boggle_words`, ADR 0025). Run this skill when the user asks to clean
that queue out of the Enable1 word list, or pastes the prompt from
`make undef-words-cleanup-prompt`.

## Workflow

```
Cleanup progress:
- [ ] 1. Fetch queue from production
- [ ] 2. Remove words from WORD_LIST
- [ ] 3. Delete processed D1 rows
- [ ] 4. Lint + build
- [ ] 5. Commit, push, deploy
- [ ] 6. Report counts / URLs
```

### 1. Fetch queue

Prefer the public API:

```bash
curl -sS https://kernelchaos.wildideazone.com/api/boggle/undefined-words
```

Response shape: `{ words: string[], entries: { word, reportCount, firstSeenAt }[] }`.

Fallback (Wrangler):

```bash
npx wrangler d1 execute kernelchaos-stats --remote --json --command "SELECT word FROM undefined_boggle_words ORDER BY word"
```

If the list is empty, stop and tell the user — do not commit an empty cleanup.

### 2. Remove from word list

Dictionary lives in `worker/boggle/words.ts` as a template literal with `\n`-escaped separators (not a JSON file). **Do not** hand-edit the ~1 MB line.

```bash
npm run boggle:remove-words -- $(curl -sS https://kernelchaos.wildideazone.com/api/boggle/undefined-words | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>console.log(JSON.parse(s).words.join(' ')))")
```

Or write words to a temp file and:

```bash
npm run boggle:remove-words -- --file /tmp/undef-words.txt
```

### 3. Clear D1 rows

After a successful file update, delete only the words you removed:

```bash
npx wrangler d1 execute kernelchaos-stats --remote --command "DELETE FROM undefined_boggle_words WHERE word IN ('word1','word2',...)"
```

Batch if the list is long. Confirm Admin `/settings` list is empty (or reduced) afterward if practical.

### 4. Verify

```bash
make lint
make build
```

### 5. Ship

Commit (include the words.ts change; message like `Remove undefined Free Dictionary misses from Boggle word list`), push `main`, then `npm run deploy` (or `make deploy`). This skill authorizes commit / push / deploy for this cleanup only.

### 6. Report

Word count removed, commit hash, deploy version / URL.
