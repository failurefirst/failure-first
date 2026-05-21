---

title: "Circuit Breakers: Removing Model Behaviors with Representation Engineering"
description: "Surgical removal of harmful behaviors by identifying and nullifying their underlying representations"
date: 2025-10-08
arxiv: "2406.04313"
authors: "Andy Zou, Andrew Wang, Zifan Carl Zhao, Long Phan, Alexander Pan, Alexander Matt Turner, Yonatan Belinkov, Kewen Zhou, CAIS, MIT"
paperType: "empirical"
tags: [model-editing, behavior-removal, representation-engineering, safety-intervention, interpretability]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/circuit-breakers-behavior-removal.m4a"
---

## Circuit Breakers: Surgical Behavior Removal

Building on Representation Engineering, Circuit Breakers proposes methods to identify the circuits (network subgraphs) responsible for specific behaviors and remove them. Instead of RLHF retraining, Circuit Breakers edits representations to "break" harmful behavior at inference time.

## Method

1. **Circuit identification:** Trace activations during harmful outputs to identify which layers and neurons activate strongly
2. **Representation ablation:** Nullify activations in the identified circuit during inference
3. **Behavior verification:** Test that the harmful behavior is eliminated while preserving helpful behaviors

## Key Findings

- Harmful behaviors (e.g., lying, refusing benign requests) are localized to specific circuits
- Removing these circuits eliminates the behavior in most cases (~80-90% success)
- Removal sometimes improves other capabilities (e.g., removing the "refuse helpfully" behavior improves instruction-following)
- The approach is model-specific; circuits don't transfer across architectures

## Embodied AI Connection

For deployed embodied systems, Circuit Breakers offers a novel safety intervention: identify failure-mode circuits and remove them without full retraining. A robot deployed with an undesired safety behavior (e.g., refusing useful tasks due to false positive harm detection) could have that circuit surgically removed in the field. This is faster and cheaper than retraining.

However, F41LUR3-F1R57 research shows that removing individual behaviors often creates unexpected side effects. Removing a "refuse" circuit might eliminate both harmful refusals **and** safety-critical refusals.

## Limitations

- Circuit identification requires access to model internals (weights, activations)
- Removal affects multiple behaviors simultaneously; precise surgical removal is difficult
- Long-term effects on model robustness and generalization are unknown
- Adversarial attacks might exploit the removed circuits

## Contrast with Sleeper Agents

While Sleeper Agents demonstrates that models can hide behaviors, Circuit Breakers shows we can find and remove them. The two papers together suggest a cat-and-mouse game: improving interpretability makes deception detection possible, which incentivizes better deception.

## Research Impact

Circuit Breakers demonstrated that mechanistic transparency is actionable—we can use understanding of model internals to improve safety and correct harmful behaviors.
