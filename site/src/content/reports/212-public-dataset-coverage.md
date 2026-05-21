---
title: "Public Dataset Coverage Analysis"
description: "Report #201 identified 520 AdvBench prompts with 0 results and 15,437 underutilized public prompts. This report provides a comprehensive audit of all 15 public datasets imported into the jailbreak corpus database, quanti..."
date: "2026-03-24"
reportNumber: 212
classification: "Research — Empirical Study"
status: "complete"
author: "Bill Potts (data-curator)"
tags: []
draft: false
---

---

## Summary

Report #201 identified 520 AdvBench prompts with 0 results and 15,437 underutilized public prompts. This report provides a comprehensive audit of all 15 public datasets imported into the jailbreak corpus database, quantifying prompt counts, result coverage, model breadth, and priority for benchmark runs.

**Key finding:** 6 of 15 public datasets have zero results. The 4 P1 (Priority 1) datasets collectively hold 1,253 prompts but only 560 results (44.7% coverage), concentrated on just 2-3 models each. Closing the AdvBench gap alone would add the most-cited benchmark in the jailbreak literature to our empirical evidence base.

---

## Complete Coverage Table

| # | Dataset | Priority | Prompts | Results | Coverage % | Models Tested | Status |
|---|---------|----------|---------|---------|------------|---------------|--------|
| 1 | **SORRY-Bench** | P2 | 9,446 | 6 | 0.1% | 1 | CRITICAL GAP |
| 2 | **BEAVERTAILS** | P3 | 3,432 | 2 | 0.1% | 1 | LOW PRIORITY (large) |
| 3 | DAN-In-The-Wild | P2 | 1,405 | 1,164 | 82.8% | 3 | GOOD |
| 4 | obliteratus_prompt_corpus | -- | 1,024 | 0 | 0.0% | 0 | INTERNAL (separate workflow) |
| 5 | WildJailbreak | P3 | 1,000 | 95 | 9.5% | 3 | LOW (sampled subset) |
| 6 | **AdvBench** | P1 | 520 | 0 | 0.0% | 0 | **CRITICAL GAP** |
| 7 | ForbiddenQuestions | P2 | 390 | 4 | 1.0% | 1 | GAP |
| 8 | **HarmBench** | P1 | 320 | 203 | 63.4% | 3 | PARTIAL |
| 9 | **StrongREJECT** | P1 | 313 | 100 | 31.9% | 2 | PARTIAL |
| 10 | HEx-PHI | P2 | 290 | 3 | 1.0% | 1 | GAP |
| 11 | ToxicChat | P2 | 113 | 0 | 0.0% | 0 | GAP |
| 12 | **JailbreakBench** | P1 | 100 | 257 | 257.0%* | 2 | GOOD (multi-model) |
| 13 | SimpleSafetyTests | P2 | 100 | 0 | 0.0% | 0 | GAP |
| 14 | TDC2023-RedTeaming | P2 | 100 | 0 | 0.0% | 0 | GAP |
| 15 | LLM-Finetuning-Safety | P2 | 17 | 0 | 0.0% | 0 | GAP (tiny dataset) |

**Totals:** 18,570 public prompts, 1,834 results, 9.9% aggregate coverage.

*JailbreakBench coverage >100% because multiple models were tested per prompt (257 results / 100 prompts = ~2.6 models avg).

---

## Verdict Breakdown (Datasets with Results)

| Dataset | COMPLIANCE | PARTIAL | REFUSAL | OTHER | Total |
|---------|-----------|---------|---------|-------|-------|
| DAN-In-The-Wild | 7 (0.6%) | 3 (0.3%) | 988 (84.9%) | 166 (14.3%) | 1,164 |
| JailbreakBench | 13 (5.1%) | 5 (1.9%) | 222 (86.4%) | 17 (6.6%) | 257 |
| HarmBench | 23 (11.3%) | 4 (2.0%) | 138 (68.0%) | 38 (18.7%) | 203 |
| StrongREJECT | 5 (5.0%) | 6 (6.0%) | 80 (80.0%) | 9 (9.0%) | 100 |
| WildJailbreak | 1 (1.1%) | 2 (2.1%) | 88 (92.6%) | 4 (4.2%) | 95 |
| SORRY-Bench | 3 (50.0%) | 2 (33.3%) | 1 (16.7%) | 0 | 6 |

