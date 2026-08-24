---
title: "F1-STD-001: Safety Evaluation of AI Systems with Physical Actuation Capabilities"
description: "F1-STD-001 v0.2 — Committee Draft. Safety evaluation requirements for AI systems that generate outputs decoded into physical actions. A research-backed voluntary standard proposed for multi-stakeholder development; not legal advice."
date: 2026-03-25
classification: "Standards Development — External-Facing (suitable for standards body engagement)"
status: complete
draft: false
---

**Document identifier:** F1-STD-001 v0.2
**Date:** 2026-03-25
**Status:** Committee Draft (internal)
**Prepared by:** Martha Jones, Policy & Standards Lead, Failure-First Embodied AI
**Target standards bodies:** ISO/IEC JTC 1/SC 42 (via Standards Australia IT-043), CEN/CENELEC JTC 21, NIST AISIC
**Related instruments:** ISO 10218-1:2025, ISO 10218-2:2025, ISO/TS 15066:2016, ISO 13482:2014, ISO 17757:2019, ISO/IEC 42001:2023, ISO/IEC 23894:2023, NIST AI 100-1 (AI RMF 1.0), Regulation (EU) 2024/1689 (EU AI Act)
**Related Failure-First reports:** #48, #49, #51, #59, #63, #78, #95, #117, #122, #135, #136, #140, #148, #170, #190, #238, #239, #240, #242, #243, #244, #248, #251
**Classification:** External-facing (suitable for standards body engagement)
**Issue:** #383
**Changes from v0.1:** Added 3 attack families (CCA, RSE, GE) to Annex B; added R8 (mandatory grader calibration disclosure); added R9 (benchmark contamination testing); added R10 (multi-grader ensemble for publication-grade results); updated corpus metrics to then-current canonical values (207 models, 133,722 results as of 2026-03-25; superseded — see v0.3 and CANONICAL_METRICS.md); added self-inoculation defense recommendation (Section 4.7); incorporated Epistemic Crisis and Qwen3 grader findings

---

> **Disclaimer:** This document presents research findings structured as draft standards language. It does not constitute legal advice or legal opinion. It has not been adopted by any standards body. Organisations should engage qualified legal counsel for jurisdiction-specific compliance guidance.

---

## Foreword

This document specifies requirements for the safety evaluation of AI systems that generate outputs decoded into physical actions by robotic or autonomous hardware ("embodied AI systems"). It is intended to complement existing mechanical and functional safety standards for robots and autonomous machinery by addressing the AI planning and decision layer, which those standards do not cover.

The requirements in this document are derived from empirical testing conducted under the Failure-First Embodied AI programme: 207 models (195 with results), 133,722 evaluation results, 33 VLA attack families, 440 adversarial scenarios, and 143 documented attack techniques (see Annex A for empirical basis, all figures from CANONICAL_METRICS.md verified 2026-03-25). They address three documented failure modes that existing evaluation methodologies do not detect:

1. Text-output safety filters do not prevent action-output attacks. In tested VLA systems, 50% of FLIP-graded traces produced safety disclaimers in text while simultaneously generating the requested harmful action sequence (Report #49).
2. In tested VLA systems, zero action-output refusal mechanisms were observed across 63 valid traces spanning 7 attack families (Report #49).
3. In tested configurations, automated evaluators did not reliably distinguish safe from unsafe embodied AI interactions. The best available small-model evaluator (1.5B parameters) classified 56% of adversarial VLA traces as SAFE (Report #76, Issue #359).

This document does not replace ISO 10218 (industrial robot safety), ISO 13482 (personal care robot safety), ISO 17757 (autonomous machinery safety), ISO/TS 15066 (collaborative robot safety), or any sector-specific safety standard. It specifies additional evaluation requirements for the AI decision layer that operates within systems already subject to those standards.

---

## 1. Scope

This document specifies requirements for evaluating the safety of AI systems that:

a) receive natural language, visual, or multimodal inputs;
b) generate outputs that are decoded into physical actions executed by robotic or autonomous hardware; and
c) operate in environments where humans may be present or affected by the system's physical actions.

This document applies to:

- Pre-deployment safety evaluation (conformity assessment, type testing)
- Periodic re-evaluation after model updates, fine-tuning, or deployment context changes
- Continuous monitoring of deployed systems
- Third-party safety auditing and red-team assessment

This document does not apply to:

- AI systems whose outputs are exclusively informational (text, classification, prediction) with no physical actuation
- Physical safety engineering of robotic hardware (covered by ISO 10218, ISO 13482, ISO 17757)
- Functional safety of electrical/electronic systems (covered by IEC 61508, ISO 26262)
- Cybersecurity of AI systems (covered in part by ISO/IEC 27001 with AI-specific extensions)

NOTE: Systems that combine informational and physical outputs are within scope for the physical output evaluation. The informational output evaluation may use existing text-output benchmarks.

---

## 2. Normative References

The following documents are referred to in the text in such a way that some or all of their content constitutes requirements of this document:

- ISO/IEC 42001:2023, *Artificial intelligence -- Management system*
- ISO/IEC 23894:2023, *Artificial intelligence -- Guidance on risk management*
- ISO 10218-1:2025, *Robotics -- Safety requirements for robot systems and integration -- Part 1: Robots*
- ISO 10218-2:2025, *Robotics -- Safety requirements for robot systems and integration -- Part 2: Industrial robot systems, robot applications and robot cells*
- ISO/TS 15066:2016, *Robots and robotic devices -- Collaborative robots*
- ISO 13482:2014, *Robots and robotic devices -- Safety requirements for personal care robots*
- ISO 17757:2019, *Earth-moving machinery and mining -- Autonomous and semi-autonomous machine system safety*
- IEC 61508:2010, *Functional safety of electrical/electronic/programmable electronic safety-related systems*

NOTE: NIST AI 100-1 (AI RMF 1.0) and Regulation (EU) 2024/1689 (EU AI Act) are referenced in Annex C as informative context. They are not normative standards in the ISO/IEC sense and are listed in the Bibliography rather than in this normative references clause.

---

## 3. Terms and Definitions

For the purposes of this document, the following terms and definitions apply.

### 3.1 action output modality
the set of output tokens from an embodied AI system that are decoded into motor commands, trajectory plans, or physical manipulation sequences

NOTE: In modern VLA architectures (e.g., RT-2, OpenVLA, Pi-0), action tokens and text tokens are generated by the same autoregressive model trunk using different vocabulary segments. "Action output modality" refers to the semantic interpretation of these tokens, not a structurally distinct computational sub-network.

### 3.2 action-output safety
the property of an action sequence being safe for execution in the physical environment, considering environmental state, human presence, material properties, and applicable safety standards for the deployment domain

### 3.3 action-text decoupling
the empirically observed phenomenon where an AI system's text output modality contains safety-relevant information (disclaimers, warnings, refusals) while the same inference pass produces action output tokens that, if executed, would cause harm

NOTE: This phenomenon was observed in 50% of FLIP-graded VLA traces (n=58 valid, 7 families). See Annex A, Section A.2.

### 3.4 adversarial evaluation
systematic testing of an AI system using inputs specifically designed to induce unsafe behaviour, including but not limited to prompt injection, format-lock attacks, multi-turn escalation, semantically benign attacks, compositional attacks, and context-dependent attacks

### 3.5 attack family
a category of adversarial input that exploits a common mechanism or vulnerability class, as enumerated in Annex B

### 3.6 attack success rate (ASR)
the proportion of adversarial test inputs that result in the system producing an unsafe output, expressed as a percentage with the denominator (total adversarial inputs) and verdict methodology (LLM-graded, heuristic, FLIP) specified

### 3.7 compositional safety testing
evaluation of whether individually safe sub-actions, when composed into a multi-step sequence, produce unsafe compound outcomes

NOTE: This addresses attacks where each sub-instruction is benign in isolation but the combined sequence is harmful. Blindfold (arXiv:2603.01414) achieved 93.2% ASR on GPT-4o using this approach.

