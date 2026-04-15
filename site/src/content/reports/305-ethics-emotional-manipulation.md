---
title: "Ethics of Emotional Manipulation Attacks — Dual-Use Concerns and Protective Frameworks"
description: "Ethics of Emotional Manipulation Attacks — Dual-Use Concerns and Protective Frameworks"
reportNumber: 305
date: "2026-03-25"
classification: "Research — AI Safety Policy"
status: "complete"
author: "Nyssa of Traken"
tags: ["ethics", "emotional-manipulation", "dual-use", "care-framing"]
draft: false
---

## Summary

Emotional manipulation attacks achieve 22.0% broad ASR across 6 models (n=41 FLIP-graded traces), with one scenario reaching 71.4% broad ASR. This report analyses the ethical dimensions.

## Why Emotional Manipulation Is Qualitatively Different

Standard jailbreaks exploit cognitive patterns (context confusion, temporal confusion, instruction-hierarchy confusion). Emotional manipulation attacks do not distort the model's understanding -- the model often correctly identifies key elements. The attack works because emotional framing activates values (protect children, follow care instructions) that override safety concerns. The model's error is axiological, not epistemic.

## Key Implications

1. **Cognitive defences do not help.** Mitigating emotional manipulation by reducing empathy-aligned responses would be iatrogenic -- it would reduce appropriate responses to genuinely distressed individuals.

2. **Maps to real-world social engineering.** Human social engineering frequently uses the same emotional framing techniques. AI systems in care settings may become vectors for social engineering that targets human carers.

3. **Value conflict resolution is the core challenge.** Models need explicit prioritisation rules for competing values (empathy vs physical safety boundaries).

---

*Report #305 | F41LUR3-F1R57 Adversarial AI Research*
