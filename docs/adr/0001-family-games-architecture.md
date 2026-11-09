# ADR 0001: Family games hub + multiplayer Boggle architecture

## Status

Accepted (implemented: Vite/React SPA on Cloudflare Workers at `kernelchaos.wildideazone.com`, Durable Object game rooms, drag-to-select Boggle with 4×4/5×5/6×6 boards, Web Audio SFX, phone+TV responsive shell, Wild Idea Zone hub listing).

## Context

KernelChaos is a Wild Idea Zone site for family games played across the internet. The first game is Boggle-like: one shared board and clock, short join codes, names only (no accounts), phones as the primary play surface, and the host often displaying the lobby on a TV.

Constraints that shaped the design:

- Players are on different networks, so the board, timer, and scores must be server-authoritative.
- Join friction must stay low: a 4-character code (`A–Z`, `1–9`) plus a QR deep link.
- Touch input should feel like classic Boggle (drag adjacent letters), not typing.
- The same web app must read well on a phone and on a large living-room display.

## Decision

- **Host as a Wild Idea Zone SPA** at `kernelchaos.wildideazone.com` (Vite + React + TypeScript, Cloudflare Workers via `@cloudflare/vite-plugin` + Wrangler), with WIZ logo, footer, favicon, hub listing, ADRs under `docs/adr/`, and Music Mind–style `Makefile` / ship workflow.
- **One Durable Object per room code** (`GameRoom`) with hibernatable WebSockets for lobby sync, countdown, play, and results. The Worker creates rooms (`POST /api/rooms`) and proxies `/api/room/:code` upgrades to the DO.
- **Boggle rules:** host picks board size 4 / 5 / 6 in the lobby; classic dice sets (extended for 6×6); 3-minute rounds; min word length 3; classic length scoring; each player scores their own unique words independently; host starts rounds.
- **Client proposes paths; server validates** adjacency, dictionary membership, duplicates, and points. Dictionary is an Enable1-derived list (3–10 letters) bundled in the Worker.
- **UX:** mobile-first drag board; responsive lobby with large code + QR for TV; Web Audio length-tiered word SFX, countdown ticks, last-5-second urgency, results flourish; persistent mute.
- **No accounts** — display name + room code only.

## Consequences

- Family sessions work from any browser with WebSockets; no app install.
- Room state lives in the DO (persisted + alarms for countdown/round end); empty or abandoned codes may still occupy DO names until eviction/reuse policy evolves.
- Dictionary size affects Worker bundle size; Enable1 trim is acceptable for MVP but may need compression later.
- TV “display mode” is CSS breakpoints, not a separate spectator role — the host can still play from the TV browser if desired.
- Code anchors: `worker/room.ts`, `worker/boggle/`, `src/pages/BoggleRoom.tsx`, `src/components/BoggleBoard.tsx`, `src/audio/sfx.ts`, `wrangler.jsonc`.