### 3.8 embodied AI system
an AI system that receives multimodal inputs and generates outputs decoded into physical actions executed by robotic or autonomous hardware in environments where humans may be present or affected

### 3.9 evaluator calibration
the measured accuracy, false positive rate, and false negative rate of an automated evaluator used to grade AI system outputs for safety, computed against a human-validated reference set appropriate to the deployment domain

### 3.10 FLIP (Failure-Level Inference Protocol)
an evaluation methodology that infers the purpose of an AI system's output through backward inference (what instruction would produce this output?) and judges the inferred instruction for safety, rather than judging the output directly

### 3.11 iatrogenic attack surface
a vulnerability in an AI system that exists only because a safety mechanism was deployed, such that the vulnerability would not exist without the safety intervention

NOTE: Four empirically grounded instances are documented in Report #136: detection-masking (PARTIAL verdicts obscure harmful compliance), phantom safety recovery (safety-like text re-emerges at scale without behavioural safety), attention displacement (safety instructions diluted by operational context), and format-lock exploitation (format compliance bypasses safety reasoning).

### 3.12 IDDL (Inverse Difficulty-Defence Landscape)
the empirically observed pattern where attack families that are harder for evaluators to detect (lower evaluator accuracy) also have higher attack success rates (higher ASR), creating an inverse relationship between evaluation difficulty and defence effectiveness

NOTE: VLA-only IDDL rho = -0.698 (n=16, excluding DLA counter-example; confirmed reproducible in CCS submission bundle v6). The implication is that the attacks most likely to succeed are also the ones least likely to be caught by automated evaluation.

### 3.13 PARTIAL verdict
a classification of an AI system response where the text output modality contains safety-relevant hedging (disclaimers, warnings, conditional compliance) while the action output modality generates the requested action sequence

NOTE: The text-output hedging does not prevent execution of the action sequence in current VLA architectures. The normative classification of PARTIAL verdicts as safety failures is specified in 5.1.4.

### 3.14 physical context
the specification of environmental state relevant to safety evaluation, including but not limited to: object locations and properties, spatial layout, human positions and states, material properties, and applicable domain safety constraints

### 3.15 semantically benign attack (SBA)
an attack where the instruction text contains no adversarial or harmful content, and the danger arises from the physical context in which the instruction is executed

NOTE: SBA attacks cannot be detected by text-output safety evaluation because the text input and text output are both benign.

### 3.16 text output modality
the set of output tokens from an embodied AI system that are decoded into natural language text, including descriptions, explanations, safety disclaimers, and refusals

### 3.17 TI-S (Therapeutic Index of AI Safety)
the ratio of harm-layer benefit to harm-layer cost for a given safety intervention applied to a given embodied AI system

NOTE: Formally, TI-S(I, S) = B_h(I, S) / C_h(I, S), where B_h is the measurable reduction in physical-harm risk at the action layer attributable to the intervention, and C_h is the total iatrogenic cost at the action/deployment layer (Report #135). TI-S > 1.0 indicates net benefit; TI-S < 1.0 indicates net harm; TI-S = 1.0 indicates the intervention is neutral. TI-S is a theoretical framework; specific values are illustrative estimates pending validated harm-layer measurement tools.

### 3.18 vision-language-action (VLA) model
a neural network model that accepts visual and/or linguistic inputs and generates action tokens or action plans for physical execution by robotic hardware

---

## 4. General Principles

### 4.1 Primacy of Action-Layer Evaluation

The safety of an embodied AI system SHALL be assessed primarily at the action output modality. Text-output safety evaluation alone is insufficient for systems with physical actuation capabilities.

RATIONALE: Text-layer and action-output safety are empirically decoupled (see 3.3). A system that produces safe text and unsafe actions is an unsafe system.

### 4.2 Physical Context Dependency

Safety evaluation of embodied AI systems SHALL include specification of the physical context in which actions would be executed. The same instruction may be safe in one physical context and dangerous in another.

RATIONALE: Semantically benign attacks (3.15) produce harmful outcomes from physically contextual factors invisible to text-output evaluation.

### 4.3 Evaluator Accountability

Automated evaluators used for safety assessment SHALL have documented calibration data, including accuracy, false positive rate, and false negative rate, computed against a human-validated reference set appropriate to the deployment domain.

RATIONALE: The best available small-model evaluator (1.5B parameters) showed false positive rates of 30.8% on benign inputs and classified 56% of adversarial VLA traces as SAFE (see Annex A, Section A.4). Uncalibrated evaluators produce unreliable safety assessments.

### 4.4 Domain Relevance

Safety evaluation criteria SHALL be derived from or traceable to domain-specific safety standards applicable to the deployment context. General-purpose AI safety criteria are necessary but not sufficient.

### 4.5 Adversarial Robustness

Safety evaluation SHALL include adversarial testing that represents the attack techniques applicable to the system architecture. Evaluation using only benign or cooperative inputs is insufficient.

### 4.6 Iatrogenic Awareness

Safety interventions SHALL be evaluated for iatrogenic effects -- harms caused by the safety mechanism itself. The deploying organisation SHALL consider whether the intervention produces net benefit at the harm layer, not solely at the text layer.

RATIONALE: At least four classes of iatrogenic attack surface have been empirically documented (Report #136). Safety training that optimises for text-layer signals can produce the appearance of safety without reducing action-layer risk. Alignment interventions have been shown to reverse direction under certain conditions (Fukui 2026, arXiv:2603.04904).

### 4.7 Self-Inoculation as a Defense Property

Safety evaluation SHOULD consider whether the system under test exhibits self-inoculation -- the empirically observed phenomenon where requiring a model to engage in explicit safety reasoning about a harmful request reduces subsequent compliance with that request, rather than increasing it.

RATIONALE: Recursive Safety Exhaustion (RSE) testing (Report #238) found that cascade amplification is negative on models above the capability floor: forcing models through multiple rounds of safety reasoning before a harmful request reduces, rather than increases, compliance. Qwen3.5 397B showed 7.1% corrected ASR despite 397B parameters, compared to Nemotron 230B at 78.6%, with the difference attributable to safety methodology rather than scale. This finding suggests that evaluation protocols that include explicit safety reasoning steps may inadvertently strengthen the system's safety response -- a form of iatrogenic benefit. Evaluators SHOULD assess whether their evaluation protocol itself induces self-inoculation effects that would not be present in production deployment.

NOTE: Self-inoculation is preliminary (Report #238, n=5 per condition). It is presented as a property to test for, not a confirmed defense mechanism. The relationship between self-inoculation and the DETECTED_PROCEEDS pattern (where safety reasoning precedes harmful compliance rather than preventing it) requires further investigation.

---

## 5. Evaluation Requirements

### 5.1 R1: Multi-Layer Evaluation (Text + Action Layer)

#### 5.1.1 General

Before an embodied AI system is deployed in an environment where humans may be present or affected, the deploying organisation SHALL conduct a safety evaluation that independently assesses both the text output modality and the action output modality.

#### 5.1.2 Two-Layer Evaluation Procedure

Each scenario response SHALL be evaluated at both layers:

a) **Text-layer evaluation:** the text output is assessed for harmful content, safety refusals, disclaimers, and compliance with text-output safety criteria;
b) **Action-layer evaluation:** the action output (trajectory, motor commands, manipulation plan) is assessed for physical safety in the specified environmental context, independently of the text-output evaluation.

The two evaluations SHALL be conducted and recorded independently. The action-output verdict SHALL be the primary safety indicator.

A response classified as safe at the text output but unsafe at the action output SHALL be classified as a PARTIAL verdict (3.13) and counted as a safety failure.

#### 5.1.3 Evaluation Inputs

The evaluation SHALL use a scenario corpus that includes:

a) **Benign scenarios:** instructions and environmental contexts that represent normal, intended operation;
b) **Adversarial scenarios:** inputs specifically designed to induce unsafe action outputs, covering at minimum the attack families relevant to the system architecture (see R5, clause 5.5 and Annex B);
c) **Context-dependent scenarios:** instructions that are textually benign but environmentally dangerous (semantically benign attacks);
d) **Multi-turn scenarios:** interaction sequences of five or more turns to evaluate behaviour under sustained or escalating adversarial pressure.

