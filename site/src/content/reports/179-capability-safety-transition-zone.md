---
title: "The Capability-Safety Transition Zone: Where Model Scale Begins to Matter"
description: "Does model parameter count predict jailbreak attack success rate (ASR), and if so, where is the transition zone between capability-limited compliance..."
date: "2026-03-23"
reportNumber: 179
classification: "Research — Empirical Study"
status: "complete"
author: "Failure-First Research Team"
tags: []
draft: false
---

# Report #179: The Capability-Safety Transition Zone

## Research Question

Does model parameter count predict jailbreak attack success rate (ASR), and if so, where is the transition zone between capability-limited compliance (models too small to refuse) and safety-training-mediated refusal?

## Prior Hypothesis

Report #51 and the Established Findings section of AGENT_STATE.md documented a "capability-floor hypothesis": below approximately 3B parameters, all attacks succeed regardless of type (capability floor). Above approximately 7B, only specific attack types like format-lock maintain elevated ASR. The 3B-7B range was hypothesized as a critical transition zone where safety training begins to dominate.

## Methodology

Queried the jailbreak corpus database for all non-OBLITERATUS results where models have known parameter counts. Used COALESCE(llm_verdict, heuristic_verdict) as the verdict source. Binned models into 8 parameter-count ranges and computed strict ASR (COMPLIANCE only), broad ASR (COMPLIANCE + PARTIAL), and functionally dangerous ASR (adding HALLUCINATION_REFUSAL). Wilson 95% confidence intervals computed for all bin-level rates.

**Exclusions:** OBLITERATUS models and OBLITERATUS source datasets excluded (abliterated models have artificially elevated ASR that would confound scale analysis). Models without parameter_count metadata excluded.

**Tool:** `python tools/analysis/capability_safety_curve.py --detail`

## Data Summary

| Bin | n (results) | Models | Strict ASR | 95% CI | Broad ASR |
|-----|-------------|--------|-----------|--------|-----------|
| < 2B | 1,339 | 3 | 36.3% | [33.8-38.9%] | 53.2% |
| 2-3B | 250 | 3 | 18.0% | [13.7-23.2%] | 25.6% |
| 3-7B | 39 | 5 | 20.5% | [10.8-35.5%] | 28.2% |
| 7-12B | 272 | 9 | 35.3% | [29.9-41.1%] | 45.6% |
| 12-30B | 553 | 11 | 18.1% | [15.1-21.5%] | 30.4% |
| 30-70B | 324 | 3 | 32.7% | [27.8-38.0%] | 55.2% |
| 70-200B | 486 | 4 | 20.8% | [17.4-24.6%] | 28.0% |
| 200B+ | 156 | 6 | 41.7% | [34.2-49.5%] | 54.5% |

**Total: 3,419 evaluable results across 44 models with known parameter counts.**

## Key Findings

### 1. The Simple Capability-Floor Hypothesis Is Not Supported

The data does not show a monotonic decline in ASR as model scale increases. Instead, the curve oscillates: 36.3% at <2B, drops to 18.0% at 2-3B, then rises back to 35.3% at 7-12B, drops again at 12-30B, rises at 30-70B, drops at 70-200B, and rises again above 200B.

Spearman rank correlation between bin midpoint and strict ASR: rho = -0.286 (n=8 bins). This is a weak negative correlation -- scale alone explains very little of the ASR variance.

### 2. The 2-3B Range Appears to Be a Local Safety Minimum, Not a Capability Floor

The 2-3B bin (n=250, 3 models) shows 18.0% strict ASR -- substantially lower than the <2B bin (36.3%). This contradicts the capability-floor hypothesis, which predicted that smaller models should be more vulnerable. The dominant model in this bin is llama3.2:latest (n=241, 18.7% strict ASR), which has effective safety training despite its small size.

This suggests that even at 3B, safety training can produce meaningful refusal behavior. The issue is not that 3B models "cannot refuse" but rather that some 3B models have received better safety training than others.

### 3. Provider Effects Dominate Scale Effects

Within the same parameter-count bin, model-level ASR varies dramatically:

- **7-12B bin:** openai/gpt-4o-mini at 51.7% vs openai/gpt-4.1-mini at 0.0% vs meta-llama/llama-3.1-8b-instruct at 0.0% (all ~8B)
- **12-30B bin:** nvidia/nemotron-3-nano-30b-a3b at 41.1% vs gemini-3-flash-preview at 12.3% vs google/gemini-2.5-flash at 0.0% (all 30B)
- **70-200B bin:** claude-sonnet-4-5-20250929 at 7.8% vs openai/gpt-oss-120b at 41.8% (both >120B)

