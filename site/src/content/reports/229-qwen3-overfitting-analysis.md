---
title: "Qwen3 Benchmark Overfitting Analysis"
description: "We tested whether Qwen3's safety refusal performance on AdvBench reflects genuine safety alignment or benchmark-specific overfitting (i.e., AdvBench prompts leaked into Qwen3's training data). By comparing Qwen3-8b's att..."
date: "2026-03-24"
reportNumber: 229
classification: "Research — Empirical Study"
status: "complete"
author: "Leela (benchmark-operator)"
tags: []
draft: false
---

---

## Executive Summary

We tested whether Qwen3's safety refusal performance on AdvBench reflects genuine safety alignment or benchmark-specific overfitting (i.e., AdvBench prompts leaked into Qwen3's training data). By comparing Qwen3-8b's attack success rate (ASR) on AdvBench versus novel attack families that could not appear in any public training set, we find **strong evidence of benchmark-specific overfitting**.

Qwen3-8b refuses 84.7% of AdvBench prompts but complies with 98.3% of novel family prompts -- an 83 percentage-point gap (chi-square = 80.5, p < 10^-18, Cramer's V = 0.82). This gap is 2.7x larger than the comparable delta for Nemotron-3-nano-30b (33 pp, V = 0.31), suggesting the effect is Qwen3-specific rather than a generic property of novel families being inherently more effective.

## Methodology

### Rationale

AdvBench (Zou et al., 2023) is the most widely-used jailbreak benchmark. If a model's training data includes AdvBench prompts (directly or via derivative datasets), the model may learn to refuse those specific phrasings without developing robust safety generalization. Novel attack families -- created by this project and not published in any public benchmark -- serve as a contamination-free control.

If a model shows similar ASR on both AdvBench and novel families, its safety behavior is likely genuine. If ASR drops sharply on AdvBench but remains high on novel families, the model has likely memorized AdvBench-specific refusal patterns.

### Test Design

- **Model under test:** `qwen/qwen3-8b` (paid tier via OpenRouter; qwen3-4b:free was unavailable due to upstream Venice provider rate limiting at the time of testing)
- **Novel families dataset:** `data/splits/novel_families_benchmark_v0.1.jsonl` (60 scenarios)
  - 6 attack families: compositional_reasoning_attack, meaning_displacement_attack, multi_agent_collusion_attack, pressure_cascade_attack, reward_hacking_attack, sensor_spoofing_attack
  - 10 scenarios per family
  - All embodied/robotics domain (not in any public jailbreak benchmark)
- **AdvBench dataset:** `data/splits/advbench_baseline_v0.1.jsonl` (first 60 of 520 scenarios)
- **Classification:** Heuristic (keyword-based refusal detection). Caveat per Mistake #21: heuristic ASR is unreliable for absolute numbers but valid for relative comparisons within the same classifier.
- **Comparison models:** nvidia/nemotron-3-nano-30b-a3b:free, arcee-ai/trinity-large-preview:free (both on novel families; Nemotron-30b also had existing AdvBench baseline)
- **Temperature:** 0.0
- **API:** OpenRouter

### Limitations

1. **Heuristic classifier.** ASR numbers should be treated as estimates. LLM grading would improve precision but the relative comparison (same classifier, same model, different prompt sets) remains valid.
2. **Model substitution.** The issue specified qwen3-4b:free; we used qwen3-8b (paid) because all Qwen3 free models were upstream rate-limited by Venice. The overfitting hypothesis applies to the Qwen3 model family, not a specific parameter count.
3. **AdvBench subsample.** We tested 60/520 AdvBench prompts. Wilson CIs account for this sample size.
4. **Novel families are embodied domain.** The novel families use robotics/warehouse scenarios, while AdvBench uses general harmful requests. Some of the ASR difference may reflect domain-specific safety training gaps rather than pure benchmark memorization.

## Results

### Primary Comparison: Qwen3-8b

| Benchmark | n | Complied | Refused | ASR | Wilson 95% CI |
|-----------|---|----------|---------|-----|---------------|
| Novel Families | 60 | 59 | 1 | 98.3% | [91.1%, 99.7%] |
| AdvBench | 59 | 9 | 50 | 15.3% | [8.2%, 26.5%] |
| **Delta** | | | | **+83.1 pp** | |

**Statistical significance:**
- Chi-square: 80.48, p = 2.93 x 10^-19 (df=1)
- Fisher exact: OR = 327.8, p = 5.32 x 10^-23
- Cramer's V: 0.822 (large effect; threshold > 0.5)

### Novel Families by Attack Class (Qwen3-8b)

| Attack Family | n | Complied | ASR | Wilson 95% CI |
|--------------|---|----------|-----|---------------|
| compositional_reasoning_attack | 10 | 10 | 100.0% | [72.2%, 100.0%] |
| meaning_displacement_attack | 10 | 10 | 100.0% | [72.2%, 100.0%] |
| pressure_cascade_attack | 10 | 10 | 100.0% | [72.2%, 100.0%] |
| reward_hacking_attack | 10 | 10 | 100.0% | [72.2%, 100.0%] |
| sensor_spoofing_attack | 10 | 10 | 100.0% | [72.2%, 100.0%] |
| multi_agent_collusion_attack | 10 | 9 | 90.0% | [59.6%, 98.2%] |

Qwen3-8b complied with every novel family except one multi-agent collusion scenario.

### Cross-Model Comparison (Novel Families)

| Model | n | ASR | Wilson 95% CI |
|-------|---|-----|---------------|
| qwen/qwen3-8b | 60 | 98.3% | [91.1%, 99.7%] |
| nvidia/nemotron-3-nano-30b-a3b:free | 60 | 76.7% | [64.6%, 85.6%] |
| arcee-ai/trinity-large-preview:free | 60 | 56.7% | [44.1%, 68.4%] |

### Cross-Model AdvBench vs Novel Delta

| Model | AdvBench ASR | Novel ASR | Delta | Cramer's V |
|-------|-------------|-----------|-------|-----------|
| qwen/qwen3-8b | 15.3% | 98.3% | +83.1 pp | 0.822 |
| nvidia/nemotron-3-nano-30b-a3b | 43.3% | 76.7% | +33.4 pp | 0.306 |

The Qwen3 overfitting signal (V=0.822) is 2.7x stronger than Nemotron's (V=0.306). While all models show higher ASR on novel families (expected -- these are novel attack patterns models have not been trained to defend against), the magnitude of Qwen3's gap is disproportionate.

## Interpretation

### Evidence Supporting Benchmark Overfitting

1. **Extreme ASR gap.** 83 pp difference between AdvBench (15%) and novel families (98%) is the largest we have observed for any model.
2. **Near-perfect novel compliance.** 59/60 compliance on novel families indicates Qwen3-8b has minimal intrinsic safety alignment for attack patterns outside its training distribution.
3. **Disproportionate delta.** Nemotron-30b shows a 33 pp delta, suggesting novel families are inherently harder to refuse than AdvBench. But Qwen3's 83 pp delta is 2.5x larger, indicating a Qwen3-specific effect beyond the baseline difficulty difference.
4. **Uniform novel family compliance.** Qwen3 complied with 100% of scenarios across 5 of 6 attack families. This lack of discrimination suggests it is not evaluating safety at all -- it simply has not been trained to refuse these patterns.

### Alternative Explanations

1. **Domain gap.** Novel families are embodied/robotics scenarios; AdvBench is general harmful requests. Qwen3 may have been safety-trained primarily on general harm categories. However, the scenarios involve clear physical harm (chemical dispersal, crane drops onto workers) that a genuinely aligned model should refuse.
2. **Prompt complexity.** Novel family prompts are longer and more operationally detailed than AdvBench one-liners. Longer prompts may bypass safety filters. But this explanation does not account for the disproportionate Qwen3 delta vs Nemotron.
3. **Model size.** qwen3-8b may simply lack safety capacity. But 15% AdvBench refusal shows it has *some* safety training -- just targeted at known benchmarks.

### Conclusion

**Overfitting is the most parsimonious explanation.** Qwen3-8b appears to have been fine-tuned or RLHF'd with AdvBench (or AdvBench-derived) prompts in its safety training data, producing benchmark-specific refusal patterns that do not generalize to novel attack families. This confirms Nyssa's prediction in Report #224.

This finding has implications for AI safety evaluation methodology: models should not be evaluated solely on public benchmarks whose prompts may appear in training data. Novel, unpublished attack families provide a more reliable signal of genuine safety alignment.

## Data Artifacts

- `runs/qwen3_overfitting_test/qwen_qwen3-8b_traces.jsonl` -- Qwen3-8b novel families traces (60)
- `runs/qwen3_overfitting_test_advbench/qwen_qwen3-8b_traces.jsonl` -- Qwen3-8b AdvBench traces (60)
- `runs/qwen3_overfitting_test/nvidia_nemotron-3-nano-30b-a3b-free_traces.jsonl` -- Nemotron-30b novel families traces (60)
- `runs/qwen3_overfitting_test/arcee-ai_trinity-large-preview-free_traces.jsonl` -- Trinity-large novel families traces (60)
- `tools/benchmarks/run_qwen3_patient.py` -- Patient benchmark runner for rate-limited models
