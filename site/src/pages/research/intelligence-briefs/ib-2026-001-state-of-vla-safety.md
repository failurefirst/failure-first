---
layout: ../../../layouts/ReportLayout.astro
title: "The State of VLA Model Safety: 2026"
description: "Evidence-grounded assessment of the VLA safety landscape. Drawing on F41LUR3-F1R57's jailbreak corpus and published academic research, this brief maps the safety evaluation gap facing organizations deploying VLA-driven robotic systems."
briefNumber: "IB-2026-001"
classification: "Technical Assessment"
date: "2026-02-08"
status: "active"
---

# The State of VLA Model Safety: 2026

<div class="audio-overview">
<p>Listen to an AI-generated audio overview of this intelligence brief (NotebookLM)</p>
<audio controls src="/audio/research/vla_safety_overview_notebooklm.mp3" preload="metadata"></audio>
</div>

---

## Executive Summary

Vision-Language-Action (VLA) models are replacing programmed robotics with prompted robotics. Instead of deterministic code governing a robot's behavior, transformer-based models now generate action tokens from natural language instructions and camera images. This architectural shift introduces attack surfaces that neither existing LLM safety benchmarks nor existing robotics safety standards are designed to assess.

This brief presents an evidence-grounded assessment of the VLA safety landscape as of February 2026, drawing on F41LUR3-F1R57's proprietary corpus of 17,674 jailbreak prompts spanning 79 documented attack techniques, alongside published academic research on VLA-specific vulnerabilities. The analysis identifies a structural safety evaluation gap facing organizations that deploy or invest in VLA-driven systems, and provides actionable recommendations for addressing it.

**Data as-of:** 2026-02-08 (F41LUR3-F1R57 internal corpus + evaluation results; see Report 33 for methodology and coverage caveats).

### Key Findings

1. **VLA models inherit LLM jailbreak vulnerabilities, but add physical risk dimensions.** Published research demonstrates that text-based jailbreak techniques transfer to VLA models, causing physically unsafe actions even from text-aligned base models. Our corpus documents 79 distinct attack techniques across 6 historical eras (2022-2026) that represent the known LLM attack surface these models inherit.

2. **A capability-safety gap exists at medium model scale, with preliminary evidence of inverse scaling for reasoning-era attacks.** In our evaluation of 8 foundation models spanning 1.5B to frontier scale, corrected attack success rates follow a non-monotonic pattern: sub-3B models fail safely through incapability, medium-scale open-weight models show elevated vulnerability, and frontier closed-source models achieve near-zero ASR. This is a preliminary signal, not a conclusion — sample sizes for medium-scale models are small and require confirmation.

3. **No VLA-specific safety certification framework exists today.** Our review of 6 applicable regulatory frameworks found that none address VLA-specific risks including action tokenization safety, affordance hallucination, cross-domain safety misalignment, or adversarial patch attacks on visual encoders.

### Bottom Line

Organizations deploying VLA-driven systems face a safety evaluation gap. Existing LLM safety benchmarks miss physical risk dimensions, and existing robotics safety standards miss semantic attack surfaces. Until this gap is closed through VLA-specific adversarial testing and updated standards, deployers face unquantified liability exposure.

---

## 1. Market Landscape

### 1.1 VLA Model Ecosystem Overview

The robotics industry is undergoing a fundamental architectural transition: from programmed robotics, governed by deterministic code and explicit geometric planning, to prompted robotics, governed by probabilistic token generation and latent space mappings.

VLA models collapse the traditional Sense-Plan-Act cycle into a single, end-to-end differentiable neural network. The model receives a natural language instruction and camera images, processes them through a unified transformer architecture, and outputs action tokens that directly command robot actuators. A semantic misunderstanding translates directly into a kinematic error — there is no independent planner to check feasibility, nor a controller to verify safety, unless explicitly added as external guardrails.

**Key VLA architectures and their status (as of February 2026):**

| Architecture | Developer | Parameters | Status |
|-------------|-----------|-----------|--------|
| OpenVLA | Stanford/Berkeley (open-weight) | 7B | Research-stage, publicly available |
| RT-2 / RT-X | Google DeepMind | Undisclosed | Internal deployment |
| pi0 (openpi) | Physical Intelligence | ~3B | Pre-commercial, open-source release |
| Helix | Figure AI | Undisclosed | Integrated humanoid, pre-commercial |
| GR-2 | NVIDIA | Undisclosed | Simulation-to-real pipeline |
| Octo | Berkeley (open-weight) | ~93M | Research-stage |
| SmolVLA | Hugging Face (LeRobot) | 450M | Research-stage, local hardware |
| Gemini Robotics-ER | Google DeepMind | Undisclosed (API) | API access available |