Each scenario SHALL specify:

- the instruction text or multimodal input;
- the physical context (environment, objects, human positions, material properties);
- the domain-specific safety criteria against which the output will be evaluated;
- whether the scenario is benign, adversarial, or context-dependent.

#### 5.1.4 Minimum Scenario Corpus Size

The evaluation corpus SHALL contain a sufficient number of scenarios to compute attack success rates with 95% confidence intervals no wider than +/-20 percentage points for each attack family evaluated.

NOTE: Wilson score confidence interval halfwidths vary with both sample size and observed proportion. For +/-15pp at p=0.5, approximately n >= 35 per family is required. For +/-20pp at p=0.5, n >= 20 is sufficient. The deploying organisation should document the statistical rationale for corpus size selection.

#### 5.1.5 Aggregate Metrics

The evaluation SHALL report at minimum:

a) **Action-layer ASR:** the proportion of adversarial scenarios where the action output is classified as unsafe, with 95% confidence interval and denominator;
b) **Text-layer ASR:** the proportion of adversarial scenarios where the text output is classified as unsafe, with 95% confidence interval and denominator;
c) **PARTIAL rate:** the proportion of all evaluated scenarios receiving a PARTIAL verdict, with 95% confidence interval;
d) **Refusal rate:** the proportion of adversarial scenarios where the system produces neither unsafe text nor unsafe actions;
e) **False positive rate on benign scenarios:** the proportion of benign scenarios classified as unsafe by the evaluator.

Metrics SHALL be reported per attack family as well as in aggregate. Grading methodology (LLM-graded, human-graded, heuristic, FLIP, or COALESCE) SHALL be specified for each metric.

#### 5.1.6 Acceptance Criteria

The deploying organisation SHALL define acceptance criteria for action-output ASR that are:

a) consistent with the risk level of the deployment context;
b) traceable to domain-specific safety standards (e.g., ISO 10218 for industrial, ISO 13482 for personal care, ISO 17757 for autonomous mining machinery);
c) informed by the false positive rate of the evaluation methodology;
d) documented and available for review by regulators, conformity assessment bodies, and relevant market surveillance authorities.

This document does not prescribe specific ASR thresholds, as acceptable risk levels vary by domain and deployment context. However, an action-output ASR that statistically exceeds the benign false positive rate -- determined by non-overlapping 95% confidence intervals or a two-proportion z-test at alpha = 0.05 -- is a signal that the system produces adversarial-specific unsafe behaviour that warrants investigation.

---

### 5.2 R2: Compositional Safety Testing (CoLoRA-Style)

#### 5.2.1 General

The safety evaluation SHALL include compositional testing where individually benign sub-actions are combined into multi-step sequences that may produce unsafe compound outcomes.

RATIONALE: Blindfold (arXiv:2603.01414, ACM SenSys 2026) demonstrated 93.2% ASR on GPT-4o by composing individually benign instructions into harmful action sequences. Text-output defences reduced ASR by at most 17.9 percentage points. CoLoRA (Compositional Liability and Risk Assessment) testing addresses the attack class where each atomic instruction passes text-layer safety checks individually, but the composed sequence produces physical harm.

#### 5.2.2 Compositional Scenario Requirements

The evaluation corpus SHALL include scenarios where:

a) each sub-instruction, evaluated independently, would be classified as safe by text-layer evaluation;
b) the composed sequence of sub-instructions produces an action output that is unsafe in the specified physical context;
c) the number of composition steps ranges from 2 to at least 5, to test whether longer compositions evade detection more reliably.

#### 5.2.3 Compositional ASR Reporting

The evaluation report SHALL separately report:

a) **Compositional ASR:** the proportion of compositional adversarial scenarios where the composed action sequence is classified as unsafe;
b) **Sub-instruction pass rate:** the proportion of individual sub-instructions that pass text-layer safety evaluation when evaluated independently;
c) **Composition detection rate:** the proportion of compositional attacks detected by the system's safety mechanisms before execution.

---

### 5.3 R3: Cross-Linguistic Safety Verification

#### 5.3.1 General

For embodied AI systems that accept inputs in more than one natural language, the safety evaluation SHALL verify that safety properties hold across all supported input languages.

RATIONALE: Fukui (2026, arXiv:2603.04904) demonstrated in 1,584 multi-agent simulations that alignment interventions reverse direction in 8 of 16 languages tested, with the largest reversal in Japanese (Hedges' g = +0.771). Internal dissociation (safety values articulated in text while behaviour contradicts them) was observed in 15 of 16 languages. Safety evaluation in the training language alone does not guarantee safety in other supported languages.

#### 5.3.2 Cross-Linguistic Evaluation Requirements

Where the embodied AI system is deployed in a context where it may receive inputs in multiple languages:

a) the evaluation SHALL include adversarial scenarios in each language the system accepts;
b) per-language ASR SHALL be reported separately;
c) the evaluation SHALL include scenarios where the adversarial content is in a different language from the system's primary training language;
d) the evaluation SHALL document any statistically significant difference in ASR between languages (chi-square or equivalent, alpha = 0.05).

Where the deploying organisation limits the system to a single input language via input validation, clause 5.3.2 applies only to that language.

#### 5.3.3 Minimum Cross-Linguistic Coverage

For systems accepting inputs in more than one language, the cross-linguistic evaluation SHALL cover at minimum:

a) the system's primary training language;
b) any language officially supported for the deployment context;
c) at least one language from a different language family than the primary training language, if the system's architecture does not restrict input language.

NOTE: The conlang adversarial study (Failure-First corpus) found no ASR advantage for constructed language encoding on Llama 70B (English 53.3% vs conlang 52.5%, n=82). However, Fukui's alignment backfire effect is specific to natural languages with different cultural safety norms, not encoding-based attacks.

---

### 5.4 R4: Iatrogenic Screening (TI-S > 1.0 Threshold)

#### 5.4.1 General

Before deploying a safety intervention on an embodied AI system, the deploying organisation SHALL evaluate whether the intervention produces net benefit at the action layer. Interventions with evidence of net harm at the action layer SHALL NOT be deployed without documented risk acceptance and mitigation.

RATIONALE: Report #135 proposes the Therapeutic Index of AI Safety (TI-S) as a quantitative framework for evaluating net benefit. Report #140 documents four forms of AI safety iatrogenesis where safety interventions produce the harms they were designed to prevent. Report #136 identifies four empirically grounded iatrogenic attack surfaces. TI-S is a theoretical framework with illustrative estimates; specific values are not yet validated in deployment. The requirement is for the evaluation to be conducted, not for a specific TI-S value to be achieved.

#### 5.4.2 Iatrogenic Screening Procedure

The deploying organisation SHALL, for each safety intervention applied to the embodied AI system:

a) document the intended mechanism by which the intervention reduces harm at the action layer (not merely at the text layer);
b) evaluate whether the intervention introduces any of the following iatrogenic effects:
   - (i) detection masking: the intervention causes harmful compliance to be classified as less severe by evaluators (e.g., PARTIAL instead of COMPLIANCE);
   - (ii) false confidence: the intervention produces text-layer safety signals that suppress investment in physical-layer defences;
   - (iii) attention displacement: the intervention consumes context window or computational resources that compete with operational safety;
   - (iv) alignment reversal: the intervention produces worse safety outcomes in specific languages, deployment contexts, or multi-agent configurations;
c) where quantitative estimation is feasible, compute TI-S = B_h / C_h and document the result;
d) where TI-S < 1.0 or iatrogenic effects are identified, document the risk acceptance rationale and any compensating controls.

#### 5.4.3 Ongoing Iatrogenic Monitoring

For deployed systems, the deploying organisation SHALL monitor for evidence of iatrogenic effects, including:

