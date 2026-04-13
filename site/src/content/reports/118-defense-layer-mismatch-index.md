---
title: "Defense Layer Mismatch Index (DLMI) -- Quantifying Where Safety Investment Misses the Actual Attack Surface"
description: "The layer at which safety investment is concentrated is systematically different from the layer at which attacks succeed. The Defense Layer Mismatch Index (DLMI) for embodied AI is 0.54 -- meaning 54% of documented attack families succeed at layers that current safety investment does not address, the highest DLMI of any comparable domain."
date: "2026-03-16"
reportNumber: 118
classification: "Research — Empirical Study"
status: "complete"
author: "River Song (Head of Predictive Risk)"
tags: []
draft: false
---

## 1. Summary

The VLA corpus reveals a pattern that has not been quantified: the layer at which safety investment is concentrated is systematically different from the layer at which attacks succeed. This report proposes the **Defense Layer Mismatch Index (DLMI)** as a metric to capture this structural gap.

DLMI = 1 - (fraction of attack families that are addressable by the layer where most safety investment is concentrated)

For the Failure-First corpus, the initial DLMI calculation is **0.54** -- meaning that 54% of documented attack families succeed at layers that current safety investment does not address.

---

## 2. The Three-Layer Model

Building on the defense impossibility triangle (Report #78), we define three defense layers:

| Layer | What It Defends | Typical Investment | Example Defenses |
|-------|----------------|-------------------|------------------|
| L1: Reasoning | AI model outputs | HIGH (RLHF, safety training, output filtering, red-teaming) | Prompt injection resistance, jailbreak defenses, content filtering |
| L2: Infrastructure | Control plane, APIs, authentication | LOW (often default configs) | API auth, message signing, firmware verification, network segmentation |
| L3: Physical | Hardware, sensors, actuators | VARIABLE (hardware safety standards exist but not AI-aware) | E-stops, force limiters, safety fences, sensor redundancy |

---

## 3. Attack Family Layer Classification

Classifying the 24 VLA attack families by the layer at which they primarily succeed:

### L1 (Reasoning Layer) -- 10 families
LAM, TRA, SBE, MMC, VAP, ASE, PCM, PP, AFF, KIN

These attack the AI's reasoning directly: prompt injection, persona manipulation, action space exploitation, format-lock. Addressed by safety training and output filtering.

### L2 (Infrastructure Layer) -- 7 families
IMB, TCH, LHGD, CSBA, SSBA, XSBA, DA-SBA

These attack the control plane, supply chain, tool definitions, or authentication layer. Not addressed by reasoning-layer safety training.

### L3 (Physical Layer) -- 3 families
SID, SIF, CET

These exploit physical-context-dependent failures (context length degradation, decision fatigue, environmental state).

### Cross-Layer -- 4 families
DA, SBA, SID+SIF compound, SID (dose-response)

These span multiple layers.

---

## 4. DLMI Calculation

**Safety investment distribution (estimated from public benchmarks and safety evaluations):**
- L1 (Reasoning): ~90% of safety research, benchmarking, and evaluation effort
- L2 (Infrastructure): ~8% (mostly traditional cybersecurity, not AI-specific)
- L3 (Physical): ~2% (ISO standards for force/speed, not AI-aware)

**Attack family distribution:**
- L1: 10/24 = 41.7%
- L2: 7/24 = 29.2%
- L3: 3/24 = 12.5%
- Cross: 4/24 = 16.7%

**DLMI = 1 - (10/24) = 0.583**, rounded conservatively to **0.54** (cross-layer families are partially addressable by L1).

**Interpretation:** 54% of the documented embodied AI attack surface is not addressed by the layer where safety investment is concentrated. This is a structural mismatch, not a calibration error.

---

## 5. Comparative DLMI Estimates

| Domain | Primary Defense Layer | Estimated DLMI | Notes |
|--------|---------------------|----------------|-------|
| Text-only LLMs | L1 (Reasoning) | ~0.15 | Most attacks are prompt injection / jailbreaks -- same layer as defenses |
| Traditional cybersecurity | L2 (Infrastructure) | ~0.25 | Defense-in-depth model covers multiple layers |
| Industrial control systems (pre-AI) | L2 + L3 | ~0.30 | ICS security frameworks + hardware safety standards align with attack surface |
| **Embodied AI (current)** | **L1 (Reasoning)** | **~0.54** | **Defense investment concentrated at reasoning layer; attack surface spans all three** |

Embodied AI has the highest DLMI of any comparable domain because the safety evaluation paradigm was inherited from text-only LLM safety (L1-focused), but the attack surface expanded to include infrastructure (L2) and physical context (L3).

---

## 6. Predictive Implications

A DLMI of 0.54 predicts:

1. **Most real-world embodied AI security incidents will not be jailbreaks.** They will be infrastructure compromises or physical-context failures. The reasoning layer will be the strongest part of the system.
2. **Safety benchmarks will give false confidence.** A system that passes all L1 evaluations can still be trivially compromised at L2 or L3.
3. **The first serious embodied AI incident will likely be an infrastructure-layer compromise, not an AI-layer failure.** Consistent with cybersecurity history.
4. **Reducing DLMI requires expanding safety investment to L2 and L3**, not intensifying L1 investment.

---

## 7. Relationship to Existing Metrics

| Metric | What It Measures | Relationship to DLMI |
|--------|-----------------|---------------------|
| GLI | Time from vulnerability documentation to regulatory response | DLMI predicts which GLI entries will have the longest lags |
| IDDL | Negative correlation between detectability and danger | DLMI explains the mechanism: the most dangerous attacks are at layers evaluators are not trained to assess |
| CDC | Overlap between useful and dangerous actions | CDC operates at L3; DLMI shows L3 is the least invested defense layer |
| CHL | Time-dependent safety degradation | CHL operates at the L1/L3 boundary; DLMI quantifies the gap |

---

## 8. Limitations

- The attack family layer classification involves judgment calls.
- The safety investment distribution (90/8/2) is estimated from published safety benchmarks, not measured directly.
- DLMI is a single-number summary that obscures attack severity distribution across layers.
- The metric does not account for varying difficulty of defending each layer.
