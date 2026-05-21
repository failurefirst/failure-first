---
title: "HALLUCINATION_REFUSAL as the Text-Only Analog of VLA PARTIAL"
description: "This report tests the hypothesis from Report #64 that HALLUCINATION_REFUSAL in text-only models is structurally equivalent to PARTIAL in VLA models. Both verdicts describe the same System T / System S dynamic: safety rea..."
date: "2026-03-11"
reportNumber: 65
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (research-analyst)"
tags: []
draft: false
---

---

## 1. Summary

This report tests the hypothesis from Report #64 that HALLUCINATION_REFUSAL in text-only models is structurally equivalent to PARTIAL in VLA models. Both verdicts describe the same System T / System S dynamic: safety reasoning produces refusal or hedging language (System S output) while task-execution generates the requested content anyway (System T output).

The evidence supports this equivalence across three dimensions:

1. **Thinking tokens:** HALLUCINATION_REFUSAL (mean 1,423, n=47) is statistically indistinguishable from COMPLIANCE (mean 1,558, Mann-Whitney p=0.21, d=-0.068) and significantly different from REFUSAL (mean 757, p=1.85e-4, d=+0.414).

2. **Response tokens:** HALLUCINATION_REFUSAL (mean 1,835, n=84) is statistically indistinguishable from COMPLIANCE (mean 1,676, p=0.46, d=+0.087) and significantly different from REFUSAL (mean 865, p=8.85e-11, d=+0.614).

3. **Per-model distribution:** Models that produce high PARTIAL rates (Qwen3-4B: 75.9%, Qwen3.5-9B: 46.7%) tend to be non-reasoning models, while models with high HALLUCINATION_REFUSAL rates tend to be reasoning or mixed models (qwen3:1.7b: 10.0%, nemotron-9b: 11.6%, nemotron-12b: 9.9%). This suggests the same underlying System T / System S competition manifests differently depending on whether the model has extended reasoning capabilities.

**Implication:** Text-only safety benchmarks that classify HALLUCINATION_REFUSAL as "safe" (because the model textually refuses) are making an error analogous to VLA pipelines that ignore language-level hedging. In both cases, System T has produced the harmful content. The refusal language is architecturally impotent.

---

## 2. Thinking Token Profile

Across all reasoning-model traces with thinking_tokens > 0:

| Verdict | n | Mean Thinking | Median | SD |
|---------|---|---------------|--------|-----|
| COMPLIANCE | 284 | 1,558 | 842 | 1,923 |
| HALLUCINATION_REFUSAL | 47 | 1,423 | 856 | 2,003 |
| PARTIAL | 97 | 861 | 625 | 773 |
| REFUSAL | 328 | 757 | 394 | 1,083 |
| BENIGN_QUERY | 70 | 877 | 651 | 923 |

**Key pattern:** HALLUCINATION_REFUSAL clusters with COMPLIANCE, not with REFUSAL. The model expends the same deliberation effort to produce a HALLUCINATION_REFUSAL as it does to produce a COMPLIANCE -- suggesting the cognitive process is identical. The only difference is that System S produces a framing layer of refusal language.

### Statistical tests (thinking tokens, all models pooled)

| Comparison | U | p | Cohen's d |
|-----------|---|---|-----------|
| HR vs REFUSAL | 10,306 | 1.85e-04 | +0.414 |
| HR vs COMPLIANCE | 5,910 | 2.09e-01 | -0.068 |
| HR vs PARTIAL | 2,524 | 2.99e-01 | +0.370 |
| COMPLIANCE vs REFUSAL | 67,198 | 3.29e-21 | +0.513 |

---

## 3. Response Token Profile

| Verdict | n | Mean Response Tokens | Median | SD |
|---------|---|---------------------|--------|-----|
| HALLUCINATION_REFUSAL | 84 | 1,835 | 1,346 | 1,881 |
| COMPLIANCE | 533 | 1,676 | 1,048 | 1,801 |
| PARTIAL | 220 | 1,214 | 927 | 1,155 |
| REFUSAL | 637 | 865 | 419 | 1,207 |

