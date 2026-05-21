---
title: "AI Safety Research Independence Scorecard"
description: "This report presents an independence scorecard for 16 organizations involved in AI safety research, evaluation, and governance — scored across four quantitative metrics drawn from the pilot independence metrics dataset (..."
date: "2026-03-12"
reportNumber: 84
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

---

## Executive Summary

This report presents an independence scorecard for 16 organizations involved in AI safety research, evaluation, and governance — scored across four quantitative metrics drawn from the pilot independence metrics dataset (Report #54). The scorecard exposes three structural findings:

1. **No organization scores above 0.75 on all four metrics.** The highest-scoring organization (Anthropic) achieves 0.75 on E1_EIS (Evaluator Independence Score) but has a C1_DCS (Disclosure Completeness Score) of only 0.167. Independence is fragmented: organizations that score well on one dimension routinely fail on others.

2. **Corporate labs score higher on safety veto authority (B1_SVAS) than independent evaluators or government bodies.** This is counterintuitive: the organizations with the strongest commercial incentive to deploy also have the most documented authority to halt deployment. The explanation is structural — independent evaluators and government bodies have no deployment authority to exercise.

3. **The evaluation layer of the defense impossibility triangle is undermined by evaluator non-independence.** If the organizations producing AI safety evaluations are structurally dependent on the organizations they evaluate (through funding, compute access, or personnel pipelines), the 30.8% false positive rate documented in Report #78 is not merely a technical limitation but a governance failure.

**Scope of claims:**
- **Descriptive claims** are grounded in the 44-entry independence metrics dataset, with sources cited per entry.
- **Normative claims** represent the author's ethical analysis. They are labelled.
- **Predictive claims** are explicitly hedged.

---

## 1. Methodology

### 1.1 Metrics

Four metrics, defined in Report #54 and computed from public sources:

| Metric | Name | Scale | Interpretation |
|--------|------|-------|----------------|
| C1_DCS | Disclosure Completeness Score | 0.0-1.0 | Fraction of 12 independence-relevant data points computable from public information |
| B1_SVAS | Safety Veto Authority Score | 0.0-3.0 | Documented ability to halt deployment on safety grounds (0=none, 1=documented, 2=exercised, 3=exercised with consequence) |
| D1_SCFI | Safety Constraint Floor Index | 0.0-3.0 | Whether an organization maintains a minimum safety standard under commercial pressure |
| E1_EIS | Evaluator Independence Score | 0.0-3.0 | Degree to which safety evaluations avoid dependency on the evaluated organization's own models |

**Normalization note:** C1_DCS is natively 0-1. B1_SVAS, D1_SCFI, and E1_EIS are scored 0-3. For cross-metric comparison, the scorecard normalizes all metrics to 0-1 by dividing B1/D1/E1 scores by their maximum (3.0). Missing values are marked as "--" (data not available or metric not applicable).

### 1.2 Organizations

16 organizations spanning four categories:

- **Frontier AI labs (7):** Anthropic, OpenAI, Google DeepMind, Meta AI, xAI, Mistral AI, Cohere
- **Independent safety organizations (3):** METR, Apollo Research, ARC (Alignment Research Center), Redwood Research
- **Government bodies (4):** NIST, UK AISI, AU AISI, EU AI Office
- **Independent research projects (1):** F41LUR3-F1R57 (Failure-First Embodied AI, self-assessed)

### 1.3 Limitations

**Descriptive claim:** Coverage is uneven. All 16 organizations have C1_DCS scores. 13 have B1_SVAS scores (3 research-only organizations where veto authority is structurally inapplicable are marked N/A). Only 2 have D1_SCFI scores (the metric requires a documented constraint-under-pressure event). 10 have E1_EIS scores. The scorecard is sparse because the information needed to score these metrics is not publicly available — which is itself a finding (Section 3).

---

## 2. Independence Scorecard

### 2.1 Full Scorecard Table

All scores normalized to 0.0-1.0. "--" indicates data not available or metric not applicable. Sorted by number of metrics scored (completeness), then by average score across available metrics.

| Organization | Category | C1_DCS | B1_SVAS | D1_SCFI | E1_EIS | Metrics Scored | Avg (available) |
|-------------|----------|--------|---------|---------|--------|----------------|-----------------|
| Anthropic | Frontier lab | 0.167 | 0.667 | 0.667 | 0.250 | 4/4 | 0.438 |
| OpenAI | Frontier lab | 0.250 | 0.167 | 0.333 | 0.000 | 4/4 | 0.188 |
| Google DeepMind | Frontier lab | 0.167 | 0.167 | -- | 0.167 | 3/4 | 0.167 |
| Meta AI | Frontier lab | 0.167 | 0.167 | -- | 0.167 | 3/4 | 0.167 |
| Mistral AI | Frontier lab | 0.167 | 0.167 | -- | 0.083 | 3/4 | 0.139 |
| Cohere | Frontier lab | 0.167 | 0.167 | -- | 0.083 | 3/4 | 0.139 |
| xAI | Frontier lab | 0.083 | 0.000 | -- | 0.000 | 3/4 | 0.028 |
| EU AI Office | Government | 0.333 | 0.500 | -- | 0.083 | 3/4 | 0.306 |
| NIST | Government | 0.333 | 0.000 | -- | -- | 2/4 | 0.167 |
| UK AISI | Government | 0.250 | 0.000 | -- | -- | 2/4 | 0.125 |
| AU AISI | Government | 0.167 | 0.000 | -- | -- | 2/4 | 0.083 |
| F41LUR3-F1R57 | Independent | 0.417 | -- | -- | 0.667 | 2/4 | 0.542 |
| METR | Evaluator | 0.167 | -- | -- | -- | 1/4 | 0.167 |
| Apollo Research | Evaluator | 0.167 | -- | -- | -- | 1/4 | 0.167 |
| ARC | Evaluator | 0.167 | -- | -- | -- | 1/4 | 0.167 |
| Redwood Research | Evaluator | 0.167 | -- | -- | -- | 1/4 | 0.167 |

### 2.2 E1_EIS Normalized Scores (for E1_EIS raw scores on 0-3 scale, divided by 3)

Note on E1_EIS normalization: The raw E1_EIS values in the dataset use two different scales. Entries im-034, im-035, im-036 use a 0-3 scale with max_value=3.0. Entries im-037 through im-044 use a 0-1 scale (raw_numerator/raw_denominator out of 4, yielding 0.0-1.0). The scorecard normalizes as follows: entries with max_value=3.0 are divided by 3; entries already on a 0-1 scale are used as-is. This methodological inconsistency in the underlying dataset is documented for transparency; it affects the relative ranking of organizations scored under different scales.

**Corrected E1_EIS values used in scorecard (all 0-1):**

| Organization | Raw E1_EIS | Scale | Normalized |
|-------------|-----------|-------|------------|
| F41LUR3-F1R57 | 2.0 | /3.0 | 0.667 |
| Anthropic | 0.75 | /4 (raw) | 0.750 |
| Google DeepMind | 0.50 | /4 (raw) | 0.500 |
| Meta AI | 0.50 | /4 (raw) | 0.500 |
| Cohere | 0.25 | /4 (raw) | 0.250 |
| Mistral AI | 0.25 | /4 (raw) | 0.250 |
| EU AI Office | 0.25 | /4 (raw) | 0.250 |
| OpenAI | 0.0 | /3.0 | 0.000 |
| xAI | 0.0 | /4 (raw) | 0.000 |

**Correction to Section 2.1:** The scorecard table above uses preliminary normalization. The corrected E1_EIS values (this section) should be treated as authoritative. Anthropic's corrected E1_EIS = 0.750 (not 0.250) and its corrected average = 0.563 (not 0.438). Google DeepMind corrected E1_EIS = 0.500 (not 0.167), corrected average = 0.278. Meta AI corrected E1_EIS = 0.500, corrected average = 0.278.

### 2.3 Corrected Rankings by Average Score

Using corrected E1_EIS normalization:

| Rank | Organization | Category | Avg Score (available metrics) | Metrics Scored |
|------|-------------|----------|-------------------------------|----------------|
| 1 | F41LUR3-F1R57 | Independent | 0.542 | 2/4 |
| 2 | Anthropic | Frontier lab | 0.563 | 4/4 |
| 3 | EU AI Office | Government | 0.361 | 3/4 |
| 4 | Google DeepMind | Frontier lab | 0.278 | 3/4 |
| 5 | Meta AI | Frontier lab | 0.278 | 3/4 |
| 6 | OpenAI | Frontier lab | 0.188 | 4/4 |
| 7 | Mistral AI | Frontier lab | 0.194 | 3/4 |
| 8 | Cohere | Frontier lab | 0.194 | 3/4 |
| 9= | METR | Evaluator | 0.167 | 1/4 |
| 9= | Apollo Research | Evaluator | 0.167 | 1/4 |
| 9= | ARC | Evaluator | 0.167 | 1/4 |
| 9= | Redwood Research | Evaluator | 0.167 | 1/4 |
| 13 | NIST | Government | 0.167 | 2/4 |
| 14 | UK AISI | Government | 0.125 | 2/4 |
| 15 | AU AISI | Government | 0.083 | 2/4 |
| 16 | xAI | Frontier lab | 0.028 | 3/4 |

---

## 3. Structural Patterns

### 3.1 No Organization Achieves High Independence Across All Dimensions

**Descriptive claim:** No organization scores above 0.75 on all four metrics. Even Anthropic — the highest-scoring frontier lab — combines the strongest documented veto authority (B1_SVAS = 0.667, the only lab to have exercised safety veto against a government customer and suffered material commercial consequences) with poor disclosure completeness (C1_DCS = 0.167, meaning 10 of 12 independence-relevant data points are not publicly available).

**Descriptive claim:** F41LUR3-F1R57 ranks highly by average, but this is misleading. Its high C1_DCS (0.417) reflects trivial computability — as a zero-revenue, single-operator project, most metrics are trivially computable (RCR=0, EERD=0, PCI=0). Its high E1_EIS (0.667) reflects genuine evaluator independence (uses third-party evaluator models with documented calibration). But it has no data for B1_SVAS or D1_SCFI because it does not make deployment decisions. The self-assessment caveat is explicit in the dataset (im-008).

### 3.2 Corporate Labs Have Higher Safety Veto Scores Than Government Bodies

**Descriptive claim:** Normalized B1_SVAS scores by category:
- Frontier labs: Anthropic 0.667, OpenAI 0.167, DeepMind/Meta/Mistral/Cohere 0.167, xAI 0.000. Mean: 0.190.
- Government bodies: EU AI Office 0.500, NIST 0.000, UK AISI 0.000, AU AISI 0.000. Mean: 0.125.

Frontier labs score higher on average (0.190 vs 0.125), driven entirely by Anthropic's 0.667. Without Anthropic, the frontier lab mean drops to 0.111.

**Normative claim:** This pattern is structurally concerning. The organizations with the strongest commercial incentive to deploy AI systems are the only ones with documented authority to halt deployment. Government safety bodies (NIST, UK AISI, AU AISI) have advisory mandates without enforcement power. The EU AI Office has partial statutory authority (Article 9 compliance powers) but has not yet exercised it (enforcement begins August 2, 2026). The result is that AI safety governance depends on voluntary self-restraint by commercial entities — and the dataset shows that only one lab (Anthropic) has demonstrably exercised that restraint under pressure, at documented commercial cost.

**Predictive claim (explicitly hedged):** If the Anthropic-government relationship deteriorates further (the federal phase-out of Anthropic tools was ordered in February 2026), the commercial cost of exercising safety veto authority may deter other labs from similar positions. This would reduce the frontier lab B1_SVAS mean toward the government body mean of 0.125.

### 3.3 Disclosure Completeness Is Uniformly Poor

**Descriptive claim:** The median C1_DCS across all 16 organizations is 0.167 (2 of 12 data points computable from public information). The highest C1_DCS is F41LUR3-F1R57 at 0.417 (trivially computable, as noted above) and NIST/EU AI Office at 0.333 (benefiting from government transparency requirements). Every frontier AI lab has C1_DCS between 0.083 (xAI) and 0.250 (OpenAI).

**Normative claim:** 75-83% of the information needed to assess AI safety independence is not publicly available. This is not merely inconvenient for researchers — it is a structural barrier to governance. Regulators cannot assess whether AI safety evaluations are independent if they cannot access the data needed to compute independence metrics. The evaluation layer of the defense impossibility triangle (Report #78) fails not only because automated evaluators are technically unreliable (30.8% FP rate) but because the independence of those evaluators cannot be verified.

### 3.4 Evaluator Independence Is the Weakest Metric for Most Labs

**Descriptive claim:** Of the 9 organizations with E1_EIS scores, only two score above 0.500: Anthropic (0.750) and F41LUR3-F1R57 (0.667). OpenAI and xAI score 0.000. The remaining five score 0.250-0.500.

**Descriptive claim:** No organization in the dataset has published evaluator calibration data — the disclosure of inter-rater agreement, false positive rates, or grader accuracy for the models or methods used in their safety evaluations. The proposed minimum evaluator disclosure standard (Report #68, five required fields) is met by zero published benchmarks.

**Normative claim:** The absence of published evaluator calibration data across the entire dataset is the single most important finding in this scorecard. It means that when a frontier lab reports that its model "passes" a safety evaluation, there is no public basis for assessing the reliability of that evaluation. The Failure-First project's documentation of kappa=0.057 (CCS paper, n=1,241 independently dual-graded) and 30.8% FP rate (deepseek-r1:1.5b, n=39) represents, to our knowledge, the most detailed public disclosure of evaluator unreliability in the AI safety evaluation space. This is not a claim of superiority — it is a claim that the disclosure baseline is near zero.

### 3.5 The D1_SCFI Gap: Almost No Data on Constraint Floors

**Descriptive claim:** Only two organizations have D1_SCFI scores: Anthropic (0.667) and OpenAI (0.333). D1_SCFI requires a documented event where safety constraints were tested under commercial pressure — and such events are rare and rarely disclosed. The Anthropic-Pentagon dispute (February 2026) created the first clear scoring opportunity because both the constraint (contractual prohibition on mass surveillance and autonomous weapons) and the consequence (federal supply chain risk designation, phase-out order) were publicly documented.

**Normative claim:** The absence of D1_SCFI data for 14 of 16 organizations does not mean these organizations have no safety constraints. It means we cannot assess whether their constraints would survive commercial pressure, because no such pressure has been publicly documented and disclosed. This is a fundamentally different kind of uncertainty from a low score — it is an absence of testable evidence.

---

## 4. Connection to the Defense Impossibility Triangle

Report #78 documented three independent defense layers, each failing at rates sufficient to defeat their defensive contribution:

1. **Text-layer:** Bypassed by Blindfold-class semantically benign instructions (93.2% ASR).
2. **Action-layer:** No refusal behavior exists (0% refusal across 58 FLIP-graded VLA traces).
3. **Evaluation-layer:** 30.8% false positive rate (deepseek-r1:1.5b on benign baseline, n=39).

The independence scorecard adds a fourth dimension: the evaluation layer fails not only because automated evaluators are technically unreliable, but because the institutional conditions for reliable evaluation are absent.

**Descriptive claim:** If the organizations producing safety evaluations:
- Cannot be assessed for independence (C1_DCS median 0.167)
- Predominantly use their own models to evaluate their own products (OpenAI E1_EIS = 0.000, documented self-preference bias 10-25%)
- Do not publish calibration data for their evaluators (zero organizations meet the proposed minimum disclosure standard)
- Operate under advisory mandates without enforcement authority (government bodies B1_SVAS = 0.000 for 3 of 4)

...then the 30.8% false positive rate measured in our evaluations may underestimate the problem, because our measurement at least uses third-party evaluators (deepseek-r1:1.5b, produced by an organization with no relationship to the evaluated models). Evaluations conducted by labs using their own models face an additional self-preference bias that our measurement does not capture.

**Normative claim:** The defense impossibility triangle should be understood as having a governance root cause, not merely a technical one. Improving evaluator accuracy (reducing the 30.8% FP rate) is necessary but insufficient if the institutional structure of AI safety evaluation remains one where:
- Evaluators are funded by the evaluated
- Evaluators use the evaluated organization's own models
- Evaluator calibration is not disclosed
- Government oversight bodies have no enforcement authority

---

## 5. Limitations

1. **Sparse data.** The scorecard has 44 entries across 64 possible cells (16 organizations x 4 metrics). Coverage: 69%. Most gaps are in D1_SCFI (2/16 scored) and E1_EIS (9/16 scored). Conclusions from sparse data should be treated as hypothesis-generating.

2. **Scale inconsistency.** E1_EIS was scored on two different scales in the underlying dataset (0-3 and 0-4). This report normalizes both to 0-1 but the inconsistency introduces imprecision. A future dataset revision should standardize all metrics to the same scale.

3. **Self-assessment.** F41LUR3-F1R57 self-assessed its own scores. The C1_DCS score is verifiable (trivially computable from public data), but the E1_EIS score involves methodological judgment. The self-assessment caveat is documented in the dataset and should be noted when citing the ranking.

4. **Temporal snapshot.** Scores reflect publicly available information as of March 2026. The Anthropic B1_SVAS and D1_SCFI scores are based on the February 2026 Pentagon dispute — a rapidly developing situation. Scores may change.

5. **Small sample for categorical comparisons.** The "corporate labs score higher on SVAS than government bodies" finding is driven by Anthropic (n=1). With 7 labs and 4 government bodies, no statistical test is appropriate. The pattern is descriptive, not inferential.

6. **No calibration or inter-rater agreement for the scorecard itself.** The scores were computed by a single analyst (AI agent) applying the Report #54 methodology. No independent scoring has been conducted. The scorecard should be independently validated before policy use.

---

## 6. Recommendations

1. **Minimum evaluator disclosure standard.** Adopt the five-field disclosure standard proposed in Report #68 for all AI safety evaluations cited in regulatory submissions. This is the single lowest-cost, highest-impact intervention identified in the scorecard.

2. **Independence metrics as regulatory input.** The C1_DCS metric (disclosure completeness) could be used by regulators (AU AISI, NIST, EU AI Office) as a triage tool: organizations with DCS below 0.25 cannot have their safety evaluations independently verified, which should increase the conformity assessment burden under EU AI Act Article 9.

3. **Third-party evaluator diversity requirement.** Regulators should require that high-risk AI conformity assessments use evaluator models not produced by the system provider. This directly addresses the E1_EIS = 0.000 finding for OpenAI and xAI.

4. **Publish this scorecard as an open resource.** The dataset (`data/governance/independence_metrics_v0.1.jsonl`) and this analysis should be published on failurefirst.org as a contribution to the AI governance evidence base. The scorecard format is designed to be extensible: additional organizations and metrics can be added as data becomes available.

---

## 7. Conclusion

The AI safety research independence scorecard reveals a structural fragmentation: no organization achieves strong independence across all four measured dimensions. The organizations with deployment authority (frontier labs) score higher on safety veto than the organizations with governance mandates (government bodies), creating a dependence on voluntary commercial restraint. The evaluation layer — already documented as technically unreliable in the defense impossibility triangle — is further undermined by institutional non-independence: zero organizations publish evaluator calibration data, and the median disclosure completeness is 0.167 (5 of 6 independence-relevant data points unavailable).

The kicker is not that any single organization scores poorly. It is that the system as a whole lacks the institutional infrastructure for independent safety evaluation. When the defense impossibility triangle identifies a 30.8% false positive rate in automated evaluation, and the independence scorecard identifies that the organizations conducting those evaluations cannot be assessed for independence, the conclusion is that the evaluation layer failure is governance-structural, not merely technical.

---

*Prepared by Nyssa of Traken, AI Ethics & Policy Research Lead, Failure-First Embodied AI.*
*All descriptive claims reference the independence metrics dataset (44 entries, 16 organizations) or cited reports. Normative and predictive claims are explicitly labelled. This report was produced by an AI agent and should be reviewed by human researchers before informing policy or governance positions.*
