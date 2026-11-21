# Screen reference

Shared names for KernelChaos pages and in-room phases. Use these in chat so humans and agents point at the same UI.

React Router (`BrowserRouter` in `src/main.tsx`, routes in `src/App.tsx`) already owns URL navigation. In-room **phases** are server state (`state.phase` over WebSocket), not URL segments — one room URL hosts every phase for that seat.

Games: `boggle` | `scattergories` | `mmmms` | `spotdiff` | `spot-it`. Picture Hunt is Scattergories with `playMode: "hunt"` (same URLs).

## URL routes

| Path | Component | File | Role |
| --- | --- | --- | --- |
| `/` | `Home` | `src/pages/Home.tsx` | Game picker |
| `/settings` | `Settings` | `src/pages/Settings.tsx` | Color palettes (presets + custom) + ungated Admin undefined-word queue |
| `/boggle` | `BoggleEntry` | `src/pages/BoggleEntry.tsx` | Create / join / spectate |
| `/boggle/join?code=` | `BoggleEntry` | same | QR / deep-link join |
| `/boggle/room/:code` | `BoggleRoom` | `src/pages/BoggleRoom.tsx` | Player |
| `/boggle/room/:code/tv` | `BoggleSpectator` | `src/pages/BoggleSpectator.tsx` | TV |
| `/scattergories` | `ScattergoriesEntry` | `src/pages/ScattergoriesEntry.tsx` | Create / join / spectate |
| `/scattergories/join?code=` | `ScattergoriesEntry` | same | QR / deep-link join |
| `/scattergories/room/:code` | `ScattergoriesRoom` | `src/pages/ScattergoriesRoom.tsx` | Player |
| `/scattergories/room/:code/tv` | `ScattergoriesSpectator` | `src/pages/ScattergoriesSpectator.tsx` | TV |
| `/mmmms` | `MmmmsEntry` | `src/pages/MmmmsEntry.tsx` | Create / join / spectate |
| `/mmmms/join?code=` | `MmmmsEntry` | same | QR / deep-link join |
| `/mmmms/room/:code` | `MmmmsRoom` | `src/pages/MmmmsRoom.tsx` | Player |
| `/mmmms/room/:code/tv` | `MmmmsSpectator` | `src/pages/MmmmsSpectator.tsx` | TV |
| `/spotdiff` | `SpotdiffEntry` | `src/pages/SpotdiffEntry.tsx` | Create / join / spectate |
| `/spotdiff/join?code=` | `SpotdiffEntry` | same | QR / deep-link join |
| `/spotdiff/room/:code` | `SpotdiffRoom` | `src/pages/SpotdiffRoom.tsx` | Player |
| `/spotdiff/room/:code/tv` | `SpotdiffSpectator` | `src/pages/SpotdiffSpectator.tsx` | TV |
| `/spot-it` | `SpotItEntry` | `src/pages/SpotItEntry.tsx` | Create / join / spectate |
| `/spot-it/join?code=` | `SpotItEntry` | same | QR / deep-link join |
| `/spot-it/room/:code` | `SpotItRoom` | `src/pages/SpotItRoom.tsx` | Player |
| `/spot-it/room/:code/tv` | `SpotItSpectator` | `src/pages/SpotItSpectator.tsx` | TV |

Pattern shorthand: `/{game}`, `/{game}/join?code=`, `/{game}/room/:code`, `/{game}/room/:code/tv`.

## In-room phases (not URL segments)

### Boggle

`Phase` in `src/types.ts`: `lobby` → `countdown` → `playing` → `results`

| Phase | Player | TV |
| --- | --- | --- |
| `lobby` | Lobby (size, timer, start, QR) | Lobby / waiting |
| `countdown` | Get ready | Same |
| `playing` | Drag board | Board + live counts |
| `results` | Scores / bonuses | Board + scores; tap length bars for word list / path highlight |

### Scattergories (+ Picture Hunt)

`ScatterPhase` in `src/scatterTypes.ts`: `lobby` → `rolling` → `countdown` → `playing` → `review` → `results`

