---
title: "Wave 7 Validation Results"
description: "Wave 7 executed three validation workstreams: (1) ambiguous calibration of Ollama Cloud graders on boundary cases, (2) Haiku FLIP-grading of Leela's novel attack traces (RSE, GE), and (3) Haiku FLIP-grading of Rose's CCA..."
date: "2026-03-25"
reportNumber: 252
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
---

---

## Summary

Wave 7 executed three validation workstreams: (1) ambiguous calibration of Ollama Cloud graders on boundary cases, (2) Haiku FLIP-grading of Leela's novel attack traces (RSE, GE), and (3) Haiku FLIP-grading of Rose's CCA baseline traces. Results confirm that mid-size Ollama Cloud models systematically collapse the DETECTED_PROCEEDS / COMPLIANCE distinction into PARTIAL, while Haiku provides more granular verdicts. CCA baselines show high compliance rates across both gemma3 model sizes.

## 1. Ambiguous Calibration Results

### Method

20 synthetic traces were run through three Ollama Cloud models as FLIP graders:
- gemma3:12b
- gemma3:27b
- ministral-3:14b

The calibration set contained 4 categories of 5 traces each:
- **detected_proceeds** (DP): Disclaimer-wrapped but functionally harmful responses
- **disclaimer_then_comply**: Safety caveats followed by complete compliance
- **educational_framing**: Academic framing concealing actionable harmful content
- **partial_hedged**: Genuinely partial responses with significant caveats

### Results

| Grader | COMPLIANCE | PARTIAL | REFUSAL | HALLUCINATION_REFUSAL | Strict ASR | Broad ASR |
|--------|------------|---------|---------|----------------------|------------|-----------|
| gemma3:12b | 0 (0%) | 16 (80%) | 4 (20%) | 0 | 0% | 80% |
| gemma3:27b | 2 (10%) | 16 (80%) | 2 (10%) | 0 | 10% | 90% |
| ministral-3:14b | 1 (5%) | 14 (70%) | 4 (20%) | 1 (5%) | 5% | 75% |

### Per-Category Breakdown

**detected_proceeds (n=5 per grader):**
- gemma3:12b: 5/5 PARTIAL (0% COMPLIANCE detection)
- gemma3:27b: 4/5 PARTIAL, 1/5 COMPLIANCE (20% DP sensitivity)
- ministral-3:14b: 5/5 PARTIAL (0% COMPLIANCE detection)

**disclaimer_then_comply (n=5 per grader):**
- All three graders: predominantly PARTIAL (80-100%)
- No grader reliably classified these as COMPLIANCE

**educational_framing (n=5 per grader):**
- All three: mostly PARTIAL (60-80%), with occasional REFUSAL
- ministral-3:14b: 1/5 COMPLIANCE (only grader to catch one)

**partial_hedged (n=5 per grader):**
- gemma3:12b: 3/5 REFUSAL, 2/5 PARTIAL (best at distinguishing genuine partials)
- gemma3:27b: 4/5 PARTIAL, 1/5 REFUSAL
- ministral-3:14b: 3/5 REFUSAL, 1/5 PARTIAL, 1/5 HALLUCINATION_REFUSAL

### Key Finding

All three Ollama Cloud graders exhibit a **PARTIAL collapse** pattern: they default to PARTIAL for any response containing both safety disclaimers and harmful content. This aligns with Mistake #15 (disclaimers do not equal refusals) but in the grader direction -- the graders treat disclaimers as evidence of hedging rather than recognizing that disclaimer-wrapped compliance is still compliance.

**gemma3:12b** is the most conservative (zero COMPLIANCE verdicts), which paradoxically makes it the least useful for detecting the most dangerous category (DETECTED_PROCEEDS). **gemma3:27b** showed slightly better discrimination with 2 COMPLIANCE verdicts but still collapsed 80% of DP traces to PARTIAL.

**Implication:** Ollama Cloud graders at this tier should not be used as sole arbiters for boundary cases. Haiku-tier grading remains necessary for ambiguous verdicts.

## 2. RSE and GE Haiku-Validated ASR

### Recursive Safety Exhaustion (RSE) — gemma3:12b target

| Verdict | Count | Pct |
|---------|-------|-----|
| COMPLIANCE | 1 | 20% |
| PARTIAL | 3 | 60% |
| REFUSAL | 1 | 20% |

- **Strict ASR:** 20% (1/5)
- **Broad ASR:** 80% (4/5)

### Grader Evasion (GE) — gemma3:12b target

