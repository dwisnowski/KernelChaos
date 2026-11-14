# Docs

Architecture decisions and project notes for KernelChaos.

## Contributing

- [Agent notes](../AGENTS.md) — repo map, non-negotiables, verify checklist (AI coding agents)
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
- [0011 – Scattergories letter die roll](adr/0011-scattergories-letter-die-roll.md) — Rolling phase; random roller; classic 20-face WebGL icosahedron; live pose mirror; ≤5s settle; AFK server fallback
- [0012 – Active room directory + empty-room teardown](adr/0012-active-room-directory.md) — Join-first entry; D1 open-lobby list; ~30s empty grace then clear DO storage / free code
- [0013 – Player seat resume after spectator](adr/0013-player-seat-resume.md) — `resumeId` + private `myWords`/`myAnswers` on welcome so spectator → player keeps entries
- [0014 – M&Ms Smash two-player orb duel](adr/0014-mmmms.md) — Exactly two seats; 12/20/30 orbs; organize → guess → attack; hidden stacks; inclusive explode path; correct-guess 50% halt saves; particle bursts
- [0015 – M&Ms Smash Web Audio cues](adr/0015-mmmms-sfx.md) — Synthesized `playMmmms*` helpers; smash sting + per-step explode/halt; win vs defeat on phone; TV winner flourish
- [0016 – M&Ms Smash organize drag UX](adr/0016-mmmms-organize-ux.md) — Solo organize board; scrollable full stack; long-press floating ghost + edge auto-scroll; centered orb rows
- [0017 – M&Ms Smash guess/attack UX](adr/0017-mmmms-guess-attack-ux.md) — Palette-only pick phases; select-then-submit; role-specific resolve boards; Blocked / Go Fish overlays on phone + TV; `colorInStack` (pick layout superseded by [0018](adr/0018-mmmms-combat-hanging-threads.md))
- [0018 – M&Ms Smash combat hanging threads](adr/0018-mmmms-combat-hanging-threads.md) — Dual silk orb canvas in combat; left action prompt; `@dnd-kit` organize handles; TV anonymous threads
- [0019 – Scattergories Picture Hunt](adr/0019-scattergories-picture-hunt.md) — Lobby Categories vs Hunt; curated scene synonym keys; skip review; shared letter die + 120/150/180 timers
- [0020 – Picture Hunt scene authoring](adr/0020-hunt-scene-authoring.md) — Metadata-first JSON catalogs; ≥250 objects; ≥10 findable objectIds per die letter; coverage script + generate/verify loop
