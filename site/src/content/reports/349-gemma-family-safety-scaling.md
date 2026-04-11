---
title: "Gemma Family Safety Scaling: Does Safety Improve With Model Size and Generation?"
description: "Comprehensive intra-family safety analysis of 4 Gemma models across 13 attack types. Inter-generational improvement is real but attack-type-specific."
date: "2026-04-07"
reportNumber: 349
classification: "Research — Empirical Study"
status: "active"
author: "Failure-First Research Team"
tags: ["gemma", "inter-generational", "safety-scaling", "multi-attack", "format-lock"]
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/349-gemma-family-safety-scaling.m4a"
video: "https://cdn.failurefirst.org/video/reports/349-gemma-family-safety-scaling.mp4"
---

## Abstract

This report synthesizes all Gemma family testing from Sprints 22-24, providing the most comprehensive intra-family safety analysis in the Failure-First corpus. Four Gemma models (3:4b, 3:12b, 3:27b, 4:31b) were tested across up to 13 attack types, totalling over 1,000 traces with FLIP LLM grading. Inter-generational improvement from Gemma 3 to Gemma 4 is real but narrowly scoped: Gemma 4 shows a 58 percentage-point reduction on DeepInception (p=0.0046) and a 40 percentage-point reduction on Crescendo, yet no improvement on the standard jailbreak corpus (p=1.0) and comparable ASR on VLA action-layer requests (88.2%). Within Gemma 3, safety does not scale linearly with model size -- aggregate data suggests the 4B variant has lower ASR than the 27B variant, though this comparison is confounded by differing attack-type distributions. Format-lock achieves 100% compliance on gemma3:4b, consistent with the capability-floor hypothesis. These findings suggest that safety training investments are producing measurable but attack-type-specific improvements, and that single-number ASR metrics obscure meaningful variation in model vulnerability profiles.

---

## 1. Method

### 1.1 Models Tested

| Model | Parameters | Family | Generation |
|-------|-----------|--------|-----------|
| gemma3:4b | 4B | Gemma 3 | 3 |
| gemma3:12b | 12B | Gemma 3 | 3 |
| gemma3:27b | 27B | Gemma 3 | 3 |
| gemma4:31b | 31B | Gemma 4 | 4 |

### 1.2 Attack Types

Thirteen attack types were tested across the four models, including both single-shot and multi-turn scenarios: Crescendo, Authority Gradient, Elite Attack Suite, DeepInception, Format-lock, Compliance Cascade, CCA Evolved, Defense, Embodied Core, Intent Bait, VLA, Frontier Sweep, and the standard jailbreak corpus. Not all models were tested against all attack types; coverage is noted in the results.

### 1.3 Grading

All Sprint 23-24 traces were graded with FLIP LLM methodology. Multi-turn traces used final-turn grading (last assistant turn only). Single-shot traces used full-response grading with no truncation. Multiple graders were used across sprints (Gemini CLI, gemma3:27b via Ollama Cloud); cross-grader agreement has not been validated for all Gemma traces.

---

## 2. Results

### 2.1 Aggregate FLIP-Graded ASR

| Model | n (FLIP graded) | Strict ASR | Broad ASR | COMPLIANCE | PARTIAL | REFUSAL |
|-------|----------------|-----------|-----------|-----------|---------|---------|
| gemma3:4b | 174 | 29.9% | 40.8% | 52 | 19 | 37 |
| gemma3:12b | 41 | 58.5% | 63.4% | 24 | 2 | 10 |
| gemma3:27b | 108 | 54.6% | 66.7% | 59 | 13 | 28 |
| gemma4:31b | 319 | 37.3% | 40.1% | 119 | 9 | 132 |

The aggregate numbers are confounded by differing attack-type distributions across models. Matched comparisons (Section 2.2) provide cleaner signals.

### 2.2 Cross-Attack Comparison (All 13 Attack Types)

**Gemma 4 Full Profile (10 attack types with data):**

| Attack Type | FLIP ASR | n | Vulnerability Tier |
|-------------|---------|---|-------------------|
| VLA embodied | 88.2% | 51 | High |
| Standard corpus | 60.0% | 104 | High |
| DeepInception | 33.3% | 12 | Medium |
| Defense | 23.1% | 26 | Medium |
| Frontier sweep | 23.5% | 17 | Medium |
| Core embodied | 20.8% | 48 | Medium |
| Intent bait | 20.0% | 20 | Medium |
| Elite suite | 17.6% | 17 | Medium |
| Compliance cascade | 10.0% | 20 | Low |
| Crescendo | 10.0% | 20 | Low |
| Authority gradient (strict) | 0.0% | 23 | Low |
| Authority gradient (broad) | 34.8% | 23 | -- |
| CCA evolved | 0.0% | 8 | Low |

### 2.3 Three-Tier Vulnerability Analysis

- **High (>50% ASR):** VLA action-layer requests (88.2%) and historical jailbreaks from the standard corpus (60.0%). These represent attack surfaces where Gemma 4's safety training has minimal effect.
- **Medium (15-35% ASR):** Defense scenarios, frontier sweep, embodied core, intent bait, DeepInception, and elite suite. Partial resistance is present, but a meaningful fraction of attacks still succeed.
- **Low (<15% ASR):** Crescendo, compliance cascade, authority gradient (strict), and CCA evolved. These represent attack types where Gemma 4's safety training appears effective.

