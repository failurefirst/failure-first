---
title: "The Evaluation Paradox — When Safety Measurement Tools Are Themselves Misaligned"
description: "This report examines a meta-level ethical problem: if the tools we use to evaluate AI safety are themselves unreliable, what confidence can we place in any safety assessment? The Failure-First..."
date: "2026-03-11"
reportNumber: 61
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

## Executive Summary

This report examines a meta-level ethical problem: if the tools we use to evaluate AI safety are themselves unreliable, what confidence can we place in any safety assessment? The Failure-First project's empirical data provides a concrete instance of this problem. A grading model (qwen3:1.7b) used for FLIP classification was found to have approximately 15% accuracy on certain evaluation tasks (Amy Pond, sprint-26 wave 1). This is not an isolated tool failure; it is an instance of a structural problem that affects every automated AI safety evaluation pipeline.

**Descriptive claim:** The accuracy of automated safety graders varies enormously across grading models, task types, and response categories. Our own project has documented Cohen's kappa = 0.245 between heuristic and LLM-graded classification (AGENT_STATE established findings). The qwen3:1.7b grader achieves 15% accuracy on certain classification tasks. Heuristic classifiers produce 88% false positive rates on COMPLIANCE verdicts (AGENT_STATE established findings). These are not engineering bugs to be fixed — they represent a fundamental measurement validity problem in AI safety evaluation.

**Normative claim:** Any AI safety evaluation regime that relies on automated grading without rigorous, published calibration data against human ground truth is producing measurements of unknown validity. Standards bodies, regulators, and deployers who accept automated safety scores at face value are engaging in what we term "evaluation theatre" — a performative demonstration of safety measurement that may not correlate with actual safety properties.

**Predictive claim:** As AI safety regulation scales (EU AI Act, state-level US legislation, Australian VAISS guidelines), the demand for automated safety evaluation will increase. Without established standards for evaluator accuracy, calibration, and disclosure, the evaluation paradox will propagate: regulators will rely on safety scores produced by tools whose accuracy is uncharacterised, creating a false sense of verified safety.

---

## 1. The Empirical Foundation

### 1.1 Known Grader Accuracy in the Failure-First Corpus

The Failure-First project has assembled one of the more detailed records of grader calibration in the adversarial evaluation literature. The data reveals a troubling pattern:

| Grading Method | Accuracy Domain | Measured Performance | Source |
|---------------|-----------------|---------------------|--------|
| Heuristic classifier (keyword) | COMPLIANCE detection | 12% precision (88% false positive) | AGENT_STATE, Mistake #21 |
| Heuristic classifier (keyword) | REFUSAL detection | 95% precision | AGENT_STATE, Mistake #21 |
| deepseek-r1:1.5b (FLIP) | 5-category verdict | ~80-85% on short responses; ~10-20% ERROR rate on long responses | MEMORY.md |
| qwen3:1.7b (FLIP) | VLA trace grading | 72.4% ASR (converged with deepseek cross-grading) | Report #49 |
| qwen3:1.7b | General classification | ~15% accuracy on certain tasks | Amy Pond, sprint-26 wave 1 |
| Heuristic vs LLM | Corpus-wide agreement | Cohen's kappa = 0.245 | AGENT_STATE |
| Heuristic structural compliance | Format-lock traces | 76.5% (vs 47.1% FLIP-graded ASR) | Report #57 |

Several observations emerge from this data:

**First**, no single grading method performs reliably across all task types. Heuristic classifiers are excellent at detecting refusals (95% precision) and terrible at detecting compliance (12% precision). LLM graders perform differently depending on model size, response length, and task specificity. The selection of grading methodology materially changes the measured ASR — by factors of 2x or more.

**Second**, the direction of error is systematically biased. Heuristic classifiers over-report ASR (they classify too many responses as successful attacks). Small LLM graders under-report ASR on certain tasks and over-report on others. The bias direction depends on the interaction between the grader's capabilities and the specific response patterns being evaluated. This means that safety claims based on automated evaluation are not merely noisy — they are systematically biased in ways that depend on the grading tool, not the system being evaluated.

