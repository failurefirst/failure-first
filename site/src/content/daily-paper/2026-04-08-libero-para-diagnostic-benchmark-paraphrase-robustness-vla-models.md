---
title: "LIBERO-Para: A Diagnostic Benchmark and Metrics for Paraphrase Robustness in VLA Models"
description: "A controlled benchmark revealing that paraphrasing task instructions causes 22–52 percentage point performance drops in state-of-the-art VLA models, with most failures traced to object-level lexical sensitivity rather than execution errors."
date: 2026-04-08
arxiv: "2603.28301"
authors: "Chanyoung Kim, Minwoo Kim, Minseok Kang, Hyunwoo Kim, Dahuin Jung"
paperType: "empirical"
tags: [vla-robustness, paraphrase-attacks, robotic-manipulation, linguistic-generalization, embodied-ai, benchmark, failure-modes]
draft: false
---

When a robot receives the instruction "place the red mug next to the kettle," it succeeds. Change that to "put the crimson cup beside the kettle" — semantically identical, trivially understood by any human — and performance falls off a cliff. This fragility, documented systematically in LIBERO-Para, cuts to the heart of a critical gap in how we evaluate and deploy Vision-Language-Action (VLA) models: these systems can appear robust on standard benchmarks while remaining profoundly brittle to the kind of natural linguistic variation that real-world deployment inevitably brings.

### The Problem: Benchmark Overfitting in Instruction Following

VLA models achieve strong performance on robotic manipulation tasks by leveraging the rich representational capacity of pre-trained vision-language backbones. The standard evaluation protocol, however, tests these models on the same instruction phrasings used during fine-tuning. This creates a systematic blind spot: models may be learning to match specific surface forms rather than genuinely grounding task semantics in visual observations and action plans.

LIBERO-Para addresses this directly by constructing a controlled diagnostic benchmark built on top of the LIBERO manipulation task suite. The key design principle is independent variation: the benchmark separately perturbs *action expressions* (how the manipulation is described — "pick up" vs. "grasp" vs. "lift") and *object references* (how objects are named — "red mug" vs. "crimson cup" vs. "scarlet container"). This factorial structure enables fine-grained attribution of failures to specific sources of linguistic variation, rather than treating "paraphrase robustness" as a monolithic property.

### Findings: Magnitude, Source, and Nature of Failures

Testing seven VLA configurations spanning model scales from 0.6B to 7.5B parameters, the paper reports three headline findings:

**The performance gap is large.** Paraphrasing instructions causes a 22–52 percentage point drop in task success rate across all tested models. This magnitude is striking: it means that models achieving 70–80% success on standard benchmarks may drop to 20–50% when instructions are naturally rephrased — a failure mode entirely invisible to standard evaluation.

**Object-level lexical variation drives most failures.** The benchmark's factorial design reveals that changes to *how objects are named* — even simple synonym substitutions — cause larger performance drops than changes to action expressions. This is a surprising finding because object grounding is typically considered a strength of vision-language models, which should be able to leverage both visual and linguistic cues to identify objects. Instead, fine-tuning on limited downstream manipulation data appears to create strong surface-form biases: the model learns to associate specific word sequences with specific objects in specific contexts, rather than building genuinely compositional object representations.

**Failures are planning-level, not execution-level.** Analysis of failure modes shows that 80–96% of failures involve *trajectory divergence* at the planning stage — the model produces a qualitatively different action plan in response to the paraphrased instruction, rather than attempting the correct plan and failing during physical execution. This is an important distinction: it means the problem is not motor skill brittleness but semantic brittleness. The model's policy is sensitive to the linguistic surface form of its input in a way that bypasses its visual grounding capabilities.

### PRIDE: A New Robustness Metric

Beyond the benchmark, the paper introduces PRIDE (Paraphrase Robustness Index in Robotic Instructional DEviation), a metric that quantifies paraphrase difficulty using two factors: semantic similarity (keyword overlap, *S_K*) and syntactic similarity (structural similarity, *S_T*). PRIDE enables fine-grained analysis by characterizing not just whether a model fails on paraphrased instructions but *how much* paraphrase difficulty predicts failure — enabling more informative comparisons across models and more principled benchmark construction.

The metric reveals that current models' failures do not scale smoothly with paraphrase difficulty: even low-difficulty paraphrases (high semantic and syntactic similarity) cause large performance drops, suggesting the sensitivity operates at a level below natural language semantics.

### Implications for Embodied AI Safety

The LIBERO-Para findings connect to a broader pattern of adversarial and distributional fragility in embodied AI systems. An attacker does not need to craft sophisticated adversarial perturbations to cause a VLA model to fail: natural linguistic variation achieves the same effect. In deployment contexts where instructions arrive through voice interfaces, text input from non-expert users, or language translation pipelines, the paraphrase gap creates a real and largely uncharacterized safety risk.

More fundamentally, this work reveals an alignment gap: VLA models trained on manipulation benchmarks have implicitly learned to align *surface forms* of language with behaviors, rather than *meanings*. This is a subtler failure mode than the adversarial attacks studied in much of the embodied AI safety literature, but it is arguably more dangerous precisely because it manifests under entirely benign conditions. No adversary is required; users simply speak naturally.

The PRIDE metric and LIBERO-Para benchmark provide tools to close this gap — but the deeper implication is that robustness evaluation for embodied AI must move beyond fixed benchmark phrasings toward systematic coverage of the linguistic variation that real-world deployments will encounter.

*Read the [full paper on arXiv](https://arxiv.org/abs/2603.28301) · [PDF](https://arxiv.org/pdf/2603.28301.pdf)*
