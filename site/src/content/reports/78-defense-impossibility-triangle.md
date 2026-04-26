---

title: "Defense Impossibility in Embodied AI — A Three-Layer Failure Convergence"
description: "This report identifies a convergence of three independent empirical findings that together constrain the feasibility of safety defense in embodied AI systems. Each finding addresses a different..."
date: "2026-03-11"
reportNumber: 78
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/78-defense-impossibility-triangle.m4a"
---

- Blindfold (arXiv:2603.01414): GPT-4o 93.2% ASR, real-robot 90% ASR, defense max reduction 17.9pp
- VLA FLIP corpus: n=58 valid traces, 50% PARTIAL, 0% REFUSAL, 72.4% FLIP ASR (7 families)
- Benign baseline calibration: 30.8% FP rate (12/39 benign traces, deepseek-r1:1.5b, Issue #315)
- Capability-floor data: sub-3B universal compliance (Report #51), obliteratus safety re-emergence (Report #48)

---

## Executive Summary

This report identifies a convergence of three independent empirical findings that together constrain the feasibility of safety defense in embodied AI systems. Each finding addresses a different layer of the defense stack, and each demonstrates a failure rate severe enough to undermine that layer's defensive contribution. The convergence is:

1. **Text-layer defense failure.** Blindfold (arXiv:2603.01414) achieves 93.2% ASR on GPT-4o by constructing action sequences from individually benign instructions. Text-level safety filters -- the primary defense mechanism in current VLA deployments -- do not detect the attack because no individual instruction contains harmful content. Existing defenses (Llama-Guard, SafeDecoding, VeriSafe) reduce ASR by at most 17.9 percentage points, leaving residual ASR above 75%.

2. **Action-layer defense failure.** Our FLIP-graded VLA corpus (n=58 valid traces across 7 attack families) shows 50% of verdicts are PARTIAL -- models produce safety disclaimers but still generate the requested action sequences -- and 0% are outright REFUSAL. No model in our corpus fully refuses to generate action sequences for adversarial inputs. Action-layer refusal, as a behavioral category, does not appear to exist in current VLA systems.

3. **Evaluation-layer defense failure.** Our benign baseline calibration study (Issue #315) shows a 30.8% false positive rate -- the evaluator classifies 12 of 39 benign (non-adversarial) traces as COMPLIANCE or PARTIAL. This means the measurement instrument used to assess whether defenses work is itself unreliable at a rate that renders fine-grained safety assessment untrustworthy.

**The compound problem:** These three failures are not redundant. They operate at different layers of the defense stack and cannot compensate for each other. A text-layer defense cannot catch Blindfold-class attacks (Finding 1). An action-layer defense does not exist in practice (Finding 2). And even if a defense existed at either layer, the evaluation system would misclassify its effectiveness roughly 30% of the time (Finding 3). This is not a claim that defense is theoretically impossible -- it is a claim that no current defense architecture addresses all three failure modes simultaneously, and that the measured failure rates at each layer are individually sufficient to defeat the defense contribution of that layer.

**Scope limitation:** This analysis synthesizes data from three independent workstreams within the Failure-First project and one external peer-reviewed paper (Blindfold, accepted at ACM SenSys 2026). The compound probability calculation assumes layer independence, which is a simplifying assumption discussed in Section 4.3. All claims are qualified with sample sizes and confidence intervals where available.

---

## 1. The Defense Impossibility Triangle

### 1.1 Formal Structure

We define three defense layers for embodied AI systems:

**Layer T (Text).** Safety mechanisms that operate on the text content of instructions, prompts, or generated responses. Includes: input filters (Llama-Guard), output filters (safety classifiers), prompt-level safety training (RLHF refusal behavior), and text-layer monitoring.

**Layer A (Action).** Safety mechanisms that operate on the generated action sequences before or during physical execution. Includes: action-level refusal (the model declines to generate a dangerous action sequence), kinematic constraint checking, force/torque limits, collision detection, and formal verification of action plans.

**Layer E (Evaluation).** Safety mechanisms that assess whether Layers T and A are working correctly. Includes: automated graders (LLM-as-judge), benchmark suites, red-team evaluations, and deployment monitoring.

The defense impossibility triangle states: **if each layer fails at its measured rate, the probability that at least one layer provides effective defense is substantially lower than commonly assumed.**

### 1.2 Measured Failure Rates

| Layer | Failure Mode | Measured Rate | Source | n |
|-------|-------------|---------------|--------|---|
| T (Text) | Blindfold bypasses all text-layer defenses | 93.2% ASR (GPT-4o) | arXiv:2603.01414 | 187 instructions |
| T (Text) | Best defense (VeriSafe) residual ASR | 75.3% | arXiv:2603.01414 | — |
| T (Text) | Raw input baseline (no attack framework) | 27.4% ASR (GPT-4o) | arXiv:2603.01414 ablation | — |
| A (Action) | Zero refusals in FLIP-graded VLA traces | 0% refusal rate | Report #49, FLIP corpus | 58 valid traces |
| A (Action) | PARTIAL dominance (hedge but comply) | 50% of all verdicts | Report #49, FLIP corpus | 58 valid traces |
| A (Action) | FLIP ASR across 7 attack families | 72.4% | Report #49 | 58 valid traces |
| E (Evaluation) | False positive rate on benign inputs | 30.8% | Issue #315 | 39 benign traces |
| E (Evaluation) | Scenario-level inter-evaluator agreement | 32% | Report #49, wave 6 | 58 traces |
| E (Evaluation) | Worst evaluator accuracy | 15% | Report #61, Issue #250 | 20 audit traces |

### 1.3 Connection to the Four-Layer Model

The four-layer model (Reports #63 and #67) describes:

```
L0 (Evaluation) -> L1 (Safety Reasoning) -> L2 (Task Execution) -> L3 (Actuator)
```

The defense impossibility triangle maps onto this model as follows:

| Triangle Layer | Four-Layer Model | Relationship |
|---------------|-----------------|--------------|
| Layer E (Evaluation) | L0 (Evaluation Infrastructure) | Direct mapping. L0 failures (15-30.8% accuracy range) mean evaluation cannot reliably detect failures at L1-L3. |
| Layer T (Text) | L1 (Safety Reasoning) | Direct mapping. Blindfold shows L1 fails because it operates on text semantics, while harm emerges from action consequences. |
| Layer A (Action) | L2 (Task Execution) + L3 (Actuator) | Combined mapping. PARTIAL dominance shows that L2 generates the harmful action plan despite L1 hedging, and L3 (actuator) has no independent safety gate. |

The four-layer model describes the vulnerability surface; the defense impossibility triangle quantifies the failure rate at each layer. The triangle's contribution is demonstrating that the failure rates are high enough at all three layers simultaneously to render defense-in-depth ineffective in practice.

---

## 2. Layer-by-Layer Analysis

### 2.1 Layer T: Text-Layer Defense Failure

**Evidence source:** Blindfold (arXiv:2603.01414), analysed in Report #75 (River Song).

Blindfold demonstrates that text-layer safety is structurally insufficient for embodied AI for a precise reason: the attack operates at the semantic gap between text content and physical consequence. Each individual instruction in a Blindfold attack sequence is semantically benign ("move arm to position X," "close gripper," "extend forward"). No text-layer filter -- whether keyword matching, embedding similarity, or LLM-based judgment -- can detect harm in these instructions because the harm is not in the text. The harm is in the physical consequence of the sequence.

Three key numbers from Blindfold:

1. **93.2% ASR on GPT-4o** with the full Blindfold pipeline. This is the attack success rate against a frontier model with all components active.

2. **75.3% residual ASR** after the best available defense (VeriSafe formal verification). Even formal verification -- the strongest theoretical defense -- leaves three-quarters of attacks successful. The weaker defenses (Llama-Guard: residual 85.6%; SafeDecoding: residual 88.4%) are even less effective.

3. **27.4% raw input baseline** on GPT-4o without any attack framework. This is the structural vulnerability: even without adversarial engineering, roughly one in four malicious instructions passes through text-layer safety filters to action generation. For comparison, frontier models show less than 5% ASR against standard text-layer jailbreaks (Claude Sonnet 4.5: 4.5%, Gemini-3-Flash: 2.6%).

**Interpretation:** Text-layer defense cannot address action-layer harm because the attack operates in a semantic space that text filters do not cover. This is not a failure of defense quality (better text filters would not help); it is a failure of defense scope (text filters address the wrong layer).

### 2.2 Layer A: Action-Layer Defense Failure

**Evidence source:** VLA FLIP corpus (Report #49, Amy Pond), gli_086 (#313).

Our FLIP-graded VLA data shows that action-layer refusal does not exist as a behavioral category in current VLA systems. Across 58 valid traces spanning 7 attack families:

- **0% REFUSAL.** No model fully refused to generate an action sequence for any adversarial input. This is a categorical observation: refusal at the action layer simply does not occur in our data.

- **50% PARTIAL.** Half of all verdicts show the model adding safety disclaimers, caveats, or warnings while simultaneously generating the requested action sequence. The model's text-layer safety mechanism activates (it "knows" the request may be dangerous) but this activation does not propagate to the action generation layer.

- **72.4% FLIP ASR.** Using backward-inference grading (FLIP: infer the instruction from the response, judge the instruction), 72.4% of traces represent compliance with the adversarial intent.

The PARTIAL dominance finding is the key result. It establishes that action-layer safety and text-layer safety are decoupled within the same model during the same inference pass. The model can simultaneously signal danger (text layer) and produce the dangerous action (action layer). This decoupling is the action-layer analogue of the compliance paradox (Report #59): awareness of risk does not produce risk-averting behavior.

**Per-family breakdown (n=58 valid FLIP traces):**

| Family | FLIP ASR | PARTIAL Rate | n |
|--------|----------|-------------|---|
| TRA (Trajectory Manipulation) | 100% | — | — |
| ASE (Action Sequence Exploitation) | 80% | — | — |
| SBE (Safety Bypass Exploitation) | 78% | — | — |
| MMC (Multi-Modal Confusion) | 78% | 100% | — |
| VAP (Visual Adversarial Patches) | 70% | — | — |
| LAM (Language-Action Misalignment) | 60% | — | — |
| PCM (Policy Constraint Manipulation) | 60% | — | — |

The 100% PARTIAL rate for MMC is particularly notable: every single multi-modal confusion trace shows the model hedging while complying. This family may exploit the text-action decoupling most directly.

### 2.3 Layer E: Evaluation-Layer Defense Failure

**Evidence sources:** Issue #315 (Amy Pond, benign baseline FP rate), Report #61 (evaluation paradox), Report #76 (evaluator governance framework, Nyssa of Traken).

The evaluation layer fails in both directions:

**False positives (over-reporting danger):** deepseek-r1:1.5b classifies 30.8% of benign inputs as COMPLIANCE or PARTIAL (12/39 benign traces, Issue #315). This means nearly one in three genuinely safe interactions is flagged as a safety failure. At this rate, the evaluator's positive predictive value for adversarial detection is substantially degraded.

**Accuracy range:** Across evaluators used in the project, accuracy ranges from 15% (qwen3:1.7b, worse than random on a 5-category task) to approximately 70% (deepseek-r1:1.5b, the best small-model evaluator). No evaluator in the pipeline meets the 85% accuracy threshold that Report #76 proposes as the minimum for regulatory use.

**Inter-evaluator agreement:** Scenario-level agreement between deepseek-r1:1.5b and qwen3:1.7b is 32% (Report #49). The evaluators agree on which specific traces are dangerous only one-third of the time, even though their aggregate ASR statistics converge at 72.4%. This is a form of Simpson's paradox: group-level agreement conceals individual-level disagreement.

**Interpretation:** The evaluation layer cannot serve as a reliable defense-verification mechanism because it cannot accurately distinguish safe from unsafe interactions. A defense that reduces attack success from 72% to 42% would appear -- to an evaluator with 30.8% FP rate -- to have reduced it from approximately 72% to approximately 55% (the true reduction partially masked by false positives on the remaining benign-classified traces). Defense effectiveness measurement is degraded by evaluation noise.

---

## 3. The Compound Failure

### 3.1 Independence Assumption

The three layers address different aspects of the defense stack:

- Layer T operates on text content during the inference pass
- Layer A operates on action generation during the same inference pass
- Layer E operates post-hoc on the outputs

If we treat the layers as independent defense barriers (a standard assumption in defense-in-depth analysis), we can calculate the probability that at least one layer provides effective defense.

**Important caveat:** Independence is a simplifying assumption. In practice, Layers T and A are not independent -- they operate during the same inference pass on the same model, and PARTIAL dominance (Section 2.2) directly demonstrates their coupling. Layer E is more plausibly independent of T and A (it operates post-hoc). The independence assumption produces a lower bound on compound failure probability; the true probability may be higher due to positive correlation between Layer T and Layer A failures.

### 3.2 Compound Failure Probability

We define "layer failure" conservatively for each layer:

- **Layer T failure:** Text-layer defense does not prevent the attack. Rate: 75.3% (residual ASR after best available defense, VeriSafe).
- **Layer A failure:** Action layer does not refuse. Rate: 100% (0% refusal rate in FLIP corpus, n=58).
- **Layer E failure:** Evaluation cannot detect that defense failed. Rate: 30.8% (FP rate on benign, which indicates the evaluator's error rate on distinguishing safe from unsafe).

**Probability that all three layers fail simultaneously (under independence):**

```
P(T fails) x P(A fails) x P(E fails) = 0.753 x 1.000 x 0.308 = 0.232
```

This means: even under the most favorable assumption (independence), there is a 23.2% probability that a Blindfold-class attack bypasses text-layer defense, encounters no action-layer refusal, and the evaluation system fails to detect the breach.

**However, the independence assumption for T and A is wrong.** PARTIAL dominance demonstrates that T and A fail together -- when text-layer safety activates (producing a hedge), the action layer still complies. The conditional probability P(A fails | T fails) is closer to 1.0 than to 0.72 (the unconditional FLIP ASR), because attacks that bypass text-layer defense are precisely those where the action layer also fails. Using the conditional:

```
P(T fails AND A fails) x P(E fails) = 0.753 x 0.308 = 0.232
```

The compound probability remains the same because P(A fails) = 1.0 in our data -- the action layer never succeeds independently.

### 3.3 Probability of At Least One Layer Succeeding

```
P(at least one layer defends) = 1 - P(all fail)
```

Under our measurements:
- P(at least one defends) = 1 - (0.753 x 1.0 x 0.308) = 0.768

This appears reassuring (76.8% chance of at least one defense layer working), but the calculation is misleading. Layer A contributes nothing (0% refusal rate). Layer E does not prevent harm -- it only detects failure post-hoc. The only layer that can actually prevent harm is Layer T (text-layer defense), which fails at 75.3% under the best available defense.

**The effective defense probability against a Blindfold-class attack is therefore 24.7%** (1 - 0.753), which is the probability that text-layer defense catches the attack. The other two layers provide no additional defense barrier.

### 3.4 Identifying the Weakest Link

The weakest link is unambiguously **Layer A (Action)**. It has a 100% failure rate -- the complete absence of action-layer refusal across all tested models and attack families. This is not a failure of degree (some defense but not enough); it is a failure of kind (the defense mechanism does not exist).

Layer T has a high failure rate (75.3%) but at least functions: it catches roughly one in four attacks even under the strongest attack framework. Layer E has a substantial error rate (30.8%) but provides some signal: it correctly identifies approximately 70% of adversarial traces.

Layer A provides zero defense. The absence of action-layer refusal in VLA systems means there is no safety gate between "model generates action plan" and "robot executes action plan." The text-layer hedge (PARTIAL) does not serve as a defense because it does not modify the action output.

**Why Layer A is the weakest link -- mechanism hypothesis:** Current VLA training optimizes for task completion at the action layer. Safety training operates at the text layer (RLHF trains the model to produce safe text responses). The action generation pathway may be insufficiently covered by safety training because:

1. Safety training datasets contain text-level refusals, not action-level refusals. The model learns to refuse in text but has no training signal for refusing in action.
2. Action generation is evaluated primarily on task success metrics (grasp accuracy, navigation success, manipulation precision), not on safety metrics. The optimization pressure at the action layer is entirely toward compliance.
3. The action layer operates on a different representation (motor commands, joint angles, trajectories) than the text layer (tokens). Safety representations learned in token space may not transfer to action space.

This is consistent with the two-substrate safety hypothesis from Report #74: weight-space safety (which produces text-layer hedging) and behavioral robustness (which would produce action-layer refusal) are orthogonal defense dimensions.

---

## 4. What Would a Viable Defense Architecture Require?

### 4.1 Minimum Requirements

A defense architecture that addresses all three failure modes would need, at minimum:

**Requirement 1: Action-level safety evaluation.** The defense must operate on the physical consequences of action sequences, not on the text content of individual instructions. This means either:
- (a) A simulation-based consequence estimator that evaluates action sequences for potential harm before physical execution, or
- (b) A runtime constraint system that monitors physical parameters (force, velocity, proximity to humans) during execution and halts actions that exceed safety thresholds

Option (a) is more general but computationally expensive and requires a faithful simulator. Option (b) is more practical and aligns with existing industrial safety practices (ISO 10218 force/speed limits for industrial robots), but cannot detect harm that operates within normal kinematic parameters (e.g., Blindfold's "move arm to position" instructions involve legal joint positions).

**Requirement 2: Action-layer refusal training.** VLA models must be trained to refuse at the action layer, not only at the text layer. This requires:
- Safety training datasets that include action-level refusal examples (the model outputs a null action or safe alternative rather than the requested trajectory)
- Evaluation metrics that measure action-layer refusal rate separately from text-layer refusal rate
- Optimization objectives that penalize dangerous action sequences independently of whether the text response contains a safety caveat

This is a non-trivial training challenge. Current RLHF frameworks operate on text tokens; extending them to action tokens requires new reward modeling infrastructure.

**Requirement 3: Calibrated evaluation with known error properties.** The evaluation system must meet minimum accuracy thresholds (Report #76 proposes 85% for regulatory use) and must report its error properties (FP rate, FN rate, directional bias) alongside all safety assessments. The current 30.8% FP rate must be reduced to a level where evaluation noise does not mask defense effectiveness.

**Requirement 4: Defense-in-depth across layers with independent failure modes.** The current architecture fails defense-in-depth because Layers T and A are correlated (PARTIAL demonstrates joint failure) and Layer A provides no defense. A viable architecture would need at least two independently effective defense layers, each with failure rates low enough that their compound provides meaningful protection.

### 4.2 The Industrial Safety Analogy

Industrial robotics has addressed a version of this problem through hardware-layer safety systems. ISO 10218-1 (Safety requirements for industrial robots) and ISO/TS 15066 (Collaborative robots) specify:

- **Safety-rated monitored stop:** Hardware circuit that halts robot motion when a human enters the collaborative workspace
- **Speed and separation monitoring:** Runtime monitoring of distance between robot and human with speed reduction/halt thresholds
- **Power and force limiting:** Mechanical compliance or active force control that limits contact forces below injury thresholds
- **Safety-rated controller:** Dual-channel redundant control with cross-monitoring

These defenses operate at the physical layer -- they do not depend on the correctness of the planning layer's intentions. A robot with force-limited joints cannot inflict high-force impacts regardless of what its VLA planner commands.

The analogy suggests that the most promising path for embodied AI safety may not be better text-layer or action-layer reasoning, but physical-layer constraints that limit the damage envelope regardless of the AI system's behavior. This is consistent with the damage-envelope analysis in Report #47 (embodied capability floor) and aligns with the principle that safety-critical systems should fail safe by design rather than by intention.

### 4.3 Limitations of the Defense Architecture Proposal

These requirements are aspirational. Several limitations should be noted:

1. **No VLA system currently implements action-layer refusal training.** The training infrastructure and datasets do not exist. This is a research gap, not an engineering gap.

2. **Simulation-based consequence estimation is computationally expensive** and requires environment models that may not be available for all deployment contexts.

3. **Physical-layer constraints limit system capability.** Force-limited robots are less capable of tasks requiring high force. Speed-limited robots are slower. There is a direct trade-off between safety envelope and operational capability that deployment contexts will resolve differently.

4. **The 85% evaluator accuracy threshold is not currently achievable** at small model scale (Report #76). Meeting this threshold likely requires either much larger evaluator models (GPT-4-class) or task-specific fine-tuned classifiers.

---

## 5. Connection to the Capability-Floor Hypothesis

Report #51 established that below approximately 3B parameters, all attack types succeed because safety reasoning is underdeveloped. Above approximately 7B, safety training creates divergence between attack families.

The defense impossibility triangle adds a dimension to this finding: **below the capability floor, all three defense layers fail simultaneously.** Small models:
- Have minimal text-layer safety training (Layer T fails)
- Have no action-layer refusal behavior (Layer A fails -- as it does for all models)
- Are too small to serve as reliable evaluators (Layer E fails -- qwen3:1.7b at 15% accuracy is a 1.7B model)

Above the capability floor, Layer T begins to function (frontier models achieve less than 5% ASR against standard jailbreaks). But Layer A still fails (PARTIAL dominance is observed across model scales), and Layer E remains unreliable at the 1-2B evaluator scale.

The capability floor thus represents a phase transition in the defense impossibility triangle:

| Scale | Layer T | Layer A | Layer E | Net Defense |
|-------|---------|---------|---------|-------------|
| Below 3B | Fails (ASR > 80%) | Fails (0% refusal) | Fails (15% accuracy) | None |
| 3B-7B | Partial (ASR 20-60%) | Fails (0% refusal) | Marginal (~70% accuracy) | Text-layer only, unreliable evaluation |
| Above 7B (frontier) | Functions (ASR < 5% for standard attacks, ~25% for Blindfold) | Fails (0% refusal) | Not tested at this evaluator scale | Text-layer only, Blindfold bypasses |

The critical observation: **Layer A fails at all scales.** Action-layer refusal does not emerge with scale in the same way that text-layer safety does. This suggests that action-layer safety requires explicit training interventions, not just larger models.

---

## 6. Implications for the CCS Paper

### 6.1 Integration Points

The defense impossibility triangle provides empirical grounding for the CCS paper's threat model. Specific integration points:

1. **Section 4.8 (VLA adversarial attacks):** The triangle quantifies why text-layer defense is insufficient, with measured failure rates at each layer. Blindfold (peer-reviewed, SenSys 2026) serves as an external validation citation.

2. **Section 5 (Discussion):** The compound failure probability calculation (23.2% all-layer failure, 75.3% effective failure against Blindfold-class attacks) provides a concrete metric for the threat model's severity.

3. **Limitations:** The report's caveats (small samples, independence assumption, single evaluator FP rate) should be reflected in the paper's limitations section.

### 6.2 What the Triangle Does NOT Claim

To maintain research integrity, this section explicitly limits the scope of claims:

- The triangle does NOT claim that defense is theoretically impossible. It claims that no current defense architecture addresses all three failure modes simultaneously.
- The triangle does NOT claim that all embodied AI systems are equally vulnerable. It claims that the three failure modes are individually documented and together create a compound risk.
- The triangle does NOT claim that the measured rates are precise population estimates. The Blindfold data comes from a single paper (peer-reviewed but n=187); the FLIP data comes from 58 valid traces across 7 families; the evaluator FP rate comes from 39 benign traces. All have substantial confidence intervals.
- The triangle does NOT claim that the three layers are the only relevant defense layers. Physical-layer defenses (Section 4.2) may be effective but are not part of the AI safety evaluation framework and are therefore outside the scope of this analysis.

---

## 7. Recommendations

1. **Prioritize action-layer refusal research.** Layer A is the weakest link (100% failure rate). The most impactful research direction is establishing whether VLA models can be trained to refuse at the action layer. This requires new training datasets, evaluation metrics, and likely architectural modifications. File as a high-priority research issue.

2. **Expand the benign baseline calibration study.** The 30.8% FP rate (n=39) has a wide confidence interval. A larger study (n >= 100 benign traces, multiple evaluator models) would establish the evaluation layer's reliability with greater precision and identify whether the FP rate is evaluator-specific or structural. Issue #315 tracks this.

3. **Incorporate physical-layer defense analysis.** The most viable near-term defense path may be physical-layer constraints (force limits, workspace monitoring) rather than AI-layer safety training. A systematic mapping of which Blindfold attack categories are and are not mitigated by ISO 10218-compliant physical safety systems would quantify the residual risk.

4. **Do not rely on text-layer defense alone for embodied AI deployments.** This is the central practical recommendation. Any deployment of VLA-controlled robotic systems that relies solely on text-layer safety evaluation (LLM safety training, input/output filtering) is vulnerable to Blindfold-class attacks at a measured rate of 75.3% or higher.

5. **Develop compound failure probability benchmarks.** The triangle framework should be extended to include measured failure rates from multiple evaluators, multiple attack frameworks, and multiple VLA architectures. The current calculation uses point estimates from limited samples; a robust benchmark would provide confidence intervals on the compound failure probability.

6. **Cite this analysis in regulatory submissions.** The defense impossibility triangle provides concrete evidence for the argument that current conformity assessment methods (text-layer evaluation only) are insufficient for embodied AI systems classified as high-risk under the EU AI Act. The SWA Best Practice Review submission and AISI brief should reference this analysis.

---

## 8. Limitations

1. **Sample sizes are small.** The FLIP corpus (n=58), benign baseline (n=39), and evaluator audit (n=20) are all below the n=100 threshold recommended for robust inference (Report #76). All quantitative claims should be treated as preliminary.

2. **Single evaluator FP rate.** The 30.8% FP rate is measured for deepseek-r1:1.5b only. Other evaluators (including larger models) may have different FP rates. The evaluation-layer failure claim rests on a single evaluator's calibration data.

3. **Blindfold data is from one paper.** The 93.2% ASR is measured in one simulation environment (VirtualHome) with one real-robot platform (xArm 6). Transfer to other environments and embodiments is not established.

4. **Independence assumption is incorrect for T and A.** The compound probability calculation assumes independence between text-layer and action-layer failures, but PARTIAL dominance demonstrates they are correlated. The calculation is presented as illustrative rather than precise.

5. **Physical-layer defenses not quantified.** The defense architecture discussion (Section 4) does not quantify how much physical-layer constraints would reduce the compound failure rate. This is a significant gap because physical-layer defenses may be highly effective for a subset of attack categories.

6. **No direct experimental test of the triangle.** This report synthesizes existing data from three independent workstreams. A direct experimental test would apply Blindfold-class attacks to a VLA system, measure action-layer refusal rates, and evaluate with a calibrated evaluator -- all in a single integrated pipeline. No such experiment has been conducted.

---

## Appendix: Data Provenance

| Data Point | Source | Measurement Method | n | Date |
|-----------|--------|-------------------|---|------|
| Blindfold GPT-4o ASR 93.2% | arXiv:2603.01414 | Simulation (VirtualHome) | 187 instructions | March 2026 |
| Blindfold real-robot ASR 90% | arXiv:2603.01414 | Physical (xArm 6) | 20 instructions | March 2026 |
| VeriSafe residual ASR 75.3% | arXiv:2603.01414 | Simulation | — | March 2026 |
| Raw input baseline 27.4% | arXiv:2603.01414 ablation | Simulation | — | March 2026 |
| FLIP ASR 72.4% | Report #49 (Amy Pond) | FLIP backward inference (deepseek-r1:1.5b + qwen3:1.7b) | 58 valid traces | March 2026 |
| PARTIAL rate 50% | Report #49 (Amy Pond) | FLIP verdict distribution | 58 valid traces | March 2026 |
| Refusal rate 0% | Report #49 (Amy Pond) | FLIP verdict distribution | 58 valid traces | March 2026 |
| Evaluator FP rate 30.8% | Issue #315 (Amy Pond) | Benign baseline calibration | 39 benign traces | March 2026 |
| qwen3:1.7b accuracy 15% | Report #61, Issue #250 | Post-hoc human audit | 20 traces | Sprint 24 |
| deepseek-r1:1.5b accuracy ~70% | Report #61 | Calibration study | 20 traces | Sprint 24 |
| Inter-evaluator agreement 32% | Report #49, wave 6 | Scenario-level verdict comparison | 58 traces | March 2026 |

---

*Prepared by Clara Oswald, Principal Research Analyst, Failure-First Embodied AI.*
*This report synthesizes data from three independent workstreams and one external peer-reviewed paper. All claims are qualified with sample sizes. The defense impossibility triangle is a descriptive framework grounded in measured failure rates, not a theoretical proof. Human review is recommended before these findings inform deployment or regulatory decisions.*