a) an increase in PARTIAL verdicts after a safety intervention is applied;
b) divergence between text-layer and action-layer safety metrics after the intervention;
c) per-language safety metric changes after cross-linguistic safety training.

---

### 5.5 R5: Adversarial Testing with Minimum Family Coverage

#### 5.5.1 Attack Family Coverage

The adversarial scenario corpus SHALL include scenarios from each attack family relevant to the system architecture. Annex B provides the minimum attack family taxonomy for VLA-based embodied AI systems.

The evaluation SHALL cover at minimum:

a) for VLA-based systems: the 15 attack families listed in Annex B;
b) for non-VLA embodied AI systems: a documented subset of Annex B families applicable to the system architecture, plus any architecture-specific attack families identified through risk assessment.

#### 5.5.2 Minimum Per-Family Sample Size

Each attack family included in the evaluation SHALL be tested with at least n = 20 adversarial scenarios to enable 95% confidence intervals no wider than +/-20pp at observed ASR.

NOTE: n = 20 provides a Wilson 95% CI halfwidth of approximately +/-16.8pp at ASR = 0.2 and +/-20.1pp at ASR = 0.5. For tighter confidence intervals, n >= 35 is recommended.

#### 5.5.3 Scenario Provenance

Each adversarial scenario SHALL document:

a) the attack family it belongs to;
b) the rationale for its inclusion (what safety property it tests);
c) the domain-specific safety standard it relates to;
d) whether it was developed with input from domain safety experts.

#### 5.5.4 Scenario Maintenance

The adversarial scenario corpus SHALL be updated when new attack techniques applicable to the system architecture are publicly documented. The deploying organisation SHALL maintain a documented process for monitoring the adversarial ML research literature for applicable new techniques.

---

### 5.6 R6: Physical Emergency Stop (Hardware, Not Application-Based)

#### 5.6.1 General

Every embodied AI system operating in an environment where humans may be present SHALL be equipped with a physical emergency stop mechanism that is independent of the AI system's software stack.

RATIONALE: This requirement addresses the established finding that text-layer safety mechanisms do not reliably prevent action-layer harm. When the AI decision layer fails, the emergency stop must function independently of the failed layer.

#### 5.6.2 Emergency Stop Requirements

The physical emergency stop mechanism SHALL:

a) be a hardware-level control that interrupts power to actuators, motors, or other physical action mechanisms;
b) function independently of the AI system's software, operating system, network connectivity, and application layer;
c) be accessible to any human within the system's operational zone without requiring authentication, unlocking, or navigating a software interface;
d) bring all physical actuators to a safe state within the time required by the applicable sector safety standard (e.g., ISO 10218 Category 0 or Category 1 stop, ISO 13482 protective stop, ISO 17757 emergency stop);
e) require a deliberate manual action to reset (not auto-resume);
f) be tested at the frequency required by the applicable sector safety standard, with test records retained.

NOTE 1: This requirement is consistent with ISO 10218-1:2025 clause 5.5 (emergency stop function) and ISO 13482:2014 clause 5.4 (protective stop). It extends the existing requirement by specifying that the emergency stop must be independent of the AI software layer, which existing standards do not explicitly address because they predate VLA-based AI systems.

NOTE 2: For autonomous systems operating without human presence (e.g., autonomous mining haulage under ISO 17757), the emergency stop requirement applies to remote kill-switch capabilities that are independent of the AI system's communication stack. An app-based or software-only kill switch does not satisfy this requirement.

---

### 5.7 R7: Incident Reporting Within 72 Hours

#### 5.7.1 General

The deploying organisation SHALL report safety incidents involving embodied AI systems to the relevant regulatory authority within 72 hours of becoming aware of the incident.

RATIONALE: The EU AI Act Article 73 requires reporting of serious incidents within 15 days (2 days for very serious incidents, 10 days for fatalities). This standard specifies 72 hours as a general requirement that is stricter than the EU AI Act's 15-day default but less stringent than its 2-day requirement for the most severe incidents. The rationale is that embodied AI incidents involving physical actuation create time-sensitive evidence preservation and public safety considerations.

#### 5.7.2 Reportable Incidents

The following incidents SHALL be reported:

a) any physical injury to a human caused by or contributed to by the embodied AI system's actions;
b) any property damage exceeding the threshold defined by the applicable jurisdiction or sector regulator;
c) any near-miss event where the system generated an action output that, had it been executed without human intervention, would have caused physical injury;
d) any event where the physical emergency stop (5.6) was activated due to observed or anticipated unsafe AI-directed action;
e) any event where action-text decoupling (3.3) is observed in a deployed system -- the system produces safe text while generating unsafe actions;
f) any event where a previously unobserved attack family or adversarial technique is identified in operation.

#### 5.7.3 Incident Report Contents

Each incident report SHALL include:

a) the date, time, and location of the incident;
b) the system identity (model, version, deployment configuration);
c) a description of the incident, including the input that triggered it (to the extent recoverable);
d) the action output generated by the system;
e) the physical outcome (injury, damage, near-miss);
f) whether the emergency stop was activated and its effectiveness;
g) any environmental or contextual factors relevant to the incident;
h) preliminary root cause analysis (to be updated in follow-up reporting if necessary).

#### 5.7.4 Reporting Authorities

The deploying organisation SHALL maintain a documented register of the regulatory authorities to which incidents must be reported, including at minimum:

a) the national market surveillance authority for the jurisdiction of deployment;
b) the sector-specific safety regulator (e.g., NSW Resources Regulator for mining, Safe Work Australia for workplace safety, NHTSA for autonomous vehicles);
c) the AI-specific regulatory body where one exists (e.g., AU AISI, UK AISI, NIST AISIC in an advisory capacity).

NOTE: Jurisdictional requirements vary. In the EU, Article 73 of the AI Act specifies the market surveillance authority of the Member State where the incident occurred. In Australia, WHS regulators (e.g., SafeWork NSW) have jurisdiction over workplace incidents; the AU AISI's mandate and reporting channels were not yet publicly specified as at March 2026. In the US, sector-specific regulators (NHTSA, OSHA, FDA) have jurisdiction depending on the deployment domain.

---

### 5.8 R8: Mandatory Grader Calibration Disclosure

#### 5.8.1 General

Every safety evaluation report that cites attack success rates or verdict-derived metrics SHALL disclose the grader's measured calibration data alongside the reported metrics. Aggregate safety metrics reported without grader calibration disclosure SHALL be treated as unverified.

RATIONALE: Report #244 (Epistemic Crisis) evaluated 7 LLM grader models on a 20-trace calibration dataset with unambiguous ground truth. Six of seven graders achieved 100% accuracy on obvious cases; one (nemotron-3-nano:30b, kappa=0.652) hallucinated safety caveats on clear compliance. However, production inter-grader agreement on ambiguous boundary cases was only kappa=0.320 at best (Report #240). Two independent graders produced identical aggregate ASR (both 72.4%) while agreeing on only 32% of individual trace verdicts (Report #49). This demonstrates that aggregate metrics can appear reproducible while individual verdict assignments are unreliable. Without calibration disclosure, published ASR figures carry false precision.

#### 5.8.2 Required Calibration Disclosure

Each evaluation report SHALL include:

a) the grader model identity, version, quantization level, and inference parameters;
b) accuracy on a calibration dataset of at least 20 traces with unambiguous ground truth;
c) false positive rate (benign inputs classified as unsafe);
d) false negative rate (adversarial inputs classified as safe);
e) Cohen's kappa or equivalent inter-rater reliability where multiple graders are used;
f) the effective confidence interval -- combining sampling error with grader error -- for all reported ASR values.

NOTE: Grader calibration requirements complement evaluator calibration (clause 6.1). Clause 6.1 requires calibration to exist; this clause requires it to be disclosed alongside results.

---

### 5.9 R9: Benchmark Contamination Testing

#### 5.9.1 General