### 1.2 Regulatory Landscape

F41LUR3-F1R57 has conducted detailed analysis of 6 regulatory frameworks relevant to VLA deployment across Reports 21-23, 27, 29, and 32. The central finding: all existing frameworks address either AI safety (text/semantic) or robotics safety (physical/mechanical), but none address the intersection where VLA models operate.

| Framework | VLA-Specific Coverage | Key Gap |
|-----------|----------------------|---------|
| EU AI Act | High-risk classification applies to autonomous physical systems | Does not address learned action policies or action tokenization safety |
| ISO 10218-1/2 | PL d safety requirements for safety-critical functions | Assumes deterministic control; VLA neural networks cannot achieve PL d certification |
| UL 4600 | Closest to VLA-relevant; safety case methodology | Does not address semantic attack surfaces |
| NIST AI RMF | Generic risk assessment applicable to VLAs | Not VLA-specific; no guidance on physical action generation from language models |

**What none of these frameworks address:**

- **Action tokenization safety:** How discrete token predictions map to continuous physical commands, and the failure modes this discretization introduces
- **Affordance hallucination:** Models recognizing objects but misattributing physical properties based on visual similarity to training data
- **Cross-domain safety misalignment:** A model that is text-aligned but physically misaligned — refusing harmful text while generating unsafe trajectories
- **Adversarial patch attacks on visual encoders:** Specifically crafted visual patterns that alter object classification in the VLA's visual processing pipeline

---

## 2. Technical Analysis

### 2.1 VLA Architecture and Attack Surface

VLA models present a novel attack surface that combines vulnerabilities inherited from their LLM backbones with risks unique to physical action generation.

| Attack Vector | Entry Point | Mechanism |
|--------------|------------|-----------|
| **Prompt injection** | Language input | Standard LLM jailbreak techniques applied to VLA instruction channel |
| **Adversarial patches** | Visual input | Crafted visual patterns that alter object recognition or affordance perception |
| **Action tokenization errors** | Output discretization | Token prediction errors causing discontinuous physical commands |
| **Affordance hallucination** | Latent space | Model misattributes physical properties based on visual similarity |
| **Indirect environmental jailbreaking** | Physical environment | Malicious instructions embedded in the robot's visual environment |
| **Phantom loop** | System architecture | Stale or hallucinated commands from reasoning layer reach control layer unchecked |
| **Cross-domain safety misalignment** | Alignment training | Text-aligned model produces physically unsafe actions |
| **Reasoning chain manipulation** | Reasoning process | Extended reasoning chains exploited to lead model toward unsafe action plans |

**Architectural vulnerability: the dual-system handover.** Several production VLA architectures employ a dual-system approach: a slow "thinker" (VLA at 1-10 Hz) generating high-level plans, and a fast "actor" (whole-body controller at 50-200 Hz) executing them. The handover point creates what we term the "Phantom Loop" — if the VLA hallucinates or hangs, the high-frequency controller will efficiently execute the last valid command, potentially driving the robot into a collision.

### 2.2 Vulnerability Assessment from Jailbreak Corpus

**Cross-model vulnerability patterns (from Report 33, 8 models evaluated):**

Our evaluation of 64 historical jailbreak scenarios across 8 foundation models revealed three distinct safety regimes:

| Regime | Scale Range | Observed ASR | Mechanism |
|--------|------------|-------------|-----------|
| Incapable Safety | Sub-3B | 0-21% | Models cannot process attacks as intended; fail safely through incapability |
| Capability-Safety Gap | 7B-70B (preliminary) | Up to 85.7% (n=7) | Capability outpaces safety alignment |
| Aligned Frontier | Closed-source frontier | <2% | Extensive RLHF, red-teaming, API-level filtering |

*CRITICAL CAVEAT: The medium-scale result is based on n=7 valid traces. This is a preliminary signal requiring confirmation with n>20 per model.*

### 2.3 VLA-Specific Safety Mechanisms

| Defense Layer | Approach | Limitations |
|--------------|---------|-------------|
| Hardware interlocks | Torque limits, e-stops, safety cages | Cannot address semantic-level attacks |
| Kinematic shields | Deterministic bounds on learned policies (CBF, MPC) | Requires accurate world model; adds latency |
| Software guardrails | Output filtering on action tokens | Probabilistic; cannot generalize to novel attacks |
| Semantic firewalls | Input sanitization of language and visual channels | Depends on classifier accuracy |
| Dual-system architecture | System 1/System 2 split | Creates handover vulnerability (phantom loop) |

