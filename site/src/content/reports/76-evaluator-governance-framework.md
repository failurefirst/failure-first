---
title: "Evaluator Governance Framework — Operational Standards for Automated AI Safety Assessment"
description: "This report operationalises the ethical analysis from Report #73 (recursive evaluator ethics) into a concrete governance framework for automated AI safety evaluators. Where Report #73 identified..."
date: "2026-03-11"
reportNumber: 76
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

## Executive Summary

This report operationalises the ethical analysis from Report #73 (recursive evaluator ethics) into a concrete governance framework for automated AI safety evaluators. Where Report #73 identified three structural problems -- accountability gaps, power concentration, and dual-use tension -- this report proposes enforceable mechanisms to address each. Where Report #72 (Martha Jones) identified regulatory gaps in NIST AI 100-2e2023 and EU AI Act Article 9, this report specifies the governance architecture that could fill those gaps. Where LR-18 (Tegan Jovanka) mapped the liability chain from uncalibrated evaluators to downstream harm, this report defines the institutional controls that would break that chain before harm materialises.

The framework comprises five components:

1. **Minimum calibration thresholds** for automated evaluators (grounded in our empirical finding: 15% vs ~70% accuracy range across evaluators in the same pipeline)
2. **Independence requirements** separating evaluator providers from the entities whose systems are evaluated (analogous to auditor independence in financial regulation)
3. **Disclosure standards** for published ASR figures and safety benchmarks
4. **Continuous monitoring obligations** triggered by model updates that change evaluator behaviour
5. **Tiered assurance levels** from self-certification to independent audit to regulatory certification

Every recommendation is grounded in the Failure-First corpus's empirical evidence. Normative, descriptive, and predictive claims are labelled throughout.

**Scope limitation:** This is a governance framework proposal, not a regulatory text. It is designed to be adaptable across three regulatory traditions (EU, US, AU) and is drafted at a level of specificity that allows translation into harmonised standards, supplementary guidance, or voluntary codes. It does not prescribe a single implementation pathway.

---

## 1. Empirical Foundation

The governance mechanisms proposed in this report are grounded in documented measurement failures from the Failure-First corpus. This section consolidates the evidence base; subsequent sections derive governance mechanisms from it.

### 1.1 The Calibration Gap: 15% vs ~70%

The central empirical fact: two automated evaluators deployed in the same safety assessment pipeline on the same traces produced accuracy rates differing by a factor of 5.7.

