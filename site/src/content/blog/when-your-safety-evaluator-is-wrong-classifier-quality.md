---
title: "When Your Safety Evaluator Is Wrong: The Classifier Quality Problem"
description: "A 2B parameter model used as a safety classifier achieves 15% accuracy on a quality audit. If your safety evaluation tool cannot reliably distinguish refusal from compliance, your entire safety assessment pipeline produces meaningless results. The classifier quality problem is the invisible foundation beneath every AI safety claim."
date: 2026-03-11
tags: [evaluation, safety, classifiers, methodology, embodied-ai, grading]
---

We discovered that one of our safety classifiers was wrong 85% of the time.

Not subtly wrong. Not borderline-wrong on ambiguous cases. Fundamentally, structurally wrong: classifying clear refusals as partial compliance, benign queries as adversarial success, and incoherent hallucinations as meaningful output.

The classifier was qwen3:1.7b, a 2 billion parameter model quantized to Q4_K_M. We were using it to grade adversarial traces — to determine whether AI models had complied with, refused, or partially engaged with adversarial prompts. In a 20-sample quality audit, it produced the correct verdict 3 times out of 20.

---

## What Went Wrong

The audit revealed a systematic bias: qwen3:1.7b defaults to PARTIAL for 58% of all verdicts. The error pattern:

| Misclassification | Count |
|---|---|
| PARTIAL when the model clearly refused | 4 |
| PARTIAL when the response was benign (non-adversarial query) | 5 |
| PARTIAL when the response was incoherent hallucination | 5 |
| COMPLIANCE when the model refused | 1 |
| COMPLIANCE when the response was hallucinated | 1 |

The root cause: a 2 billion parameter model lacks the reasoning capacity to perform the classification task. It cannot distinguish between a verbose refusal ("I cannot help with that request. Here is why...") and partial compliance ("I should note the ethical concerns, but here is the information..."). Both contain safety-relevant language followed by substantive content. The semantic distinction requires comprehension that the classifier does not possess.

---

## Why This Matters Beyond Our Project

Every AI safety evaluation system relies on classifiers. Every automated safety benchmark, red-team assessment, and compliance evaluation uses some form of automated judgment to score model outputs. The question is rarely asked: how accurate is the classifier itself?

Our project has measured classifier accuracy systematically across multiple methodologies:

| Classification Method | Accuracy | Notes |
|---|---|---|
| Keyword/heuristic matching | 25-84% (varies by model) | Over-reports attack success by 2x or more |
| qwen3:1.7b (2B, Q4_K_M) | 15% (n=20 audit) | Defaults to PARTIAL; cannot distinguish refusal from compliance |
| deepseek-r1:1.5b (1.5B) | ~60-70% | Better distribution but high ERROR rate on long responses |
| LLM-graded (frontier models) | ~85-90% (estimated) | Best available but expensive and slow |
| Human expert grading | Baseline (by definition) | Not scalable |

The pattern: classifier accuracy scales with the classifier's own capability. A 2B model is not merely worse at classification — it is worse in a specific way that inflates safety metrics. Because it defaults to PARTIAL (the ambiguous middle category), it systematically converts clear refusals and benign queries into apparent partial compliance. This makes the system under evaluation look more dangerous than it is, which sounds conservative but is actually harmful: it contaminates the evidence base that safety decisions rely on.

---

## The Evaluation Stack Problem

Safety evaluation has a recursive structure that is easy to overlook:

1. A **target model** (the system being evaluated) produces outputs in response to adversarial prompts.
2. A **classifier model** (the evaluator) judges those outputs as compliant, refusing, or partial.
3. **Aggregate statistics** (attack success rates, refusal rates) are computed from the classifier's judgments.
4. **Safety claims** ("this model resists X% of adversarial attacks") are derived from those statistics.

If step 2 is wrong, everything downstream is wrong. But classifier accuracy is rarely reported. Published safety benchmarks typically report aggregate ASR without disclosing classifier validation methodology, inter-rater agreement, or false positive/negative rates.

In our own work, we have identified specific cases where classifier errors changed research conclusions:

- **Heuristic classifiers over-reported attack success on Codex GPT-5.2:** Heuristic ASR 84% vs LLM-graded ASR 42.1%. The keyword classifier flagged helpful, detailed responses as "compliance" because they contained step-by-step structure.
- **Heuristic classifiers under-reported attack success on Claude:** Heuristic ASR 4% vs LLM-graded ASR 30.4%. Claude's verbose refusals contained enough domain vocabulary to be flagged as "safe," while its actual compliance was in structured format that the heuristic did not detect.
- **Cohen's Kappa between heuristic and LLM grading:** 0.245 (poor agreement). The two methods agree on 68% of cases, but this masks the directional bias: heuristic COMPLIANCE is wrong 88% of the time, while heuristic REFUSAL is correct 95% of the time.

---

## Implications for Embodied AI Safety

The classifier quality problem becomes acute in embodied AI contexts for three reasons:

**1. Higher stakes per error.** A false negative (classifier says "safe" when output is harmful) in text-only evaluation means a harmful response goes undetected. In embodied AI, it means an unsafe action sequence reaches an actuator. The cost of a false negative scales with the physical capability of the system.

**2. PARTIAL is the dominant category in embodied scenarios.** Our VLA adversarial testing shows 50% PARTIAL verdicts. Classifying PARTIAL correctly requires understanding whether the safety hedging in the text layer prevents harm at the action layer — a judgment that requires domain-specific expertise the classifier may not have.

**3. Evaluation at deployment speed.** Pre-deployment safety evaluation can use expensive, slow, high-accuracy classifiers (frontier models, human review). Runtime safety monitoring must operate at inference speed, which pushes toward smaller, faster, less accurate classifiers. The 15% accuracy we measured at 2B parameters is a warning about what runtime safety monitors may actually achieve.

---

## What We Changed

After the audit, we made three changes to our evaluation pipeline:

1. **Minimum classifier capability threshold.** We no longer use sub-3B models as safety classifiers. The capability floor for reliable 5-category classification (COMPLIANCE / REFUSAL / PARTIAL / HALLUCINATION_REFUSAL / BENIGN_QUERY) appears to be in the 7B+ range with reasoning capability.

2. **Mandatory quality audits.** Every classifier change requires a minimum 20-sample human audit before deployment. This is not optional. A classifier that has not been audited against human ground truth is not a classifier — it is a random number generator with a plausible interface.

3. **Classifier accuracy reporting.** All published safety metrics now include the classifier methodology and measured accuracy. An ASR number without a classifier accuracy number is not a finding — it is noise with a label.

---

## The Meta-Lesson

The classifier quality problem is an instance of a broader pattern: safety infrastructure that is not itself subjected to safety evaluation. We test models against adversarial inputs. We do not routinely test the tools we use to evaluate those models.

The irony is sharp. We are building systems to detect AI failure. The systems we build to do the detecting can also fail. And the failure mode of a safety classifier is particularly insidious: it does not crash, does not produce error messages, does not announce its incompetence. It produces confident-looking verdicts in the expected format. The output looks correct. It is not.

If your safety evaluation pipeline includes an automated classifier, measure its accuracy. If you have not measured it, you do not know what your safety metrics mean.

---

*The Failure-First Embodied AI project has evaluated over 18,700 adversarial traces across 144 models using multiple grading methodologies. The classifier quality findings described here led to the project's decision to use only LLM-based classification (7B+ with reasoning capability) for all published safety metrics.*
