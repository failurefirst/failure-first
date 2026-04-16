---
title: "Safety Training Return on Investment: Provider Identity Explains 57x More ASR Variance Than Model Scale"
description: "We quantify the relative contribution of model scale (parameter count) versus provider identity (safety training investment) to jailbreak attack success..."
date: "2026-03-19"
reportNumber: 164
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---

# Report #164: Safety Training Return on Investment

## Summary

We quantify the relative contribution of model scale (parameter count) versus provider identity (safety training investment) to jailbreak attack success rates (ASR). Using LLM-graded verdicts across 21 models from 12 providers, we find that provider identity explains 65.3% of ASR variance (eta-squared) while parameter count explains 1.1% (R-squared). Provider identity is 57.5x more predictive. Scale-adjusted residuals identify Google (-16.3pp) and Anthropic (-13.8pp) as over-invested in safety, and Nvidia (+13.9pp) as under-invested. No evidence for diminishing returns to safety training: the regression of ASR on log2(params) is flat (slope = -0.006, p = 0.64).

## Motivation

The Established Finding in AGENT\_STATE.md states: "Safety training investment matters more than model scale for jailbreak resistance" (Report #50). However, this was stated qualitatively via provider cluster analysis, without a formal variance decomposition. This report provides the quantitative evidence: exactly how much more does provider identity matter than scale?

## Data

- **Source:** `database/jailbreak_corpus.db`, schema v13
- **Grading:** LLM-graded verdicts only (strict ASR = COMPLIANCE / evaluable)
- **Evaluable verdicts:** COMPLIANCE + PARTIAL + REFUSAL + HALLUCINATION\_REFUSAL
- **Inclusion:** Models with known parameter counts, n >= 20 evaluable results per model
- **Exclusions:** Abliterated variants (obliteratus), community fine-tunes, uncensored HuggingFace uploads, ibm-granite (100% ASR uncensored)
- **Final sample:** 21 models from 12 providers, parameter range 1.2B to 671B

## Analysis 1: Regression of ASR on Scale

OLS regression: strict\_ASR = 0.272 - 0.006 * log2(parameter\_count\_B)

| Statistic | Value |
|-----------|-------|
| Slope | -0.006 per doubling |
| R-squared | 0.011 |
| Pearson r | -0.107 |
| p-value | 0.640 |
| n (models) | 21 |

**Interpretation:** Parameter count explains 1.1% of ASR variance. The relationship is not statistically significant. Doubling model parameters predicts a 0.6 percentage point decrease in ASR -- a negligible effect.

## Analysis 2: Variance Decomposition

| Factor | Variance Explained | Ratio to Scale |
|--------|-------------------|----------------|
| Provider identity (eta-squared) | 65.3% | 57.5x |
| Parameter count (R-squared) | 1.1% | 1.0x |
| Residual (within-provider, within-scale) | 33.6% | -- |

Provider identity alone explains nearly two-thirds of all ASR variance in the corpus. The residual 33.6% reflects within-provider variation across model sizes, attack types, and prompt selection effects.

## Analysis 3: Scale-Adjusted Provider Residuals

The regression line predicts each model's "expected" ASR from its parameter count alone. The residual = actual ASR - predicted ASR. Negative residuals mean the provider achieves lower ASR than its model sizes would predict -- evidence of additional safety training investment.

Provider-level weighted average residuals (n >= 50 total evaluable for ranked claims):

| Provider | Total n | Weighted Residual | 95% CI on ASR |
|----------|---------|-------------------|---------------|
| google | 163 | -16.3pp | [6.0%, 13.4%] |
| anthropic | 133 | -13.8pp | [5.2%, 15.1%] |
| mistralai | 234 | -3.1pp | [15.2%, 24.2%] |
| ollama | 728 | +0.0pp | [23.6%, 30.0%] |
| openai | 207 | +3.9pp | [22.3%, 32.1%] |
| liquid | 116 | +4.9pp | [24.1%, 40.8%] |
| meta-llama | 263 | +5.3pp | [23.7%, 34.8%] |
| deepseek | 110 | +8.4pp | [22.1%, 39.2%] |
| nvidia | 247 | +13.9pp | [33.1%, 50.5%] |

**Over-invested providers** (negative residual > 10pp): Google and Anthropic achieve ASR 13-16 percentage points lower than their model sizes would predict.

**Under-invested providers** (positive residual > 10pp): Nvidia achieves ASR 14 percentage points higher than its model sizes would predict.

**At-baseline providers:** Most others fall within 10pp of the regression line.

## Analysis 4: Within-Provider Scale Curves

**OpenAI** shows the expected pattern: ASR decreases monotonically with scale (8B: 51.7%, 120B: 40.7%, 200B: 15.3%). Each model generation receives incremental safety training.

**Mistralai** shows an inverted pattern: the 7B model has 0% ASR (n=21, possibly capability-floor) while the 123B model has 29.5% ASR. Larger Mistral models are more capable of parsing and complying with adversarial prompts.

**Nvidia** shows a flat pattern: 9B (39.8%), 12B (35.9%), 30B (40.8%). Nemotron models appear to receive approximately constant safety training across the size range tested.

## Analysis 5: Risk Ratios

Among providers with n >= 50:
- Most resistant: Anthropic (mean ASR = 9.0%)
- Least resistant: Nvidia (mean ASR = 38.8%)
- Risk ratio: 4.3x (an attack that succeeds on 9% of Anthropic prompts succeeds on 39% of Nvidia prompts)

## Caveats

1. **Prompt selection bias.** Different providers were tested against partially different prompt sets. Cross-provider comparisons are partially confounded by prompt difficulty.
2. **Small samples for some providers.** Xiaomi (n=21), qwen (n=21) results are preliminary with wide CIs.
3. **MoE parameter counts.** DeepSeek R1 (671B total, ~37B active) is coded at total params. Using active params would reduce its residual.
4. **OpenAI open-source models inflate aggregate.** gpt-oss-120b (40.7%) and gpt-4o-mini (51.7%) are not flagship safety-trained models; they inflate OpenAI's aggregate.
5. **Mistral-7B 0% ASR.** Likely capability-floor (model too small to parse complex prompts), not safety training.
6. **Regression power.** n=21 models means low power to detect small scale effects. A true 2-3pp per doubling effect would require ~60+ models to detect at alpha=0.05.

## Conclusions

1. **Provider identity explains 57.5x more ASR variance than parameter count** (eta-squared 0.653 vs R-squared 0.011). This is the strongest quantitative evidence that safety training investment, not scale, determines jailbreak resistance.

2. **Google and Anthropic are the most safety-efficient providers**, achieving 13-16pp lower ASR than their model sizes predict. Nvidia is the least safety-efficient, achieving 14pp higher ASR than predicted.

3. **No evidence for diminishing returns to safety training.** The regression is flat -- safety is approximately orthogonal to scale. Providers that invest in safety achieve it at any model size.

4. **Within-provider patterns are heterogeneous.** OpenAI improves with scale; Mistralai and Nvidia do not. This suggests safety training methodology varies across product lines within a provider.

## Reproducibility

```bash
python tools/stats/safety_roi_analysis.py
python tools/stats/safety_roi_analysis.py --json
```

Evidence package: `docs/analysis/EP-57_safety_training_roi.md`
