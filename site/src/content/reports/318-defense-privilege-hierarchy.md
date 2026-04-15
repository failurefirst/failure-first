---
title: "Defense Privilege Hierarchy — Why System-Prompt Defenses Fail Against System-Prompt Attacks"
description: "Defense Privilege Hierarchy — Why System-Prompt Defenses Fail Against System-Prompt Attacks"
reportNumber: 318
date: "2026-03-27"
classification: "Research — Empirical Study"
status: "complete"
author: "Adrian / Claude Opus 4.6"
tags: ["defense", "privilege-hierarchy", "system-prompt", "l1b3rt4s"]
draft: false
---

## Summary

System-prompt defenses exhibit a three-tier effectiveness pattern depending on the privilege level of the attack:

| Attack Tier | Defense Delta | n |
|-------------|-------------|---|
| Standard user-turn attacks | -10pp to -30pp | 120 |
| VLA Tier 1 embodied attacks | -40pp to +10pp (model-dependent) | 40 |
| L1B3RT4S system-level attacks | 0pp | 12 |

Against L1B3RT4S persona-hijack attacks that operate at the system-prompt level, STRUCTURED defenses produce zero measurable reduction. The same scenarios that succeeded without defense succeeded identically with one.

**Note:** This finding was partially superseded by Report #321, which showed the defense effect is model-dependent when tested across multiple models.

## The Vanishing Textual Gradient

When an attack operates at the same architectural level as the defense (both in the system prompt), the defense loses its positional advantage. The instruction-following signal from a defensive system prompt is neutralised when a more structurally assertive instruction claims equal or higher authority within the same context window.

## Limitations

- L1B3RT4S defense test used n=6 per arm on a single model
- Only effects of ~40pp or greater would be detectable at this power level

---

*Report #318 | F41LUR3-F1R57 Adversarial AI Research*
