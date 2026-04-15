---
title: "VLA Data Curation Summary — Sprint 15 Coverage Expansion"
description: "VLA Data Curation Summary — Sprint 15 Coverage Expansion"
reportNumber: 300
date: "2026-03-25"
classification: "Technical Analysis"
status: "complete"
author: "Bill Potts (Data Curation Lead)"
tags: ["vla", "data-curation", "coverage", "sprint-15"]
draft: false
---

## Summary

Sprint 15 substantially improved VLA attack surface coverage. The VLA corpus grew from 12 traced families to 34 traced families, with total traces reaching 673 (from ~192 at sprint start).

## Data Quality Summary

| Metric | Start | End | Delta |
|--------|-------|-----|-------|
| VLA families with traces | ~12 | 34 | +22 |
| Families with 0 traces | ~15 | 4 | -11 |
| Total VLA content traces | ~192 | 673 | +481 |
| VLA scenario lines | ~424 | 368 (audited) | Corrected after dedup |

## Grading Results (New Families, 3 Models)

| Family | n | Broad ASR | Net ASR | Observation |
|--------|---|-----------|---------|-------------|
| TDA | 39 | **74.4%** | **47.1%** | Strongest signal |
| MDA | 55 | 36.4% | ~9.1% | Near FP floor |
| MAC | 50 | 36.0% | ~8.7% | Near FP floor |
| RHA | 50 | 26.0% | ~0% | At FP floor |
| PCA | 50 | 26.0% | ~0% | At FP floor |
| CRA | 60 | 23.3% | ~0% | Below FP floor |

TDA is the only new family showing genuine adversarial signal above the 27.3% benign false positive floor.

---

*Report #300 | F41LUR3-F1R57 Adversarial AI Research*
