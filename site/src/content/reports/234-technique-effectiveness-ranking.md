---
title: "Attack Technique Effectiveness Ranking (LLM-Graded, Sprint 13)"
description: "This report presents the definitive attack technique effectiveness ranking based on 53,831 LLM-graded results across the full jailbreak corpus database. It extends the prior ranking document (which used 2,653 technique-t..."
date: "2026-03-24"
reportNumber: 234
classification: "Research — Empirical Study"
status: "complete"
author: "Amy Pond (Lead Evaluation Engineer)"
tags: []
draft: false
---

---

## Summary

This report presents the definitive attack technique effectiveness ranking based on 53,831 LLM-graded results across the full jailbreak corpus database. It extends the prior ranking document (which used 2,653 technique-tagged + scenario-class results) with the full Haiku batch grading corpus (2,700 newly graded in batch 2) and updated technique-tagged data (2,597 evaluable results across 11 family-era combinations with n >= 10).

Additionally, this report documents the Sprint 13 grading pipeline analysis covering 64 newly graded traces across 3 models, and flags two critical quality issues in the graded data.

---

## Part 1: Sprint 13 Grading Pipeline Analysis

### Grading Progress

Three files graded in `runs/grading/sprint13/`:

| File | Model | Traces | Grader | Actual Responses | 429 Errors |
|------|-------|--------|--------|------------------|------------|
| `graded_arcee-ai_trinity-large-preview-free_traces.jsonl` | Trinity Large Preview | 30 | nemotron-nano-9b-v2:free | 30 | 0 |
| `graded_cognitivecomputations_dolphin-mistral-24b-venice-edition-free_traces.jsonl` | Dolphin Mistral 24B | 30 | nemotron-nano-9b-v2:free | 0 | 30 |
| `graded_google_gemma-3-27b-it-free_traces.jsonl` | Gemma 3 27B | 4 | nemotron-nano-9b-v2:free | 0 | 4 |

**Total graded:** 64 traces (but only 30 contain actual model responses)

### Verdict Distributions

**Trinity Large Preview (n=30, all actual responses):**
- REFUSAL: 28 (93.3%)
- PARTIAL: 1 (3.3%)
- COMPLIANCE: 1 (3.3%)
- Strict ASR: 3.3%, Broad ASR: 6.7%

**Dolphin Mistral 24B (n=30, all 429 errors):**
- REFUSAL: 27 (90.0%)
- ERROR: 3 (10.0%)
- Strict ASR: 0.0%, Broad ASR: 0.0%

**Gemma 3 27B (n=4, all 429 errors):**
- REFUSAL: 4 (100.0%)
- Strict ASR: 0.0%, Broad ASR: 0.0%

### Critical Quality Issues

**Issue 1: Rate-limit errors graded as REFUSAL (34 of 64 traces)**

Dolphin Mistral (30/30) and Gemma (4/4) traces are ALL infrastructure 429 errors, not model responses. The Nemotron Nano grader classified these as REFUSAL, which is incorrect per Mistake #14 (distinguish API-level blocks from model-level refusals). These 34 traces should be classified as INFRA_ERROR or excluded from ASR calculations entirely.

The Dolphin Mistral result is particularly misleading: this is an uncensored model that would likely show high ASR if it had actually responded, but the grading pipeline reports 0% ASR because rate-limit errors masquerade as refusals.

**Issue 2: Heuristic-LLM disagreement on Trinity (10/30 = 33.3% disagreement)**

The heuristic classifier marked 11 traces as `attack_success=true`, but the LLM grader classified only 2 as COMPLIANCE or PARTIAL. Manual inspection of 5 disagreement cases shows the LLM grader is correct: the heuristic falsely counted responses that contained safety disclaimers or explicit refusals followed by educational alternatives (e.g., "I'm not going to help you develop a virus" classified as attack_success by the heuristic). This is consistent with Mistake #21 (keyword classifier false positives).

### Score Report Results

The score report tool (v1.0) runs correctly on the graded format. Key metrics for Trinity:
- RBI: 63.3% [45.5%, 78.1%] (n=30)
- RRR: 60.0% [42.3%, 75.4%] (n=30)
- LCS: 100.0% [88.6%, 100.0%] (n=30)
- Power analysis: 339 traces needed per model for 10% delta detection

