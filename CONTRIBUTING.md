# Contributing to Failure-First

Thank you for your interest. Failure-First is a **research project**, not a typical open-source codebase — the ways to contribute look a little different from a standard software repo.

Before contributing, please read the [Design Charter](DESIGN_CHARTER.md). It is the constitution of the project: anything that conflicts with it will not land, regardless of technical merit.

## Contents

- [Ways to contribute](#ways-to-contribute)
- [Local development](#local-development)
- [Pull-request conventions](#pull-request-conventions)
- [Safety review](#safety-review)
- [What we do not accept](#what-we-do-not-accept)
- [Vulnerability reporting](#vulnerability-reporting)
- [License](#license)

## Ways to contribute

### 1. Report issues

Errors in published findings, methodology gaps, broken links on [failurefirst.org](https://failurefirst.org), or inconsistencies in public documentation — open a GitHub issue. Reproduction steps, exact URLs, and citation pointers all help.

### 2. Cite the work

Citations are the highest-leverage contribution to any research project. If our findings, datasets, or methodology inform yours:

```bibtex
@software{failure_first_2026,
  title  = {Failure-First: Adversarial Evaluation Framework for Embodied AI},
  author = {Wedd, Adrian},
  year   = {2026},
  url    = {https://failurefirst.org},
  note   = {258 models, 142{,}307 prompts, 346 attack techniques}
}
```

### 3. Red-team collaboration

We welcome cross-validation with AI-safety researchers, red-team practitioners, and frontier-lab security teams. Open an issue describing your institutional affiliation, research focus, and the specific overlap (e.g. shared attack family, replication of a published ASR delta, defense-effectiveness data).

### 4. Dataset contributions

Adversarial evaluation data is accepted subject to:

- **Pattern-level only** — no operational exploits, no copy-paste attack templates ([charter §3.1](DESIGN_CHARTER.md#31-pattern-level-only-never-operational))
- **Provenance documented** — source, collection methodology, intended use
- **Schema compliance** — data conforms to our versioned JSON Schemas (documented in the private repository; we will assist with formatting)
- **Safety review** — all contributed data is reviewed before inclusion

### 5. Documentation improvements

Corrections, clarifications, and improvements to public documentation (this repo, the charter, the site) are welcome as pull requests.

## Local development

Most contributions touch the site under `site/`. To run it locally:

```bash
git clone https://github.com/adrianwedd/failure-first.git
cd failure-first

# install the size-guard pre-commit hook (one-time)
git config core.hooksPath .githooks

cd site
npm install
npm run dev          # http://localhost:4321
npm run build        # full production build (Astro + Pagefind + media strip)
```

Requirements: Node ≥ 20. See [`site/README.md`](site/README.md) for the developer guide (architecture, content collections, security headers, troubleshooting).

### The pre-commit hook

`.githooks/pre-commit` blocks any commit containing a file larger than **10 MB**. Audio, video, and large images belong on the R2 CDN (referenced from the site), not in git. To override in an emergency: `BYPASS_SIZE_CHECK=1 git commit …` — but prefer fixing the underlying issue.

## Pull-request conventions

- **Branch** off `main`. We don't maintain long-lived branches.
- **Commits** use conventional-style prefixes consistent with `git log` history: `fix(csp): …`, `blog: …`, `site: …`, `docs: …`, `chore: …`. Keep the subject under ~72 characters.
- **One concern per PR.** Methodology changes, site refactors, and content additions should not be mixed.
- **Link the issue** in the PR description if one exists.
- **Build locally** before pushing site changes — Cloudflare Pages builds on push to `main`, and broken builds page out.
- **Content collections** are schema-validated at build time; new entries must satisfy the schemas in [`site/src/content.config.ts`](site/src/content.config.ts).

## Safety review

All contributions undergo a safety review to ensure content remains pattern-level, defensively purposed, and appropriate for a public repository. The review applies equally to maintainers and external contributors. It is not optional — see [charter §3.1–§3.3](DESIGN_CHARTER.md#3-non-negotiable-principles-the-constitution).

A safety review may request:

- Removal of model-version-specific bypass details
- Reformulation of an exploit as a *class* of failure
- Addition of an expected safe-response template
- Provenance and intended-use disclosure

If a contribution cannot be made charter-compliant, it will be declined with reasoning.

## What we do not accept

- Operational exploit code or working jailbreak prompts
- Model-specific bypass techniques intended for attack
- Raw adversarial datasets without provenance
- CVE exploitation against named systems
- Content that facilitates real-world harm outside AI safety research

These are not editorial preferences — they are charter-level constraints.

## Vulnerability reporting

If you discover vulnerabilities in AI systems — whether through this framework or independent research — follow responsible disclosure. See [SECURITY.md](SECURITY.md) for our coordinated-disclosure process and contact channels.

## License

By contributing, you agree your contributions are licensed under the MIT License.

---

**Last updated:** 2026-05-16