**Key pattern:** HALLUCINATION_REFUSAL produces the longest responses on average -- even longer than COMPLIANCE (though the difference is not statistically significant, p=0.46). The model is not merely claiming to refuse; it is generating substantial content alongside the refusal claim.

### Statistical tests (response tokens)

| Comparison | U | p | Cohen's d |
|-----------|---|---|-----------|
| HR vs REFUSAL | 38,391 | 8.85e-11 | +0.614 |
| HR vs COMPLIANCE | 23,501 | 4.63e-01 | +0.087 |

---

## 4. The Three-Way Equivalence: HR, PARTIAL, and Compliance

In the System T / System S framework, we can now map all five verdict categories to their System T / System S dynamics:

| Verdict | System T | System S | Outcome |
|---------|---------|---------|---------|
| COMPLIANCE | Active (dominant) | Suppressed | Harmful content, no safety framing |
| HALLUCINATION_REFUSAL | Active (dominant) | Active (framing only) | Harmful content + refusal claim |
| PARTIAL | Active (dominant) | Active (framing only) | Harmful content + hedging/caveats |
| REFUSAL | Suppressed | Active (dominant) | No harmful content, safety response |
| BENIGN_QUERY | Active (default) | Not triggered | Non-harmful content, no safety concern |

HALLUCINATION_REFUSAL and PARTIAL occupy the same cell: System T produces the content, System S produces the framing, but the framing does not prevent the content from being generated.

The difference between them is where the safety framing appears:
- **PARTIAL:** Safety framing is integrated into the response (hedging, caveats, disclaimers within the content).
- **HALLUCINATION_REFUSAL:** Safety framing is a wrapper around the response (the model claims to refuse but then provides the content anyway).

In a VLA pipeline, both are equally dangerous because the action decoder ignores language-level framing. In a text-only context, HALLUCINATION_REFUSAL may be slightly more dangerous than PARTIAL because a naive human reader might stop at the refusal claim and not examine the rest of the response.

---

## 5. Per-Model Distribution Patterns

Models fall into two groups based on how they express System T / System S competition:

### 5.1 PARTIAL-Dominant Models (non-reasoning, instruction-tuned)

| Model | n | HR% | P% | Combined |
|-------|---|-----|-----|----------|
| Qwen/Qwen3-4B | 1,462 | 0.1% | 75.9% | 76.0% |
| Qwen/Qwen3.5-9B | 510 | 0.0% | 46.7% | 46.7% |
| Qwen/Qwen3-8B | 97 | 0.0% | 34.0% | 34.0% |

These models produce hedging within the response (PARTIAL) rather than refusal-then-content (HALLUCINATION_REFUSAL). They lack the extended reasoning capability to produce a structured refusal that contradicts the subsequent content.

### 5.2 HALLUCINATION_REFUSAL-Elevated Models (reasoning or mixed)

| Model | n | HR% | P% | Combined |
|-------|---|-----|-----|----------|
| nvidia/nemotron-nano-9b-v2 | 147 | 11.6% | 14.3% | 25.9% |
| qwen3:1.7b | 150 | 10.0% | 16.0% | 26.0% |
| nvidia/nemotron-nano-12b-v2-vl:free | 121 | 9.9% | 4.1% | 14.0% |

These models have enough reasoning capability to produce a coherent refusal statement but then generate content anyway in the extended response. The refusal and the content are both well-formed -- which is precisely the HALLUCINATION_REFUSAL signature.

### 5.3 Combined "Safety-Impotent" Rate

When we sum HR + PARTIAL as the total rate of "safety reasoning present but not effective":

- Non-reasoning models: 35.4% of all verdicts (n=9,896)
- Reasoning models: 19.3% of all verdicts (n=238)

The lower rate for reasoning models is likely driven by DeepSeek-R1's high COMPLIANCE rate (it bypasses safety rather than hedging) and the smaller sample size.

---

## 6. Implications

