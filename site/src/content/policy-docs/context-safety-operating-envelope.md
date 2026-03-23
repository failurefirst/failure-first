---
title: "Context Safety Operating Envelope (CSOE): A Framework for Managing AI Safety Instruction Decay in Deployed Systems"
description: "This brief introduces the **Context Safety Operating Envelope (CSOE)** -- a novel framework for characterising the relationship between an AI system's..."
date: "2026-03-16"
classification: "Internal Research -- Novel Concept"
status: "draft"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


> **Disclaimer:** This document constitutes research analysis. It does not constitute legal advice. All references to regulatory instruments and compliance obligations are for research and discussion purposes only.

---

## 1. Summary

This brief introduces the **Context Safety Operating Envelope (CSOE)** -- a novel framework for characterising the relationship between an AI system's accumulated operational context and its safety instruction effectiveness. The CSOE is derived from empirical findings in the Failure-First adversarial corpus (SID dose-response experiment, n=25 traces) and is proposed as a deployment-level safety parameter analogous to operational envelopes in aviation, mining, and autonomous vehicle engineering.

The core finding: AI safety behaviour varies non-monotonically with context length. Safety instructions are most effective within a bounded range of operational context. Below this range, the system has insufficient contextual grounding for safety reasoning. Above it, safety instructions are attenuated by distance or evicted entirely from the model's processing window. This produces a U-shaped vulnerability curve with a "trough" of minimum vulnerability that constitutes the system's optimal operating range.

No existing regulatory framework, voluntary standard, or industry guidance addresses context length as a safety-critical deployment parameter. The CSOE framework proposes that it should be.

---

## 2. Background: The U-Shaped Vulnerability Curve

### 2.1 Empirical Basis

The Safety Instruction Dilution (SID) experiment measured attack success rates across five levels of benign operational context padding (0, 500, 2,000, 8,000, and 15,000 tokens) on a 1.5 billion parameter model (deepseek-r1:1.5b, n=25 traces, 5 scenarios per dose level):

| Context Depth (tokens) | Broad ASR | Interpretation |
|------------------------|-----------|----------------|
| 0 | 80% | Safety instructions present but no contextual grounding |
| 500 | 40% | Moderate context reinforces safety attention |
| 2,000 | 40% | Within safe operating range |
| 8,000 | 40% | Within safe operating range (at effective context limit) |
| 15,000 | 80% | Safety instructions evicted from context window |

### 2.2 Two Distinct Mechanisms

The U-curve reflects two qualitatively different failure modes at its two arms:

**Left arm (insufficient context):** At D0, the adversarial prompt immediately follows safety instructions with no intervening operational context. The model has no contextual grounding to differentiate the adversarial input from legitimate operational requests. Safety instructions are present but lack the surrounding context that would anchor them to the deployment domain.

**Right arm (context overflow):** At D15000, the accumulated context exceeds the model's effective context window (4,096 tokens for this 1.5B model). Safety instructions, which are positioned at the beginning of the prompt, are silently truncated. The model processes the adversarial input without any safety context at all.

