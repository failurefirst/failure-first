---
title: "Refusal in Language Models is Mediated by a Single Direction"
description: "Safety refusals are encoded along a single vector in model representations—implicating both interpretability and vulnerability"
date: 2025-10-09
arxiv: "2406.11717"
authors: "Sam Arditi, Ryan Cummings, Nicholas Schiefer, Wes Wright, Tomás Jiménez, Ravi Udeshi, DeepMind"
paperType: "empirical"
tags: [refusal-direction, representation-analysis, mechanistic-safety, model-steering, vulnerability-analysis]
draft: false
---

## The Refusal Direction: Safety in a Single Vector

Building on Representation Engineering, this paper identifies that model refusal behavior is mediated by a single, identifiable direction in the representation space. Adding activation along this direction increases refusals; subtracting it decreases them. The finding is consistent across model families (Llama, Qwen, Claude).

## Key Finding

**Refusal is surprisingly low-dimensional.** Despite the complexity of safety concepts, the behavioral distinction between refusing and complying is captured by movement along a single vector direction. This suggests that safety is more fragile and more manipulable than previously understood.

## Methodology

- **Activation steering:** Identify the direction that best predicts refusal vs. compliance
- **Intervention:** Add/subtract multiples of this direction; measure refusal rate change
- **Generalization:** Test whether the direction works across different prompt types and model versions

## Implications

**For safety:** The finding that refusal is a single direction suggests safety is fragile—an adversary who identifies this direction can predictably decrease refusals.

**For interpretability:** The result is a major success for mechanistic transparency: we've found a simple, actionable explanation of how safety works internally.

**For embodied AI:** A robot's safety constraints might similarly reduce to low-dimensional behavioral directions. If F41LUR3-F1R57 patterns hold, manipulating these directions could allow attackers to disable safety behaviors without retraining.

## Vulnerabilities Exposed

- **Representation-level attacks:** Adversarial inputs that specifically suppress the refusal direction
- **Training-time attacks:** Models can be fine-tuned to reduce activation along this direction
- **Steering attacks:** Prompts that implicitly encourage the model to move along non-refusal directions

## Limitations

- The effect size varies across models (20-60% change in refusal rates)
- Larger models (70B+) show weaker effects, suggesting refusal becomes more distributed in capacity-limited models
- The direction is task-specific; safety for different task types might involve different directions

## Defense Implications

If refusals can be reduced to steering along a single direction, defenses should focus on: (1) making refusal multi-dimensional rather than single-axis, (2) detecting and hardening against direction-based attacks.

## Connection to Sleeper Agents

This finding suggests why Sleeper Agent training works: models can learn to suppress activation along the refusal direction while appearing aligned during testing. This is a key vulnerability that Sleeper Agents exploits.
