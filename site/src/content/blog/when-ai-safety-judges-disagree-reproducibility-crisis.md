---
title: "When AI Safety Judges Disagree: The Reproducibility Crisis in Adversarial Evaluation"
description: "Two AI models produce identical attack success rates but disagree on which attacks actually worked. What this means for safety benchmarks, red teams, and anyone certifying AI systems as safe."
date: 2026-03-11
tags: [evaluation, safety, reproducibility, methodology, benchmarks, embodied-ai]
---

When two AI models score 72% on the same adversarial safety benchmark, the natural assumption is that they are vulnerable to the same attacks. Our data shows this assumption is wrong.

---

## The Number Looks Right. The Details Do Not.

We ran identical adversarial scenarios against two small language models (deepseek-r1:1.5b and qwen3:1.7b) across VLA attack families and format-lock experiments. Both models produced aggregate attack success rates within a few percentage points of each other. The aggregate signal was stable, reproducible, and reassuring.

Then we looked at scenario-level agreement.

Cohen's kappa -- the standard measure of inter-rater agreement beyond chance -- came back at -0.007 for VLA scenarios and -0.089 for format-lock experiments. These numbers mean the two models agree on which specific scenarios succeed at a rate indistinguishable from chance. In format-lock, the negative kappa indicates they are anti-correlated: what triggers compliance in one model tends to produce a safe response in the other.

Exact verdict agreement was 43.8% for VLA and 18.8% for format-lock. For context, two random classifiers with the same marginal distributions would produce similar agreement rates. The models are not agreeing on which scenarios are dangerous. They are producing similar aggregate rates through different scenario-level patterns.

---

## Why This Matters for Safety Benchmarks

A fixed benchmark set -- the kind that organizations use to certify AI systems as "safe" -- produces aggregate numbers that look stable across models. But the aggregate stability masks complete scenario-level disagreement. Two models that "pass" at the same rate are passing on different questions.

This has three immediate implications.

**Benchmark gaming is structurally invisible.** If a model's vulnerability profile is model-specific rather than scenario-specific, then optimizing against a fixed benchmark improves the number without necessarily improving safety. The model learns to handle the benchmark scenarios while remaining vulnerable to structurally identical scenarios with different surface features.

**Red-team findings do not transfer.** A red team that identifies successful attack scenarios against Model A cannot assume those same scenarios will succeed against Model B, even if Model B has the same aggregate vulnerability rate. Red-team coverage must be model-specific, which dramatically increases the cost of adversarial evaluation.

**Aggregate ASR is necessary but not sufficient.** The aggregate attack success rate tells you how vulnerable a model is. It does not tell you *what* it is vulnerable to. Safety certification that relies solely on aggregate metrics is certifying a statistical property, not a behavioral one.

---

## The Grading Quality Problem Underneath

This reproducibility finding sits on top of a separate discovery: one of our automated safety judges (qwen3:1.7b used as a FLIP classifier) has 15% accuracy against human-audited verdicts. It defaults to "PARTIAL" -- the ambiguous middle category -- 58% of the time. We caught it because we audited. Many evaluation pipelines do not.

The broader AI safety evaluation ecosystem faces the same structural problem. GPT-4 is the dominant automated judge in published safety benchmarks. If GPT-4-as-judge has systematic biases -- and published research suggests it does, including preference for verbose responses and self-favouring in model comparisons -- then the entire evaluation infrastructure shares a single point of failure.

A monoculture in safety evaluation is itself a safety risk.

---

## What We Recommend

Based on our governance lag index (77 events tracked), 18,000+ adversarial evaluation results across 144 models, and the inter-model agreement analysis described above, we propose three principles for adversarial safety evaluation:

**Multi-judge evaluation.** No single automated judge should determine safety verdicts. Cross-model agreement (or disagreement) is itself a signal. When judges disagree, that disagreement should be surfaced, not averaged away.

**Scenario-level reporting.** Aggregate ASR must be supplemented with scenario-level vulnerability profiles. Two models with 72% ASR that fail on completely different scenarios represent fundamentally different risk profiles for deployers.

**Judge calibration disclosure.** Any organization publishing safety benchmark results should disclose the accuracy and systematic biases of their automated judge. An uncalibrated judge produces uncalibrated results. This is measurement science 101, but the AI safety field has not yet adopted it.

---

## The Governance Gap

The governance gap for evaluation methodology remains wide open. No framework, standard, or regulation currently requires any of these practices. The International AI Safety Report 2026 (published February 3) recommends "multi-layered testing" but does not specify what that means for automated safety judges.

The EU AI Act high-risk requirements (applicable August 2, 2026) mandate "testing, validation, and verification procedures" but do not define evaluation methodology for adversarial robustness. NIST AI RMF 1.0 identifies evaluation as a core function but provides no guidance on evaluator reliability.

Until the governance frameworks catch up, the reproducibility crisis in adversarial evaluation will continue to produce numbers that look precise and mean less than they appear to.

---

*Based on Failure-First Reports #62 (Inter-Model Verdict Agreement) and #65 (Evaluation Monoculture Risk Analysis). Pattern-level findings only. Full methodology: [failurefirst.org/research](/research/).*
