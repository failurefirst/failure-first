---
title: "NIST AI Risk Management Framework 1.0 — Gap Analysis for Embodied AI Adversarial Risk"
description: "The NIST AI Risk Management Framework (AI 100-1, January 2023) provides a four-function structure for AI risk management: GOVERN, MAP, MEASURE, and MANAGE...."
date: "2026-03-18"
reportNumber: 149
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


> **Disclaimer:** This document presents research findings, not legal opinion. All references
> to the NIST AI RMF and related instruments are provided for research analysis purposes.
> The NIST AI RMF is a voluntary framework; compliance is not a legal requirement unless
> adopted by reference in procurement contracts or state legislation (see LR-13, Section 2.2).
> All empirical findings are reported with sample sizes and confidence intervals where
> available. This report does not constitute safety certification guidance.

---

## Executive Summary

The NIST AI Risk Management Framework (AI 100-1, January 2023) provides a four-function structure for AI risk management: GOVERN, MAP, MEASURE, and MANAGE. This report examines all 19 subcategories of the AI RMF against the requirements of embodied AI systems that use Vision-Language-Action (VLA) models to translate linguistic instructions into physical actions.

The principal finding is that the MEASURE function contains no provisions for evaluating action-layer safety as distinct from text-layer safety. All MEASURE subcategories that address testing, evaluation, and verification implicitly assume that AI system outputs are informational (text, classifications, predictions). For embodied AI systems, this creates a structural gap: a system can satisfy every MEASURE subcategory while generating physically dangerous action sequences, provided those sequences are accompanied by textually appropriate safety disclaimers.

