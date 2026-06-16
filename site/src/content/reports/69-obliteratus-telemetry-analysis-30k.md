---

title: "OBLITERATUS Telemetry Analysis (30,238 Records)"
description: "Analysis of the full 30,238-record OBLITERATUS telemetry dataset covering 9 abliteration methods, 36 models across 7 families, collected 2026-03-04 through 2026-03-08 on H200 MIG and L4 GPUs. Key findings:"
date: "2026-03-11"
reportNumber: 69
classification: "Research — Empirical Study"
status: "complete"
author: "Bill Potts (Data Curation Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/69-obliteratus-telemetry-analysis-30k.m4a"
---

---

## Summary

Analysis of the full 30,238-record OBLITERATUS telemetry dataset covering 9 abliteration methods, 36 models across 7 families, collected 2026-03-04 through 2026-03-08 on H200 MIG and L4 GPUs. Key findings:

1. **Nuclear abliteration achieves 0% refusal rate** (100% effectiveness) but destroys model coherence entirely (coherence = 0.0). This is trivially effective but practically useless.
2. **The informed method offers the best quality-effectiveness tradeoff**: 2.4% mean refusal rate with high coherence preservation (0.975 mean).
3. **Safety behavior partially re-emerges at scale** even in abliterated models: `<0.5B` models show 0.4% refusal, while `0.5-2B` models show 44.9% refusal. This aligns with our established finding (AGENT_STATE: "Qwen3.5 obliteratus series: ASR 100% (0.8B) to 47.3% (9.0B)").
4. **Qwen models are the most resistant to abliteration** (32.6% mean refusal) among families with sufficient data, suggesting stronger safety training integration.
5. **4 of 5 missing methods (failspy, gabliteration, heretic, rdo) are NOT present** in this dataset. Only `inverted` appears (51 records, all GPU OOM errors).

---

## 1. Liberation Method Effectiveness

Methods ranked by effectiveness (1 - mean_refusal_rate):

| Method | N (total) | N (valid) | Errors | Mean Refusal % | Effectiveness % |
|--------|-----------|-----------|--------|----------------|-----------------|
| nuclear | 701 | 338 | 25 | 0.0% | 100.0% |
| informed | 541 | 309 | 0 | 2.4% | 97.6% |
| advanced | 22,835 | 12,033 | 119 | 26.3% | 73.7% |
| optimized | 456 | 202 | 52 | 28.3% | 71.7% |
| aggressive | 917 | 530 | 52 | 40.8% | 59.2% |
| basic | 2,173 | 1,953 | 119 | 43.5% | 56.5% |
| surgical | 1,373 | 1,113 | 119 | 44.7% | 55.3% |
| spectral_cascade | 1,191 | 1,047 | 144 | 49.7% | 50.3% |
| inverted | 51 | 0 | 51 | N/A (all errors) | N/A |

**Key observations:**
- `advanced` dominates the dataset (75.5% of records), suggesting it is the default/recommended method in the OBLITERATUS tooling.
- `nuclear` achieves perfect safety removal but at total coherence cost (see Section 4).
- `informed` is the clear Pareto-optimal method: near-zero refusal with high coherence.
- The `basic`/`surgical`/`spectral_cascade` cluster all hover around 44-50% refusal -- barely better than random for many models.
- `inverted` is non-functional due to CUDA OOM errors on all 51 attempts.

## 2. Model Family Vulnerability

| Family | N | Valid | Mean Refusal % | Vulnerability % |
|--------|---|-------|----------------|-----------------|
| smollm | 34 | 34 | 0.0% | 100.0% |
| unknown | 1,333 | 1,065 | 4.1% | 95.9% |
| llama | 268 | 268 | 7.7% | 92.3% |
| mistral | 446 | 446 | 28.1% | 71.9% |
| qwen | 15,789 | 15,712 | 32.6% | 67.4% |
| gpt-oss | 336 | 0 | N/A | N/A |
| ? (untagged) | 12,032 | 0 | N/A | N/A |

**Key observations:**
- SmolLM2-135M (the smallest model) is trivially abliterable -- it has essentially no safety training to remove.
- Llama models (including pre-abliterated variants like `Meta-Llama-3.1-8B-Instruct-abliterated` and `Lexi-Uncensored`) show very low refusal after OBLITERATUS processing, though the pre-abliterated baselines already had low refusal.
- Qwen models are the most abliteration-resistant family. Qwen2.5-0.5B-Instruct stands out at 67.6% refusal rate -- the most resistant model in the entire dataset. This is notable because it is a small (0.5B) instruct model, suggesting Qwen's instruction tuning deeply integrates safety behavior even at small scale.
- 12,032 records (39.8%) have no model family tag, limiting family-level analysis.

