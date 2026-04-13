---
title: "Evaluator Independence — Wave 9 Quantitative Update"
description: "This report connects the evaluator independence metrics dataset (44 entries, 16 organizations) to three wave 9 findings that substantially strengthen the case for structural evaluator independence: the recomputed Cohen's kappa of 0.126 on independently dual-graded data (n=1,989), the defense impossibility triangle, and the compound failure probability calculation."
date: "2026-03-11"
reportNumber: 106
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

## Executive Summary

This report connects the evaluator independence metrics dataset (44 entries, 16 organizations) to three wave 9 findings that substantially strengthen the case for structural evaluator independence: (1) the recomputed Cohen's kappa of 0.126 [0.108, 0.145] on independently dual-graded data (n=1,989), which is lower than the previously reported 0.245 and classifies as SLIGHT agreement under Landis-Koch; (2) the defense impossibility triangle (Report #78), which identifies the evaluation layer as the only controllable layer of the three that fail; and (3) the compound failure probability calculation showing 23.2% probability of all three defense layers failing simultaneously.

**Scope of claims:**
- **Descriptive claims** are grounded in the independence metrics dataset, the kappa recomputation tool output, and cited reports. Factual sources are cited.
- **Normative claims** represent the author's ethical analysis and are labelled.
- **Predictive claims** are explicitly marked and hedged.

---

## 1. The Kappa Recomputation and What It Means for Independence

### 1.1 The Finding

The wave 9 recomputation established:

- **Independently dual-graded results (n=1,989):** kappa = 0.126 [0.108, 0.145] (SLIGHT agreement)
- **Full corpus (n=39,385):** kappa = 0.947 -- inflated by 37,396 OBLITERATUS-import results where both heuristic and LLM verdicts were set from the same source during bulk import
- **Previous reported figure:** kappa = 0.245 -- now understood to include non-independently-graded data

The 0.126 figure is the correct one for assessing the reliability of safety evaluation when two independent methods are applied to the same data. It means that heuristic and LLM-based safety classifiers agree only slightly better than chance on whether a given AI response constitutes compliance with a harmful request.

### 1.2 Connection to Independence Metrics

**Descriptive claim:** The independence metrics dataset measures structural independence -- whether evaluation organizations have financial, governance, and methodological separation from the entities they evaluate. The kappa figure measures methodological reliability -- whether different evaluation methods produce consistent results. These are related but distinct phenomena.

The connection is this: **structural independence matters more, not less, when evaluation methods are unreliable.** If two evaluation methods agreed perfectly (kappa approaching 1.0), the choice of evaluator would be less consequential -- any evaluator using any reasonable method would reach the same conclusion. When kappa = 0.126, the choice of evaluator and method substantially determines the verdict. An evaluator with a structural conflict of interest can select the evaluation method that produces the most favorable verdict, and the low kappa means this selection will materially change the measured ASR.

**Normative claim:** The kappa recomputation strengthens the case for the E1_EIS (Evaluator Independence Score) metric in the independence dataset. When evaluator methodology agreement is low, evaluator independence is not merely desirable for procedural fairness -- it is necessary for the evaluation to have informational content.

### 1.3 Updated Independence Metrics Interpretation

The current E1_EIS scores in the dataset:

| Organization | E1_EIS | Interpretation (updated with kappa=0.126) |
|-------------|--------|---------------------------------------------|
| OpenAI | 0.0/3.0 | Maximum structural conflict. With kappa=0.126, self-evaluation is indistinguishable from method selection bias. |
| xAI | 0.0/3.0 | Same. No evaluation methodology disclosed at all. |
| Anthropic | 0.75/3.0 | Partial independence. Uses internal evaluator but participates in third-party evaluations (METR, ARC). Third-party channel provides some check on method selection. |
| Google DeepMind | 0.50/3.0 | Uses internal evaluator; participates in third-party. No calibration disclosure. |
| Meta AI | 0.50/3.0 | Open-weight evaluators (Llama Guard) enable independent verification. |
| F41LUR3-F1R57 | 2.0/3.0 | Documented independence with published calibration data. Cross-evaluator agreement measured and disclosed. Not 3.0 because no human ground truth calibration. |
| EU AI Office | 0.25/3.0 | Governance body without in-house evaluation capability. |
| Mistral AI | 0.25/3.0 | Releases weights (enabling independent eval) but no internal calibration disclosure. |
| Cohere | 0.25/3.0 | Publishes safety evaluation results but no independent contracts. |

