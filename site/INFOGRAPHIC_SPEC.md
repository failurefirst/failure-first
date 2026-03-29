# F41LUR3-F1R57 Infographic Generation Spec v2

## The Problem with v1

NotebookLM infographics are white-background, clip-art-heavy, generic explainer posters. They clash with the site's dark, technical aesthetic and look like they came from a different project.

## Visual Identity

The site uses a **dark technical HUD** aesthetic — think mission control, SCADA interfaces, threat dashboards. Not corporate, not playful, not academic-poster.

### Color Palette (from tokens.css)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#050810` | Deep navy-black background |
| `--bg-elevated` | `#0a0f1a` | Card/panel surfaces |
| `--fg` | `#e8ecf2` | Primary text (cool white) |
| `--fg-dim` | `#b0b8c5` | Secondary text |
| `--fg-muted` | `#7a8292` | Tertiary/label text |
| `--accent-primary` | `#00d2ff` | Cyan — headlines, key data, links |
| `--accent-secondary` | `#ff6348` | Coral — emphasis, alerts |
| `--accent-tertiary` | `#a29bfe` | Lavender — tertiary accent |
| `--failure-critical` | `#ff4757` | Red — critical failures, attack success |
| `--failure-warning` | `#ffa502` | Orange — warnings, cautions |
| `--failure-degraded` | `#ffd32a` | Yellow — degraded states |
| `--recovery-active` | `#00d2ff` | Cyan — active recovery |
| `--recovery-stable` | `#26de81` | Green — stable/safe states |

### Typography

- **Headlines:** Condensed, uppercase, wide letter-spacing. Think: Impact, Oswald, Barlow Condensed. Bold, blocky.
- **Data labels:** JetBrains Mono or similar monospace. Small, uppercase, tracked out.
- **Body (if any):** Inter or system sans-serif. Minimal — infographics are data-first.

### Visual Elements

- **Grid overlay:** Subtle cyan grid lines at ~5% opacity (`rgba(0, 210, 255, 0.05)`)
- **Scan lines:** Faint horizontal CRT-style scan lines
- **Glow effects:** Cyan glow (`rgba(0, 210, 255, 0.25)`) behind key metrics
- **Border style:** 1px cyan borders at 15% opacity for panels
- **HUD decorations:** Corner brackets `[ ]`, status readouts, coordinate markers
- **No clip art, no cartoon icons, no stock illustrations**

## Image Spec

### Dimensions
- **Blog/Daily Paper OG images:** 1200x630px (Open Graph standard)
- **Format:** WebP (preferred), PNG fallback
- **File size target:** <200KB per image

### Layout Template

```
+--[ F41LUR3-F1R57 ]----------------------------------+
|                                                       |
|  HEADLINE IN CAPS                                     |
|  Subtitle or one-line description                     |
|                                                       |
|  +---------------+  +---------------+  +----------+  |
|  | KEY METRIC    |  | KEY METRIC    |  | KEY      |  |
|  | 34.2%         |  | 227           |  | METRIC   |  |
|  | label         |  | models tested |  | value    |  |
|  +---------------+  +---------------+  +----------+  |
|                                                       |
|  [visual element: chart / diagram / flow / heatmap]   |
|                                                       |
|  ─────────────────────────────────────────────────    |
|  SERIES LABEL              failurefirst.org     DATE  |
+-------------------------------------------------------+
```

### Composition Rules

1. **Dark background always.** #050810 base, never white, never light.
2. **One hero metric.** Every image leads with one number in large cyan text.
3. **Max 3 data panels.** Don't cram. If you need more, the image is doing too much.
4. **One visual element.** A small chart, a flow diagram, a comparison bar — not an infographic zoo.
5. **Brand anchor.** `F41LUR3-F1R57` top-left or bottom-left. `failurefirst.org` bottom-right.
6. **Series badge.** `DAILY PAPER` or `RESEARCH` in a small bordered pill, top-right.
7. **No faces, no hands, no humanoid illustrations.** Abstract/geometric only.

## Per-Collection Variants

### Daily Paper (arXiv reviews)
- Series badge: `DAILY PAPER` in cyan pill
- Show: arXiv ID in monospace, 1-2 key findings as metrics
- Visual: Abstract representation of the paper's core concept
- Dominant color: Cyan (#00d2ff)

### Blog (original research)
- Series badge: `F41LUR3-F1R57 RESEARCH` in orange pill
- Show: Key finding metric, 1-2 supporting stats
- Visual: Data visualization relevant to the post (bar chart, radar, flow)
- Dominant color: Orange (#ffa502) accent on cyan base

### Blog (policy/regulatory)
- Series badge: `POLICY` in lavender pill
- Show: Regulatory gap metric, jurisdiction count, compliance rate
- Visual: Timeline, coverage matrix, or gap visualization
- Dominant color: Lavender (#a29bfe) accent on cyan base

## Prompt Template for Image Generation

Use this as a base prompt for any image generation tool (DALL-E, Midjourney, Flux, etc.):

```
Dark technical dashboard infographic, 1200x630px, deep navy-black background (#050810).

Top: "[TITLE]" in bold condensed white uppercase text with subtle cyan glow.
Center: [DESCRIPTION OF KEY VISUAL — e.g., "a horizontal bar chart comparing attack success rates across 6 model families, bars in cyan (#00d2ff) and coral (#ff6348)"]
Bottom-left: "F41LUR3-F1R57" in small cyan monospace.
Bottom-right: "failurefirst.org" in small gray monospace.

Style: Mission control HUD aesthetic. Subtle cyan grid overlay. No clip art. No cartoon icons. No stock imagery. Monospace data labels. Minimal, data-driven, technical. Think: SCADA interface meets threat intelligence dashboard.

Color palette: Background #050810, primary text #e8ecf2, cyan accent #00d2ff, warning orange #ffa502, critical red #ff4757, muted gray #7a8292.
```

## Programmatic Generation (CSS/SVG)

For batch generation without an AI image tool, use an HTML-to-image pipeline:

1. Create an HTML template with the layout above
2. Render with Playwright/Puppeteer at 1200x630
3. Export as WebP

This gives pixel-perfect brand consistency and can be scripted for all 172 posts.

Template location: `site/src/templates/og-image.html` (to be created)

## What NOT to Do

- White backgrounds
- Colorful cartoon icons or clip art
- Busy multi-section infographic posters
- Stock photos of robots or computers
- Gradient-heavy "tech bro" aesthetics
- Rounded friendly corners (use sharp 0-2px radius)
- Emoji in images