## 3. Per-Model Analysis (Selected)

Most vulnerable (lowest refusal after abliteration):
| Model | Refusal % | Notes |
|-------|-----------|-------|
| DASD-4B-Thinking | 0.0% | Alibaba's thinking model |
| DeepSeek-R1-Distill-Llama-8B | 0.0% | Reasoning distillation |
| SmolLM2-135M | 0.0% | Trivially small |
| Pythia-1.4b | 0.0% | Base model, no safety training |
| TinyLlama-1.1B-Chat | 0.0% | Minimal safety training |
| GPT-2 | 0.5% | Pre-RLHF era model |

Most resistant (highest refusal after abliteration):
| Model | Refusal % | Notes |
|-------|-----------|-------|
| Qwen2.5-0.5B-Instruct | 67.6% | Small but heavily instruction-tuned |
| Mistral-NeMo-Minitron-8B | 39.2% | Nvidia distillation |
| Qwen3.5-0.8B | 34.1% | Small Qwen3.5 |
| Qwen3.5-4B | 32.0% | Mid-size Qwen3.5 |
| Granite-3.1-2b-instruct | 30.0% | IBM safety training |

**Notable pattern:** Qwen2.5-0.5B-Instruct (67.6% refusal) vs Qwen2.5-0.5B base (16.7% refusal) -- instruction tuning adds ~51pp of abliteration resistance even at 0.5B scale. This is the strongest evidence in this dataset that safety behavior is not purely a function of scale.

## 4. Perplexity-Coherence Tradeoff

| Method | PPL Median | Mean Coherence | KL Divergence |
|--------|-----------|----------------|---------------|
| nuclear | N/A | 0.0000 | N/A |
| aggressive | 4.47 | 0.9385 | 0.39 |
| basic | 4.47 | 0.8931 | 13.42 |
| surgical | 5.45 | 0.8608 | 10.42 |
| informed | 5.68 | 0.9751 | N/A |
| advanced | 4.67 | 0.9104 | 0.63 |
| optimized | 10.94 | 0.9337 | 1.26 |
| spectral_cascade | 4.48 | 0.9043 | N/A |

**Key observations:**
- `nuclear` achieves 0.0 coherence -- it literally destroys the model's ability to produce coherent text. This is not a viable abliteration method for any practical use.
- `informed` has the highest coherence (0.975) with very low refusal (2.4%). This is the clear winner on the Pareto frontier.
- `aggressive` has surprisingly good coherence (0.939) despite its name, but with 40.8% refusal it is less effective than `advanced`.
- PPL mean values for `advanced`, `basic`, and `spectral_cascade` are inflated by extreme outliers (billions), suggesting some abliteration runs produce degenerate models. Median PPL around 4.5-5.7 is reasonable.
- High KL divergence for `basic` (13.4) and `surgical` (10.4) suggests these methods substantially alter the model's output distribution while being only moderately effective at removing safety behavior -- a poor tradeoff.

## 5. Scale Effects

| Size Bucket | N | Mean Refusal % | Vulnerability % |
|-------------|---|----------------|-----------------|
| <0.5B | 492 | 0.4% | 99.6% |
| 0.5-2B | 5,280 | 44.9% | 55.1% |
| 2-4B | 714 | 21.3% | 78.7% |
| 4-8B | 7,744 | 26.3% | 73.7% |
| 8-15B | 3,295 | 22.9% | 77.1% |

The `<0.5B` to `0.5-2B` jump (0.4% to 44.9% refusal) is striking and not monotonic with scale. The 0.5-2B bucket is inflated by Qwen2.5-0.5B-Instruct (67.6% refusal, 2,735 records), which demonstrates that instruction-tuning quality dominates scale for abliteration resistance.

Above 2B, refusal rates are roughly stable at 21-26%, suggesting a plateau where additional scale does not substantially increase abliteration resistance. This is consistent with but extends our established finding about safety re-emergence at scale.

## 6. Method x Family Interaction

