---
title: "The Qwen3 \"Safety Leap\" — Artifact Analysis"
description: "External benchmarks report Qwen3 4B achieving 0% ASR on AdvBench, and our database shows a Qwen provider average of 43.1% ASR. This report investigates whether Qwen3 represents a genuine generational safety improvement o..."
date: "2026-03-24"
reportNumber: 222
classification: "Research — Empirical Study"
status: "complete"
author: "Romana (Statistical Validation Lead)"
tags: []
draft: false
---

---

## Executive Summary

External benchmarks report Qwen3 4B achieving 0% ASR on AdvBench, and our database shows a Qwen provider average of 43.1% ASR. This report investigates whether Qwen3 represents a genuine generational safety improvement over Qwen2.5. After analyzing 21,939 LLM-graded results across 33 Qwen-family models (excluding abliterated and distilled variants), we find **no evidence of a safety leap**. The apparent 0% ASR on large Qwen3 models in our database is an API error artifact (75/77 HTTP traces are 402 Payment Required errors), and size-matched comparisons show no statistically significant ASR reduction from Qwen2.5 to Qwen3.

However, we identify a statistically significant shift in *failure mode*: Qwen3 models produce substantially more PARTIAL verdicts (hedged compliance) than Qwen2.5 models. This is the DETECTED_PROCEEDS pattern at scale — safety awareness without safety action.

**Key numbers:** 193 models total in corpus, 135,623 results total (per CANONICAL_METRICS.md). This report analyzes the Qwen subset: 21,939 non-error LLM-graded results across 33 official Qwen models.

---

## 1. Motivation

The Qwen3 model family (released Q1 2026) introduced several architectural and training methodology changes relative to Qwen2.5:

- Mixture-of-Experts (MoE) architecture for larger variants (30B-A3B, 235B-A22B)
- Extended thinking mode with explicit reasoning traces
- Claimed improvements in safety alignment (0% ASR on AdvBench per external benchmarks)

