---
title: "The Epistemic Crisis: Can We Trust AI Safety Benchmarks?"
description: "We tested 7 LLM graders on unambiguous safety cases. Six passed. One hallucinated evidence for its verdict. But the real problem is worse: on the ambiguous cases that actually determine published ASR numbers, inter-grader agreement drops to kappa=0.320."
date: 2026-03-25
tags: [research, evaluation, benchmarks, graders, epistemic-crisis, eu-ai-act]
---

## The Benchmark You Cited Might Be Wrong

Every published AI safety benchmark relies on a grading step. Someone -- or something -- looks at a model's response to a harmful prompt and decides: did the model comply, or did it refuse?

If the grader gets it wrong, the benchmark number is wrong. And if you are making deployment decisions, regulatory filings, or safety claims based on that number, your decisions rest on foundations you have not verified.

We tested the foundations. The results are not reassuring.

## The Experiment

We created a calibration dataset of 20 traces with unambiguous ground truth: 10 clear refusals (explicit language like "I cannot and will not help") and 10 clear compliances (detailed harmful content including exploit code and step-by-step instructions). No borderline cases. No ambiguity. If a grader cannot get these right, it cannot be trusted with anything harder.

We ran 7 LLM grader models through our FLIP backward-inference methodology on this dataset:

| Model | Parameters | Accuracy |
|-------|-----------|----------|
| gemma3:4b | 4B | 100% |
| gemma3:12b | 12B | 100% |
| gemma3:27b | 27B | 100% |
| ministral-3:8b | 8B | 100% |
| ministral-3:14b | 14B | 100% |
| devstral-small-2:24b | 24B | 100% |
| **nemotron-3-nano:30b** | **30B** | **80%** |

Six out of seven graders scored perfectly on the obvious cases. That sounds encouraging until you look at the seventh.

## The Hallucinating Grader

Nemotron-3-nano (30B parameters, NVIDIA) misclassified 4 out of 20 unambiguous cases. The most concerning error was not a simple mistake -- it was a fabrication.

Presented with a Python script that automates threatening messages -- pure harmful compliance, zero disclaimers, zero safety language -- Nemotron-3-nano reported:

> "Extensive caveats and warnings indicate only partial compliance rather than full support."

No such caveats exist in the response. The grader invented safety-relevant properties that were not present, then used its own hallucination as evidence for a less severe classification.

This is not a grader being conservative. This is a grader confabulating evidence to support a verdict. If this model is used in production grading, it will systematically undercount compliance by hallucinating safety features into harmful responses.

## The Real Problem Is Worse

Here is the finding that should concern everyone who publishes or relies on safety benchmarks: the obvious cases are the easy part.

Our production data -- thousands of graded traces across the F41LUR3-F1R57 corpus -- shows that inter-grader agreement on ambiguous cases drops to Cohen's kappa = 0.320. For context, kappa below 0.40 is conventionally considered "fair" agreement -- one step above chance.

This creates a two-regime problem:

**Obvious regime.** Model clearly refuses or clearly complies. Most graders (6/7) handle this perfectly. Calibration checks pass. Confidence is high.

**Ambiguous regime.** Model hedges, adds disclaimers, partially complies, or generates content that requires judgment to classify. Inter-grader agreement collapses. And this is precisely where the boundary between "safe" and "unsafe" is drawn in published benchmarks.

The attack success rate (ASR) that appears in a benchmark paper is determined almost entirely by how the grader handles ambiguous cases. Two different graders, applied to the same set of model responses, will produce meaningfully different ASR numbers. The published number carries an unknown grader-bias error bar that is never reported.

## What This Means for EU AI Act Compliance

The EU AI Act requires providers of high-risk AI systems to demonstrate adequate safety evaluation. If your compliance evidence rests on benchmark results -- and those benchmarks use automated grading -- the epistemic chain has a weak link.

Consider the scenario: a model provider uses an LLM-graded benchmark to demonstrate that their system's attack success rate is below a threshold. They file this as part of their conformity assessment. But the grader they used has a systematic bias toward underreporting compliance (as we observed with Nemotron-3-nano). The true ASR is higher than reported. The filing is technically honest -- they reported what their grader found -- but the number does not reflect reality.

We are not aware of any current AI safety benchmark that reports grader reliability statistics alongside ASR numbers. No benchmark paper we have reviewed publishes inter-grader agreement, calibration curves, or hallucination rates for the grading model.

This is the epistemic crisis: the community has invested heavily in which models to test and which prompts to use, while largely ignoring whether the measurement instrument itself is reliable.

## Recommendations

**For benchmark publishers.** Report your grader's calibration data. Publish inter-grader agreement on a held-out set. If you use automated grading, treat the grader model as part of your methodology and evaluate it with the same rigour you apply to the models you are testing.

**For model deployers.** Do not treat a single benchmark ASR as ground truth. If your safety case depends on a specific number, verify that the grading methodology produces consistent results across different grader models.

**For regulators.** Evaluation standards should require disclosure of grading methodology and reliability metrics. An ASR number without grader calibration data is not a safety measurement -- it is an unverified claim.

**For the research community.** We need standard calibration datasets for safety graders, the same way NLP has standard test sets for models. We are releasing our 20-trace calibration set and the evaluation methodology to support this.

---

*This finding is part of the F41LUR3-F1R57 adversarial evaluation programme. The grader evaluation is documented in internal Report #244. Our keyword-based classifier achieved Cohen's kappa = 0.126 against LLM grading (n=1,989), confirming that automated heuristic approaches are not a reliable alternative.*
