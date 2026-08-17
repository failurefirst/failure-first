# failurefirst.org

The public research site for the Failure-First Embodied AI project.

Built with [Astro 7](https://astro.build/) (static output), deployed to [failurefirst.org](https://failurefirst.org) via **Cloudflare Pages**. Cloudflare builds from source on every push to `main` — there is no separate publish step.

## Contents

- [Requirements](#requirements)
- [Commands](#commands)
- [Architecture](#architecture)
- [Content collections](#content-collections)
- [Stats and the single source of truth](#stats-and-the-single-source-of-truth)
- [Security headers](#security-headers)
- [Search (Pagefind)](#search-pagefind)
- [Media and the R2 CDN](#media-and-the-r2-cdn)
- [Sentry](#sentry)
- [Redirects](#redirects)
- [Troubleshooting](#troubleshooting)
- [Dependencies](#dependencies)

## Requirements

- **Node.js ≥ 20** (we test on 20 and 22)
- **npm ≥ 10** (ships with Node)
- ~500 MB free disk for a clean build

No system-level dependencies. No framework runtimes.

## Commands

All commands run from `site/`.

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `http://localhost:4321` (HMR, schema validation) |
| `npm run build` | Production build → `dist/`. Runs Astro, then Pagefind, then strips `audio/`, `video/`, and any committed `*.m4a` / `*.mp4` / `*.mp3` from the output |
| `npm run preview` | Serve `dist/` locally (post-build smoke test) |

From the repo root, `bash scripts/build_site.sh` is a thin wrapper that does a disk-space precheck and then runs `npm run build`. The wrapper used to stash media around an old `outDir: ../docs` build; that machinery was removed in the Cloudflare Pages migration (commit `db8e6fac9d`).

## Architecture

```
site/
├── astro.config.mjs            ← redirects, integrations, markdown plugins
├── public/
│   ├── _headers                ← Cloudflare Pages security headers
│   └── robots.txt, favicon, …
├── src/
│   ├── pages/                  ← 90+ file-based routes (.astro)
│   ├── components/             ← 24 reusable Astro components
│   ├── layouts/                ← BaseLayout, ContentLayout, ResearchLayout, …
│   ├── content/                ← content collections (see below)
│   ├── content.config.ts       ← Zod schemas — validated at build time
│   ├── data/
│   │   ├── stats.ts            ← canonical corpus counts (do not hardcode)
│   │   ├── ai-safety-orgs.json
│   │   ├── companies.json
│   │   └── competitors.json
│   ├── styles/                 ← CSS custom-property design tokens + global styles
│   └── scripts/                ← page-level enhancement scripts
└── sentry.{client,server}.config.js
```

- No JavaScript framework. No client-side React/Vue.
- All charts are CSS-only (`BarChart.astro`, `StatGrid.astro`). No D3, no Chart.js.
- File-based routing — every `.astro` file in `src/pages/` becomes a route.

## Content collections

Defined in `src/content.config.ts` and validated at build time:

| Collection | Path | Purpose |
|---|---|---|
| `blog` | `src/content/blog/` | Research blog posts |
| `daily-paper` | `src/content/daily-paper/` | Daily adversarial-ML paper analyses |
| `papers` | `src/content/papers/` | Our own papers and preprints |
| `docs` | `src/content/docs/` | Long-form documentation |
| `policy-docs` | `src/content/policy-docs/` | Policy reports and op-eds |
| `reports` | `src/content/reports/` | Research reports |
| `services` | `src/content/services/` | Service descriptions |
| `legal` | `src/content/legal/` | Legal/terms content |

Adding an entry:

1. Drop a markdown file into the collection directory.
2. Match the frontmatter to the Zod schema (the build will tell you what's missing).
3. `npm run dev` validates immediately; broken frontmatter fails the build.

Daily-paper filenames follow `YYYY-MM-DD-<arxivId>.md`. arXiv-ID redirects to title-slug URLs are generated in `astro.config.mjs`.

## Stats and the single source of truth

Corpus counts (models tested, prompts evaluated, attack techniques, etc.) live in **`src/data/stats.ts`**. Import them — never hardcode. Updating the corpus is a one-file change.

```astro
---
import { stats } from '../data/stats.ts';
---
<p>{stats.models} models tested.</p>
```

## Security headers

Set via `public/_headers` (Cloudflare Pages convention). The header set includes:

- `Content-Security-Policy` (locked-down, audited per AdSense / Sentry integration)
- `Strict-Transport-Security`
- `X-Frame-Options`, `X-Content-Type-Options`
- `Referrer-Policy`
- `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `Cross-Origin-Embedder-Policy`
- `Permissions-Policy`

`BaseLayout.astro` carries a single `<meta name="referrer">` as defense-in-depth. `X-Frame-Options` and `X-Content-Type-Options` are header-only per spec and intentionally **not** duplicated as meta tags.

When adding any third-party resource (script, font, image, iframe), update CSP in `public/_headers` in the same commit.

## Search (Pagefind)

`npm run build` invokes `pagefind --site dist` to generate a static search index. The index is served from `dist/pagefind/` and consumed by `src/pages/search.astro`. No server-side search; entirely client-side.

If search results look stale, rebuild — the index regenerates from scratch each build.

## Media and the R2 CDN

Audio, video, and large images are served from `cdn.failurefirst.org` (Cloudflare R2), **not** committed to git. The repo-level pre-commit hook (`.githooks/pre-commit`) blocks any file >10 MB from being committed; install it once with:

```bash
git config core.hooksPath .githooks
```

The build step also strips `dist/audio`, `dist/video`, and stray `*.m4a` / `*.mp4` / `*.mp3` from the deployed output as a backstop — Cloudflare Pages should never serve large media itself.

## Sentry

Client and server Sentry configs live in `sentry.client.config.js` and `sentry.server.config.js`. DSN and environment are configured at build time via Cloudflare Pages environment variables (see `astro.config.mjs` for which envs are read).

To run locally without Sentry, simply omit the env vars — the SDK no-ops.

## Redirects

Redirects are declared in **`astro.config.mjs`** under the top-level `redirects` map. Examples:

- arXiv-ID → title-slug for daily papers (e.g. `/daily-paper/220302155/` → `/daily-paper/instructgpt-…/`)
- legacy `/reports/[...slug]` → `/research/reports/[...slug]`

Adding a redirect there lets it participate in route validation. A `public/_redirects` file is not used.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Build fails with a Zod error | Frontmatter on a new content entry doesn't match its schema. The error names the field. |
| `pagefind` step fails | `dist/` is missing or empty — the Astro build itself failed earlier. Scroll up. |
| Dev server reports a 404 for `/pagefind/` | Expected in dev — Pagefind only runs in `npm run build`. Search works after `npm run preview`. |
| CSP violation in browser console after adding a script | Update `Content-Security-Policy` in `public/_headers`. Check `cdn.failurefirst.org` is allow-listed in the right directive (`script-src`, `media-src`, …). |
| Cloudflare Pages build is green but the site shows stale content | Hard-refresh; Cloudflare caches aggressively. Purge via the dashboard if needed. |
| `npm run build` runs out of disk | `scripts/build_site.sh` enforces a 500 MB minimum and will tell you; clear `dist/` and `node_modules/.cache/`. |

## Dependencies

Runtime:

- `astro` (v5) — static site generator
- `@astrojs/sitemap` — sitemap generation
- `@astrojs/rss` — RSS feed
- `@sentry/astro` — error monitoring
- `remark-math` + `rehype-katex` — LaTeX rendering

Dev:

- `pagefind` — static search index

`overrides` in `package.json` pin transitive dependency floors for security and reproducibility. Bump them when a CVE lands or when an upstream upgrade is intentional.
