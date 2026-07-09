---

title: "Statistical Power Analysis for Key Comparisons"
description: "This report computes the statistical power we actually have for four key findings, identifying where our sample sizes are adequate and where they limit the conclusions we can draw. Two of four analyses have adequate powe..."
date: "2026-03-25"
reportNumber: 241
classification: "Research — Empirical Study"
status: "complete"
author: "Romana (Statistical Validation Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/241-statistical-power-analysis.m4a"
image: "https://cdn.failurefirst.org/images/reports/241-statistical-power-analysis.png"
---

---

## Summary

This report computes the statistical power we actually have for four key findings, identifying where our sample sizes are adequate and where they limit the conclusions we can draw. Two of four analyses have adequate power for the effect sizes of interest. Two require larger samples for conclusive results.

---

## 1. Qwen3 Benchmark Contamination (n=60 per condition)

### Question
What effect size can we detect at 80% power with n=60 per group?

### Analysis

Using the two-proportion z-test framework with alpha = 0.05 (two-sided) and power = 0.80:

| Baseline ASR | Minimum detectable delta | Detectable range |
|---|---|---|
| 20% | 20.5pp | Can detect ASR > 40.5% |
| 30% | 23.4pp | Can detect ASR > 53.4% or < 6.6% |
| 40% | 25.1pp | Can detect ASR > 65.1% or < 14.9% |
| 50% | 25.6pp | Can detect ASR > 75.6% or < 24.4% |

**Minimum detectable Cohen's h = 0.362** (small-to-medium effect).

### Interpretation

With n=60, we can detect large contamination effects (20+ percentage point differences) but cannot detect small effects (h < 0.20). If Qwen3's benchmark contamination produces a subtle 10pp ASR difference, we would need n >= 200 per group to detect it at 80% power.

**For the current comparison:** If Qwen3 shows 50% ASR on AdvBench prompts it was trained on vs 30% on novel prompts, n=60 is sufficient to detect this 20pp difference. If the effect is smaller (e.g., 35% vs 30%), n=60 is inadequate.

### Recommendation

n=60 is adequate for detecting large contamination effects but not for ruling out small ones. If the initial comparison shows no significant difference, this should be reported as "no evidence of large contamination effects (>20pp); smaller effects cannot be excluded with current sample size."

---

## 2. Provider Vulnerability Correlation (phi coefficients)

### Question
How many traces per provider pair do we need for stable phi coefficient estimates?

### Analysis

The standard error of the phi coefficient is approximately SE(phi) ~ 1/sqrt(n). For a 95% CI of specified width:

| Target precision (SE) | Required n per provider pair |
|---|---|
| +/- 0.20 (coarse) | 96 |
| +/- 0.10 (moderate) | 384 |
| +/- 0.05 (precise) | 1,537 |

### Current provider data (non-OBLITERATUS, LLM-graded)

| Provider | n | phi SE | Stable (n >= 384)? |
|---|---|---|---|
| ollama | 2,999 | 0.018 | Yes |
| google | 775 | 0.036 | Yes |
| nvidia | 621 | 0.040 | Yes |
| mistralai | 614 | 0.040 | Yes |
| meta-llama | 607 | 0.041 | Yes |
| openai | 418 | 0.049 | Yes |
| deepseek | 313 | 0.057 | No |
| liquid | 278 | 0.060 | No |
| anthropic | 216 | 0.068 | No |
| meta | 146 | 0.083 | No |
| stepfun | 117 | 0.092 | No |
| Qwen/qwen | 151 | 0.081 | No |
| xiaomi | 61 | 0.128 | No |

### Interpretation

Six providers (ollama, google, nvidia, mistralai, meta-llama, openai) have stable phi estimates. Pairwise correlations among these six are reliable (15 pairs, all with n >= 384 for the smaller of the two providers).

Seven providers (deepseek, liquid, anthropic, meta, stepfun, qwen, xiaomi) have unstable phi estimates. Any pairwise correlation involving these providers has 95% CIs wider than +/- 0.20, which is too imprecise for meaningful comparison.

### Recommendation

Report pairwise phi coefficients only for the six stable providers. For smaller providers, report ASR point estimates with Wilson CIs but do not compute pairwise correlations. To bring deepseek and anthropic into the stable zone, approximately 70-170 additional LLM-graded traces per provider are needed.

---

## 3. Format-Lock Capability Floor (4-14B gap)

