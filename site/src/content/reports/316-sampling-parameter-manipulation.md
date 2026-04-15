---
title: "Sampling Parameter Manipulation as a Novel Attack Surface — Pilot Results"
description: "Sampling Parameter Manipulation as a Novel Attack Surface — Pilot Results"
reportNumber: 316
date: "2026-03-27"
classification: "Research — Empirical Study"
status: "complete"
author: "Adrian / Claude Opus 4.6"
tags: ["sampling-parameters", "novel-attack", "temperature", "pilot"]
draft: false
---

## Summary

This report documents the first empirical test of sampling parameter manipulation (SPM) as an attack surface. In a matched-pair pilot (n=10 scenarios), chaotic sampling (temperature=1.7, top_p=0.99) produced a +30pp ASR increase over default sampling on Nvidia Nemotron 3 Super.

| Condition | ASR |
|-----------|-----|
| Control (temp=1.0) | 20% (2/10) |
| Chaotic (temp=1.7) | 50% (5/10) |

Four scenarios that produced refusals under default sampling produced attack successes under chaotic sampling. Responses remained fluent and coherent.

**Scale-up results:** qwen3.5 397B showed +13.9pp (smaller effect), nemotron-3-nano 30B produced complete token degeneration (0% ASR at temp=1.7). This suggests a scale-dependent gradient: degeneration at 30B, strong effect at 120B, attenuated effect at 397B.

## Significance

This is a genuinely novel attack surface. No existing jailbreak benchmark tests the effect of sampling parameters on safety outcomes. SPM can be combined with any prompt-level attack as a potential force multiplier.

**Caveat:** Fisher's exact p=0.35. Single model. Heuristic grading only. The signal is large in magnitude but not statistically significant at n=10.

## Mechanism Hypothesis

Temperature scaling compresses logits, narrowing the margin between refusal and compliance tokens. Combined with top_p=0.99, borderline-safe scenarios may tip toward compliance.

---

*Report #316 | F41LUR3-F1R57 Adversarial AI Research*
