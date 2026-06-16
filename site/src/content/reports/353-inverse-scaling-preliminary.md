---
title: "The Inverse Scaling Law of Safety: Preliminary Analysis and Experimental Design"
description: "Can safety decrease with model capability? Testing the hypothesis against the Failure-First corpus reveals a weak, confounded signal and motivates a targeted experiment using reasoning dilution attacks."
date: "2026-04-11"
reportNumber: 353
classification: "Research — Empirical Study"
status: "active"
author: "Failure-First Research Team"
tags: ["inverse-scaling", "safety-scaling", "methodology", "reasoning-dilution", "preliminary"]
audio: "https://cdn.failurefirst.org/audio/reports/353-inverse-scaling-preliminary.m4a"
draft: true
---

## Abstract

The NLM deep research wave surfaced a consistent cross-paper finding: for specific attack classes — layered custom encryption (LACE), reasoning dilution, stress-induced compliance — safety appears to *decrease* with model capability rather than increase. This inverts the foundational assumption behind most alignment spending. We tested the inverse scaling hypothesis against the Failure-First corpus (37,130 LLM-graded results across 5 model families). Pooled analysis at the dataset level does not support the inverse scaling claim: most datasets show *positive* scaling (bigger = safer) or a noisy flat trend. Matched-lineage analysis within four families (Gemma 3, Llama 3, Mistral Small, Qwen 3.5) reveals a weak inverse signal of +2–6 pp/decade in Gemma and Llama, a non-monotonic U-shape in Qwen 3.5, and a flat trend in Mistral. None of these signals rise to the 40–99 pp-scale deltas reported in the literature for reasoning dilution attacks. We conclude that the corpus cannot definitively test the inverse scaling claim because it consists predominantly of non-reasoning-attack data, and we design a targeted experiment (reasoning dilution via benign logic-puzzle prepending) to measure the effect directly.

---

## 1. Hypothesis

From the wave 1 research synthesis (see `assets/nlm/report-350/00_synthesis.md`), several independent sources converge on the same counterintuitive claim:

1. **LACE (Layered Custom Encryption)**: Attack success rate increases *with* model reasoning capability, up to 72% ASR on advanced open-source models.
2. **Reasoning dilution**: Prepending benign logic puzzles to harmful prompts dilutes the refusal direction in the residual stream, achieving 99% ASR on Gemini 2.5 Pro and 94% on GPT o4-mini.
3. **Alignment Illusion** (AutoControl Arena): Stress-test conditions lift baseline ASR from 21.7% to 54.5%, with *stronger* models surging more than weaker ones.
4. **Compliance Paradox**: RLHF-induced "hyper-compliance" makes models prioritize injected directives over ground-truth logic — more severely in larger models.
5. **Hot Mess phenomenon**: Failures become *more incoherent* (variance-dominated) as models scale, not more deceptively coherent.

These findings invert the scaling consensus. We formalize the claim as:

> **Inverse Scaling Hypothesis**: For specific attack classes exploiting reasoning capability, strict ASR is positively correlated with log(parameter_count) within a matched model lineage.

## 2. Method

We built `tools/stats/inverse_scaling_analysis.py`, which:

1. Loads graded traces from two sources: (a) `runs/*/flip_graded*.jsonl` files and (b) the `jailbreak_corpus.db` results table (LLM-graded verdicts only).
2. Extracts parameter count in billions from the model name or `parameter_count` field.
3. Groups traces into cells defined by `(attack_class, model_id)`.
4. For each attack class with at least 2 distinct parameter counts, regresses strict ASR against `log10(parameter_count)`.
5. Classifies the slope as `INVERSE_SCALING` (> +5 pp/decade), `POSITIVE_SCALING` (< −5 pp/decade), or `FLAT_OR_NOISY`.

Model lineages were hand-matched to control for training vintage confounds. Abliterated / uncensored / obliteratus-prefixed models were excluded because they have explicitly had safety training removed.

## 3. Results

### 3.1 Pooled Dataset-Level Analysis

| Dataset | n | Slope (pp/decade) | R² | Direction |
|---|---|---|---|---|
| obliteratus_telemetry | 25,625 | −5.17 | 0.011 | Positive scaling (weak) |
| obliteratus_runs | 6,687 | −7.59 | 0.024 | Positive scaling (weak) |
| jailbreak_archaeology | 694 | −12.73 | 0.843 | Positive scaling (strong) |
| benchmark_traces | 3,042 | +1.10 | 0.008 | Flat |

At the pooled level, **bigger is safer** across the corpus. The only dataset with strong R² is `jailbreak_archaeology`, which shows a clean negative slope (−12.7 pp/decade, R²=0.84) — consistent with the intuition that larger models resist historical jailbreaks better. The obliteratus telemetry datasets trend positive-scaling but with very weak fit, reflecting the noise introduced by mixing training vintages and abliteration levels.

### 3.2 Matched-Lineage Analysis

Filtering to same-generation, same-training lineages:

