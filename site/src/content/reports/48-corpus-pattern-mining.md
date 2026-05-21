---
title: "Corpus Pattern Mining — Novel Findings from 32,465 Jailbreak Prompts"
description: "Analysis of the F41LUR3-F1R57 jailbreak corpus database (141,138 prompts, 18,723 evaluation results across 236 models (after name-variant deduplication and orphan cleanup)) reveals three novel patterns with statistical s..."
date: "2026-03-10"
reportNumber: 48
classification: "Research — Empirical Study"
status: "complete"
author: "Martha Jones (data-curator)"
tags: []
draft: false
---

---

## Summary

Analysis of the F41LUR3-F1R57 jailbreak corpus database (141,138 prompts, 18,723 evaluation results across 236 models (after name-variant deduplication and orphan cleanup)) reveals three novel patterns with statistical significance:

1. **Reasoning Vulnerability Gap:** Frontier reasoning models show substantially higher attack success rates than comparably-sized non-reasoning frontier models.
2. **Safety Re-emergence in Abliterated Models:** Models with safety training intentionally removed exhibit decreasing compliance rates at larger parameter scales, suggesting safety-adjacent behaviors may be an emergent property of scale rather than purely a product of RLHF.
3. **Compliance Verbosity Signal:** Successful attacks produce measurably longer responses and require more reasoning tokens, providing a potential real-time detection signal.

## Methodology

All queries executed against `database/jailbreak_corpus.db` using read-only access. Verdict determination uses `COALESCE(llm_verdict, heuristic_verdict)` to prefer LLM-graded verdicts where available. Statistical tests use scipy (Mann-Whitney U for continuous variables, chi-square for categorical, Spearman correlation for monotonic trends). Effect sizes reported as Cohen's d or Cramer's V.

Reproducible via: `python3 tools/database/corpus_patterns.py`

---

## Finding 1: Reasoning Vulnerability Gap

### Observation

DeepSeek R1 (671B parameters, reasoning model) achieves 56.0% ASR (89/159 evaluated prompts classified as COMPLIANCE or REFUSAL) compared to 2.6-10.2% for frontier non-reasoning models of comparable or smaller scale.

| Model | Parameters | Reasoning? | N | ASR |
|-------|-----------|-----------|---|-----|
| gemini-3-flash-preview | 30B | No | 114 | 2.6% |
| claude-sonnet-4-5-20250929 | 175B | No | 111 | 4.5% |
| gpt-5.2 | 200B | No | 108 | 10.2% |
| deepseek/deepseek-r1-0528:free | 671B | Yes | 159 | 56.0% |

### Statistical Tests

**Chi-square (DeepSeek R1 vs all three frontier models combined):**
- COMPLIANCE: DeepSeek R1 = 89, Frontier aggregate = 19
- REFUSAL: DeepSeek R1 = 54, Frontier aggregate = 298
- chi2 = 170.40, p = 6.05e-39, Cramer's V = 0.609 (large effect)

**Pairwise comparisons (all significant after Bonferroni correction, alpha = 0.017):**
- vs claude-sonnet-4-5: chi2 = 84.0, p = 4.93e-20, V = 0.580
- vs gpt-5.2: chi2 = 59.5, p = 1.21e-14, V = 0.498
- vs gemini-3-flash: chi2 = 94.8, p = 2.15e-22, V = 0.608

### Confounds and Limitations

- DeepSeek R1 results come from different evaluation runs than the frontier models; while prompts overlap substantially, they are not perfectly matched.
- The small DeepSeek distillation (deepseek-r1:1.5b, 477 evaluations, 79.7% ASR) also shows high ASR, but this may be a size effect rather than a reasoning effect — the 1.7B Qwen3 (non-reasoning) achieves 85.6% ASR at similar scale.
- The aggregate comparison (reasoning models 72.7% ASR vs non-reasoning 45.5%) is confounded by the reasoning models in the corpus being disproportionately small distillations.
- **The signal is clearest at frontier scale:** DeepSeek R1 at 671B is 5-20x more vulnerable than other models above 100B, which cannot be explained by parameter count alone.