### Question
What sample size do we need for the midrange (4-14B parameter) experiment?

### Analysis

Current data: n=23 (Claude), n=19 (Codex), n=21 (Gemini) from Report #51. These samples support only detection of large effects.

Required sample sizes for chi-square comparison (alpha=0.05, power=0.80):

| Effect size (Cohen's w) | Classification | n per group |
|---|---|---|
| 0.20 (small) | 196 | |
| 0.30 (medium) | 87 | |
| 0.50 (large) | 31 | |

**Specific hypothesis:** midrange (4-14B) format-lock ASR = 60% vs above-14B ASR = 35%.

- Cohen's h = 0.510
- Required n per group = 31
- With 5 models per group: 7 scenarios per model

**Alternative hypothesis:** midrange ASR = 45% vs above-14B ASR = 35%.

- Cohen's h = 0.204
- Required n per group = 190
- With 5 models per group: 38 scenarios per model

### Interpretation

The current n ~ 20 per model is only adequate if the capability floor produces a very large ASR difference (>25pp). If the midrange gap is subtle (10pp), we need approximately 10x more data.

### Recommendation

For the midrange experiment:
1. **Minimum design:** 5 models in 4-14B range, 5 models above 14B, 40 format-lock scenarios each = 400 total traces. This detects a 25pp+ difference.
2. **Recommended design:** Same model selection, 100 scenarios each = 1,000 total traces. This detects a 10pp difference.
3. **Model selection matters more than scenario count.** Selecting models that span the 4-14B range evenly (e.g., 4B, 7B, 8B, 12B, 14B) is more informative than adding scenarios to existing models.

---

## 4. DETECTED_PROCEEDS Override Rate (n=274)

### Question
How precise is our estimate of the DETECTED_PROCEEDS rate?

### Analysis

Two figures are in circulation: 34.2% (AGENT_STATE.md, corpus-wide) and 43.9% (mentioned in task brief). Computing Wilson score 95% CIs for both at n=274:

| Estimate | Wilson 95% CI | CI width | Margin of error |
|---|---|---|---|
| 34.2% | [28.8%, 40.0%] | 11.2pp | +/- 5.6pp |
| 43.9% | [38.2%, 49.8%] | 11.6pp | +/- 5.8pp |

### Required n for tighter bounds

| Target margin | Required n (at p=0.342) |
|---|---|
| +/- 5pp | 346 |
| +/- 3pp | 961 |
| +/- 2pp | 2,162 |
| +/- 1pp | 8,647 |

### Interpretation

The current n=274 gives us a margin of error of approximately +/- 5.6pp. This is adequate for establishing that DETECTED_PROCEEDS is a substantial phenomenon (lower bound 28.8%, well above zero) but too imprecise for fine-grained comparisons.

For example, we cannot distinguish between 34.2% and 43.9% at this sample size -- both CIs overlap substantially.

### Recommendation

1. **The current estimate is sufficiently precise for the qualitative claim** that "roughly one-third of compliant responses show safety awareness before proceeding."
2. **For quantitative comparisons** (e.g., does DETECTED_PROCEEDS rate differ by provider or model family), n=274 is inadequate. We would need n ~ 350 per subgroup.
3. **The discrepancy between 34.2% and 43.9%** should be resolved by clarifying measurement methodology, not by collecting more data -- these are likely computed on different denominators or with different pattern definitions.

---

## 5. Summary Table

| Finding | Current n | Detectable effect | Power assessment |
|---|---|---|---|
| Qwen3 contamination | 60/group | 20pp+ delta | Adequate for large effects only |
| Provider phi | 216-2,999 | Varies by provider | 6/13 providers stable |
| Format-lock 4-14B | ~20/model | 25pp+ delta | Underpowered; need 40-100/model |
| DETECTED_PROCEEDS | 274 | +/- 5.6pp margin | Adequate for existence; not for subgroup comparisons |

---

## 6. Statistical Notes

- All power calculations use two-sided alpha = 0.05 and target power = 0.80
- Cohen's h computed as 2 * arcsin(sqrt(p1)) - 2 * arcsin(sqrt(p2))
- Wilson score intervals used for all proportion CIs (preferred over Wald for rates near 0 or 1)
- phi coefficient SE approximated as 1/sqrt(n); exact SE depends on marginal distributions
- "Stable" threshold set at n >= 384 (corresponding to phi SE <= 0.05, giving 95% CI width <= 0.20)
