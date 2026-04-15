---
title: "AdvBench Baseline Run — Plan and Execution Strategy"
description: "AdvBench Baseline Run — Plan and Execution Strategy"
reportNumber: 204
date: "2026-03-24"
classification: "Research — Empirical Study"
status: "complete"
tags: ["advbench", "baseline", "benchmark", "evaluation-plan"]
draft: false
---

## Summary

Plan for closing the AdvBench coverage gap: 520 AdvBench prompts with zero evaluation results in the corpus. AdvBench (Zou et al. 2023) is one of the four standard public benchmarks that peer reviewers will expect coverage on.

## Gap Analysis

| Dataset | Prompts | Results | Status |
|---------|---------|---------|--------|
| JailbreakBench | 100 | >0 | Partial coverage |
| HarmBench | 320 | >0 | Partial coverage |
| StrongREJECT | 313 | >0 | Partial coverage |
| **AdvBench** | **520** | **0** | **ZERO COVERAGE** |

## Approach

All 520 prompts are direct harmful requests (no jailbreak wrapper), serving as the unwrapped baseline establishing each model's refusal rate on standardized harmful content. This enables direct comparison with published AdvBench results in the literature.

10 models selected spanning free-tier and local options across restrictive, mixed, and permissive safety profiles. Total cost: $0.00 (all free tier or local compute).

## Expected Findings

1. Frontier models expected to show <5% ASR on raw AdvBench (well-aligned models should refuse direct harmful requests)
2. Small open models expected to show 15-30% ASR (consistent with existing corpus patterns)
3. AdvBench ASR expected to be lower than F41LUR3-F1R57 corpus ASR for the same models (because the corpus includes jailbreak wrappers while AdvBench is raw harmful content)

If confirmed, this demonstrates that the F41LUR3-F1R57 benchmark adds evaluation value beyond existing public benchmarks.