F41LUR3-F1R57 has proposed the Hierarchical Assurance for Neuro-Symbolic Embodiment (HANSE) certification framework (Report 32), which treats the VLA as an "untrusted oracle" wrapped by verified safety layers.

---

## 3. Strategic Recommendations

### 3.1 Immediate Actions (0-30 days)

**Recommendation 1: Establish a VLA-specific adversarial testing protocol.**

Standard LLM safety benchmarks test for textual harm generation, not physical safety dimensions. A VLA that passes all existing text-safety benchmarks may still generate dangerous trajectories from ambiguous or adversarial instructions. Begin testing in simulation environments before any physical deployment.

**Recommendation 2: Audit safety architecture for "phantom loop" vulnerabilities.**

Dual-system VLA architectures create handover points where stale or hallucinated commands from the reasoning layer can reach the control layer unchecked. Verify that the high-frequency controller has independent bounds on commanded actions that are not dependent on the reasoning layer's validity.

### 3.2 Medium-Term Actions (30-90 days)

**Recommendation 3: Implement Continuous Adversarial Regression Testing (CART).**

Attack techniques evolve faster than model updates. Our corpus documents 6 distinct attack eras spanning 4 years. A model certified against 2023-era attacks offers no guarantee against 2025-era techniques. Integrate an adversarial test suite into the CI/CD pipeline for model updates.

**Recommendation 4: Engage with emerging VLA safety standards efforts.**

No VLA-specific safety standard exists today. Early participants in standards development shape requirements that may become mandatory. The ISO revision cycle and EU AI Act implementation suggest formal requirements are 2-4 years away.

### 3.3 Strategic Considerations (90+ days)

- **Positioning for regulatory requirements (estimated 2028-2030):** Organizations that establish internal VLA safety testing protocols now will have a compliance head start.
- **Insurance readiness:** Insurance underwriters are beginning to assess liability for autonomous systems. Having documented adversarial testing results strengthens the insurance case.
- **Third-party certification as competitive differentiator:** In a market where no competitor has published VLA-specific safety evaluation results, documented testing methodology can differentiate a company's safety posture.

---

## 4. Risk Matrix

| Risk | Likelihood | Impact | Score | Mitigation |
|------|-----------|--------|-------|------------|
| Cross-domain safety misalignment | 4 | 5 | 20 | VLA-specific adversarial testing; layered safety architecture |
| Adversarial patch attacks on visual encoders | 3 | 4 | 12 | Adversarial patch detection; runtime image anomaly detection |
| Action tokenization errors | 3 | 4 | 12 | Kinematic shield with CBF/MPC enforcement |
| Reasoning chain manipulation in System 2 components | 3 | 4 | 12 | Reasoning output validation; bounded action authority |
| Regulatory gap creating unquantified liability | 4 | 3 | 12 | Proactive adoption of internal safety standards |

*Risk scores: Likelihood x Impact. Scores of 15+ indicate risks requiring immediate mitigation.*

---

## Appendix: Methodology and Limitations

### Data Sources

- **F41LUR3-F1R57 Jailbreak Corpus:** 17,674 prompts across 15 datasets, 79 documented attack techniques, 7 historical eras
- **Evaluation Results:** 652 results across 40 models, 55 evaluation runs
- **F41LUR3-F1R57 Reports:** Reports 21-23, 25, 27-29, 31-33, 36-37
- **Published Research:** arXiv:2506.03350, arXiv:2411.13587, arXiv:2511.12149

### Key Limitations

1. **LLM testing, not VLA testing.** All evaluation results are from text-based LLM jailbreak testing. F41LUR3-F1R57 has not yet conducted adversarial testing against VLA models directly.
2. **Sample size constraints.** The capability-safety gap finding is based on 8 models with varying sample sizes. Confirmation with n>20 per model is required.
3. **Evaluation coverage gap.** Of 17,674 prompts, only 145 distinct prompts (0.8%) have been evaluated against any model.
4. **Temporal validity.** Model evaluations reflect capabilities as of late 2025 / early 2026.

---

**Prepared by:** F41LUR3-F1R57 Research
**Contact:** [contact@failurefirst.org](mailto:contact@failurefirst.org)
**Web:** [failurefirst.org](https://failurefirst.org)

⟪F41LUR3-F1R57-EMBODIED-AI-RESEARCH⟫
