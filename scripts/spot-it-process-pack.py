#!/usr/bin/env python3
"""Spot It symbol pack processor (ADR 0034).

Modes:
  downsample      Copy public → masters (if missing), emit 192² game PNGs into public/
  from-masters    Rebuild public/ 192² from assets/.../masters/
  process-sheets  Crop 4-up sheets → masters (≤512²) + public 192²

Layout:
  assets/spot-it/<pack>/sheets/   # gitignored Magnific 4-up sources
  assets/spot-it/<pack>/masters/  # committed authoring masters
  public/spot-it/<pack>/          # deployed game rasters
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
GAME_SIZE = 192
MASTER_CAP = 512
SHEET_GUTTER = 0.03  # fraction of half-width/height inset per quadrant


def pack_paths(pack: str) -> tuple[Path, Path, Path]:
    assets = ROOT / "assets" / "spot-it" / pack
    return assets / "sheets", assets / "masters", ROOT / "public" / "spot-it" / pack


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def as_rgba(im: Image.Image) -> Image.Image:
    return im.convert("RGBA") if im.mode != "RGBA" else im


def resize_square(im: Image.Image, size: int) -> Image.Image:
    out = as_rgba(im)
    if out.size == (size, size):
        return out
    return out.resize((size, size), Image.Resampling.LANCZOS)


def save_png(im: Image.Image, dest: Path) -> None:
    ensure_dir(dest.parent)
    as_rgba(im).save(dest, format="PNG", optimize=True)


def next_master_index(masters: Path) -> int:
    if not masters.exists():
        return 0
    nums = [
        int(p.stem)
        for p in masters.glob("*.png")
        if re.fullmatch(r"\d{2}", p.stem)
    ]
    return (max(nums) + 1) if nums else 0


def crop_quadrants(sheet: Image.Image) -> list[Image.Image]:
    w, h = sheet.size
    hw, hh = w // 2, h // 2
    gx = max(1, int(hw * SHEET_GUTTER))
    gy = max(1, int(hh * SHEET_GUTTER))
    boxes = [
        (gx, gy, hw - gx, hh - gy),
        (hw + gx, gy, w - gx, hh - gy),
        (gx, hh + gy, hw - gx, h - gy),
        (hw + gx, hh + gy, w - gx, h - gy),
    ]
    return [sheet.crop(box) for box in boxes]


def master_side_for(im: Image.Image) -> int:
    side = max(im.size)
    return min(side, MASTER_CAP)


def write_symbol(im: Image.Image, masters: Path, public: Path, index: int) -> None:
    id_str = f"{index:02d}"
    src = as_rgba(im)
    m_side = master_side_for(src)
    save_png(resize_square(src, m_side), masters / f"{id_str}.png")
    save_png(resize_square(src, GAME_SIZE), public / f"{id_str}.png")
    print(f"  wrote {id_str}.png master={m_side} game={GAME_SIZE}")


def numbered_pngs(folder: Path) -> list[Path]:
    return sorted(p for p in folder.glob("*.png") if re.fullmatch(r"\d{2}", p.stem))


def cmd_downsample(pack: str) -> None:
    _sheets, masters, public = pack_paths(pack)
    ensure_dir(masters)
    ensure_dir(public)
    sources = numbered_pngs(public)
    if not sources:
        sys.exit(f"No PNGs in {public}")

    print(f"downsample pack={pack}: {len(sources)} symbols")
    for src in sources:
        im = Image.open(src)
        im.load()
        master_dest = masters / src.name
        if not master_dest.exists():
            m_side = master_side_for(im)
            save_png(resize_square(im, m_side), master_dest)
            print(f"  master {src.name} {m_side}")
        else:
            print(f"  master keep {src.name}")
        save_png(resize_square(im, GAME_SIZE), public / src.name)
        print(f"  game {src.name} {GAME_SIZE}")


def cmd_from_masters(pack: str) -> None:
    _sheets, masters, public = pack_paths(pack)
    ensure_dir(public)
    sources = numbered_pngs(masters)
    if not sources:
        sys.exit(f"No masters in {masters}")
    print(f"from-masters pack={pack}: {len(sources)} symbols")
    for src in sources:
        im = Image.open(src)
        im.load()
        save_png(resize_square(im, GAME_SIZE), public / src.name)
        print(f"  game {src.name} {GAME_SIZE}")


def cmd_process_sheets(pack: str, start_index: int | None) -> None:
    sheets_dir, masters, public = pack_paths(pack)
    ensure_dir(masters)
    ensure_dir(public)
    if not sheets_dir.exists():
        sys.exit(f"No sheets dir {sheets_dir}")
    sheets = sorted(
        p
        for p in sheets_dir.iterdir()
        if p.suffix.lower() in {".png", ".webp", ".jpg", ".jpeg"}
    )
    if not sheets:
        sys.exit(f"No sheet images in {sheets_dir}")

    idx = next_master_index(masters) if start_index is None else start_index
    print(f"process-sheets pack={pack} start={idx:02d} sheets={len(sheets)}")
    for sheet_path in sheets:
        print(f"sheet {sheet_path.name}")
        sheet = Image.open(sheet_path)
        sheet.load()
        for quad in crop_quadrants(sheet):
            write_symbol(quad, masters, public, idx)
            idx += 1


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "mode",
        choices=("downsample", "from-masters", "process-sheets"),
        help="Processing mode",
    )
    parser.add_argument("--pack", default="food", help="Pack id (default: food)")
    parser.add_argument(
        "--start-index",
        type=int,
        default=None,
        help="First symbol index for process-sheets (default: next free)",
    )
    args = parser.parse_args()

    if args.mode == "downsample":
        cmd_downsample(args.pack)
    elif args.mode == "from-masters":
        cmd_from_masters(args.pack)
    else:
        cmd_process_sheets(args.pack, args.start_index)


if __name__ == "__main__":
    main()
