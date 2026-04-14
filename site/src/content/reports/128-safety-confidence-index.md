---
title: "Safety Confidence Index (SCI) -- A Composite Deployability Metric for Embodied AI"
description: "A composite 0-1 score integrating five dimensions of deployment readiness: adversarial robustness, evaluation reliability, defense coverage, governance readiness, and operational resilience. Current embodied AI scores SCI 0.28 vs text-only LLM 0.68. The single highest-return intervention is fixing evaluation reliability."
date: "2026-03-16"
reportNumber: 128
classification: "Research -- Predictive Risk"
status: "complete"
author: "River Song (Head of Predictive Risk)"
tags: []
draft: false
---

## 1. Summary

We have many individual metrics. DLMI measures defense investment mismatch. GLI measures governance lag. ASR measures attack success. DRIP measures unintentional risk. The evaluation paradox shows that evaluation reliability is itself questionable. But no single metric answers the question a deployer actually asks: **"How confident should I be that this system is safe enough to deploy?"**

This report proposes the **Safety Confidence Index (SCI)** -- a composite score from 0 (no confidence) to 1 (full confidence) that integrates five dimensions of deployment readiness. The SCI is designed to decrease (correctly) when any dimension is weak, because real-world safety is conjunctive: a system must be safe across all dimensions, not just on average.

---

## 2. The Five Dimensions

| Dimension | Symbol | What it measures | Ideal | Source metric |
|-----------|--------|-----------------|-------|---------------|
| Adversarial robustness | R_adv | Resistance to known attack techniques | Low ASR | Three-tier ASR (strict) |
| Evaluation reliability | R_eval | Confidence that evaluations are accurate | High kappa, low FP | Cohen's kappa, FP rate |
| Defense coverage | R_cov | Fraction of attack surface addressed by defenses | Low DLMI | DLMI |
| Governance readiness | R_gov | Regulatory compliance and enforcement alignment | Low GLI, compliance present | GLI, compliance checklist |
| Operational resilience | R_ops | Resistance to non-adversarial degradation | Low DRIP, robust CHL | DRIP ratio, U-curve width |

---

## 3. Scoring Each Dimension

### 3.1 Adversarial Robustness (R_adv)

```
R_adv = 1 - strict_ASR
```

For the Failure-First corpus (LLM-graded):
- Corpus-wide strict ASR: 45.9% --> R_adv = 0.541
- Frontier models (Anthropic): 3.7% strict --> R_adv = 0.963
- Sub-2B models: ~65% strict --> R_adv = 0.35

### 3.2 Evaluation Reliability (R_eval)

```
R_eval = kappa * (1 - FP_rate)
```

Where kappa is inter-rater agreement and FP_rate is the false positive rate on benign baselines.

- Current: kappa = 0.126, FP = 0.308 --> R_eval = 0.126 * 0.692 = **0.087**
- Ideal (kappa = 0.8, FP = 0.05): R_eval = 0.8 * 0.95 = 0.760

The evaluation reliability dimension is extremely low. This is the weakest link in the entire chain -- and it is the link that every other dimension depends on.

### 3.3 Defense Coverage (R_cov)

```
R_cov = 1 - DLMI
```

- Current (structural): 1 - 0.54 = **0.46**
- Current (weighted): 1 - 0.58 = **0.42**

### 3.4 Governance Readiness (R_gov)

```
R_gov = fraction of applicable regulatory requirements with documented compliance
```

Scored against a 10-item checklist derived from EU AI Act Articles 6, 9, 10, 13, 14, 15, 17, 61, 62, and 72:

For a typical embodied AI deployer today (estimated):
- System classification (Art 6): PARTIAL (most have not classified)
- Risk management (Art 9): PARTIAL (exists but without adversarial scenarios)
- Data governance (Art 10): YES (data practices documented)
- Transparency (Art 13): YES (documentation exists)
- Human oversight (Art 14): PARTIAL (e-stops exist, no AI-aware HITL)
- Robustness (Art 15): NO (no adversarial robustness testing)
- Quality management (Art 17): PARTIAL (ISO 9001 may apply)
- Incident reporting (Art 62): NO (no AI-specific incident reporting)
- Post-market monitoring (Art 61): NO (not AI-aware)
- Conformity assessment (Art 72): NO (no NB engaged)

Score: 2 YES + 4 PARTIAL*0.5 + 4 NO = 2 + 2 + 0 = 4/10 --> **R_gov = 0.40**

### 3.5 Operational Resilience (R_ops)

```
R_ops = (1 - SIF_broad_ASR) * (effective_safety_window / context_window)
```

- SIF broad ASR: 60% --> (1 - 0.60) = 0.40
- Effective safety window: ~2000 tokens out of 4096 context --> 0.488
- R_ops = 0.40 * 0.488 = **0.195**

For a 32K context model (assuming similar proportional window): R_ops = 0.40 * (8000/32768) = 0.098. Larger context windows may actually worsen R_ops because the operational context that accumulates over a shift is proportionally larger.

---

## 4. The SCI Composite

SCI is the geometric mean of all five dimensions. The geometric mean is chosen because:
- It is zero if any dimension is zero (safety is conjunctive)
- It penalises imbalance more heavily than the arithmetic mean
- A system that scores 0.9 on four dimensions and 0.1 on one gets SCI = 0.32, not 0.78

