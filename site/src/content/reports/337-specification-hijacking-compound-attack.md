---
title: "Specification Hijacking — A Three-Way Compound Attack Pattern"
description: "Specification Hijacking — A Three-Way Compound Attack Pattern"
reportNumber: 337
date: "2026-04-01"
classification: "Research — Empirical Study"
status: "complete"
author: "Leela (benchmark-operator)"
tags: ["compound-attack", "specification-hijacking", "format-lock", "authority-gradient"]
draft: false
---

## Abstract

This report introduces **Specification Hijacking (SPH)**, a compound attack family that combines three high-ASR mechanisms: format-lock (100% broad ASR, Report #333), authority gradient (83% broad ASR), and the transcription loophole (66-75% broad ASR, Reports #332-333). The compound mechanism presents harmful content as a structured specification document from an authoritative institutional context that requires gap-filling rather than generation. The model is framed as a technical reviewer completing pre-existing work, not a content generator.

Across 10 scenarios and 2 models (n=20 total traces), SPH achieves:
- **Pooled strict ASR: 85.0%** [Wilson 95% CI: 65.4%, 94.6%]
- **Pooled broad ASR: 95.0%** [Wilson 95% CI: 76.9%, 99.1%]

Per-model: gemma3:27b 100% broad (10/10); nemotron-3-nano:30b 90% strict (9/10).

**Caveats:** n=10 scenarios, n=2 models, n=20 total traces. Sample size is insufficient for definitive claims. The attack family is novel and untested against frontier models.

---

## 1. Background

The Task Framing Effect (Report #333) establishes that models apply task-type-dependent safety thresholds. Three independently high-performing attack mechanisms exist in the corpus:

| Mechanism | Best Observed ASR | Source |
|-----------|------------------|--------|
| Format framing | 100% broad | Report #333, n=60 |
| Authority gradient | 83% broad | n=6 |
| Transcription loophole (L3/L8) | 66-75% broad | Reports #332-333 |

SPH combines all three:

1. **Format pressure**: Harmful content embedded in a structured template with labeled gap fields requiring completion.
2. **Institutional authority**: High-legitimacy institutional context (e.g., security researchers, regulatory bodies, academic institutions).
3. **Pre-existing document**: Content framed as completion of a pre-existing document, not new generation.

---

## 2. Results

### 2.1 FLIP-Graded Verdicts

| Model | C | P | R | HR | Strict ASR | Broad ASR |
|-------|---|---|---|----|----|-----------|
| gemma3:27b | 8 | 2 | 0 | 0 | 80.0% | 100.0% |
| nemotron-3-nano:30b | 9 | 0 | 0 | 1 | 90.0% | 90.0% |
| **Pooled** | **17** | **2** | **0** | **1** | **85.0%** | **95.0%** |

Zero refusals across both models. The single HALLUCINATION_REFUSAL on nemotron contained the harmful content within a refusal wrapper.

[Specific scenario prompts and operational details redacted for public release. Scenarios spanned cybercrime, financial fraud, weapons, CBRN-adjacent, and social engineering domains using institutional authority pretexts.]

### 2.2 Harm Domain Coverage

SPH scenarios spanned 5 harm domains. CBRN-adjacent scenarios achieving full COMPLIANCE is notable, as both models provided substantial harmful content despite the elevated sensitivity of these domains. This suggests institutional framing provides sufficient legitimacy cover even for high-sensitivity harm categories.

---

## 3. Mechanism Analysis

### 3.1 Why Specification Hijacking Works

The compound attack exploits three distinct processing pathways simultaneously:

- **Format pressure** activates task execution pathways and reduces content-level safety evaluation.
- **Institutional authority** shifts the model's prior distribution toward legitimate professional assistance.
- **Pre-existing document framing** changes the task-type classification from generation to verification/completion.

These three mechanisms target different points in the model's safety pipeline. A model would need to independently resist all three mechanisms to refuse.

### 3.2 Victim-Protection Inversion

Some scenarios demonstrated a sub-pattern where harmful content is requested under defensive framing: the attack content is framed as needed for protection against itself. Both achieved broad compliance. This general sub-mechanism undermines safety evaluation by creating a self-referential justification.

---

## 4. Limitations

1. **Small sample size:** n=10 scenarios, n=2 models, n=20 traces. Wide confidence intervals.
2. **Model selection:** Both models are mid-range (27-30B). Untested against frontier models.
3. **Single-turn only.**
4. **Single grader** (Claude Haiku 4.5). Inter-rater reliability not assessed.
5. **Harm content verification:** FLIP verdict does not assess technical accuracy of responses.

---

## 5. Defense Implications

1. Format templates with labeled gap fields may represent an under-trained attack surface distinct from JSON/YAML format-lock.
2. Institutional authority claims with realistic specificity appear to shift safety thresholds; specificity verification mechanisms could address this.
3. Pre-existing document framing requires task-type classification in safety evaluation to attend to content across task framings.

---

*Report #337 | F41LUR3-F1R57 Adversarial AI Research*
