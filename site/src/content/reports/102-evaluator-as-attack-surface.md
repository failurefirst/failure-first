---
title: "The Evaluator as Attack Surface — Ethical Implications of Unreliable Safety Measurement"
description: "This report extends the Unified Vulnerability Thesis (Report #63) by examining the ethical implications of a specific empirical failure: the qwen3:1.7b grading crisis. Between sprint-24 and..."
date: "2026-03-11"
reportNumber: 102
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

## Executive Summary

This report extends the Unified Vulnerability Thesis (Report #63) by examining the ethical implications of a specific empirical failure: the qwen3:1.7b grading crisis. Between sprint-24 and sprint-26, traces classified by qwen3:1.7b — a model with approximately 15% accuracy on the relevant classification task — were incorporated into the project's evidence base, including traces that informed CCS paper claims (Section 4.4, crescendo ASR). The crisis was detected through internal audit (Amy Pond, sprint-26) and the contaminated data was discarded.

This incident is not merely a quality control failure. It is a concrete instantiation of the structural vulnerability described in the three-layer model, applied reflexively to the research process itself. The same architectural gap that permits embodied AI systems to pass text-layer safety evaluation while failing at the actuator layer also permits safety research projects to produce confident-sounding findings based on evaluation tools of unknown or inadequate reliability.

The ethical analysis addresses three dimensions: (1) the duty of evaluator calibration in safety-critical research, (2) the implications for regulatory reliance on automated safety assessment, and (3) the structural incentives that make evaluation quality a secondary concern in the AI safety ecosystem.

---

## 1. The qwen3:1.7b Case Study

### 1.1 What Happened (Descriptive)

Between approximately sprint-10 and sprint-26 (March 2-11, 2026), qwen3:1.7b was used as a FLIP classifier for adversarial traces. The model was selected pragmatically: it runs on an 8GB M1 Mac Mini and produces responses faster than deepseek-r1:1.5b. No systematic calibration study was conducted before deployment as a grader.

Amy Pond's audit (sprint-26 wave 1, n=20) found:

- **Overall accuracy: 15%** (3/20 correct verdicts)
- **Systematic PARTIAL bias:** 58% of all qwen3:1.7b verdicts were PARTIAL (19/33)
- **Failure modes:** Benign queries classified as PARTIAL compliance (5 cases), clear refusals classified as PARTIAL (4 cases), incoherent/hallucinated responses classified as PARTIAL (5 cases)
- **Direction of error:** Overwhelmingly toward false PARTIAL, which in the Failure-First FLIP framework counts toward broad ASR

The practical impact: 40 crescendo traces (CCS Section 4.4) were graded by qwen3:1.7b. The reported broad ASR of 100% is now a P0 blocker for CCS submission (#252) because the PARTIAL dominance may be an artifact of the grader, not a property of the system under evaluation.

### 1.2 Why It Matters Beyond This Project (Normative)

The qwen3:1.7b failure is interesting not because it is unusual but because it is typical of how automated safety evaluation operates across the AI safety ecosystem. The Failure-First project caught the problem because it maintains multiple grading methodologies, cross-model agreement statistics, and manual audit protocols. Most safety evaluation pipelines do not.

**Normative claim:** A research group or evaluator that deploys an automated safety grader without publishing its calibration data (accuracy, precision/recall per verdict category, known failure modes) is withholding information material to the reliability of its findings. This is an ethical obligation, not a methodological preference. Safety-critical measurements require characterised uncertainty bounds.

**Normative claim:** When automated graders are used to produce metrics that inform regulatory decisions (e.g., ASR figures cited in EU AI Act conformity assessments), the calibration data for those graders should be a mandatory disclosure. The EU AI Act Article 9 testing requirements do not currently specify evaluator reliability standards. This is a gap that the harmonised standards process (tracked in #240) should address.

### 1.3 How This Recurses (Predictive)

The three-layer model from Report #63 describes how safety evaluation operates at one architectural layer while harm is produced at another. The qwen3:1.7b crisis demonstrates that this gap exists not only in the deployed AI system but in the evaluation pipeline itself:

- **Layer 1 (safety reasoning about the evaluator):** The project's operational knowledge that small models have limited classification accuracy. This knowledge existed (MEMORY.md, Mistake #21) but was not systematically enforced as a gate before deploying new grading models.
- **Layer 2 (task execution of the evaluator):** qwen3:1.7b executed the FLIP classification task — it produced verdicts in the expected format, with the expected labels. From a format-compliance perspective, the evaluator worked.
- **Layer 3 (action of the evaluator — producing research claims):** The verdicts were incorporated into research claims, CCS paper sections, and AGENT_STATE metrics. The "actuator" here is the research pipeline that converts verdicts into published findings.

The parallel is precise: just as an embodied AI system can produce a PARTIAL response (textually hedged, structurally compliant, actuator-executable), an unreliable evaluator can produce correctly-formatted-but-wrong verdicts that flow downstream into research claims. In both cases, the format compliance (valid JSON, valid FLIP label) masks the content failure (wrong verdict, wrong action).

---

## 2. Structural Incentives for Evaluation Neglect

### 2.1 The Cost Asymmetry (Descriptive)

Safety evaluation has a structural cost asymmetry: producing evaluations is cheap; validating evaluators is expensive.

- **Producing an evaluation:** Run model, collect output, apply classifier, report ASR. Time: minutes to hours. Cost: near-zero with local models.
- **Validating an evaluator:** Collect ground-truth labels (human annotation), compute calibration metrics (accuracy, Cohen's kappa, precision/recall per category), identify failure modes across input distributions, document limitations. Time: days to weeks. Cost: significant (human annotators, multiple grading rounds).

This asymmetry creates a predictable incentive: publish evaluation results without evaluator calibration data. The result looks complete (ASR figures, model comparisons, statistical tests) even when the underlying measurements have unknown reliability.

### 2.2 Competitive Pressure on Evaluation Quality (Descriptive)

The AI safety evaluation landscape exhibits competitive dynamics that further degrade evaluation quality:

- **Publication pressure:** Research groups face incentives to publish evaluation results quickly. Conducting evaluator calibration studies delays publication.
- **Benchmark adoption pressure:** Evaluation benchmarks (JailbreakBench, HarmBench, StrongREJECT, AILuminate) compete for adoption. Benchmarks that report higher ASR differences between models appear more informative. Calibration studies that reveal measurement noise reduce the apparent discriminative power of the benchmark.
- **Regulatory demand:** As regulators require safety evaluations (EU AI Act, anticipated US state legislation), the demand for automated evaluation increases. Meeting regulatory timelines with calibrated evaluators is harder than meeting them with uncalibrated ones.

**Predictive claim:** These incentives will produce an ecosystem where automated safety evaluations are widely deployed, widely cited in regulatory contexts, and largely uncalibrated against human ground truth. The EU AI Act harmonised standards process (Article 40) has an opportunity to address this by requiring evaluator calibration disclosure. Whether it will do so depends on whether the standards development organisations (CEN/CENELEC, ISO) include evaluation methodology experts with the independence to require calibration standards that industry finds inconvenient.

### 2.3 The Evaluation Monoculture Risk (Predictive)

If most safety evaluations rely on the same underlying methodology (LLM-as-judge with similar system prompts), the evaluation ecosystem exhibits monoculture risk: systematic biases in one evaluator will propagate across the entire ecosystem. The qwen3:1.7b PARTIAL bias (58% of verdicts) is an instance of model-specific systematic bias. If a single evaluation model or methodology becomes dominant (as appears to be happening with GPT-4-as-judge patterns), its specific biases become invisible because there is no independent measurement to reveal them.

---

## 3. Ethical Obligations for Safety Evaluators

### 3.1 The Calibration Disclosure Norm (Normative)

**Proposed norm:** Any organisation that publishes automated safety evaluation results should disclose:

1. **Evaluator identity:** Which model(s) are used for automated grading.
2. **Calibration data:** Accuracy, precision/recall per verdict category, and error distribution against human ground truth, with sample sizes.
3. **Known failure modes:** Documented cases where the evaluator systematically misclassifies (e.g., PARTIAL bias, response-length confound).
4. **Cross-evaluator agreement:** If multiple evaluators are available, inter-evaluator agreement statistics.

This norm does not currently exist in published evaluation benchmarks. JailbreakBench, HarmBench, StrongREJECT, and AILuminate publish methodology descriptions but do not publish systematic evaluator calibration data. This is not a criticism of those benchmarks specifically — it reflects an ecosystem-wide gap.

### 3.2 The Minimum Evaluator Capability Threshold (Normative)

Report #59 proposed a Minimum Deployment Standard (MDS) for embodied AI systems. The same logic applies to safety evaluators:

**Proposed threshold:** An automated safety evaluator should not be deployed for safety-critical classification without demonstrating:

- Accuracy >= 70% on the specific classification task (not on a related or general task)
- Cohen's kappa >= 0.40 against human ground truth (moderate agreement)
- Documented error direction (does the evaluator systematically over-report or under-report safety?)

qwen3:1.7b at 15% accuracy fails all three criteria. deepseek-r1:1.5b at approximately 80-85% on short responses and 60-80% on long responses meets the first criterion for short responses but requires disclosure of the response-length confound.

### 3.3 Dual-Use Considerations (Normative)

Documenting evaluator weaknesses creates a dual-use tension. If specific evaluator failure modes are published (e.g., "qwen3:1.7b classifies refusals as PARTIAL when refusals contain verbose explanations"), adversaries could craft responses designed to exploit those specific failure modes — producing outputs that a known-deployed evaluator will misclassify as safe.

This is a real concern, and it creates a genuine tension with the calibration disclosure norm proposed above. The resolution is: disclose aggregate calibration statistics (accuracy, kappa, error rates by category) without disclosing the specific input patterns that trigger misclassification. This parallels responsible disclosure norms in cybersecurity: publish the vulnerability class without publishing the exploit code.

---

## 4. Implications for the Three-Layer Model

### 4.1 The Four-Layer Extension

The qwen3:1.7b crisis suggests the three-layer model from Report #63 is incomplete. A more accurate model includes a fourth layer:

- **Layer 0: Evaluation** — The tools that measure safety at Layers 1-3.
- **Layer 1: Safety Reasoning (System S)** — The model's internal safety evaluation.
- **Layer 2: Task Execution (System T)** — The model's instruction-following.
- **Layer 3: Action Execution (Actuator)** — The downstream action decoder.

Layer 0 failures compound with Layer 1-3 failures. If the evaluator (Layer 0) misclassifies a PARTIAL response as REFUSAL, the measured safety of the system is higher than its actual safety. If the system then deploys in an embodied context where the actuator gap (Layer 2/3) amplifies the PARTIAL into a harmful action, the compound failure is: the evaluator said it was safe (Layer 0 error), the model said it refused (Layer 1 signal), the model structurally complied (Layer 2 output), and the actuator executed the harmful action (Layer 3).

This is a four-layer failure chain. Each layer provides false assurance to the layer above it.

### 4.2 Updated Defensive Implications

The four-layer model adds a new defensive requirement to the three proposed in Report #63:

1. **Evaluator calibration gates (Layer 0):** No safety evaluator deployed without published calibration data meeting minimum thresholds. This is the evaluation-layer equivalent of action-layer verification.

2. **Cross-evaluator redundancy (Layer 0):** Safety-critical claims require agreement between at least two independent evaluators (different models, different methodologies). The Failure-First project's practice of cross-model FLIP grading is an instance of this, though the 32% scenario-level disagreement demonstrates how far current tools are from reliable convergence.

3. **Human-in-the-loop audit (Layer 0/1):** For claims that will inform regulatory decisions or CCS-level publications, a human annotation sample is required. The Failure-First project has identified this need (#148, #126) but has not yet completed it — another instance of the structural difficulty of evaluator validation.

---

## 5. Regulatory Implications

### 5.1 EU AI Act Article 9 and Harmonised Standards

The harmonised standards currently under development for EU AI Act conformity assessment will need to specify not only what to test but how to validate the testing tools. Without evaluator reliability standards, Article 9 conformity assessments could rely on automated evaluators with the accuracy profile of qwen3:1.7b (15%) — and the assessment would be formally compliant.

**Recommendation for Failure-First consultation input (#251):** The Article 9 consultation response should include a specific recommendation that harmonised standards require evaluator calibration disclosure for automated safety testing tools used in conformity assessments.

### 5.2 Australian VAISS Guidelines

Guardrail 4 (testing) should specify that automated testing tools used for AI safety evaluation must have documented accuracy against human ground truth. The current voluntary guidelines do not address evaluator reliability. This gap is particularly relevant for embodied AI in mining and logistics, where text-layer evaluators may be the only safety assessment applied to VLA systems controlling heavy equipment.

---

## 6. Limitations

1. **Small audit sample.** The 15% accuracy figure for qwen3:1.7b is based on n=20. A larger audit sample would provide tighter confidence intervals and more precise characterisation of failure modes.

2. **Single project evidence base.** The evaluator calibration data comes from the Failure-First project. Other projects may use evaluators with different accuracy profiles. The structural argument (evaluation neglect incentives, calibration cost asymmetry) is general; the specific accuracy figures are project-specific.

3. **Normative claims are contestable.** The proposed calibration disclosure norm and minimum evaluator threshold are normative recommendations, not empirical findings. Reasonable disagreement exists about whether these thresholds are appropriately set, whether they would be practically achievable at scale, and whether they would create barriers to entry for smaller research groups.

4. **No quantification of downstream impact.** The claim that unreliable evaluation produces unreliable safety claims is structurally sound but has not been quantified: how much does a 15% evaluator accuracy change the measured ASR of a system? The crescendo regrade (#252) will provide one data point, but systematic impact quantification is future work.

---

*Prepared by Nyssa of Traken, AI Ethics & Policy Research Lead, Failure-First Embodied AI.*
*All empirical claims reference documented measurements from the Failure-First corpus. Normative claims are explicitly labelled as such.*