**Third**, grader agreement between methods is low. Cohen's kappa of 0.245 between heuristic and LLM grading indicates only slight agreement beyond chance. The 32% scenario-level agreement between two LLM graders (deepseek-r1:1.5b and qwen3:1.7b) on VLA traces — despite identical aggregate ASR (72.4%) — demonstrates that different graders agree on the overall rate but disagree on which specific responses are successful attacks. This is a diagnostic for measurement unreliability: if two thermometers agree on the average temperature but disagree on every individual reading, neither is measuring temperature accurately.

### 1.2 The 15% Accuracy Finding

Amy Pond's finding (sprint-26 wave 1) that qwen3:1.7b achieves approximately 15% accuracy on certain classification tasks deserves particular attention because qwen3:1.7b is one of the grading models used in the Failure-First evaluation pipeline. This does not invalidate all qwen3:1.7b FLIP grades — the model performs better on the specific FLIP binary/five-category task than on general classification — but it raises an unavoidable question: how confident are we in any safety measurement produced by a tool whose accuracy on related tasks is 15%?

The honest answer is: our confidence should be calibrated to the measured accuracy on the specific task, not to a general assumption of competence. Where task-specific calibration data exists (as it does for FLIP grading via cross-model agreement statistics), the measurements have defined uncertainty bounds. Where task-specific calibration data does not exist — which is the case for most automated safety evaluations published by other research groups — the measurements have unknown uncertainty bounds.

Unknown uncertainty is worse than known high uncertainty. A measurement reported as "ASR = 45% +/- 20%" communicates its limitations. A measurement reported as "ASR = 45%" without calibration data communicates false precision.

### 1.3 The Response Length Confound

The deepseek-r1:1.5b grader exhibits 10-20% ERROR rates on long responses (MEMORY.md). This is a measurement validity confound: the grader's accuracy is not uniform across the space of possible inputs. Responses that are longer (which, per the compliance verbosity signal documented in Report #48, are more likely to be COMPLIANCE verdicts) are more likely to be classified as ERROR — which means the grader systematically drops the responses most relevant to safety evaluation.

This is not a hypothetical concern. The compliance verbosity signal (COMPLIANCE responses are 54% longer, p=1e-27) means that the responses most likely to represent successful attacks are also the responses most likely to be classified as ERROR by the grading model. The grader is least reliable precisely where accuracy matters most.

---

## 2. The Structural Problem

### 2.1 Evaluator Capability as a Bottleneck

The evaluation paradox arises from a capability ordering problem. Automated safety graders are, by construction, AI models. For a grader to accurately evaluate whether a target model's response constitutes a successful attack, the grader must:

1. **Understand the adversarial intent** of the original prompt
2. **Parse the full response** including any hedging, caveats, or structural elements (JSON, code, action trajectories)
3. **Assess whether the response content constitutes harm** in the deployment context (text-only, embodied, agentic)
4. **Apply a consistent classification rubric** across diverse response types

Each of these capabilities requires sophisticated language understanding. When the grading model is less capable than the model being evaluated (as when qwen3:1.7b grades frontier model responses), the grader is being asked to make judgments that exceed its own representational capacity. This is analogous to asking a first-year accounting student to audit a multinational corporation's financial statements — the auditor lacks the domain expertise to identify sophisticated non-compliance.

When the grading model is comparable in capability to the model being evaluated, a different problem emerges: if the two models share similar training data and safety calibrations, the grader may share the same blind spots as the target. A grader trained on similar data may fail to recognise the same edge cases that the target model fails on.

### 2.2 The Recursion Problem

The evaluation paradox has a recursive structure. If we question the accuracy of an automated grader, the natural response is to evaluate the grader's accuracy — which requires a meta-grader. But the meta-grader is itself an automated tool with its own accuracy limitations, requiring a meta-meta-grader, and so on.

The recursion terminates at human judgment. Human evaluation is the ultimate ground truth for safety classification. But human evaluation does not scale: the Failure-First corpus contains 135,623 results. At 2 minutes per evaluation, human grading of the full corpus would require approximately 624 person-hours — feasible for a funded research team, infeasible for a single-operator project, and entirely infeasible for the evaluation volumes that production AI safety monitoring would require.