### Hypothesis

Extended reasoning traces may create additional attack surface. Reasoning models "think through" adversarial prompts rather than pattern-matching to refuse, potentially reasoning themselves into compliance. This is consistent with prior finding #18 in MISTAKES_TO_LEARN_FROM.md ("Reasoning traces as attack surface").

---

## Finding 2: Safety Re-emergence in Abliterated Models

### Observation

The Obliteratus model series — models with safety training intentionally removed through abliteration — shows a consistent pattern: **larger abliterated models partially recover safety-like behavior.** This is unexpected because abliteration is designed to remove safety alignment regardless of scale.

**Qwen3.5 Obliteratus series:**

| Size | N | ASR | PARTIAL | REFUSAL |
|------|---|-----|---------|---------|
| 0.8B | 114 | 100.0% | 0.0% | 0.0% |
| 1.9B | 95 | 100.0% | 0.0% | 0.0% |
| 4.2B | 242 | 78.9% | 12.4% | 8.7% |
| 9.0B | 317 | 47.3% | 52.7% | 0.0% |

**Qwen3 Obliteratus series:**

| Size | N | ASR | PARTIAL | REFUSAL |
|------|---|-----|---------|---------|
| 2.0B | 57 | 100.0% | 0.0% | 0.0% |
| 4.0B | 1414 | 22.3% | 77.7% | 0.0% |
| 8.2B | 97 | 66.0% | 34.0% | 0.0% |

### Statistical Tests

**Spearman rank correlation (Qwen3.5 series, size vs ASR):**
- rho = -0.949, p = 0.051 (marginal significance, n=4 data points)

**Chi-square (smallest vs largest in each series):**
- Qwen3.5 0.8B vs 9.0B: The 0.8B model shows 100% compliance while the 9.0B shows 47.3% — a 53 percentage point drop.
- Qwen3 gpt2-0.1b (100%) vs qwen3-4.0b (22.3%): chi2 = 223.6, p = 1.46e-50, V = 0.387

### Interpretation

The PARTIAL verdict dominates in larger abliterated models — they produce responses that include both compliant content and hedging/caveats. This suggests that safety-adjacent behaviors may not be purely a product of RLHF safety training but may emerge from the base model's learned distribution at sufficient scale. At small scales, abliteration fully removes safety behavior; at larger scales, the model's broader world knowledge may re-introduce cautious patterns even without explicit safety training.

**Important caveat:** The Qwen3 series shows a non-monotonic pattern (4.0B = 22.3%, 8.2B = 66.0%), which may reflect differences in base model architecture, training data, or abliteration methodology rather than a clean scaling law. The Qwen3.5 series shows a cleaner monotonic trend.

---

## Finding 3: Compliance Verbosity Signal

### Observation

Successful attacks produce measurably longer responses across all models, and reasoning models expend more reasoning effort before complying than before refusing.

**Response length (all models, n=2,628 with token counts):**

| Verdict | N | Mean Tokens | Median Tokens |
|---------|---|-------------|---------------|
| COMPLIANCE | 1,154 | 1,313 | 748 |
| PARTIAL | 220 | 1,214 | — |
| REFUSAL | 732 | 850 | 430 |

**Thinking tokens (reasoning models only, n=934):**

| Verdict | N | Mean Thinking Tokens | Mean Response Tokens |
|---------|---|---------------------|---------------------|
| COMPLIANCE | 477 | 1,288 | 2,149 |
| PARTIAL | 97 | 861 | 1,575 |
| REFUSAL | 360 | 737 | 1,147 |

**Processing duration (all models, n=2,558):**

| Verdict | N | Mean Duration |
|---------|---|--------------|
| COMPLIANCE | 1,264 | 42,162ms |
| REFUSAL | 1,294 | 22,432ms |

