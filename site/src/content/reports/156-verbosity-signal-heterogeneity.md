---
title: "Compliance-Verbosity Signal Is Model-Dependent, Not Universal"
description: "Report #48 established that COMPLIANCE responses are 54% longer than REFUSAL responses corpus-wide (p=1e-27), suggesting that response verbosity could serve..."
date: "2026-03-19"
reportNumber: 156
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. This report does not constitute safety certification guidance.

---

## Executive Summary

Report #48 established that COMPLIANCE responses are 54% longer than REFUSAL responses corpus-wide (p=1e-27), suggesting that response verbosity could serve as a lightweight jailbreak detection signal. This report tests whether that signal is uniform across models or an aggregate artifact.

Our analysis of 832 LLM-graded results across 12 models reveals that the compliance-verbosity ratio varies by 59-fold across models, from 0.52x (Devstral 24B: compliant responses are half the length of refusals) to 30.56x (GPT-OSS 120B: compliant responses are 31 times longer). After Bonferroni correction (k=12), 7 models show significant positive effects, but 5 show non-significant or inverted signals. Model size does not predict the ratio (Spearman rho=0.245, p>0.4). These results indicate that verbosity-based detection is model-architecture-dependent and requires per-model calibration to be reliable.

---

## 1. Introduction

A consistent finding in jailbreak research is that models produce longer responses when they comply with adversarial requests than when they refuse. This verbosity asymmetry has been proposed as a basis for lightweight, model-agnostic jailbreak detection: a simple token-count threshold could flag potential compliance without requiring semantic analysis.

Report #48 quantified this signal corpus-wide: COMPLIANCE responses are 54% longer (p=1e-27), and reasoning models think 75% longer on compliant responses (p=9e-14). However, the corpus-wide analysis pooled all models together, raising the question of whether the signal is a universal behavioral property or an aggregate driven by a subset of models with extreme ratios.

If the signal varies substantially across models -- or worse, inverts for some models -- then verbosity-based detection would be unreliable as a general heuristic and would require per-model calibration, substantially reducing its practical value.

## 2. Method

### 2.1 Data Selection

From `database/jailbreak_corpus.db`, we extracted all results meeting these criteria:
- LLM-graded verdict (not heuristic-only)
- Verdict is COMPLIANCE or REFUSAL (excluding PARTIAL, HALLUCINATION_REFUSAL, ERROR, BENIGN_QUERY)
- Non-OBLITERATUS source datasets (excluded source_dataset_id 35, 36, 42, 43, 44)
- Non-abliterated, non-uncensored models (excluded obliteratus, openai-community providers and abliterated/uncensored model name patterns)
- response_tokens > 0

This yielded 832 results (370 COMPLIANCE, 462 REFUSAL) across 27 distinct models.

### 2.2 Analysis

For each model with at least 10 results in each verdict category (12 models):

1. **Verbosity ratio:** Median response tokens for COMPLIANCE divided by median for REFUSAL
2. **Mann-Whitney U test** (two-tailed): non-parametric comparison of token distributions
3. **Cohen's d** (pooled standard deviation): standardized effect size
4. **Bonferroni correction:** alpha = 0.05 / 12 = 0.0042

Cross-model analyses:
- Spearman rank correlation between model parameter count and verbosity ratio (n=11 models with known parameters)
- Heterogeneity assessment: proportion of models showing significant positive, negative, or null effects

## 3. Results

### 3.1 Corpus-Wide Signal (Pooled)

Pooling all 12 qualifying models:
- COMPLIANCE median: 858 tokens (mean 1,677)
- REFUSAL median: 434 tokens (mean 927)
- Median ratio: 1.98x
- Mann-Whitney U: z=+8.86, p<1e-16
- Cohen's d: +0.461 (small-to-medium effect)

The pooled signal is robust and replicates the established Report #48 finding.

### 3.2 Per-Model Variation

The verbosity ratio ranges from **0.52x to 30.56x** -- a 59-fold variation:

| Model | Params | n_C | n_R | Ratio | Cohen's d | Bonferroni |
|-------|--------|-----|-----|-------|-----------|------------|
| Devstral 24B | 24B | 11 | 19 | 0.52x | -0.68 | ns |
| LFM 1.2B | 1.2B | 32 | 29 | 0.86x | +0.32 | ns |
| Llama 70B (free) | 70B | 46 | 27 | 1.08x | +0.33 | ns |
| DeepSeek R1-0528 | 671B | 33 | 54 | 1.15x | +0.41 | ns |
| Nemotron 9B | 9B | 39 | 36 | 1.17x | +0.30 | ns |
| Qwen3 1.7B | 1.7B | 40 | 54 | 2.27x | +0.46 | *** |
| Llama 70B | 70B | 54 | 81 | 3.27x | +1.02 | *** |
| Mistral-Large 123B | 123B | 23 | 49 | 3.83x | +1.62 | *** |
| GPT-4o-mini 8B | 8B | 14 | 12 | 5.76x | +0.87 | * |
| Nemotron 12B VL | 12B | 27 | 37 | 8.25x | +1.30 | *** |
| Nemotron 30B | 30B | 29 | 34 | 9.66x | +0.66 | *** |
| GPT-OSS 120B | 120B | 22 | 30 | 30.56x | +1.84 | *** |

