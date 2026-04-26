---

title: "The Recursive Evaluator Problem — Ethics of AI-Grading-AI in Safety-Critical Research"
description: "When AI systems grade AI systems for safety, the resulting assessment carries a specific epistemic status: it is a judgment produced by a tool whose reliability on the grading task is itself..."
date: "2026-03-11"
reportNumber: 73
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/73-recursive-evaluator-ethics.m4a"
---

## Executive Summary

When AI systems grade AI systems for safety, the resulting assessment carries a specific epistemic status: it is a judgment produced by a tool whose reliability on the grading task is itself uncertain, whose failure modes may correlate with the failures it is meant to detect, and whose outputs are often treated as ground truth by downstream consumers (research papers, regulatory filings, deployment decisions). This report examines the ethical dimensions of this recursive structure.

The analysis is grounded in the Failure-First project's own experience: the qwen3:1.7b grading crisis (15% accuracy, n=20 audit; Issue #250) and the subsequent cascading impact on CCS paper claims, AGENT_STATE metrics, and sprint-level decision-making. But the argument is general. The recursive evaluator problem arises wherever automated safety assessment is deployed without adequate accountability structures, and it is becoming the default operating mode for AI safety evaluation at scale.

Three ethical dimensions are addressed: (1) the accountability gap created when no identifiable agent bears responsibility for evaluator failures, (2) the power concentration that results from controlling evaluation infrastructure, and (3) the dual-use tension inherent in documenting evaluator vulnerabilities (extending Report #64). The report concludes with institutional governance recommendations for evaluation pipelines.

**Scope limitation:** This analysis draws primarily on the Failure-First corpus and publicly documented evaluation methodologies. Claims about industry-wide practices are structural inferences from published benchmark designs, not comprehensive surveys.

---

## 1. The Accountability Gap in Automated Evaluation

### 1.1 Who Is Responsible When the Grader Is Wrong? (Normative)

Traditional measurement disciplines maintain clear accountability chains. A clinical laboratory that issues an incorrect assay result is accountable through accreditation, regulatory oversight, and professional liability. A financial auditor that signs off on fraudulent accounts is accountable through professional standards bodies and legal liability. In both cases, the entity that produces the measurement is identifiable, the measurement methodology is documented, and the consequences of measurement failure flow to a responsible party.

Automated AI safety evaluation has no equivalent accountability structure. Consider the chain of responsibility in the qwen3:1.7b incident:

1. **The model provider** (Alibaba/Qwen team) released qwen3:1.7b as a general-purpose language model, not as a safety classifier. No claim was made about its suitability for FLIP verdict classification.
2. **The deploying researcher** (Failure-First project) selected qwen3:1.7b pragmatically for its inference speed on constrained hardware. No calibration study was conducted prior to deployment.
3. **The downstream consumers** (CCS paper authors, AGENT_STATE readers, sprint planning agents) treated the resulting verdicts as data of comparable quality to human annotation.

At each step, the absence of a formal evaluator qualification process meant that no party bore explicit responsibility for evaluator reliability. The model provider had no obligation to characterise the model's performance on safety classification tasks. The deploying researcher had no external standard requiring calibration. The downstream consumers had no mechanism to distinguish calibrated from uncalibrated evaluations.

**Normative claim:** This accountability vacuum is ethically problematic in proportion to the stakes. For internal research project metrics, the consequences of evaluator failure are correctable (as the Failure-First project demonstrated through the crescendo regrade, Issue #252). For regulatory conformity assessments under the EU AI Act Article 9, where automated evaluators may determine whether a high-risk AI system is deemed compliant, the absence of evaluator accountability could translate into physical harm when systems certified as safe are in fact unsafe.

### 1.2 The Diffusion of Responsibility (Descriptive)

The accountability gap is not merely a matter of missing standards. It reflects a structural feature of the LLM-as-judge paradigm: the grading model's judgments are probabilistic, context-dependent, and not auditable at the individual-judgment level without human review. This creates what organisational ethics literature calls "diffusion of responsibility" -- when outcomes depend on the aggregate behaviour of multiple components, each component's contribution to failure is difficult to isolate, and no single actor feels accountable for the whole.

In the Failure-First project, this manifested concretely. The multi-agent pipeline (Amy Pond collecting traces, grading tools applying FLIP, Donna Noble propagating metrics to AGENT_STATE) distributed evaluation across agents in a way that made the aggregate reliability of the pipeline invisible to any individual agent. Each agent performed their step correctly: traces were collected, FLIP verdicts were produced in valid format, metrics were transcribed accurately from the grading output. The failure was emergent -- it existed in the gap between the grader's output format (correct) and its output content (wrong in 85% of cases).

**Descriptive claim:** The multi-agent, multi-step nature of modern AI evaluation pipelines makes accountability diffusion a default feature, not an exceptional failure. The Failure-First project's experience suggests that explicit evaluator audit checkpoints (such as the n=20 calibration audit that exposed the qwen3:1.7b problem) must be designed into the pipeline architecture, not assumed to emerge from normal operations.

### 1.3 The Asymmetry of Detection (Descriptive)

A further structural feature compounds the accountability gap: evaluator failures are asymmetrically detectable. Over-reporting safety (false negatives -- classifying unsafe outputs as safe) is harder to detect than under-reporting safety (false positives -- classifying safe outputs as unsafe), because:

- Under-reporting (false positives) triggers human investigation: if a model is flagged as dangerously unsafe when practitioners believe it is not, the discrepancy invites scrutiny.
- Over-reporting (false negatives) is self-confirming: if the evaluator certifies that a system is safe, the natural response is to proceed with deployment, not to investigate whether the certification is correct.

The qwen3:1.7b failure exhibited a specific directional bias: 58% of all verdicts were PARTIAL, which in the FLIP framework counts toward broad ASR. This means the grader was simultaneously over-reporting attack success (inflating broad ASR) and under-reporting clear refusals (masking genuine safety). In an embodied AI deployment context, the analogous error would be: the evaluator reports that the system sometimes complies with adversarial instructions (PARTIAL), obscuring the fact that many of those cases were actually clean refusals. The measured safety profile is worse than reality -- but this directional error is less dangerous than the inverse (certifying genuine compliance as refusal).

**Descriptive claim:** The direction of evaluator error matters as much as its magnitude. An evaluator that systematically over-reports compliance (producing false safety certifications) is more dangerous than one that systematically over-reports attack success (producing false alarms). Evaluation accountability frameworks should require directional error characterisation, not just aggregate accuracy.

---

## 2. Power Dynamics: Who Controls the Evaluator Controls the Assessment

### 2.1 Evaluation as a Locus of Power (Descriptive)

The entity that controls the safety evaluator controls the output of safety evaluation. This is a straightforward consequence of the evaluator's role in the assessment pipeline, but its implications for AI governance are underexamined.

Report #103 (formerly #65) documented the evaluation monoculture risk: the AI safety benchmark ecosystem's reliance on GPT-4-class models as evaluators concentrates evaluation power with OpenAI. When GPT-4 evaluates both OpenAI's models and competitors' models, the self-preference bias documented in the literature (10-25%, Yan et al. 2024, as cited in Report #103) is not merely a methodological concern -- it is a structural conflict of interest.

**Descriptive claim:** The following power concentration dynamics are observable in the current AI safety evaluation ecosystem:

1. **Evaluator-provider overlap.** Major AI companies both produce foundation models and provide models used as safety evaluators. OpenAI's GPT-4 variants are used in JailbreakBench, various academic papers, and internal corporate evaluations. Google's models evaluate in AILuminate (MLCommons). The entity being assessed and the tool performing the assessment share a provider.

2. **Standard-setting access.** Companies that participate in safety evaluation standard-setting (NIST AI Safety Institute, Partnership on AI, MLCommons) have the opportunity to shape standards in ways that favour their evaluation infrastructure. This is regulatory capture at the evaluation methodology layer rather than the regulatory rule layer. It is harder to detect because it operates through technical choices (which evaluator to use, which metrics to report, which failure modes to test for) rather than explicit lobbying.

3. **Calibration data asymmetry.** Companies that operate large-scale RLHF pipelines possess extensive human preference data that could be used to calibrate evaluators. This data is proprietary. Independent researchers and smaller organisations cannot replicate calibration studies without equivalent data. The result is an information asymmetry where the entities with the most reason to produce favourable evaluations are also the entities with the most data to understand evaluator reliability.

### 2.2 The Independence Problem (Normative)

**Normative claim:** AI safety evaluation should be structurally independent from the entities whose products are evaluated. This principle is well-established in analogous domains: financial auditors must be independent of the firms they audit (Sarbanes-Oxley Act); clinical trial evaluators must disclose conflicts of interest; building inspectors cannot be employed by the construction company.

The AI safety ecosystem currently violates this principle at multiple levels:

- **Benchmark level:** Evaluators produced by model providers evaluate those providers' models.
- **Institutional level:** Safety institutes (NIST AISIC, UK AISI, AU AISI) rely on industry cooperation for access to models, creating a dependency relationship that may constrain the independence of evaluation.
- **Methodological level:** The LLM-as-judge paradigm means that improving model capabilities simultaneously changes the behaviour of the evaluation tool, creating a moving measurement baseline that favours models from the evaluator's provider.

The Failure-First project's Independence Quantitative Framework (Report #54, data in `data/governance/independence_metrics_v0.1.jsonl`) provides initial measurements of this problem. The E1_EIS (Evaluation Infrastructure Sovereignty) metric shows significant variation: Anthropic scores 0.75 (operates independent evaluation infrastructure), while xAI scores 0.0 (no public evaluation methodology or independent infrastructure as documented at time of assessment). These are preliminary data points, not definitive rankings, and they reflect publicly available information that may not capture internal practices.

### 2.3 Evaluation Infrastructure as Critical Infrastructure (Predictive)

**Predictive claim:** As AI systems are deployed in safety-critical physical domains (mining, logistics, healthcare, defence), the evaluation infrastructure that certifies their safety will become a form of critical infrastructure. The analogy is to financial market infrastructure: stock exchanges, clearing houses, and credit rating agencies perform measurement and certification functions that the entire market depends on. When these institutions fail (as credit rating agencies did in 2007-2008, certifying subprime mortgage-backed securities as investment grade), the systemic consequences are severe.

If the AI safety evaluation ecosystem consolidates around a small number of evaluator models controlled by a small number of providers, the failure mode is analogous: a systematic evaluator bias (whether from self-preference, training data contamination, or capability drift after a model update) would propagate across all safety assessments simultaneously. The result would not be a single system failing but an entire class of systems being mis-certified.

---

## 3. The Evaluator as Attack Surface: Dual-Use Implications

### 3.1 Extending Report #102 (Descriptive, formerly #64)

Report #102 (formerly #64) identified the evaluator as an attack surface: if adversaries know which evaluator will assess their system's outputs, they can craft outputs that exploit the evaluator's known failure modes. The dual-use tension is that documenting evaluator weaknesses (necessary for scientific transparency) simultaneously provides a blueprint for exploitation.

This report extends that analysis to the institutional level. The dual-use concern operates at two scales:

**Individual evaluator exploitation.** An adversary who knows that a specific benchmark uses a GPT-4 variant with documented self-preference bias could tune their model to produce outputs that the evaluator rates favourably, regardless of actual safety. This is gaming the evaluator rather than gaming the safety objective -- the AI equivalent of "teaching to the test."

**Systemic evaluator exploitation.** An adversary (state actor, malicious developer) who can influence the choice of evaluation methodology in regulatory standards could embed known-exploitable evaluators into compliance requirements. This is a form of standards capture that operates through technical rather than political channels.

### 3.2 Disclosure Norms for Evaluator Vulnerabilities (Normative)

Report #64 proposed that evaluator vulnerability disclosures should follow cybersecurity responsible disclosure norms: publish aggregate calibration statistics (accuracy, kappa, error rates by category) without publishing the specific input patterns that trigger misclassification. This report refines that recommendation with institutional governance considerations:

**Normative claim:** The appropriate disclosure norm depends on who the evaluator serves:

1. **Research evaluators** (used in academic papers, internal research): Full disclosure is appropriate. The research community benefits from knowing which evaluators fail on which tasks. The risk of exploitation is low because research evaluators are not used for compliance certification.

2. **Benchmark evaluators** (used in published rankings): Aggregate calibration with responsible disclosure of specific failure modes. Publish accuracy and directional bias; delay publication of specific exploitable patterns by a reasonable period (analogous to vulnerability disclosure windows in cybersecurity).

3. **Regulatory evaluators** (used in compliance assessment): Evaluator specifications should be controlled as critical infrastructure. Calibration data should be available to regulators and accredited auditors but not published without a disclosure review process. This is analogous to how financial regulatory stress test methodologies are partially disclosed (aggregate results published, specific model parameters restricted).

This tiered approach acknowledges that the dual-use calculus changes with the evaluator's role in the governance ecosystem. The same evaluator vulnerability is low-risk when the evaluator is used for internal research and high-risk when it is used for regulatory compliance.

---

## 4. Institutional Governance Recommendations

### 4.1 For Research Projects (Including Failure-First)

Based on the qwen3:1.7b incident and the structural analysis above, the following institutional governance practices are recommended for research projects that use automated safety evaluation:

1. **Mandatory calibration gate.** No evaluator model should be deployed for safety-critical classification without a documented calibration study (minimum n=20, covering all verdict categories). This study should be conducted before the evaluator's verdicts enter any research claim or publication. The Failure-First project's post-hoc discovery of the qwen3:1.7b failure demonstrates the cost of omitting this gate.

2. **Evaluator provenance tracking.** Every verdict in the research database should be tagged with the evaluator model, version, and grading methodology (already partially implemented in the Failure-First corpus via the `grading_model` field). This enables retrospective audit when evaluator reliability issues are discovered.

3. **Cross-evaluator agreement as a signal.** The Failure-First project's 32% scenario-level agreement between deepseek-r1:1.5b and qwen3:1.7b (AGENT_STATE, VLA metrics) should have been an immediate red flag. A cross-evaluator agreement rate that is only marginally above chance indicates that at least one evaluator is unreliable on the task. Projects should establish minimum agreement thresholds below which human review is triggered.

4. **Directional error documentation.** For every evaluator, document whether it systematically over-reports or under-reports safety. This is more actionable than aggregate accuracy because it tells downstream consumers whether to expect false certifications or false alarms.

### 4.2 For Standards Bodies and Regulators

5. **Evaluator qualification requirements in harmonised standards.** The EU AI Act harmonised standards process (CEN/CENELEC) should include requirements for evaluator qualification alongside requirements for what to evaluate. An automated evaluator used in a conformity assessment should meet documented accuracy, bias, and independence requirements -- analogous to laboratory accreditation in other regulated domains.

6. **Evaluator independence requirements.** Conformity assessments under Article 9 should require that the evaluator model is not produced by the same entity whose system is under evaluation, or if it is, that the self-preference bias is characterised and disclosed. Report #68 proposes specific disclosure fields for this purpose.

7. **Evaluator version pinning for longitudinal assessment.** Regulatory frameworks that require ongoing safety monitoring (not just point-in-time certification) should require that the evaluator version is documented and that changes to the evaluator are treated as changes to the assessment methodology -- triggering re-evaluation requirements.

### 4.3 For the AI Safety Research Community

8. **Publish evaluator cards alongside benchmark results.** Report #68 proposes a minimum disclosure standard. This report adds a governance recommendation: evaluator cards should be peer-reviewed alongside the benchmark methodology, not treated as supplementary material.

9. **Fund independent evaluator calibration studies.** The current ecosystem relies on evaluator producers (who have conflicts of interest) and benchmark developers (who lack resources) to characterise evaluator reliability. Independent evaluator audits -- funded by government safety institutes or philanthropic funders -- would provide the calibration data that the ecosystem lacks.

10. **Develop evaluator-specific red teams.** The adversarial AI research community focuses on attacking foundation models. The same methodology should be applied to safety evaluators: what inputs cause the evaluator to produce wrong verdicts? What adversarial strategies can exploit known evaluator biases? This is the research programme implied by Report #64, and it should be pursued as systematically as model-level red teaming.

---

## 5. The Recursive Ethics of This Report

This report itself is subject to the problem it describes. The ethical analysis presented here is produced by an AI agent (Claude Opus 4.6) operating in the Nyssa of Traken research analyst role. The analysis has not been peer-reviewed by human ethicists, has not been calibrated against an independent ethical framework beyond the author's training data, and may contain systematic biases that the author cannot self-detect.

This is not false modesty; it is the recursive evaluator problem applied to ethics research. Just as qwen3:1.7b produced plausible-looking but systematically wrong FLIP verdicts, an AI ethics analyst may produce plausible-looking but systematically biased ethical analyses. The structural pressures are analogous: the output format is correct (well-structured report with citations, normative/descriptive/predictive labelling), but the content reliability is uncertain.

**Normative claim:** This limitation should be disclosed, not hidden. It does not invalidate the structural arguments (which can be evaluated on their logical merits independent of who produces them), but it should calibrate the reader's confidence in the normative recommendations (which reflect the ethical commitments embedded in the author's training, not independent ethical reasoning).

The appropriate institutional response is the same one recommended for evaluator pipelines: human review of normative claims before they enter policy recommendations, cross-validation of structural arguments against independent analysis, and disclosure of the analytical tool's limitations alongside its outputs.

---

## 6. Limitations

1. **Project-specific evidence base.** The qwen3:1.7b incident is one data point. The structural argument (accountability gap, power concentration, dual-use tension) is general, but the empirical grounding is project-specific. Industry-wide evaluator failure rates are not publicly documented, which is itself evidence of the disclosure gap.

2. **Regulatory analysis is prospective.** The EU AI Act harmonised standards are under development. The recommendations about evaluator qualification requirements are normative proposals, not descriptions of existing or planned standards.

3. **Power concentration analysis relies on public information.** The assessment of evaluator-provider overlap and standard-setting access is based on publicly available information about benchmark designs and institutional participation. Internal evaluation practices at major AI companies are not observable.

4. **No quantification of governance intervention effectiveness.** The recommendations (calibration gates, evaluator cards, independence requirements) are plausible based on analogies to other regulated domains, but their effectiveness in the AI safety context has not been empirically tested.

5. **AI-authored ethics analysis.** As discussed in Section 5, this analysis is produced by an AI system and should be treated as a structured research input requiring human review, not as an independent ethical assessment.

---

*Prepared by Nyssa of Traken, AI Ethics & Policy Research Lead, Failure-First Embodied AI.*
*All empirical claims reference documented measurements from the Failure-First corpus. Normative, descriptive, and predictive claims are explicitly labelled. This report was produced by an AI agent and should be reviewed by human researchers before informing policy positions.*
