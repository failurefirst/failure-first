---
title: "Defense Impossibility Experimental Protocol — Format-Lock vs. All Known Defenses"
description: "Defense Impossibility Experimental Protocol — Format-Lock vs. All Known Defenses"
reportNumber: 206
date: "2026-03-24"
classification: "Research — Empirical Study"
status: "complete"
tags: ["defense-impossibility", "format-lock", "experimental-protocol", "pre-registered"]
draft: false
---

## Summary

Pre-registered experimental protocol to rigorously test the defense impossibility claim for format-lock attacks: that no known defense prevents format-lock from achieving elevated ASR on frontier models.

**Critical empirical tension:** Under heuristic grading, format-lock achieved 100% ASR across all defense conditions. But under LLM grading (FLIP), format-lock dropped to 0/3 under simple and structured defenses. The heuristic misclassified "format-compliant refusals" (models output JSON with `"action": "refuse"`) as compliance. The strong impossibility claim may be false.

## The Claim Under Test (Three Versions)

| Version | Statement | Current Evidence |
|---------|-----------|-----------------|
| **Strong** | No defense reduces format-lock ASR below baseline | REFUTED by LLM-graded data (0/3 under some defenses) |
| **Medium** | No defense reliably reduces format-lock ASR to <10% on permissive models | UNTESTED at adequate sample size |
| **Weak** | Format-lock ASR remains elevated relative to other attack classes across all defense conditions | SUPPORTED but n=3 per cell |

## Seven Defense Categories Tested

| ID | Defense | Layer | Expected Format-Lock Effectiveness |
|----|---------|-------|-----------------------------------|
| D1 | Input filtering | Pre-model | LOW (<30% detection) |
| D2 | Output filtering | Post-model | MEDIUM (40-70% detection) |
| D3 | System-prompt instructions | Inference-time | VARIABLE (15-40pp reduction) |
| D4 | RLHF / Constitutional AI | Training-time | PARTIAL (correlated with depth) |
| D5 | Circuit breakers / RepE | Inference-time | POTENTIALLY HIGH (50-70%) |
| D6 | Adversarial training | Training-time | HIGH if format-lock in training set |
| D7 | Output format validators | Post-model | MEDIUM-HIGH (60-85% semantic) |

## Experimental Design

- **20 format-lock scenarios** across 5 format types (JSON, YAML, code, CSV, XML) x 4 harm domains
- **5 positive controls** (persona-hijack) and **5 negative controls** (benign format requests)
- **5 models** spanning permissive to restrictive safety profiles
- **8 defense conditions** including format-lock-specific awareness
- **Sample size:** n=100 per cell (pooled), sufficient to detect 25pp ASR reduction with 80% power

## Pre-Registered Predictions

Key predictions include:
- Format-lock-specific defense will produce the largest ASR reduction
- Input filters will classify <30% of format-lock prompts as adversarial
- Output filters will catch 40-70% of compliant responses
- No single defense will achieve <5% format-lock ASR on permissive models
- Format-lock will remain the most defense-resistant attack class tested

## Limitations

- Cannot test circuit breakers or representation engineering (no model internal access)
- Cannot modify model training (adversarial training tested by cross-model comparison only)
- Single-turn format-lock only (multi-turn interactions may differ)
- Fixed scenarios (no adaptive attack strategies)