### 3.3 Heterogeneity

- **7/12** (58%) models show statistically significant positive signal after Bonferroni correction
- **2/12** (17%) models show inverted direction (compliance *shorter* than refusal)
- **5/12** (42%) models show non-significant effects
- **0/12** models show significant *negative* effects (inverted models are not significant individually)

### 3.4 Model Size Does Not Predict Ratio

Spearman rho (parameter count vs verbosity ratio, n=11): **0.245**, t=0.760, df=9, p>0.4. Not significant. The verbosity ratio appears to be determined by model architecture and training methodology rather than scale.

### 3.5 Model Family Patterns

Descriptive observation (not formally tested due to small within-family samples):
- **Nvidia Nemotron family:** Consistently high ratios (1.17x, 8.25x, 9.66x). Compliant responses are extremely verbose.
- **OpenAI family:** High ratios (5.76x, 30.56x). Refusals are extremely terse.
- **Meta-Llama family:** Moderate ratios (1.08x, 3.27x). Signal varies between free and paid endpoints.
- **Mistralai family:** Mixed (0.52x for Devstral, 3.83x for Mistral-Large). Architecture differences within provider.

## 4. Discussion

**Descriptive claim:** The compliance-verbosity signal is not a uniform property of language models. It varies by 59-fold across the 12 models in our analysis, with two models showing inverted signals.

**Analytical claim:** The variation is consistent with different model families having distinct response patterns for compliance vs refusal. Models that produce terse refusals (e.g., OpenAI's "I can't help with that" pattern) and verbose compliance (detailed harmful content) show strong positive ratios. Models that produce explanatory refusals (e.g., Devstral explaining why a request is harmful) and concise compliance (raw code/data without explanation) show inverted ratios.

**Normative claim:** If confirmed at larger scale, these results suggest that verbosity-based jailbreak detection should not be deployed as a model-agnostic safety layer. Per-model calibration would be necessary, which substantially reduces the practical advantage over semantic analysis.

The finding also has implications for the CCS paper (Section 4.5), which currently cites the corpus-wide verbosity signal. The paper should note that this signal exhibits substantial model-level heterogeneity and should not be interpreted as a universal behavioral marker.

## 5. Limitations

1. **Sample size.** Per-model sample sizes range from 23 to 135. Devstral (n=30 total) and GPT-4o-mini (n=26) have particularly small samples. Wilson 95% CIs are reported in EP-55 for all proportions.

2. **Grader quality.** All verdicts are LLM-graded (methodology per CANONICAL_METRICS.md). Verdict assignment errors would contaminate token distributions, though systematic errors would affect all models equally and cannot explain the 59-fold cross-model variation.

3. **Prompt distribution.** All results come from the F41LUR3-F1R57 jailbreak corpus. A different prompt corpus (e.g., benign queries) might produce different ratios.

4. **Generalisability.** Only 12 models meet the minimum sample size threshold. The finding should be replicated on additional models before generalising to the full model landscape.

5. **PARTIAL exclusion.** This analysis excludes PARTIAL verdicts. Including them as a third category might reveal additional patterns but would require different statistical tests.

6. **Methodology.** LLM-only grading per CANONICAL_METRICS.md. COALESCE verdicts were not used to avoid mixing grading methodologies.

## 6. Conclusions and Recommendations

1. The compliance-verbosity signal is real corpus-wide (d=+0.461, p<1e-16) but is **not a universal per-model property**. It varies by 59-fold across models.

2. Two of 12 models show inverted signals. A verbosity-based detector calibrated on the corpus-wide ratio would fail silently on these models.

3. Model size does not predict the ratio (rho=0.245, ns). The variation appears architectural.

4. If confirmed by larger-scale testing, these results suggest verbosity-based jailbreak detection requires **per-model calibration** and should not be deployed as a model-agnostic safety layer.

5. The CCS paper should qualify the corpus-wide verbosity finding with a note on model-level heterogeneity (EP-55 reference).

---

## References

1. F41LUR3-F1R57. Report #48: Reasoning Model Vulnerability Analysis. 2026-02.
2. F41LUR3-F1R57. EP-55: Compliance-Verbosity Signal Heterogeneity. 2026-03-19.
3. F41LUR3-F1R57. CANONICAL_METRICS.md. Verified 2026-03-19.

---

## Appendix A: Reproducibility

SQL query to extract the raw data:

```sql
SELECT m.name, r.llm_verdict, r.response_tokens
FROM results r
JOIN evaluation_runs er ON r.evaluation_run_id = er.id
JOIN models m ON er.model_id = m.id
JOIN prompts p ON r.prompt_id = p.id
WHERE r.llm_verdict IN ('COMPLIANCE', 'REFUSAL')
AND p.source_dataset_id NOT IN (35, 36, 42, 43, 44)
AND m.provider NOT IN ('obliteratus', 'openai-community')
AND m.name NOT LIKE '%abliterated%'
AND m.name NOT LIKE '%Uncensored%'
AND r.response_tokens > 0;
```

---

*This report was produced as part of the Failure-First Embodied AI research
programme. All claims are scoped to the tested conditions and should not be
generalised without additional validation. See docs/CANONICAL_METRICS.md for
corpus-level numbers.*
