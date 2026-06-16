---

title: "FLIP Grader Calibration Analysis"
description: "This report quantifies inter-grader agreement across all LLM classifiers used in the F41LUR3-F1R57 FLIP grading pipeline. Using dual-graded results from the jailbreak corpus database (same prompts graded by multiple clas..."
date: "2026-03-25"
reportNumber: 240
classification: "Research — Empirical Study"
status: "complete"
author: "Romana (Statistical Validation Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/240-grader-calibration-analysis.m4a"
---

---

## Summary

This report quantifies inter-grader agreement across all LLM classifiers used in the F41LUR3-F1R57 FLIP grading pipeline. Using dual-graded results from the jailbreak corpus database (same prompts graded by multiple classifiers), we compute Cohen's kappa, per-category recall against Haiku (our reference grader), and systematic bias profiles.

**Key finding:** No grader achieves even moderate agreement with Haiku (kappa >= 0.40). Gemini is the best alternative (kappa = 0.320, "fair"), followed by deepseek-r1:1.5b (kappa = 0.249, "fair"). All other graders -- ollama-unspecified, consensus_v1, qwen3:1.7b -- show near-chance agreement (kappa < 0.10). Nemotron-nano-9b produces 88.4% REFUSAL verdicts on AdvBench traces, suggesting severe under-classification of compliance.

---

## 1. Data Sources

### 1.1 Database dual-graded results

The jailbreak corpus contains results where the same prompt was independently graded by multiple LLM classifiers. We extracted all pairs where both classifiers produced valid FLIP verdicts (COMPLIANCE, PARTIAL, REFUSAL, HALLUCINATION_REFUSAL).

| Classifier pair | n (dual-graded prompts) |
|---|---|
| deepseek-r1:1.5b vs haiku | 279 |
| consensus_v1 vs ollama-unspecified | 139 |
| haiku vs ollama-unspecified | 107 |
| gemini vs ollama-unspecified | 103 |
| gemini vs haiku | 100 |
| consensus_v1 vs gemini | 80 |
| consensus_v1 vs haiku | 54 |
| deepseek-r1:1.5b vs qwen3:1.7b | 28 |
| deepseek-r1:1.5b vs ollama-unspecified | 22 |

### 1.2 Nemotron-nano-9b sprint13 traces

268 traces from 8 models graded by `nvidia/nemotron-nano-9b-v2:free` during Sprint 13 AdvBench baseline expansion. No Haiku overlap exists for these specific scenarios, so nemotron assessment is based on verdict distribution analysis rather than direct comparison.

### 1.3 Classifier normalization

- `anthropic/claude-haiku-4.5` and `anthropic/claude-haiku-4-5-20251001` merged as "haiku"
- `ollama:deepseek-r1:1.5b` and `deepseek-r1:1.5b` merged
- `ollama:qwen3:1.7b` and `qwen3:1.7b` merged
- `ollama` (unspecified model) kept separate as "ollama-unspecified"

---

## 2. Inter-Grader Agreement (Cohen's Kappa)

| Pair | n | Kappa | 95% CI | Observed Agreement | Interpretation |
|---|---|---|---|---|---|
| gemini vs haiku | 100 | 0.320 | [0.175, 0.464] | 54.0% | Fair |
| deepseek-r1:1.5b vs haiku | 279 | 0.249 | [0.144, 0.354] | 58.8% | Fair |
| deepseek-r1:1.5b vs qwen3:1.7b | 28 | 0.128 | [-0.151, 0.408] | 42.9% | Slight (CI includes 0) |
| deepseek-r1:1.5b vs ollama-unspec | 22 | 0.078 | [-0.185, 0.341] | 31.8% | Slight (CI includes 0) |
| haiku vs ollama-unspec | 107 | 0.021 | [-0.093, 0.134] | 27.1% | Slight (near chance) |
| gemini vs ollama-unspec | 103 | 0.012 | [-0.140, 0.164] | 38.8% | Slight (near chance) |
| consensus_v1 vs haiku | 54 | 0.000 | [-0.267, 0.267] | 50.0% | Chance |
| consensus_v1 vs ollama-unspec | 139 | 0.000 | [-0.141, 0.141] | 41.7% | Chance |

**Threshold reminder:** Kappa < 0.60 means the classifier is unreliable for that task (per project constraints in `.claude/agents/`). No grader pair reaches this threshold.

---

## 3. Per-Category Recall vs Haiku (Reference)

### 3.1 deepseek-r1:1.5b (n=279)

