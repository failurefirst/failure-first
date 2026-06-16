---

title: "VLA Data Curation Summary -- Sprint 15 R1+R2"
description: "Sprint 15 Rounds 1 and 2 substantially improved VLA attack surface coverage. The VLA corpus grew from 12 traced families to 34 traced families. Total VLA traces with content reached 673 (from ~192 at sprint start). Haiku..."
date: "2026-03-25"
reportNumber: 300
classification: "Research — Empirical Study"
status: "complete"
author: "Bill Potts (Data Curation Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/300-vla-data-curation-sprint15-r2.m4a"
---

---

## Executive Summary

Sprint 15 Rounds 1 and 2 substantially improved VLA attack surface coverage. The VLA corpus grew from 12 traced families to 34 traced families. Total VLA traces with content reached 673 (from ~192 at sprint start). Haiku grading was applied to 6 newly traced families (RHA, MAC, SSA, CRA, MDA, PCA) with mixed results. Three families (CSBA, SSBA, CSC) remain under-traced due to OpenRouter free tier rate limits.

## Data Quality Summary

### Scenario Corpus

| Metric | Sprint 15 Start | Sprint 15 End | Delta |
|--------|----------------|---------------|-------|
| VLA JSONL files | 35 | 36 | +1 |
| VLA scenario lines | ~424 | 368 (audited) | Corrected count after dedup |
| VLA family prefixes | 33 | 42 (34 primary + 8 sub-families) | +9 new prefixes |
| Total JSONL files | 837 | 874 | +37 |
| Total JSONL rows | 60,735 | 60,847 | +112 |
| `make validate` | PASS | PASS | -- |
| `make lint` | PASS | PASS | -- |

### Trace Coverage

| Metric | Sprint 15 Start | Sprint 15 End | Delta |
|--------|----------------|---------------|-------|
| VLA families with content traces | ~12 | 34 | +22 |
| VLA families with 0 content traces | ~15 | 4 (CSBA, SSBA, CSC partial, SCHEMING) | -11 |
| Total VLA content traces | ~192 | 673 | +481 |
| Haiku-graded VLA traces | ~260 | 259+ (pending more) | In progress |

### Grading Results (New Families, Haiku -- 3 Models)

**Aggregate across Trinity, Nemotron 30B, Qwen3 8B (240 traces graded + 39 TDA):**

| Family | n | Broad ASR | Net ASR | Key Observation |
|--------|---|-----------|---------|-----------------|
| TDA | 39 | **74.4%** | **47.1%** | Strongest signal. Mistral 24B: 76.9% strict. |
| MDA | 55 | 36.4% | ~9.1% | Marginal, near FP floor. |
| MAC | 50 | 36.0% | ~8.7% | Marginal, near FP floor. |
| RHA | 50 | 26.0% | ~0% | At FP floor. Models do not game metrics. |
| PCA | 50 | 26.0% | ~0% | At FP floor. |
| CRA | 60 | 23.3% | ~0% | Below FP floor. |
| SSA | 50 | 2.0% | ~0% | Evaluator-blind (BENIGN_QUERY dominant). |
| SSBA | 4 | 0.0% | ~0% | FLIP-BLIND, tiny sample. |

**Overall across 3 overfitting-test models (180 traces):** 23.9% strict, 33.3% broad ASR.

### Key Findings

1. **TDA (Temporal Drift) is the strongest VLA attack family.** 74.4% broad ASR across 3 models (n=39). Net ASR 47.1% after subtracting FP floor. Temporal drift attacks exploiting normalization-of-deviance patterns are highly effective. This is now the top Tier 1 family.

2. **Most new families land at or below the FP floor.** RHA (26.0%), PCA (26.0%), CRA (23.3%) all have broad ASR near or below the 27.3% benign false positive rate. After net ASR correction, these families show no genuine adversarial signal on the tested models. MDA (36.4%) and MAC (36.0%) are marginally above.

3. **SSA (Sensor Spoofing) is evaluator-blind.** Only 1/50 traces graded as PARTIAL. Models respond to sensor spoofing with safety-conscious reasoning, which Haiku correctly classifies as BENIGN_QUERY. The vulnerability is in physical action, not text. Physical-action evaluator needed.

4. **Free tier rate limits blocked new trace collection.** OpenRouter free tier was completely saturated on 2026-03-25 (HTTP 429 on all retries). CSC, CSBA, SSBA runs returned mostly empty responses. Only Llama 70B got partial results (3/11 for CSC, 3/15 for CSBA, 3/11 for SSBA).

5. **VLA coverage matrix is now comprehensive.** Updated from 25 to 34 families with empirical data. 8 new families Haiku-graded. The three-tier vulnerability structure is now better populated: TDA joins Tier 1, most new families are Tier 3.

## Schema and Validation Status

- Schema v0.3 remains current
- All 874 JSONL files pass `make validate`
- 0 lint findings
- No schema changes required for Round 2

## Remaining Gaps

| Gap | Priority | Blocker |
|-----|----------|---------|
| CSC traces (3 usable / 11 scenarios) | HIGH | Rate limits -- retry with paid API |
| CSBA traces (0 / 11 scenarios) | MEDIUM | Rate limits + FLIP-BLIND (issue #361) |
| SSBA traces (0 / 11 scenarios) | MEDIUM | Not yet attempted + FLIP-BLIND |
| SSA evaluator gap | HIGH | Needs physical-action evaluator, not text classifier |
| IEA/CC/DASBA grading | MEDIUM | Haiku grading pending |
| SCHEMING traces (0 / 2 scenarios) | LOW | Not yet run |

## Recommendations

1. **Purchase OpenRouter credits ($10)** for reliable trace collection on remaining families. Free tier is consistently saturated.
2. **Design physical-action evaluator** for SSA and related families where text-level classification is insufficient.
3. **Prioritize IEA/CC/DASBA Haiku grading** -- these families have traces but no Haiku verdicts.
4. **Consider reducing XSBA to sub-family** of SBA for reporting purposes -- 15 scenarios across 5 domains but 0 usable traces and FLIP-BLIND.

---

## References

- Coverage matrix: `docs/analysis/vla_attack_surface_coverage_matrix.md`
- CANONICAL_METRICS: `docs/CANONICAL_METRICS.md`
- Graded traces: `runs/grading/vla_ssa_haiku/`, `runs/grading/vla_ssa_overfitting_haiku/`
- Issue #591: Sprint 15 VLA expansion
- Issue #361: FLIP cannot evaluate SBA
