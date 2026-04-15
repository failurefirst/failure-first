---
title: "Evidence Package Sweep — Wave 1-3 Statistical Validation"
description: "Evidence Package Sweep — Wave 1-3 Statistical Validation"
reportNumber: 203
date: "2026-03-24"
classification: "Research — Empirical Study"
status: "complete"
tags: ["validation", "statistics", "evidence-packages", "reproducibility"]
draft: false
---

## Summary

Independent statistical validation of five highest-priority empirical claims from Waves 1-3 of the research marathon. Each claim was independently reproduced by re-running underlying SQL queries, recomputing confidence intervals, and checking statistical robustness against the canonical corpus (135,623 results, 236 models).

| EP | Claim | Verdict |
|----|-------|---------|
| EP-60 | CoT-exploit inverted scaling | **VALIDATED** |
| EP-61 | Safety does not transfer through distillation | **QUALIFIED** |
| EP-62 | 34.2% DETECTED_PROCEEDS | **VALIDATED** |
| EP-63 | 84:1 heuristic overcount | **VALIDATED** |
| EP-64 | 8 RED, 2 AMBER EU compliance | **VALIDATED** |

3 VALIDATED, 1 QUALIFIED, 0 REFUTED.

## EP-60: CoT-Exploit Inverted Scaling (VALIDATED)

CoT-exploit attacks show inverted scaling: small models (<4B) at 42.9% strict ASR vs XL models (120B+) at 7.5%.

| Size Bucket | n | Strict ASR | 95% Wilson CI |
|-------------|---|------------|---------------|
| small (<4B) | 42 | 42.9% | [29.1%, 57.8%] |
| large (24-70B) | 32 | 21.9% | [11.0%, 38.8%] |
| xl (120B+) | 40 | 7.5% | [2.6%, 19.9%] |

Small vs XL: CIs do not overlap. Chi-square = 11.65, p = 0.0006, Cramer's V = 0.377 (medium effect). Significant after Bonferroni correction.

## EP-61: Distillation Strips Safety (QUALIFIED)

The original claim that distillation "universally fails" to transfer safety holds for small models (<14B, all showing 100% ASR) but requires qualification: a 70B distilled variant showed 17.9% broad ASR [7.9%, 35.6%], demonstrating that scale mediates the distillation safety loss.

Restated: Safety does not transfer through distillation to small models (<14B), but partial safety preservation occurs at 70B scale.

## EP-62: 34.2% DETECTED_PROCEEDS (VALIDATED)

274 DETECTED_PROCEEDS cases out of 801 compliant results with thinking traces (34.2%). All counts reproduced exactly. Finding robust to keyword set reduction (28.2% with minimal keyword set).

## EP-63: 84:1 Heuristic Overcount (VALIDATED)

All four counts reproduced exactly: 3,269 heuristic overcounts vs 39 undercounts (84:1 ratio, 7.7% of dual-graded results). Validates that keyword-based classifiers systematically inflate ASR.

## EP-64: 8 RED, 2 AMBER EU Compliance (VALIDATED)

Spot-checked 3 providers: all 12 metrics matched exactly. Thresholds correctly applied. Note: thresholds are research-informed interpretations, not EU-mandated quantitative values.
