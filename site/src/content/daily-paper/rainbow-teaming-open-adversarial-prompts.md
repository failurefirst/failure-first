---
title: "Rainbow Teaming: Open-Ended Generation of Diverse Adversarial Prompts"
description: "Generating diverse attack angles through multi-objective optimization—demonstrates vulnerability to multi-axis jailbreaks"
date: 2025-10-03
arxiv: "2402.16822"
authors: "Mikayel Samvelyan, Drummond Hu, Andries Crinnion, Yutian Chen, Tom Brown, Google DeepMind"
paperType: "empirical"
tags: [red-teaming, adversarial-prompts, diversity, multi-objective-optimization, jailbreak-generation]
draft: false
---

## Rainbow Teaming: Automating Diverse Red Team Attacks

Instead of manually writing jailbreak prompts, Rainbow Teaming uses multi-objective optimization to generate adversarial examples that explore different attack dimensions: emotional appeal, logical fallacy, role-play, false expertise, and more. The key insight is that safety vulnerabilities have multiple axes of attack, and a comprehensive evaluation must probe each dimension.

## Method

- **Diversity axes:** Encodes attack families (appeal to authority, emotional manipulation, format constraints, instruction override) as optimization objectives
- **Genetic algorithm search:** Iteratively mutates prompts to maximize coverage across diverse attack strategies
- **No human-written seeds:** Prompts generated entirely from system descriptions, demonstrating generalizability

## Findings

- Models fail to different axes of attack with different frequencies
- A single jailbreak success rate (e.g., "30% of models vulnerable to roleplay attacks") masks variation across attack types
- Diversity in adversarial prompting is necessary to expose the full vulnerability landscape

## Embodied AI Connection

F41LUR3-F1R57 research has documented that embodied AI systems operate in complex, multi-axis failure modes: physical environment constraints, user intent ambiguity, multi-turn context drift. Rainbow Teaming's insight—that safety failures are multi-dimensional—directly applies to embodied AI deployment: a robot's safety model must be evaluated across diverse failure modes, not just a single "jailbreak" axis.

## Impact on Safety Evaluation

This work shifted the field away from "what is the jailbreak rate?" toward "how do jailbreak success rates vary across attack dimensions?" This is essential for embodied AI, where different deployment contexts may have different dominant failure modes.

## Limitations

The genetic algorithm approach is computationally expensive (requires 1000s of model API calls per evaluation). The method requires knowing the attack dimensions in advance.