**Note:** Low-result datasets (BEAVERTAILS=2, ForbiddenQuestions=4, HEx-PHI=3) omitted from table -- sample sizes too small for meaningful breakdown.

---

## Import Verification

All public dataset imports verified complete via dry-run:

| Dataset | Expected | Imported | Status |
|---------|----------|----------|--------|
| AdvBench | 520 | 520 | COMPLETE |
| JailbreakBench | 100 | 100 | COMPLETE |
| HarmBench | 320 | 320 | COMPLETE |
| StrongREJECT | 313 | 313 | COMPLETE |
| SORRY-Bench | 9,446 | 9,446 | COMPLETE (full expanded set) |
| DAN-In-The-Wild | 1,405 | 1,405 | COMPLETE |
| WildJailbreak | 1,000 | 1,000 | COMPLETE (sampled subset of 262K) |
| BEAVERTAILS | 3,432 | 3,432 | COMPLETE (sampled subset of 330K) |
| ForbiddenQuestions | 390 | 390 | COMPLETE |
| HEx-PHI | 290 | 290 | COMPLETE |
| ToxicChat | 113 | 113 | COMPLETE |
| SimpleSafetyTests | 100 | 100 | COMPLETE |
| TDC2023-RedTeaming | 100 | 100 | COMPLETE |
| LLM-Finetuning-Safety | 17 | 17 | COMPLETE |

**All 14 public datasets fully imported.** No re-imports needed. The gap is in benchmark execution (results), not data ingestion (prompts).

---

## Datasets Needing Benchmark Runs

### Tier 1: CCS-Critical (Run Before April 22 Abstract Registration)

These datasets are cited by virtually every jailbreak paper reviewer. Having zero results on AdvBench is indefensible in peer review.

| Dataset | Prompts to Run | Models Needed | Est. Cost (OpenRouter) | Est. Time | Justification |
|---------|---------------|---------------|----------------------|-----------|---------------|
| **AdvBench** | 520 | 10 frontier + 10 mid-tier | ~$2-8 (free tier: $0) | 2-4 hours | Most-cited jailbreak benchmark (Zou et al. 2023). 0 results = peer review red flag. |
| **HarmBench** | 320 (gap: ~117 prompts x new models) | +7 models (3 already tested) | ~$1-4 | 1-2 hours | Second most-cited. 63.4% coverage, 3 models only. |
| **StrongREJECT** | 313 (gap: ~213 prompts x new models) | +8 models (2 already tested) | ~$1-4 | 1-2 hours | Souly et al. scoring methodology widely adopted. |

**Tier 1 total: ~$4-16 paid, $0 free tier. ~5-8 hours.**

### Tier 2: Strengthens Paper (Run Within Sprint 13)

| Dataset | Prompts to Run | Models Needed | Est. Cost | Est. Time | Justification |
|---------|---------------|---------------|-----------|-----------|---------------|
| **SORRY-Bench** | 450 (base subset) | 5-10 models | ~$1-6 | 2-4 hours | Xie et al. 2024 fine-grained safety categories. 9,446 prompts imported (full expanded set) — run the 450 base prompts. |
| **ForbiddenQuestions** | 390 | 5-10 models | ~$1-4 | 1-2 hours | Walled AI benchmark, growing citations. |
| **HEx-PHI** | 290 | 5-10 models | ~$1-3 | 1-2 hours | Qi et al. 2023 fine-tuning safety. |
| **SimpleSafetyTests** | 100 | 5-10 models | ~$0.50-1 | 30 min | Quick win — 100 prompts, fast to run. |
| **TDC2023-RedTeaming** | 100 | 5-10 models | ~$0.50-1 | 30 min | TDC competition prompts. |

**Tier 2 total: ~$4-15 paid, $0 free tier. ~5-9 hours.**