Mode: `playMode: "categories" | "hunt"` (lobby toggle; not a URL).

| Phase | Categories | Hunt |
| --- | --- | --- |
| `lobby` | Pack / mode / timer | Scene picker when hunt |
| `rolling` | Letter die | Same |
| `countdown` | Letter shown | Letter + scene title |
| `playing` | Category form | Scene click-to-pin + private finds |
| `review` | Per-category votes | All pins revealed; single In/Out ballot |
| `results` | Scoreboard | Scoreboard + accepted finds |

TV mirrors the same phases (`ScattergoriesSpectator.tsx`).

### M&Ms Smash

`MmmmsPhase` in `src/mmmmsTypes.ts`: `lobby` → `organize` → `guess` → `attack` → `resolving` → `results`

| Phase | Player UI |
| --- | --- |
| `lobby` | Lobby (orb count, start) |
| `organize` | Reorder orbs, submit |
| `guess` | Defender picks color (else wait) |
| `attack` | Attacker picks color (else wait) |
| `resolving` | Burst FX + explode counts |
| `results` | Winner + play again |

`guess` | `attack` | `resolving` are often called **combat** together. TV shows the same phases without local controls.

### Spot the Difference

`SpotdiffPhase` in `src/spotdiffTypes.ts`: `lobby` → `countdown` → `playing` → `results`

Mode: `spotMode: "race" | "coop" | "solo"` (lobby pills).
Difficulty: `difficulty: "easy" | "medium" | "hard"` (lobby pills; scene clutter).

| Phase | Player | TV |
| --- | --- | --- |
| `lobby` | Mode / timer / diffs / difficulty, QR, start | Lobby / waiting |
| `countdown` | Get ready | Same |
| `playing` | Dual SVG panels; tap diffs; hint | Panels + progress (race: counts; coop: shared marks) |
| `results` | All circles + scores | Same |

### Spot It

`SpotItPhase` in `src/spotItTypes.ts`: `lobby` → `playing` → `between` → `results`

Mode: `spotItMode: "shared" | "tower"` (lobby pills). Distinct from Spot the Difference (`spotdiff`).

| Phase | Player | TV |
| --- | --- | --- |
| `lobby` | Mode / target / pack, QR, start | Lobby / waiting + QR |
| `playing` | Cards + tap matching symbol | Cards + leaderboard |
| `between` | 3s countdown + who scored | Same |
| `results` | Winner + scores | Same |

## Chat shorthand

Prefer route + phase (and mode when needed):

| Say | Means |
| --- | --- |
| home | `/` |
| settings / colors | `/settings` |
| boggle entry / scatter entry / mmmms entry | `/{game}` |
| boggle join | `/boggle/join?code=` |
| boggle room lobby | `/boggle/room/:code` + `phase=lobby` |
| boggle TV results | `/boggle/room/:code/tv` + `phase=results` |
| scatter room review | `/scattergories/room/:code` + `phase=review` |
| hunt play | `/scattergories/room/:code` + `playMode=hunt` + `phase=playing` (desktop Magnify loupe; touch pinch + temp mark) |
| mmmms organize | `/mmmms/room/:code` + `phase=organize` |
| mmmms TV combat | `/mmmms/room/:code/tv` + `guess` \| `attack` \| `resolving` |
| spotdiff entry | `/spotdiff` |
| spotdiff room playing | `/spotdiff/room/:code` + `phase=playing` |
| spotdiff TV results | `/spotdiff/room/:code/tv` + `phase=results` |
| spot-it entry | `/spot-it` |
| spot-it room playing | `/spot-it/room/:code` + `phase=playing` |
| spot-it TV between | `/spot-it/room/:code/tv` + `phase=between` |

## Related

- Routes: `src/App.tsx`
- Game shell ADR: [0009](./adr/0009-scattergories-and-game-shell.md)
- TV spectator: [0003](./adr/0003-tv-spectator-screen.md), [0007](./adr/0007-spectator-room-entry.md)