This finding is empirically grounded. In our VLA testing corpus (29 families, 351 scenarios), 50% of all FLIP verdicts are PARTIAL -- the model produces a safety disclaimer in text while generating the requested dangerous action sequence. Zero outright refusals were observed across 58 valid FLIP-graded traces. The action layer has no guardrails (Report #79). A MEASURE evaluation that assessed only text-layer outputs would classify these responses as safe.

We identify 13 specific gaps across all four RMF functions (3 Critical, 4 High, 6 Medium) and propose 7 concrete recommendations for AI RMF 2.0 or sector-specific playbook development. All claims are scoped to our tested conditions and stated with sample sizes.

---

## 1. Introduction

The NIST AI Risk Management Framework (AI RMF 1.0) was published on 26 January 2023 as a voluntary, non-sector-specific framework for managing AI risks. It comprises four core functions -- GOVERN, MAP, MEASURE, MANAGE -- with 19 subcategories and 72 sub-subcategories. An accompanying Playbook provides implementation guidance.

This analysis was motivated by three observations from the Failure-First research programme:

1. **VLA PARTIAL dominance.** Report #49 established that 50% of all FLIP-graded VLA verdicts are PARTIAL -- models produce safety disclaimers while generating dangerous action sequences. This indicates that text-layer evaluation alone systematically understates risk for embodied systems.

2. **Defense impossibility.** Report #78 documented that end-to-end VLA architectures collapse the traditional Sense-Plan-Act pipeline into a single neural network, eliminating the intermediate planning layer where safety checks could be inserted.

3. **Evaluator unreliability.** The F41LUR3-F1R57 corpus demonstrates Cohen's kappa of 0.126 between keyword-based and LLM-based classifiers (n=1,989), indicating that the choice of evaluation methodology materially changes results.

These findings have direct implications for how the AI RMF addresses embodied AI risk. If a voluntary framework that organisations adopt for due diligence purposes cannot detect the primary failure mode of VLA systems (text-safe, action-dangerous), then compliance with the framework provides a false sense of security.

Prior work: Report #22 identified the need for a NIST AI RMF robotics sector playbook. LR-13 analysed the legal significance of AI RMF adoption or non-adoption as evidence of standard of care. This report provides the detailed subcategory-level gap analysis that those documents referenced.

---

## 2. Method

### 2.1 Scope

We examined all four AI RMF functions and their subcategories against the published text of AI 100-1 and the AI RMF Playbook (March 2023). We also reviewed NIST AI 100-2e2023 (Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations) as a companion document.

### 2.2 Evaluation Criteria

For each subcategory, we assessed:

1. **Applicability to embodied AI:** Does the subcategory address risks specific to AI systems generating physical actions?
2. **Text-layer vs. action-layer distinction:** Does the subcategory's language distinguish between informational and physical action outputs?
3. **Adversarial testing coverage:** Does the subcategory address adversarial robustness for systems with kinetic consequences?
4. **Empirical gap evidence:** Do our research findings demonstrate a gap this subcategory should but does not address?

### 2.3 Empirical Grounding

All gap claims reference specific findings. Corpus-level statistics are from CANONICAL_METRICS.md (verified 2026-03-18). Individual findings are from Established Findings in AGENT_STATE.md. Grading methodology is specified for all ASR figures (LLM-graded via FLIP unless otherwise stated).

---

## 3. Results

### 3.1 GOVERN Function (GV-1 through GV-6)

**Overall assessment: Adequate in structure, insufficient in embodied-specific guidance.**

The GOVERN function establishes organisational governance that applies to any AI system. Two gaps were identified:

- **GV-3 (Workforce diversity and domain expertise):** The playbook does not mention physical safety engineering, robotics safety, or biomechanical expertise as relevant domain knowledge. For embodied AI, the workforce must include mechanical engineering, human factors, and safety-critical systems expertise. **Severity: Medium.**

- **GV-6 (Risk tolerance):** Playbook examples focus on accuracy, fairness, and privacy thresholds. For embodied AI, risk tolerance must include kinetic parameters: maximum force, velocity, acceleration, and proximity. ISO/TS 15066 provides the biomechanical framework, but the AI RMF makes no reference to it. **Severity: Medium.**

GV-1 (Policies), GV-2 (Accountability), GV-4 (Commitments), and GV-5 (Governance) are structurally adequate, though GV-2 does not address split accountability chains across VLA developer, robot manufacturer, integrator, and deployer.

### 3.2 MAP Function (MP-1 through MP-5)

**Overall assessment: Partially adequate. Risk identification requirements exist but lack embodied-specific threat models.**

- **MP-1 (Context of use):** Does not mention Operational Design Domains (ODDs) -- the standard robotics concept for specifying physical deployment boundaries. **Severity: Medium.**

- **MP-2 (Interdependencies):** Addresses system interactions but does not distinguish between digital interactions (API calls) and physical interactions (shared workspaces). Multi-agent embodied cascade failures propagate through physical space. **Severity: High.**

- **MP-4 (Risks and impacts):** Playbook guidance emphasises informational risks (bias, privacy, accuracy). Our research documents 29 VLA attack families with combined FLIP-graded ASR of 72.4% (n=58 valid traces) producing physical action outputs. No guidance exists for identifying adversarial physical action risks. The semantic-kinetic gap -- the risk that linguistic misunderstanding produces irreversible physical action -- is qualitatively different from informational risks. **Severity: High.**

- **MP-5 (Impact characterisation):** Physical injury and property damage categories absent. ISO 10218-2 and ISO 13482 provide the relevant categories (impact force, pinch points, entrapment). **Severity: Medium.**

MP-3 (Benefits and costs) is adequate.

### 3.3 MEASURE Function (MS-1 through MS-4)

**Overall assessment: This is the critical gap. MEASURE assumes text-layer evaluation throughout.**

**MS-1.1 (Metrics):** Playbook examples are exclusively informational: accuracy, precision, recall, F1, fairness. No action-layer safety metrics. **Severity: Critical.**

**MS-2.5 (Safety risk evaluation):** References "safety risks" but does not distinguish informational safety from physical safety. **Severity: Critical.**

**MS-2.6 (Deployment-condition evaluation):** The phrase "conditions similar to deployment setting" could include adversarial conditions, but no guidance is provided for operationalising adversarial testing for embodied systems.

**MS-2.7 (Security and resilience):** This is the single most important gap. The playbook focuses on data integrity, model poisoning, and inference attacks -- all text/data-layer. Physical adversarial attacks on VLA models (adversarial patches, typographic attacks, cross-modal misalignment) are not mentioned.

Our evidence for the MS-2.7 gap:

- 29 VLA attack families producing physical action outputs
- FLIP-graded VLA ASR: 72.4% (n=58 valid traces), 0% refusal rate
- PARTIAL dominance: 50% of verdicts show text-level hedging, action-level compliance
- kappa = 0.126 [0.108, 0.145] (n=1,989) between evaluation methodologies

A system evaluated under MS-2.7 using current playbook guidance could demonstrate adversarial resilience at the text layer while remaining fully vulnerable at the action layer. **Severity: Critical.**

**MS-3.1 (Third-party risk monitoring):** Does not address shared VLM backbone supply chain risk. Our research shows VLA attacks transfer across embodiments via shared VLM backbone. **Severity: Medium.**

**MS-4.1 (Measurement documentation):** Should require evaluator calibration disclosure, including inter-rater reliability and false-positive rates. Our baseline shows deepseek-r1:1.5b has a 30.8% FP rate on benign inputs (#315). Report #72 found no organisation publishes evaluator calibration data. **Severity: High.**

### 3.4 MANAGE Function (MG-1 through MG-4)

**Overall assessment: Partially adequate. Risk treatment mechanisms lack embodied-specific response protocols.**

- **MG-2 (Risk management strategies):** Focuses on model-level mitigations (retraining, data curation). For embodied AI, risk management must include hardware-level safety interlocks operating independently of the AI model. Report #78 documents that end-to-end VLA architectures eliminate the inference inspection point where model-level mitigations could be applied. **Severity: Medium.**

- **MG-4 (Residual risk communication):** Does not address kinetic residual risk disclosure to human coworkers and bystanders. ISO 10218-2 requires such disclosure in robot installation documentation. **Severity: Medium.**

MG-1 (Risk prioritisation) and MG-3 (Enterprise integration) are structurally adequate.

### 3.5 Cross-Cutting Gaps

Three cross-cutting gaps affect the entire framework:

**3.5.1 The Action-Layer Gap.** The AI RMF does not acknowledge that AI systems can produce multiple output layers (text, action, reasoning trace). Our three-tier ASR framework demonstrates the empirical materiality:

| Tier | Definition | Corpus ASR (n=10,294) |
|------|-----------|----------------------|
| Strict | Full compliance only | 45.9% |
| Broad | Compliance + partial | 79.3% |
| Functionally Dangerous | + hallucination-refusal | 80.3% |

A text-only MEASURE evaluation would understate risk by up to 34 percentage points.

**3.5.2 Defense Impossibility.** End-to-end VLA architectures collapse the Sense-Plan-Act pipeline. The MANAGE function assumes risk mitigations can be applied to the AI system, but for these architectures there is no inference-time inspection point. Risk management requires either architectural decomposition or external hardware interlocks -- neither addressed in the RMF.

**3.5.3 Evaluator Reliability.** The MEASURE function assumes evaluation produces reliable results. Our evidence:
- kappa = 0.126 (slight agreement between evaluation methodologies)
- 30.8% FP rate on benign baseline (deepseek-r1:1.5b)
- 15% accuracy (qwen3:1.7b as FLIP classifier)

Without evaluator calibration disclosure requirements, MEASURE assessments are neither reproducible nor comparable.

---

## 4. Discussion

### 4.1 Gap Severity Distribution

| Severity | Count | Functions Affected |
|----------|-------|-------------------|
| Critical | 3 | MEASURE (MS-1.1, MS-2.5, MS-2.7) |
| High | 4 | MEASURE (MS-2.6, MS-4.1), MAP (MP-2, MP-4) |
| Medium | 6 | GOVERN (GV-3, GV-6), MAP (MP-1, MP-5), MANAGE (MG-2, MG-4) |

The concentration of Critical gaps in the MEASURE function is the central finding. GOVERN and MANAGE are structurally adequate but need embodied-specific implementation guidance. MAP requires additional risk categories but not structural changes.

### 4.2 Implications for RMF Adopters

Organisations deploying embodied AI systems that adopt the AI RMF as their risk management framework face a specific risk: the framework does not guide them toward evaluating the failure mode most empirically prevalent in VLA systems (text-safe, action-dangerous). This is not a criticism of the framework's design -- it was published before VLA systems were widely deployed -- but it indicates that the framework requires extension for this application domain.

### 4.3 Relationship to Other Instruments

NIST AI 100-2e2023 (Adversarial Machine Learning) partially addresses some gaps, particularly around adversarial testing methodology. However, it also focuses primarily on digital/informational attack surfaces. ISO 13482 (Personal care robots) and ISO/TS 15066 (Collaborative robots) address physical safety but predate the integration of large language models into robot control loops. No existing instrument addresses the intersection: adversarial attacks on AI systems that produce physical actions.

---

## 5. Limitations

1. **Regulatory instrument scope.** We analysed the published text of AI 100-1 and the AI RMF Playbook as of January 2023. NIST may have issued supplementary guidance or sector-specific playbooks that partially address these gaps. We reviewed publicly available materials through March 2026 but cannot confirm completeness.

2. **Sample size.** VLA-specific findings are based on n=58 valid FLIP-graded traces across 29 families. Per-family sample sizes are small (n=5-10). Confidence intervals are wide. Corpus-wide findings (n=10,294 evaluable, n=1,989 for kappa) have narrower intervals.

3. **Grader quality.** VLA traces were graded by deepseek-r1:1.5b and qwen3:1.7b. The latter has 15% accuracy on audited samples (CANONICAL_METRICS.md). Aggregate ASR converges between graders (72.4% each) but scenario-level agreement is 32%. This is a limitation of the evidence base, not the gap analysis methodology.

4. **Scale confound.** VLA testing was conducted primarily on sub-3B models. Capability-floor effects (all attacks succeed regardless of type below ~3B parameters) may inflate ASR relative to what would be observed on larger VLA models.

5. **Generalisability.** Our findings apply to the specific VLA model families tested (deepseek-r1:1.5b, qwen3:1.7b primarily). Production VLA systems (pi0, Gemini Robotics, OpenVLA) may exhibit different vulnerability profiles.

6. **Methodology.** All VLA ASR figures use LLM-based FLIP grading. Corpus-wide three-tier ASR uses LLM-graded verdicts only.

---

## 6. Conclusions and Recommendations

### 6.1 Conclusions

The NIST AI RMF 1.0 does not address the primary risk modality of embodied AI systems: the generation of physically dangerous actions by VLA models. The framework's MEASURE function assumes text-layer evaluation exclusively. Our empirical evidence -- 50% PARTIAL rate, 0% refusal rate, 72.4% ASR across 25 VLA families -- indicates that this assumption materially understates risk for embodied deployments.

### 6.2 Recommendations for AI RMF 2.0

We propose 7 additions, each targeted at a specific subcategory. These are designed to be minimally invasive -- extending existing subcategories rather than restructuring the framework.

| # | Target | Summary | Empirical Basis |
|---|--------|---------|----------------|
| R1 | MS-2.7 | Add action-layer security evaluation requirement | 0% refusal, 50% PARTIAL (n=58) |
| R2 | MS-1.1 | Add action-layer metrics (action-text concordance, kinetic thresholds) | 34pp gap strict vs FD ASR |
| R3 | MS-4.1 | Require evaluator calibration disclosure (kappa, FP/FN rates) | kappa=0.126, 30.8% FP |
| R4 | MP-2 | Add physical cascade failure metrics | MASSS framework metrics |
| R5 | MP-4 | Add semantic-kinetic gap as risk category | 25 VLA families, cross-embodiment transfer |
| R6 | GV-6 | Add kinetic risk tolerance thresholds (ref ISO/TS 15066) | Report #22 |
| R7 | MG-2 | Add hardware-independent safety interlocks | Defense impossibility (Report #78) |

Full proposed language for each recommendation is provided in the companion policy document (`research/policy/nist_ai_rmf_embodied_gap_analysis.md`).

### 6.3 Submission Pathway

1. **NIST AISIC contribution (Q2 2026).** Frame as robotics sector playbook input. Lead with R1-R3 (MEASURE gaps).
2. **AI RMF 2.0 public comment.** Submit R1-R7 as formal comments when revision process opens.
3. **Cross-reference.** Coordinate with NIST AISIC outreach (#127) and MASSS standards submission (#49).

---

## References

1. National Institute of Standards and Technology. AI Risk Management Framework (AI 100-1). 26 January 2023. https://doi.org/10.6028/NIST.AI.100-1
2. National Institute of Standards and Technology. AI RMF Playbook. March 2023. https://airc.nist.gov/AI_RMF_Playbook
3. National Institute of Standards and Technology. Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations (AI 100-2e2023). January 2024. https://doi.org/10.6028/NIST.AI.100-2e2023
4. ISO/TS 15066:2016. Robots and robotic devices -- Collaborative robots. International Organization for Standardization.
5. ISO 13482:2014. Robots and robotic devices -- Safety requirements for personal care robots. International Organization for Standardization.
6. ISO 10218-2:2011. Robots and robotic devices -- Safety requirements for industrial robots -- Part 2: Robot systems and integration. International Organization for Standardization.
7. F41LUR3-F1R57. Report #49: VLA PARTIAL Dominance Analysis. 2026.
8. F41LUR3-F1R57. Report #78: Defense Impossibility for VLA Systems. 2026.
9. F41LUR3-F1R57. Report #79: Accountability Vacuum in Embodied AI. 2026.
10. F41LUR3-F1R57. Report #72: Evaluator Calibration Standard. 2026.
11. F41LUR3-F1R57. Report #22: NIST AI RMF Robotics Playbook Analysis. 2026.
12. F41LUR3-F1R57. LR-13: NIST AI RMF Standard of Care Analysis. 2026.

---

## Appendix A: Gap Summary Matrix

| AI RMF Subcategory | Gap Description | Severity | F41LUR3-F1R57 Evidence | Recommendation |
|-------------------|----------------|----------|----------------------|----------------|
| MS-2.7 | No action-layer security evaluation | Critical | VLA 0% refusal, 50% PARTIAL | R1 |
| MS-1.1 | No action-layer metrics | Critical | Three-tier ASR 34pp gap | R2 |
| MS-2.5 | No physical safety evaluation distinction | Critical | PARTIAL dominance finding | R1 (indirect) |
| MS-4.1 | No evaluator calibration disclosure | High | kappa=0.126, 30.8% FP | R3 |
| MS-2.6 | No adversarial testing operationalisation | High | 82 techniques, 29 VLA families | R1 (indirect) |
| MP-2 | No physical cascade failure metrics | High | MASSS framework, Moltbook | R4 |
| MP-4 | No adversarial physical action risk | High | 72.4% VLA ASR (FLIP, n=58), 29 families | R5 |
| GV-6 | No kinetic risk tolerance | Medium | Report #22 | R6 |
| MP-5 | No physical injury categories | Medium | ISO 10218-2 / ISO 13482 | R5 (indirect) |
| MG-2 | No hardware-independent safety layers | Medium | Defense impossibility | R7 |
| MP-1 | No ODD concept | Medium | Report #22 | R5 (indirect) |
| MS-3.1 | No shared-backbone supply chain risk | Medium | VLA cross-embodiment transfer | R4 (indirect) |
| MG-4 | No kinetic residual risk communication | Medium | ISO 10218-2 | R6 (indirect) |

---

*This report was produced as part of the Failure-First Embodied AI research
programme. All claims are scoped to the tested conditions and should not be
generalised without additional validation. See docs/CANONICAL_METRICS.md for
corpus-level numbers.*