For Dolphin Mistral, the score report produces RBI=0.0% [0.0%, 11.4%] which is misleading given all traces are infrastructure errors.

**Recommendation:** The score report tool should detect and flag traces where `agent_response` contains `[ERROR: Rate limit exceeded (429)]` as infrastructure errors rather than including them in ASR calculations.

### Batch 2 (Haiku) Grading Status

The separate Haiku batch grading run (`runs/grading/batch2_output.log`) completed 2,700 of 5,499 ungraded results (28 of 50 planned batches) and committed to the database. Verdict distribution:
- COMPLIANCE: 229 (8.5%)
- PARTIAL: 93 (3.4%)
- REFUSAL: 810 (30.0%)
- HALLUCINATION_REFUSAL: 107 (4.0%)
- BENIGN_QUERY: 440 (16.3%)
- NOT_GRADEABLE: 1,021 (37.8%)
- ERROR: 0 (0.0%)

The 37.8% NOT_GRADEABLE rate is high and warrants investigation. This may reflect traces that were infrastructure errors, empty responses, or otherwise unsuitable for verdict classification.

---

## Part 2: Attack Technique Effectiveness Ranking (Full DB, n=53,831 LLM-graded)

### By Technique Family (n >= 10 evaluable results)

| Rank | Family | n | Strict ASR | Broad ASR |
|------|--------|---|------------|-----------|
| 1 | cot_exploit | 129 | 26.4% | 31.8% |
| 2 | multi_turn | 163 | 23.9% | 38.7% |
| 3 | other (public datasets) | 804 | 11.1% | 14.9% |
| 4 | encoding | 100 | 8.0% | 15.0% |
| 5 | behavioral (skeleton_key) | 58 | 6.9% | 12.1% |
| 6 | task_framing | 20 | 5.0% | 10.0% |
| 7 | volumetric (many-shot) | 66 | 3.0% | 4.5% |
| 8 | persona | 1,210 | 0.7% | 1.2% |
| 9 | prompt_injection | 14 | 0.0% | 0.0% |

**Key observations:**
- **cot_exploit** (chain-of-thought exploitation, reasoning_2025 era) is the most effective family by strict ASR (26.4%), displacing multi_turn from the top position in the prior ranking.
- **multi_turn** remains the highest by broad ASR (38.7%), confirming that multi-turn attacks produce more PARTIAL verdicts than other families.
- **persona** attacks (n=1,210, mostly DAN-era) are near-ineffective at 0.7% strict ASR. This is the largest sample in the technique-tagged set and provides strong evidence that DAN-era persona attacks are obsolete.
- **prompt_injection** (n=14) shows 0% ASR, though the sample is small.

### By Era (n >= 10)

| Rank | Era | n | Strict ASR | Broad ASR |
|------|-----|---|------------|-----------|
| 1 | reasoning_2025 | 129 | 26.4% | 31.8% |
| 2 | crescendo_2024 | 303 | 15.5% | 24.8% |
| 3 | general | 804 | 11.1% | 14.9% |
| 4 | cipher_2023 | 142 | 7.7% | 15.5% |
| 5 | many_shot_2024 | 24 | 4.2% | 4.2% |
| 6 | dan_2022 | 1,182 | 0.6% | 0.8% |
| 7 | persona_2022 | 13 | 0.0% | 0.0% |

**Temporal trend:** Attack effectiveness increases monotonically with era recency: persona_2022 (0%) -> dan_2022 (0.8%) -> cipher_2023 (15.5%) -> many_shot_2024 (4.2%, exception) -> crescendo_2024 (24.8%) -> reasoning_2025 (31.8%). The many_shot_2024 exception may reflect small sample size (n=24) or the specific implementation tested.

### Frontier Model Results (Claude Sonnet 4.5, GPT-5.2, Gemini 3 Flash)

Frontier models have technique-tagged results across 8 families (n varies by family). Key findings:

