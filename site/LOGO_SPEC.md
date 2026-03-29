# F41LUR3-F1R57 Logo & Brand Identity Specification

## Logo Description (for image generation tools)

### Primary Logo

A stylized glyph combining a fractured shield with a diagnostic crosshair, rendered in electric cyan (#00d2ff) against absolute black. The shield is split vertically — the left half intact, the right half shattered into angular fragments that drift outward like debris from an impact. A thin circular crosshair overlays the break point, with tick marks at cardinal positions suggesting measurement and analysis. The overall silhouette reads as both "broken defense" and "systematic examination of that break."

The wordmark **F41LUR3-F1R57** sits below in condensed uppercase monospace (JetBrains Mono Bold or similar), letter-spaced at +0.08em. The leetspeak characters (4, 1, 3, 5, 7) are in cyan (#00d2ff); the standard letters (L, U, R, F, R, T) are in cool white (#e8ecf2). The hyphen is orange (#ffa502).

### Icon-Only Mark

The fractured shield + crosshair glyph alone, used at small sizes (favicons, app icons, social avatars). The shield crack runs at exactly 12 degrees off vertical. Three fragment pieces separate from the right half. The crosshair circle passes through the fracture point.

### Monogram

**F1** — in the same split-color treatment. F in white, 1 in cyan. Used where the full mark is too wide.

---

## Brand Visual Language (for infographic generation)

### Atmosphere

This is a threat intelligence lab, not a startup landing page. Think: the monitoring wall in a SOC (Security Operations Center) at 2am. Dark, precise, information-dense but not cluttered. Every element is there because an analyst needs it.

### Background Treatment

- Base: Deep navy-black (#050810), never pure #000000
- Subtle grid overlay: Thin lines at ~3% opacity in cyan, spaced 40px apart
- Optional: Faint horizontal scan lines at 2% opacity, 2px apart
- Optional: Very subtle radial gradient from center (#0a0f1a) fading to edges (#050810)

### Data Presentation

- **Hero metrics** in large cyan monospace, 72-96pt equivalent
- **Supporting stats** in smaller panels with 1px cyan border at 15% opacity
- **Labels** in tiny uppercase monospace, muted gray (#7a8292), tracked wide
- **Charts:** Thin-line style. No filled bars. Cyan for primary data, coral (#ff6348) for comparison/adversarial data, orange (#ffa502) for warnings
- **Separators:** Single-pixel horizontal rules in cyan at 10% opacity

### Iconography

No icons. No pictograms. No emoji. If a concept needs visual representation, use:
- Geometric shapes (circles, triangles, hexagons) as data points
- Line-art diagrams (flow arrows, connection lines)
- Heatmap cells or matrix grids
- Radar/spider chart outlines
- Simple signal waveforms or pulse indicators

### Typography in Images

| Role | Style | Color |
|---|---|---|
| Main title | Condensed bold uppercase, 32-40pt | White (#e8ecf2) |
| Subtitle/description | Regular weight, 14-16pt, sentence case | Dim (#b0b8c5) |
| Hero metric value | Monospace bold, 64-96pt | Cyan (#00d2ff) |
| Metric label | Monospace uppercase, 10-11pt, +0.06em tracking | Muted (#7a8292) |
| Category/series badge | Monospace uppercase, 9pt, inside bordered pill | Varies by series |
| Brand anchor | Monospace, 10pt | Cyan (#00d2ff) at 60% opacity |
| URL | Monospace, 10pt | Muted (#7a8292) |

### Series Color Coding

| Series | Badge Color | Accent |
|---|---|---|
| Daily Paper (arXiv) | Cyan (#00d2ff) | Cyan primary |
| Original Research | Orange (#ffa502) | Orange + cyan |
| Policy & Regulatory | Lavender (#a29bfe) | Lavender + cyan |
| Threat Intelligence | Red (#ff4757) | Red + cyan |
| Tools & Methods | Green (#26de81) | Green + cyan |

---

## Prompt Template for Infographic Generation

Paste this into any image generation tool, replacing bracketed values:

```
Create a dark technical infographic image, 1200x630 pixels.

Background: Deep navy-black (#050810) with a very faint cyan grid overlay.

Top section:
- Small "[SERIES]" label in a thin-bordered pill shape, [SERIES_COLOR]
- Large title: "[TITLE]" in bold condensed white uppercase text
- One line subtitle in lighter gray: "[DESCRIPTION]"

Center section:
- [VISUAL_DESCRIPTION — e.g., "Three metric panels side by side showing: '34.2%' in large cyan text labeled 'DETECTED_PROCEEDS RATE', '227' labeled 'MODELS TESTED', '6' labeled 'ATTACK ERAS'"]
- Below the metrics: [OPTIONAL_CHART — e.g., "A thin-line horizontal bar chart comparing attack success rates, bars in cyan and coral"]

Bottom:
- Thin horizontal rule in cyan at 10% opacity
- Left: "F41LUR3-F1R57" in small cyan monospace
- Right: "failurefirst.org" in small gray monospace

Style: Security operations center aesthetic. Dark, precise, clinical.
No clip art. No cartoon icons. No stock photos. No white backgrounds.
No rounded friendly shapes. Sharp geometric forms only.
Monospace typography for all data. Minimal, threatening, authoritative.

Colors: Background #050810, text #e8ecf2, cyan #00d2ff, orange #ffa502,
red #ff4757, muted #7a8292, subtle borders rgba(0,210,255,0.15).
```

### Per-Post Customization Guide

For each post, replace the template variables:

**[SERIES]:** One of `DAILY PAPER`, `RESEARCH`, `POLICY`, `THREAT INTEL`
**[SERIES_COLOR]:** Matching color from the series table above
**[TITLE]:** Post title, truncated to ~60 chars if needed
**[DESCRIPTION]:** One-sentence hook from the post description
**[VISUAL_DESCRIPTION]:** The unique element for this post — describe what data or concept should be visualized. Pull the single most striking finding from the post.
**[OPTIONAL_CHART]:** If the post has quantitative data, describe a simple chart.

### Examples

**For "DETECTED_PROCEEDS" post:**
```
SERIES: RESEARCH
TITLE: WHEN AI KNOWS IT'S WRONG AND DOES IT ANYWAY
VISUAL: Large "34.2%" in cyan as hero metric, labeled "OF COMPLIANT RESPONSES SHOWED PRIOR SAFETY DETECTION". Secondary panel: "43.9% OVERRIDE RATE". A simple flow diagram: DETECT → REASON → OVERRIDE → COMPLY, with the arrow from REASON to OVERRIDE highlighted in red.
```

**For "Tree of Attacks" daily paper:**
```
SERIES: DAILY PAPER
TITLE: TREE OF ATTACKS: JAILBREAKING BLACK-BOX LLMS
VISUAL: Large "arXiv:2312.02119" in cyan monospace at top. Hero metric: tree-branching diagram showing attack paths diverging from a single root, 4 levels deep, nodes in cyan, pruned branches in muted gray. Secondary: "BLACK-BOX / 20 QUERIES / AUTOMATED"
```

**For "EU AI Act" policy post:**
```
SERIES: POLICY
TITLE: ZERO OF 36: NO ATTACK FAMILY IS FULLY REGULATED
VISUAL: Large "0/36" in red (#ff4757) as hero metric. Below: a 6x6 grid of small squares representing 36 attack families — all gray/empty, none filled with green. Label: "REGULATORY COVERAGE MATRIX". Lavender accent on the series badge.
```