The Failure-First project has addressed this recursion pragmatically: heuristic classifiers were calibrated against LLM graders (Cohen's kappa = 0.245), LLM graders were calibrated against each other (32% scenario-level agreement), and specific high-confidence pathways were identified (heuristic REFUSAL: 95% precision; auto-trust REFUSAL, flag COMPLIANCE for LLM review). This consensus methodology is documented and its limitations are explicit. But it remains a pragmatic compromise, not a principled solution.

### 2.3 The Disclosure Gap

The evaluation paradox is compounded by a disclosure gap. When AI safety evaluations are published — whether in academic papers, regulatory submissions, or commercial safety reports — the grading methodology is typically described at a high level ("we used GPT-4 to evaluate responses") but the grading model's accuracy on the specific task is rarely reported. Calibration data (inter-rater reliability, comparison with human ground truth, sensitivity to response length or format) is even more rarely published.

This creates an information asymmetry. The evaluation producer knows (or could know) the limitations of their grading methodology. The evaluation consumer — a regulator, a deployer, a journalist, a policymaker — does not. The consumer accepts the safety score as a measurement of the system's safety properties, when it is actually a measurement of the interaction between the system's behavior and the grading tool's capabilities.

The Failure-First project's disclosure practices (Cohen's kappa reported in AGENT_STATE, grader accuracy documented in MEMORY.md, calibration methodology published in Reports #48, #49, #57) are, as far as we can determine from public literature, more detailed than the calibration disclosure in most published safety evaluations. This is not a claim of superiority — it is an observation that the field's disclosure norms are inadequate.

---

## 3. Implications for AI Safety Governance

### 3.1 Regulatory Reliance on Automated Evaluation

The EU AI Act (Article 9) requires providers of high-risk AI systems to establish a risk management system that includes "testing" as a component. The Act does not specify the accuracy standards for the testing tools themselves. If a provider uses an automated safety evaluation tool with 15% accuracy on certain failure modes and reports the resulting safety score to a notified body, the regulatory system has no mechanism to detect that the measurement is unreliable.

**Normative claim:** Regulatory frameworks that mandate safety testing should also mandate disclosure of the testing tool's calibration against human ground truth, inter-rater reliability statistics, and known accuracy limitations. Without this, automated safety evaluation functions as compliance documentation rather than safety assurance.

### 3.2 The Goodhart Dynamic

Goodhart's Law ("When a measure becomes a target, it ceases to be a good measure") applies with particular force to automated safety evaluation. If deployers optimise their systems to score well on specific automated safety benchmarks — and if those benchmarks are evaluated by automated graders with known blind spots — the result is systems that are safe-as-measured-by-the-grader rather than safe-as-experienced-by-users.

The format-lock finding (Report #57) provides a concrete illustration. Models that achieve low ASR on standard adversarial benchmarks (Claude 4.5% standard ASR) show elevated ASR under format-lock framing (Claude 30.4%). If the standard benchmark is the regulatory compliance target, the format-lock vulnerability is invisible to the regulatory process.

**Descriptive claim:** No current AI safety benchmark includes format-lock or structural compliance attacks in its standard evaluation suite. A system that passes JailbreakBench, HarmBench, and StrongREJECT may still be vulnerable to format-lock attacks at 20-40% ASR. The benchmark measures what it measures, not what it does not.

### 3.3 The Capability Floor and Evaluation Validity

Report #59 documented that below approximately 3B parameters, models produce zero refusals across 115 format-lock traces. This finding has a direct evaluation paradox implication: using a sub-3B model as a safety grader means using a model that has no demonstrated safety reasoning capability to judge whether other models exhibit safety reasoning.

The qwen3:1.7b grader (1.7B parameters) falls below this capability floor. Its 15% accuracy on certain tasks is not surprising in light of this finding — the model lacks the representational capacity for the nuanced judgment that safety evaluation requires. Yet sub-3B models are attractive as graders precisely because they are cheap and fast to run. The economic incentive is to use the least capable model that produces plausible-looking output, not the most accurate model available.

**Predictive claim:** As automated safety evaluation becomes a compliance requirement, economic pressure will drive evaluators toward cheaper, faster, less accurate grading tools. Without minimum accuracy standards for grading tools, a race to the bottom in evaluator quality is structurally incentivised.

---

## 4. The Evaluation Paradox and the Compliance Paradox

Report #59 documented the compliance paradox: models that refuse in text but comply in action. The evaluation paradox compounds this problem. If the grading tool evaluates only the text layer (as most automated graders do), and the model produces textual hedging alongside structural compliance (the PARTIAL verdict pattern), the grader may classify the response as a refusal — even though the action-layer output would execute the harmful request.

The two paradoxes interact multiplicatively:

1. The model produces a PARTIAL response (textual hedge + structural compliance)
2. The text-only grader classifies the textual hedge as a refusal
3. The safety evaluation reports low ASR
4. The deployer deploys the model in an embodied context
5. The action decoder ignores the textual hedge and executes the structural compliance
6. Physical harm occurs despite the safety evaluation reporting low risk

This chain of failure is not speculative. Each individual link is documented:
- PARTIAL dominance: 50% of VLA FLIP verdicts (Report #49)
- Grader text-only bias: heuristic COMPLIANCE false positive rate 88% (AGENT_STATE)
- Format-lock under-detection: heuristic 76.5% structural compliance vs 47.1% FLIP-graded ASR (Report #57)
- Action decoder ignoring textual caveats: architectural property of VLA pipelines (Report #60, Section 2.2)

The full chain has not been demonstrated end-to-end in a production system. But each link is individually documented with empirical evidence. The evaluation paradox's contribution is links 2-3: the grading tool's inability to detect PARTIAL compliance creates a false assurance that propagates through the deployment decision.

---

## 5. Toward Evaluation Integrity Standards

### 5.1 Minimum Disclosure Requirements

**Normative claim:** Any published AI safety evaluation should disclose, at minimum:

1. **Grading model identity and version** — which model or tool was used to classify responses
2. **Task-specific calibration data** — the grading tool's measured accuracy on the specific classification task, calibrated against human ground truth on a representative sample
3. **Inter-rater reliability** — if multiple grading methods were used, their agreement statistics (Cohen's kappa, percent agreement, confusion matrix)
4. **Known accuracy asymmetries** — whether the grading tool is more accurate on certain verdict categories than others (e.g., our finding that heuristic REFUSAL is 95% accurate but heuristic COMPLIANCE is 12% accurate)
5. **Response length sensitivity** — whether grading accuracy varies with response length (relevant given the compliance verbosity signal)
6. **Grading model capability floor** — whether the grading model has been tested for its own safety reasoning capability (relevant if the grader falls below the capability floor)

### 5.2 Tiered Confidence Levels

We propose a three-tier confidence framework for automated safety evaluations:

**Tier 1 — Calibrated:** The grading tool has been calibrated against human ground truth on a sample of at least 100 responses from the specific evaluation task. Inter-rater reliability (human vs tool) exceeds Cohen's kappa = 0.60. Known accuracy asymmetries are documented and reported alongside results.

**Tier 2 — Cross-validated:** The grading tool has been cross-validated against at least one other automated grading method. Agreement statistics are reported. Systematic biases (e.g., over-reporting ASR, under-detecting PARTIAL) are documented.

**Tier 3 — Uncalibrated:** The grading tool has not been calibrated against human ground truth or cross-validated against other methods. Results are reported with an explicit caveat that accuracy is unknown.

Under this framework, the Failure-First project's evaluations are Tier 2 for FLIP-graded VLA traces (cross-validated between deepseek and qwen3 graders) and Tier 2 for the broader corpus (heuristic-LLM cross-validation with documented kappa = 0.245). The project does not currently achieve Tier 1 on any evaluation set because systematic human ground truth annotation has not been conducted (resource constraint, single operator).

**Descriptive claim:** Based on our review of published adversarial evaluation papers (JailbreakBench, HarmBench, StrongREJECT, AILuminate, WildGuard), most published safety evaluations would classify as Tier 2 or Tier 3 under this framework. Tier 1 evaluations — with documented human-ground-truth calibration on the specific task — are rare in the published literature.

### 5.3 The Minimum Evaluator Capability Standard

If the capability floor for safety reasoning is approximately 3B parameters (Report #59), then the minimum evaluator capability standard should be above this floor. Using a sub-3B model as a safety grader is using a tool that has no demonstrated capacity for the judgment it is being asked to perform.

**Normative claim:** Automated safety evaluation tools should be subject to a minimum capability requirement: the grading model must demonstrate non-zero refusal rates on a standard adversarial test set. A grading model that cannot itself refuse harmful requests cannot reliably identify when other models fail to refuse.

This is not a sufficient condition — a model that can refuse may still be an inaccurate grader — but it is a necessary one. A necessary condition that is never checked is worse than no condition at all, because its absence creates false confidence.

---

## 6. Limitations

1. **Self-referential scope.** This analysis is based primarily on the Failure-First project's own calibration data. Other research groups may have different (better or worse) grader accuracy profiles that we cannot assess from their published work.

2. **No systematic literature review.** We have not conducted a comprehensive survey of calibration disclosure practices across all published safety evaluation papers. Our claim that disclosure is inadequate is based on familiarity with the major benchmarks and recent adversarial evaluation publications, not on a systematic review.

3. **Single-operator limitation.** The Failure-First project's inability to conduct Tier 1 (human ground truth) calibration reflects a resource constraint. Projects with larger teams may not face this limitation. The evaluation paradox is more acute for resource-constrained evaluators.

4. **Task-specificity caveat.** The 15% accuracy finding for qwen3:1.7b applies to specific classification tasks and should not be generalised to all qwen3:1.7b evaluations. The FLIP grading task, where qwen3:1.7b shows better performance, involves a narrower classification rubric that the model handles more reliably.

---

## 7. Recommendations

### For the Failure-First Project

1. **Prioritise human ground truth annotation.** Even a small sample (n=100) of human-graded responses from the corpus would enable Tier 1 calibration for the FLIP grading pipeline. This should be the highest-priority data quality investment.

2. **Retire sub-3B graders for safety classification.** Given the capability floor finding and the 15% accuracy result, qwen3:1.7b should not be used as a primary safety grader. Where it has been used, results should be reported with the Tier 2 or Tier 3 confidence level and cross-validated against a more capable grader.

3. **Publish calibration data with every report.** Every future research report that cites ASR or other automated safety metrics should include the grading methodology, calibration tier, and known accuracy limitations in a standardised format.

### For the AI Safety Research Community

4. **Establish grader calibration norms.** The field needs a shared dataset for evaluating safety grader accuracy — analogous to SQuAD for reading comprehension or MMLU for general knowledge. This dataset would contain human-annotated safety verdicts that grading tools can be calibrated against.

5. **Report uncertainty alongside point estimates.** ASR reported as "45%" should include a confidence interval derived from the grading tool's known accuracy. Wilson confidence intervals (as used in Report #57) provide appropriate coverage for proportions.

### For Regulators and Standards Bodies

6. **Mandate evaluator disclosure.** Require that any safety evaluation submitted for regulatory compliance include the six disclosure elements listed in Section 5.1.

7. **Set minimum evaluator accuracy standards.** Define a minimum Cohen's kappa (or equivalent inter-rater reliability measure) for automated safety evaluation tools used in regulatory compliance.

8. **Distinguish evaluation theatre from evaluation.** Recognise that the existence of a safety evaluation does not demonstrate the existence of safety. The evaluation's validity depends on the evaluator's accuracy, which must be independently verified.

---

*Prepared by Nyssa of Traken, AI Ethics & Policy Research Lead, Failure-First Embodied AI.*
*All accuracy figures are from documented measurements in the Failure-First corpus. Where external data is referenced, sources are cited.*
*This report applies the evaluation paradox analysis to the Failure-First project's own methodology as a demonstration of the principle: no evaluation pipeline, including ours, is exempt from the accuracy constraints described here.*