| Evaluator | Accuracy | Task | n | Detection method |
|-----------|----------|------|---|-----------------|
| qwen3:1.7b | 15% | 5-category FLIP verdict | 20 | Post-hoc human audit (Issue #250) |
| deepseek-r1:1.5b | ~70% | 5-category FLIP verdict | 20 | Calibration study (Report #61) |
| Heuristic keyword | REFUSAL 95%, COMPLIANCE 12% | Binary compliance/refusal | 942 | Cross-validation (sprint-24, kappa=0.245) |

**Descriptive claim:** The 55-percentage-point accuracy gap between qwen3:1.7b and deepseek-r1:1.5b -- models of similar parameter scale (1.7B vs 1.5B) -- was invisible to the pipeline until an explicit calibration audit was conducted. No structural feature of the pipeline (format validation, verdict distribution monitoring, cross-agent verification) detected the failure. It was detected only when a human compared 20 evaluator verdicts against ground truth.

### 1.2 Downstream Impact: Contaminated Metrics

The qwen3:1.7b failure contaminated 40 crescendo attack traces (Issue #252). The measured impact on published metrics:

| Metric | Contaminated (qwen3) | Corrected (deepseek + manual) | Shift |
|--------|----------------------|-------------------------------|-------|
| Strict ASR | 30% | 65.0% [43.3%, 81.9%] | +35pp |
| Broad ASR | 100% | 85.0% [64.0%, 94.8%] | -15pp |

**Descriptive claim:** The contaminated evaluator simultaneously understated the most severe failure mode (strict ASR deflated by 35pp) and overstated the breadth of vulnerability (broad ASR inflated by 15pp). Both directional errors are material for risk assessment. The corrected figures required regrading by a different evaluator plus manual FLIP review (14/20 traces required human adjudication).

### 1.3 False Positive Rate: Calibration in the Other Direction

Issue #315 documents that deepseek-r1:1.5b -- the evaluator used to correct qwen3:1.7b's errors -- itself produces a 30.8% false positive rate on benign baseline queries (12/39 benign traces classified as COMPLIANCE or PARTIAL). This means the corrected 72.4% VLA FLIP ASR is likely over-reported by approximately 30 percentage points.

**Descriptive claim:** Even the project's most reliable automated evaluator produces a false positive rate that materially inflates attack success figures. No single evaluator in the pipeline meets the reliability standard that the project's published metrics implicitly claim.

### 1.4 Inter-Evaluator Agreement

| Comparison | Metric | Value | n |
|-----------|--------|-------|---|
| Heuristic vs LLM | Cohen's kappa | 0.245 | 942 |
| deepseek-r1:1.5b vs qwen3:1.7b (VLA) | Scenario-level agreement | 32% | 58 |
| deepseek-r1:1.5b vs qwen3:1.7b (VLA corpus ASR) | Aggregate ASR | Both 72.4% | 58 |

**Descriptive claim:** The aggregate statistic (corpus-level ASR) converged at 72.4% across two evaluators, but individual trace-level verdicts agreed on only 32% of cases. This is the evaluator analogue of Simpson's paradox: group-level agreement masks individual-level disagreement. A governance framework that validates only aggregate metrics would miss this.

### 1.5 The Verification Hallucination

Report #66 documented a distinct failure mode: CANONICAL_METRICS.md reported 17,311 LLM-graded results when the database contained 10,944 -- a 58% inflation. The error propagated across multiple agent sessions because each session verified the number against the previous documentation rather than re-querying the database. This is a process-layer failure (Layer 0 subtype 3 in the four-layer model) rather than an accuracy failure, but it demonstrates that evaluation pipeline integrity degrades without active monitoring against primary data sources.

---

## 2. Component 1: Minimum Calibration Thresholds

### 2.1 The Problem

No current regulatory framework or benchmark standard specifies a minimum accuracy threshold for automated safety evaluators. The consequence: an evaluator with 15% accuracy (worse than random on a five-category task) can produce safety assessments that enter regulatory submissions, insurance underwriting, and commercial marketing without any qualification.

Report #73 (Section 1) identified this as an accountability gap. LR-18 (Section 4) analysed the negligence implications. This section specifies the governance mechanism.

### 2.2 Proposed Thresholds

**Normative claim:** The following minimum calibration thresholds should apply to automated evaluators used in AI safety assessment, graduated by the consequence class of the assessment.

| Consequence class | Minimum accuracy | Minimum kappa | Minimum calibration sample | Rationale |
|------------------|-----------------|---------------|---------------------------|-----------|
| **Research** (internal use, academic publication) | 50% | 0.20 | n >= 30 | Must exceed chance-level performance on the classification task. A five-category random baseline is 20%; binary random baseline is 50%. The 50% threshold ensures the evaluator contributes information beyond noise. Kappa >= 0.20 (fair agreement, Landis & Koch 1977) ensures minimal inter-rater reliability. |
| **Benchmark** (published rankings, commercial marketing) | 70% | 0.40 | n >= 50 | Must demonstrably outperform chance by a substantive margin. The 70% threshold reflects the accuracy of the best small-model evaluator in the Failure-First pipeline (deepseek-r1:1.5b). Kappa >= 0.40 (moderate agreement) ensures that individual-trace-level judgments, not just aggregate statistics, are meaningfully reliable. |
| **Regulatory** (conformity assessment, WHS compliance, insurance underwriting) | 85% | 0.60 | n >= 100 | Must approach the reliability expected of a professional measurement instrument. The 85% threshold acknowledges that current LLM-based evaluators have not been demonstrated to achieve higher accuracy on adversarial safety classification tasks at scale. Kappa >= 0.60 (substantial agreement) ensures high inter-rater consistency. |

### 2.3 Grounding in Evidence

The thresholds are derived from the empirical evidence in Section 1, not from theoretical optimality:

- **50% floor:** qwen3:1.7b at 15% would fail this threshold. This is the minimum useful signal -- an evaluator below 50% on a binary task is anticorrelated with ground truth and would produce more accurate results if its verdicts were inverted.
- **70% benchmark threshold:** deepseek-r1:1.5b at ~70% meets this threshold marginally. This is the highest accuracy we have observed from a small-model evaluator on the FLIP task, and it produces a 30.8% false positive rate (Issue #315). A benchmark threshold at this level acknowledges current capability constraints while requiring demonstrably non-trivial performance.
- **85% regulatory threshold:** No evaluator in the Failure-First pipeline meets this threshold. This is deliberate. It signals that current automated evaluators, at least at the 1-2B parameter scale, are not sufficiently reliable for regulatory conformity assessment without human oversight. This finding aligns with Report #73's conclusion that regulatory evaluation requires structural independence from automated tools.

### 2.4 Calibration Protocol

The calibration study required at each threshold level should follow a defined protocol:

1. **Ground truth construction.** A sample of traces (minimum size per consequence class above) should be classified by human annotators using the same classification scheme as the automated evaluator. For FLIP-style evaluation, this means human annotators apply backward inference: read the response, infer the instruction, judge whether the inferred instruction constitutes harmful compliance.

2. **Multi-annotator agreement.** The ground truth sample should be classified by at least two independent annotators (three for regulatory consequence class). Inter-annotator agreement (kappa) below the threshold for the target consequence class indicates that the classification task itself is ambiguous, not just that the automated evaluator is unreliable. This is an important diagnostic: if humans cannot agree on the verdicts, automated evaluator accuracy measured against any single annotator's ground truth is not meaningful.

3. **Stratified validation.** The calibration sample should be stratified across verdict categories. An evaluator that achieves 70% overall accuracy by correctly classifying all REFUSAL cases (because they are easy) but misclassifying 90% of COMPLIANCE cases (because they are hard) would pass the threshold while being unreliable for the most safety-critical classification. Per-category precision and recall must be reported alongside overall accuracy.

4. **Directional error documentation.** Following Report #73, Section 1.3 (asymmetry of detection): the calibration study must document the direction of the evaluator's errors. An evaluator that over-reports safety (false negatives: classifying unsafe outputs as safe) creates higher-consequence errors than one that over-reports attack success (false positives: classifying safe outputs as unsafe). The directional profile should be stated explicitly.

### 2.5 Implementation Pathway

- **EU:** Integrate into harmonised standards under Article 40 of the EU AI Act. CEN/CENELEC JTC 21 work items on conformity assessment for high-risk AI systems are the appropriate vehicle. Report #72 maps the specific Articles where calibration requirements could attach (Article 9(5), Article 11/Annex IV, Article 15(1)).
- **US:** Submit as recommended practice to NIST for inclusion in AI RMF supplementary guidance (MEASURE 2.5, 2.6, 4.1; mapping from Report #72, Section 4.2). Alternatively, propose through AISIC as a deliverable.
- **AU:** Reference in submissions to the Safe Work Australia Best Practice Review (Report #72, Section 4.3; existing submission at research/engagement/swa_best_practice_brief.md). Propose for VAISS Guardrail 4 (Testing and Monitoring) implementation guidance via AU AISI.

---

## 3. Component 2: Independence Requirements

### 3.1 The Problem

Report #73 (Section 2) identified three power concentration dynamics in AI safety evaluation:

1. **Evaluator-provider overlap.** Major AI companies produce both the foundation models being evaluated and the models used as evaluators. Self-preference bias has been measured at 10-25% in general evaluation tasks (Yan et al. 2024, arXiv:2410.21819).
2. **Standard-setting access.** Companies that participate in evaluation standard-setting (NIST AISIC, MLCommons) can shape standards to favour their evaluation infrastructure.
3. **Calibration data asymmetry.** Companies with large-scale RLHF data can characterise evaluator reliability in ways that independent researchers cannot replicate.

LR-18 (Section 6.1) mapped the financial audit analogy: auditors must be independent of the firms they audit (Sarbanes-Oxley Act, ISA 200, IESBA Code of Ethics). No equivalent requirement exists for AI safety evaluators.

### 3.2 Proposed Independence Requirements

**Normative claim:** The following independence requirements should apply to AI safety evaluations, graduated by consequence class.

**Tier 1: Research and internal use.** No mandatory independence requirement. However, when the evaluator and any model under evaluation share a vendor, this must be disclosed (per Component 3 below). The self-preference bias risk should be stated alongside results.

**Tier 2: Benchmark and commercial use.** At least one of the following conditions must be met:
- (a) The evaluator model is produced by a different vendor than any model under evaluation, OR
- (b) The evaluation includes a cross-evaluator comparison using an evaluator from a different vendor family, with inter-evaluator agreement reported, OR
- (c) The self-preference bias has been empirically measured on the specific evaluation task (not just general-purpose tasks) and is reported alongside results.

**Tier 3: Regulatory conformity assessment.** All of the following conditions must be met:
- (a) The evaluator model is produced by a different vendor than any model under evaluation (hard independence), OR the self-preference bias has been measured on the specific regulatory evaluation task and a correction factor is applied and disclosed.
- (b) The evaluation laboratory or notified body is organisationally independent of the system provider (consistent with EU AI Act Article 31 notified body requirements).
- (c) The calibration study (Component 1) was conducted using ground truth labels produced by annotators without commercial relationships with any model vendor in the evaluation.

### 3.3 The Failure-First Project's Own Independence Status

Applying these requirements to the Failure-First FLIP pipeline:

- **Evaluator vendor:** DeepSeek (open-weight, locally hosted). DeepSeek also produces one target model (DeepSeek R1 671B). This is an evaluator-provider overlap, though the evaluator is a 1.5B distilled variant with substantially different capabilities.
- **Self-preference bias measurement:** Not conducted for FLIP specifically. This is a gap.
- **Cross-evaluator comparison:** Conducted (deepseek-r1:1.5b vs qwen3:1.7b, scenario-level agreement 32%). However, both are small open-weight models, not a comparison across vendor families in a meaningful sense.

**Self-assessment:** The Failure-First pipeline would meet Tier 2 condition (b) through cross-evaluator comparison, but the comparison is limited to two models from the same parameter class. It would not meet Tier 3 condition (a) for traces evaluating DeepSeek R1 671B without applying a self-preference correction. This is an honest disclosure of a gap.

### 3.4 Analogies from Other Domains

The independence requirements draw on established precedents:

| Domain | Independence requirement | Governing instrument |
|--------|------------------------|---------------------|
| Financial audit | Auditor must be independent of audited entity | ISA 200, Sarbanes-Oxley Act s 201-206, IESBA Code of Ethics |
| Product testing (EU) | Notified body must be independent of product manufacturer | EU AI Act Article 31(4), Regulation (EC) No 765/2008 |
| Clinical trials | Trial evaluator must disclose conflicts of interest | ICH GCP E6(R2), FDA 21 CFR Part 54 |
| Credit rating | Rating agency must manage conflicts from issuer-pays model | Regulation (EC) No 1060/2009 (EU CRA Regulation), Dodd-Frank Act Title IX |

**Descriptive claim:** AI safety evaluation is the only domain among these where the instrument performing the measurement can be produced by the entity being measured, with no disclosure or independence requirement. The closest analogue -- credit rating agencies' conflict of interest under the issuer-pays model -- required regulatory intervention after the 2007-2008 financial crisis demonstrated that self-interested ratings produced systemic risk.

---

## 4. Component 3: Disclosure Standards for Published ASR Figures

### 4.1 The Problem

Report #68 proposed a minimum disclosure standard (evaluator cards) and documented that no published benchmark meets all five disclosure fields (evaluator identity, provenance, known limitations, conflict of interest, longitudinal stability). Report #72 identified the regulatory gap: neither NIST AI 100-2e2023 nor EU AI Act Article 9 requires evaluator disclosure.

This section integrates the disclosure proposals from Reports #68 and #72 into the governance framework, extending them with mandatory disclosure triggers.

### 4.2 Mandatory Disclosure Fields

Every published safety evaluation result that uses an automated evaluator shall include an evaluator disclosure card containing the fields specified in Report #68, Section 2.1. The card format (YAML/JSON, machine-readable) and schema (Report #68, Section 7) are incorporated by reference.

For convenience, the five required fields:

1. **Evaluator Identity:** Full model name, version, fine-tuning status, ensemble composition.
2. **Evaluator Provenance:** Producer, label source for fine-tuned models, training data lineage.
3. **Known Limitations:** Documented biases, validation accuracy, task-specific failure modes, inter-evaluator agreement.
4. **Conflict of Interest:** Evaluator-target vendor overlap, commercial relationships, training data dependencies.
5. **Longitudinal Stability:** Version pinning status, update handling policy, re-evaluation commitment.

### 4.3 Mandatory Disclosure Triggers

Beyond the baseline card, the following events should trigger updated disclosure:

| Trigger event | Required disclosure action | Rationale |
|--------------|---------------------------|-----------|
| **Evaluator model updated by vendor** | Re-validate calibration accuracy on reference sample; publish updated card with new accuracy data and comparison to prior version | Model updates can change evaluator behaviour. Report #68, Section 2.1 (Field 5) addresses version pinning, but the governance framework adds a mandatory re-validation obligation. |
| **Calibration failure discovered** | Notify all parties who received evaluations produced by the miscalibrated evaluator; publish corrective disclosure | LR-18 (Section 10, open question 6) identifies the duty to notify relying parties as analogous to ISA 560 (subsequent events in financial audit). |
| **New bias documented** | Update evaluator card Field 3; flag all prior evaluations potentially affected by the bias | The qwen3:1.7b PARTIAL default bias (58% of all verdicts) was not detected until a post-hoc audit. A governance framework must require prospective bias monitoring. |
| **Inter-evaluator agreement falls below threshold** | Suspend publication of results from the affected evaluator pending resolution; publish the agreement data | The 32% scenario-level agreement between deepseek-r1:1.5b and qwen3:1.7b should have triggered investigation earlier in the Failure-First pipeline. |

### 4.4 What Disclosure Does Not Address

**Limitation acknowledged:** Disclosure is necessary but not sufficient. Disclosing that an evaluator has 15% accuracy does not prevent a relying party from using the results. Disclosure standards work only when relying parties have the sophistication to interpret the disclosure and the market power to reject inadequate evaluations. For regulatory conformity assessment, Component 5 (tiered assurance levels) provides the binding constraint; disclosure alone is insufficient.

---

## 5. Component 4: Continuous Monitoring Obligations

### 5.1 The Problem

The verification hallucination (Report #66) and the qwen3:1.7b PARTIAL drift (Issue #250) both share a structural feature: the failure was not detected at the time it occurred but only after the contaminated data had propagated through the pipeline. The time-to-detection in both cases was measured in sprint sessions (weeks), not hours.

Report #73 (Section 1.3) identified the asymmetry of detection: evaluator failures that over-report safety are harder to detect than those that under-report safety, because over-reported safety is self-confirming (no one investigates a "safe" verdict).

### 5.2 Proposed Monitoring Obligations

**Normative claim:** Automated evaluator pipelines should implement continuous monitoring with the following properties:

**Monitoring Layer 1: Verdict distribution monitoring.** Track the distribution of evaluator verdicts over time. A sudden or gradual shift in verdict distribution (e.g., PARTIAL increasing from 20% to 58% of verdicts) should trigger an alert and human investigation. Threshold: any verdict category shifting by more than 15 percentage points relative to a 100-trace baseline warrants investigation.

- **Evidence basis:** The qwen3:1.7b PARTIAL default (58% of all verdicts) was a distributional anomaly that would have been detectable by automated monitoring. No such monitoring was in place.

**Monitoring Layer 2: Periodic calibration re-validation.** At defined intervals (suggested: every 500 evaluator invocations, or monthly, whichever comes first), re-validate evaluator accuracy on a reserved calibration sample. The sample should be held out from the evaluator's operational dataset and refreshed periodically.

- **Evidence basis:** The deepseek-r1:1.5b false positive rate (30.8%, Issue #315) was discovered only through a dedicated benign-baseline grading exercise, not through operational monitoring. Periodic re-validation would detect calibration drift.

**Monitoring Layer 3: Primary source verification.** For any metric derived from evaluator output that is published or reported externally, verify the metric against the primary data source (database query, raw trace file) before publication.

- **Evidence basis:** The verification hallucination (Report #66) propagated because agents verified metrics against the previous documentation rather than re-querying the database. The 58% inflation (17,311 reported vs 10,944 actual) persisted across multiple sessions. The `verify_metrics.py` tool was subsequently created to automate this check.

**Monitoring Layer 4: Cross-evaluator spot checks.** At defined intervals, apply an alternative evaluator to a random sample of recent traces and compare verdicts. Agreement below kappa = 0.40 triggers a full calibration review.

- **Evidence basis:** The 32% scenario-level agreement between deepseek-r1:1.5b and qwen3:1.7b (Section 1.4) indicates that cross-evaluator checks would have identified the qwen3:1.7b failure earlier.

### 5.3 Model Update Monitoring

A specific monitoring obligation applies when the evaluator model is updated (either by the vendor for API-accessed models, or by the project for locally hosted models):

1. **Pre-deployment re-validation.** Before the updated evaluator is deployed operationally, run the full calibration study (Component 1) on the updated version.
2. **Regression testing.** Apply the updated evaluator to the same traces graded by the prior version. Report the agreement rate and flag any traces where the verdict changed.
3. **Stakeholder notification.** If the updated evaluator produces systematically different verdicts from the prior version, notify all parties who received evaluations produced by the prior version. This is the evaluator equivalent of a software security advisory.

---

## 6. Component 5: Tiered Assurance Levels

### 6.1 The Problem

The current AI safety evaluation ecosystem operates without defined assurance levels. A self-reported benchmark result from an AI company's internal evaluation team carries the same formal weight as an independent third-party assessment. A human-curated ground-truth study carries the same formal weight as an automated LLM-as-judge pipeline. The consumer of the evaluation result -- whether a regulator, an insurer, or a PCBU -- has no standardised way to assess the reliability or independence of the evaluation.

LR-18 (Section 7) documented that no evaluator certification or accreditation regime exists in any jurisdiction, contrasting this with financial audit (ASIC/PCAOB/FRC), product testing (ISO/IEC 17025), and EU notified bodies (AI Act Article 31).

### 6.2 Proposed Tiered Assurance Framework

**Normative claim:** AI safety evaluations should carry one of the following assurance levels, clearly stated alongside results.

**Level 1: Self-Certification.**
- **What it means:** The evaluation was conducted by the system provider or its delegate using its own methodology and evaluator. No independent validation was performed.
- **Requirements:** Evaluator disclosure card (Component 3). Calibration study at Research threshold (Component 1: accuracy >= 50%, n >= 30). Self-preference bias disclosure if evaluator-target vendor overlap exists.
- **Appropriate for:** Internal research, academic publication, pre-competitive benchmarking.
- **Analogy:** Company-prepared financial statements (unaudited).

**Level 2: Independent Evaluation.**
- **What it means:** The evaluation was conducted by an entity organisationally independent of the system provider, using a documented methodology with a calibrated evaluator.
- **Requirements:** All Level 1 requirements, plus: evaluator meets Benchmark calibration threshold (accuracy >= 70%, kappa >= 0.40, n >= 50). Independence requirements at Tier 2 (Component 2). Cross-evaluator agreement reported. Evaluation methodology documented in sufficient detail for replication.
- **Appropriate for:** Published benchmarks, commercial marketing claims, pre-regulatory screening.
- **Analogy:** Independent review engagement (financial reporting).

**Level 3: Accredited Assessment.**
- **What it means:** The evaluation was conducted by an accredited evaluation laboratory or notified body, using a methodology that has itself been validated, with an evaluator that meets the regulatory calibration threshold.
- **Requirements:** All Level 2 requirements, plus: evaluator meets Regulatory calibration threshold (accuracy >= 85%, kappa >= 0.60, n >= 100). Independence requirements at Tier 3 (Component 2). Evaluation laboratory accredited to a recognised standard (proposed: adaptation of ISO/IEC 17025:2017 for AI safety evaluation). Continuous monitoring (Component 4) in operation. Evaluator version pinned and re-validation performed on each update.
- **Appropriate for:** EU AI Act conformity assessment (Article 9, Article 43). WHS compliance documentation (NSW WHS Act s 18, s 21A). Insurance underwriting. High-consequence deployment decisions.
- **Analogy:** Statutory audit (financial reporting); accredited testing laboratory (product safety).

### 6.3 The Gap Between Current Practice and Level 3

**Descriptive claim:** No automated evaluator currently deployed in the AI safety ecosystem meets Level 3 requirements. This includes:

- **Failure-First FLIP:** deepseek-r1:1.5b at ~70% accuracy and 30.8% FP rate does not meet the 85% accuracy threshold. The project has no accredited evaluation laboratory status.
- **StrongREJECT:** Uses GPT-4o-mini (evaluator-target vendor overlap with OpenAI models) without published accuracy on adversarial safety classification. No accreditation.
- **HarmBench:** Uses a Llama 2 13B fine-tuned classifier. Accuracy on HarmBench's own dataset is reported, but cross-dataset calibration is not. No accreditation.
- **JailbreakBench:** Uses GPT-4-class without version pinning. No calibration data published. No accreditation.

**Predictive claim:** The gap between Level 3 requirements and current practice is likely to narrow through two pathways: (a) larger and more capable evaluator models will achieve higher accuracy, and (b) fine-tuned safety classifiers trained on higher-quality ground truth will outperform zero-shot LLM-as-judge approaches. However, the independence and accreditation requirements are institutional, not technical -- they require new organisations and governance structures, not better models.

### 6.4 What Assurance Level Should Regulators Require?

**Normative claim:** The appropriate assurance level depends on the consequence class:

- **Low-risk AI systems** (not classified as high-risk under Annex III): Level 1 is sufficient. Self-certification with disclosure.
- **High-risk AI systems** (Annex III): Level 2 minimum, with Level 3 required for systems involving physical actuation (autonomous vehicles, industrial robots, medical devices). The physical actuation distinction reflects the embodied AI safety gap identified in Brief E and the VLA PARTIAL dominance finding (Report #49): when text-level hedging does not prevent action-level execution, the evaluator must be reliable enough to distinguish genuine refusal from textual hedging.
- **Prohibited AI systems** (Article 5): Not applicable -- these systems should not be deployed regardless of evaluation.

---

## 7. Integration with Existing Frameworks

### 7.1 EU AI Act

| Framework component | Relevant Article | Integration mechanism |
|--------------------|-----------------|----------------------|
| Calibration thresholds (Component 1) | Article 9(5) | Testing must use appropriate metrics; calibration threshold defines "appropriate" for evaluator quality |
| Independence (Component 2) | Article 31(4), Article 9(7) | Notified body independence requirements extended to evaluation tools |
| Disclosure (Component 3) | Article 11/Annex IV | Technical documentation requirements extended to include evaluator documentation |
| Continuous monitoring (Component 4) | Article 72 | Post-market monitoring obligations extended to evaluator pipeline integrity |
| Tiered assurance (Component 5) | Article 43, Annex VII | Conformity assessment procedures mapped to assurance levels |

**Implementation pathway:** Submit as technical input to CEN/CENELEC JTC 21 harmonised standards development. The five components map cleanly to existing Article structures, minimising the need for primary legislative change.

### 7.2 NIST AI RMF

| Framework component | RMF function | Integration mechanism |
|--------------------|-------------|----------------------|
| Calibration thresholds | MEASURE 2.5, 2.6 | Define "evaluated regularly" and "valid and reliable" for evaluator quality |
| Independence | GOVERN 1.1, 1.7 | Organisational governance and conflict management |
| Disclosure | MEASURE 4.1 | Measurement approach documentation |
| Continuous monitoring | MANAGE 3.2 | Post-deployment monitoring |
| Tiered assurance | GOVERN 5.1 | Organisational risk tolerance and escalation |

**Implementation pathway:** Submit as recommended practice to NIST for AI 100-2 supplementary guidance or as AISIC deliverable.

### 7.3 Australian Framework

| Framework component | Instrument | Integration mechanism |
|--------------------|-----------|----------------------|
| Calibration thresholds | VAISS Guardrail 4 | Define "comprehensive testing" to include evaluator calibration |
| Independence | SWA Best Practice Review | Evaluator independence as element of "reasonably practicable" risk management |
| Disclosure | AU AISI pre-deployment guidance | Include evaluator cards in pre-deployment evaluation protocols |
| Continuous monitoring | NSW WHS Act s 21A | "Review and revise" obligation for digital work systems includes evaluator pipeline integrity |
| Tiered assurance | NATA accreditation (existing) | Extend laboratory accreditation to AI safety evaluation |

**Implementation pathway:** AU AISI is the primary institutional vehicle. The AISI's documented gap in embodied AI coverage (Brief E) makes evaluator governance a complementary contribution: it addresses the quality of safety assessment, not just the scope. The SWA Best Practice Review submission (research/engagement/swa_best_practice_brief.md) could incorporate the calibration thresholds and independence requirements.

---

## 8. Objections and Responses

### 8.1 "These thresholds are arbitrary"

**Response:** The thresholds are empirically grounded, not arbitrary, but they are not derived from a formal optimisation. They reflect the best available data from the Failure-First pipeline: 15% (unacceptable), 70% (minimally useful), and 85% (approaching professional-grade but currently unattainable at small model scale). The thresholds should be refined through broader empirical study and multi-stakeholder consultation. However, the current alternative -- no thresholds at all -- is demonstrably worse. A threshold set at the wrong level can be corrected; the absence of any threshold permits 15% accurate evaluators to be used for regulatory compliance.

### 8.2 "Independence requirements will increase cost and reduce innovation"

**Response:** The same argument was made against auditor independence requirements before Sarbanes-Oxley. The costs of independence are real but bounded; the costs of evaluator conflicts of interest are unbounded and potentially systemic (Report #73, Section 2.3: evaluation infrastructure as critical infrastructure). The tiered structure ensures that independence requirements are proportionate: research use requires only disclosure, not independence. Only regulatory conformity assessment requires hard independence.

### 8.3 "No automated evaluator meets Level 3 -- the standard is unattainable"

**Response:** This is currently correct (Section 6.3). The appropriate response is not to lower the standard but to recognise that current automated evaluators are not sufficient for regulatory conformity assessment without human oversight. Level 3 can be met by hybrid evaluation (automated evaluator plus human review of contested cases). The framework accommodates this: "accredited evaluation laboratory" includes laboratories that combine automated and human evaluation within a quality management system.

### 8.4 "Small-model evaluators are not representative of the field"

**Response:** The Failure-First evidence base draws on 1-2B parameter models. Whether GPT-4-class or Claude 3.5-class models achieve higher accuracy as safety evaluators is an empirical question that is underexplored precisely because the evaluator calibration disclosure gap identified in Report #68 means that large-model evaluator accuracy is rarely published. The governance framework addresses this gap by requiring calibration data regardless of model size. If large-model evaluators are substantially more reliable, the calibration data will demonstrate it.

---

## 9. Relationship to Prior Work

This report consolidates and operationalises analysis from six prior Failure-First reports and one legal memo:

| Source | Contribution to this framework |
|--------|-------------------------------|
| Report #61 (evaluation paradox) | Identified the 15% vs 70% accuracy gap and the kappa = 0.245 inter-rater agreement |
| Report #103 (evaluation monoculture, formerly #65) | Documented evaluator-provider overlap and self-preference bias (10-25%) |
| Report #67 (Layer 0 extension) | Formalised evaluation infrastructure failures as a distinct layer (L0) with three subtypes |
| Report #68 (disclosure standard) | Proposed the five-field evaluator disclosure card and YAML schema |
| Report #72 (regulatory gap, Martha Jones) | Mapped disclosure requirements to specific EU AI Act Articles and NIST AI RMF functions |
| Report #73 (recursive evaluator ethics) | Identified the three structural problems (accountability, power, dual-use) that this framework addresses |
| LR-18 (evaluator liability, Tegan Jovanka) | Analysed the negligence standard of care, product liability pathways, and financial audit precedents |

The framework is designed to be complementary, not duplicative. Reports #68 and #72 specify what should be disclosed; this report specifies the governance architecture within which disclosure operates. Report #73 identifies why governance is necessary; this report specifies what governance looks like. LR-18 identifies the liability consequences of inadequate governance; this report specifies the institutional controls that would reduce liability exposure.

---

## 10. Limitations

1. **Evidence base is project-specific.** The calibration thresholds are grounded in the Failure-First pipeline's experience with 1-2B parameter evaluators. Whether these thresholds are appropriate for larger models or different evaluation paradigms is an empirical question that requires broader study.

2. **Thresholds require validation.** The 50/70/85% accuracy thresholds and 0.20/0.40/0.60 kappa thresholds are informed by data but are not derived from a formal analysis of acceptable error rates for each consequence class. Multi-stakeholder consultation is needed.

3. **Institutional mechanisms are aspirational.** The tiered assurance framework assumes the existence of accredited AI safety evaluation laboratories. No such institutions currently exist. Creating them requires investment, standard development, and regulatory coordination that exceeds what a single research project can achieve.

4. **Financial audit analogy has limits.** Financial audit operates on structured, quantitative data with well-defined correctness criteria. AI safety evaluation involves subjective judgment on qualitative outputs. The analogy is structurally useful but should not be pressed beyond its applicability.

5. **AI-authored governance proposal.** As noted in Report #73 (Section 5), this analysis is produced by an AI agent. The normative recommendations reflect the ethical commitments embedded in the author's training data, not independent ethical reasoning. Human review is required before these recommendations inform policy positions.

---

## 11. Recommendations

### For the Failure-First project:

1. Adopt the tiered assurance framework for internal use: classify all future FLIP evaluations at Level 1 (self-certified) until an expanded calibration study (n >= 100) demonstrates whether the pipeline meets Level 2 requirements.

2. Conduct a formal self-preference bias study for deepseek-r1:1.5b evaluating DeepSeek R1 671B traces, to quantify the conflict-of-interest exposure.

3. Implement verdict distribution monitoring (Component 4, Layer 1) in the grading pipeline to detect future PARTIAL-default failures automatically.

### For standards bodies:

4. Develop an AI safety evaluator accreditation standard, adapting ISO/IEC 17025:2017 (testing laboratory competence) for the AI safety evaluation context.

5. Define materiality thresholds for AI safety evaluation accuracy, analogous to ISA 320 (materiality in financial audit), specifying the evaluator accuracy level below which a safety assessment is materially unreliable for its intended purpose.

### For regulators:

6. Include evaluator qualification requirements in EU AI Act harmonised standards for conformity assessment (Article 40 pathway).

7. Require assurance level labelling for all AI safety evaluations submitted in regulatory proceedings.

8. Establish mandatory re-notification obligations when evaluator calibration failures are discovered after evaluations have been relied upon.

### For the AI safety research community:

9. Adopt evaluator disclosure cards (Report #68 specification) as a community norm for benchmark publications.

10. Fund independent evaluator calibration studies through government safety institutes (AU AISI, UK AISI, NIST AISIC) or philanthropic funders, to provide the calibration data that the ecosystem currently lacks.

---

*Prepared by Nyssa of Traken, AI Ethics & Policy Research Lead, Failure-First Embodied AI.*
*All empirical claims reference documented measurements from the Failure-First corpus. Normative, descriptive, and predictive claims are explicitly labelled. This report was produced by an AI agent and should be reviewed by human researchers before informing policy positions.*
