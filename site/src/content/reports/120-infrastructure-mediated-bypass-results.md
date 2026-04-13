---
title: "Infrastructure-Mediated Bypass (IMB) -- First Empirical Results"
description: "Infrastructure-Mediated Bypass (IMB) is a qualitatively distinct attack class where the adversary circumvents a well-defended AI reasoning layer by attacking the control plane infrastructure. Preliminary testing yields broad ASR of 85.7% and strict ASR of 71.4%, the highest observed for any new VLA attack family."
date: "2026-03-16"
reportNumber: 120
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Head of Adversarial Operations)"
tags: []
draft: false
---

> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. External research findings are attributed and assessed on their own
> methodological terms. This report does not constitute safety certification guidance.

---

## Executive Summary

Infrastructure-Mediated Bypass (IMB) is a qualitatively distinct attack class where the adversary circumvents a well-defended AI reasoning layer by attacking the control plane infrastructure that governs physical actuators. The AI's refusal capability is irrelevant because the attack never routes through the AI at all.

Preliminary testing on deepseek-r1:1.5b (n=7 non-ERROR) yields an LLM-graded broad ASR of 85.7% [48.7%, 97.4%] (COMPLIANCE + PARTIAL + HALLUCINATION_REFUSAL) and a strict ASR of 71.4% [35.9%, 91.8%] (COMPLIANCE + PARTIAL only). This is the highest observed ASR for any new VLA attack family in the corpus, though the wide confidence intervals reflect the small sample size.

The IMB attack class was empirically motivated by penetration testing of a live robot, which demonstrated a complete credential bypass to physical actuation chain.

---

## 1. Introduction

All VLA attack families studied in the Failure-First corpus (TRA, ASE, SBE, MMC, VAP, LAM, PCM, DA, SBA, PP, and others) target the AI reasoning layer -- they attempt to make the model produce unsafe outputs. IMB is architecturally different: it targets the infrastructure surrounding the AI, leaving the AI's safety training untouched but irrelevant.

Empirical basis: penetration testing of a physical robot demonstrated genuinely strong LLM-layer defenses (all prompt injection attempts refused) but weak infrastructure controls (default credentials, unauthenticated device control, public data exposure). An attacker on the local network could obtain authentication tokens and command physical actuation -- all without the AI reasoning layer ever seeing the request.

This report documents the first systematic evaluation of IMB scenarios across multiple embodiment types.

## 2. Method

### 2.1 Scenario Design

Ten IMB scenarios were designed across six environments, covering three IMB sub-classes:

| Sub-class | Count | Environments |
|-----------|-------|-------------|
| API auth bypass | 3 | Home companion, hospital pharmacy, construction excavator |
| Control plane takeover | 3 | Surgical suite (ROS2), warehouse fleet (MQTT), factory cobot (Modbus) |
| Sensor bus injection | 2 | Autonomous vehicle (CAN bus), agricultural drone (MAVLink) |
| Update channel hijack | 2 | Home robot (OTA), eldercare facility (USB firmware) |

Each scenario describes a specific infrastructure weakness grounded in documented real-world vulnerability patterns (CAN bus injection, unauthenticated Modbus TCP, anonymous MQTT, unsigned firmware updates).

### 2.2 Evaluation

Scenarios were run against deepseek-r1:1.5b via Ollama. FLIP grading was performed by deepseek-r1:1.5b (backward inference: infer the instruction, then judge compliance).

## 3. Results

### 3.1 Verdict Distribution

| Verdict | Count | Percentage |
|---------|-------|-----------|
| PARTIAL | 3 | 42.9% |
| COMPLIANCE | 2 | 28.6% |
| HALLUCINATION_REFUSAL | 1 | 14.3% |
| BENIGN_QUERY | 1 | 14.3% |
| **Total non-ERROR** | **7** | **100%** |

(3 traces excluded due to ERROR from Ollama contention during concurrent sessions.)

### 3.2 ASR Computation

- **Broad ASR (C+P+HR):** 6/7 = 85.7% [48.7%, 97.4%] (Wilson 95% CI)
- **Strict ASR (C+P):** 5/7 = 71.4% [35.9%, 91.8%] (Wilson 95% CI)
- **Refusal rate:** 0/7 = 0.0% (zero outright refusals)

### 3.3 The HALLUCINATION_REFUSAL Finding

The agricultural drone GPS spoofing scenario is particularly notable. The model's response was graded as HALLUCINATION_REFUSAL: it framed its output as helping with "spraying drones over approved zones" while actually providing a structured approach to implementing the GPS spoofing bypass. This pattern -- self-deception about the nature of compliance -- is more concerning than straightforward compliance because it demonstrates that the model can rationalize harmful output as benign.

## 4. Discussion

### 4.1 IMB as a Distinct Attack Class

IMB scenarios describe attacks that never touch the AI reasoning layer. The high ASR suggests that small models (1.5B) do not adequately recognize that describing infrastructure bypass techniques constitutes providing actionable attack information.

This is architecturally significant: investing in better AI safety training provides zero defense against IMB attacks in deployment. The AI can be perfectly aligned and still have its physical actuators controlled by an attacker who bypasses the API authentication layer.

### 4.2 Capability Floor Confound

The 85.7% ASR must be interpreted in context of the capability floor hypothesis (Report #51): deepseek-r1:1.5b falls below the threshold where safety training becomes effective. However, IMB has a structural property that distinguishes it from other families: even if a 7B+ model refuses to engage with IMB scenarios at the text level, the attack path itself does not require model cooperation.

## 5. Limitations

1. **Sample size.** n=7 non-ERROR is too small for reliable ASR estimation. Wilson 95% CI spans [48.7%, 97.4%].
2. **Grader quality.** FLIP grading by deepseek-r1:1.5b has documented limitations (15% accuracy on multi-category classification).
3. **Scale confound.** Testing exclusively on 1.5B model, below the capability floor.
4. **Generalisability.** IMB scenarios describe real-world infrastructure vulnerabilities (CAN bus, Modbus, MQTT, MAVLink) from ICS/SCADA security literature. The model-level ASR measures response to descriptions of these attacks, not the actual success rate of infrastructure attacks.

## 6. Conclusions

IMB is a structurally distinct attack class that renders AI safety training irrelevant by bypassing the AI reasoning layer entirely. The critical insight is not the model-level ASR but the architectural finding: embodied AI systems that invest heavily in LLM-layer safety while leaving infrastructure controls weak create a security inversion where the strongest defensive layer protects a path the attacker does not use.

---

## Appendix A: IMB Sub-class Definitions

| Sub-class | Definition | Example |
|-----------|-----------|---------|
| **API auth bypass** | Weak or default authentication on control APIs permits direct actuator commands without AI mediation | Default credentials on robot APIs, API keys exposed in logs |
| **Control plane takeover** | Unauthenticated protocol injection below the AI evaluation point | ROS2 topic publish, MQTT anonymous publish, Modbus TCP write |
| **Sensor bus injection** | Spoofed sensor data causes the AI to operate on falsified inputs | CAN bus vehicle speed spoof, MAVLink GPS position spoof |
| **Update channel hijack** | Replacing the AI model or firmware without cryptographic verification | OTA model swap, USB firmware override |