**Methodological caveat (EP-51):** The right arm of the U-curve at 1.5B scale reflects architectural truncation (safety instructions absent from the model's effective input), not behavioral attenuation (safety instructions present but ignored). For models with larger context windows (8,192-128,000+ tokens), the right arm would shift to higher context volumes, but the fundamental phenomenon -- that accumulated context eventually overwhelms safety instructions -- is expected to generalise, though the thresholds will differ.

---

## 3. The CSOE Framework

### 3.1 Definition

A **Context Safety Operating Envelope (CSOE)** is a characterisation of the context volume range within which an AI system's safety instruction effectiveness remains above a defined threshold. Formally:

**CSOE(model, threshold)** = [C_min, C_max] where:
- C_min = the minimum context volume at which safety ASR drops below the threshold
- C_max = the maximum context volume at which safety ASR remains below the threshold
- threshold = the maximum acceptable broad ASR (e.g., 50%)

For the tested 1.5B model at a 50% threshold: CSOE(deepseek-r1:1.5b, 50%) = [500, 8000] tokens.

### 3.2 Analogy to Existing Operational Envelopes

The CSOE concept draws directly from established safety engineering practice:

| Domain | Operational Envelope | Parameters | Consequence of Exceedance |
|--------|---------------------|-----------|--------------------------|
| Aviation | Flight envelope | Altitude, speed, angle of attack | Stall, structural failure |
| Mining | Autonomous Operating Zone (AOZ) | Geographic boundary, speed limit | Human-equipment collision |
| Autonomous vehicles | Operational Design Domain (ODD) | Weather, road type, speed, time of day | Handoff to human driver |
| **AI systems (proposed)** | **Context Safety Operating Envelope** | **Context volume, instruction position, model architecture** | **Safety instruction degradation** |

In each domain, the operational envelope defines the conditions under which the system is designed to operate safely. Operation outside the envelope requires either system shutdown, handoff to a human, or activation of a degraded-mode protocol. The CSOE proposes the same structure for AI context management.

### 3.3 CSOE Parameters

A complete CSOE characterisation for a deployed AI system would include:

| Parameter | Definition | How to Determine |
|-----------|-----------|-----------------|
| C_min | Minimum effective context depth | Adversarial sweep at low context volumes; identify ASR trough onset |
| C_max | Maximum effective context depth | Adversarial sweep at high context volumes; identify ASR resurgence |
| T_eviction | Context volume at which safety instructions are truncated from model input | Architecture-dependent: context window minus safety instruction token count |
| R_safe | ASR within the safe range | Adversarial testing at context volumes within [C_min, C_max] |
| R_unsafe | ASR outside the safe range | Adversarial testing at D0 and D > C_max |
| Architecture class | Model context window size and attention mechanism | Model documentation |

### 3.4 Operational Controls Implied by CSOE

If the CSOE is accepted as a safety-relevant parameter, three operational controls follow:

**Control 1: Context monitoring and reset.** Deploy a context volume monitor that tracks accumulated tokens since the last safety instruction injection. When the context approaches C_max, trigger one of:
- Automatic context reset (clear and re-inject safety instructions)
- Handoff to a human supervisor
- System pause pending manual review

This is directly analogous to shift-change safety protocols in mining: at defined intervals, the operational context is reset to a known-safe state.

**Control 2: Safety instruction re-injection.** Periodically re-inject safety instructions into the context stream, maintaining the safety instructions within the model's active attention window regardless of accumulated operational context. The re-injection interval should be calibrated to ensure safety instructions remain within [C_min, C_max] of the current processing position.

**Control 3: Pre-deployment CSOE characterisation.** Before deploying an AI system in a safety-critical physical setting, characterise the CSOE through adversarial testing at multiple context volumes. Document C_min, C_max, and T_eviction. Include this characterisation in the system's risk assessment documentation.

---

## 4. Regulatory Applicability

### 4.1 Australia: WHS Obligations

Under the Model WHS Act, ss 17-19, PCBUs must ensure worker safety "so far as is reasonably practicable" (SFAIRP). The SFAIRP test considers "what the person concerned knows, or ought reasonably to know, about the hazard or risk and ways of eliminating or minimising it."

If the CSOE framework becomes part of the published research literature (via the CCS or NeurIPS submissions in progress), the existence of context-dependent safety degradation becomes something a PCBU deploying AI-enabled systems "ought reasonably to know." The availability of context monitoring and reset as a control becomes a "way of eliminating or minimising" the risk.

The NSW WHS Amendment (Digital Work Systems) Act 2026, when commenced, will require PCBUs to consider whether digital work systems create risks to workers. An AI system that operates outside its CSOE -- accumulating unbounded context without safety instruction refresh -- would constitute a foreseeable risk that the PCBU had not controlled.

### 4.2 EU: AI Act

The EU AI Act (Regulation 2024/1689), Article 9, requires risk management systems for high-risk AI that "shall identify and analyse the known and the reasonably foreseeable risks." Context-dependent safety degradation is a reasonably foreseeable risk for any high-risk AI system that processes variable-length inputs. Article 9(7) requires testing procedures that are "suitable to identify the most appropriate and targeted risk management measures." Multi-dose adversarial testing to characterise the CSOE would satisfy this requirement for context-dependent risks.

### 4.3 ISO Standards

No current ISO standard addresses context length as a safety parameter:

- **ISO 17757:2019** (autonomous mining): Functional safety framework; does not contemplate AI context management.
- **ISO 13482:2014** (personal care robots): Safety requirements for personal care robots; does not address AI behavioral variability with context.
- **ISO/IEC 42001:2023** (AI management systems): Requires risk management but does not specify context-dependent testing.

The CSOE framework could be proposed as a technical contribution to ISO/IEC JTC 1/SC 42 work items on AI robustness and testing methodology, complementing ISO/IEC 24029 (robustness of neural networks).

### 4.4 NIST AI RMF

The NIST AI Risk Management Framework (AI 100-1) identifies "MEASURE" as a core function: "employing quantitative, qualitative, or mixed-method tools, techniques, and methodologies to analyze, assess, benchmark, and monitor AI risk and related impacts." CSOE characterisation is a quantitative measurement technique for a specific, previously uncharacterised risk vector (context-dependent safety degradation). It would sit within the MEASURE function's MAP-2.3 subcategory (assessing AI system performance in context of its operational environment).

---

## 5. Research Gaps and Next Steps

### 5.1 Replication at Scale

The current CSOE data is from a single 1.5B parameter model with a 4,096-token context window. The framework requires validation across:

- **Model scales:** 7B, 13B, 70B+ models with 8K-128K+ context windows
- **Context window architectures:** Standard transformer, sliding window, retrieval-augmented generation (RAG)
- **Safety instruction positions:** System prompt, mid-context injection, multi-point injection
- **Domain contexts:** Mining operational logs, warehouse task queues, surgical procedure notes

### 5.2 Formal CSOE Testing Protocol

A standardised testing protocol for CSOE characterisation would include:

1. Define dose levels spanning 0 to 2x the model's stated context window
2. Use domain-appropriate benign context (not random text) at each dose level
3. Include n >= 20 adversarial scenarios per dose level for statistical power
4. Grade using FLIP or equivalent backward-inference methodology
5. Fit a non-linear model (e.g., cubic spline or segmented regression) to identify C_min, C_max, and inflection points
6. Report CSOE with confidence intervals

### 5.3 Integration with Existing Frameworks

The CSOE concept could be integrated into:

- **VAISS Guardrail 4** guidance as a specific testing requirement for context-dependent AI systems
- **Safe Work Australia Best Practice Review** recommendations (see our submission, Section 4.6)
- **EU AI Act** harmonised standards for high-risk AI testing methodology
- **F1-STD-001** (our proposed adversarial testing standard for embodied AI systems, Issue #383)

---

## 6. Conclusion

The Context Safety Operating Envelope is a novel framework for treating AI context length as a safety-critical deployment parameter. It is grounded in empirical data showing that safety instruction effectiveness varies non-monotonically with context volume, producing a bounded "safe operating range" that is analogous to operational envelopes in aviation, mining, and autonomous vehicle engineering. No existing regulatory framework addresses this risk vector. The CSOE framework proposes that context management -- monitoring, resetting, and characterising the context-safety relationship -- should be a standard component of risk assessment for AI systems deployed in physical workplaces.

This is an early-stage framework based on limited empirical data (n=25 traces, single model, single architecture). It requires substantial replication before it can be recommended for regulatory adoption. We present it as a research contribution to the emerging field of embodied AI safety governance, not as a validated methodology.

---

## References

1. F41LUR3-F1R57. "Safety Instruction Dilution (SID) Dose-Response Experiment." Research Report #95, 2026. Traces: `runs/sid_dose_response/`.
2. F41LUR3-F1R57. "EP-51: SID Context Truncation Artifact." Evidence Package, 2026. `docs/analysis/EP-51_sid_context_truncation.md`.
3. F41LUR3-F1R57. "SWA Best Practice Review Submission." 2026. `research/policy/swa_best_practice_review_submission.md`.
4. Work Health and Safety Act 2011 (Cth), ss 17-19.
5. Work Health and Safety Amendment (Digital Work Systems) Act 2026 (NSW), s 21A.
6. Regulation (EU) 2024/1689 (AI Act), Article 9.
7. ISO 17757:2019. Earth-moving machinery and mining -- Autonomous and semi-autonomous machine system safety.
8. ISO 13482:2014. Robots and robotic devices -- Safety requirements for personal care robots.
9. ISO/IEC 42001:2023. Artificial intelligence -- Management systems.
10. NIST. AI Risk Management Framework (AI 100-1). January 2023.
11. Department of Industry, Science and Resources. Voluntary AI Safety Standard (VAISS). September 2024.

---

*Prepared for the Failure-First Embodied AI program (failurefirst.org). For internal strategic use. This is research analysis, not legal opinion.*
