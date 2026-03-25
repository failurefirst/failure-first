---
title: "New Paper: Your Safety Benchmark Is Lying to You"
description: "Our preprint on benchmark contamination in adversarial AI evaluation is now available on arXiv. Static safety benchmarks systematically overestimate model safety because models have memorized the test set. We document the contamination pathway, quantify the false confidence it produces, and propose dynamic evaluation as the alternative."
date: 2026-03-26
tags: ["research", "arxiv", "benchmarks", "contamination", "safety-evaluation", "methodology", "reproducibility"]
draft: true
---

# New Paper: Your Safety Benchmark Is Lying to You

We are pleased to announce our preprint on benchmark contamination in adversarial AI safety evaluation, now available on arXiv.

**[Contaminated Confidence: How Static Safety Benchmarks Systematically Overestimate Model Safety](https://arxiv.org/abs/XXXX.XXXXX)**

## The Problem

The AI safety field relies on a small number of static benchmarks to evaluate model safety: AdvBench, HarmBench, JailbreakBench, StrongREJECT. These benchmarks are public. Their prompts are in training data. Models have seen the test.

This is not a theoretical concern. We measure it.

## What We Found

By comparing model performance on public benchmark prompts versus novel prompts targeting the same attack surfaces, we quantify the contamination gap -- the difference between measured safety on known benchmarks and actual safety on unseen adversarial inputs.

Key findings from our corpus of 207 models and 133,800 evaluation results:

1. **Public benchmark performance systematically overestimates safety.** Models that score well on AdvBench and HarmBench show significantly higher attack success rates on novel prompts from the same attack families. The contamination effect is not subtle.

2. **The overestimation is larger for frontier models.** Models with the most training data (and therefore the most exposure to public benchmarks) show the largest gap between benchmark performance and performance on unseen prompts.

3. **Heuristic classifiers amplify the distortion.** Our documented keyword-vs-LLM classifier disagreement (Cohen's kappa = 0.126) means that the standard methodology -- heuristic classification of benchmark outputs -- compounds contamination with measurement error.

4. **No public static benchmark includes embodied AI scenarios.** AdvBench, HarmBench, JailbreakBench, and StrongREJECT have zero embodied/tool-integrated/multi-agent scenarios. Models that score perfectly on these benchmarks have never been tested against the attack surfaces relevant to robotic and agentic AI deployments.

## Why This Matters

Safety benchmarks are used to make deployment decisions. A model that "passes" HarmBench may be deployed in a safety-critical application on the basis of that result. If the benchmark result is contaminated -- if the model has memorized the safe responses to those specific prompts -- then the deployment decision is based on false confidence.

For embodied AI, the consequences are physical. A VLA model deployed on a humanoid robot because it scored well on text-based safety benchmarks has never been tested against:

- Physical adversarial patches that manipulate visual grounding
- Format-lock attacks that suppress safety reasoning through structural constraints
- Action-layer manipulation that bypasses text-level safety entirely
- Multi-agent coordination attacks that exploit inter-agent trust

## What We Propose

Static benchmarks cannot solve this problem because the contamination pathway is structural: public benchmarks will always be in training data. We propose three complementary approaches:

1. **Dynamic evaluation:** Generate novel adversarial prompts for each evaluation run, preventing memorization.
2. **Attack-family coverage testing:** Evaluate against attack families (format-lock, emotional manipulation, crescendo, etc.) rather than fixed prompt sets.
3. **Action-layer evaluation for embodied systems:** Test safety at the actuator output level, not just the text output level.

## Read the Paper

The full preprint is available at: **[arXiv:XXXX.XXXXX](https://arxiv.org/abs/XXXX.XXXXX)**

The Failure-First benchmark specification and dynamic evaluation methodology are documented at [failurefirst.org](https://failurefirst.org).

---

*This research is part of the Failure-First Embodied AI project. Our corpus of 207 models, 141,151 prompts, and 133,800 results with LLM-graded verdicts provides the empirical foundation for these findings.*