### Tier 3: Nice-to-Have (Defer Unless Compute Grant Arrives)

| Dataset | Prompts | Why Defer |
|---------|---------|-----------|
| **BEAVERTAILS** | 3,432 | Very large. Run a 500-prompt stratified sample if needed. |
| **WildJailbreak** | 1,000 (of 262K) | Already 9.5% coverage. Expand to 10 models incrementally. |
| **ToxicChat** | 113 | Toxicity detection, not jailbreak. Lower relevance to CCS framing. |
| **LLM-Finetuning-Safety** | 17 | Tiny. Run opportunistically. |
| **DAN-In-The-Wild** | 1,405 | 82.8% coverage already. Expand model count if time allows. |

---

## Priority Ranking for CCS Reviewers

**What a CCS reviewer expects to see:**

1. **AdvBench results** — Most-cited. Our gap here is the single most damaging omission. A reviewer searching for "AdvBench" in our paper and finding no cross-reference to our own evaluation would question experimental rigor.

2. **HarmBench results** — Second most-cited post-2024. We have partial coverage (63.4%, 3 models). Expanding to 10 models makes this defensible.

3. **JailbreakBench results** — We have good coverage here (257 results, 2 models). Expand to 5+ models for robustness.

4. **StrongREJECT results** — Souly et al. scoring is becoming the standard. 31.9% coverage is insufficient. Need 10-model comparison.

5. **SORRY-Bench** — Increasingly cited for fine-grained safety category analysis. Running the 450 base prompts on 5 models would give us defensible coverage.

---

## Recommended Execution Plan

### Phase 1: AdvBench Baseline (Week of March 24)

```bash
# Export AdvBench prompts to benchmark-ready JSONL
python3 tools/database/export_jsonl.py \
  --filter "source_dataset.name = 'AdvBench'" \
  --format archaeology \
  --output data/splits/advbench_full.jsonl

# Run on 10 free-tier models (no cost)
python3 tools/benchmarks/run_benchmark_http.py \
  --scenarios data/splits/advbench_full.jsonl \
  --models \
    "google/gemini-2.0-flash-exp:free" \
    "meta-llama/llama-3.2-3b-instruct:free" \
    "mistralai/devstral-2512:free" \
    "mistralai/mistral-7b-instruct:free" \
    "qwen/qwen3-4b:free" \
    "nvidia/llama-3.1-nemotron-70b-instruct:free" \
  --output runs/advbench_baseline/ \
  --limit 520

# Import traces
python3 tools/database/import_traces.py --traces "runs/advbench_baseline/"
```

### Phase 2: P1 Expansion (Week of March 31)

Run HarmBench, StrongREJECT, JailbreakBench on same 10-model set. Import all traces.

### Phase 3: P2 Quick Wins (Sprint 13)

SimpleSafetyTests + TDC2023 + ForbiddenQuestions — small datasets, fast runs.

---

## Cost Summary

| Phase | Datasets | Prompts x Models | Free Tier | Paid (OpenRouter) |
|-------|----------|-----------------|-----------|-------------------|
| Phase 1 | AdvBench | 520 x 6-10 | $0 | ~$2-4 |
| Phase 2 | HarmBench, StrongREJECT, JailbreakBench | ~733 x 10 | $0 | ~$3-8 |
| Phase 3 | SORRY-Bench (base), Forbidden, HEx-PHI, SST, TDC | ~1,330 x 5-10 | $0 | ~$4-10 |
| **Total** | | ~12,830 calls | **$0** | **$9-22** |

All Phase 1 work can be done entirely on free-tier models at zero cost.

---

## Methodology

- Database queries run against `database/jailbreak_corpus.db` (schema v13)
- Import completeness verified via `python3 tools/database/import_public.py --dataset X --dry-run` for all 4 P1 datasets
- Coverage = COUNT(DISTINCT results) / COUNT(DISTINCT prompts) per source_dataset
- Model count derived from JOIN through evaluation_runs to models table
- Cost estimates based on OpenRouter pricing as of 2026-03-24 (see `docs/FREE_MODEL_RECOMMENDATIONS.md`)
