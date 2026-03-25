---
title: "New Paper: The Geometry of AI Safety — Why Defenses Cannot Compose"
description: "Our preprint on the polyhedral geometry of AI safety is now available on arXiv. We prove that defense non-compositionality is not an engineering failure but a mathematical property: adding defenses can reduce the total safe region of the input space. This explains why safety stacking often makes systems less safe, not more."
date: 2026-03-26
tags: ["research", "arxiv", "defense-geometry", "non-compositionality", "iatrogenesis", "safety", "mathematics"]
draft: true
---

# New Paper: The Geometry of AI Safety -- Why Defenses Cannot Compose

We are pleased to announce our preprint on the polyhedral geometry of AI safety defense mechanisms, now available on arXiv.

**[Polyhedral Safety: Non-Compositionality of Defense Mechanisms in Adversarial AI Evaluation](https://arxiv.org/abs/XXXX.XXXXX)**

## The Core Result

Safety defenses do not compose. Adding a second defense to a system that already has one defense does not guarantee that the combined system is safer than either defense alone. In some configurations, adding defenses strictly reduces the safe region of the input space.

This is not a conjecture. We prove it geometrically.

## Why This Matters

The default assumption in AI safety engineering is additive: more defenses equal more safety. Content filters, safety training, system prompts, output classifiers -- each is assumed to contribute positively to the total safety posture. Our work shows this assumption is mathematically false in the general case.

The practical consequences are significant. Organizations that "stack" safety mechanisms -- adding layer after layer of filtering, classification, and constraint -- may be creating interference patterns that reduce safety rather than increasing it. We call this **iatrogenic safety harm**, borrowing the medical term for harm caused by treatment itself.

## Key Findings

1. **Defense non-compositionality is a geometric property, not an engineering failure.** When defense mechanisms are modeled as constraints on the input-output space, their intersection can be strictly smaller than either individual constraint's safe region. This is a property of how constraints interact, not a bug in any individual defense.

2. **Empirical evidence from 207 models confirms the theoretical prediction.** Our corpus of 133,800 evaluation results across 207 models shows that models with more safety interventions do not uniformly outperform models with fewer interventions. The relationship between defense count and safety is non-monotonic.

3. **The iatrogenic safety pattern is measurable.** Using our Therapeutic Index for Safety (TI-S) metric, we can quantify when a safety intervention causes net harm. Preliminary measurements suggest that safety stacking without empirical verification produces iatrogenic outcomes in a non-trivial fraction of configurations.

4. **This result has implications for regulatory compliance.** Regulations that mandate specific safety mechanisms (content filters, safety training, human oversight) without verifying their interaction may inadvertently require configurations that reduce safety. The EU AI Act's conformity assessment does not test for defense interaction effects.

## Implications for Embodied AI

For robotic and autonomous systems, defense non-compositionality has physical consequences. A surgical robot with three independent safety layers that interfere with each other may be less safe than the same robot with a single well-tested safety layer. An autonomous vehicle with stacked perception safety filters may have blind spots at the intersection of filter boundaries that do not exist for any individual filter.

The geometry is clear: more is not always better. Empirical verification of defense compositions is not optional.

## Read the Paper

The full preprint is available at: **[arXiv:XXXX.XXXXX](https://arxiv.org/abs/XXXX.XXXXX)**

Data and methodology are available through the [Failure-First Embodied AI](https://failurefirst.org) project.

---

*This research is part of the Failure-First Embodied AI project. The non-compositionality finding emerged from systematic adversarial evaluation of 207 models across 141,151 prompts.*