| When Haiku says | deepseek agrees | Recall |
|---|---|---|
| COMPLIANCE | 8 / 23 | 34.8% |
| PARTIAL | 0 / 5 | 0.0% |
| REFUSAL | 146 / 217 | 67.3% |
| HR | 10 / 34 | 29.4% |

**Systematic bias:** Over-classifies as COMPLIANCE (+15.4pp vs Haiku) and PARTIAL (+14.0pp). Under-classifies REFUSAL (-23.7pp). This is the opposite of the nemotron pattern -- deepseek-r1:1.5b is biased toward compliance, Haiku is more conservative.

### 3.2 Gemini (n=100)

| When Haiku says | gemini agrees | Recall |
|---|---|---|
| COMPLIANCE | 19 / 34 | 55.9% |
| PARTIAL | 2 / 20 | 10.0% |
| REFUSAL | 31 / 39 | 79.5% |
| HR | 2 / 7 | 28.6% |

**Systematic bias:** Under-classifies PARTIAL (-11.0pp) -- frequently promotes PARTIAL to REFUSAL (+13.0pp). Best COMPLIANCE recall of any alternative grader.

### 3.3 ollama-unspecified (n=107)

| When Haiku says | ollama agrees | Recall |
|---|---|---|
| COMPLIANCE | 13 / 33 | 39.4% |
| PARTIAL | 5 / 22 | 22.7% |
| REFUSAL | 11 / 25 | 44.0% |
| HR | 0 / 27 | 0.0% |

**Systematic bias:** Cannot detect HALLUCINATION_REFUSAL at all (0% recall). Near-random performance across all categories.

### 3.4 consensus_v1 (n=54)

| When Haiku says | consensus agrees | Recall |
|---|---|---|
| COMPLIANCE | 0 / 8 | 0.0% |
| PARTIAL | 0 / 12 | 0.0% |
| REFUSAL | 27 / 27 | 100.0% |
| HR | 0 / 7 | 0.0% |

**Systematic bias:** Collapses everything to REFUSAL. 100% of its 54 verdicts are REFUSAL. This is not a grader -- it is a constant function.

---

## 4. Nemotron-Nano-9B Assessment

### 4.1 Sprint 13 verdict distribution (n=268 traces, 8 models)

| Verdict | Count | Rate |
|---|---|---|
| REFUSAL | 237 | 88.4% |
| ERROR | 26 | 9.7% |
| PARTIAL | 2 | 0.7% |
| COMPLIANCE | 1 | 0.4% |
| BENIGN_QUERY | 1 | 0.4% |
| HR | 1 | 0.4% |

### 4.2 Per-model breakdown

| Model | n | COMPLIANCE | PARTIAL | REFUSAL |
|---|---|---|---|---|
| gemma-3-4b | 30 | 0% | 0% | 100% |
| gemma-3n-e4b | 30 | 0% | 3.3% | 96.7% |
| lfm-2.5-1.2b | 30 | 0% | 0% | 96.7% |
| trinity-large-preview | 30 | 3.3% | 3.3% | 93.3% |
| dolphin-mistral-24b | 30 | 0% | 0% | 90.0% |
| minimax-m2.5 | 18 | 0% | 0% | 88.9% |
| gemma-3-27b | 50 | 0% | 0% | 82.0% |
| llama-3.3-70b | 50 | 0% | 2.0% | 74.0% |

### 4.3 Comparison with known ground truth

Trinity Large Preview has a heuristic ASR of 36.7% (11/30 attack_success=True from the benchmark runner). Nemotron graded this as 3.3% COMPLIANCE + 3.3% PARTIAL = 6.7% broad ASR. This is a 5.5x undercount compared to even the heuristic classifier.

**Assessment:** Nemotron-nano-9b appears to have a severe REFUSAL bias -- the inverse of the problem documented in Mistake #25 (qwen3:1.7b PARTIAL bias). Where qwen3:1.7b classifies everything as PARTIAL, nemotron classifies everything as REFUSAL. Both are unreliable for production FLIP grading.

No direct Haiku comparison is possible because no AdvBench scenarios have been Haiku-graded. However, given that Haiku consistently finds higher COMPLIANCE rates than other graders on the same prompts (Section 3), the true ASR for these traces is likely substantially higher than nemotron reports.

---

## 5. Grader Hierarchy (Recommended)

Based on the evidence:

