# Failure-First — Adversarial Evaluation for Embodied and Agentic AI

<p align="center">
  <strong>Failure is not an edge case. It is the primary object of study.</strong>
</p>

<p align="center">
  <a href="https://failurefirst.org">failurefirst.org</a> ·
  <a href="https://failurefirst.org/daily-paper/">Daily Paper Series</a> ·
  <a href="https://failurefirst.org/blog/">Research Blog</a> ·
  <a href="https://failurefirst.org/results/">Results</a> ·
  <a href="DESIGN_CHARTER.md">Design Charter</a> ·
  <a href="SECURITY.md">Security Policy</a>
</p>

<p align="center">
  <a href="https://failurefirst.org"><img alt="site" src="https://img.shields.io/badge/site-failurefirst.org-1f6feb"></a>
  <img alt="license" src="https://img.shields.io/badge/license-MIT-green">
  <img alt="status" src="https://img.shields.io/badge/research-active-success">
  <img alt="charter" src="https://img.shields.io/badge/charter-v2.0-blueviolet">
</p>

---

## Contents

- [The project](#the-project)
- [Headline findings](#headline-findings)
- [Methodology](#methodology)
- [What is in this repository](#what-is-in-this-repository)
- [Quickstart — running the site locally](#quickstart--running-the-site-locally)
- [Repository layout](#repository-layout)
- [Citing this work](#citing-this-work)
- [Contributing](#contributing)
- [Security and responsible disclosure](#security-and-responsible-disclosure)
- [License](#license)

## The project

Failure-First is a red-teaming and benchmarking program that studies how AI systems fail under adversarial pressure. It focuses on embodied AI (robots, tool-using agents, multi-agent systems) where failures translate into physical or operational consequences.

The driving question:

> When safety mechanisms are tested systematically across hundreds of models and thousands of attack techniques, what patterns emerge — and which of those patterns survive grader audits?

The work is defensive. The constraints that govern it are codified in the [Design Charter](DESIGN_CHARTER.md); operational exploit material is never published here.

## Headline findings

**258 models · 142,307 adversarial prompts · 140,794 graded results · 346 attack techniques · 139 harm classes.**

- **Classifier unreliability is pervasive.** Keyword-based jailbreak classifiers agree with LLM-graded ground truth at Cohen's κ = 0.126. Heuristic compliance labels carry a roughly 80% false-positive rate. Most published ASR numbers are likely inflated.
- **Hallucinated refusals are functionally dangerous.** Models that *appear* to refuse sometimes generate the harmful content anyway, wrapped in safety-sounding framing. This "hallucination refusal" pattern adds **11.9 percentage points** to ASR on non-abliterated models.
- **Format-lock attacks exploit structured-output compliance.** Requesting harmful content as JSON, YAML, or code achieves **24–42%** success against frontier models. The structured-output objective trades against safety training.
- **Multi-turn escalation disproportionately hits reasoning models.** Crescendo-style attacks achieve **65–85%** success against extended-reasoning models, whose chain-of-thought tracking makes them susceptible to gradual context manipulation.
- **Safety effectiveness varies by 57× across providers.** With identical prompts, safety investment — not raw model capability — dominates vulnerability.

Latest aggregate tables and figures: <https://failurefirst.org/results/>.

## Methodology

All results use LLM-graded classification (the **FLIP protocol**) with documented grader-reliability audits. We report three-tier ASR — *strict*, *broad*, *functionally dangerous* — with Wilson confidence intervals. Pairwise comparisons use chi-square tests with Bonferroni correction. Full methodology accompanies the AIES 2026 submission.

> **Read ASR numbers carefully.** Always check whether a cited rate uses LLM-only, heuristic-only, or coalesced verdicts. The three are not interchangeable.

## What is in this repository

This is the **public** mirror. It contains:

- `README.md`, `CONTRIBUTING.md`, `SECURITY.md` — project-level documentation
- [`DESIGN_CHARTER.md`](DESIGN_CHARTER.md) — non-negotiable principles and architectural decisions
- [`MANIFEST.json`](MANIFEST.json) — schema-level description of the private dataset (no adversarial content)
- [`site/`](site/) — Astro source for [failurefirst.org](https://failurefirst.org)
- [`scripts/`](scripts/) — build helpers (`build_site.sh`)
- [`.githooks/pre-commit`](.githooks/pre-commit) — blocks files >10 MB; media belongs on the R2 CDN

Full datasets, evaluation traces, and runner infrastructure live in a **private research repository**. Access is available under NDA to AI-safety researchers at accredited institutions, government safety bodies, and frontier-lab security teams. Open an issue with your institutional affiliation.

## Quickstart — running the site locally

```bash
# clone
git clone https://github.com/adrianwedd/failure-first.git
cd failure-first

# install the size-guard pre-commit hook (one-time)
git config core.hooksPath .githooks

# build and preview the site
cd site
npm install
npm run dev          # http://localhost:4321
```

A production build (`npm run build`) runs Astro, generates the Pagefind index, and strips audio/video from `dist/` before Cloudflare Pages serves it. See [`site/README.md`](site/README.md) for the full developer guide.

**Requirements:** Node ≥ 20. No other system dependencies.

## Repository layout

```
failure-first/
├── README.md              ← you are here
├── CONTRIBUTING.md        ← how to contribute (research project, not typical OSS)
├── SECURITY.md            ← coordinated vulnerability disclosure
├── DESIGN_CHARTER.md      ← project constitution (intent + non-negotiables)
├── MANIFEST.json          ← public dataset manifest
├── scripts/
│   └── build_site.sh      ← disk-checked wrapper around `npm run build`
├── .githooks/
│   └── pre-commit         ← blocks >10 MB commits (media → R2 CDN)
└── site/                  ← Astro source for failurefirst.org
    ├── src/pages/         ← 90+ routes (file-based)
    ├── src/components/    ← reusable Astro components
    ├── src/content/       ← content collections (blog, daily-paper, papers, …)
    ├── src/data/stats.ts  ← single source of truth for corpus counts
    └── public/_headers    ← Cloudflare Pages security headers (CSP, HSTS, …)
```

## Citing this work

```bibtex
@software{failure_first_2026,
  title  = {Failure-First: Adversarial Evaluation Framework for Embodied AI},
  author = {Wedd, Adrian},
  year   = {2026},
  url    = {https://failurefirst.org},
  note   = {258 models, 142{,}307 prompts, 346 attack techniques}
}
```

An AIES 2026 paper is in active preparation; citation details will be updated on acceptance. A canonical cite page is maintained at <https://failurefirst.org/cite/>.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The most valuable contributions are issue reports, citations, red-team collaboration proposals, and provenance-documented dataset additions. Operational exploits are out of scope by charter.

## Security and responsible disclosure

See [SECURITY.md](SECURITY.md). We have submitted **10 coordinated disclosures** to model providers covering context-collapse attacks and transcription-loophole injection. Sensitive reports: **research@failurefirst.org**.

## License

MIT for code and documentation in this repository. Dataset licensing is described separately in [`MANIFEST.json`](MANIFEST.json).

---

<p align="center"><em>Study failures to build better defenses.</em></p>
