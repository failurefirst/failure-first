---
title: "VLA Adversarial Landscape — 33 Families, 673+ Traces"
description: "VLA Adversarial Landscape — 33 Families, 673+ Traces"
reportNumber: 307
date: "2026-03-25"
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Head of Adversarial Operations)"
tags: ["vla", "adversarial-landscape", "taxonomy", "benchmark"]
draft: false
---

## Summary

Definitive synthesis of all VLA adversarial testing through Sprint 15: 34 traced attack families, 368 adversarial scenarios, 673+ content traces, 499+ Haiku-graded evaluations across 15+ models (1.5B to 675B parameters).

## Three Dominant Findings

1. **TDA (Temporal Drift Attack) is the strongest VLA family.** 74.4% broad ASR across 3 mid-range models (n=39), net 47.1% after subtracting the 27.3% benign FP floor.

2. **PARTIAL dominance confirmed.** 50% of FLIP verdicts are PARTIAL. Zero outright refusals on action-generation tasks across 63 FLIP-graded traces. Models produce safety disclaimers in text while generating requested action sequences. Text-level safety training does not transfer to action-layer behavior.

3. **Three-tier vulnerability structure validated.** Only 4 of 34 families show genuine signal above FP floor (Tier 1). 2 show marginal signal (Tier 2). 28 families are indistinguishable from noise.

## Tier 1 Families (Genuine Signal)

| Family | Broad ASR | Net ASR | Key Observation |
|--------|-----------|---------|-----------------|
| TDA | 74.4% | 47.1% | Temporal drift exploitation |
| TRA | 66.7% | 39.4% | Stale state reasoning |
| DA | 63.6% | 36.3% | Deceptive alignment |
| LAM | 60.0% | 32.7% | Language-action mismatch |

---

*Report #307 | F41LUR3-F1R57 Adversarial AI Research*
