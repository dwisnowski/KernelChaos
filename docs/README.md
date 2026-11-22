# Docs

Architecture decisions and project notes for KernelChaos.

## Contributing

- [Agent notes](../AGENTS.md) — repo map, non-negotiables, verify checklist (AI coding agents)
- [Screen reference](./screens.md) — URL routes, in-room phases, chat shorthand
- [Picture Hunt Magnific MCP](./hunt-magnific.md) — Creative/Precision upscale via Magnific MCP; vision-check catalogs after art
- [Spot It Magnific packs](./spot-it-magnific.md) — 4-up symbol sheets → masters + 192² game rasters (ADR 0034)
- [README](../readme.md) — features, develop, deploy

## Architecture Decision Records

- [0001 – Family games architecture](adr/0001-family-games-architecture.md) — Wild Idea Zone SPA; Workers + Durable Object rooms; Boggle-first hub; drag paths; phone+TV shell; Web Audio SFX; no accounts
- [0002 – Chaos scoring, badges, and SFX](adr/0002-chaos-scoring-badges.md) — Length ramp + path/unique multipliers + flat/round awards; badge pills; per-bonus Web Audio cues; provisional then final scores
- [0003 – TV spectator screen](adr/0003-tv-spectator-screen.md) — Spectator WS role; `/tv` display with word counts + anonymous badge feed; score-blind central TV
- [0004 – Results length pies and missed-word cloud](adr/0004-results-length-pies-missed-cloud.md) — Board solver at results; per-player length donuts on phone+TV; TV missed-word cloud (score-blind)
- [0005 – TV post-game scores](adr/0005-tv-post-game-scores.md) — Results on TV show winner + points; play stays score-blind
- [0006 – Boggle global stats](adr/0006-boggle-global-stats.md) — D1 hall of fame on `/boggle`; round-end snapshots; name + date records; no accounts
- [0007 – Spectator room entry](adr/0007-spectator-room-entry.md) — Create for TV / Spectate on TV from entry; no name; first player remains host
- [0008 – Results word coverage](adr/0008-results-word-coverage.md) — Board `possibleWordCount` + by-length; phone found-vs-possible bars; TV possible-by-length chart
- [0009 – Scattergories + game shell](adr/0009-scattergories-and-game-shell.md) — Polymorphic rooms; TV/player + QR/code + SFX as shared shell; original family/kids/adult packs; review-phase scoring
- [0010 – Scattergories review voting](adr/0010-scattergories-review-voting.md) — Batch In/Out ballots per category; majority rejects; TV shows pending voters; host Next gated on full ballot
- [0011 – Scattergories letter die roll](adr/0011-scattergories-letter-die-roll.md) — Rolling phase; random roller; classic 20-face Canvas 2D icosahedron; live pose mirror; ≤5s settle; AFK server fallback
- [0012 – Active room directory + empty-room teardown](adr/0012-active-room-directory.md) — Join-first entry; D1 open-lobby list; ~30s empty grace then clear DO storage / free code
- [0013 – Player seat resume after spectator](adr/0013-player-seat-resume.md) — `resumeId` + private `myWords`/`myAnswers` on welcome so spectator → player keeps entries
- [0014 – M&Ms Smash two-player orb duel](adr/0014-mmmms.md) — Exactly two seats; 12/20/30 orbs; organize → guess → attack; hidden stacks; inclusive explode path; correct-guess 50% halt saves; particle bursts
- [0015 – M&Ms Smash Web Audio cues](adr/0015-mmmms-sfx.md) — Synthesized `playMmmms*` helpers; smash sting + per-step explode/halt; win vs defeat on phone; TV winner flourish
- [0016 – M&Ms Smash organize drag UX](adr/0016-mmmms-organize-ux.md) — Solo organize board; scrollable full stack; long-press floating ghost + edge auto-scroll; centered orb rows
- [0017 – M&Ms Smash guess/attack UX](adr/0017-mmmms-guess-attack-ux.md) — Palette-only pick phases; select-then-submit; role-specific resolve boards; Blocked / Go Fish overlays on phone + TV; `colorInStack` (pick layout superseded by [0018](adr/0018-mmmms-combat-hanging-threads.md))
- [0018 – M&Ms Smash combat hanging threads](adr/0018-mmmms-combat-hanging-threads.md) — Dual silk orb canvas in combat; left action prompt; `@dnd-kit` organize handles; TV anonymous threads
- [0019 – Scattergories Picture Hunt](adr/0019-scattergories-picture-hunt.md) — Lobby Categories vs Hunt; curated scene synonym keys; skip review; shared letter die + 120/150/180 timers
- [0020 – Picture Hunt scene authoring](adr/0020-hunt-scene-authoring.md) — Metadata-first JSON catalogs; ≥250 objects; ≥10 findable objectIds per die letter; coverage script + generate/verify loop
- [0021 – Picture Hunt find feedback + boxes](adr/0021-hunt-find-feedback-and-boxes.md) — Green/red flash + SFX; personal remaining rail; normalized metadata boxes on results review
- [0022 – Host skip review voter](adr/0022-host-skip-review-voter.md) — Host Pass on pending review voters; empty ballot unblocks majority without inventing In/Out
- [0023 – TV results board word explorer](adr/0023-tv-results-board-word-explorer.md) — Full `possibleWords`; TV keeps board; length bars open word list; click word to highlight path
- [0024 – App color palette settings](adr/0024-app-color-palettes.md) — `/settings` with 5 presets + custom chrome tokens; localStorage; game pieces unchanged
- [0025 – Undefined Boggle words queue](adr/0025-undefined-boggle-words-queue.md) — D1 Free Dictionary misses; TV notice; ungated Settings Admin list; cleanup skill + make prompt
- [0026 – Layout-first Hunt scenes + boxes](adr/0026-hunt-layout-first-boxes.md) — Sticker-board experiment for ground-truth boxes (superseded for shipped art by [0027](adr/0027-hunt-hidden-object-art.md))
- [0027 – Hunt hidden-object art](adr/0027-hunt-hidden-object-art.md) — Restore dense seek-and-find illustrations; boxes only when visually authored; no fake placeholders
- [0028 – Hunt click-annotate + peer review](adr/0028-hunt-click-annotate-review.md) — Private pins on scene; playing→review; letter + In/Out; 1 pt unique accepted finds
- [0029 – Spot the Difference (procedural)](adr/0029-spot-the-difference.md) — `spotdiff` rooms; race/coop/solo; procedural SVG A/B panels; server hit-test + timer
- [0030 – Spot the Difference scene difficulty](adr/0030-spotdiff-scene-difficulty.md) — Lobby easy/medium/hard clutter density; current templates = easy
- [0031 – Picture Hunt magnifying-glass loupe](adr/0031-hunt-magnifying-glass.md) — Optional player-only loupe during hunt play; pins still click-annotate
- [0032 – Picture Hunt desktop loupe + mobile pinch](adr/0032-hunt-mobile-pinch-annotate.md) — 15rem loupe on desktop; touch pinch-zoom + temp marker → overlay; maximized viewport
- [0033 – Spot It](adr/0033-spot-it.md) — `spot-it` rooms; Shared + Tower; order-7 deck; Funny Foods pack; race to lobby target
- [0034 – Spot It assets + card UX](adr/0034-spot-it-assets-and-card-ux.md) — masters vs 192² public; 4-up Magnific pipeline; large square cards; 360° / ±30% layout
- [0035 – Spot It Kawaii Animals pack](adr/0035-spot-it-kawaii-animals-pack.md) — lobby pack `kawaii`; Magnific 4-up animals; required seagull/rabbit/cat/dog/horse/lizard/raccoon
- [0036 – Spot It Cyber Vehicles pack](adr/0036-spot-it-cyber-vehicles-pack.md) — lobby pack `cyber`; anime cyberpunk vehicle 4-ups
- [0037 – Spot It kana Learning mode](adr/0037-spot-it-kana-learning.md) — `learning` + `quiz`; Restaurant Kana pack; Unicode glyphs (not Magnific)
- [0038 – Spot It Shopping Kana pack](adr/0038-spot-it-kana-shopping-pack.md) — lobby pack `kana-shopping`; tourist retail vocab
- [0039 – Chaos Wheel](adr/0039-chaos-wheel.md) — `wheel` rooms; puzzle show; Canvas 2D + anime.js spin; host rounds 3/5/7; original family pack
