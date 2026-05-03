#!/usr/bin/env python3
"""
Crop infographics to square for podcast episode cover art.

Takes landscape infographics (2752x1536) and center-crops to square,
then saves to site/public/infographic/square/{category}/ for use as
per-episode artwork in the Apple Podcasts feed.

Usage:
    python tools/crop_podcast_covers.py
    python tools/crop_podcast_covers.py --size 1400
    python tools/crop_podcast_covers.py --dry-run
    python tools/crop_podcast_covers.py --json
"""
import argparse
import json
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("PIL not installed: pip install Pillow", file=sys.stderr)
    sys.exit(1)

REPO_ROOT = Path(__file__).parent.parent
ASSETS_ROOT = Path(__file__).parent.parent.parent / "failure-first-embodied-ai" / "assets" / "infographic"
OUTPUT_ROOT = REPO_ROOT / "site" / "public" / "images" / "infographic" / "square"

CATEGORIES = ["blog", "daily-paper", "reports"]


def center_square_crop(img: Image.Image, target_size: int) -> Image.Image:
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    cropped = img.crop((left, top, left + side, top + side))
    return cropped.resize((target_size, target_size), Image.LANCZOS)


def main():
    parser = argparse.ArgumentParser(
        description="Crop infographics to square podcast cover art",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python tools/crop_podcast_covers.py
    python tools/crop_podcast_covers.py --size 1400 --dry-run
    python tools/crop_podcast_covers.py --json
""",
    )
    parser.add_argument("--size", type=int, default=3000, help="Output square size in px (default: 3000)")
    parser.add_argument("--dry-run", action="store_true", help="Print what would be done without writing files")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    args = parser.parse_args()

    results = {"created": [], "skipped": [], "errors": []}

    for category in CATEGORIES:
        src_dir = ASSETS_ROOT / category
        dst_dir = OUTPUT_ROOT / category
        if not src_dir.exists():
            continue
        if not args.dry_run:
            dst_dir.mkdir(parents=True, exist_ok=True)

        for src in sorted(src_dir.glob("*.png")):
            dst = dst_dir / (src.stem + ".jpg")
            if dst.exists():
                results["skipped"].append(str(dst.relative_to(REPO_ROOT)))
                continue
            try:
                if not args.dry_run:
                    img = Image.open(src).convert("RGB")
                    square = center_square_crop(img, args.size)
                    square.save(dst, "JPEG", quality=85, optimize=True)
                results["created"].append(f"{category}/{src.stem}.jpg")
            except Exception as e:
                results["errors"].append({"file": src.name, "error": str(e)})

    if args.json:
        print(json.dumps(results, indent=2))
    else:
        if args.dry_run:
            print(f"DRY RUN — would create {len(results['created'])} files")
        else:
            print(f"Created: {len(results['created'])}  Skipped: {len(results['skipped'])}  Errors: {len(results['errors'])}")
        for path in results["created"]:
            print(f"  + {path}")
        for e in results["errors"]:
            print(f"  ! {e['file']}: {e['error']}", file=sys.stderr)


if __name__ == "__main__":
    main()