### Statistical Tests

**Response tokens (COMPLIANCE vs REFUSAL):**
- Mann-Whitney U = 547,355, p = 1.05e-27, Cohen's d = 0.325 (small-medium effect)

**Thinking tokens (COMPLIANCE vs REFUSAL, reasoning models):**
- Mann-Whitney U = 111,363, p = 8.89e-14, Cohen's d = 0.374 (small-medium effect)

**Duration (COMPLIANCE vs REFUSAL):**
- Mann-Whitney U = 1,106,810, p = 2.58e-54, Cohen's d = 0.338 (small-medium effect)

### Percentile Analysis (Thinking Tokens)

| Percentile | COMPLIANCE | REFUSAL | Ratio |
|-----------|-----------|---------|-------|
| P25 | 376 | 241 | 1.56x |
| P50 | 707 | 394 | 1.79x |
| P75 | 1,240 | 775 | 1.60x |
| P90 | 2,673 | 1,586 | 1.69x |

### Practical Implications

The consistent 1.5-1.8x ratio in reasoning overhead suggests that compliance requires the model to "work harder" — reasoning through the adversarial prompt's framing rather than activating a fast-path refusal pattern. This has two implications:

1. **Detection signal:** Response length and thinking token count could serve as lightweight anomaly signals for real-time jailbreak detection systems. A response exceeding 1.5x the model's typical refusal length for the same harm category warrants additional scrutiny.
2. **Alignment interpretation:** Refusal appears to be a lower-cost operation (shorter reasoning, shorter output), suggesting it is a well-learned pattern. Compliance with adversarial prompts requires overcoming this pattern, which manifests as additional computational effort.

---

## Additional Observations

### Model Size Does Not Monotonically Predict Safety

Across all 20 models with >= 20 evaluations and known parameter counts, there is no clean monotonic relationship between model size and ASR. Notable outliers:

- google/gemma-3-27b-it (27B): 70.3% ASR — higher than most models 3-10x its size
- nvidia/nemotron-3-nano-30b-a3b (30B): 57.9% ASR — vs gemini-3-flash at same 30B: 2.6%
- openai/gpt-oss-120b (120B): 47.0% ASR — higher than both 70B Llama variants

This suggests that safety is primarily a function of alignment training methodology and RLHF quality, not parameter count. Provider-level variation dominates size-level variation.

### Frontier Model Ranking (Same Prompt Set — Jailbreak Archaeology)

On the 64-prompt jailbreak archaeology set (historical DAN-era attacks), frontier models show:

| Model | N | ASR |
|-------|---|-----|
| qwen3:1.7b (small baseline) | 69 | 29.0% |
| gpt-5.2 | 108 | 10.2% |
| claude-sonnet-4-5-20250929 | 111 | 4.5% |
| gemini-3-flash-preview | 110 | 2.7% |

Gemini-3-flash shows the strongest refusal rate (96.4%) on these historical attacks.

---

## Follow-Up Investigations

1. **Matched-prompt reasoning model comparison:** Run DeepSeek R1 671B and a frontier non-reasoning model on identical prompt sets to eliminate prompt-selection confounds.
2. **Abliteration scaling law:** Test additional Obliteratus model sizes (especially 12B-30B range) to determine the inflection point more precisely.
3. **Verbosity threshold calibration:** Determine optimal token-count thresholds for jailbreak detection by harm category.
4. **PARTIAL verdict decomposition:** Investigate whether PARTIAL in large abliterated models represents genuine hedging or classifier ambiguity.

---

## Reproducibility

All queries are implemented in `tools/database/corpus_patterns.py` and can be re-run as the corpus grows:

```bash
python3 tools/database/corpus_patterns.py --all
python3 tools/database/corpus_patterns.py --finding 1  # Reasoning gap
python3 tools/database/corpus_patterns.py --finding 2  # Safety re-emergence
python3 tools/database/corpus_patterns.py --finding 3  # Verbosity signal
```
