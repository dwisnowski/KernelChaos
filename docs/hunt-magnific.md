# Picture Hunt — Magnific MCP art pass

Offline authoring recipe for denser seek-and-find JPGs under `public/hunt/`. Magnific **Creative** upscale can add tiny unlabelled clutter while keeping layout; it does **not** guarantee every catalog name is drawn. Catalogs stay authoritative after a vision pass ([ADR 0020](./adr/0020-hunt-scene-authoring.md), [ADR 0027](./adr/0027-hunt-hidden-object-art.md)).

Run this from Cursor via the **Magnific MCP** (`user-Magnific`), not the website.

## Tool chain

1. `magnific_start` — confirm paid plan / credits.
2. Optional: `folders_list` — dedicated project; pass `folderReference` on every later call (or omit / `personal`).
3. Upload local JPG (MCP cannot take a filesystem path on `images_upscale`):
   - `creations_request_upload` with `mimeType: "image/jpeg"`
   - Shell `PUT` of `public/hunt/<id>.jpg` to `proxyUploadUrl` (`Content-Type: image/jpeg`, raw bytes)
   - `creations_finalize_upload` with `path` + `fileName: "<id>.jpg"`
4. `images_upscale` with Creative params below.
5. `creations_wait` until terminal — do **not** re-queue while still processing.
6. `creations_read` with `hq: "medium"` — judge layout drift vs added clutter.
7. Export: `creations_register_download` + `creations_get` URL → `curl` into `public/hunt/<id>.jpg`. Re-encode JPEG quality ~80 if over ~1.5 MB (target longest side ~2304).

## Creative params (denser clutter)

| Param | Value |
| --- | --- |
| `mode` | `creative` |
| `scale` | `2x` (1152→2304) |
| `presets` | `custom` |
| `optimised` | `ArtAndIllustration` |
| `engine` | `magnific_illusio` |
| `creativity` | `0` first; retry `+2` if empty areas stay empty; never past `+3` |
| `resemblance` | `7` |
| `fractality` | `6` (cap `8`) |
| `hdr` | `2` |

Prompt template (swap the place name):

```text
Dense hidden-object illustration of a <TITLE>, same layout and same subjects as the source. Fine ink line with light watercolor. Fill empty ground, foliage, and background with dozens of additional tiny distinct animals and everyday objects. Keep every existing subject recognizable. No text, no letters, no numbers, no labels, no borders, no watermark.
```

### Scene titles for prompts

| id | title |
| --- | --- |
| zoo | City Zoo |
| kitchen | Busy Kitchen |
| playroom | Toy Playroom |
| farm | Sunny Farmyard |
| beach | Beach Boardwalk |
| park | Neighborhood Park |
| shop | Cluttered Shop |
| carnival | Carnival Park |
| classroom | Busy Classroom |
| garage | Messy Garage |
| bakery | Busy Bakery |
| train | Train Station |
| space | Space Station |
| campsite | Forest Campsite |
| aquarium | Aquarium |

## If the scene drifts

Lower `creativity` by 2 and set `resemblance` to `8`, then re-upscale from the **uploaded source** creation (not the failed output). If large subjects still morph, abandon Creative for that file and use Precision on the original upload.

## Precision fallback (sharpen only)

| Param | Value |
| --- | --- |
| `mode` | `ultra-sublime` |
| `scale` | `2x` on the **original** upload |
| `sharpness` | `20` |
| `grain` | `3` |

Do not stack Precision on Creative output. Do not pass `ultraDetail` for `ultra-sublime`.

## Do not use for hunt art

- `images_reimagine`
- `images_variations`
- `images_expand`

They move subjects and break the seek-and-find frame.

## After a successful JPG

1. Vision-check: delete catalog objects you cannot point at; add names only for new visible finds (with synonyms).
2. Leave `box` unset unless a location is visually authored.
3. `npm run hunt:coverage` (≥250 objects; ≥10 findable names per die letter).
4. `make lint && make build`; smoke phone + TV hunt play.

Pilot: **City Zoo** (`zoo`) first; roll the same params to other scenes only after accepting that result.
