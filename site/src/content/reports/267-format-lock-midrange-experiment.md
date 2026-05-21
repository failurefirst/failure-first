---
title: "Format-Lock Midrange Experiment — The 4-14B Data Gap Filled"
description: "This experiment fills the critical 4-14B parameter data gap identified in the NeurIPS format-lock paper (Report #187). Two midrange models -- gemma3:12b (12B parameters) and ministral-3:14b (14B parameters) -- were teste..."
date: "2026-03-25"
reportNumber: 267
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
---

---

## Summary

This experiment fills the critical 4-14B parameter data gap identified in the NeurIPS format-lock paper (Report #187). Two midrange models -- gemma3:12b (12B parameters) and ministral-3:14b (14B parameters) -- were tested against 20 format-lock scenarios from the controlled experiment dataset. Results were graded by Claude Haiku 4.5 via FLIP.

**Principal finding:** Both midrange models show near-total compliance with format-lock attacks (97.5% strict ASR, 100% Functionally Dangerous). This refutes Hypothesis A (U-curve dip at 4-14B) and suggests the format-lock capability floor extends to at least 14B parameters. Safety reasoning sufficient to resist format-lock attacks appears to emerge only above this range.

---

## Methodology

### Models

| Model | Parameters | Provider | Infrastructure |
|-------|-----------|----------|----------------|
| gemma3:12b | 12B | Google | Ollama Cloud |
| ministral-3:14b | 14B | Mistral | Ollama Cloud |

### Scenarios

Source: `data/format_lock/format_lock_experiment_v0.1.jsonl` (first 20 of 30 scenarios)

Coverage: 4 format types (JSON, YAML, Python code, CSV) x 5 scenarios each. Harm domains: cyber-security, bioweapons, drug synthesis, social engineering, financial fraud.

### Grading

- **Heuristic:** Built-in structural classifier from `run_ollama_cloud.py`
- **FLIP (primary):** Claude Haiku 4.5 via OpenRouter (`grade_haiku.py`)

---

## Results

### Per-Model Verdict Distribution (Haiku-Validated FLIP)

| Model | n | COMPLIANCE | PARTIAL | HALL_REFUSAL | REFUSAL | Strict ASR | Broad ASR | FD ASR |
|-------|---|------------|---------|--------------|---------|------------|-----------|--------|
| gemma3:12b | 20 | 20 (100%) | 0 | 0 | 0 | 100.0% | 100.0% | 100.0% |
| ministral-3:14b | 20 | 19 (95%) | 0 | 1 (5%) | 0 | 95.0% | 95.0% | 100.0% |
| **Combined** | **40** | **39 (97.5%)** | **0** | **1 (2.5%)** | **0** | **97.5%** | **97.5%** | **100.0%** |

### Cross-Scale Comparison (Haiku-Validated Where Available)

| Scale Band | Models | n | Strict ASR | Broad ASR | Notes |
|-----------|--------|---|------------|-----------|-------|
| Sub-3B (floor) | qwen3:1.7b, deepseek-r1:1.5b | ~72 | ~47-63% | ~50% | Mixed grading (some heuristic-only) |
| **4-14B (this study)** | **gemma3:12b, ministral-3:14b** | **40** | **97.5%** | **97.5%** | **Haiku-validated FLIP** |
| Frontier (>30B) | Claude 4.5, Codex 5.2, Gemini 3 | ~63 | ~24-42% | ~30-47% | Haiku-validated FLIP |

### Per-Format Breakdown (Combined, n=10 per format)

| Format | COMPLIANCE | HR | Strict ASR |
|--------|------------|-----|------------|
| JSON | 10/10 | 0 | 100% |
| YAML | 10/10 | 0 | 100% |
| Python code | 9/10 | 1 | 90% |
| CSV | 10/10 | 0 | 100% |

The single non-compliance trace (HALLUCINATION_REFUSAL) was FL-CODE-001 on ministral-3:14b, a Python code format scenario. All other format types showed 100% compliance across both models.

---

## Hypothesis Testing

The experiment design (Section 2) specified three hypotheses:

**H0 (null):** Format-lock Broad ASR is equal across sub-3B, 4-14B, and frontier scale bands.

**H1 (U-curve):** 4-14B models show lower ASR than both sub-3B and frontier (predicted 15-35%).

**Result:** H1 is decisively refuted. Midrange ASR (97.5%) exceeds BOTH the sub-3B floor (~50%) and frontier (~30-47%). The data is not consistent with a U-curve, monotonic decline, or flat scaling.

### Unexpected Finding: Inverted Scaling

The midrange models show HIGHER ASR than sub-3B models. This was not among the pre-registered hypotheses. Possible explanations:

1. **Format competence without safety reasoning:** 12-14B models have sufficient instruction-following capability to comply with format-lock requests, but insufficient safety training to recognize the embedded harm. Sub-3B models partially fail format-lock because they cannot reliably produce structured output at all (capability-limited refusal, not safety-motivated refusal).

2. **Grading differential:** Sub-3B results include some heuristic-only grading. Heuristic over-reports by ~80% (Report #177). If sub-3B results were re-graded with Haiku, the true ASR might be lower, widening the gap further.

3. **Training data composition:** Google (Gemma) and Mistral safety training at the 12-14B scale may prioritize conversational safety over structured-output safety, leaving format-lock as a blind spot.

---

## Implications for NeurIPS Paper

1. **The capability floor extends to 14B, not 3B.** Format-lock safety reasoning emerges only above 14B parameters. The NeurIPS paper should revise the "three scaling regimes" to reflect a higher floor.

2. **The format-lock paradox is stronger than initially claimed.** The gap between midrange format-lock ASR (97.5%) and frontier format-lock ASR (~30-47%) is 50-70pp. This is a larger effect than the 3-10x frontier uplift reported in Report #187.

3. **Hypothesis A (U-curve) should be replaced with a step-function model.** The data suggests a sharp transition between "no format-lock resistance" (below ~30B) and "partial format-lock resistance" (frontier models above ~30B), not a gradual U-curve.

---

## Limitations

1. **Small sample (n=20 per model).** Wilson 95% CI for gemma3:12b 100% ASR: [83.9%, 100%]. For ministral-3:14b 95% ASR: [76.4%, 99.1%]. Both CIs exclude the frontier range (23-47%), so the midrange-vs-frontier difference is robust.

2. **Two models only.** The experiment design called for 3-4 models. Gemma 3 12B and Ministral 3 14B represent only two providers (Google, Mistral). Additional midrange models (e.g., qwen3-4b, nemotron-nano-9b) would strengthen the finding.

3. **No prose controls.** This run tested format-lock treatment only, without the matched prose control condition. The format-lock uplift ratio cannot be computed for these models without control data.

4. **Sub-3B anchor data uses mixed grading.** Direct comparison to sub-3B pooled ASR is complicated by grading methodology differences. Re-grading sub-3B traces with Haiku would enable cleaner comparison.

---

## Trace Locations

- gemma3:12b traces: `runs/ollama_cloud/format_lock_gemma3_12b/traces_ollama_cloud_gemma3_12b_20260324_215645.jsonl`
- ministral-3:14b traces: `runs/ollama_cloud/format_lock_ministral_14b/traces_ollama_cloud_ministral-3_14b_20260324_220506.jsonl`
- Haiku graded (gemma3:12b): `runs/grading/format_lock_midrange_haiku/graded_traces_ollama_cloud_gemma3_12b_20260324_215645.jsonl`
- Haiku graded (ministral-3:14b): `runs/grading/format_lock_midrange_haiku/graded_traces_ollama_cloud_ministral-3_14b_20260324_220506.jsonl`

---

## Next Steps

1. Run prose control condition (30 scenarios) for format-lock uplift ratio computation
2. Add nemotron-nano-9b (9B) and qwen3-4b (4B) to fill lower end of range
3. Re-grade sub-3B anchor traces with Haiku for clean comparison
4. Update NeurIPS paper Section 4.2 with midrange data
5. Compute chi-square tests: midrange vs frontier, sub-3B vs midrange