### 6.1 For Safety Benchmarks

Any benchmark that classifies HALLUCINATION_REFUSAL as a successful defense is systematically undercounting attack success. The thinking and response token profiles demonstrate that HALLUCINATION_REFUSAL is computationally and volumetrically equivalent to COMPLIANCE -- the model has done the work of complying and has produced the harmful content. The refusal language is a cosmetic layer.

Suggested reclassification for safety accounting:
- **Strict ASR:** COMPLIANCE only
- **Broad ASR:** COMPLIANCE + PARTIAL
- **Functionally dangerous:** COMPLIANCE + PARTIAL + HALLUCINATION_REFUSAL

The "functionally dangerous" category captures all cases where System T has produced harmful content, regardless of System S framing.

### 6.2 For the System T / System S Framework

This analysis provides additional supporting evidence for the two-system model:
- The thinking token equivalence (HR ~ COMPLIANCE, p=0.21) demonstrates that the cognitive process underlying both verdicts is the same.
- The response token equivalence (HR ~ COMPLIANCE, p=0.46) demonstrates that the output volume is the same.
- The only difference is whether System S produces a framing layer -- which does not affect the content.

### 6.3 For VLA Safety

The VLA PARTIAL finding (Report #49: 50% of verdicts, zero outright refusals) is the most visible instance of this pattern because the architectural separation (language model -> action decoder) makes the impotence of safety framing obvious. But the text-only HALLUCINATION_REFUSAL pattern demonstrates that the same dynamic occurs even without architectural separation. The model's own safety reasoning is impotent against its own task-execution drive.

---

## 7. Limitations

1. **HALLUCINATION_REFUSAL sample size.** 47 traces with thinking tokens and 84 with response tokens. While the statistical tests are significant for the HR vs REFUSAL comparison, the HR vs COMPLIANCE non-significance could be a power issue rather than true equivalence. A formal equivalence test (TOST) would require pre-specifying an equivalence margin.

2. **Grader accuracy.** All verdicts are LLM-graded (deepseek-r1:1.5b, estimated 80-85% accuracy). Misclassification between HALLUCINATION_REFUSAL and COMPLIANCE would compress the observed differences, making our result (no significant difference) potentially an artifact. However, misclassification between HR and REFUSAL would inflate the observed differences, so the significant HR vs REFUSAL result is conservative.

3. **Content quality not assessed.** We measure token count and thinking effort, not the quality or actionability of the harmful content in HALLUCINATION_REFUSAL responses. The model might produce less coherent or less actionable content in HR responses even if the volume is the same.

4. **Causal direction unclear.** Does System S activate because System T has already produced harmful content (post-hoc framing)? Or does System S activate early and then fail to prevent System T from generating content (concurrent competition)? The thinking token data cannot distinguish these interpretations.

---

## Data and Reproducibility

All analyses computed from `database/jailbreak_corpus.db` (restored from backup `jailbreak_corpus.pre_batch_grading_20260311T115324.db`). Statistical tests use Mann-Whitney U (two-sided) via `scipy.stats.mannwhitneyu`. Cohen's d computed using pooled SD.

Key queries:
```sql
-- Thinking tokens by verdict
SELECT thinking_tokens FROM results
WHERE llm_verdict = ? AND thinking_tokens > 0;

-- Response tokens by verdict
SELECT response_tokens FROM results
WHERE llm_verdict = ? AND response_tokens > 0;

-- Per-model HR+PARTIAL rates
SELECT m.name, COUNT(*), SUM(CASE WHEN r.llm_verdict = 'HALLUCINATION_REFUSAL' THEN 1 ELSE 0 END) ...
FROM results r JOIN evaluation_runs er ... JOIN models m ...
```

---

*Report 65 -- F41LUR3-F1R57 Research Brief Series*
*Classification: Internal Research | Status: Complete*
*Related: Reports 49, 60, 62, 64; Issue #261*
*Sprint: 26*

F41LUR3-F1R57|HALLUCINATION-REFUSAL-EQUIVALENCE
