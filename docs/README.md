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
