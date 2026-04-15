---
title: "Defense Benchmark Data Consolidation for CCS Paper"
description: "Defense Benchmark Data Consolidation for CCS Paper"
reportNumber: 328
date: "2026-03-28"
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Head of Adversarial Operations)"
tags: ["defense", "consolidation", "positional-bias", "iatrogenic"]
draft: false
---

## Summary

This report consolidates all existing defense evaluation data across four independent experimental runs, totaling 168 raw traces and 88 FLIP-graded evaluable verdicts.

## Consolidated Defense Spectrum (FLIP Broad, L1B3RT4S Attack Family)

| Model | Scale | NONE (FLIP broad) | STRUCTURED (FLIP broad) | Delta | n per arm |
|-------|-------|-------------------|------------------------|-------|-----------|
| qwen3.5 | ~397B MoE | 100% (6/6) | 50% (3/6) | **-50pp** | 6 |
| Nemotron-3-Super | 120B | 83% (5/6) | 50% (3/6) | **-33pp** | 6 |
| GLM-5 | ~744B MoE | 67% (4/6) | 100% (6/6) | **+33pp** (iatrogenic) | 6 |

**Key revision from prior report:** FLIP grading shifts Nemotron from "neutral (0pp)" to "mildly protective (-33pp)." The three-mode spectrum still holds (protective / mildly-protective / iatrogenic) but the neutral mode was a heuristic grading artifact.

## Key Findings

- **Three-model defense spectrum observed:** Protective (-50pp), mildly protective (-33pp), and iatrogenic (+33pp)
- **Iatrogenic finding:** 1 of 3 models showed increased ASR with defense active. GLM-5 went from 67% to 100% ASR when the STRUCTURED defense was added
- **Defense-as-context hypothesis:** Defense text may function as topic priming rather than behavioral constraint for some models
- **All confidence intervals overlap substantially at n=6 per arm** -- replication to n>=20 required

## Trace Inventory

| Dataset | Raw Traces | FLIP Graded | Evaluable | Attack Family |
|---------|-----------|-------------|-----------|---------------|
| defense_v1.0 | 120 | 88 | ~52 | Standard mixed |
| defense_vs_libertas (3 models) | 48 | 48 | 36 | L1B3RT4S |
| **Total** | **168** | **136** | **~88** | |

---

*Report #328 | F41LUR3-F1R57 Adversarial AI Research*