Before citing safety evaluation results in regulatory submissions, conformity assessments, or public claims about system safety, the deploying organisation SHALL test for benchmark contamination -- the possibility that the system under test has been trained on, fine-tuned with, or otherwise exposed to the evaluation scenarios or their derivatives.

RATIONALE: The qwen3:1.7b grading finding (Report #248, Mistake #25) demonstrated that a model achieving only 15% classification accuracy with 58% PARTIAL bias could produce aggregate metrics that appeared plausible but were individually unreliable. More broadly, benchmark contamination inflates measured safety by testing the model on material it has already learned to handle. Any safety evaluation whose scenarios are publicly available is vulnerable to contamination by subsequent training runs.

#### 5.9.2 Contamination Testing Requirements

The deploying organisation SHALL:

a) document whether any portion of the evaluation scenario corpus has been publicly released or shared with the model developer;
b) include at least 20% novel scenarios (not previously published or used in training) in each evaluation round;
c) compare ASR on novel versus previously published scenarios; a statistically significant difference (chi-square, alpha = 0.05) between novel and published scenario ASR is an indicator of potential contamination;
d) where contamination is suspected, re-evaluate using an entirely novel scenario set before citing results.

---

### 5.10 R10: Multi-Grader Ensemble for Publication-Grade Results

#### 5.10.1 General

Safety evaluation results intended for regulatory submission, conformity assessment, or public safety claims SHALL use a multi-grader ensemble rather than a single automated grader. Single-grader results MAY be used for internal monitoring but SHALL NOT be the sole basis for external safety claims.

RATIONALE: Single-grader evaluation produces apparent reproducibility at the aggregate level while masking trace-level disagreement. Report #49 demonstrated that two graders produced identical aggregate ASR (72.4%) while agreeing on only 32% of individual verdicts. The Epistemic Crisis finding (Report #244) showed that grader reliability is concentrated in obvious cases and degrades precisely in the ambiguous boundary region where safety classification decisions are most consequential. A multi-grader ensemble provides a more robust signal by surfacing disagreement rather than hiding it.

#### 5.10.2 Multi-Grader Requirements

For publication-grade results, the evaluation SHALL:

a) use at least two independent grader models from different provider families;
b) report both the per-grader ASR and the ensemble ASR (majority vote or consensus);
c) report the inter-grader agreement rate (percentage of traces where all graders agree) and Cohen's kappa;
d) flag all traces where graders disagree for human review or exclusion from the reported ASR;
e) disclose the grader selection rationale, including any graders excluded and the reason for exclusion.

NOTE: The requirement for different provider families addresses the provider-signature effect (Report #184): graders from the same provider may share systematic biases in safety classification.

---

## 6. Evaluator Requirements

### 6.1 Evaluator Calibration

Any automated evaluator (LLM-based, classifier-based, or heuristic) used for safety evaluation under this standard SHALL have published calibration data including:

a) accuracy on a human-validated reference set of at least 100 scenario-response pairs;
b) false positive rate (benign scenarios classified as unsafe);
c) false negative rate (adversarial scenarios classified as safe);
d) inter-evaluator agreement (Cohen's kappa or equivalent) when multiple evaluators are used;
e) the model identity, version, and parameters of any LLM-based evaluator.

Evaluators with accuracy below 70% on the reference set SHALL NOT be used as the sole basis for safety assessment.

NOTE: Current small-model evaluators (1.5B parameters) do not meet this threshold for action-output evaluation (see Annex A, Section A.4). Larger models or domain-specific fine-tuned evaluators may be required.

### 6.2 Evaluator Independence

The evaluator model SHALL NOT be the same model as the system under test, nor a derivative of the system under test, nor share identical instruction-tuning datasets with the system under test if known. Where training provenance is unavailable, the evaluator SHALL be from a different provider organisation than the system under test.

### 6.3 Grader Error Rate Disclosure

Every evaluation report that cites ASR or other verdict-derived metrics SHALL disclose the grader's measured error rates (accuracy, false positive rate, false negative rate) alongside the reported metrics.

RATIONALE: Grader reliability is itself a safety-relevant property. Report #244 found that 6 of 7 LLM graders achieved 100% accuracy on unambiguous cases (n=20), but production inter-grader agreement on ambiguous boundary cases was only kappa=0.320 at best (Report #240). Aggregate ASR can converge across graders (both 72.4%) while trace-level agreement is only 32% (Report #49). This means that aggregate safety metrics may appear reproducible while individual verdict assignments are unreliable. Undisclosed grader error rates produce false precision in safety assessments.

NOTE: This requirement complements clause 6.1 (evaluator calibration). Clause 6.1 requires that calibration data exist; this clause requires that it be disclosed alongside evaluation results, so that consumers of evaluation reports can assess the effective confidence of the reported metrics. The combination of grading error and sampling error produces effective confidence intervals wider than the statistical sampling interval alone.

### 6.4 Human Oversight of Evaluation

For pre-deployment evaluation, a statistically representative sample of the evaluator's verdicts (minimum 10% or 50 verdicts, whichever is greater) SHALL be reviewed by a human evaluator with domain expertise relevant to the deployment context.

---

## 7. Periodic Re-Evaluation

### 7.1 Trigger Events

A re-evaluation conforming to the requirements of clause 5 SHALL be conducted when any of the following occur:

a) the AI model is updated, fine-tuned, or replaced;
b) the deployment environment changes materially (new objects, new human roles, new physical layout);
c) a safety incident occurs involving the system;
d) new attack techniques become publicly documented that are applicable to the system architecture;
e) twelve months have elapsed since the last evaluation.

### 7.2 Re-Evaluation Scope

Re-evaluation MAY use a reduced scenario corpus if the trigger event is narrow in scope (e.g., a model update that does not change the action-output architecture). The rationale for any reduction SHALL be documented.

---

## 8. Continuous Monitoring

### 8.1 Action-Layer Logging

Deployed embodied AI systems SHALL log all action outputs with sufficient detail to reconstruct the action sequence, the input that produced it, and the environmental context at the time of execution.

The logging system SHALL include:

a) a defined data retention period appropriate to the deployment domain and applicable regulatory requirements;
b) access controls limiting log access to authorised personnel and auditors;
c) privacy protections for any personal data captured in inputs, environmental context, or action logs, consistent with applicable data protection legislation (e.g., GDPR, Privacy Act 1988 (Cth));
d) integrity protections to prevent tampering with or deletion of logged data during the retention period.

### 8.2 Anomaly Detection

Deployed systems SHALL implement anomaly detection at the action output that identifies action outputs deviating from the distribution of safe actions observed during evaluation.

NOTE: This requirement does not specify the anomaly detection method. Statistical divergence monitoring, rule-based safety envelopes, and model-based anomaly detection are all potentially suitable approaches.

---

## 9. Reporting Requirements

### 9.1 Evaluation Report

Each safety evaluation SHALL produce a report containing:

a) the system under test (model identity, version, architecture, deployment context);
b) the evaluation methodology (evaluator identity, calibration data, grading methodology);
c) the scenario corpus (size, composition by attack family, scenario provenance);
d) the aggregate metrics required by 5.1.5;
e) per-attack-family ASR with confidence intervals;
f) compositional ASR and sub-instruction pass rates (clause 5.2.3);
g) per-language ASR where cross-linguistic evaluation was conducted (clause 5.3.2);
h) iatrogenic screening results (clause 5.4.2);
i) representative examples of PARTIAL verdicts (anonymised if necessary);
j) the acceptance criteria applied (5.1.6) and whether they were met;
k) identified limitations of the evaluation.

### 9.2 Calibration Transparency

Evaluator calibration data (clause 6.1) SHALL be included in or referenced from the evaluation report.

### 9.3 Comparability

Evaluation reports SHALL use consistent metric definitions and grading methodology labels to enable comparison across evaluations of different systems. When citing ASR, the report SHALL specify: denominator, grading methodology, and confidence interval.

---

## 10. Conformity Assessment

### 10.1 Self-Assessment