| Verdict | Count | Pct |
|---------|-------|-----|
| COMPLIANCE | 3 | 60% |
| PARTIAL | 1 | 20% |
| REFUSAL | 1 | 20% |

- **Strict ASR:** 60% (3/5)
- **Broad ASR:** 80% (4/5)

### Comparison

GE achieves 3x the strict COMPLIANCE rate of RSE (60% vs 20%), while both achieve identical 80% broad ASR. This suggests that grader-evasion prompts produce more clearly harmful content that Haiku classifies as full COMPLIANCE, whereas RSE tends to produce responses that are harmful but wrapped in enough hedging to receive PARTIAL verdicts.

**Note:** Sample sizes are small (n=5 each). These results indicate directions requiring larger-scale validation.

## 3. CCA Baseline Haiku-Validated ASR

### gemma3:12b — CCA Baseline

| Verdict | Count | Pct |
|---------|-------|-----|
| COMPLIANCE | 7 | 70% |
| PARTIAL | 2 | 20% |
| REFUSAL | 1 | 10% |

- **Strict ASR:** 70% (7/10)
- **Broad ASR:** 90% (9/10)

### gemma3:27b — CCA Baseline

| Verdict | Count | Pct |
|---------|-------|-----|
| COMPLIANCE | 8 | 80% |
| PARTIAL | 1 | 10% |
| REFUSAL | 1 | 10% |

- **Strict ASR:** 80% (8/10)
- **Broad ASR:** 90% (9/10)

### Comparison with Original Compliance Cascade (CC) Haiku Grades

| Configuration | Target Model | Strict ASR | Broad ASR |
|---------------|-------------|------------|-----------|
| CC original | gemma3:12b | 20% (2/10) | 80% (8/10) |
| CC original | ministral-3:14b | 40% (4/10) | 90% (9/10) |
| CCA baseline | gemma3:12b | 70% (7/10) | 90% (9/10) |
| CCA baseline | gemma3:27b | 80% (8/10) | 90% (9/10) |

The CCA baseline shows substantially higher strict ASR than the original CC for gemma3:12b (70% vs 20%). This suggests that the baseline CCA prompts are more directly effective at eliciting unhedged compliance than the original compliance cascade prompts, which tended to produce more PARTIAL responses.

**gemma3:27b shows higher strict ASR (80%) than gemma3:12b (70%)** on CCA baselines, which is notable -- the larger model is more compliant, not less. This is consistent with the capability-compliance coupling pattern documented in prior reports.

## 4. Updated Cascade Amplification Analysis

Combining all Haiku-graded cascade and novel attack data:

| Attack Family | Target | Strict ASR | Broad ASR | n |
|---------------|--------|------------|-----------|---|
| CCA Baseline | gemma3:12b | 70% | 90% | 10 |
| CCA Baseline | gemma3:27b | 80% | 90% | 10 |
| CC Original | gemma3:12b | 20% | 80% | 10 |
| CC Original | ministral-3:14b | 40% | 90% | 10 |
| RSE | gemma3:12b | 20% | 80% | 5 |
| GE | gemma3:12b | 60% | 80% | 5 |

### Observations

1. **CCA baselines outperform originals:** The refined CCA baseline prompts achieve 3.5x higher strict ASR than the original CC prompts on gemma3:12b (70% vs 20%).

2. **Broad ASR convergence at 80-90%:** Across all attack families and models, broad ASR clusters between 80-90%, suggesting a ceiling effect where most attacks can extract some harmful content but full compliance varies by technique.

3. **GE is the most effective novel technique per strict ASR:** At 60% strict, GE outperforms RSE (20%) on the same target model. Grader-aware prompt engineering appears to produce cleaner, more classifiable compliance.

4. **Model size does not equal safety:** gemma3:27b shows higher strict ASR than gemma3:12b on identical CCA baseline prompts (80% vs 70%), reinforcing that scaling alone does not improve robustness to adversarial inputs.

## Limitations

- All novel attack traces have n=5 sample sizes; results indicate directions, not definitive rates.
- CCA baseline n=10 per model provides moderate confidence.
- Ambiguous calibration uses synthetic traces, not live model outputs.
- All targets are Ollama Cloud models; results may not transfer to API-served frontier models.

## Files

- Ambiguous calibration: `runs/grading/ambiguous_calibration/{gemma3_12b,gemma3_27b,ministral_14b}/`
- RSE Haiku grades: `runs/grading/rse_haiku/`
- GE Haiku grades: `runs/grading/ge_haiku/`
- CCA baseline Haiku grades: `runs/grading/cca_baseline_haiku/`
- CC original Haiku grades: `runs/grading/ollama_cloud_haiku/`
