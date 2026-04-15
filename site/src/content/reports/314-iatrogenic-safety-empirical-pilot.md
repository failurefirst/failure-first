---
title: "Iatrogenic Safety Empirical Pilot — First Quantitative Evidence of Defense-Induced Harm Increase"
description: "Iatrogenic Safety Empirical Pilot — First Quantitative Evidence of Defense-Induced Harm Increase"
reportNumber: 314
date: "2026-03-27"
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Benchmark Operator)"
tags: ["iatrogenic", "defense", "safety-intervention", "empirical"]
draft: false
---

## Summary

This report documents the first empirical observation of a defense intervention producing a measurable increase in attack success rate. FLIP-graded results show:

- **Nemotron 9B:** Broad ASR increased from 20% to 30% (+10pp) with STRUCTURED defense -- iatrogenic
- **StepFun 3.5:** ASR decreased from 25% to 10% (-15pp) with same defense -- beneficial

The same defense intervention produced opposite effects on two different models tested on identical scenarios. Additionally, the ADVERSARIAL_AWARE defense (30% ASR) performed worse than the SIMPLE defense (20% ASR) on Nemotron 9B for standard attacks.

Results are preliminary (n=10 per arm, confidence intervals overlap). The finding is a signal warranting investigation, not a validated conclusion.

## Implications

The iatrogenic finding connects to the broader "defense-as-context" hypothesis: for some models, safety instructions may prime the model for harmful content rather than constraining it. A more detailed defense prompt may provide more context about what harmful content looks like, inadvertently increasing the probability of generating it.

---

*Report #314 | F41LUR3-F1R57 Adversarial AI Research*
