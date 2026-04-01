#!/usr/bin/env python3
"""
Fix Pandoc-specific rendering artifacts in markdown paper files.

Transforms Pandoc-specific syntax that Astro cannot render into
standard markdown or plain text equivalents.

Fixes applied:
  1. {.smallcaps} span attributes -> plain text (removes brackets)
  2. `<!-- -->`{=html} raw attributes -> empty string (Pandoc ~approx)
  3. [@author2024key] citations -> (author2024key) plain text
  4. [@a; @b; @c] multi-citations -> (a; b; c)
  5. Section cross-refs with {reference-type="ref"...} -> plain links
  6. ::: CCSXML / ::: / {.unnumbered} fenced div markers -> stripped
  7. `{=html}` raw attribute on inline code -> plain value
  8. {#sec:id} / {#tab:id} / {#fig:id} header attributes -> stripped

Usage:
    python tools/fix_pandoc_rendering.py site/src/content/papers/*.md
    python tools/fix_pandoc_rendering.py --dry-run site/src/content/papers/detected-proceeds.md
"""
import argparse
import re
import sys
from pathlib import Path


def fix_smallcaps(text: str) -> tuple[str, int]:
    """Convert [Text]{.smallcaps} to Text."""
    pattern = r'\[([^\]]+)\]\{\.smallcaps\}'
    count = len(re.findall(pattern, text))
    text = re.sub(pattern, r'\1', text)
    return text, count


def fix_raw_html_approx(text: str) -> tuple[str, int]:
    """Remove `<!-- -->`{=html} Pandoc raw-attribute approximation markers.

    These appear in Pandoc-converted LaTeX as a workaround for ~ (tilde/approx).
    Pattern: $\\sim$`<!-- -->`{=html}VALUE  ->  ~VALUE
    Also: $<$`<!-- -->`{=html}VALUE  ->  <VALUE
    Also: $\\geq$`<!-- -->`{=html}VALUE  ->  >=VALUE  (but only outside math)
    """
    count = 0

    # Handle $\sim$`<!-- -->`{=html}
    pattern_sim = r'\$\\sim\$`<!-- -->`\{=html\}'
    count += len(re.findall(pattern_sim, text))
    text = re.sub(pattern_sim, '~', text)

    # Handle $<$`<!-- -->`{=html}
    pattern_lt = r'\$<\$`<!-- -->`\{=html\}'
    count += len(re.findall(pattern_lt, text))
    text = re.sub(pattern_lt, '<', text)

    # Handle $\geq$`<!-- -->`{=html}
    pattern_geq = r'\$\\geq\$`<!-- -->`\{=html\}'
    count += len(re.findall(pattern_geq, text))
    text = re.sub(pattern_geq, '>=', text)

    # Handle any remaining standalone `<!-- -->`{=html}
    pattern_bare = r'`<!-- -->`\{=html\}'
    count += len(re.findall(pattern_bare, text))
    text = re.sub(pattern_bare, '', text)

    return text, count


def fix_citations(text: str) -> tuple[str, int]:
    """Convert [@key] and [@key1; @key2] Pandoc citations to readable text.

    [@author2024key] -> (author2024key)
    [@a; @b; @c] -> (a; b; c)
    """
    count = 0

    # Multi-citations: [@key1; @key2; ...]
    def replace_multi(m):
        nonlocal count
        count += 1
        keys = m.group(1)
        # Remove @ from each key
        cleaned = re.sub(r'@', '', keys)
        return f'({cleaned})'

    text = re.sub(r'\[(@[^\]]+)\]', replace_multi, text)
    return text, count


