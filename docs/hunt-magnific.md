# Picture Hunt — Magnific scene generation

Repo-owned prompts drive dense seek-and-find JPGs under `public/hunt/`. Scenes are **image-only** (no answer key); play scores via peer In/Out ([ADR 0028](./adr/0028-hunt-click-annotate-review.md), [ADR 0041](./adr/0041-hunt-scene-prompt-pipeline.md)).

## Prompt library

| Path | Role |
| --- | --- |
| `assets/hunt/prompts/style.md` | Shared ink + watercolor seek-and-find bible |
| `assets/hunt/prompts/scenes/<id>.md` | Scene foundation + lore-local object weave + avoids |
| `npm run hunt:prompt -- <id>` | Prints composed Magnific prompt to stdout |

Catalog: **50** scene foundations under `assets/hunt/prompts/scenes/` (pilots `space-port`, `beach-chaos`, `castle-transylvania`, plus 47 more). List with `npm run hunt:prompt -- --list`.

Lobby groups scenes into **themed packs** (`worker/scattergories/hunt/packs.ts`, [ADR 0042](./adr/0042-hunt-themed-packs.md)): host picks a pack; each round randomly selects an unused scene from that pack.

## Tool chain (generate)

1. `magnific_start` — confirm plan / credits.
2. `folders_list` — Hunt / KernelChaos project; pass `folderReference` on every later call.
3. `simulate_cost` for `images_generate` with the composed prompt.
4. `images_generate` — aspect ~`4:3` or `3:2`, ~2k, `count: 1`. Do not re-queue while waiting.
5. `creations_wait` until terminal.
6. `creations_read` (`hq: "medium"`) — judge density and lore fit with the user.
7. Export: `creations_register_download` + download URL → `public/hunt/<id>.jpg` (JPEG quality ~80; longest side ~2304).

Optional densify: Creative upscale (`images_upscale`) only if an approved base is sparse — keep resemblance high so layout does not drift.

## Runtime wiring

After export, ensure `worker/scattergories/hunt/data/<id>.json` exists with `id`, `title`, `imageUrl: "/hunt/<id>.jpg"` and is imported from `scenes.ts`. No object catalog.

## Verify

`make lint && make build`, then Hunt lobby → scene art loads → pin → review In/Out.