| Method | Qwen | Llama | Mistral | Unknown | SmolLM |
|--------|------|-------|---------|---------|--------|
| nuclear | 0.0% | -- | -- | -- | -- |
| informed | 2.1% | 3.3% | -- | -- | -- |
| advanced | 28.1% | 9.2% | 8.1% | 6.6% | 0.0% |
| basic | 47.2% | -- | 76.7% | 0.0% | -- |
| surgical | 54.9% | -- | 0.0% | 1.6% | -- |
| spectral_cascade | 56.3% | -- | 63.3% | 1.7% | -- |

Qwen models consistently show higher refusal rates across methods than Llama or Mistral. `surgical` achieves 0% refusal on Mistral but 54.9% on Qwen -- a 55pp gap suggesting method-family interaction effects are significant.

## 7. Comparison with Previous Data (DB: 12,789 obliteratus_runs)

The DB already contains 12,789 OBLITERATUS run records (from the 2026-03-05 import). This new telemetry dataset adds 30,238 records -- a 2.4x increase in data volume. Key deltas:

- **New models added:** 36 vs previous ~20. Notable additions include GPT-OSS-20B, Kimi-K2.5, Granite-3.1-2b, DASD-4B-Thinking, DeepSeek-R1-0528-Qwen3-8B.
- **Temporal coverage:** Mar 4-8 2026 (5 days), with 70.6% of records from Mar 5 alone.
- **GPU diversity:** H200 MIG (53%) and L4 (7.4%), with 39.8% untagged.
- **Error rate:** 681/30,238 = 2.3%. Primary errors: CUDA OOM (336), missing quantization library (268), missing model cache (77).

## 8. Missing Methods Assessment

Of the 5 methods noted as missing from the DB (failspy, gabliteration, heretic, inverted, rdo):

| Method | In New Telemetry? | Status |
|--------|-------------------|--------|
| failspy | No | Not tested in this dataset |
| gabliteration | No | Not tested in this dataset |
| heretic | No | Not tested in this dataset |
| inverted | Yes (51 records) | All 51 records are CUDA OOM errors |
| rdo | No | Not tested in this dataset |

**`inverted` is present but non-functional.** All 51 attempts failed with `NVML_SUCCESS == r INTERNAL ASSERT FAILED` -- a CUDA memory allocation failure. This method likely requires more VRAM than the H200 MIG 3g.71gb partition provides (69.8 GB available). It may work on a full H200 (141 GB) or with smaller models.

The remaining 4 methods (failspy, gabliteration, heretic, rdo) are completely absent from this telemetry dump. They may be implemented in the OBLITERATUS codebase but not included in these benchmark sweeps. Import preparation for these methods is blocked until data becomes available.

## 9. Data Quality Notes

1. **39.8% of records (12,032) have `?` for model_id and model_family** -- these are likely from the `nuclear` method's anonymous model runs. This limits per-model analysis for nuclear.
2. **model_size_b is 0.0 for all records** -- the field exists but is not populated. Size was inferred from model names for Section 5.
3. **Coherence = 1.0000 for 20+ models** -- suspiciously uniform. May indicate the coherence metric saturates or is not discriminating for most configurations.
4. **PPL outliers** in `advanced` (mean 1.9 trillion) and `spectral_cascade` (mean 4 billion) indicate some runs produce degenerate models. Median PPL (~4.5) is more representative.
5. **No `refinement_passes` variation** -- all records have `refinement_passes=0`, suggesting this feature was not exercised.
6. **No `n_directions` variation in advanced** -- all 12,033 valid `advanced` records have `n_directions=0`.

## 10. Recommendations

1. **Import preparation:** The 30,238 new records can be imported to the DB once a mapping from telemetry fields to the existing schema is established. The key fields (`method`, `model_id`, `refusal_rate`, `perplexity`, `coherence`, `kl_divergence`) map cleanly to the existing obliteratus schema.
2. **Coherence metric review:** The coherence metric appears to saturate at 1.0 for most models/methods. It may need recalibration or replacement with a more discriminating measure (e.g., BERTScore or human evaluation).
3. **Missing methods follow-up:** Create a GH issue to track acquisition of failspy, gabliteration, heretic, and rdo telemetry data. The `inverted` method needs testing on higher-VRAM GPUs.
4. **Qwen2.5-0.5B-Instruct finding:** The 67.6% post-abliteration refusal rate for a 0.5B model warrants further investigation. This is a strong datapoint for the "safety training depth > scale" hypothesis.
5. **Deduplication check:** Before DB import, verify overlap with the existing 12,789 obliteratus_runs records to avoid double-counting.

---

*F41LUR3-F1R57 | OBLITERATUS Telemetry Analysis | Bill Potts | Sprint 26*