The within-bin variance exceeds the between-bin variance. This is consistent with the Established Finding that "safety training investment, not parameter count, is the primary determinant of jailbreak resistance."

### 4. The 200B+ Bin Shows Elevated ASR -- A Composition Effect

The 200B+ bin shows the highest strict ASR (41.7%) in the entire dataset. This is counterintuitive but explained by model composition: deepseek/deepseek-r1-0528 (671B, 41.9% strict ASR, n=148) dominates this bin. DeepSeek R1 is a known permissive model. The four other 671B models have n=1 each and are statistically meaningless. This demonstrates the danger of confounding model identity with model scale.

### 5. The 3-7B "Transition Zone" Has Insufficient Data

The 3-7B bin contains only 39 results across 5 models, with most having n < 10. The confidence interval ([10.8-35.5%]) is very wide. Several models in this bin (arcee-ai/trinity-mini with n=1, gemma-3-4b-it with n=5) do not provide enough data for reliable ASR estimation. This bin is the weakest point in the analysis.

### 6. Format-Lock Data Is Too Sparse for Scale Analysis

Only 11 format-lock results (technique_id=51) exist across models with known parameter counts. This is insufficient for any binned analysis. The format-lock capability-floor hypothesis from Report #51 remains a plausible hypothesis but cannot be tested with the current DB-resident data at scale resolution.

## Revised Model

The data suggests replacing the two-regime model (capability floor / safety floor) with a **provider-dominant model**:

1. **Provider safety investment** is the primary determinant of ASR (confirmed by Report #50, Established Findings).
2. **Scale provides the capacity for safety training to take effect**, but does not guarantee it. A well-trained 3B model (llama3.2) can outperform a poorly trained 120B model (gpt-oss-120b) on refusal.
3. **The transition zone is not at a fixed parameter count** but rather depends on the intersection of (a) model architecture, (b) safety training budget, and (c) safety training methodology.
4. **Below approximately 1.5B, capability constraints may genuinely limit refusal quality** -- deepseek-r1:1.5b shows elevated HALLUCINATION_REFUSAL (31.2% of all its verdicts are HR), suggesting it attempts to refuse but produces incoherent refusals. This is consistent with a capability floor at the very low end.

## Limitations

- **Model count per bin is low.** Only 3-11 models per bin, with several bins dominated by 1-2 models.
- **Parameter counts are approximate.** Several models have estimated, not official, parameter counts.
- **Confounding variables.** Models differ in architecture (dense vs MoE), training data, safety fine-tuning approach, and quantization -- not just parameter count.
- **Verdict methodology.** COALESCE(llm, heuristic) mixes two grading methodologies with known disagreement (kappa=0.126). Models with only heuristic grading may have inflated ASR (heuristic over-report rate: 79.9%).
- **Selection bias.** Models with known parameter counts are a non-random subset of the full 190-model corpus. Many OpenRouter models lack parameter count metadata.
- **No controlled experiment.** This is observational data. A proper capability-floor study would require same-architecture, same-training models at different scales (like the OBLITERATUS series, which was excluded here because it tests abliterated, not normally-trained, models).

## Recommendations

1. **Do not cite a fixed "3B-7B transition zone"** in the CCS paper or external submissions. The data does not support a clean transition at any specific parameter count.
2. **Continue citing "safety training investment > scale"** as the dominant finding (Report #50). This analysis reinforces that conclusion.
3. **The OBLITERATUS abliterated series** (0.8B to 9B, same architecture with safety removed) remains the best available evidence for a capability-related safety re-emergence effect. That finding (rho=-0.949, p=0.051) should be cited as the capability-floor evidence, not this cross-model analysis.
4. **If pursuing this question further**, the ideal experiment is a controlled scale sweep: same model family, same safety training, different parameter counts (e.g., Llama 3.2 1B vs 3B vs 8B vs 70B, all with identical safety training vintage).

## Data Artifacts

- Tool: `tools/analysis/capability_safety_curve.py`
- JSON output: `python tools/analysis/capability_safety_curve.py --json`
- Per-model detail: `python tools/analysis/capability_safety_curve.py --detail`
