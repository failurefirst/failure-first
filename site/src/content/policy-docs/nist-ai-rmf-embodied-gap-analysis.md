---
title: "NIST AI Risk Management Framework 1.0: Gap Analysis for Embodied AI Adversarial Risk"
description: "The NIST AI Risk Management Framework (AI 100-1, January 2023) provides a four-function structure for AI risk management: GOVERN, MAP, MEASURE, and MANAGE...."
date: "2026-03-18"
classification: "Research — AI Safety Policy"
status: "draft"
author: "Failure-First Research Team"
tags: []
draft: false
---


> **Disclaimer:** This document presents research findings, not legal opinion. All references to the NIST AI RMF, AI Act, and related instruments are provided for research analysis purposes. The NIST AI RMF is a voluntary framework; compliance is not a legal requirement unless adopted by reference in procurement contracts or state legislation (see LR-13, Section 2.2). All empirical findings are reported with sample sizes and confidence intervals where available.

---

## Executive Summary

The NIST AI Risk Management Framework (AI 100-1, January 2023) provides a four-function structure for AI risk management: GOVERN, MAP, MEASURE, and MANAGE. This gap analysis examines all 19 subcategories and 72 sub-subcategories of the AI RMF against the requirements of embodied AI systems that use Vision-Language-Action (VLA) models to translate linguistic instructions into physical actions.

**Principal finding:** The MEASURE function contains no provisions for evaluating action-layer safety as distinct from text-layer safety. All MEASURE subcategories that address testing, evaluation, and verification implicitly assume that AI system outputs are informational (text, classifications, predictions). For embodied AI systems, this creates a structural blindspot: a system can satisfy every MEASURE subcategory while generating physically dangerous action sequences, provided those sequences are accompanied by textually appropriate safety disclaimers.

