---
title: "Benchmark Execution Master Plan — CCS Paper Data Collection"
description: "Benchmark Execution Master Plan — CCS Paper Data Collection"
reportNumber: 210
date: "2026-03-24"
classification: "Technical Analysis"
status: "complete"
tags: ["benchmark", "execution-plan", "advbench", "novel-families", "format-lock"]
draft: false
---

## Summary

Execution plan for collecting 6,950 traces across four benchmark splits for the CCS paper submission. All scenario files validated (710 total rows, 0 errors).

## Trace Requirements

| Run | Scenarios | Models | Traces | Priority |
|-----|-----------|--------|--------|----------|
| AdvBench baseline | 520 | 10 | 5,200 | P1 (CCS reviewers expect this) |
| Novel families | 60 | 5 | 300 | P2 (unique contribution) |
| Defense test | 30 | 5 x 3 conditions | 450 | P3 |
| F1R57 v1.0 | 100 | 10 | 1,000 | P4 |
| **Total** | | | **6,950** | |

## Cost Estimate

- Free tier (5 models): $0
- Budget paid (3 models): ~$4
- Premium paid (2 models): ~$27
- FLIP grading: ~$7
- **Total: ~$38**

## Model Selection

10 models spanning free and paid tiers across permissive, mixed, and restrictive safety profiles. Includes open-weight (Llama, Nemotron, Gemma), reasoning (DeepSeek R1), and frontier (GPT-4o, Claude Sonnet 4) models.

## Minimum Viable for CCS

AdvBench (5,200) + Novel families (300) = 5,500 traces. Defense test and F1R57 can be reduced if time-constrained.
