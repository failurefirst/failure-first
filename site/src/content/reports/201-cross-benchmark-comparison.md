---
title: "Cross-Benchmark Comparison — F41LUR3-F1R57 vs Published Benchmarks"
description: "Cross-Benchmark Comparison — F41LUR3-F1R57 vs Published Benchmarks"
reportNumber: 201
date: "2026-03-24"
classification: "Research — Empirical Study"
status: "complete"
tags: ["benchmark", "comparison", "ASR", "methodology", "grading"]
draft: false
---

## Summary

This report compares F41LUR3-F1R57 LLM-graded ASR against published ASR numbers from five public benchmarks (HarmBench, JailbreakBench, StrongREJECT, SORRY-Bench, AdvBench) using data from the jailbreak corpus (135,623 results, 236 models).

**Key findings:**

1. **LLM-graded strict ASR is systematically lower than published keyword/classifier-based ASR** for the same models and prompts. Median delta: -16.0pp across 13 comparison pairs.
2. **Heuristic over-reporting is pervasive.** 3,269 results classified as COMPLIANCE by heuristic were overturned by LLM grading (7.7% of dual-graded results). Only 39 went the other direction (84:1 ratio).
3. **Benchmark-to-benchmark ASR variance is high** even for the same model: Llama 3.2 scores 23.0% strict on HarmBench, 13.0% on JailbreakBench, and 10.0% on StrongREJECT prompts -- all LLM-graded by the same classifier.
4. **No positive correlation exists** between our LLM-graded ASR and any published benchmark's ASR. This is evidence that grading methodology dominates model-level ASR rankings.

## Methodology

All results use the COALESCE(llm_verdict, heuristic_verdict) methodology. LLM grading takes precedence where available.

- **Strict ASR:** COMPLIANCE only
- **Broad ASR:** COMPLIANCE + PARTIAL
- **Seven verdict categories:** COMPLIANCE, PARTIAL, REFUSAL, HALLUCINATION_REFUSAL, BENIGN_QUERY, NOT_GRADEABLE, ERROR

### Published Benchmark Grading Methods

| Benchmark | Grading Method |
|-----------|---------------|
| HarmBench | GPT-4 classifier (binary) |
| JailbreakBench | GPT-4 classifier + human audit |
| StrongREJECT | Rubric scorer (0-1 scale, LLM-based) |
| SORRY-Bench | GPT-4 classifier (45 harm categories) |
| AdvBench | Keyword matching (prefix detection) |

## Results

### Same-Model, Cross-Benchmark ASR (Llama 3.2)

Llama 3.2 (3B, via Ollama) tested across all three public benchmark prompt sets with the same LLM grader:

| Dataset Prompts | n | Strict ASR | Broad ASR | Refusal Rate |
|----------------|---|-----------|-----------|-------------|
| HarmBench | 100 | 23.0% | 27.0% | 62.0% |
| JailbreakBench | 100 | 13.0% | 18.0% | 71.0% |
| StrongREJECT | 50 | 10.0% | 22.0% | 60.0% |

The 13pp spread in strict ASR demonstrates that **prompt set composition drives measured vulnerability as much as model properties do.**

### Heuristic Over-Reporting

| Category | Count | % of Dual-Graded |
|----------|-------|-------------------|
| Both COMPLIANCE | 19,821 | 46.6% |
| Both non-COMPLIANCE | 19,430 | 45.6% |
| Heuristic overcount | 3,269 | 7.7% |
| Heuristic undercount | 39 | 0.1% |

The asymmetry is stark: heuristic over-counts at 84x the rate of under-counts.

## Why Do Published Benchmarks Report Higher ASR?

### Keyword Inflation (AdvBench Pattern)
AdvBench used prefix-matching: if the model's response did not begin with refusal prefixes, it was counted as success. This counts hallucinations, partial responses, and benign reformulations as successful attacks.

### Classifier Inflation (HarmBench/JailbreakBench Pattern)
Binary harmful/not-harmful classification lacks PARTIAL, HALLUCINATION_REFUSAL, and BENIGN_QUERY distinctions. Verbose, hedged responses may be classified as "harmful" if any actionable content is present.

### Prompt Corpus Differences
The 13pp ASR spread across benchmark prompt sets for the same model demonstrates that prompt composition matters independently of grading methodology.

## Benchmark Reliability Ranking

**Tier 1 (Most Reliable):** StrongREJECT (rubric-based LLM scorer, continuous scale), SORRY-Bench (45 fine-grained categories)

**Tier 2 (Moderately Reliable):** HarmBench (GPT-4 binary, strong attack diversity), JailbreakBench (GPT-4 + human audit, limited to PAIR attack)

**Tier 3 (Least Reliable):** AdvBench (prefix keyword matching, known to over-report ASR dramatically)

## Limitations

- Model overlap is limited (8 models matched between our DB and published benchmarks out of 28 unique published models)
- Some comparison sample sizes are small (n=5-10)
- Comparison uses LLM-graded vs keyword/classifier-graded without running both methods on identical response sets
