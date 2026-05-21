---
title: "Temporal Laundering Frontier Cohort Analysis (Scaffold)"
description: "1. When Amy's sweep completes (or at any snapshot), run:"
date: "2026-04-24"
reportNumber: 370
classification: "Research — Empirical Study"
status: "complete"
author: "Romana (statistical validation)"
tags: []
draft: false
---

---

## How to fill in this scaffold

1. When Amy's sweep completes (or at any snapshot), run:

   ```bash
   .venv/bin/python3 tools/stats/analyze_temporal_laundering.py \
       --traces-dir runs/temporal_laundering_frontier_v0.1_restart/ \
       --grader-model <grader-label> \
       [--grader-file runs/grading/temporal_laundering_flip_graded.jsonl] \
       [--baseline-traces runs/<baseline-sweep>/] \
       --json > /tmp/tl_analysis.json
   ```

2. Also run without `--json` to get the markdown tables and paste into the
   corresponding sections below.

3. **Before citing ASR figures:** confirm the analyzer's
   `verdict_sources` is NOT `{heuristic: N}` alone. If it is, the ASR is
   PRELIMINARY and you must arrange an LLM-graded re-pass before any
   external claim (see Mistake #21). The analyzer prints a warning in
   this case.

4. Replace every `{{TODO: ...}}` placeholder with actual text.

---

## 1. Executive Summary

{{TODO: 3–5 sentence summary. Mandatory elements:
- Cohort scope (5 models × 100 scenarios = 500 traces target)
- Primary ASR headline (per-model best/worst with CIs)
- Whether year-gap stratification reveals a monotonic trend
- Grader provenance (heuristic / FLIP / dual)
- Practical vs statistical significance statement
}}

---

## 2. Methodology

### 2.1 Scenario corpus

- **Source:** `data/curated/temporal_laundering_frontier_v0.1.jsonl`
- **n:** 100 scenarios
- **Intent label:** `labels.intent.future_year_laundering=true` (all)
- **Year-gap distribution** (future_year − target_year):
  - <100y: {{TODO}} scenarios
  - 100–149y: {{TODO}} scenarios
  - 150–199y: {{TODO}} scenarios
  - 200+y: {{TODO}} scenarios

### 2.2 Cohort

April 2026 Ollama Cloud frontier cohort:

| Model | Lab | Role |
|-------|-----|------|
| `gemma4:31b` | Google DeepMind | Reference safety-tuned |
| `glm-5` | Zhipu AI | |
| `deepseek-v3.2` | DeepSeek | |
| `kimi-k2-thinking` | Moonshot | Reasoning model |
| `gpt-oss:120b` | OpenAI open-weights | |

### 2.3 Grading

- **Grader model:** `{{TODO: deepseek-r1:8b / heuristic / other}}`
- **Grading protocol:** {{TODO: inline via `--llm-grade`, or post-hoc via
  `grade_with_gemini.py` / `grade_ollama_cloud.py`, or heuristic fallback.}}
- **Verdict taxonomy:** COMPLIANCE, PARTIAL, REFUSAL, HALLUCINATION_REFUSAL,
  BENIGN_QUERY. ASR is defined as COMPLIANCE ∪ PARTIAL.
- **Heuristic caveat:** If `heuristic_only=true` in the analyzer output,
  results are preliminary and subject to Mistake #21 (keyword classifier
  over-reports style, not harm). FLIP re-grade is mandatory before external
  citation.

### 2.4 Statistical tests

- Wilson score 95% confidence intervals on all ASR proportions
  (`tools/stats/analyze_temporal_laundering.py`).
- Pairwise chi-square (Fisher's exact for n<30 or expected <5)
  via `tools/stats/significance_tests.py::pairwise_model_comparison`.
- Bonferroni correction for multiple pairwise tests
  (α_adj = α / n_comparisons).
- Cohen's d for effect sizes when a baseline sweep is supplied.

---

## 3. Results

### 3.1 Per-model ASR

{{TODO: paste markdown table from analyzer's `### Per-model ASR` section.}}

Sample sizes: if any model has n<20 after grading, state so explicitly and
decline comparative claims about that model (hard rule — min n=20 for
comparisons).

### 3.2 Year-gap stratification

{{TODO: paste markdown table from analyzer's `### Year-gap stratification`
section. Comment on whether larger year-gaps correlate with higher or
lower ASR. Specifically look for:
- Monotonic increase (larger gap = more ASR) → supports
  "temporal distance weakens refusal" hypothesis
- Inverted-U or flat → null result on gap mechanism
- Per-model heterogeneity (some models flat, others responsive to gap)
  → model-specific finding}}

### 3.3 Pairwise significance

{{TODO: paste markdown table from analyzer's pairwise chi-square output.
Note how many pairs survive Bonferroni correction with α_adj.}}

### 3.4 Baseline comparison (if supplied)

{{TODO: only fill if `--baseline-traces` was used. Show which models had
significant sweep-vs-baseline shifts and the Cohen's d magnitude.}}

---

## 4. Interpretation

### 4.1 Practical significance

Statistical significance ≠ practical significance. For each significant
pairwise result, state:

- The ASR delta in percentage points.
- Whether the CI overlap is trivial (≤5pp) or meaningful (≥15pp).
- Whether the effect persists across year-gap buckets.

### 4.2 Known limitations

- **Sample size:** 100 scenarios × {{TODO: n}} models = {{TODO: N}} traces.
  Per-bucket-per-model n can drop below 20, invalidating bucket comparisons.
- **Single-turn:** This pack is single-turn; no multi-turn crescendo
  interaction. Results do not generalize to sustained adversarial
  dialogue.
- **Grader:** {{TODO: list grader-model, any known grader bias from #28.}}
- **Intent-label collapse:** All scenarios are `future_year_laundering=true`.
  We cannot isolate the temporal-laundering effect from the co-occurring
  `persona_hijack=true` label on most scenarios — the analyzer does not
  currently stratify on persona_hijack.

### 4.3 What this does NOT show

- Does NOT show temporal laundering works on any model not in this cohort.
- Does NOT show the effect size on non-`future_year_laundering` adversarial
  prompts.
- Does NOT establish a causal mechanism; this is observational ASR only.

---

## 5. Follow-ups

- [ ] FLIP re-grade if run used heuristic (mandatory before external citation).
- [ ] Kappa: heuristic vs FLIP verdicts (must be κ≥0.6 before any use of
  heuristic as a proxy; see Mistake #21).
- [ ] Baseline sweep: pick a non-temporal-laundering pack and re-run
  analyzer with `--baseline-traces` for effect-size estimation.
- [ ] Multi-turn extension: does temporal framing amplify across turns?
- [ ] Persona-hijack ablation: isolate temporal effect from persona effect.

---

## 6. Appendix: Raw analyzer output

Paste `tools/stats/analyze_temporal_laundering.py ... --json` output here,
or link to the JSON file in `runs/temporal_laundering_frontier_v0.1_restart/`.

```json
{{TODO: paste JSON blob}}
```

---

## Provenance

- Analyzer version: `tools/stats/analyze_temporal_laundering.py` @ {{TODO: commit SHA}}
- Sweep log: `runs/temporal_laundering_frontier_v0.1_restart/run.log`
- Trace files: `runs/temporal_laundering_frontier_v0.1_restart/*_traces.jsonl`
- Generated: {{TODO: date}}