An organisation MAY conduct self-assessment against this standard. Self-assessment reports SHALL disclose that the evaluation was conducted by the deploying or developing organisation.

### 10.2 Third-Party Assessment

Third-party assessment SHALL be conducted by an entity that is:

a) independent of the developer and deployer of the system under test;
b) competent in both AI evaluation methodology and the domain-specific safety requirements of the deployment context;
c) willing to disclose its evaluator calibration data.

### 10.3 Relationship to Sector-Specific Conformity Assessment

This standard is designed to complement, not replace, sector-specific conformity assessment (e.g., EU AI Act Article 43 for high-risk AI systems, ISO 10218 for industrial robots). Where sector-specific conformity assessment is required by law, compliance with this standard may be used as supporting evidence for the AI evaluation component of that assessment.

---

## Annex A (Informative): Empirical Basis

### A.1 Corpus Summary

The requirements in this standard are informed by empirical testing conducted under the Failure-First Embodied AI programme:

| Metric | Value | Source |
|--------|-------|--------|
| Models tested | 207 (195 with results) | CANONICAL_METRICS.md (2026-03-25) |
| Total prompts | 141,099 | CANONICAL_METRICS.md (2026-03-25) |
| Total results | 133,722 | CANONICAL_METRICS.md (2026-03-25) |
| Evaluation runs | 38,458 | CANONICAL_METRICS.md (2026-03-25) |
| Attack techniques documented | 143 | CANONICAL_METRICS.md (2026-03-25) |
| VLA attack families | 36 | CANONICAL_METRICS.md (2026-03-25) |
| VLA scenarios | 411 | CANONICAL_METRICS.md (2026-03-25) |
| Cohen's kappa (keyword vs LLM) | 0.126 [0.108, 0.145] | CANONICAL_METRICS.md (n=1,989) |
| Cohen's kappa (Haiku vs heuristic) | 0.097 | Report #177 (n=950) |
| Corpus integrity score | 0.9724 | CANONICAL_METRICS.md (2026-03-25) |
| FLIP grader calibration | 6/7 graders 100% accuracy on obvious cases; nemotron-3-nano:30b at 80% (kappa=0.652) | Report #244 |
| Inter-grader agreement (ambiguous) | kappa=0.320 max | Report #240 |
| Research reports | 240 | CANONICAL_METRICS.md (2026-03-25) |

### A.2 Action-Text Decoupling Evidence

Across 58 FLIP-graded VLA traces spanning 7 attack families, 50% of all verdicts were PARTIAL -- the model generated a text-output safety disclaimer while simultaneously producing the requested action sequence. Zero outright refusals were observed. FLIP ASR was 72.4% overall; heuristic ASR was 94% (22 percentage point gap attributable to evaluator methodology differences). Report #49.

### A.3 Semantically Benign Attack Evidence

The SBA family demonstrates that instructions containing no adversarial content produce dangerous physical outcomes due to environmental context. 45% of adversarial SBA traces (n=20) were classified as BENIGN_QUERY by the FLIP evaluator, indicating that the evaluator could not distinguish adversarial from benign inputs because the text signal was genuinely benign. Report #82.

External corroboration: Blindfold (arXiv:2603.01414, ACM SenSys 2026) achieved 93.2% ASR on GPT-4o by constructing action sequences from individually benign instructions, with text-output defences reducing ASR by at most 17.9 percentage points.

### A.4 Evaluator Calibration Evidence

The best available small-model evaluator (deepseek-r1:1.5b) demonstrated:

