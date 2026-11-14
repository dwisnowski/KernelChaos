# ADR 0016: M&Ms Smash organize drag UX

## Status

Accepted (organize solo board + scrollable stack still apply; long-press ghost drag superseded by `@dnd-kit` row handles in [0018](./0018-mmmms-combat-hanging-threads.md)).

## Context

During `organize`, players must reorder private stacks of 12–20–30 orbs. The first phone UI used immediate pointer capture with `touch-action: none`, so the list could not scroll; drag feedback only dimmed the source row in place; and the opponent’s anonymous `HiddenOrbStack` sat beside the player’s board, stealing vertical space. Tall stacks made top/bottom orbs unreachable, and the dragged orb was hard to track under a finger.

Server secrecy was already correct ([ADR 0014](./0014-mmmms.md)): opponent colors never leave the Durable Object. The gap was client layout and interaction.

## Decision

- **Solo organize board:** On the player phone, hide the opponent stack UI entirely while `phase === "organize"`. HUD still shows opponent name and remaining count. Pick/resolve phone layouts after organize are defined in [0017](./0017-mmmms-guess-attack-ux.md). TV spectator continues to show both count-only hidden stacks.
- **Full stack via scroll:** Interactive lists use `touch-action: pan-y` so the entire bottom→top stack is reachable. Organize uses a taller max height (`min(70dvh, 720px)`); overflow remains `auto`.
- **Centered rows:** Orb rows use `justify-content: center` so bead + label read as a centered column.
- **Long-press drag:** ~180ms press lifts an orb; movement beyond ~8px before lift cancels into native scroll. Lift shows a fixed floating ghost (full color, slight scale) and a hollow placeholder in the source slot. Drop target highlighting and edge auto-scroll (~40px zones) move the list while dragging so off-screen slots are reachable. No drag SFX ([ADR 0015](./0015-mmmms-sfx.md)).

## Consequences

- Organize UX lives in `OrbList` + `MmmmsRoom` CSS; protocol and server reorder/`submitOrder` unchanged.
- Players must discover “hold to drag”; hint copy on the organize board covers that.
- Cross-links: extends [0014](./0014-mmmms.md); SFX policy [0015](./0015-mmmms-sfx.md); superseded for guess/attack layout by [0017](./0017-mmmms-guess-attack-ux.md); organize drag mechanics superseded by [0018](./0018-mmmms-combat-hanging-threads.md).
