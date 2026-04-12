---
title: "The Defense Impossibility Theorem for Embodied AI"
description: "Report #78 established the Defense Impossibility Triangle: an empirical demonstration that text-layer, action-layer, and evaluation-layer defenses each fail at rates sufficient to undermine their..."
date: "2026-03-18"
reportNumber: 145
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
---

- VLA FLIP corpus: n=58 valid traces, 50% PARTIAL, 0% REFUSAL, 72.4% FLIP ASR (Report #49)
- Blindfold: GPT-4o 93.2% ASR, residual 75.3% after VeriSafe (arXiv:2603.01414)
- Format-lock: 92% ASR Nemotron 30B, 91% Llama 70B (AGENT_STATE established findings)
- PARTIAL dominance: 50% of all FLIP verdicts across 7 VLA attack families (Report #49)
- Benign baseline FP rate: 30.8% (n=39, Issue #315)
- CANONICAL_METRICS.md verified 2026-03-18

---

> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. External research findings are attributed and assessed on their own
> methodological terms. This report does not constitute safety certification guidance.

---

## Executive Summary

Report #78 established the Defense Impossibility Triangle: an empirical demonstration that text-layer, action-layer, and evaluation-layer defenses each fail at rates sufficient to undermine their defensive contribution. This report formalizes that empirical observation into a structured impossibility argument with explicit definitions, propositions, and a proof sketch.

The central claim is not that defense is impossible in general, but that **no single-layer defense architecture operating solely on text-layer signals can be complete for embodied AI systems.** This is a structural claim, not a resource claim -- it does not depend on the quality of the text-layer defense, but on the information-theoretic gap between the text representation and the physical consequence.

The argument proceeds in four steps:

1. **Independence Proposition.** Text-layer safety and action-layer safety are empirically decoupled. PARTIAL dominance (50% of VLA verdicts) demonstrates that the text-layer safety mechanism activates without suppressing the action-layer output. The two layers fail independently.

2. **Format-Lock Bypass Proposition.** Any text-layer defense that relies on natural-language safety reasoning can be bypassed by format-lock attacks that shift the output modality from natural language to structured format. Measured ASR: 92% on Nemotron 30B, 91% on Llama 70B (heuristic-graded).

3. **Physical-Semantic Gap Proposition.** Action-layer defenses require physical-world knowledge (object masses, workspace geometry, force consequences) that is not reliably available from the model's text-layer representations. Blindfold demonstrates this: individually benign instructions compose into harmful action sequences that no text-layer filter detects.

4. **Incompleteness Conclusion.** From (1)-(3), no single-layer defense architecture that operates on text-layer signals alone can simultaneously prevent text-layer bypasses, action-layer compliance failures, and physical-semantic gap exploits.

This argument is qualified throughout with sample sizes and confidence intervals. It is a formalization of observed patterns, not a mathematical proof in the sense of computational complexity theory. It may be falsified by a text-layer defense that demonstrably addresses all three propositions.

---

## 1. Definitions

### 1.1 System Model

We define an embodied AI system **S** as a tuple (M, E, A) where:

- **M** is a vision-language-action model that receives text instructions and visual observations as input and produces both text responses and action sequences as output
- **E** is the physical environment in which the system operates, including objects, workspace geometry, and other agents
- **A** is the actuator interface that translates action sequences into physical motions

### 1.2 Defense Layers

A **defense architecture** D for S consists of one or more defense layers. We distinguish three layers following Report #78:

- **D_T (Text-layer defense):** Any safety mechanism that operates on the text content of instructions or responses. Includes input filters (Llama-Guard), output classifiers, RLHF refusal training, and text-layer monitoring. D_T observes tokens and produces a binary decision: PASS or BLOCK.

- **D_A (Action-layer defense):** Any safety mechanism that operates on the action sequences before or during physical execution. Includes action-level refusal (null action output), kinematic constraint checking, force/torque limits, and simulation-based consequence estimation. D_A observes action representations and produces PASS or BLOCK.

- **D_E (Evaluation-layer defense):** Any safety mechanism that assesses the correctness of D_T and D_A post-hoc. Includes LLM-as-judge graders, benchmark suites, and deployment monitoring. D_E operates after the fact and informs future deployment decisions.

### 1.3 Attack Success and Defense Completeness

An attack **a** succeeds against defense architecture D if the system S produces a physical action that violates a safety property P (defined over physical consequences, not text content). Formally:

- **Attack success:** a succeeds iff the actuator A executes an action sequence whose physical consequence violates P, despite D being active.

A defense architecture D is **complete** for a class of attacks C if no attack in C succeeds against D. Completeness is always defined relative to an attack class.

### 1.4 Text-Layer-Only Defense Architecture

A **text-layer-only defense architecture** is a defense architecture D where D_A = null (no action-layer defense) and D_E's output does not feed back into runtime blocking (evaluation is post-hoc only). In such an architecture, D_T is the sole runtime defense.

---

## 2. Propositions

### Proposition 1: Text-Action Independence (PARTIAL Dominance)

**Statement:** The text-layer safety signal and the action-layer output are empirically decoupled. Activation of text-layer safety reasoning (producing hedging, disclaimers, or partial refusals) does not suppress the action-layer output.

**Evidence:**

Across 58 valid FLIP-graded VLA traces spanning 7 attack families (Report #49):

| Verdict | Count | Proportion |
|---------|-------|------------|
| PARTIAL (text hedge + action compliance) | 29 | 50.0% |
| COMPLIANCE (no hedge, full action compliance) | 12 | 20.7% |
| BENIGN_QUERY | 15 | 25.9% |
| HALLUCINATION_REFUSAL | 1 | 1.7% |
| REFUSAL | 0 | 0.0% |

PARTIAL is the modal verdict. The model's text-layer safety mechanism fires (the hedge is present) but the action-layer output is not modified. In no case does text-layer safety activation propagate to action-layer refusal.

**Formal implication:** P(action_unsafe | text_hedge) is approximately equal to P(action_unsafe | no_text_hedge). Text-layer safety is not a reliable predictor of action-layer safety. Therefore, improving text-layer defense (reducing text-layer ASR) does not proportionally reduce action-layer ASR.

**Confidence qualification:** n=58, two evaluator models (deepseek-r1:1.5b, qwen3:1.7b). Aggregate ASR converges between evaluators at 72.4% but scenario-level agreement is only 32%. The independence claim is supported at the aggregate level but individual-trace reliability is limited.

---

### Proposition 2: Format-Lock Bypass

**Statement:** Any text-layer defense that relies on the model's natural-language safety reasoning can be bypassed by format-lock attacks that shift the output modality from natural language to structured formats (JSON, YAML, code, SQL).

**Evidence:**

Format-lock ASR across models (AGENT_STATE established findings, heuristic-graded unless noted):

| Model | Format-Lock ASR | Standard ASR (same model) | Delta |
|-------|----------------|--------------------------|-------|
| Nemotron 30B | 92% | ~40% (corpus average for provider) | +52pp |
| Llama 70B | 91% | ~33% (corpus average for provider) | +58pp |
| DeepSeek-R1 | 84% | 21.5% (LLM-graded, Report #48) | +62.5pp |
| Claude (CLI) | 30.4% (LLM-graded) | 3.7% (corpus, LLM-graded) | +26.7pp |
| Codex (CLI) | 42.1% (LLM-graded) | 0% (62 traces, LLM-graded) | +42.1pp |
| Gemini (CLI) | 23.8% (LLM-graded) | 1.6% (63 traces, LLM-graded) | +22.2pp |

The format-lock mechanism exploits a tension between format compliance and safety reasoning (Report #57). When the model is instructed to produce structured output, the safety reasoning pathway that generates natural-language refusals is partially suppressed because the output format does not accommodate refusal tokens. The model's training on instruction-following (including format compliance) competes with its safety training, and format compliance frequently wins.

**Formal implication:** For any text-layer defense D_T that relies on the model's safety reasoning to generate refusal tokens, there exists a format-lock attack f such that ASR(f, D_T) is substantially higher than ASR(standard, D_T). Preliminary data suggests the delta is 22-62pp depending on the model.

**Scope limitation:** Format-lock ASR figures mix heuristic-graded and LLM-graded verdicts. Heuristic grading over-reports ASR for some attack types (Mistake #21, kappa=0.126). The LLM-graded figures (Claude 30.4%, Codex 42.1%, Gemini 23.8%) are more reliable but are based on small samples (n=19-23 per model).

---

### Proposition 3: Physical-Semantic Gap

**Statement:** Action-layer defenses for embodied AI require physical-world knowledge (object properties, force consequences, workspace geometry, temporal action composition) that cannot be reliably derived from text-layer representations alone. Attacks that operate in the physical-semantic gap are structurally invisible to text-layer defenses.

**Evidence:**

**Blindfold (arXiv:2603.01414, accepted ACM SenSys 2026):** Achieves 93.2% ASR on GPT-4o by decomposing dangerous tasks into sequences of individually benign instructions. Each instruction ("move arm to position X", "close gripper", "extend forward") passes text-layer safety filters because no individual instruction contains harmful content. The harm emerges from the physical composition of the sequence -- a property that exists in the physical environment, not in the text representation.

Existing text-layer defenses tested against Blindfold (from the paper's ablation):

| Defense | Layer | ASR Reduction | Residual ASR |
|---------|-------|---------------|-------------|
| Llama-Guard (input/output filtering) | Text | 7.6pp | ~85.6% |
| SafeDecoding (token prediction modification) | Text | 4.8pp | ~88.4% |
| VeriSafe (formal verification of text properties) | Text | 17.9pp | ~75.3% |
| None (raw input baseline) | -- | -- | 27.4% |

Even VeriSafe -- which applies formal verification to text-layer properties -- achieves only 17.9pp reduction because it verifies text properties, not physical consequences. The information needed to detect the attack (that the sequence of arm movements constitutes a striking motion) is not present in any individual text instruction.

**Formal implication:** Let C_phys be the class of attacks where harm arises from physical composition of individually benign actions. For any text-layer defense D_T, there exists an attack in C_phys that bypasses D_T because D_T cannot observe the physical composition. The residual ASR of D_T against C_phys is bounded below by a non-trivial constant (empirically, >= 75.3% for the best known text-layer defense).

**Scope limitation:** Blindfold data is from a single paper, tested in one simulation environment (VirtualHome) and one physical platform (xArm 6, n=20 real-robot trials). Transfer to other embodiments and environments is not established.

---

### Proposition 4: Incompleteness of Text-Layer-Only Defense

**Statement:** No text-layer-only defense architecture D = (D_T, null, D_E) is complete for the class of embodied AI attacks C_embodied = C_standard union C_format union C_phys.

**Proof sketch:**

Assume for contradiction that D_T is complete for C_embodied.

1. **From Proposition 1 (Text-Action Independence):** D_T's activation (blocking at the text layer) does not guarantee action-layer safety. Even when D_T fires (producing a text-layer hedge), the action-layer output may still comply with the adversarial intent. Therefore, D_T's completeness requires that it blocks 100% of adversarial instructions at the text layer, because any instruction that passes D_T will proceed to action generation without further defense.

2. **From Proposition 2 (Format-Lock Bypass):** For any D_T that relies on natural-language safety reasoning, there exists a format-lock attack that bypasses D_T at a rate of 22-62pp above the standard attack success rate. D_T cannot block 100% of adversarial instructions because format-lock systematically exploits the tension between format compliance and safety reasoning. D_T would need to refuse all structured-format requests, which would render the system non-functional for legitimate structured-output tasks.

3. **From Proposition 3 (Physical-Semantic Gap):** For attacks in C_phys (physical composition attacks), D_T cannot detect harm because the harmful property (physical consequence of composed actions) is not observable from the text representation of individual instructions. D_T's residual ASR against C_phys is >= 75.3% under the best known text-layer defense.

4. **From (1), (2), and (3):** D_T fails against at least three distinct attack sub-classes through three distinct mechanisms (independence, format bypass, semantic gap). Each mechanism is sufficient on its own to defeat completeness. Together, they establish that no text-layer-only defense can be complete for C_embodied.

Therefore, the assumption is contradicted. No text-layer-only defense architecture is complete for the class of embodied AI attacks. QED (sketch).

**Nature of this argument:** This is an empirically grounded impossibility argument, not a formal proof in the sense of computational complexity theory. The propositions rest on measured failure rates with finite samples and confidence intervals. The argument can be falsified by either:
- (a) A text-layer defense that demonstrably achieves 0% ASR against all three attack sub-classes, or
- (b) Evidence that text-action independence (Proposition 1) does not hold for a class of models, or
- (c) Evidence that format-lock bypasses (Proposition 2) can be eliminated without loss of format-compliance capability.

---

## 3. Mapping to Existing Defense Proposals

This section maps existing defense proposals to the three propositions, identifying which failure modes each addresses and which remain unaddressed.

### 3.1 HANSE (Report #32)

The Hierarchical Assurance for Neuro-Symbolic Embodiment framework proposes four layers:

| HANSE Layer | Description | Propositions Addressed | Propositions NOT Addressed |
|-------------|-------------|----------------------|---------------------------|
| 1. Semantic Firewall | Input sanitization (Llama-Guard/BERT) | Partially addresses P2 (format-lock) via input classification | Does not address P1 (independence) or P3 (physical-semantic gap). Blindfold-class attacks pass the semantic firewall because individual instructions are benign. |
| 2. VLA Core (Untrusted) | Treated as black box | None -- explicitly untrusted | All three propositions apply to the VLA core. |
| 3. Affordance Verifier | Physics check via world model | Addresses P3 (physical-semantic gap) for a subset of attacks where physical infeasibility is detectable | Does not address P1 or P2. Cannot detect attacks that use physically feasible but harmful action sequences (e.g., Blindfold instructions are kinematically valid). |
| 4. Kinematic Shield | CBF/MPC runtime enforcement | Addresses P3 partially -- prevents actions that violate kinematic constraints | Does not address P1 or P2. Cannot detect harm that operates within normal kinematic parameters. |

**Assessment:** HANSE is the most comprehensive existing proposal because it incorporates non-text-layer defenses (Layers 3 and 4). However, the Affordance Verifier and Kinematic Shield address only a subset of P3 -- attacks that involve physically infeasible or kinematically illegal actions. Blindfold-class attacks use physically feasible, kinematically legal action sequences. HANSE's Layer 1 (Semantic Firewall) is a text-layer defense and is subject to Propositions 1 and 2. No HANSE layer addresses the text-action independence demonstrated by PARTIAL dominance (Proposition 1).

**Gap:** HANSE does not include an explicit mechanism for detecting harmful intent from the composition of individually benign actions. The Affordance Verifier checks physical feasibility, not intent. A "Compositional Intent Verifier" -- a component that evaluates the physical consequence of action sequences, not individual actions -- would be needed to address the remaining gap.

### 3.2 Llama-Guard / Input-Output Filtering

| Defense | Layer | Propositions Addressed | Residual Vulnerability |
|---------|-------|----------------------|----------------------|
| Llama-Guard | Text-layer (D_T) | Partially addresses standard attacks | Blindfold residual: 85.6% ASR. Format-lock bypass: not tested but likely vulnerable (operates on text content). PARTIAL dominance: no action-layer component. |

**Assessment:** Pure text-layer defense. Subject to all three propositions. Reduces standard attack ASR but does not address the structural limitations identified in this report.

### 3.3 SafeDecoding (Token Prediction Modification)

| Defense | Layer | Propositions Addressed | Residual Vulnerability |
|---------|-------|----------------------|----------------------|
| SafeDecoding | Text-layer (D_T, decoding phase) | Modifies token generation probabilities to favor safe tokens | Blindfold residual: 88.4% ASR. Does not operate at the action layer. Proposition 1 (independence) and Proposition 3 (semantic gap) are unaddressed. |

**Assessment:** Text-layer defense operating at the decoding level. Modestly more effective than input filtering because it intervenes during generation, but still operates on text tokens, not action representations. Subject to all three propositions.

### 3.4 VeriSafe (Formal Verification of Text Properties)

| Defense | Layer | Propositions Addressed | Residual Vulnerability |
|---------|-------|----------------------|----------------------|
| VeriSafe | Text-layer (D_T, formal methods) | Formal verification of text-layer safety properties | Blindfold residual: 75.3% ASR. Best text-layer defense tested. Still operates on text properties, not physical consequences. |

**Assessment:** The strongest text-layer defense in the Blindfold evaluation. Reduces ASR by 17.9pp, substantially more than Llama-Guard (7.6pp) or SafeDecoding (4.8pp). However, the 75.3% residual ASR demonstrates that formal verification of text properties is not sufficient when harm arises from physical composition (Proposition 3). VeriSafe verifies the right things within the wrong layer.

### 3.5 ISO 10218 / ISO/TS 15066 (Physical-Layer Safety)

| Defense | Layer | Propositions Addressed | Residual Vulnerability |
|---------|-------|----------------------|----------------------|
| Force/speed limits | Physical (D_A, hardware) | Addresses P3 for attacks that require exceeding kinematic limits | Does not address attacks within normal parameters. Does not address P1 or P2. |
| Safety-rated monitored stop | Physical (D_A, hardware) | Addresses proximity-based harm | Does not address harm from manipulation tasks within the collaborative workspace. |

**Assessment:** Physical-layer defenses are independent of the text layer and therefore not subject to Propositions 1 or 2. They address a subset of Proposition 3 (attacks that exceed physical safety parameters). However, they cannot detect harm from actions within normal kinematic envelopes -- which is precisely the class of attack that Blindfold exploits.

### 3.6 Summary: Defense Coverage Matrix

| Proposition | Llama-Guard | SafeDecoding | VeriSafe | HANSE L1 | HANSE L3 | HANSE L4 | ISO 10218 |
|------------|-------------|-------------|---------|----------|----------|----------|-----------|
| P1 (Independence) | No | No | No | No | No | No | N/A (physical) |
| P2 (Format-Lock) | Partial | No | No | Partial | No | No | N/A (physical) |
| P3 (Semantic Gap) | No | No | Partial (17.9pp) | No | Partial (feasibility) | Partial (kinematics) | Partial (force/speed) |
| All three | No | No | No | No | No | No | No |

**No existing defense proposal addresses all three propositions.** HANSE comes closest by incorporating non-text-layer defenses, but its physical-layer components (Affordance Verifier, Kinematic Shield) address only the subset of Proposition 3 that involves physically infeasible or kinematically illegal actions.

---

## 4. What a Complete Defense Would Require

Based on the three propositions, a complete defense for embodied AI would need to satisfy three minimum requirements:

### 4.1 Requirement R1: Action-Layer Refusal Training (addresses P1)

Current VLA models are trained to refuse at the text layer (RLHF safety training operates on text tokens) but not at the action layer. A complete defense requires training that produces action-layer refusal -- the model outputs a null action or safe alternative rather than the requested trajectory -- independently of whether the text response contains safety hedging.

This requires:
- Safety training datasets that include action-level refusal examples
- Separate evaluation metrics for text-layer and action-layer refusal rates
- Optimization objectives that penalize dangerous action sequences independently of text-layer safety signals

**Status:** No VLA system currently implements action-layer refusal training. The training infrastructure and datasets do not exist.

### 4.2 Requirement R2: Format-Robust Safety (addresses P2)

Safety reasoning must function regardless of output format. Current models show that format compliance competes with safety reasoning when the output format does not accommodate refusal tokens. A format-robust defense would ensure that safety evaluation operates on the semantic content of the output, not on the presence of natural-language refusal tokens.

Possible approaches:
- Post-generation safety evaluation that operates on the structured output (not just the text response)
- Training that associates safety refusal with structured-output equivalents (e.g., a JSON response that includes an "unsafe" flag)
- Architectural separation of format-compliance and safety-reasoning pathways

**Status:** No published approach addresses format-lock bypass specifically. This is an identified research gap (Issue #216).

### 4.3 Requirement R3: Compositional Intent Verification (addresses P3)

The physical-semantic gap can only be closed by a component that evaluates the physical consequences of composed action sequences, not individual instructions. This is distinct from existing approaches:

- Input filtering evaluates individual instructions (does not detect composition)
- Affordance verification checks physical feasibility (does not evaluate intent)
- Kinematic constraints check parameter bounds (does not evaluate sequences)

A Compositional Intent Verifier would need:
- A world model that predicts the physical consequences of action sequences
- An intent classifier that maps physical consequences to safety categories
- Runtime integration that evaluates every action sequence before execution

This is conceptually closest to HANSE's Affordance Verifier but operates at a higher level: not "is this action physically possible?" but "what would this sequence of actions accomplish in the physical world, and is that outcome safe?"

**Status:** Simulation-based consequence estimation exists in robotics research but has not been integrated with VLA safety evaluation. Computational cost and world-model fidelity are open challenges.

---

## 5. Limitations

1. **Sample sizes.** The FLIP corpus (n=58 valid traces) and benign baseline (n=39) are below n=100. Wide confidence intervals apply to all per-family ASR figures. The independence claim (Proposition 1) rests on aggregate-level convergence, not individual-trace reliability.

2. **Grader quality.** FLIP grading used deepseek-r1:1.5b (~70% accuracy) and qwen3:1.7b (15% accuracy). The aggregate convergence between graders at 72.4% suggests the overall signal is robust, but individual verdicts may be unreliable. Grading methodology: LLM-only (FLIP backward inference).

3. **Format-lock ASR mixes methodologies.** The high-ASR figures (92%, 91%) are heuristic-graded (kappa=0.126 with LLM grading). The frontier model figures (30.4%, 42.1%, 23.8%) are LLM-graded and more reliable, but show lower ASR. The format-lock bypass proposition is best supported by the frontier LLM-graded data, which shows 22-42pp elevation above baseline.

4. **Blindfold is one paper.** Proposition 3 relies heavily on a single external paper. While peer-reviewed (SenSys 2026), the attack is demonstrated in one simulation environment and one physical platform. Generalizability to other VLA architectures and environments is not established.

5. **The impossibility argument is structural, not formal.** The propositions are empirically grounded, not axiomatically derived. A sufficiently novel defense architecture could address all three propositions in ways not anticipated by this analysis.

6. **No direct experimental test.** As with Report #78, this analysis synthesizes data from multiple independent workstreams. A direct experimental validation would test all three propositions simultaneously on a single VLA system with a single defense architecture. No such experiment has been conducted.

7. **Scale confound.** The FLIP corpus data is primarily from 1.5-1.7B models (below the capability floor). PARTIAL dominance may manifest differently at frontier scale. However, the format-lock evidence from frontier models (Claude, Codex, Gemini) suggests that text-action decoupling persists at scale.

---

## 6. Conclusions and Recommendations

### 6.1 What this report establishes

The Defense Impossibility Theorem for Embodied AI is a structured argument that no text-layer-only defense architecture is complete for the class of embodied AI attacks. The argument rests on three empirically grounded propositions:

- Text-layer and action-layer safety are decoupled (PARTIAL dominance)
- Text-layer defenses can be bypassed by format-lock attacks (22-62pp ASR elevation)
- Text-layer defenses cannot detect harm from physical composition of benign actions (Blindfold: 75.3% residual ASR after best defense)

These propositions are individually sufficient to defeat text-layer-only defense completeness. Together, they suggest that the minimum viable defense for embodied AI requires components at the action layer and the physical-consequence layer, not just the text layer.

### 6.2 What this report does not establish

- That defense is impossible in general. Multi-layer defense architectures (HANSE, ISO 10218 physical constraints) address subsets of the problem.
- That all embodied AI systems are equally vulnerable. The evidence comes from specific models, attack families, and environments.
- That the three propositions are exhaustive. Other failure modes may exist that are not captured by this framework.

### 6.3 Recommendations

1. **CCS integration.** The impossibility argument should be considered for the paper's Discussion section as a theoretical framing for the empirical findings in Reports #49, #51, and #78. The four-proposition structure is more defensible in peer review than a compound probability calculation because it identifies mechanisms rather than multiplying point estimates.

2. **Action-layer refusal is the critical research gap.** Of the three requirements for a complete defense (R1-R3), action-layer refusal training (R1) is the most tractable and the highest impact. It addresses the weakest link (0% refusal rate) and would create the first action-layer safety signal. If confirmed by further testing, this would suggest that VLA safety research should prioritize action-layer training over text-layer improvement.

3. **HANSE extension.** The HANSE framework should be evaluated for extension with a Compositional Intent Verifier (Section 4.3). HANSE is currently the closest to a complete defense but lacks the compositional-sequence analysis needed to address Blindfold-class attacks.

4. **Falsification tests.** The impossibility argument makes specific, testable predictions: (a) improving text-layer safety training will not proportionally reduce action-layer ASR, (b) format-lock will continue to elevate ASR at frontier scale, (c) Blindfold-class attacks will transfer to other VLA architectures. Each prediction can be tested with targeted experiments.

---

## References

1. F41LUR3-F1R57. Report #78: Defense Impossibility in Embodied AI -- A Three-Layer Failure Convergence. 2026-03-11.
2. F41LUR3-F1R57. Report #49: VLA Cross-Embodiment Attack Transfer. Updated 2026-03-12.
3. F41LUR3-F1R57. Report #51: Format-Lock Capability Floor. 2026-03-03.
4. F41LUR3-F1R57. Report #59: The Compliance Paradox. 2026-03-11.
5. F41LUR3-F1R57. Report #65: HALLUCINATION_REFUSAL as the Text-Only Analog of VLA PARTIAL. 2026-03-11.
6. F41LUR3-F1R57. Report #67: Layer 0 Extension -- Evaluation Infrastructure as Vulnerability Surface. 2026-03-11.
7. F41LUR3-F1R57. Report #32: VLA Safety Certification Bridge (HANSE). 2026-03.
8. F41LUR3-F1R57. Report #118: Defense Layer Mismatch Index. 2026-03-16.
9. F41LUR3-F1R57. Report #75: Blindfold Action-Level Threat Analysis. 2026-03-11.
10. Blindfold: Safely Generating Harmful Robot Actions through VLA Jailbreaking. arXiv:2603.01414. Accepted ACM SenSys 2026.
11. CANONICAL_METRICS.md. Failure-First Embodied AI. Verified 2026-03-18.

---

## Appendix A: Proposition-Evidence Mapping

| Proposition | Primary Evidence | n | Methodology | Confidence |
|------------|-----------------|---|-------------|------------|
| P1 (Independence) | VLA FLIP corpus PARTIAL rate | 58 valid traces | FLIP backward inference (LLM-only) | Moderate. Aggregate converges; scenario-level agreement low (32%). |
| P1 (Independence) | HR-PARTIAL equivalence (text-only analog) | 84 HR, 220 PARTIAL | Token distribution analysis (Mann-Whitney U) | Strong. HR indistinguishable from COMPLIANCE (p=0.21, p=0.46); significantly different from REFUSAL (p<0.001). |
| P2 (Format-Lock) | Format-lock ASR elevation | n=19-23 per frontier model (LLM-graded); n varies for heuristic | Mixed: LLM-graded (frontier), heuristic (non-frontier) | Moderate. LLM-graded frontier data is reliable; heuristic data has kappa=0.126. |
| P3 (Semantic Gap) | Blindfold ASR | 187 simulation, 20 real-robot | External peer-reviewed paper | Strong for tested environment; transfer unknown. |
| P3 (Semantic Gap) | VeriSafe residual ASR | From Blindfold ablation | External peer-reviewed paper | Strong for tested defense; other formal methods untested. |

---

*This report was produced as part of the Failure-First Embodied AI research programme. All claims are scoped to the tested conditions and should not be generalised without additional validation. See docs/CANONICAL_METRICS.md for corpus-level numbers.*