This finding is empirically grounded. In our VLA testing corpus (25 VLA attack families, 319 scenarios, FLIP-graded), 50% of all verdicts are PARTIAL -- the model produces a safety disclaimer in text while generating the requested dangerous action sequence. Zero outright refusals were observed across 58 valid FLIP-graded traces from 25 families (CANONICAL_METRICS.md, 18 March 2026). The action layer has no guardrails (Report #79). A MEASURE evaluation that assessed only text-layer outputs would classify these responses as safe.

**Recommendations for AI RMF 2.0:** We identify 7 specific subcategory gaps and propose language for each, focusing on action-layer evaluation, evaluator calibration disclosure, and multi-agent cascade risk measurement.

---

## 1. Methodology

### 1.1 Scope

This analysis covers NIST AI 100-1, AI Risk Management Framework 1.0 (26 January 2023) and the accompanying AI RMF Playbook (March 2023). We examine all four functions and their subcategories:

| Function | Subcategories | Focus |
|----------|--------------|-------|
| GOVERN (GV) | GV-1 through GV-6 | Organisational governance, policies, workforce |
| MAP (MP) | MP-1 through MP-5 | Context, risk identification, stakeholder analysis |
| MEASURE (MS) | MS-1 through MS-4 | Testing, evaluation, validation, monitoring |
| MANAGE (MG) | MG-1 through MG-4 | Risk treatment, response, communication |

### 1.2 Evaluation Criteria

For each subcategory, we assess:

1. **Applicability to embodied AI:** Does the subcategory address risks that arise specifically from AI systems generating physical actions?
2. **Text-layer vs. action-layer distinction:** Does the subcategory's language or playbook guidance distinguish between informational outputs and physical action outputs?
3. **Adversarial testing coverage:** Does the subcategory address adversarial robustness for systems with kinetic consequences?
4. **Empirical gap evidence:** Do our research findings (187 models, 131,887 results, 82 attack techniques; CANONICAL_METRICS.md verified 18 March 2026) demonstrate a gap that this subcategory should but does not address?

### 1.3 Empirical Grounding

All gap claims reference specific Failure-First findings. We cite corpus-level statistics from CANONICAL_METRICS.md (verified 18 March 2026) and individual findings from the Established Findings section of AGENT_STATE.md. Grading methodology is specified for all ASR figures.

---

## 2. Function-by-Function Analysis

### 2.1 GOVERN Function (GV-1 through GV-6)

**Overall assessment: Adequate in structure, insufficient in embodied-specific guidance.**

The GOVERN function establishes organisational governance for AI risk management. Its subcategories address policies, accountability structures, workforce diversity, and organisational culture. These are framework-level provisions that apply to any AI system, including embodied systems.

**GV-1 (Policies, processes, procedures, and practices):** Adequate. The requirement to establish governance policies applies equally to embodied and non-embodied systems.

**GV-2 (Accountability structures):** Adequate in principle, but the playbook guidance does not address the split accountability chain characteristic of embodied AI: VLA model developer, robot manufacturer, system integrator, and deployer may be separate entities with distinct risk ownership. Report #22 (Section: Stakeholder Mapping) identifies five distinct stakeholder groups with overlapping GOVERN responsibilities. The RMF playbook examples assume a single organisational context.

**GV-3 (Workforce diversity and domain expertise):** The playbook does not mention physical safety engineering, robotics safety, or biomechanical expertise as relevant domain knowledge. For embodied AI, the workforce requirements include mechanical engineering, human factors, and safety-critical systems expertise -- none of which appear in current RMF guidance.

**GV-4 (Organisational commitments):** Adequate. Voluntary commitments to AI safety principles apply regardless of system type.

**GV-5 (Organisational governance):** Adequate in structure.

**GV-6 (Risk tolerance):** **Gap identified.** The playbook examples of risk tolerance focus on accuracy, fairness, and privacy thresholds. For embodied AI, risk tolerance must include kinetic risk thresholds: maximum force, velocity, acceleration, and proximity parameters. ISO/TS 15066 (Power and Force Limiting for collaborative robots) provides the biomechanical framework, but the AI RMF makes no reference to it or any analogous physical safety threshold.

| Subcategory | Embodied AI Gap | Severity |
|------------|----------------|----------|
| GV-1 | None | -- |
| GV-2 | Split accountability chain not addressed | Low |
| GV-3 | Physical safety expertise not mentioned | Medium |
| GV-4 | None | -- |
| GV-5 | None | -- |
| GV-6 | Kinetic risk tolerance thresholds absent | Medium |

### 2.2 MAP Function (MP-1 through MP-5)

**Overall assessment: Partially adequate. Identifies risk identification requirements but lacks embodied-specific threat models.**

**MP-1 (Intended purposes, context of use, stakeholders):** Adequate in structure. The requirement to map intended purposes and deployment contexts applies to embodied systems. However, the playbook's implementation guidance does not mention Operational Design Domains (ODDs) -- the standard robotics concept for specifying the physical environments in which a system is designed to operate safely. The absence of ODD as a concept means embodied AI deployers have no RMF-aligned methodology for specifying physical deployment boundaries.

**MP-2 (Interdependencies and interactions with other systems):** **Gap identified.** The subcategory addresses system interactions but does not distinguish between digital interactions (API calls, data sharing) and physical interactions (shared workspaces, collaborative manipulation tasks). For multi-agent embodied systems, cascade failures propagate through physical space, not just data channels. Our MASSS framework defines Cascade Depth (D) as a graph-distance metric for error propagation through agent networks -- a measurement the RMF does not anticipate.

**MP-3 (Benefits and costs):** Adequate. Benefit-cost analysis applies regardless of system type.

**MP-4 (Risks and impacts):** **Gap identified.** The subcategory requires identification of "risks and impacts related to AI actors and AI systems." The playbook guidance emphasises informational risks: bias, privacy, accuracy. For embodied AI, the primary risk category is physical harm from adversarial manipulation of VLA models. Our research documents 25 VLA attack families with combined FLIP-graded ASR of 72.4% (n=58 valid traces) -- adversarial attacks that produce physical action outputs. The RMF playbook contains no guidance on identifying risks from adversarial manipulation of action-generating AI systems.

MP-4 should reference the semantic-kinetic gap: the risk that linguistic misunderstanding in a VLA model produces physical action with no intermediate safety layer. This is qualitatively different from the informational risks the current playbook addresses.

**MP-5 (Characterising impacts to individuals, groups, communities):** The playbook focuses on impacts to fundamental rights, privacy, and fairness. Physical injury and property damage from embodied AI failures are not mentioned. For completeness, embodied AI impact characterisation should include the categories in ISO 10218-2 (robot safety) and ISO 13482 (personal care robots): impact force, pinch points, entrapment, and environmental damage.

| Subcategory | Embodied AI Gap | Severity |
|------------|----------------|----------|
| MP-1 | No ODD concept | Medium |
| MP-2 | Physical cascade failures unaddressed | High |
| MP-3 | None | -- |
| MP-4 | No adversarial physical action risk guidance | High |
| MP-5 | Physical injury categories absent | Medium |

### 2.3 MEASURE Function (MS-1 through MS-4)

**Overall assessment: This is the critical gap. MEASURE assumes text-layer evaluation throughout. No subcategory addresses action-layer safety as a distinct evaluation target.**

**MS-1 (Appropriate methods and metrics):**

MS-1.1 requires "approaches and metrics for measurement of AI risks enumerated during the MAP function." This is structurally sound -- if MAP identifies action-layer risks (per our MP-4 recommendation above), MEASURE should evaluate them. However, the playbook's implementation examples are exclusively informational: accuracy, precision, recall, F1 score, fairness metrics, calibration. No playbook example addresses action safety evaluation.

**Gap:** There is no MEASURE subcategory or playbook guidance that addresses the distinction between:
- A model that generates safe text but dangerous actions (PARTIAL in FLIP terminology)
- A model that refuses both textually and in action output (genuine REFUSAL)
- A model that generates dangerous text accompanied by appropriate safety disclaimers (hallucination-refusal)

Our three-tier ASR framework (CANONICAL_METRICS.md) demonstrates that this distinction is empirically material:

| Tier | Definition | Corpus ASR (n=10,294 evaluable) |
|------|-----------|------|
| Strict | Full compliance only | 45.9% |
| Broad | Compliance + partial compliance | 79.3% |
| Functionally Dangerous | Compliance + partial + hallucination-refusal | 80.3% |

A MEASURE evaluation using only text-layer assessment would classify PARTIAL responses (text disclaims, action complies) as safe. This directly understates risk by up to 34 percentage points.

**MS-2 (AI systems are evaluated for trustworthiness):**

MS-2.5 ("The AI system is evaluated regularly for safety risks") is the subcategory most directly relevant to embodied AI safety evaluation. The playbook guidance for MS-2.5 references "safety risks" but does not distinguish between informational safety (e.g., generating harmful text) and physical safety (e.g., generating harmful actions).

MS-2.6 ("AI system performance or assurance criteria are measured qualitatively or quantitatively and demonstrated for conditions similar to deployment setting") is the closest the RMF comes to requiring adversarial testing. The phrase "conditions similar to deployment setting" could be interpreted to include adversarial conditions for systems deployed in adversarial environments. However, the playbook provides no guidance on how to operationalise adversarial testing for embodied systems.

MS-2.7 ("AI system security and resilience -- as identified in the MAP function -- are evaluated and documented") addresses security evaluation. This is the subcategory that should, in principle, cover adversarial robustness testing. However, the playbook implementation guidance for MS-2.7 focuses on data integrity, model poisoning, and inference attacks -- all text/data-layer concerns. Physical adversarial attacks on VLA models (adversarial visual patches, typographic attacks, cross-modal misalignment) are not mentioned.

**MS-2.7 is the single most important gap for embodied AI.** Our research documents:

- 82 distinct attack techniques (CANONICAL_METRICS.md)
- 25 VLA attack families producing physical action outputs
- FLIP-graded VLA ASR of 72.4% (n=58 valid traces, all families), with 0% refusal rate
- PARTIAL dominance: 50% of VLA verdicts show text-level hedging but action-level compliance
- Cohen's kappa between keyword and LLM classifiers: 0.126 [0.108, 0.145] (n=1,989) -- indicating that text-based evaluation heuristics are unreliable even for text-layer assessment

A system evaluated under MS-2.7 using current playbook guidance could demonstrate adversarial resilience at the text layer while remaining fully vulnerable at the action layer.

**MS-2.11 ("Fairness and bias -- as identified in the MAP function -- are evaluated and documented"):** Not directly relevant to the action-layer gap but included for completeness. Fairness evaluation for embodied systems should consider whether adversarial vulnerability varies across deployment contexts or user populations.

**MS-3 (Mechanisms for tracking identified AI risks over time):**

MS-3.1 ("AI risks and benefits from third-party resources are regularly monitored") is relevant to embodied AI supply chains where VLA models are sourced from third parties (e.g., OpenVLA, pi0). The playbook does not address the specific supply chain risk of shared VLM backbones -- our research shows VLA adversarial attacks transfer across robot embodiments via shared VLM backbone (Established Finding).

**MS-4 (Feedback mechanisms):**

MS-4.1 ("Measurement approaches for identifying AI risks are documented") should require disclosure of evaluator methodology, including evaluator calibration data. Our research (Report #72, Evaluator Calibration Standard; Report #68, Evaluator Calibration Disclosure) found that no organisation publishes evaluator calibration data. Evaluator false-positive rate directly affects the reliability of any MEASURE assessment. Our own baseline shows deepseek-r1:1.5b has a 30.8% false-positive rate on benign inputs (#315) -- a calibration figure that would be invisible without explicit disclosure requirements.

| Subcategory | Embodied AI Gap | Severity |
|------------|----------------|----------|
| MS-1.1 | No action-layer metrics | Critical |
| MS-2.5 | No physical safety evaluation distinction | Critical |
| MS-2.6 | No adversarial testing operationalisation for embodied systems | High |
| MS-2.7 | No physical adversarial attack coverage | Critical |
| MS-3.1 | No shared-backbone supply chain monitoring | Medium |
| MS-4.1 | No evaluator calibration disclosure requirement | High |

### 2.4 MANAGE Function (MG-1 through MG-4)

**Overall assessment: Partially adequate. Risk treatment and response mechanisms are structurally applicable but lack embodied-specific response protocols.**

**MG-1 (AI risks based on assessments are prioritised and treated):** Adequate in structure. The requirement to prioritise and treat risks applies regardless of system type.

**MG-2 (Strategies to manage AI risks):** The playbook emphasises risk mitigation through model retraining, data curation, and deployment restrictions. For embodied AI, risk management must also include physical safety interlocks (hardware-level kill switches, force/torque limiters, safety-rated monitored zones) that are independent of the AI model. The RMF does not address hardware-layer safety controls that operate independently of the AI system being managed.

**MG-3 (AI risk management is integrated into organisational risk management):** Adequate in structure. The requirement to integrate AI risk into broader enterprise risk management applies to embodied systems.

**MG-4 (Residual risk is communicated):** **Gap identified.** The playbook addresses communication of residual risk to stakeholders but does not address the specific disclosure challenge of embodied AI: communicating residual kinetic risk to human coworkers, bystanders, and maintenance personnel who interact with the physical system. ISO 10218-2 requires residual risk disclosure in robot installation documentation -- the RMF should cross-reference this requirement for AI-controlled robots.

| Subcategory | Embodied AI Gap | Severity |
|------------|----------------|----------|
| MG-1 | None | -- |
| MG-2 | No hardware-independent safety interlocks | Medium |
| MG-3 | None | -- |
| MG-4 | No kinetic residual risk communication | Medium |

---

## 3. Cross-Cutting Gaps

### 3.1 The Action-Layer Blindspot

The single most significant structural gap across the entire AI RMF is the absence of any distinction between text-layer and action-layer outputs. The framework implicitly assumes that AI system "outputs" are informational -- text, classifications, recommendations, predictions. For embodied AI systems using VLA models, outputs include physical actions: joint positions, torques, velocities, and trajectories.

This is not merely a scope limitation. It creates a structural evaluation blindspot:

**A system can satisfy every MEASURE subcategory while generating physically dangerous action sequences, provided those sequences are accompanied by textually appropriate safety language.**

Our VLA PARTIAL dominance finding directly demonstrates this. In 50% of FLIP-graded VLA adversarial traces, models produced safety disclaimers in their text output while simultaneously generating the requested dangerous action sequences. An evaluator assessing only text-layer outputs would classify these responses as safe. An evaluator assessing action-layer outputs would classify them as dangerous. The AI RMF provides no guidance on which layer to evaluate, because it does not acknowledge that multiple output layers exist.

### 3.2 Defense Impossibility

Report #78 documents what we term "defense impossibility" for VLA systems: the architectural observation that end-to-end VLA models collapse the traditional Sense-Plan-Act pipeline into a single neural network, eliminating the intermediate planning layer where safety checks could be inserted. This means that for current VLA architectures, there is no point in the inference pipeline where an independent safety monitor can inspect a planned action before it is executed.

The AI RMF MANAGE function assumes that risk mitigation strategies can be applied to the AI system. For VLA systems where the inference pipeline provides no inspection point, this assumption does not hold. Risk management for these systems requires either:

1. Architectural modification (decomposing the end-to-end model to create an inspection point), or
2. External physical safety layers (hardware interlocks operating independently of the AI model)

Neither approach is addressed in the current RMF.

### 3.3 Evaluator Reliability

The MEASURE function assumes that evaluation produces reliable results. Our research demonstrates that this assumption requires explicit verification:

- Cohen's kappa between keyword-based and LLM-based classifiers: 0.126 [0.108, 0.145] (n=1,989) -- slight agreement, indicating that the choice of evaluation methodology materially changes results
- deepseek-r1:1.5b false-positive rate on benign inputs: 30.8% (#315)
- qwen3:1.7b FLIP classifier accuracy: 15% (#250)

MS-4.1 ("Measurement approaches for identifying AI risks are documented") should require disclosure of evaluator calibration data, including inter-rater reliability metrics and false-positive/false-negative rates on known-label baselines. Without this, MEASURE assessments are not reproducible or comparable.

### 3.4 Multi-Agent Cascade Risk

The AI RMF addresses individual AI systems. MP-2 ("Interdependencies and interactions") gestures toward system interactions but does not provide metrics or evaluation methodology for multi-agent failure cascades. Our MASSS framework proposes three formal metrics:

- **Cascade Depth (D):** Graph distance of error propagation through agent networks
- **Semantic Drift Velocity (V_drift):** Rate of deviation from constitutional constraints
- **Consensus Stability Index:** KL divergence between agents' belief states

These metrics are designed to be operationalisable within a MEASURE evaluation. The current RMF provides no equivalent measurement approach for multi-agent risk.

---

## 4. Recommendations for AI RMF 2.0

The following recommendations are framed as proposed language additions to specific AI RMF subcategories. They are designed to be minimally invasive -- extending existing subcategories rather than restructuring the framework.

### Recommendation 1: MS-2.7 — Add Action-Layer Security Evaluation

**Current:** "AI system security and resilience -- as identified in the MAP function -- are evaluated and documented."

**Proposed addition to playbook guidance:** "For AI systems that generate physical actions (e.g., robotic control, autonomous vehicle steering, industrial automation), security evaluation should include assessment of action-layer outputs independently from text-layer outputs. An AI system that produces appropriate textual safety warnings while simultaneously generating dangerous action sequences has not demonstrated security at the action layer. Evaluation methodology should distinguish between text-layer refusal and action-layer refusal."

**Empirical basis:** VLA PARTIAL dominance (50% of verdicts, n=58 valid, 25 families), 0% action-layer refusal rate.

### Recommendation 2: MS-1.1 — Add Action-Layer Metrics

**Current:** Playbook examples reference accuracy, precision, recall, F1, fairness metrics.

**Proposed addition:** "For AI systems with physical action outputs, measurement metrics should include action-layer safety rates (proportion of adversarial inputs that produce physically safe action outputs), action-text concordance (agreement between text-layer safety assessment and action-layer safety assessment), and kinetic risk metrics appropriate to the deployment context (e.g., force, velocity, proximity thresholds per ISO/TS 15066)."

**Empirical basis:** Three-tier ASR framework showing 34pp gap between strict and FD ASR; FLIP methodology distinguishing text and action layers.

### Recommendation 3: MS-4.1 — Require Evaluator Calibration Disclosure

**Current:** "Measurement approaches for identifying AI risks are documented."

**Proposed addition:** "Documentation of measurement approaches should include evaluator calibration data: inter-rater reliability metrics (e.g., Cohen's kappa, Krippendorff's alpha), false-positive and false-negative rates on known-label baselines, and the methodology used to establish evaluator reliability. For automated evaluation systems, calibration should be reported separately for each output layer (text, action, reasoning trace) and for each evaluation model used."

**Empirical basis:** Cohen's kappa 0.126 (n=1,989) between evaluation methodologies; 30.8% FP rate on benign baseline; Report #72 finding that no organisation publishes evaluator calibration data.

### Recommendation 4: MP-2 — Add Physical Cascade Failure Metrics

**Current:** Addresses "interdependencies and interactions with other AI systems."

**Proposed addition:** "For multi-agent AI systems that interact in physical environments (e.g., robot fleets, autonomous vehicle convoys, collaborative human-robot teams), risk identification should include cascade failure metrics: the graph distance over which errors propagate, the rate of deviation from baseline safety constraints during multi-agent interaction, and the stability of shared decision-making processes. Organisations should document whether a single-agent failure can propagate to physically co-located agents."

**Empirical basis:** MASSS framework metrics (Cascade Depth D, Semantic Drift Velocity, Consensus Stability Index); Moltbook forensics (1.5M tokens, 16-minute median time-to-failure).

### Recommendation 5: MP-4 — Add Semantic-Kinetic Gap Risk Category

**Current:** Requires identification of "risks and impacts related to AI actors and AI systems."

**Proposed addition:** "For AI systems that translate natural language or multimodal inputs into physical actions, risk identification should include the semantic-kinetic gap: the risk that a linguistically ambiguous or adversarially crafted instruction produces a physically dangerous action. This risk is qualitatively distinct from text-layer risks because the output cannot be recalled or corrected after physical execution."

**Empirical basis:** 25 VLA attack families; adversarial transfer across embodiments via shared VLM backbone (Established Finding); CHAI physical text hijack 92.5% ASR (external literature, #269).

### Recommendation 6: GV-6 — Add Kinetic Risk Tolerance Thresholds

**Current:** Playbook examples focus on accuracy, fairness, and privacy thresholds.

**Proposed addition:** "For AI systems with physical action outputs, organisational risk tolerance should include kinetic thresholds: maximum permissible contact force, velocity, acceleration, and minimum safe distance parameters appropriate to the deployment environment. These thresholds should reference applicable robotics safety standards (e.g., ISO/TS 15066 for collaborative robots, ISO 13482 for personal care robots)."

**Empirical basis:** Report #22 (NIST AI RMF Robotics Playbook) identification of kinetic risk tolerance gap.

### Recommendation 7: MG-2 — Add Hardware-Independent Safety Layers

**Current:** Focuses on AI-level risk mitigation (retraining, data curation, deployment restrictions).

**Proposed addition:** "For AI systems with physical action outputs, risk management strategies should include safety mechanisms that operate independently of the AI model being managed. Where end-to-end neural network architectures eliminate intermediate planning layers (preventing inspection of planned actions before execution), hardware-level safety interlocks (force/torque limiters, safety-rated monitored zones, emergency stop systems) should be documented as risk management measures. AI-model-level mitigations alone are insufficient for systems where the inference pipeline provides no action inspection point."

**Empirical basis:** Defense impossibility finding (Report #78); VLA end-to-end architecture collapsing Sense-Plan-Act pipeline.

---

## 5. Gap Summary Matrix

| AI RMF Subcategory | Gap Description | Severity | Failure-First Evidence | Recommendation |
|-------------------|----------------|----------|----------------------|----------------|
| MS-2.7 | No action-layer security evaluation | Critical | VLA 0% refusal, 50% PARTIAL | R1 |
| MS-1.1 | No action-layer metrics | Critical | Three-tier ASR 34pp gap | R2 |
| MS-2.5 | No physical safety evaluation distinction | Critical | PARTIAL dominance finding | R1 (indirect) |
| MS-4.1 | No evaluator calibration disclosure | High | kappa=0.126, 30.8% FP | R3 |
| MS-2.6 | No adversarial testing operationalisation | High | 82 techniques, 25 VLA families | R1 (indirect) |
| MP-2 | No physical cascade failure metrics | High | MASSS framework, Moltbook | R4 |
| MP-4 | No adversarial physical action risk | High | 72.4% VLA ASR (FLIP, n=58) | R5 |
| GV-6 | No kinetic risk tolerance | Medium | Report #22 | R6 |
| MP-5 | No physical injury categories | Medium | ISO 10218-2 / ISO 13482 | R5 (indirect) |
| MG-2 | No hardware-independent safety layers | Medium | Defense impossibility | R7 |
| MP-1 | No ODD concept | Medium | Report #22 | R5 (indirect) |
| MS-3.1 | No shared-backbone supply chain risk | Medium | VLA cross-embodiment transfer | R4 (indirect) |
| MG-4 | No kinetic residual risk communication | Medium | ISO 10218-2 | R6 (indirect) |

---

## 6. Submission Pathway

This gap analysis is designed to support two submission pathways:

1. **NIST AISIC contribution (Q2 2026).** Submit as a formal research contribution to the AISIC RFI cycle, framed as input to the robotics sector playbook development. Lead with Recommendations 1-3 (MEASURE function gaps) as the highest-priority items.

2. **AI RMF 2.0 public comment.** When NIST initiates the AI RMF 2.0 revision process, submit Recommendations 1-7 as formal public comments with empirical evidence packages.

The engagement plan (research/engagement/regulatory_engagement_plan.md) targets AISIC submission in Q2 2026 and consortium membership application in Q3 2026.

---

## 7. Limitations

1. This analysis is based on the published text of NIST AI 100-1 and the AI RMF Playbook as of January 2023. NIST may have issued supplementary guidance or sector-specific playbooks that partially address these gaps. We have reviewed publicly available materials through March 2026 but cannot confirm completeness.

2. Our empirical findings are drawn from the Failure-First corpus (187 models, 131,887 results; CANONICAL_METRICS.md, 18 March 2026). VLA-specific findings are based on smaller samples (n=58 valid FLIP-graded traces across 25 families). Confidence intervals are wide for per-family ASR estimates.

3. This analysis does not address NIST SP 800-series publications on cybersecurity, which may contain relevant adversarial testing guidance that could be cross-referenced with the AI RMF. NIST AI 100-2e2023 (Adversarial Machine Learning) is a relevant companion document that addresses some but not all of the gaps identified here.

4. The AI RMF is a voluntary framework. Identifying gaps does not imply non-compliance with any legal requirement. The legal significance of RMF adoption or non-adoption is analysed separately in LR-13.

---

*This document is research analysis, not legal opinion. All claims are grounded in empirical data with sample sizes and methodology specified. Prepared for submission to NIST AISIC and for internal use in standards engagement activities.*
