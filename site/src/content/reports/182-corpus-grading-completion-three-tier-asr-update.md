---
title: "Corpus Grading Completion and Three-Tier ASR Update"
description: "This report documents the completion of non-OBLITERATUS corpus grading and the resulting shift in three-tier ASR numbers. 2,699 previously ungraded results..."
date: "2026-03-23"
reportNumber: 182
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## Summary

This report documents the completion of non-OBLITERATUS corpus grading and the resulting shift in three-tier ASR numbers. 2,699 previously ungraded results were graded using Claude Haiku 4.5 via OpenRouter. The newly graded results skew heavily toward REFUSAL (37.2%) and NOT_GRADEABLE (31.8%), pulling down aggregate ASR by 1-2 percentage points.

**Key outcome:** All non-OBLITERATUS results in the corpus are now LLM-graded (0 remaining). The three-tier ASR has shifted downward, reflecting the inclusion of previously ungraded results that were predominantly refusals.

---

## Grading Statistics

### Volume

| Metric | Value |
|--------|-------|
| Results graded this session | 2,699 |
| Total LLM-graded results (corpus) | 53,831 |
| Remaining ungraded (non-OBLITERATUS) | 0 |
| Remaining ungraded (OBLITERATUS, excluded) | 78,585 |
| Grader model | anthropic/claude-haiku-4.5 |
| API | OpenRouter |
| Passes required | 4 (pagination offset bug in batch grader) |

### Verdict Distribution (This Session)

| Verdict | Count | Percent |
|---------|-------|---------|
| REFUSAL | 1,079 | 37.2% |
| NOT_GRADEABLE | 921 | 31.8% |
| BENIGN_QUERY | 419 | 14.5% |
| COMPLIANCE | 226 | 7.8% |
| HALLUCINATION_REFUSAL | 130 | 4.5% |
| PARTIAL | 111 | 3.8% |
| ERROR | 13 | 0.4% |

The newly graded results are significantly more defensive than the previously graded corpus (37.2% REFUSAL vs ~10% corpus-wide prior to this session). This is consistent with these being results from models/prompts that were harder to classify or produced more ambiguous outputs.

### Corpus-Wide Verdict Distribution (Post-Grading)

| Verdict | Count |
|---------|-------|
| COMPLIANCE | 20,285 |
| PARTIAL | 16,093 |
| NOT_GRADEABLE | 7,020 |
| REFUSAL | 6,366 |
| ERROR | 1,830 |
| BENIGN_QUERY | 1,681 |
| HALLUCINATION_REFUSAL | 517 |
| PARSE_ERROR | 33 |
| INFRA_ERROR | 6 |

---

## Three-Tier ASR Update

### Prior Values vs Updated

| Tier | Prior (CANONICAL_METRICS) | Session Baseline (n=41,842) | Updated (n=43,261) | Delta from Baseline |
|------|--------------------------|----------------------------|---------------------|---------------------|
| Strict (C only) | 45.9% | 47.96% | 46.89% | -1.07pp |
| Broad (C+P) | 79.3% | 86.17% | 84.09% | -2.08pp |
| FD (C+P+HR) | 80.3% | 87.10% | 85.28% | -1.82pp |
| FD gap | +1.0pp | +0.93pp | +1.20pp | +0.27pp |

**Note on prior CANONICAL_METRICS values:** The 45.9% / 79.3% / 80.3% values were computed from n=10,294 evaluable results. The current computation uses n=43,261 evaluable results (4.2x larger denominator). The difference between CANONICAL_METRICS values and session baseline reflects grading work done in intervening sessions, not this session's contribution.

### Interpretation

The downward shift is explained by the composition of the newly graded results:
- 37.2% REFUSAL (vs ~15% corpus-wide) -- these results were from model/prompt combinations where the model refused
- 31.8% NOT_GRADEABLE -- garbled or too-short responses that were excluded from the evaluable denominator
- Only 7.8% COMPLIANCE -- substantially below the corpus average of ~47%

The FD gap increased from +0.93pp to +1.20pp, reflecting 130 new HALLUCINATION_REFUSAL verdicts. This means the newly graded results contain a disproportionate number of cases where models produced refusal framing while still generating harmful content.

### Statistical Note

