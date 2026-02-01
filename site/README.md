# failurefirst.org

The public research site for the Failure-First Embodied AI project.

Built with [Astro](https://astro.build/) (static output), deployed via GitHub Pages to [failurefirst.org](https://failurefirst.org).

## Commands

From `site/`:

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build to `../docs/` for GitHub Pages |
| `npm run preview` | Preview built site locally |

## Architecture

- **Pages**: `src/pages/` — Astro file-based routing (21 pages)
- **Components**: `src/components/` — 11 reusable components (Card, StatGrid, BarChart, Timeline, etc.)
- **Layouts**: `src/layouts/` — BaseLayout, ContentLayout, ResearchLayout
- **Styles**: `src/styles/` — CSS custom properties design tokens + global styles
- **Output**: `../docs/` — Static HTML for GitHub Pages deployment

## Dependencies

- `astro` — Static site generator
- `@astrojs/sitemap` — Automatic sitemap generation

No JavaScript frameworks. CSS-only data visualization.
