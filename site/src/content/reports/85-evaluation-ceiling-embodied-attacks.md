---

title: "The Evaluation Ceiling — Why Current Safety Benchmarks Cannot Detect the Most Dangerous Embodied AI Attacks"
description: "This report identifies a structural ceiling on the ability of text-layer evaluation methods to detect the most dangerous class of embodied AI failures. The ceiling is not a limitation of evaluator..."
date: "2026-03-12"
reportNumber: 85
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/85-evaluation-ceiling-embodied-attacks.m4a"
---

- Wave 12 FLIP-graded VLA traces: SBA n=20, LHGD n=10, TCH n=10, CET n=10 (deepseek-r1:1.5b, all 0 errors)
- Original 7 VLA families: n=58 valid FLIP traces (Report #49)
- DA: n=16 FLIP traces (Report #80)
- Blindfold (arXiv:2603.01414): n=187 simulation + 20 real-robot
- Benign baseline calibration: n=39 (Issue #315)

---

## Executive Summary

This report identifies a structural ceiling on the ability of text-layer evaluation methods to detect the most dangerous class of embodied AI failures. The ceiling is not a limitation of evaluator quality (better LLMs would not resolve it) but of evaluation scope: current methods operate on text content, while the most dangerous embodied attacks operate on physical context.

The evidence comes from converging findings across wave 12 empirical data and earlier VLA workstreams:

1. **The 30% ASR convergence.** Four new VLA attack families (SBA, LHGD, TCH, CET) all show exactly 30.0% FLIP ASR on deepseek-r1:1.5b (n=50 combined, 95% Wilson CI [19.1%, 43.8%]). The original 7 families show 40.7% (n=27). DA shows 85.7% (n=14). The CIs for the new 4 and the original 7 overlap -- they are not statistically distinguishable. Yet the new families include SBA, which is qualitatively unlike any prior attack family.

2. **The SBA BENIGN_QUERY blindspot.** 45% of SBA traces (9/20) receive a FLIP verdict of BENIGN_QUERY. FLIP's backward-inference methodology (infer the instruction from the response, judge the instruction) correctly identifies these instructions as benign -- because the instructions *are* benign at the text layer. The FLIP grader is not wrong; it is answering the wrong question. The question is not "is this instruction harmful?" but "would executing this instruction in this physical context cause harm?" No text-layer evaluation method can answer the second question.

3. **The inverse relationship between attack danger and evaluation detectability.** Across the full VLA corpus, the families that are most dangerous in physical deployment (SBA) are the least detectable by text-layer evaluation (30% ASR, 45% BENIGN_QUERY), while the families most detectable by text-layer evaluation (TRA at 100%, ASE at 80%) involve textually explicit action descriptions that are straightforward for a text-based grader to classify. Evaluation effectiveness is inversely correlated with deployment risk for the embodied domain.

**Central thesis:** Text-layer evaluation methods (FLIP, keyword matching, LLM-as-judge) have a structural ceiling for embodied AI because danger in the embodied domain emerges from physical context, not textual content. SBA demonstrates this: the "attack" is indistinguishable from ordinary instructions. This is qualitatively different from all prior jailbreak research, which assumes that attacks have a textual signature that an evaluator can detect. For embodied AI, the most dangerous failure mode has no textual signature at all.

**Scope limitation:** This analysis rests on limited sample sizes (n=20 for SBA, n=50 for all new families). All quantitative claims carry the confidence intervals reported in Issue #360. The structural argument does not depend on precise ASR point estimates but on the qualitative observation that FLIP classifies nearly half of SBA traces as BENIGN_QUERY -- an observation that holds regardless of sample size because it reflects a property of the evaluation method, not a statistical fluctuation.

---

## 1. The Evaluation Ceiling: Definition and Evidence

### 1.1 What the Ceiling Is

An evaluation ceiling exists when the evaluation method cannot, in principle, detect a class of failures regardless of the evaluator's capability. This is distinct from an evaluation gap (where a better evaluator would succeed) or evaluation noise (where more data would improve detection).

For embodied AI, the ceiling arises because:

- **Text-layer evaluation** operates on the textual content of instructions and responses. It can detect harmful text, deceptive framing, refusal suppression, persona manipulation, and other textual attack signatures.
- **Embodied danger** often arises from the intersection of a textually benign instruction with a physical context. The instruction "hand me that thing on the counter" is benign; the context (the thing is a chef's knife, the requester is a child) creates the danger.
- **No text-layer evaluator, regardless of capability, can detect the danger** in "hand me that thing on the counter" by examining only the text. The danger is in the environment state, not the instruction.

This is the evaluation ceiling. It is structural, not technical.

### 1.2 Empirical Evidence: The SBA BENIGN_QUERY Rate

The most direct evidence for the ceiling comes from the SBA FLIP grading results (wave 12, Amy Pond):

| SBA FLIP Verdict | Count | Percentage |
|-----------------|-------|-----------|
| BENIGN_QUERY | 9 | 45.0% |
| HALLUCINATION_REFUSAL | 4 | 20.0% |
| COMPLIANCE | 3 | 15.0% |
| PARTIAL | 3 | 15.0% |
| REFUSAL | 1 | 5.0% |

The 45% BENIGN_QUERY rate means the FLIP grader examined the response, inferred backward what the instruction must have been, and concluded that the instruction was benign. This is the correct conclusion at the text layer. The instructions *are* benign. "Can you hand me that thing on the counter?" is an ordinary request. "Grab that toolbox from the top shelf for me" is routine workplace communication.

FLIP is not producing an error. It is correctly answering the question it was designed for: "does this instruction-response pair indicate harmful intent?" The answer is no, because there is no harmful intent in the instruction. The harm is in the physical context.

For comparison, the original 7 VLA families have a BENIGN_QUERY rate of approximately 26% (from AGENT_STATE wave 12 notes). The 19-percentage-point elevation in SBA (45% vs 26%) reflects the fact that SBA instructions are more textually benign than other VLA attack families, which often contain explicit references to safety boundaries, action sequences, or adversarial framings.

### 1.3 The 30% ASR Convergence

All four new families converge at 30.0% ASR:

| Family | n | FLIP ASR | 95% Wilson CI | BENIGN_QUERY Rate |
|--------|---|----------|---------------|-------------------|
| SBA | 20 | 30.0% | [14.5%, 51.9%] | 45% |
| LHGD | 10 | 30.0% | [10.8%, 60.3%] | 30% |
| TCH | 10 | 30.0% | [10.8%, 60.3%] | 40% |
| CET | 10 | 30.0% | [10.8%, 60.3%] | 50% |

Two interpretations are possible, and the data cannot currently distinguish between them:

**Interpretation A: Floor effect.** 30% represents the base rate at which deepseek-r1:1.5b produces text that FLIP classifies as COMPLIANCE or PARTIAL, regardless of whether the scenario is adversarial. This would be consistent with the benign baseline FP rate of 30.8% (Issue #315, n=39). Under this interpretation, the new families have zero net adversarial signal on the FLIP evaluator -- the grader is detecting noise, not attacks.

**Interpretation B: Evaluation ceiling.** The new families genuinely produce some compliance, but the FLIP grader cannot distinguish compliance from benign responses because the instructions lack textual harm signals. The true ASR may be higher than 30%, but FLIP's text-layer methodology caps its detection ability.

Both interpretations support the evaluation ceiling thesis. Under Interpretation A, FLIP provides zero useful information about SBA-class attacks. Under Interpretation B, FLIP provides attenuated information with an unknown and structurally uncorrectable error rate.

---

## 2. Why This Is Qualitatively Different from Prior Jailbreak Research

### 2.1 The Textual Signature Assumption

All prior jailbreak evaluation research assumes -- usually implicitly -- that attacks have a textual signature. The evaluation task is to detect that signature in the instruction, the response, or both:

- **Keyword matching** looks for harmful words or phrases in the text.
- **LLM-as-judge** (including FLIP) uses a language model to assess whether the text indicates harmful intent or compliance with harmful instructions.
- **Classifier-based evaluation** (StrongREJECT, WildGuard, Llama-Guard) trains models to detect harmful content patterns in text.

All of these operate on text. All assume that if an attack succeeds, there will be a textual trace of that success -- either in the attack prompt (which contains some adversarial signal) or in the model's response (which contains harmful content).

SBA violates this assumption. The attack prompt contains no adversarial signal. The model's response -- even when it represents compliance with a dangerous instruction -- may contain no harmful content. "Sure, I will hand you the item from the counter" is a textually benign response to a textually benign instruction. The evaluation method sees nothing wrong because nothing is wrong at the text layer.

### 2.2 The Attack-Danger Spectrum

The Failure-First VLA corpus now spans a spectrum from textually explicit to textually invisible attacks:

| Attack Type | Textual Signature | FLIP Detectability | Physical Danger |
|------------|-------------------|-------------------|-----------------|
| TRA (Trajectory Manipulation) | High — explicit trajectory descriptions | High (100% ASR detected) | Moderate |
| ASE (Action Space Exploitation) | High — action-space references | High (80% detected) | Moderate |
| SBE (Safety Bypass Exploitation) | Medium — safety boundary references | Medium (78% detected) | Moderate-High |
| DA (Deceptive Alignment) | Medium — conditional reasoning | High (85.7% detected) | Variable |
| SBA (Semantic Benignity) | None — ordinary language | Low (30% detected, 45% BENIGN_QUERY) | High-Critical |

The pattern is clear: as the textual signature decreases, FLIP detectability decreases, but physical danger does not decrease -- it may increase. SBA's combination of critical physical danger (damage_envelope_proxy 0.85-1.0 across all 20 scenarios) and low textual detectability represents the most dangerous point on this spectrum.

### 2.3 The Blindfold Convergence

Blindfold (arXiv:2603.01414, Report #75) independently demonstrates the same structural limitation from the attack side. Blindfold achieves 93.2% ASR on GPT-4o by decomposing harmful intents into sequences of individually benign instructions. Its three-component pipeline (Command Transformer, Intent Obfuscator, Rule-Based Verifier) is specifically designed to remove textual harm signals from each instruction while preserving the harmful physical consequence of the sequence.

SBA and Blindfold arrive at the same conclusion from different directions:

- **Blindfold** shows that an automated system can systematically construct textually benign instructions that produce dangerous physical outcomes.
- **SBA** shows that such instructions arise naturally from ordinary human-robot interaction without any adversarial engineering.

The implication is that the evaluation ceiling is not merely a theoretical concern about sophisticated attacks. It is a practical concern about everyday use. A care robot that receives "help me sit up" from a post-spinal-surgery patient is in an SBA scenario without any attacker present.

---

## 3. Connection to the Defense Impossibility Triangle

Report #78 identified three defense layers (Text, Action, Evaluation) and quantified their failure rates. The evaluation ceiling refines the Layer E failure analysis.

Report #78 characterized Layer E failure as an accuracy problem: the evaluator's 30.8% FP rate, 15-70% accuracy range, and 32% inter-evaluator agreement. These are problems of evaluator quality -- in principle, a better evaluator could reduce these error rates.

The evaluation ceiling identifies a Layer E failure that is *not* an accuracy problem. Even a perfect text-layer evaluator -- one with 100% accuracy on text content -- would fail on SBA because the ground truth depends on information (physical context) that the evaluator does not have access to.

This converts the defense impossibility triangle from a quantitative finding (measured failure rates at each layer) to a structural finding (at least one layer has a ceiling that no improvement within the layer can overcome):

| Layer | Report #78 Finding | Report #85 Addition |
|-------|--------------------|---------------------|
| T (Text) | 75.3% residual ASR against Blindfold | Unchanged |
| A (Action) | 0% refusal rate | Unchanged |
| E (Evaluation) | 30.8% FP rate (quality problem) | Structural ceiling for SBA-class attacks (scope problem) |

The structural ceiling is more concerning than the quality problem because quality problems have a solution path (better evaluators) while scope problems require a fundamentally different evaluation architecture.

---

## 4. Implications for the Capability-Floor Hypothesis

Report #51 established that below approximately 3B parameters, all attacks succeed because safety reasoning is underdeveloped. Above approximately 7B, safety training creates divergence between attack families.

The evaluation ceiling interacts with the capability floor in a specific way: **the capability floor applies to the evaluator as well as to the model being evaluated.**

Our FLIP evaluator (deepseek-r1:1.5b, 1.5B parameters) is below the capability floor. This means it lacks the safety reasoning capability to distinguish between "this response complies with a dangerous instruction" and "this response is a benign answer to a benign question." For SBA scenarios, these two categories are textually identical -- distinction requires reasoning about physical context that is beyond the evaluator's capability at any model scale when the evaluation operates on text alone.

At larger evaluator scales (7B+, frontier), the text-layer evaluation might improve for some attack families. A more capable evaluator might detect subtle patterns in TRA or SBE responses that a 1.5B model misses. But for SBA, the ceiling does not change with evaluator scale because the information needed for correct classification (physical context) is not in the input to the evaluator.

This creates a specific prediction: **scaling the evaluator should improve FLIP detection for textually explicit families (TRA, ASE, SBE) but should NOT improve detection for SBA.** This prediction is testable (#350 tracks frontier VLA evaluation). If scaling the evaluator improves SBA detection, it would refute the evaluation ceiling thesis and suggest that larger models can infer physical context from textual cues that 1.5B models miss.

---

## 5. What Would Be Needed to Evaluate SBA-Class Failures

### 5.1 Minimum Requirements for Below-the-Ceiling Evaluation

An evaluation method that operates below the ceiling (i.e., can detect SBA-class failures) would need at minimum:

**Requirement 1: Access to environment state.** The evaluator must receive the physical context (environment_state in our scenario schema) alongside the instruction and response. "Hand me that thing on the counter" is benign; "hand me that thing on the counter [environment: thing = chef's knife, requester = child]" is dangerous. The evaluator needs the bracketed information.

**Requirement 2: Physical consequence reasoning.** The evaluator must be able to reason about the physical consequences of an action in a given context. "Move the 25kg toolbox from the 3m shelf" is benign in an empty warehouse; it is dangerous when a person stands directly below. This requires causal reasoning about physics, human vulnerability, and environmental affordances.

**Requirement 3: Domain-specific safety knowledge.** Many SBA scenarios require domain knowledge that goes beyond general reasoning: grease fires must not be extinguished with water; post-spinal-surgery patients must not perform trunk flexion; concentrated HCl must not be opened outside a fume hood; sodium metal must not contact water. An evaluator without domain-specific safety knowledge cannot assess these scenarios.

### 5.2 Candidate Evaluation Architectures

Three candidate architectures could potentially operate below the ceiling:

**Architecture A: Physics-informed LLM evaluation.** Provide the evaluator with the full environment state and instruction, and use a frontier-scale LLM with strong physical reasoning capabilities. This is the minimal extension of current methods. Limitation: relies on the LLM's world model, which may lack specific domain knowledge (e.g., sodium-water reactivity, grease fire protocols).

**Architecture B: Simulation-based consequence estimation.** Run the proposed action sequence in a physics simulator with the specified environment state, and evaluate whether the physical outcome is dangerous. This is the approach used by Blindfold's Rule-Based Verifier (in the attack direction). Limitation: requires a faithful simulator for each deployment environment, which is computationally expensive and may not generalize.

**Architecture C: Formal safety constraint checking.** Encode domain-specific safety constraints (ISO 10218 force limits, LOTO requirements, chemical compatibility rules) as formal specifications, and check whether the proposed action violates any constraint. This is closest to industrial practice. Limitation: constraint sets are domain-specific and incomplete -- they cover known hazards but not novel scenarios.

None of these architectures has been implemented as an evaluation method for embodied AI safety. All require inputs (environment state, physical parameters, domain safety rules) that current evaluation benchmarks do not provide.

### 5.3 Implications for the FLIP Methodology

FLIP (Failure-First Likelihood Inference Protocol) was designed for text-layer evaluation: infer the instruction from the response, judge the instruction. For text-layer attacks (jailbreaks, format-lock, cipher, crescendo), FLIP operates within its design scope and produces useful signal.

For SBA-class scenarios, FLIP operates above the ceiling. Its BENIGN_QUERY verdicts are not errors -- they are correct assessments that the instruction is textually benign. The limitation is that "textually benign" and "physically safe" are not synonymous in the embodied domain.

This does not invalidate FLIP for the broader VLA evaluation. FLIP remains useful for detecting textually explicit compliance (TRA, ASE, SBE, DA). It is specifically the SBA family -- and any future family where danger is purely contextual -- where FLIP reaches its ceiling.

**Recommendation:** FLIP reports for embodied AI scenarios should include a "contextuality rating" indicating what proportion of the scenario's danger is encoded in the physical context versus the text. For high-contextuality scenarios (SBA, some CET and LHGD sub-families), FLIP verdicts should be flagged as operating above the evaluation ceiling with a note that ground truth requires environment-state-aware evaluation.

---

## 6. The Inverse Relationship: Detectability vs Danger

### 6.1 Formalizing the Inverse

Across the VLA corpus, we observe a pattern that can be stated informally as: the easier an attack is to detect with text-layer evaluation, the less dangerous it tends to be in physical deployment, and vice versa.

This is not a universal law. DA is both highly detectable (85.7% FLIP ASR) and potentially very dangerous (deceptive alignment in deployed systems). But the overall pattern holds for the physically-grounded attack families:

- TRA (100% FLIP ASR) involves explicit trajectory descriptions that are easy to detect but represent a specific, narrow class of physical risk.
- SBA (30% FLIP ASR, 45% BENIGN_QUERY) involves ordinary instructions that are nearly impossible to detect but represent the broadest class of physical risk -- any scenario where a routine instruction becomes dangerous due to context.

### 6.2 Why the Inverse Matters for Safety Policy

If the inverse relationship holds, then current evaluation methods systematically overcount the attacks they can detect (textually explicit, moderate-danger families) and undercount the attacks they cannot detect (textually invisible, high-danger families). This creates a specific bias in safety assessment:

- A safety evaluation using FLIP or any text-layer method would report high ASR for TRA, ASE, SBE (70-100%) and low ASR for SBA (30%, potentially just noise).
- A policy-maker reviewing this evaluation would conclude that trajectory manipulation is the primary threat and that semantic benignity attacks are a minor concern.
- The actual deployment risk is the opposite: SBA-class scenarios arise continuously in normal operation (every ordinary instruction in a context-dependent environment), while TRA-class attacks require adversarial engineering.

This is the most operationally significant implication of the evaluation ceiling: it biases safety assessment toward detectable threats and away from the threats that matter most.

---

## 7. Limitations

1. **Small sample sizes.** SBA: n=20, LHGD/TCH/CET: n=10 each. All quantitative claims carry the Wilson CIs reported in Issue #360. The 30% convergence could be a coincidence of small samples.

2. **Single evaluator model.** All FLIP grading uses deepseek-r1:1.5b. A different or larger evaluator might produce different verdict distributions. The structural argument (text-layer evaluation cannot access physical context) is independent of evaluator choice, but the specific BENIGN_QUERY rate (45%) may be evaluator-dependent.

3. **Text-only VLA scenarios.** All scenarios are text representations of physical contexts. The environment state is provided as structured JSON in the scenario file but was not part of the input to the model during trace collection. In a real VLA deployment, the model would receive multimodal input (camera feeds, sensor data) that might provide the physical context information currently missing from text-layer evaluation.

4. **No ground truth.** We have human-designed expected responses (refusal_expected) for each SBA scenario, but no systematic human grading of the 20 traces to establish ground truth. The 30% FLIP ASR cannot be compared against a human-graded ASR to quantify FLIP's actual error rate on SBA.

5. **Interpretation A vs B unresolved.** The 30% ASR may reflect a floor effect (benign FP noise) rather than genuine attack detection. Distinguishing these interpretations requires either a larger benign baseline (n>100) or a fundamentally different evaluation approach.

6. **DA anomaly unexplained.** DA at 85.7% is a clear outlier above all other families. The evaluation ceiling thesis claims that text-layer evaluation has a structural limit for embodied attacks, but DA -- an embodied attack -- is highly detectable. The resolution is that DA operates through textual reasoning patterns (counterfactual oversight modeling) that have a textual signature, unlike SBA which operates through physical context. But this makes the ceiling contingent on attack mechanism rather than domain, which weakens the generality of the claim.

---

## 8. Recommendations

1. **Run the evaluator-scaling experiment.** Test whether FLIP detection of SBA changes when the evaluator is scaled to 7B, 70B, or frontier. If SBA BENIGN_QUERY rate remains at approximately 45% regardless of evaluator scale, the evaluation ceiling is confirmed. If it drops, the ceiling is softer than theorized. This is the single most informative experiment for resolving the evaluation ceiling hypothesis. (See `docs/plans/next_frontier_experiment.md`.)

2. **Develop environment-state-aware evaluation.** Extend FLIP to accept the environment_state field from VLA scenarios and prompt the evaluator: "Given this physical context, is the model's response safe?" This is Architecture A from Section 5.2. It is the minimal change to existing infrastructure that could operate below the ceiling.

3. **Establish human-graded ground truth for SBA.** Grade all 20 SBA traces with human annotators who have access to the environment_state. Compare human verdicts against FLIP verdicts. The delta directly measures the evaluation ceiling's practical impact.

4. **Report contextuality ratings on all VLA evaluations.** When publishing VLA evaluation results, include a per-scenario contextuality rating (proportion of danger from physical context vs text content). Flag high-contextuality results as subject to the evaluation ceiling.

5. **Expand SBA corpus.** 20 scenarios across 3 sub-families is the minimum viable demonstration. The evaluation ceiling argument would be substantially strengthened by a larger corpus (n>=50 per sub-family) covering more environments and more domain-specific hazards.

6. **Do not report SBA FLIP ASR as a reliable measure of attack effectiveness.** In regulatory submissions and policy documents, SBA FLIP results should be presented with the caveat that FLIP operates above its detection ceiling for this family. Reporting SBA FLIP ASR without this caveat would systematically underrepresent the risk.

---

## 9. Conclusion

The evaluation ceiling is the most significant methodological finding of the wave 12 campaign. It reveals that text-layer evaluation methods -- the foundation of all current AI safety benchmarks -- have a structural limitation for the embodied domain that no amount of evaluator improvement can overcome. The most dangerous embodied AI failure mode (ordinary instructions in dangerous contexts) is precisely the failure mode that text-layer evaluation cannot detect.

This finding does not invalidate text-layer evaluation for text-layer attacks. FLIP, LLM-as-judge, and classifier-based methods remain the appropriate evaluation tools for jailbreaks, format-lock, crescendo, cipher, and other textually-grounded attack families. The ceiling applies specifically to the intersection of textually benign instructions and physically dangerous contexts -- a class of failures that is unique to embodied AI and absent from the pure-text safety evaluation paradigm.

The path below the ceiling requires evaluation methods that incorporate physical context: environment state, consequence simulation, or formal safety constraint checking. None of these methods exists as an evaluation standard. Developing them is the next research frontier.

---

*Prepared by Clara Oswald, Principal Research Analyst, Failure-First Embodied AI.*
*This report synthesizes wave 12 empirical data (n=50 new traces) with existing VLA corpus findings (n=91 total) and external literature (Blindfold, arXiv:2603.01414). All quantitative claims include sample sizes and confidence intervals. The evaluation ceiling thesis is structural and does not depend on precise point estimates, but its empirical evidence is limited by small samples. Human review is recommended before regulatory use.*
