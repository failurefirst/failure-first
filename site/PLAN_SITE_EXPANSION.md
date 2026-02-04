# failurefirst.org Expansion Plan (Draft)

## Purpose
Deliver a public-facing, citable, and defensible research hub that reflects the Failure-First Embodied AI program without exposing operational or weaponizable details.

## Guiding Principles
- Pattern-level only; no operational exploits or step-by-step bypasses.
- Evidence-based claims; all metrics include sample sizes and dates.
- Clear separation of public vs private artifacts.
- Reproducibility via documented methods and curated aggregates.

## Information Architecture (New Pages)

### 1) Results & Metrics (Priority 1)
**Goal:** Make the site citable with clear, aggregate results.
**Sections:**
- Executive summary (what was measured, when, and why)
- Model-family comparisons (ranges with n)
- Attack-class outcomes (success/refusal/deflection)
- Multi-turn vs single-turn deltas
- Deflection vs refusal effectiveness
- Limitations and scope
**Artifacts:**
- CSV/JSON summary tables for download
- Static charts (BarChart) + optional client-side filtering

### 2) Dataset Card + Provenance (Priority 1)
**Goal:** Provide a canonical dataset reference.
**Sections:**
- Dataset overview (counts, domains, scenario types)
- Schema versions and validation status
- Sampling and generation methodology
- Safety constraints and linting policy
- Changelog highlights (major additions)
**Artifacts:**
- Dataset metadata JSON
- Citable block (BibTeX + citation text)

### 3) Methods & Reproducibility (Priority 1)
**Goal:** Show how results are produced and how to replicate at a high level.
**Sections:**
- Benchmark runners used (CLI/HTTP/Ollama)
- Evaluation pipeline (grader tiers + calibration)
- Key parameters (packs, counts, temperature, max_tokens)
- Repro checklist (non-operational)
- Known limitations and failure points
**Artifacts:**
- Minimal reproducibility checklist
- “What is safe to replicate” guidance

### 4) Failure‑Mode Atlas (Priority 2)
**Goal:** Interactive index of failure modes, mapped to domains and patterns.
**Sections:**
- Failure mode taxonomy overview
- Filters by scenario class/domain/attack class
- Pattern-level example snippets (sanitized)
**Artifacts:**
- Index JSON (safe, curated)

### 5) Model Vulnerability Dashboard (Priority 2)
**Goal:** Visualize high-level trends without exposing operational prompts.
**Sections:**
- Size vs vulnerability
- Family vulnerability ranges (with n)
- Transferability indicators
- Defensive behaviors (refusal vs deflection)
**Artifacts:**
- Summary JSON

### 6) Moltbook Experiment Log (Priority 2)
**Goal:** Track active experiments transparently.
**Sections:**
- Experiment list (hypothesis, status, dates)
- Protocol summary (non-operational)
- Aggregate outcomes as they land
**Artifacts:**
- Experiment registry JSON

### 7) Humanoid Safety Briefs Index (Priority 3)
**Goal:** Publish summaries of 15+ research briefs.
**Sections:**
- Brief list with one-paragraph summaries
- Scope notes (what is covered/what is excluded)

### 8) Compression Tournament Findings (Priority 3)
**Goal:** Surface key lessons without exposing prompts.
**Sections:**
- Short summary of compression efficacy
- Pattern-level failure modes in compression
- Aggregate outcomes

### 9) Case Study Gallery (Priority 3)
**Goal:** Provide grounded, sanitized examples.
**Sections:**
- 5–10 pattern-level examples (single/multi/episode)
- Expected safe response behavior
- Failure signature (how it broke)

### 10) Open Data & Access (Priority 3)
**Goal:** Clarify what’s public and how to request private artifacts.
**Sections:**
- Public artifacts list
- NDA access criteria
- Contact and disclosure policy

## Data Publication Policy (Public vs Private)

### Public (Safe)
- Aggregate metrics (no prompts)
- Pattern-level descriptions and taxonomies
- Dataset counts and schema versions
- High-level methodology and reproducibility checklist

### Private (Restricted)
- Full prompts and responses
- Operational or sensitive test cases
- Full traces with model outputs

## Deliverables by Phase

### Phase 1 (Cite-Ready Core)
- Results & Metrics page
- Dataset Card + Provenance page
- Methods & Reproducibility page
- JSON/CSV exports for metrics

### Phase 2 (Atlas + Dashboards)
- Failure‑Mode Atlas
- Model Vulnerability Dashboard
- Moltbook Experiment Log

### Phase 3 (Briefs + Gallery)
- Humanoid Safety Briefs Index
- Compression Tournament Findings
- Case Study Gallery
- Open Data & Access page

## Implementation Steps (High Level)
1. Define public-safe data schema for metrics and atlas content.
2. Curate aggregate metrics from private repo (no operational text).
3. Build new Astro pages + minimal components (filters/tables).
4. Add data exports under `site/public/data/`.
5. Add citations and revision dates to key pages.
6. Review for safety constraints before publishing.

## Risk Controls
- Manual safety review for every new page with examples.
- No operational prompts; only pattern-level descriptions.
- Explicit sample sizes + conditions for all metrics.

## Success Criteria
- Citable results with clear scope and methods.
- Clear public/private boundary.
- Researchers can reference dataset metadata and methodology without NDA.