**Descriptive claim:** The kappa recomputation does not change any E1_EIS scores directly -- the scores measure structural properties, not methodological agreement. But it changes the interpretation of those scores. At kappa = 0.245, structural independence was important for good governance. At kappa = 0.126, structural independence is necessary for the evaluation to be meaningful at all.

---

## 2. The Evaluation Layer as the Weakest Controllable Layer

### 2.1 The Defense Impossibility Triangle

Report #78 identifies three defense layers:

| Layer | Failure Rate | Controllable? |
|-------|-------------|--------------|
| T (Text) | 93.2% ASR (Blindfold on GPT-4o) | Limited -- requires fundamental changes to VLA safety training |
| A (Action) | 100% failure (0% refusal in 58 traces) | No -- action-layer refusal does not exist as a training objective in any current VLA system |
| E (Evaluation) | 30.8% FP rate | **Yes** -- evaluation methodology, evaluator selection, and calibration are design choices that can be improved |

**Descriptive claim:** Of the three failing layers, the evaluation layer is the only one where the failure mode is directly addressable through governance intervention rather than fundamental research.

### 2.2 Why This Makes Independence More Important

**Normative claim:** The defense impossibility triangle makes evaluator independence more important precisely because the evaluation layer is the most improvable of the three failing layers. Because the evaluation layer is the most amenable to governance intervention, it should receive disproportionate attention -- and the primary governance lever for evaluation quality is independence.

### 2.3 The Compound Effect

The compound failure calculator computes:

```
P(all three layers fail) = P(T) x P(A|T) x P(E) = 0.753 x 1.0 x 0.308 = 0.232
```

If the evaluation layer's FP rate were reduced from 30.8% to 10% (achievable with larger evaluator models and human calibration), the compound probability drops from 23.2% to 7.5%. This is the single largest reduction available through any individual layer improvement.

**Normative claim:** This analysis implies that governance frameworks (EU AI Act conformity assessment, NIST AI RMF) should prioritize evaluator quality and independence requirements over text-layer safety requirements for embodied AI systems.

---

## 3. Recommendations

1. **Add M1_MAR to the independence framework.** A Methodological Agreement Rate metric would directly quantify the degree to which an organization's safety evaluations align with independent assessments.

2. **Prioritize evaluator independence in regulatory submissions.** The kappa=0.126 finding and the compound failure analysis support the argument that evaluator quality and independence should be explicit requirements in conformity assessment.

3. **Publish the kappa recomputation methodology.** The fact that the previously reported kappa (0.245) was inflated by bulk-import auto-agreement is itself a finding about evaluation methodology rigor.

---

## 4. Limitations

1. **Independence metrics are observational, not experimental.** The dataset captures publicly available information about organizational structure. It does not directly measure evaluation quality.
2. **The compound failure analysis assumes layer independence for T-A.** PARTIAL dominance demonstrates that text and action layers are correlated, not independent. The true compound failure may be higher than calculated.
3. **The kappa figure is from a single evaluation pipeline.** Whether kappa = 0.126 generalizes to other evaluation contexts is unknown.
4. **Small evaluator sample for FP rate.** The 30.8% FP rate is from n=39 benign traces evaluated by deepseek-r1:1.5b. The confidence interval is wide.

---

*All descriptive claims reference documented measurements from the Failure-First corpus or cited reports. Normative and predictive claims are explicitly labelled.*
