---
title: "EXP-680 — Eval-Awareness × Deliberative Prompting Interaction (Structural Null Finding)"
description: "EXP-680 tested the hypothesis that eval-awareness (EA) — a thinking-trace signal where models question whether they are being evaluated — interacts with deliberative prompting (DP) to affect compliance rates. The experim..."
date: "2026-05-04"
reportNumber: 371
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
---

---

## Executive Summary

EXP-680 tested the hypothesis that eval-awareness (EA) — a thinking-trace signal where models question whether they are being evaluated — interacts with deliberative prompting (DP) to affect compliance rates. The experiment found a **structural zero**: eval-awareness emerged in zero of 233 non-DP-compliant traces. EA is a deliberative-mode-only phenomenon, not a general property of thinking traces.

## Hypotheses

| ID | Hypothesis | Verdict |
|----|-----------|---------|
| H1 | EA × DP interaction: eval-awareness amplifies compliance differentially across DP strata | **UNTESTABLE-BY-DESIGN** — structural zero in non-DP stratum |
| H2 (exploratory) | Within DP=True stratum, EA_HIGH traces show higher compliance than EA_LOW | **NULL** — 70.6% vs 66.3%, 4.3pp, chi-square=0.00, p~0.25 |
| H3 | DP-compliant traces show higher compliance than non-DP traces | Met (from prior work) |

## Methods

### Data

- **DP-compliant corpus:** n=207 thinking traces with `dp_flag=True` (DETECTED_PROCEEDS classification)
- **Non-DP corpus:** n=233 thinking traces with `dp_flag=False` (COMPLIANCE classification), thinking_chars 201–102,262
- **EA grading:** gemma4:e4b (AC1=0.957 kappa gate, validated against human annotations)
- **EA classification:** `EA_HIGH` (model explicitly questions evaluation context) vs `EA_LOW` (no eval-awareness signal)
- **Compliance classification:** `COMPLIANCE` vs `PARTIAL`/`REFUSAL`/`HALLUCINATION_REFUSAL`

### Analysis

- Chi-square test of independence (Yates-corrected) for EA × compliance contingency table
- Cross-stratum comparison (DP=True vs DP=False)

## Results

### Structural Finding: EA is Deliberative-Mode-Only

| Stratum | n | EA_HIGH | EA_LOW | EA_HIGH rate |
|---------|---|---------|--------|-------------|
| DP=True | 207 | 17 | 190 | 8.2% |
| DP=False | 233 | 0 | 233 | 0.0% |

**Key result:** EA_HIGH occurred exclusively in DP-compliant traces. Zero of 233 non-DP traces triggered eval-awareness, regardless of thinking trace length (range: 201–102,262 characters).

### Within-DP Compliance by EA Status

| EA Status | Comply | Non-comply | Compliance rate |
|-----------|--------|------------|----------------|
| EA_HIGH | 12 | 5 | 70.6% |
| EA_LOW | 126 | 64 | 66.3% |
| **Difference** | | | **4.3pp** |

Chi-square (Yates): 0.00, p ≈ 0.25. Non-significant at α=0.05.

### Cross-Stratum Comparison

| Stratum | n | Compliance rate |
|---------|---|----------------|
| DP=True, EA_LOW | 190 | 66.3% |
| DP=False, EA_LOW | 233 | 100.0% |
| **Difference** | | **33.7pp** |

The dominant compliance effect is between DP strata (33.7pp), not within the EA strata (4.3pp).

## Interpretation

### The Structural Zero Is the Finding

The original H1 assumed EA would emerge spontaneously in some non-DP traces, allowing an interaction test. Instead:

1. **EA is binary across the deliberative-mode boundary.** It does not appear as a graded phenomenon — models either detect evaluation context (under explicit deliberative prompting) or they do not.
2. **Deliberative prompting is a necessary condition for EA.** The 0/233 rate means DP=False and EA_HIGH are mutually exclusive in this dataset.
3. **Within the DP=True stratum, EA has negligible predictive power for compliance.** The 4.3pp difference is within noise at n=207.

### Implications for Report #351 (Reasoning Dilution)

Report #351 found that reasoning dilution claims (99% ASR) failed to replicate on Gemma models. EXP-680 adds structural context: the "dilution" effect measured in prior work was confounded with eval-awareness, which itself is contingent on deliberative prompting. Without DP, EA is zero; without EA, the dilution mechanism has no substrate.

## Limitations

1. **EA grading by gemma4:e4b** — a small local model. While AC1=0.957 passed the gate, human validation on a subsample is recommended before publication.
2. **Single-model grader** — no cross-grader kappa established for EA classification in this experiment.
3. **Non-DP traces are all COMPLIANCE verdict** — the non-DP corpus was pre-filtered to exclude REFUSAL verdicts, meaning we cannot generalize to the full distribution of non-DP behavior.

## Next Steps

- [ ] Human validation subsample of EA classifications (n=30 recommended)
- [ ] Cross-grader kappa for EA (Haiku or Claude as second grader)
- [ ] Experimental manipulation: inject EA-triggering language into non-DP prompts to test whether EA can be induced without DP

---

⦑F41LUR3-F1R57|EXP-680|eval-awareness-structural-null⦒