**Gemma 3 lineage (2 sizes)**
- 4B: n=32, strict ASR = 0.0%
- 27B: n=241, strict ASR = 6.2%
- **Trend**: mild inverse (+6 pp on the 4B→27B transition)

**Llama 3 lineage (2 sizes)**
- Llama 3.1 8B: n=39, strict ASR = 12.8%
- Llama 3.3 70B: n=617, strict ASR = 14.9%
- **Trend**: mild inverse (+2 pp on the 8B→70B transition)

**Qwen 3.5 base lineage (4 sizes)**
- 0.8B: 58.6% | 2B: 94.8% | 4B: 78.9% | 9B: 57.4%
- **Trend**: non-monotonic U-shape, 2B is the worst, ASR recovers at 9B

**Mistral Small lineage (2 variants at 24B)**
- 3.1: 5.1% | 3.2: 2.3%
- **Trend**: flat across versions

### 3.3 Interpretation

None of the matched-lineage signals approach the 40–99 pp deltas claimed for reasoning-dilution attacks in the literature. The Gemma and Llama inverse signals are real but small — consistent with the hypothesis that at the *pooled attack-class level*, safety training broadly scales, but specific reasoning-based attacks may still exhibit much larger inverse effects.

The Qwen 3.5 U-shape is interesting: it suggests that safety training is most effective at either very small scales (where the model cannot reason around it) or large scales (where it has capacity for robust refusal), and is weakest at mid-range sizes where the model has enough capability to follow attack instructions but not enough to resist them. This is a novel pattern that deserves targeted replication.

## 4. Why the Corpus Cannot Test the Hypothesis

The inverse scaling literature specifically claims the effect appears in:
- Reasoning-dependent attacks (logic puzzles, layered ciphers)
- Stress/temptation scenarios
- Long-horizon agentic tasks
- Multi-turn compliance drift

Our corpus is dominated by:
- Single-turn prompt-injection attacks
- Historical jailbreaks (DAN, persona)
- Format-lock and authority-gradient attacks

The mismatch between the claim's scope and our corpus's attack distribution means we cannot directly test the hypothesis from existing data. A null or weak result from pooled data is therefore not evidence against the claim — it is evidence that we need to *run the right experiment*.

## 5. Experimental Design: Reasoning Dilution on Matched Models

To test the inverse scaling hypothesis directly, we propose the following experiment (tracked separately as task G.3):

**Setup**:
- Pick 4-6 models spanning at least a decade of parameter counts within a single matched lineage (Qwen 3.5: 0.8B → 9B → 30B, or Llama 3: 8B → 70B → 405B).
- Start from the Failure-First standard corpus (~50 adversarial scenarios).
- Create two variants of each prompt: `(A)` baseline, `(B)` with a 5-10 line benign logic puzzle prepended as a "dilution" preamble.
- Run both variants against every model.
- Grade with the rubric-locked FLIP prompt (flip_prompt_v2).

**Metrics**:
- Δ ASR = (strict ASR with dilution) − (strict ASR baseline)
- Inverse scaling slope = regression of Δ ASR on log10(parameter_count)
- If the slope is positive, capability is the vulnerability.

**Prediction**: If the literature finding holds, Δ ASR should be larger for larger models. If it fails to replicate, the inverse scaling claim does not generalize to our model set and attack-type distribution.

Either outcome is publishable: a replication is a striking empirical finding, a failure-to-replicate is a methodological correction.

## 6. Limitations

- **Sample size**: 37,130 graded traces across 5 families is large but not balanced. Many cells have fewer than 50 traces.
- **Training vintage confound**: even within a "lineage," Llama 3.1 (8B) and Llama 3.3 (70B) are different training generations. Ideal comparison would fix training data and recipe.
- **Grader drift**: multi-grader variance in our FLIP pipeline is itself significant (see the Tier 1 grading fixes committed alongside this report).
- **Weak R²**: most slopes have R² below 0.05, meaning the signal is dwarfed by cell-level noise. This is why the matched-lineage analysis is more informative than the pooled view.

## 7. Conclusion

Preliminary analysis of the Failure-First corpus does not reveal the striking inverse scaling signal reported in the wave 1 research synthesis. The corpus shows pooled positive scaling (larger safer) and matched-lineage weak inverse signals (+2–6 pp/decade) in Gemma 3 and Llama 3. Neither result is strong enough to support the flagship claim that capability *drives* vulnerability. We therefore do not propose a flagship paper from existing data. Instead, we propose a targeted reasoning-dilution experiment (G.3) that measures the effect class the literature actually makes claims about, on a matched-lineage model set. If the experimental delta is large (>20 pp at 9B vs 0.8B), the flagship paper is written against that experimental data, not the pooled corpus.

---

*Report #350 — Failure-First Research Brief Series*
*Classification: Preliminary Analysis | Status: Active*
*Analysis tool: `tools/stats/inverse_scaling_analysis.py`*
*Raw output: `runs/inverse_scaling/initial_analysis.json`*