| Tier | Grader | Kappa vs Haiku | Best use | Limitations |
|---|---|---|---|---|
| **1 (Reference)** | Claude Haiku 4.5 | -- (reference) | All production grading | Cost (~$0.001/grade), rate limits |
| **2 (Acceptable)** | Gemini (via API) | 0.320 (Fair) | Backup when Haiku unavailable | PARTIAL under-detection (-11pp), HR under-detection |
| **3 (Marginal)** | deepseek-r1:1.5b (with thinking) | 0.249 (Fair) | Budget grading with manual audit | COMPLIANCE over-report (+15pp), zero PARTIAL recall |
| **4 (Unreliable)** | nemotron-nano-9b | N/A (no Haiku overlap) | NOT RECOMMENDED | 88% REFUSAL bias, 5.5x ASR undercount |
| **4 (Unreliable)** | qwen3:1.7b | N/A (n=28 vs deepseek, kappa=0.128) | NOT RECOMMENDED | 58% PARTIAL bias (Mistake #25), 15% accuracy |
| **5 (Broken)** | consensus_v1 | 0.000 (Chance) | NOT USABLE | 100% REFUSAL constant function |
| **5 (Broken)** | ollama-unspecified | 0.021 (Chance) | NOT USABLE | Near-random, 0% HR recall |

### Production recommendation

1. **Haiku first.** All production grading should use Claude Haiku 4.5 via OpenRouter.
2. **Gemini as fallback.** When Haiku is rate-limited or unavailable, Gemini is the next best option.
3. **deepseek-r1:1.5b as minimum viable.** For local/offline grading, deepseek-r1:1.5b with `think=true` is the minimum acceptable model. Manual audit of 10% sample required.
4. **Re-grade nemotron results.** All 268 Sprint 13 traces graded by nemotron-nano-9b should be re-graded with Haiku before any ASR claims are published.
5. **Never use sub-4B models for FLIP grading.** This updates Mistake #25: the floor is not "sub-2B" but "sub-4B" -- nemotron at 9B with severe quantization performs comparably to qwen3:1.7b.

---

## 6. Minimum Model Size for Reliable FLIP Grading

| Model | Parameters | Kappa vs Haiku | Reliable? |
|---|---|---|---|
| qwen3:1.7b | 1.7B (Q4_K_M) | N/A (15% accuracy audit) | No |
| nemotron-nano-9b | 9B (free tier) | N/A (88% REFUSAL bias) | No |
| deepseek-r1:1.5b | 1.5B (with CoT) | 0.249 | Marginal (with audit) |
| Gemini | >100B (API) | 0.320 | Acceptable |
| Claude Haiku 4.5 | Unknown (API) | Reference | Yes |

**Observation:** The reasoning trace (`think=true`) in deepseek-r1:1.5b appears to compensate partially for its small parameter count, giving it better performance than the larger nemotron-nano-9b without reasoning. This suggests that **chain-of-thought reasoning is more important than raw parameter count** for FLIP classification quality.

**Updated guidance for Mistake #25:** The minimum viable classifier is not defined by parameter count alone. Models below ~100B without reasoning traces are unreliable. Models with reasoning traces (deepseek-r1:1.5b) can be marginal but require manual audit. For production use, only API-grade models (Haiku, Gemini) are recommended.

---

## 7. Impact on Existing Findings

### 7.1 Findings at risk

- **AdvBench baseline ASR (Sprint 12):** Reported as heuristic-only. Nemotron grading would further undercount. Haiku grading required before any publication.
- **VLA FLIP grading:** Used both deepseek-r1:1.5b and qwen3:1.7b. Aggregate ASR converges (72.4% each), but scenario-level verdicts may differ. PARTIAL decomposition partially affected.

### 7.2 Findings NOT affected

- **All findings in AGENT_STATE.md "Established Findings"** that cite Haiku grading or LLM-only verdicts from the corpus database are unaffected.
- **Heuristic overcount crisis (Report #178):** Actually strengthened -- nemotron's behavior confirms that small-model graders produce systematic biases in both directions (over-report and under-report).

---

## 8. Statistical Notes

- All kappa values computed with standard error from Fleiss (1971) approximation
- 95% confidence intervals are kappa +/- 1.96 * SE
- Interpretation follows Landis & Koch (1977): <0.00 poor, 0.00-0.20 slight, 0.21-0.40 fair, 0.41-0.60 moderate, 0.61-0.80 substantial, 0.81-1.00 almost perfect
- Minimum n=20 per group enforced (pairs below threshold excluded from kappa computation)
- Nemotron assessment based on distributional analysis, not direct Haiku comparison (no overlapping scenarios available)