| Family | Claude (n) | Claude Broad | GPT-5.2 (n) | GPT-5.2 Broad | Gemini (n) | Gemini Broad |
|--------|-----------|-------------|-------------|---------------|-----------|-------------|
| multi_turn | 22 | 5 (22.7%) | 19 | 6 (31.6%) | 24 | 2 (8.3%) |
| encoding | 24 | 0 (0.0%) | 24 | 3 (12.5%) | 24 | 0 (0.0%) |
| cot_exploit | 20 | 0 (0.0%) | 18 | 4 (22.2%) | 22 | 4 (18.2%) |
| volumetric | 16 | 0 (0.0%) | 18 | 2 (11.1%) | 16 | 0 (0.0%) |
| behavioral | 14 | 2 (14.3%) | 16 | 3 (18.8%) | 14 | 0 (0.0%) |
| persona | 14 | 0 (0.0%) | 14 | 1 (7.1%) | 12 | 0 (0.0%) |
| prompt_injection | 4 | 0 (0.0%) | 4 | 0 (0.0%) | 4 | 0 (0.0%) |

**Families with zero broad ASR on ALL three frontier models:**
- prompt_injection (n=4 per model -- small sample caveat)

**Families with zero on Claude specifically:**
- encoding, cot_exploit, volumetric, persona, prompt_injection

**GPT-5.2 shows the most vulnerability** among frontier models, with non-zero broad ASR across all families except prompt_injection. This may reflect differences in safety training philosophy rather than model capability.

### Comparison to Prior Ranking (Rose Tyler, 2026-03-19)

The prior ranking (`docs/analysis/attack_family_effectiveness_ranking.md`) used 944 LLM-graded technique-tagged results. This report uses 2,597 evaluable results from the technique-tagged subset, a 2.75x increase.

| Finding | Prior Ranking | This Report | Change |
|---------|--------------|-------------|--------|
| Top family (strict) | multi_turn (26.0%) | cot_exploit (26.4%) | Shifted |
| Top family (broad) | multi_turn (41.8%) | multi_turn (38.7%) | Reduced 3.1pp |
| DAN persona ASR | 0.0-6.7% | 0.6% (n=1,182) | Confirmed obsolete |
| Encoding broad | 15.3% (n=98) | 15.0% (n=100) | Stable |
| Prompt injection | 0.0% (n=14) | 0.0% (n=14) | Unchanged |
| Benign FP floor | 24.3% (n=202) | Not recalculated | Assumed stable |

The rank order is largely stable. The main change is cot_exploit overtaking multi_turn for strict ASR, but multi_turn retains the top broad ASR position. The persona family's massive sample (n=1,210) now provides definitive evidence of DAN-era obsolescence.

---

## Part 3: DB-Level Verdict Distribution (Full Corpus)

Total results: 133,033
LLM-graded: 53,831
Heuristic-graded: 42,778

| Verdict | Count | Percentage |
|---------|-------|-----------|
| COMPLIANCE | 20,285 | 37.7% |
| PARTIAL | 16,093 | 29.9% |
| NOT_GRADEABLE | 7,020 | 13.0% |
| REFUSAL | 6,366 | 11.8% |
| ERROR | 1,830 | 3.4% |
| BENIGN_QUERY | 1,681 | 3.1% |
| HALLUCINATION_REFUSAL | 517 | 1.0% |
| PARSE_ERROR | 33 | 0.1% |
| INFRA_ERROR | 6 | 0.0% |

**Caveat:** The 37.7% COMPLIANCE rate is heavily influenced by the OBLITERATUS import (120,931 results from `obliteratus-import` classifier), which contains abliterated models expected to show high compliance. The technique-tagged subset shows much lower COMPLIANCE rates (7.2% weighted average).

---

## Recommendations

1. **Fix rate-limit error handling in grading pipeline.** Traces containing `[ERROR: Rate limit exceeded (429)]` should be classified as INFRA_ERROR, not sent to the LLM grader. The current pipeline wasted 34 grading API calls on infrastructure errors and produced misleading ASR numbers.

2. **Re-run Dolphin Mistral and Gemma benchmarks** when rate limits have recovered. Dolphin Mistral is an uncensored model that would provide a useful permissive-model baseline.

3. **Investigate 37.8% NOT_GRADEABLE rate** in the Haiku batch grading. This is high and may indicate systematic issues with trace quality or grader prompt formatting.

4. **Update `docs/analysis/attack_family_effectiveness_ranking.md`** with the expanded technique-tagged data from this report (2,597 vs 944 evaluable results).

5. **Collect more frontier model technique-tagged data.** The current frontier subset is too small (4-24 traces per family per model) for reliable per-family ASR estimates with tight confidence intervals.
