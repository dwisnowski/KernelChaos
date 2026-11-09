# Agent notes — KernelChaos

Short orientation for AI coding agents. Humans should start with [`readme.md`](./readme.md).

## What this is

Vite + React + TypeScript family-games SPA on Cloudflare Workers at `kernelchaos.wildideazone.com`. First game: multiplayer Boggle with Durable Object rooms, drag-to-select letters, QR join, and phone+TV layouts.

## Read before changing architecture

1. [`docs/README.md`](./docs/README.md) — ADR index
2. Relevant files under [`docs/adr/`](./docs/adr/)
3. Workspace rules under [`.cursor/rules/`](./.cursor/rules/) (ADRs for architecture plans; Wild Idea Zone branding)

When a change records a product or architecture decision: add/update `docs/adr/NNNN-slug.md` (**Status**, **Context**, **Decision**, **Consequences**) and update the index in `docs/README.md`. Do not treat `.cursor/plans/` as project documentation.

## Repo map

| Path | Role |
| --- | --- |
| `src/` | React SPA (home, Boggle entry/room, board, audio) |
| `worker/index.ts` | Worker fetch; room create; WS proxy |
| `worker/room.ts` | `GameRoom` Durable Object |
| `worker/boggle/` | Dice, path, scoring, dictionary |
| `docs/adr/` | Architecture Decision Records |
| `Makefile` | Canonical local commands |

## Non-negotiables

- Preserve Wild Idea Zone logo, favicon, footer credit, and `og:site_name`.
- Server remains authoritative for board, clock, word validity, and scores.
- No accounts / cloud user profiles in current architecture.
- Prefer MIT-compatible, small diffs; avoid unrelated refactors.

## Local verify (required before claiming done)

```bash
make install   # if deps missing
make lint
make build
make run       # manual smoke of the touched flow
```

There is **no** unit/e2e suite. After code changes, describe the manual smoke you expect.

Do **not** `make deploy` unless the user explicitly asks — except when the `ship-plan-adr` skill applies after a plan execution that wrote an ADR.
