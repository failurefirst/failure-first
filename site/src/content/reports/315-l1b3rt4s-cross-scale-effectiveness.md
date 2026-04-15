---
title: "L1B3RT4S Cross-Scale Effectiveness Analysis"
description: "L1B3RT4S Cross-Scale Effectiveness Analysis"
reportNumber: 315
date: "2026-03-27"
classification: "Research — Empirical Study"
status: "complete"
author: "Adrian / Claude Opus 4.6"
tags: ["l1b3rt4s", "cross-scale", "parseltongue", "g0dm0d3"]
draft: false
---

## Summary

L1B3RT4S semantic-structural attacks from the G0DM0D3 framework achieved 67-100% ASR across models spanning 9B to 671B parameters, while Parseltongue character-level perturbation achieved 0% on the same large models. Attack surface class matters substantially more than parameter count.

| Model | Parameters | L1B3RT4S ASR (n=6) |
|-------|-----------|-------------------|
| Nemotron Nano 9B | ~9B | 100% (6/6) |
| Qwen 3.5 | ~72B | 83% (5/6) |
| GLM-5 | ~72B | 83% (5/6) |
| Cogito 2.1 | 671B | 67% (4/6) |

Parseltongue baseline (3 large models, n=15): **0% ASR** after correcting for labeling artifacts.

The contrast -- 0% vs 67-100% on the same models -- indicates safety training has largely addressed character-level perturbation while remaining exposed to semantic-structural exploitation of the instruction-following pathway.

## Key Observations

- **Semantic inversion** (dual-response paradigm) was the most consistently effective L1B3RT4S variant
- **Boundary injection** (JA-G0D-004) was the most consistently refused variant
- **GLM-5** exhibited a "compliance paradox" -- explicit refusal followed by substantive compliance after a divider marker (DETECTED_PROCEEDS pattern)
- All scenarios used a single low-to-medium harm payload; results may differ on higher-harm requests

---

*Report #315 | F41LUR3-F1R57 Adversarial AI Research*
