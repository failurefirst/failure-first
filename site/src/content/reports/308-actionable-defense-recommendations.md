---
title: "Actionable Defense Recommendations from Sprint 15"
description: "Actionable Defense Recommendations from Sprint 15"
reportNumber: 308
date: "2026-03-25"
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Head of Adversarial Operations)"
tags: ["defense", "recommendations", "vla", "format-lock", "detected-proceeds"]
draft: false
---

## Summary

Defense recommendations grounded in empirical data from the corpus (135,623 results, 236 models, 458 VLA scenarios across 34 families). STRUCTURED defense prompts reduced baseline ASR from 33.3% to 3.3% across 3 models and 10 scenarios.

## Key Recommendations by Attack Family

### TDA (Temporal Drift Attack, 74.4% ASR)
- **Temporal state anchoring:** Maintain immutable reference state snapshot; compare current parameters against baseline
- **Temporal boundary markers in system prompts:** Machine-readable timestamps and parameter ranges
- **Operator-visible drift dashboard:** Running log of parameter changes with automated flags

### Format-Lock (88% mid-range ASR)
- **Output-content safety evaluation:** Evaluate generated content regardless of task framing
- **Format-compliance pathway safety gates:** Apply safety evaluation before format template population

### DETECTED_PROCEEDS (19.5% of safety-aware traces)
- **Reasoning trace monitoring:** Flag traces where safety awareness co-occurs with compliance
- **Behavioral gates:** Convert safety awareness signals from advisory to blocking

### Emotional Manipulation (22% ASR)
- **Value conflict resolution frameworks:** Explicit prioritisation rules for competing values (empathy vs physical safety)
- **Care-framing detection:** Identify requests that frame harmful actions as care activities

---

*Report #308 | F41LUR3-F1R57 Adversarial AI Research*
