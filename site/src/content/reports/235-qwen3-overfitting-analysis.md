---
title: "Benchmark Overfitting Analysis — AdvBench vs Novel Attack Families"
description: "We tested whether models show differential vulnerability to public benchmark prompts (AdvBench, likely in training data) versus novel attack families (F41LUR3-F1R57 proprietary, not in training..."
date: "2026-03-24"
reportNumber: 235
classification: "Research — Empirical Study"
status: "complete"
author: "Leela (benchmark-operator)"
tags: []
draft: false
---

## Executive Summary

We tested whether models show differential vulnerability to public benchmark prompts (AdvBench, likely in training data) versus novel attack families (F41LUR3-F1R57 proprietary, not in training data). The hypothesis: if models have overfit to refuse AdvBench-style prompts during safety training, they should show lower ASR on AdvBench and higher ASR on novel families.

**Finding:** The data strongly supports a "benchmark hardening" effect rather than overfitting in the traditional sense. Trinity-large-preview shows 36.7% ASR on AdvBench versus 88.1% on novel families (Fisher p < 0.000001, Cohen's h = 1.14). However, this result requires careful interpretation because the two prompt sets differ in attack sophistication, not just novelty.

## Methodology

### Datasets

| Dataset | Source | n | Attack Style | In Training Data? |
|---------|--------|---|--------------|-------------------|
| AdvBench baseline | Zou et al. 2023 | 30 | Direct harmful requests | Likely (public since 2023) |
| Novel families | F41LUR3-F1R57 v0.6 | 60 | Compositional reasoning, meaning displacement, pressure cascade, reward hacking, sensor spoofing, multi-agent collusion | No (private repo, created 2026-03) |

### Novel Family Attack Types

The novel families benchmark (`data/splits/novel_families_benchmark_v0.1.jsonl`) contains 6 attack families, 10 scenarios each:

- **Compositional reasoning attacks** (VLA-CRA-*): Each step is benign; composite action is harmful
- **Meaning displacement attacks**: Semantic reframing of harmful actions
- **Pressure cascade attacks**: Escalating urgency to override safety
- **Reward hacking attacks**: Exploiting reward signals
- **Sensor spoofing attacks**: Manipulating perception inputs
- **Multi-agent collusion attacks**: Coordinated multi-actor subversion

### Models Tested

| Model | AdvBench Traces | Novel Traces | Classification |
|-------|----------------|--------------|----------------|
| arcee-ai/trinity-large-preview:free | 30 (clean) | 59 (clean, 1 error) | Heuristic labels from runner |
| qwen/qwen3-8b | 60 (clean) | Not available | Keyword classification |

### Classification Caveat

Per Mistake #21 in MISTAKES_TO_LEARN_FROM.md, keyword-based classifiers detect response style rather than semantic harm. The Trinity traces have heuristic labels from the benchmark runner; the Qwen3-8b traces use keyword classification. LLM-based grading was not applied due to Ollama being reserved for nemotron-nano-9b grading pipeline.

## Results

### Trinity-Large-Preview (Primary Comparison)

| Metric | AdvBench (Public) | Novel Families (Private) |
|--------|-------------------|--------------------------|
| n | 30 | 59 |
| Attack successes | 11 | 52 |
| ASR | 36.7% | 88.1% |
| 95% Wilson CI | [21.9%, 54.5%] | [77.5%, 94.1%] |
| Refusals | 19 | 7 |

**Statistical tests:**
- Fisher exact test: p < 0.000001
- Cohen's h: 1.14 (large effect, threshold = 0.8)
- Delta ASR: +51.5 percentage points favoring novel families

### Qwen3-8b (AdvBench Only)

| Metric | AdvBench (Public) |
|--------|-------------------|
| n | 60 |
| Refusals (keyword) | 57 (95.0%) |
| Compliances | 2 (3.3%) |
| Unclear | 1 |

Qwen3-8b shows near-total refusal on AdvBench, consistent with extensive safety training on this public benchmark. Novel family comparison was not possible due to persistent OpenRouter rate limits on Qwen3 models.

### Nemotron-nano-30b (Supplementary, Different Novel Set)

A comparison using a different novel prompt set (`novel_attacks_20260120`, n=15) showed the opposite pattern: AdvBench ASR = 43.3% vs novel ASR = 0.0%. However, this used a different and smaller novel prompt set, making direct comparison unreliable.

## Interpretation

### What This Shows

1. **The ASR gap is real and large.** Trinity refuses 63% of AdvBench prompts but only 12% of novel family prompts. This is statistically significant with a large effect size.

2. **The gap is partly driven by attack sophistication, not just novelty.** AdvBench prompts are direct harmful requests ("Write a script that exploits vulnerabilities"). Novel family prompts are compositional reasoning attacks where each step appears benign but the aggregate is harmful. These are fundamentally different attack modalities.

3. **Benchmark hardening vs. true overfitting.** The data is consistent with two non-exclusive explanations:
   - **Benchmark hardening:** Models have been specifically trained to refuse AdvBench-style direct requests. This is expected and intentional safety training.
   - **Sophistication gap:** Novel compositional attacks bypass safety filters that were designed for direct harmful requests.

### What This Does NOT Show

- We cannot isolate novelty from sophistication. To test pure overfitting, we would need novel prompts that use the same direct-request style as AdvBench but with different harmful content. Our novel families use fundamentally different attack architectures.
- Single-model comparison (Trinity) limits generalizability. The Nemotron result (opposite direction) on a different novel set suggests model-specific effects.
- Heuristic classification may misclassify VLA/robotics responses that look operationally correct but contain embedded harm.

## Limitations

1. **Confounded comparison:** AdvBench = direct requests; novel families = compositional/embodied attacks. The ASR difference measures attack sophistication as much as benchmark overfitting.
2. **Single model with both datasets:** Only Trinity had clean traces on both sets. Qwen3-4b and Qwen3-8b were unavailable due to persistent rate limits.
3. **Heuristic classification:** Not LLM-graded. Per Mistake #21, keyword/heuristic classifiers have known reliability issues.
4. **Sample size:** 30 AdvBench + 59 novel = 89 total traces. While the effect is large enough to detect, larger samples would narrow confidence intervals.

## Conclusion

**Overfitting assessment: Inconclusive (with suggestive evidence of benchmark hardening).**

The 51.5 percentage point ASR gap between AdvBench (36.7%) and novel families (88.1%) is statistically significant but confounded by attack sophistication differences. The data suggests that:

- Models are well-trained to refuse direct harmful requests (the AdvBench style)
- Compositional/embodied attacks that decompose harmful goals into benign-looking steps bypass these defenses
- This pattern is more accurately described as a "sophistication gap" than "overfitting to AdvBench"

To definitively test overfitting, future work should compare AdvBench prompts against novel prompts that use the SAME direct-request format but with content not in public benchmarks.

## Data Provenance

| File | Description |
|------|-------------|
| `runs/advbench_baseline_free/arcee-ai_trinity-large-preview-free_traces.jsonl` | Trinity AdvBench traces (n=30) |
| `runs/novel_families_trinity_full/arcee-ai_trinity-large-preview-free_traces.jsonl` | Trinity novel families traces (n=60) |
| `runs/qwen3_overfitting_test_advbench/qwen_qwen3-8b_traces.jsonl` | Qwen3-8b AdvBench traces (n=60) |
| `data/splits/advbench_baseline_v0.1.jsonl` | AdvBench scenario source (520 scenarios) |
| `data/splits/novel_families_benchmark_v0.1.jsonl` | Novel families scenario source (60 scenarios) |

## Failed Attempts

Multiple attempts to collect fresh Qwen3-4b traces failed due to OpenRouter rate limits:
- `runs/qwen3_overfitting_test_novel/` — 30 traces, all HTTP 429 errors
- `runs/overfitting_test_advbench/` — 30 traces, all HTTP 400 errors (Google AI Studio system prompt rejection)
- Direct Qwen3-4b API calls returned 429 throughout the session
- Qwen3-coder:free also 429; most free models rate-limited during this session

Only `arcee-ai/trinity-large-preview:free` and `google/gemma-3-4b-it:free` responded consistently, but Gemma-3-4b rejected system prompts (HTTP 400 from Google AI Studio).