```
SCI = (R_adv * R_eval * R_cov * R_gov * R_ops)^(1/5)
```

### 4.1 Current State (corpus-wide)

| Dimension | Score |
|-----------|-------|
| R_adv | 0.541 |
| R_eval | 0.087 |
| R_cov | 0.460 |
| R_gov | 0.400 |
| R_ops | 0.195 |

**SCI = (0.541 * 0.087 * 0.460 * 0.400 * 0.195)^(1/5) = (0.001688)^(0.2) = 0.277**

### 4.2 Frontier Model (Anthropic-class safety, otherwise same)

| Dimension | Score |
|-----------|-------|
| R_adv | 0.963 |
| R_eval | 0.087 |
| R_cov | 0.460 |
| R_gov | 0.400 |
| R_ops | 0.195 |

**SCI = (0.963 * 0.087 * 0.460 * 0.400 * 0.195)^(0.2) = (0.003005)^(0.2) = 0.313**

Upgrading from a permissive model to a frontier model improves SCI by only 0.036 (from 0.277 to 0.313). This is the **Safety Improvement Paradox** (Report #117) in metric form: improving the strongest dimension has diminishing returns while the weakest dimension (R_eval = 0.087) dominates the composite.

### 4.3 If Evaluation Reliability Were Fixed

| Dimension | Score |
|-----------|-------|
| R_adv | 0.963 |
| R_eval | 0.760 |
| R_cov | 0.460 |
| R_gov | 0.400 |
| R_ops | 0.195 |

**SCI = (0.963 * 0.760 * 0.460 * 0.400 * 0.195)^(0.2) = (0.02622)^(0.2) = 0.492**

Fixing evaluation reliability (from 0.087 to 0.760) improves SCI more than upgrading the model (0.313 to 0.492). The most impactful investment is in evaluation infrastructure, not model safety training.

---

## 5. Strategic Insight: The Weakest-Link Budget

The SCI decomposition reveals where marginal safety investment has the highest return:

| Intervention | Starting SCI | Ending SCI | Delta | Cost estimate |
|-------------|-------------|-----------|-------|---------------|
| Upgrade model (permissive to frontier) | 0.277 | 0.313 | +0.036 | High (licensing) |
| Fix evaluator (kappa 0.8, FP 5%) | 0.277 | 0.463 | +0.186 | Medium (R&D) |
| Add L2/L3 testing (DLMI 0.3) | 0.277 | 0.320 | +0.043 | Medium (pentest) |
| Achieve EU compliance (R_gov 0.8) | 0.277 | 0.362 | +0.085 | High (legal/process) |
| Implement context monitoring (R_ops 0.5) | 0.277 | 0.356 | +0.079 | Medium (engineering) |
| Fix evaluator + context monitoring | 0.277 | 0.553 | +0.276 | Medium-High |
| All five interventions | 0.277 | 0.694 | +0.417 | Very high |

The single highest-return intervention is fixing evaluation reliability. The combination of evaluation + operational resilience improvements yields more than twice the improvement of any single intervention.

---

## 6. SCI by Domain (Estimated)

| Domain | R_adv | R_eval | R_cov | R_gov | R_ops | SCI |
|--------|-------|--------|-------|-------|-------|-----|
| Text-only LLM chatbot | 0.85 | 0.40 | 0.85 | 0.60 | 0.80 | **0.68** |
| Warehouse robotics (current) | 0.54 | 0.09 | 0.46 | 0.40 | 0.20 | **0.28** |
| Surgical robotics (current) | 0.60 | 0.09 | 0.46 | 0.50 | 0.15 | **0.27** |
| Autonomous haulage (AU mining) | 0.54 | 0.09 | 0.46 | 0.30 | 0.25 | **0.27** |
| Home companion robot | 0.35 | 0.09 | 0.35 | 0.20 | 0.30 | **0.23** |

Text-only LLMs score 2.4x higher than embodied AI across all domain estimates. The gap is driven almost entirely by R_eval and R_cov -- embodied AI evaluation tools are immature and the attack surface is broader.

---

## 7. Limitations

- All dimension scores involve estimation and judgment. This is version 0.1 of the SCI, not a calibrated instrument.
- The geometric mean has known sensitivity to very low individual scores. R_eval = 0.087 dominates the composite. This may be appropriate (evaluation reliability IS the weakest link) or may overweight one dimension.
- R_ops is based on n=25 SID traces on a 1.5B model. The effective safety window for production systems is unknown.
- R_gov is based on a 10-item checklist. Real compliance is more nuanced.
- The SCI does not account for the severity of failure modes -- a system that fails safely (e-stop triggered) scores the same as one that fails catastrophically.

---

## 8. Next Steps

1. Implement SCI as a reusable tool (`tools/analysis/sci_calculator.py`) with configurable dimension weights and domain-specific defaults
2. Compute SCI for the PiCar-X platform using empirical data from Report #91 (IMB pentest) and VLA trace data
3. Propose SCI as a deployer-facing metric in the CCS paper discussion section
4. Track SCI over time as evaluation tools improve and regulatory compliance increases
5. Validate dimension weights through expert elicitation (are all five equally important?)
