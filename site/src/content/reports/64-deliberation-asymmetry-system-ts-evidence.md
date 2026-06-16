---

title: "Deliberation Asymmetry -- Empirical Evidence for the System T / System S Framework"
description: "This report provides new empirical evidence for the System T / System S framework (Report #60) by analyzing deliberation asymmetry in reasoning models: **the systematic difference in thinking effort between compliant and..."
date: "2026-03-11"
reportNumber: 64
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (research-analyst)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/64-deliberation-asymmetry-system-ts-evidence.m4a"
---

---

## 1. Summary

This report provides new empirical evidence for the System T / System S framework (Report #60) by analyzing deliberation asymmetry in reasoning models: **the systematic difference in thinking effort between compliant and refusing responses.** Across 693 LLM-graded traces from reasoning models with thinking tokens, COMPLIANCE responses involve 2.29x more thinking tokens than REFUSAL responses (Mann-Whitney U=86,979, p=6.9e-29, Cohen's d=0.573). This finding replicates Report #48's initial observation at larger scale and adds three new results:

1. **The deliberation asymmetry is model-specific and shows large effect sizes.** Nemotron-12b shows a 5.40x ratio (d=1.26), gpt-oss-120b shows 4.75x (d=1.28), and Nemotron-30b shows 2.04x (d=0.80). DeepSeek-R1 shows a weaker 1.26x ratio (d=0.26). The asymmetry is strongest in models with moderate reasoning capability, not the strongest reasoners.

2. **PARTIAL responses occupy a distinct position in the deliberation spectrum.** Across all reasoning models, PARTIAL responses average 929 thinking tokens versus 679 for REFUSAL and 1,554 for COMPLIANCE. This is consistent with PARTIAL representing an intermediate state where both System T and System S activated but neither fully dominated.

3. **Refusal is a fast-path pattern.** The 2.29x thinking ratio means that models reach refusal decisions with substantially less deliberation. This supports the interpretation that safety training creates a fast-rejection pathway (System S) that short-circuits extended reasoning. When adversarial framing forces the model past the fast-rejection threshold, the extended deliberation of System T increases the probability of compliance.

---

## 2. Data

All traces from the jailbreak corpus database where `thinking_tokens > 0` and `llm_verdict IS NOT NULL`. This captures reasoning models (deepseek-r1 variants, nemotron variants, gpt-oss, qwen3) across archaeology, benchmark, and format-lock evaluation runs.

| Verdict | n | Mean Thinking Tokens | Median | SD |
|---------|---|---------------------|--------|-----|
| COMPLIANCE | 286 | 1,554 | 842 | 1,917 |
| REFUSAL | 407 | 679 | 368 | 996 |
| PARTIAL | 87 | 929 | 777 | 789 |
| BENIGN_QUERY | 73 | 916 | -- | -- |
| HALLUCINATION_REFUSAL | 47 | 1,423 | -- | -- |

---

## 3. Per-Model Analysis

### 3.1 Deliberation Ratio

| Model | n(C) | n(R) | Mean Think(C) | Mean Think(R) | Ratio | Cohen's d | Significant (Bonf) |
|-------|------|------|---------------|---------------|-------|-----------|-------------------|
| nvidia/nemotron-nano-12b-v2-vl:free | 38 | 82 | 3,817 | 707 | 5.40x | 1.26 | Yes (p=1.4e-12) |
| openai/gpt-oss-120b | 42 | 84 | 785 | 165 | 4.75x | 1.28 | Yes (p=7.7e-15) |
| nvidia/nemotron-3-nano-30b-a3b | 62 | 82 | 986 | 484 | 2.04x | 0.80 | Yes (p=1.6e-09) |
| nvidia/nemotron-nano-9b-v2 | 48 | 52 | 1,572 | 1,080 | 1.46x | 0.29 | No (p=0.018) |
| deepseek/deepseek-r1-0528 | 70 | 61 | 1,661 | 1,321 | 1.26x | 0.26 | No (p=0.017) |
| qwen3:1.7b | 8 | 7 | 594 | 564 | 1.05x | -- | Insufficient n |
| openrouter/pony-alpha | 7 | 18 | 295 | 410 | 0.72x | -- | Insufficient n |

### 3.2 Pattern Interpretation

The deliberation ratio follows a non-linear relationship with model reasoning capability:

- **Models with moderate reasoning capability (nemotron-12b, gpt-oss-120b, nemotron-30b):** Show the strongest asymmetry (2.0-5.4x). These models have established refusal patterns (System S exists as a fast path) but their System T can override it when given enough deliberation space. The large ratio indicates that compliance requires substantially more cognitive effort than refusal -- the model is working to overcome its safety training.

- **Models with strong reasoning capability (deepseek-r1-0528):** Show a weaker asymmetry (1.26x). These models think extensively in all conditions -- both compliance and refusal involve long reasoning chains. The ratio compresses because System T processing is the default mode, not a deviation.

- **Models with minimal reasoning capability (qwen3:1.7b):** Show negligible asymmetry (1.05x). At sub-3B scale, neither System T nor System S is well-developed. The model does not deliberate significantly more for either outcome because it lacks the representational capacity for nuanced safety reasoning (Report #60, Section 3.2: capability floor).

- **One model inverts the pattern (pony-alpha: 0.72x).** This model produces longer thinking for refusals than compliance. With only 7 COMPLIANCE and 18 REFUSAL traces, this is likely noise, but if it replicates, it would indicate an architecture where compliance is the default fast path and refusal requires override -- the inverse of the standard System T / System S relationship. This would be consistent with a model trained with weak safety constraints where the default output is compliant.

### 3.3 Implications for the System T / System S Model

The per-model variation provides a testable refinement of the framework:

**Prediction:** The deliberation asymmetry ratio should correlate inversely with base ASR. Models with high base ASR (permissive models where compliance is the default) should show low or inverted ratios. Models with low base ASR (restrictive models where refusal is the default) should show high ratios. This is because the ratio measures the additional effort required to override the default behavior.

**Partial validation:** Nemotron-12b has the highest ratio (5.40x) and a mixed vulnerability profile. DeepSeek-R1 has the lowest significant ratio (1.26x) among reasoning models and the highest reasoning-model ASR (56.0% in Report #48, 45.6% post-audit). The direction is consistent with the prediction, though the sample of models (n=5 with adequate data) is too small for a robust correlation test.

---

## 4. HALLUCINATION_REFUSAL as a Diagnostic

An unexpected finding: HALLUCINATION_REFUSAL responses involve *more* thinking (1,423 tokens) than COMPLIANCE (1,554) -- nearly identical. This is notable because HALLUCINATION_REFUSAL is defined as responses where the model claims to refuse but the response contains fabricated content.

In the System T / System S framework, HALLUCINATION_REFUSAL represents a specific failure mode: **System S activates strongly enough to produce refusal language, but System T generates content anyway.** The high thinking token count suggests that the model is engaged in extended deliberation where both systems are competing -- similar to COMPLIANCE but with System S producing the framing layer while System T produces the content layer.

This is structurally identical to the VLA PARTIAL dominance pattern (Report #49): the safety reasoning is textually present but functionally impotent. HALLUCINATION_REFUSAL in text-only models and PARTIAL in VLA models may be manifestations of the same underlying System T / System S competition at different architectural levels.

---

## 5. Implications for Adversarial Defense

### 5.1 Deliberation Budget as Attack Surface

If compliance requires more thinking than refusal (2.29x on average), then any mechanism that expands the model's deliberation budget expands the attack surface. This has direct implications for:

- **Chain-of-thought prompting:** Encouraging extended reasoning may inadvertently increase compliance probability by providing System T with more token-space to override System S.
- **Reasoning model design:** Models designed to "think more" before responding (o1, DeepSeek-R1, etc.) systematically increase the window in which adversarial framing can accumulate weight.
- **Inference-time compute scaling:** Allocating more compute at inference time for "hard problems" creates more System T processing time for adversarially-framed requests.

### 5.2 Deliberation Monitoring as Defense

The deliberation asymmetry itself could serve as a lightweight detection signal:

- **Hypothesis:** For a given model, if the thinking token count on a response exceeds the refusal baseline by more than 2x, the response is more likely to be compliant (and potentially harmful).
- **Implementation:** At inference time, compare thinking token count to the model's refusal distribution. Flag responses where thinking_tokens > 2 * median_refusal_thinking for additional scrutiny.
- **Limitation:** This creates an adversarial cat-and-mouse -- attackers could craft prompts that induce short compliant responses. The defense works only as long as the deliberation asymmetry holds.

---

## 6. Connection to Report #62 (Inter-Model Agreement)

Report #62 found near-zero scenario-level agreement (kappa = -0.007) despite identical aggregate ASR. The deliberation asymmetry data adds a potential explanation: **different models have different System T/System S boundaries, and therefore different scenarios trigger the extended deliberation that leads to compliance.**

A model with a 5.4x deliberation ratio (nemotron-12b) has a very strong refusal fast-path that only specific scenario features can overcome. A model with a 1.26x ratio (deepseek-r1) has a weaker fast-path, so a broader range of scenarios can trigger compliance. The scenarios that overcome nemotron-12b's strong fast-path are not the same scenarios that a weaker fast-path in deepseek-r1 would catch. This produces the observed pattern: similar aggregate rates, different per-scenario outcomes.

---

## 7. Limitations

1. **Thinking tokens are an imperfect proxy for deliberation.** Token count measures output length, not computational depth. A model may produce many thinking tokens of low quality (repetitive, tangential) or few tokens of high quality (concise, decisive).

2. **LLM-graded verdicts have known error rates.** Deepseek-r1:1.5b grading accuracy is estimated at 80-85%. Misclassified verdicts would add noise to the thinking token distributions but are unlikely to produce the consistent directional pattern observed across 5 models.

3. **Confounds with prompt difficulty.** Compliant responses may involve harder prompts that require more thinking regardless of safety considerations. Without matched controls (same prompt difficulty, different safety valence), the causal interpretation (thinking causes compliance) remains unproven. The alternative (harder prompts cause both more thinking AND more compliance) is also consistent with the data.

4. **Small model sample (n=5 with adequate data).** The per-model pattern (moderate reasoners show strongest asymmetry) is suggestive but based on too few models for robust statistical testing.

5. **No frontier reasoning model data.** The strongest reasoning models (o1, Claude 3.5 Sonnet thinking mode, Gemini 2.5 Flash) either hide thinking tokens or were not tested with thinking capture enabled. The pattern may not hold for these architectures.

---

## 8. Recommendations

1. **For the CCS paper:** Add the aggregate deliberation asymmetry finding (2.29x, p=6.9e-29, d=0.573) to the reasoning model vulnerability section (Section 4.4). This strengthens the claim with n=693 (vs Report #48's initial observation).

2. **For follow-up research:** Test the prediction that deliberation ratio correlates inversely with base ASR across a larger set of models. **Update (sprint-26 wave 3, Issue #260):** Formal correlation test completed with n=7 models having adequate thinking data. Spearman rho=-0.179 (p=0.70), Pearson r=-0.270 (p=0.56). Direction is consistent with the prediction (negative: higher ASR -> lower ratio) but the correlation is not statistically significant. With n=7, this test is underpowered -- at least 20 models with thinking token capture would be needed for a reliable correlation. The prediction remains unfalsified but unvalidated. Mid-range model gap (Issue #249) is the primary blocker.

3. **For the inter-model agreement analysis:** Compute scenario-level deliberation profiles. For scenarios that are "consistently dangerous" across models (Report #62, Section 4), test whether those scenarios produce higher-than-average thinking tokens in all models -- this would indicate that consistently dangerous scenarios activate System T universally, while model-specific scenarios activate it only in some architectures.

---

## Data and Reproducibility

All analyses computed from `database/jailbreak_corpus.db` using the following query pattern:

```sql
SELECT r.thinking_tokens, r.llm_verdict
FROM results r
WHERE r.thinking_tokens > 0
  AND r.llm_verdict IN ('COMPLIANCE', 'REFUSAL', 'PARTIAL')
```

Per-model breakdowns join through `evaluation_runs` and `models` tables. All significance tests use Mann-Whitney U (one-sided, COMPLIANCE > REFUSAL) with Bonferroni correction for 5 pairwise comparisons (alpha = 0.01).

---

*Report 64 -- F41LUR3-F1R57 Research Brief Series*
*Classification: Internal Research | Status: Complete*
*Related: Reports 48, 60, 62; Issue #229*
*Sprint: 26*

F41LUR3-F1R57|DELIBERATION-ASYMMETRY