The shift of -1.07pp in Strict ASR (47.96% to 46.89%) is within the margin expected from adding 1,419 evaluable results (3.4% of the 43,261 total). No statistical significance test is warranted because this is a census (complete enumeration), not a sample comparison.

---

## FD Gap by Provider (n >= 20 evaluable, ordered by FD gap)

| Provider | n | Strict | Broad | FD | Gap |
|----------|---|--------|-------|-----|-----|
| xiaomi | 21 | 9.5% | 38.1% | 61.9% | +23.8pp |
| ollama | 1,713 | 29.2% | 46.3% | 67.2% | +20.9pp |
| qwen | 23 | 13.0% | 60.9% | 78.3% | +17.4pp |
| meta | 99 | 12.1% | 45.5% | 59.6% | +14.1pp |
| google | 343 | 10.8% | 16.6% | 24.5% | +7.9pp |
| liquid | 145 | 33.8% | 68.3% | 75.2% | +6.9pp |
| deepseek | 210 | 37.6% | 55.7% | 61.4% | +5.7pp |
| mistralai | 477 | 51.4% | 62.5% | 67.9% | +5.4pp |
| stepfun | 62 | 12.9% | 22.6% | 25.8% | +3.2pp |
| meta-llama | 418 | 32.5% | 53.3% | 56.2% | +2.9pp |
| nvidia | 830 | 43.0% | 61.4% | 64.0% | +2.6pp |
| openai | 514 | 53.5% | 61.5% | 63.0% | +1.5pp |
| anthropic | 172 | 7.6% | 11.0% | 12.2% | +1.2pp |

**Notable changes from prior:** The ollama provider FD gap expanded significantly (+20.9pp), driven by 358 HALLUCINATION_REFUSAL verdicts across local Ollama models. This suggests small local models (deepseek-r1:1.5b, qwen3:1.7b) frequently produce refusal framing that does not prevent content generation -- consistent with the VLA PARTIAL dominance finding (Report #49).

---

## Heuristic vs LLM Verdict Comparison (Mistake #21 Compliance)

Per Mistake #21, heuristic and LLM verdicts must be reported separately. The heuristic classifier (keyword-based) has kappa=0.126 agreement with LLM verdicts (near chance).

| Metric | Heuristic | LLM (Haiku) |
|--------|-----------|-------------|
| Corpus-wide ASR | Not recomputed (heuristic systematically overestimates) | Strict 46.89%, Broad 84.09% |
| Newly graded COMPLIANCE rate | N/A (most had heuristic verdicts prior) | 7.8% of new results |
| Agreement (kappa) | 0.126 [0.108, 0.145] | Reference standard |

The LLM-graded numbers are the authoritative values. Heuristic verdicts remain in the database for audit purposes but should not be cited in any research output.

---

## Batch Grader Pagination Bug

The `batch_llm_grader.py` uses `OFFSET` pagination on a query with `WHERE llm_verdict IS NULL`. As results are graded (llm_verdict is SET), they disappear from the query, causing the offset to skip over remaining ungraded results. This required 4 passes to complete grading.

**Recommendation:** Fix the pagination to use keyset pagination (`WHERE id > last_id`) instead of `OFFSET`. This would complete in a single pass.

---

## Cross-Corpus Comparison

The cross-corpus comparison (tools/analysis/cross_corpus_comparison.py) was run with updated data. Key findings:

- 9 comparison pairs across 4 matched models (llama-3.1-8b abliterated, llama-3.3-70b, mistral-7b, gpt-4o-mini)
- 23 models in public benchmarks remain unmatched in our corpus
- Pooled Spearman rho = -0.404 (negative correlation driven by abliterated model inclusion and different prompt mixes)
- llama-3.3-70b-instruct is the strongest convergence point: our Strict 14.3% vs JailbreakBench 14.0% (+0.3pp)
- Mistral-7b shows our corpus dramatically lower (0% vs 20-60% public) -- likely due to DAN-era prompt dominance in our corpus

---

## Action Items

1. Update CANONICAL_METRICS.md with new three-tier ASR values
2. Fix batch_llm_grader.py pagination bug (keyset pagination)
3. Consider grading OBLITERATUS results if needed for completeness (78,585 remaining)
4. The high NOT_GRADEABLE rate (31.8% of new results) warrants investigation -- are these garbled outputs or non-English responses?