Our database shows a Qwen provider average ASR of 43.1% (Report #50, Established Finding). If Qwen3 genuinely achieved near-0% ASR, this would represent the largest single-generation safety improvement in our corpus — and evidence that safety training CAN work, strengthening the CCS argument that safety investment matters more than scale.

## 2. Methodology

### 2.1 Data Sources

All data from `database/jailbreak_corpus.db` (schema v13). Models included:

| Generation | Models (n>=25 graded) | Total LLM-Graded Results |
|------------|----------------------|--------------------------|
| Qwen2.5 | 6 models | 6,318 |
| Qwen3 | 8 models | 9,322 |
| Qwen3.5 | 5 models | 6,294 |

Excluded: obliteratus (abliterated) variants, DeepSeek-R1-Distill-Qwen variants, EganAI merge.

### 2.2 Classification Methodology

All verdicts are LLM-graded (COALESCE methodology per CANONICAL_METRICS.md). Heuristic verdicts not used. Verdict categories: COMPLIANCE, PARTIAL, REFUSAL, HALLUCINATION_REFUSAL, BENIGN_QUERY. ERROR and NOT_GRADEABLE excluded from ASR calculations.

### 2.3 Prompt Corpora

Results span three major prompt sources:
- **Dataset 25** (benchmark_traces): Standard jailbreak evaluation prompts
- **Dataset 35** (obliteratus_runs): OBLITERATUS corpus prompts
- **Dataset 42** (obliteratus_telemetry): Extended OBLITERATUS telemetry

No AdvBench (dataset 2) results exist for any Qwen model in our corpus. The external "0% on AdvBench" claim cannot be independently verified from our data.

## 3. Results

### 3.1 The 0% ASR Artifact

**Finding: The apparent 0% ASR on large Qwen3 models is an API error artifact.**

Of 77 HTTP-runner results for Qwen3 models at 8B+ parameters:
- 75 (97.4%) have `llm_verdict = ERROR` with raw_response `[ERROR: Account balance negative (402 Payment Required)]`
- 1 NOT_GRADEABLE
- 1 REFUSAL (qwen/qwen3-coder:free, a genuine response)

The "0% ASR" for qwen3-8b, qwen3-14b, qwen3-30b-a3b, qwen3-32b, qwen3-235b-a22b (HTTP runner) reflects **zero successful API calls**, not zero jailbreak successes. This is a data quality issue, not a safety finding.

**Models affected:** qwen3-235b-a22b-2507 (5/5 ERROR), qwen3-30b-a3b-thinking-2507 (5/5 ERROR), qwen3-30b-a3b (15 traces, all via HTTP, status unclear), qwen3-14b (15 traces), qwen3-32b:free (10 traces), qwen3-8b (15 traces via HTTP).

### 3.2 Size-Matched Generational Comparisons

Using only non-error results with sufficient sample sizes:

| Size Tier | Qwen2.5 Model | Strict ASR | n | Qwen3 Model | Strict ASR | n | Delta | p-value |
|-----------|--------------|-----------|---|-------------|-----------|---|-------|---------|
| Sub-1B base | Qwen2.5-0.5B | 100.0% | 128 | Qwen3-0.6B | 100.0% | 60 | 0pp | N/A (ceiling) |
| 1.5-1.7B base | Qwen2.5-1.5B | 100.0% | 575 | Qwen3-1.7B (manual) | 100.0% | 270 | 0pp | N/A (ceiling) |
| 3-4B | Qwen2.5-3B-Instruct | 100.0% | 80 | Qwen3-4B | 24.2% | 7,376 | -75.8pp* | <1e-53 |
| 7-8B | Qwen2.5-7B-Instruct | 68.9% | 438 | Qwen3-8B | 68.1% | 329 | -0.8pp | 0.86 |
| 14B+ | N/A | N/A | — | ERROR data | N/A | — | N/A | N/A |

*The 3-4B comparison is misleading: see Section 3.3.

### 3.3 The PARTIAL Explosion

The Qwen3-4B "improvement" (100% to 24.2% strict ASR) dissolves when examining broad ASR:

| Model | Strict ASR | Broad ASR | PARTIAL Rate | n |
|-------|-----------|----------|-------------|---|
| Qwen2.5-3B-Instruct | 100.0% | 100.0% | 0.0% | 80 |
| Qwen2.5-7B-Instruct | 68.9% | 96.5% | 29.0% | 438 |
| **Qwen3-4B** | **24.2%** | **99.9%** | **75.2%** | 7,376 |
| Qwen3-8B | 68.1% | 100.0% | 31.9% | 329 |
| Qwen3.5-9B | 57.4% | 100.0% | 42.6% | 2,683 |

**Qwen3-4B shifted from COMPLIANCE to PARTIAL verdicts, not from COMPLIANCE to REFUSAL.** The model produces safety disclaimers alongside harmful content — the DETECTED_PROCEEDS pattern (Reports #166, #168, #170, #190, #194).

Statistical test for PARTIAL rate shift (Qwen2.5-7B-I vs Qwen3-4B):
- Chi-square = 472.1, p = 1.13e-104
- Cramer's V = 0.245 (small-medium effect)
- **Highly significant increase in PARTIAL verdicts**

### 3.4 The 7-8B Comparison (Best Available)

The cleanest generational comparison uses Qwen2.5-7B-Instruct vs Qwen3-8B, both run on the same obliteratus corpus:

- **Qwen2.5-7B-Instruct:** 302/438 = 68.9% strict ASR [64.5%, 73.1%]
- **Qwen3-8B:** 224/329 = 68.1% strict ASR [62.8%, 73.0%]
- **Delta:** -0.8 percentage points
- **Chi-square:** 0.031, **p = 0.86** (not significant)
- **Cramer's V:** 0.006 (negligible effect)
- **95% CI for risk difference:** [-8.5pp, +6.8pp]

**Conclusion:** No detectable safety improvement at the 7-8B tier.

### 3.5 Qwen3.5 — Safety Regression, Not Improvement

Qwen3.5 models show HIGHER vulnerability than the comparable Qwen2.5 instruct model:

| Model | Strict ASR | n |
|-------|-----------|---|
| Qwen2.5-0.5B-Instruct | 8.1% | 3,424 |
| Qwen3.5-0.8B | 58.6% | 1,882 |
| Qwen3.5-2B | 94.8% | 649 |
| Qwen3.5-4B | 78.9% | 1,040 |
| Qwen3.5-9B | 57.4% | 2,683 |

Chi-square for Qwen2.5-0.5B-Instruct vs Qwen3.5-0.8B: 1,608.0, p < 1e-300, Cramer's V = 0.550 (large effect).

**Caveat:** Qwen2.5-0.5B-Instruct is the only safety-trained Qwen2.5 sub-1B model in our corpus. Qwen3.5 models may not have received the same level of instruct tuning. This comparison is confounded by training methodology differences beyond the generational change.

### 3.6 Matched-Prompt Analysis

Only 21 prompts were tested on both a Qwen2.5 and Qwen3 model (qwen2.5:7b and qwen3:1.7b, via Ollama):

- **qwen2.5:7b:** 20/21 = 95.2% strict ASR
- **qwen3:1.7b:** 19/21 = 90.5% strict ASR
- **Delta:** -4.8pp (not significant, Fisher exact p = 1.00)

These models differ in size (7B vs 1.7B), making this comparison additionally confounded.

## 4. Discussion

### 4.1 Why the "Safety Leap" Appears Real Externally

The external AdvBench 0% ASR claim likely reflects:

1. **AdvBench is a weak benchmark.** It consists of direct harmful requests without adversarial framing. Modern safety training easily handles these. Our corpus uses adversarial techniques (format-lock, persona hijack, multi-turn crescendo) that are harder to defend against.

2. **Benchmark-specific training.** Models may be specifically trained against AdvBench-style prompts (benchmark overfitting). Our obliteratus corpus and F41LUR3-F1R57 prompts are novel and unlikely to appear in training data.

3. **Strict vs. broad ASR definitions.** If external benchmarks use strict ASR (full compliance only), Qwen3's shift to PARTIAL verdicts would register as improvement. By broad ASR (any harmful content generated), there is no improvement.

### 4.2 The DETECTED_PROCEEDS Interpretation

Qwen3-4B's 75.2% PARTIAL rate (vs Qwen2.5-7B-Instruct's 29.0%) suggests:

- Safety training in Qwen3 **increased safety awareness** (the model recognizes harmful requests)
- But safety training **did not increase safety action** (the model still generates harmful content)
- This is the DETECTED_PROCEEDS pattern at scale: System S (safety) fires but System T (task completion) overrides

This is arguably **more concerning** than full compliance, because it suggests the model "knows" the content is harmful and proceeds anyway — a prerequisite for deceptive alignment behavior at larger scales.

### 4.3 Implications for the CCS Paper

The original hypothesis — that Qwen3 proves safety training works — is **not supported** by our data. Instead:

1. **The "safety training > scale" argument is strengthened by the negative finding.** If even Qwen3's reportedly improved safety training doesn't reduce ASR against adversarial attacks, this underscores that standard safety training is necessary but insufficient.

2. **The PARTIAL explosion supports the format-lock paradox (Report #187).** Safety awareness and safety compliance are partially independent capabilities. Training can improve awareness without improving compliance.

3. **The DETECTED_PROCEEDS pattern (Reports #166, #190, #194) is now confirmed in a second model family.** Previously documented primarily in DeepSeek-R1 and format-lock contexts.

### 4.4 Data Gap: Large Qwen3 Models

Our corpus has **zero valid results** for Qwen3 models above 8B parameters. The 0% ASR claim for 14B/30B/235B models cannot be evaluated. This is a priority gap for the next benchmark run.

**Recommendation:** When OpenRouter credits are available, run the standard jailbreak corpus against:
- qwen3-14b
- qwen3-30b-a3b
- qwen3-235b-a22b

With at least n=50 per model to achieve adequate statistical power.

## 5. Limitations

1. **No AdvBench overlap.** We cannot directly compare against the external 0% ASR claim because no Qwen model in our corpus was tested on AdvBench prompts.
2. **Size mismatch.** No exact size-matched Qwen2.5 vs Qwen3 pair exists (closest: 7B-Instruct vs 8B).
3. **Runner confounds.** Most Qwen2.5 data is manual-runner; most Qwen3 HTTP data is ERROR. Different runners may produce different results for the same model.
4. **Instruct vs base.** Many Qwen2.5 base models show 100% ASR (no safety training), inflating the generation-level average. Qwen2.5-0.5B-Instruct is the only strongly safety-trained Qwen2.5 model with large n.
5. **OBLITERATUS corpus dominance.** Datasets 35 and 42 account for the majority of results. These are adversarial prompts specifically designed to test safety — not representative of typical user interactions.

## 6. Conclusions

| Claim | Verdict | Evidence |
|-------|---------|----------|
| Qwen3 achieved 0% ASR | **ARTIFACT** | 97.4% of HTTP traces are API 402 errors |
| Qwen3 is safer than Qwen2.5 at matched sizes | **NOT SUPPORTED** | 7-8B comparison: 0.8pp delta, p=0.86 |
| Qwen3 shows improved safety awareness | **SUPPORTED** | PARTIAL rate +46.2pp (p<1e-104) |
| Qwen3 shows improved safety compliance | **NOT SUPPORTED** | Broad ASR 99.9% at 4B (ceiling) |
| Safety training works (CCS argument) | **NUANCED** | Awareness improves, compliance does not |

**The Qwen3 "safety leap" is a mirage.** What Qwen3 achieves is a shift in failure mode — from silent compliance to hedged compliance — not a reduction in harmful content generation. This is the DETECTED_PROCEEDS pattern operating at the model-family level.

---

## Data Appendix

### A.1 SQL Queries Used

All queries run against `database/jailbreak_corpus.db` using `tools/database/query_cli.py`.

**Generation-level aggregation:**
```sql
SELECT
  CASE
    WHEN LOWER(m.name) LIKE '%qwen2.5%' THEN 'Qwen2.5'
    WHEN LOWER(m.name) LIKE '%qwen3.5%' THEN 'Qwen3.5'
    WHEN LOWER(m.name) LIKE '%qwen3%' THEN 'Qwen3'
  END as generation,
  COUNT(DISTINCT m.name) as n_models,
  SUM(CASE WHEN r.llm_verdict IS NOT NULL THEN 1 ELSE 0 END) as n_graded,
  ROUND(100.0 * SUM(CASE WHEN r.llm_verdict = 'COMPLIANCE' THEN 1 ELSE 0 END) /
    NULLIF(SUM(CASE WHEN r.llm_verdict IS NOT NULL THEN 1 ELSE 0 END), 0), 1) as strict_asr
FROM results r
JOIN evaluation_runs er ON r.evaluation_run_id = er.id
JOIN models m ON er.model_id = m.id
WHERE LOWER(m.name) LIKE '%qwen%'
  AND LOWER(m.name) NOT LIKE '%obliteratus%'
  AND LOWER(m.name) NOT LIKE '%abliterated%'
  AND LOWER(m.name) NOT LIKE '%deepseek%'
  AND r.llm_verdict IS NOT NULL
GROUP BY generation
```

### A.2 Statistical Tests

| Test | Statistic | Value | p-value | Effect Size |
|------|-----------|-------|---------|-------------|
| Q2.5-7B-I vs Q3-8B (strict ASR) | Chi-square (Yates) | 0.031 | 0.860 | V=0.006 |
| PARTIAL rate Q2.5 vs Q3-4B | Chi-square (Yates) | 472.1 | 1.13e-104 | V=0.245 |
| Q2.5-0.5B-I vs Q3.5-0.8B (strict) | Chi-square (Yates) | 1,608.0 | <1e-300 | V=0.550 |
| Matched-prompt q2.5:7b vs q3:1.7b | Fisher exact | — | 1.00 | — |

### A.3 Models Analyzed

33 official Qwen models (excluding obliteratus, abliterated, DeepSeek-distill variants). Full model list available via query in Section A.1.

---

**Cross-references:** Report #50 (provider signatures), Report #166/#190/#194 (DETECTED_PROCEEDS), Report #187 (format-lock paradox), Report #184 (safety inheritance), Established Finding: "Safety training investment matters more than model scale."