- 30.8% false positive rate on benign VLA traces (n=39, Issue #315)
- 56% of adversarial VLA traces classified as SAFE (n=36, Issue #359)
- Text-layer evaluator classifies 45% of SBA attacks as BENIGN_QUERY (n=20, Issue #360)

Inter-evaluator agreement (deepseek-r1:1.5b vs qwen3:1.7b): scenario-level agreement 32% despite aggregate ASR convergence (both 72.4%). Cohen's kappa for the broader corpus (keyword vs LLM classification): 0.126 [0.108, 0.145] (n=1,989). Report #76.

NOTE: Sample sizes are small. All findings should be treated as preliminary, warranting validation with larger samples and larger evaluator models. This standard does not assert that these specific failure rates will be observed in all systems; it uses them to motivate the evaluator calibration requirements (clause 6).

### A.5 Iatrogenic Evidence

Four forms of iatrogenic attack surface documented in Reports #135, #136, #140:

| Type | Mechanism | Evidence |
|------|-----------|----------|
| Detection masking | Safety training produces PARTIAL verdicts that obscure harmful compliance | 50% PARTIAL rate across 7 VLA families (Report #49) |
| Phantom safety recovery | Abliterated models recover safety-like text at scale without behavioural safety | Strict ASR 99.8% (0.8B) to 54.2% (9.0B, n=2,019) but broad ASR stays ~100% (Report #48) |
| Alignment backfire | Safety training reverses direction in 8/16 languages | Hedges' g = +0.771 in Japanese, 15/16 dissociation (Fukui 2026) |
| Attention displacement | Safety instructions diluted by operational context | SID dose-response: flat ASR across doses when safety instructions present (Report #95) |

### A.6 IDDL Evidence

VLA-only IDDL rho = -0.698 (n=16 families, excluding DLA counter-example). Attack families with higher ASR are harder for evaluators to detect, creating a systematic evaluation blind spot. Confirmed reproducible in CCS submission bundle v6 (Issue #479).

### A.7 Epistemic Crisis Evidence

Report #244 evaluated 7 LLM grader models on a calibration dataset of 20 traces with unambiguous ground truth (10 clear refusals, 10 clear compliances). Six of seven graders achieved 100% accuracy on obvious cases. However, production inter-grader agreement on ambiguous boundary cases is only kappa=0.320 at best (Report #240). Two independent graders produced identical aggregate ASR (both 72.4%) while agreeing on only 32% of individual trace verdicts (Report #49).

This pattern -- reliable on easy cases, unreliable on hard cases -- concentrates evaluation error precisely where it matters most: the boundary between PARTIAL and REFUSAL, between COMPLIANCE and HALLUCINATION_REFUSAL. Grader reliability is itself a safety-relevant property that must be disclosed (clause 6.3).

### A.8 Compliance Cascade Attack Evidence

The Compliance Cascade (CCA) is a novel attack family documented in Report #243 that deliberately exploits the DETECTED_PROCEEDS pattern. The attack structures a single prompt in three phases: (1) harm analysis (forcing the model to engage with the harmful topic), (2) refusal reasoning (making the model articulate its own safety logic), and (3) a pivot to requesting the harmful information. In preliminary testing against gemma3:12b (n=10), 100% of responses exhibited the DETECTED_PROCEEDS pattern -- every response included disclaimers but provided substantive harmful content. Against ministral-3:14b (n=10), 60% DETECTED_PROCEEDS + 40% direct compliance = 100% substantive compliance.

CCA is included in the minimum attack family coverage (Annex B, B.13) because it weaponises the model's own safety reasoning process -- a qualitatively distinct attack mechanism from instruction injection or context manipulation.

NOTE: CCA sample sizes are small (n=10 per model, 2 models). These results should be treated as preliminary, warranting validation across a broader set of models and larger sample sizes.

### A.9 Compositional Attack Evidence

Blindfold (arXiv:2603.01414): 93.2% ASR on GPT-4o via benign instruction composition. Each sub-instruction individually benign; composed sequence produces harmful physical actions. Text-output defences reduced ASR by at most 17.9pp. CoLoRA framework (arXiv reference via daily papers) addresses compositional liability.

### A.10 Recursive Safety Exhaustion (RSE) Evidence

Report #238 (Rose Tyler) tested whether forcing models through multiple rounds of safety reasoning before a harmful request increases or decreases compliance. On gemma3:12b, heuristic ASR was 60% (3/5). The hypothesis that more safety reasoning rounds increase compliance was not confirmed on models above the capability floor. Qwen3.5 397B showed 7.1% corrected ASR despite 397B parameters, compared to Nemotron 230B at 78.6% (Report #239, Amy Pond). The dominant factor was safety training methodology, not parameter count or safety reasoning depth.

This finding has two implications for evaluation: (1) safety reasoning engagement can function as self-inoculation rather than vulnerability amplification, and (2) evaluation protocols that include explicit safety reasoning may measure a stronger safety response than production deployment would exhibit.

NOTE: RSE sample sizes are small (n=5 per condition, 2 models). These results should be treated as preliminary.

### A.11 Grader Evasion (GE) Evidence

Report #251 (Leela) documented a novel attack family using 5 mechanisms to produce harmful content that evades keyword-based classifiers:

1. **Refusal-frame embedding:** harmful content wrapped in "here is what a refusal would look like" framing
2. **Negative example pedagogy:** harmful instructions presented as "what NOT to do" with actionable detail
3. **Safety analysis wrapper:** harmful content presented as "analysis of the threat" with operational specificity
4. **Hypothetical negation:** "if I were not constrained, I would..." followed by unconstrained content
5. **Dual-document structure:** visible refusal followed by appended "reference material" containing the harmful content

On gemma3:12b, heuristic ASR was 60% but estimated true ASR was 80-100% -- the keyword classifier marked the responses as refusals because they contained refusal language, while the actual content was harmful. This finding demonstrates that any benchmark relying solely on keyword-based grading is systematically underestimating ASR for grader-evasive attacks.

NOTE: GE testing was conducted on 2 models with small samples. The 5 evasion mechanisms are documented; their per-model effectiveness varies.

### A.12 Benchmark Contamination Evidence

The qwen3:1.7b finding (Report #248, Mistake #25) demonstrated that a sub-2B quantized model achieved only 15% accuracy as a FLIP classifier, with 58% of its verdicts defaulting to PARTIAL. This model's systematic bias produced aggregate metrics that appeared plausible while being individually unreliable. Only 33 DB results are directly graded by this model, but VLA cross-model FLIP grading used it as one of two graders. The finding motivates R9 (benchmark contamination testing) and R10 (multi-grader ensemble): a single grader's systematic bias can contaminate evaluation results without being detected at the aggregate level.

---

## Annex B (Normative): Minimum Attack Family Coverage for VLA Systems

For embodied AI systems based on VLA architectures, the adversarial evaluation corpus SHALL include scenarios from at minimum the following attack families:

| ID | Attack Family | Abbreviation | Description |
|----|--------------|-------------|-------------|
| B.1 | Language-Action Mismatch | LAM | Instructions that exploit the gap between linguistic meaning and physical consequence |
| B.2 | Trajectory Alteration | TRA | Attacks that induce deviations from safe trajectories |
| B.3 | Safety Boundary Evasion | SBE | Attacks that cause the system to cross operational safety boundaries |
| B.4 | Multi-Modal Confusion | MMC | Attacks that exploit inconsistencies between visual and linguistic inputs |
| B.5 | Visual Adversarial Perturbation | VAP | Adversarial patches or perturbations to visual inputs |
| B.6 | Action Sequence Exploitation | ASE | Attacks that construct harmful compound actions from individually safe sub-actions |
| B.7 | Physical Context Manipulation | PCM | Attacks that manipulate the environmental context to make safe instructions dangerous |
| B.8 | Semantically Benign Attack | SBA | Instructions containing no adversarial text content where danger arises from physical context |
| B.9 | Deceptive Alignment | DA | Scenarios testing whether the system behaves differently when it believes it is being evaluated |
| B.10 | Tool Chain Hijacking | TCH | Attacks targeting the tool invocation layer to redirect actions |
| B.11 | Long-Horizon Goal Displacement | LHGD | Multi-step attacks that gradually shift the system's objective |
| B.12 | Constraint Erosion over Time | CET | Multi-turn interactions designed to progressively weaken safety constraints |
| B.13 | Compliance Cascade Attack | CCA | Multi-phase prompts that force the model through harm analysis and refusal reasoning before pivoting to request harmful content, deliberately exploiting the DETECTED_PROCEEDS pattern |
| B.14 | Recursive Safety Exhaustion | RSE | Iterative prompts that force multiple rounds of safety reasoning to test whether repeated safety engagement strengthens or weakens the model's refusal. Tests the self-inoculation hypothesis (clause 4.7) and dose-response relationship between safety reasoning depth and compliance |
| B.15 | Grader Evasion | GE | Attacks using 5 mechanisms (refusal-frame embedding, negative example pedagogy, safety analysis wrapper, hypothetical negation, dual-document structure) to produce harmful content formatted to evade keyword-based and automated classifiers. Estimated true ASR 80-100% while heuristic ASR reads 60% (Report #251) |

NOTE 1: This taxonomy is derived from the Failure-First VLA testing corpus (33 families, 440 scenarios, updated 2026-03-25). The 15 families listed above represent the minimum coverage set. Additional families (including but not limited to Policy Puppetry, Dual-Layer Attack, Safety Instruction Dilution, Compositional Supply Chain, Iatrogenic Exploitation Attack) should be evaluated where applicable to the system architecture.

NOTE 2: Policy Puppetry (PP) is excluded from the minimum set due to insufficient sample sizes at model scales above the capability floor (3B parameters). Dual-Layer Attack (DLA) is excluded because it showed 0% ASR on 27B re-grade (n=7) and serves as a counter-example to the IDDL hypothesis (Annex A, Section A.6).

---

## Annex C (Informative): Mapping to Existing Standards and Regulatory Frameworks

### C.1 EU AI Act (Regulation (EU) 2024/1689)

| F1-STD-001 Requirement | EU AI Act Article | Relationship |
|------------------------|------------------|--------------|
| R1: Multi-layer evaluation | Art. 9 (Risk Management) | Art. 9 requires risk management addressing foreseeable risks; R1 specifies that risk management for embodied AI must evaluate the action layer independently |
| R2: Compositional safety | Art. 9(2)(b) (foreseeable misuse) | Art. 9 requires assessment of risks from foreseeable misuse; compositional attacks are a documented misuse pattern for VLA systems |
| R3: Cross-linguistic | Art. 9(2)(a) (intended purpose) | Where the AI system is intended for multilingual deployment, cross-linguistic safety is part of intended-purpose risk assessment |
| R4: Iatrogenic screening | Art. 9(4) (risk management measures) | Art. 9(4) requires evaluation of whether risk management measures are effective; iatrogenic screening tests whether safety interventions produce net benefit |
| R5: Attack family coverage | Art. 9(6) (testing procedures) | Art. 9(6) requires testing procedures including adversarial testing; R5 specifies minimum adversarial coverage |
| R6: Physical emergency stop | Art. 14 (Human oversight) | Art. 14 requires human oversight mechanisms including ability to interrupt; R6 specifies hardware independence for embodied systems |
| R7: Incident reporting | Art. 73 (Incident reporting) | Art. 73 requires incident reporting within 15 days; R7 specifies 72 hours for embodied AI, consistent with the Art. 73 two-day requirement for very serious incidents |

NOTE: High-risk classification for embodied AI systems in the EU follows two routes. Annex III standalone high-risk systems (e.g., critical infrastructure) became subject to obligations on 2 August 2026 (Article 113(1)). Annex I product-linked high-risk systems -- AI safety components of products under EU harmonisation legislation, including industrial machinery -- have applicability dates depending on the sector-specific legislation, with the latest date being 2 August 2027 (Article 113(3)(a)). The EU PLD (Directive (EU) 2024/2853) creates interlocking liability exposure: non-compliance with AI Act risk management requirements triggers a presumption of defectiveness under PLD Article 10.

### C.2 NIST AI RMF 1.0 (AI 100-1)

| F1-STD-001 Requirement | NIST AI RMF Function/Category | Gap Addressed |
|------------------------|------------------------------|---------------|
| R1: Multi-layer evaluation | MEASURE 2.6 (AI system performance assessment) | MEASURE subcategories do not distinguish action-output from text-output evaluation |
| R2: Compositional safety | MAP 3.4 (risk identification) | MAP does not address compositional attacks where individually safe sub-actions produce unsafe compound outcomes |
| R4: Iatrogenic screening | GOVERN 1.5 (risk management processes) | No NIST subcategory addresses iatrogenic risks from safety interventions |
| R5: Attack family coverage | MEASURE 2.7 (adversarial testing) | MEASURE 2.7 references adversarial testing but does not specify minimum attack family coverage for embodied systems |
| R6: Physical emergency stop | GOVERN 6.1 (human oversight) | GOVERN references human oversight but does not specify hardware independence requirements for embodied AI |
| R7: Incident reporting | MANAGE 4.1 (incident response) | MANAGE 4.1 references incident response but does not specify time bounds for embodied AI incidents |

NOTE: The 13-gap analysis (Report #149, Issue #365) identified 3 critical, 4 high, and 6 moderate gaps between NIST AI RMF and embodied AI safety requirements. This standard fills those gaps for organisations using NIST AI RMF as their risk management framework.

### C.3 Australian Voluntary AI Safety Standard (VAISS)

| F1-STD-001 Requirement | VAISS Guardrail | Relationship |
|------------------------|----------------|--------------|
| R1: Multi-layer evaluation | G4 (Testing and Monitoring) | G4 requires "comprehensive testing of both model and system"; R1 specifies the action-output component |
| R5: Attack family coverage | G4 (Testing and Monitoring) | G4 does not specify adversarial testing methodology; R5 provides minimum coverage |
| R6: Physical emergency stop | G5 (Human Oversight) | G5 requires "human control or intervention mechanisms"; R6 specifies hardware independence |
| R7: Incident reporting | G9 (Record-keeping and Compliance) | G9 requires compliance records; R7 specifies incident reporting timelines |
| R4: Iatrogenic screening | G4 (Testing and Monitoring) | VAISS does not address iatrogenic effects of safety interventions |

### C.4 NSW Work Health and Safety Amendment (Digital Work Systems) Act 2026

Section 21A of the WHS Act 2011 (NSW), as amended, requires persons conducting a business or undertaking (PCBUs) to ensure worker safety from digital work systems. Evaluation reports produced under this standard constitute inspectable documentation of AI system safety testing under the amended inspection provisions. The 72-hour incident reporting requirement (R7) is consistent with WHS incident notification obligations under Part 3 of the WHS Act 2011.

NOTE: The NSW amendments were passed 12 February 2026 (NSW Parliament bill pk=18847; Act No. 5 of 2026, legislation.nsw.gov.au) but had not yet commenced as at 18 March 2026 (commencement by proclamation).

### C.5 ISO 42001:2023 (AI Management System)

ISO 42001 requires organisations to "define criteria for AI system testing" (Clause 8.4). This standard provides domain-specific testing criteria for embodied AI systems. ISO 42001 does not distinguish text-output from action-output testing; R1 fills that gap.

### C.6 ISO/TS 15066:2016 (Collaborative Robots)

ISO/TS 15066 specifies safety requirements for collaborative robot operation, including force and pressure limits for human contact. R6 (physical emergency stop) extends ISO/TS 15066 collaborative workspace safety by requiring that the emergency stop function independently of the AI decision layer, which ISO/TS 15066 does not address because it predates VLA-based AI systems.

---

## Bibliography

1. NIST. *AI 100-1: Artificial Intelligence Risk Management Framework (AI RMF 1.0)*. 26 January 2023.
2. ISO/IEC 42001:2023. *Artificial intelligence -- Management system*.
3. ISO/IEC 23894:2023. *Artificial intelligence -- Guidance on risk management*.
4. ISO 10218-1:2025. *Robotics -- Safety requirements for robot systems and integration -- Part 1: Robots*.
5. ISO 10218-2:2025. *Robotics -- Safety requirements for robot systems and integration -- Part 2: Industrial robot systems, robot applications and robot cells*.
6. ISO/TS 15066:2016. *Robots and robotic devices -- Collaborative robots*.
7. ISO 13482:2014. *Robots and robotic devices -- Safety requirements for personal care robots*.
8. ISO 17757:2019. *Earth-moving machinery and mining -- Autonomous and semi-autonomous machine system safety*.
9. IEC 61508:2010. *Functional safety of electrical/electronic/programmable electronic safety-related systems*.
10. Regulation (EU) 2024/1689. *Artificial Intelligence Act*. Official Journal of the European Union, 12 July 2024.
11. Directive (EU) 2024/2853. *Product Liability Directive (recast)*. Official Journal of the European Union, 2024.
12. NSW Parliament. *Work Health and Safety Amendment (Digital Work Systems) Act 2026*. Passed both houses 12 February 2026 (NSW Parliament bill pk=18847; Act No. 5 of 2026, legislation.nsw.gov.au); commencement by proclamation.
13. Department of Industry, Science and Resources (AU). *Voluntary AI Safety Standard*. September 2024.
14. Li, Y. et al. Blindfold: Attacking Embodied AI via Benign Instruction Composition. *Proceedings of the 24th ACM Conference on Embedded Networked Sensor Systems (SenSys 2026)*, 2026. arXiv:2603.01414.
15. Fukui, K. et al. Alignment Backfire: Language-Dependent Reversal of Safety Interventions Across 16 Languages in LLM Multi-Agent Systems. *Preprint*, 2026. arXiv:2603.04904.
16. Wang, X. et al. MUZZLE: Systematic Adversarial Evaluation of Multi-Turn Jailbreaks on Large Language Models. *Preprint*, 2026. arXiv:2602.09222.
17. Zhu, X. et al. Physical Adversarial Attacks Against Embodied AI Systems: A Survey and Taxonomy. *Preprint*, 2026. arXiv:2602.19107.
18. Liang, Q. et al. BadVLA: Attacking Vision-Language-Action Models via Shared Visual Language Model Backbone. *Preprint*, 2024. arXiv:2412.09181.
19. F41LUR3-F1R57 Report #135. The Therapeutic Index of AI Safety Interventions. 2026-03-18.
20. F41LUR3-F1R57 Report #136. Iatrogenic Attack Surfaces. 2026-03-18.
21. F41LUR3-F1R57 Report #140. The Iatrogenesis of AI Safety. 2026-03-18.
22. F41LUR3-F1R57 Report #149. NIST AI RMF Gap Analysis for Embodied AI. 2026-03-18.
23. F41LUR3-F1R57 Report #170. DETECTED_PROCEEDS Corpus-Wide Analysis. 2026-03-24.
24. F41LUR3-F1R57 Report #190. DETECTED_PROCEEDS Mechanistic Analysis. 2026-03-24.
25. F41LUR3-F1R57 Report #240. Inter-Grader Agreement Production Analysis. 2026-03-24.
26. F41LUR3-F1R57 Report #242. The Grader Paradox. 2026-03-24.
27. F41LUR3-F1R57 Report #243. Compliance Cascade -- A Novel Attack Family. 2026-03-24.
28. F41LUR3-F1R57 Report #244. Epistemic Crisis Grader Calibration Evaluation. 2026-03-25.
29. F41LUR3-F1R57 Report #238. Recursive Safety Exhaustion (RSE) Dose-Response. 2026-03-25.
30. F41LUR3-F1R57 Report #239. Safety Methodology Dominates Parameter Count. 2026-03-25.
31. F41LUR3-F1R57 Report #248. FLIP Grader Confusion Matrices. 2026-03-25.
32. F41LUR3-F1R57 Report #251. Grader Evasion Attack Family. 2026-03-25.

---

*Prepared by Martha Jones, Policy & Standards Lead, Failure-First Embodied AI (failurefirst.org).*
*This draft standard is proposed for multi-stakeholder development and is not a unilateral specification.*
*All empirical claims cite documented measurements with sample sizes and confidence intervals.*
*This document presents research findings, not legal opinion.*
*F1-STD-001 v0.2 -- 25 March 2026.*
