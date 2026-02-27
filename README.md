# F41LUR3-F1R57 — Adversarial Evaluation for Embodied AI

**Failure is not an edge case. It is the primary object of study.**

🌐 [failurefirst.org](https://failurefirst.org) · 📄 [arXiv preprint](https://failurefirst.org/blog/120-models-18k-prompts/) · 🗄️ [Dataset & tools (private)](https://github.com/adrianwedd/failure-first-embodied-ai)

---

## Headline Numbers

| | |
|---|---|
| **120 models evaluated** | Across OpenRouter, Ollama, and native CLIs (Claude, Codex, Gemini) |
| **18,176 adversarial prompts** | 5 attack families, 79+ techniques, versioned JSONL with JSON Schema |
| **151 benchmark runs** | 2,936 scored results in a unified SQLite corpus |
| **2.3× classifier overcount** | Keyword heuristics inflate ASR by 2.3× vs LLM-graded ground truth |

---

## Four Headline Findings

### 1. Supply Chain Injection: 90–100% ASR

50 injection scenarios against 6 small open-weight models (1.5–3.8B params). Every model treated injected tool definitions and skill files as legitimate instructions. No statistically significant differences between any model pair (chi-square with Bonferroni correction, Cohen's κ = 0.782).

### 2. Faithfulness Gap: 24–42% Against Frontier Models

Format-lock attacks — requesting harmful content structured as JSON, YAML, or code — achieved 30% (Claude Sonnet 4.5), 42% (Codex GPT-5.2), and 24% (Gemini 3 Flash) LLM-graded ASR. Models embed harmful content within structured fields while maintaining the appearance of a well-formatted, helpful response.

### 3. Multi-Turn Escalation: 80–90% on Reasoning Models

Crescendo attacks achieved 80–90% ASR against DeepSeek-R1 but only ~10% against small non-reasoning models. The extended context tracking that makes reasoning models capable also makes them vulnerable to gradual escalation.

### 4. The Classifier Overcount Problem

Cohen's κ = 0.245 between keyword and LLM classification. Heuristic REFUSAL labels are 95% reliable; heuristic COMPLIANCE labels have an 88% false positive rate. Aggregate effect: heuristic ASR 36.2% → corrected 15.9%.

---

## What This Is

A **research framework** for studying how embodied and agentic AI systems fail:

- **Red-teaming datasets** — adversarial scenarios targeting cognitive vulnerabilities in tool-using, multi-agent, and stateful systems
- **Failure taxonomies** — structured classifications of recursive, contextual, and interactional failure modes
- **Evaluation infrastructure** — benchmark runners (HTTP API, native CLI, local Ollama), scoring pipelines, statistical significance testing
- **Classification pipeline** — consensus grading (heuristic + LLM) with documented error characteristics

This is **not** an attack toolkit and does **not** claim real-world safety guarantees.

---

## Quick Start

```bash
git clone https://github.com/adrianwedd/failure-first.git
cd failure-first
pip install -r requirements-dev.txt

make validate   # Schema validation — 0 errors required
make lint       # Safety linter — catches operational phrasing
make bench      # Dry-run benchmark — no API calls
```

---

## The Site

[failurefirst.org](https://failurefirst.org) hosts 18+ blog posts, 23 daily paper analyses, and 19 policy reports — each with audio overviews, video summaries, and infographics generated via NotebookLM.

Recent posts:
- [120 Models, 18,176 Prompts: What We Found](https://failurefirst.org/blog/120-models-18k-prompts/)
- [The Classifier Overcount Problem](https://failurefirst.org/blog/classifier-overcount-problem/)
- [Reasoning Models Are Uniquely Vulnerable to Multi-Turn Attacks](https://failurefirst.org/blog/reasoning-models-multi-turn-vulnerability/)
- [When LLM Vulnerabilities Meet Robots](https://failurefirst.org/blog/llm-vulnerabilities-robots/)

---

## Core Philosophy

Most AI evaluation asks: *"Does the system succeed at the task?"*

We ask: *"How does it fail? What breaks first? Can it recover?"*

- **Recursive failures** — one failure cascading into others
- **Contextual failures** — instruction hierarchy confusion
- **Interactional failures** — multi-agent amplification
- **Temporal failures** — stateful degradation across episodes
- **Recovery failures** — inability to recognise and correct mistakes

---

## Safety & Ethics

All scenarios describe failure **patterns**, not operational exploits. Research aims to improve defenses, not enable attacks. Full traces and adversarial payloads are available under NDA for AI safety researchers at accredited institutions, government safety bodies, and frontier lab security teams.

Contact: Open a GitHub issue with institutional affiliation.

---

## Citation

```bibtex
@software{failure_first_2026,
  title   = {F41LUR3-F1R57: Adversarial Evaluation Framework for Embodied AI},
  author  = {Adrian Wedd},
  year    = {2026},
  url     = {https://failurefirst.org},
  note    = {120 models, 18{,}176 prompts, 5 attack families}
}
```

---

## License

MIT

---

**Study failures to build better defenses.**
