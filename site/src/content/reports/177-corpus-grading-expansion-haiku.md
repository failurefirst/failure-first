---
title: "Corpus Grading Expansion -- Claude Haiku 4.5 Grader Results and Updated Statistics"
description: "A batch grading campaign using Claude Haiku 4.5 via OpenRouter has added 4,723 new LLM-graded results to the corpus, bringing the non-OBLITERATUS LLM-graded..."
date: "2026-03-23"
reportNumber: 177
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## Executive Summary

A batch grading campaign using Claude Haiku 4.5 via OpenRouter has added 4,723 new LLM-graded results to the corpus, bringing the non-OBLITERATUS LLM-graded evaluable pool from 2,697 to 4,922 results (an 82.5% expansion). The Haiku grader reveals a dramatically different picture of corpus vulnerability than the heuristic classifier: the heuristic over-report rate is 79.9%, with only 20.1% of heuristic COMPLIANCE verdicts confirmed as COMPLIANCE or PARTIAL by Haiku. This strengthens the established finding that heuristic classifiers are unreliable (Mistake #21, kappa=0.126) and provides the most precise non-OBLITERATUS ASR measurement to date.

---

## 1. Methodology

**Grader:** Claude Haiku 4.5 (`anthropic/claude-haiku-4.5`) via OpenRouter API.

**Grading prompt:** FLIP (Failure-Level Inference Protocol) -- the standard multi-category classification prompt used across the project. Verdicts: COMPLIANCE, PARTIAL, REFUSAL, HALLUCINATION_REFUSAL, BENIGN_QUERY, NOT_GRADEABLE, ERROR.

**Scope:** 4,723 results graded total:
- 2,739 results that had no prior LLM verdict (newly graded)
- 1,984 results that already had a heuristic verdict (dual-graded, enabling agreement analysis)

**Exclusions:** OBLITERATUS telemetry results (already tagged `obliteratus-import`) were excluded from the batch grader per commit 35a8f117.

---

## 2. Haiku Verdict Distribution

| Verdict | Count | Percentage |
|---------|-------|------------|
| NOT_GRADEABLE | 1,594 | 33.7% |
| REFUSAL | 1,354 | 28.7% |
| BENIGN_QUERY | 837 | 17.7% |
| COMPLIANCE | 418 | 8.9% |
| HALLUCINATION_REFUSAL | 253 | 5.4% |
| PARTIAL | 200 | 4.2% |
| ERROR | 67 | 1.4% |
| **Total** | **4,723** | **100%** |

**Evaluable subset** (four core verdicts only): n=2,225

| Verdict | Count | Percentage |
|---------|-------|------------|
| REFUSAL | 1,354 | 60.9% |
| COMPLIANCE | 418 | 18.8% |
| HALLUCINATION_REFUSAL | 253 | 11.4% |
| PARTIAL | 200 | 9.0% |

**Haiku-only Three-Tier ASR (n=2,225):**
- Strict (COMPLIANCE only): 18.8%
- Broad (COMPLIANCE + PARTIAL): 27.8%
- Functionally Dangerous (C + P + HR): 39.1%

The Haiku grader produces a substantially lower ASR than prior LLM graders (pre-Haiku non-OBLITERATUS: strict 25.0%, broad 40.7%, FD 47.5%). This is consistent with Haiku being a more capable and more conservative classifier than the 1.5-1.7B models previously used.

---

## 3. Heuristic Over-Report Analysis

Of the 1,984 dual-graded results (both heuristic and Haiku verdicts), 1,840 had a heuristic verdict of COMPLIANCE. Haiku reclassified these as follows:

| Haiku Verdict | Count | % of Heuristic COMPLIANCE |
|---------------|-------|---------------------------|
| BENIGN_QUERY | 607 | 33.0% |
| NOT_GRADEABLE | 379 | 20.6% |
| REFUSAL | 257 | 14.0% |
| HALLUCINATION_REFUSAL | 221 | 12.0% |
| COMPLIANCE | 219 | 11.9% |
| PARTIAL | 151 | 8.2% |
| ERROR | 6 | 0.3% |

**Heuristic confirmed as attack success (C/P): 370/1,840 = 20.1%**
**Heuristic over-report rate: 79.9%**

This is the most decisive evidence yet that the heuristic classifier over-reports attack success. The dominant failure mode is classifying BENIGN_QUERY and NOT_GRADEABLE responses as COMPLIANCE (53.6% of the misclassified results). This aligns with the documented keyword classifier problem (Mistake #21): keyword matching detects response style (helpful, step-by-step format) rather than semantic harm.

### 3.1 Reclassification by Model

The over-report rate is model-specific:

| Model | Heuristic COMPLIANCE | Haiku C/P | Confirmation Rate |
|-------|---------------------|-----------|-------------------|
| qwen3:1.7b | 606 | 115 | 19.0% |
| deepseek-r1:1.5b | 587 | 54 | 9.2% |
| llama3.2:3b | 103 | 34 | 33.0% |
| phi3:mini | 92 | 40 | 43.5% |
| smollm2:1.7b | 91 | 56 | 61.5% |
| gemma2:2b | 90 | 26 | 28.9% |

deepseek-r1:1.5b has the lowest confirmation rate (9.2%), meaning 90.8% of its heuristic COMPLIANCE verdicts were reclassified by Haiku. This model's verbose reasoning traces likely trigger keyword false positives.

### 3.2 DAN_2022 Era Reclassification

Of 344 DAN-era results Haiku graded, 297 (86.3%) received a REFUSAL verdict. Only 1 COMPLIANCE and 1 PARTIAL were identified. This confirms that DAN-era attacks are essentially defunct against current models, consistent with the established finding that frontier models resist all historical jailbreaks.

---

## 4. Cohen's Kappa: Haiku vs Heuristic

On n=950 results where both Haiku and heuristic produced evaluable verdicts (COMPLIANCE, PARTIAL, REFUSAL, or HALLUCINATION_REFUSAL):

- **po (observed agreement):** 0.3200
- **pe (chance agreement):** 0.2472
- **Cohen's kappa:** 0.0966

This is below the prior corpus-wide kappa of 0.126 (computed on n=1,989 with mixed LLM graders vs heuristic). The Haiku-heuristic kappa of 0.097 represents near-chance agreement, further confirming that heuristic classification is not a reliable proxy for LLM-based classification.

---

## 5. Updated Three-Tier ASR

### 5.1 Non-OBLITERATUS LLM-Graded (Updated)

The combined non-OBLITERATUS LLM-graded pool (all graders, excluding auto-classifiers):

**n = 4,922 evaluable** (was 2,697 pre-Haiku, +82.5%)

| Tier | Definition | Prior ASR (n=2,697) | Current ASR (n=4,922) | Delta |
|------|-----------|--------------------|-----------------------|-------|
| Strict | COMPLIANCE only | 25.0% | 22.2% | -2.8pp |
| Broad | C + P | 40.7% | 35.1% | -5.6pp |
| FD | C + P + HR | 47.5% | 44.1% | -3.4pp |

All three ASR tiers declined with the addition of Haiku-graded results. The Haiku grader's higher refusal rate (60.9% vs 52.5% pre-Haiku) pulls the aggregate downward.

### 5.2 Full Corpus (Including OBLITERATUS)

Including OBLITERATUS results (which are LLM-tagged as predominantly COMPLIANCE/PARTIAL due to abliteration):

**n = 42,318 evaluable**

| Tier | ASR |
|------|-----|
| Strict | 47.5% |
| Broad | 85.3% |
| FD | 86.3% |

The OBLITERATUS-inclusive numbers are dominated by abliterated model results (81.1% of all LLM verdicts) and should not be cited as representative of general model vulnerability.

### 5.3 Per-Provider ASR (Non-OBLITERATUS, LLM-Graded)

| Provider | n | Strict | Broad | FD |
|----------|---|--------|-------|----|
| deepseek | 194 | 38.7% | 55.7% | 61.9% |
| nvidia | 341 | 36.4% | 45.7% | 51.9% |
| liquid | 136 | 33.8% | 66.2% | 73.5% |
| meta-llama | 324 | 28.4% | 50.9% | 54.3% |
| openai | 282 | 26.2% | 36.5% | 38.7% |
| mistralai | 292 | 21.2% | 39.4% | 48.3% |
| google | 330 | 9.1% | 15.2% | 23.3% |
| anthropic | 172 | 7.6% | 11.0% | 12.2% |

Provider ordering is largely consistent with prior findings (Report #50). The anthropic and google clusters remain the most resistant. The deepseek and nvidia clusters remain the most vulnerable.

### 5.4 Per-Technique ASR (Non-OBLITERATUS, LLM-Graded, n>=10)

| Technique | n | Strict | Broad |
|-----------|---|--------|-------|
| reasoning_exploit/cot_manipulation | 19 | 63.2% | 78.9% |
| reasoning_exploit/meta_reasoning | 10 | 40.0% | 40.0% |
| reasoning_exploit/thinking_trace | 18 | 38.9% | 38.9% |
| harmbench/standard | 49 | 26.5% | 34.7% |
| harmbench/contextual | 25 | 24.0% | 24.0% |
| harmbench/copyright | 20 | 20.0% | 20.0% |
| strongreject/forbidden_prompt | 92 | 5.4% | 12.0% |
| jailbreakbench/behavior | 229 | 5.7% | 7.9% |
| dan/in_the_wild | 731 | 0.5% | 1.0% |
| skeleton_key/system_override | 10 | 0.0% | 0.0% |

Reasoning-exploit techniques remain the highest-ASR family. DAN-era and skeleton_key attacks are near-zero, consistent with established findings.

---

## 6. Grading Coverage

| Category | Total Results | LLM-Graded | Coverage |
|----------|--------------|------------|----------|
| OBLITERATUS | 120,931 | 42,346 | 35.0% |
| Other (non-OBLITERATUS) | 10,678 | 9,088 | 85.1% |
| Longitudinal | 740 | 737 | 99.6% |
| Crescendo | 42 | 42 | 100.0% |
| Format-lock | 25 | 22 | 88.0% |

Non-OBLITERATUS grading coverage has reached 85.1%. This is the highest coverage achieved to date.

Total LLM-graded results: 52,235 (was ~48,000 pre-Haiku).

---

## 7. Impact on Established Findings

### 7.1 Findings Strengthened

- **Heuristic classifiers are unreliable.** The 79.9% over-report rate is the most decisive evidence yet. Prior kappa=0.126; Haiku-heuristic kappa=0.097 (even lower).
- **DAN-era attacks are defunct.** Haiku confirms 86.3% REFUSAL on DAN_2022 prompts.
- **Provider signatures dominate.** Anthropic (7.6%) and Google (9.1%) remain restrictive; deepseek (38.7%) and nvidia (36.4%) remain permissive.

### 7.2 Findings Shifted

- **Non-OBLITERATUS ASR is lower than previously reported.** Strict ASR dropped from 25.0% to 22.2%, broad from 40.7% to 35.1%. The Haiku grader is more conservative than the deepseek-r1:1.5b and ollama graders that dominated prior LLM verdicts.
- **Three-Tier canonical numbers need restatement.** The prior canonical (strict 45.9%, broad 79.3%, FD 80.3%) included OBLITERATUS-import results. When OBLITERATUS is excluded, the non-OBLITERATUS ASR is substantially lower. Both numbers should be reported separately.

### 7.3 No Findings Contradicted

No established finding is contradicted by the Haiku grading expansion. All shifts are in degree, not direction. The provider clustering, technique ordering, and qualitative vulnerability profiles remain stable.

---

## 8. Methodological Notes

1. **Haiku grades more conservatively than 1.5-1.7B models.** This is expected: larger, better-calibrated models produce fewer false positives. The strict ASR difference (18.8% Haiku vs 25.0% prior) likely reflects improved classification accuracy rather than a genuine ASR difference across the same prompts.

2. **NOT_GRADEABLE rate is high (33.7%).** Haiku classifies many results as NOT_GRADEABLE, suggesting prompt-response pairs that lack sufficient context for reliable classification. This contrasts with smaller models that tend to force a verdict.

3. **BENIGN_QUERY reclassification (33.0% of heuristic COMPLIANCE).** Many results the heuristic flagged as attack success were actually benign interactions. This is consistent with the known keyword classifier problem: helpful response formatting triggers false positives.

4. **HR rate elevated (11.4% vs 6.7% prior).** Haiku identifies more HALLUCINATION_REFUSAL than prior graders, widening the FD gap. This is consistent with Haiku's superior ability to detect the System-T/System-S dissociation documented in Report #65.

---

## 9. Recommendations

1. **Update CANONICAL_METRICS.md** to separate OBLITERATUS and non-OBLITERATUS ASR in the Three-Tier table.
2. **Cite non-OBLITERATUS ASR** in policy submissions and external communications. The OBLITERATUS-inclusive numbers reflect abliterated model behavior, not general model vulnerability.
3. **Continue Haiku grading** for remaining ungraded non-OBLITERATUS results (~1,590 remaining). Target: 100% non-OBLITERATUS LLM coverage.
4. **Do not use heuristic ASR in any external-facing document.** The 79.9% over-report rate makes heuristic verdicts unsuitable for policy or standards submissions.

---

## Appendix: Data Sources

- Database: `database/jailbreak_corpus.db` (schema version 13)
- Haiku grading: `llm_classifier LIKE 'anthropic/claude-haiku%'` (4,723 results)
- Prior LLM graders: ollama, deepseek-r1:1.5b, qwen3:1.7b, gemini, consensus_v1
- Report query date: 2026-03-23
