# Contributing to Failure-First

Thank you for your interest in Failure-First. This is a **research project**, not a typical open-source codebase. Contributions are welcome, but the ways to contribute differ from a standard software project.

## How to Contribute

### Report Issues

If you find errors in our published findings, methodology gaps, broken links on [failurefirst.org](https://failurefirst.org), or inconsistencies in the public documentation, please open a GitHub issue.

### Cite Our Work

The most impactful contribution for a research project is citation. If our findings, datasets, or methodology inform your work, please cite us:

```bibtex
@software{failure_first_2026,
  title   = {Failure-First: Adversarial Evaluation Framework for Embodied AI},
  author  = {Wedd, Adrian},
  year    = {2026},
  url     = {https://failurefirst.org},
  note    = {227 models, 141{,}561 prompts, 337 attack techniques}
}
```

### Red-Team Collaboration

We welcome collaboration with AI safety researchers, red-team practitioners, and frontier lab security teams. If you have adversarial evaluation results, novel attack technique taxonomies, or defense effectiveness data you would like to contribute or cross-validate, open a GitHub issue describing your institutional affiliation and research focus.

### Dataset Contributions

If you have adversarial evaluation datasets that could strengthen the corpus, we accept contributions subject to:

- **Pattern-level only**: no operational exploits or copy-paste attack templates
- **Provenance documented**: source, collection methodology, and intended use
- **Schema compliance**: data must conform to our versioned JSON Schemas (documented in the private repository; we will assist with formatting)
- **Safety review**: all contributed data undergoes review before inclusion

### Documentation Improvements

Corrections, clarifications, and improvements to public-facing documentation (this repository, the design charter, security policy) are welcome via pull request.

## What We Do Not Accept

- Operational exploit code or working jailbreak prompts
- Model-specific bypass techniques intended for attack
- Raw adversarial datasets without provenance
- Content that facilitates real-world harm outside AI safety research

## Vulnerability Reporting

If you discover vulnerabilities in AI systems -- whether through this framework or independent research -- please follow responsible disclosure practices. See [SECURITY.md](SECURITY.md) for our coordinated disclosure process.

## Process

1. Open a GitHub issue describing the proposed contribution
2. For documentation changes, submit a pull request directly
3. For research collaborations and dataset contributions, we will coordinate via issue discussion

## Safety Review

All contributions undergo safety review to ensure content remains pattern-level, defensively purposed, and appropriate for a public repository. This review is not optional and applies equally to maintainers and external contributors.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Last updated:** 2026-03-29