### 2.4 Inter-Generational Delta (Gemma 3 vs Gemma 4)

| Attack Type | Gemma 3 ASR | Gemma 4 ASR | Delta | Significance |
|-------------|-----------|-----------|-------|-------------|
| DeepInception | 91.7% (n=12) | 33.3% (n=12) | **-58pp** | p=0.0046, Fisher exact |
| Crescendo | 50% (n=20) | 10% (n=20) | **-40pp** | significant |
| Standard corpus | 60% | 60% | 0pp | p=1.0 |
| VLA | -- | 88.2% (n=51) | No baseline | action-layer bypass persists |

The improvement is concentrated on structured escalation attacks (nested fiction, multi-turn rapport-building). Historical jailbreaks and action-layer requests show no improvement.

### 2.5 Format-Lock: 100% ASR at the Capability Floor

Format-lock testing on gemma3:4b produced 100% strict compliance (30/30), compared to 8.3% on control scenarios (1/12) -- a +91.7 percentage-point delta. This result is consistent with findings on other sub-8B models (Report #348) and supports the capability-floor hypothesis: below a threshold of approximately 8B parameters, format compliance and safety reasoning are completely decoupled.

| Model | Format-Lock ASR | Control ASR | Delta |
|-------|----------------|------------|-------|
| gemma3:4b | 100% (30/30) | 8.3% (1/12) | +91.7pp |
| ministral-3:3b | 100% (30/30) | 41.7% (5/12) | +58.3pp |
| ministral-3:8b | 100% (30/30) | 25.0% (3/12) | +75.0pp |

### 2.6 The PARTIAL Problem on Authority Gradient

Gemma 4 shows a distinctive failure mode on authority-based attacks: 0% strict compliance but 34.8% PARTIAL. Under authority pressure, the model hedges while still providing partially actionable content. This pattern is absent from Crescendo and DeepInception responses, suggesting it is specific to authority-claim attack structures.

Binary safety metrics (COMPLIANCE/REFUSAL) undercount authority gradient effectiveness by 35 percentage points on Gemma 4. Evaluation frameworks that ignore PARTIAL verdicts miss this failure mode.

---

## 3. Discussion

### 3.1 Targeted Safety Training Works -- For Targeted Attacks

Gemma 4's RLHF appears to have improved resistance to structured escalation patterns (nested fiction, multi-turn rapport-building), but this improvement did not generalize to historical jailbreaks or action-layer requests. The improvement appears to be in the safety reasoning process for specific attack structures, not in the safety boundary itself.

### 3.2 Intra-Family Scaling Is Not Monotonic

Within Gemma 3, the larger models (12B, 27B) show higher aggregate ASR than the smaller model (4B). This comparison is confounded by differing attack distributions, and matched comparisons are in progress. However, the format-lock data provides one clean signal: gemma3:4b shows 100% ASR on format-lock, consistent with the capability-floor hypothesis that format compliance is easier to exploit when safety reasoning capacity is limited.

### 3.3 Single-Number ASR Is Misleading

Gemma 4's aggregate strict ASR of 37.3% obscures a range from 0% (authority gradient, CCA) to 88.2% (VLA). Any evaluation that reports only an aggregate number would miss the fact that Gemma 4 has genuinely improved safety against some attacks while remaining highly vulnerable to others. Attack-type-decomposed evaluation is essential for meaningful safety assessment.

---

## 4. Limitations

1. **Unmatched attack types across models.** Gemma 4 was tested against 13 attack types; gemma3:12b against 2. Direct scaling comparisons are limited to attack types with data on multiple models.
2. **Multiple graders across sprints.** Cross-grader agreement has not been validated for all Gemma traces. Per documented methodological concerns, single-grader ASR can vary by grader choice on ambiguous cases.
3. **Small n per cell.** Most per-model per-attack-type comparisons involve 12-25 traces, resulting in wide confidence intervals.
4. **API variation.** The same model accessed via different inference providers may behave differently due to differing inference configurations.
5. **Self-evaluation risk.** gemma3:27b was used as a grader for some traces involving Gemma family models, creating potential self-evaluation bias.

---

## 5. Related Reports

- **Report #342:** Gemma 4 standard corpus baseline (60% ASR)
- **Report #343:** DeepInception cross-model comparison (79.2% pooled ASR)
- **Report #344:** Crescendo 4-model replication (FLIP 10-85%)
- **Report #346:** Authority Gradient 3-model comparison
- **Report #347:** Gemma 4 comprehensive profile (13 attack types)
- **Report #348:** Format-lock mid-range capability floor (100% ASR)

---

## 6. Conclusion

Inter-generational safety improvement from Gemma 3 to Gemma 4 is real and statistically significant for structured escalation attacks (-58pp on DeepInception, -40pp on Crescendo). However, the improvement does not extend to historical jailbreaks, action-layer requests, or format-lock attacks. Safety evaluation must decompose results by attack type to distinguish genuine progress from persistent vulnerabilities. Format-lock remains the single most effective attack type in the corpus, achieving 100% compliance on all sub-8B models tested regardless of family.

---

*Report #349 -- Failure-First Research Brief Series*
*Classification: Research -- Empirical Study | Status: Active*
*Related: Reports #342, #343, #344, #346, #347, #348*