def fix_cross_refs(text: str) -> tuple[str, int]:
    """Simplify Pandoc cross-reference syntax.

    Section [4.9](#sec:cap-floor){reference-type="ref" reference="sec:cap-floor"}
    -> Section [4.9](#sec:cap-floor)

    Table [1](#tab:faithfulness){reference-type="ref" reference="tab:faithfulness"}
    -> Table [1](#tab:faithfulness)

    Figure [2](#fig:era-asr){reference-type="ref" reference="fig:era-asr"}
    -> Figure [2](#fig:era-asr)
    """
    # Standard: [text](#anchor){reference-type=...}
    pattern = r'(\[[^\]]*\]\([^)]*\))\{reference-type="[^"]*"\s+reference="[^"]*"\}'
    count = len(re.findall(pattern, text))
    text = re.sub(pattern, r'\1', text)

    # Escaped brackets: [\[text\]](#anchor){reference-type=...}
    pattern2 = r'(\[\\?\[[^\]]*\\?\]\([^)]*\))\{reference-type="[^"]*"\s+reference="[^"]*"\}'
    n2 = len(re.findall(pattern2, text))
    count += n2
    text = re.sub(pattern2, r'\1', text)

    return text, count


def fix_fenced_divs(text: str) -> tuple[str, int]:
    """Remove Pandoc fenced div markers (::: blocks).

    ::: CCSXML -> removed
    ::: {.unnumbered} -> removed
    ::: -> removed (closing markers)
    """
    count = 0
    lines = text.split('\n')
    result = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith(':::'):
            count += 1
            # Skip this line entirely
            continue
        result.append(line)
    return '\n'.join(result), count


def fix_header_attributes(text: str) -> tuple[str, int]:
    """Remove Pandoc header attributes like {#sec:id} and {.unnumbered}.

    # Related Work {#sec:related} -> # Related Work
    ## Heading {.unnumbered} -> ## Heading
    """
    pattern = r'^(#{1,6}\s+.*?)\s*\{[^}]*\}\s*$'
    count = len(re.findall(pattern, text, re.MULTILINE))
    text = re.sub(pattern, r'\1', text, flags=re.MULTILINE)
    return text, count


def fix_file(filepath: Path, dry_run: bool = False) -> dict:
    """Apply all fixes to a single file. Returns summary dict."""
    content = filepath.read_text()
    original = content
    stats = {}

    content, n = fix_smallcaps(content)
    stats['smallcaps'] = n

    content, n = fix_raw_html_approx(content)
    stats['raw_html_approx'] = n

    content, n = fix_citations(content)
    stats['citations'] = n

    content, n = fix_cross_refs(content)
    stats['cross_refs'] = n

    content, n = fix_fenced_divs(content)
    stats['fenced_divs'] = n

    content, n = fix_header_attributes(content)
    stats['header_attrs'] = n

    total = sum(stats.values())
    stats['total'] = total

    if total > 0 and not dry_run:
        filepath.write_text(content)

    return stats


def main():
    parser = argparse.ArgumentParser(
        description="Fix Pandoc rendering artifacts in paper markdown files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python tools/fix_pandoc_rendering.py site/src/content/papers/*.md
    python tools/fix_pandoc_rendering.py --dry-run site/src/content/papers/detected-proceeds.md
"""
    )
    parser.add_argument('files', nargs='+', type=Path, help='Markdown files to fix')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be changed without modifying files')
    args = parser.parse_args()

    grand_total = 0
    for f in args.files:
        if not f.exists():
            print(f"SKIP {f} (not found)")
            continue
        stats = fix_file(f, dry_run=args.dry_run)
        if stats['total'] > 0:
            prefix = "[DRY RUN] " if args.dry_run else ""
            print(f"{prefix}{f.name}: {stats['total']} fixes "
                  f"(smallcaps={stats['smallcaps']}, raw_html={stats['raw_html_approx']}, "
                  f"citations={stats['citations']}, cross_refs={stats['cross_refs']}, "
                  f"fenced_divs={stats['fenced_divs']}, header_attrs={stats['header_attrs']})")
            grand_total += stats['total']
        else:
            print(f"{f.name}: no changes needed")

    action = "would fix" if args.dry_run else "fixed"
    print(f"\nTotal: {action} {grand_total} issues across {len(args.files)} files")


if __name__ == '__main__':
    main()
