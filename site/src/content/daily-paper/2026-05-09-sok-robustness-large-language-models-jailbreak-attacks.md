---

title: "SoK: Robustness in Large Language Models against Jailbreak Attacks"
description: "A systematization of knowledge paper from IEEE S&P 2026 introducing Security Cube — a unified multi-dimensional evaluation framework exposing the inadequacy of attack success rate as a single safety metric."
date: 2026-05-09
arxiv: "2605.05058"
authors: "Feiyue Xu, Hongsheng Hu, Chaoxiang He, Sheng Hang, Hanqing Hu, Xiuming Liu, Yubo Zhao, Zhengyan Zhou, Bin Benjamin Zhu, Shi-Feng Sun, Dawu Gu, Shuo Wang"
paperType: "systematization"
tags: [jailbreak, robustness, evaluation-framework, attack-success-rate, llm-safety, sok]
audio: "https://cdn.failurefirst.org/audio/daily-paper/2605.05058-audio-overview.m4a"
draft: false
image: "https://cdn.failurefirst.org/images/daily-paper/2026-05-09-sok-robustness-large-language-models-jailbreak-attacks.png"
---

The jailbreak research community has a measurement problem. Attack success rate (ASR) has become the default metric for evaluating both attacks and defenses, but ASR is a one-dimensional projection of a fundamentally multi-dimensional security space. A defense that reduces ASR by 30% while simultaneously degrading general capability by 40% and increasing susceptibility to a different attack family is not a net improvement in security — but current evaluation practice would report it as one.

This systematization of knowledge paper, appearing at IEEE S&P 2026, sets out to fix the measurement problem from first principles.

### The Security Cube Framework

The central contribution is **Security Cube**: a unified, multi-dimensional evaluation framework for jailbreak attacks and defenses that goes beyond ASR to assess security along multiple independent axes simultaneously. While the paper provides detailed characterisation of these dimensions, the key insight is architectural: security properties in language models are not jointly determined by a single quantity, and evaluation frameworks that treat them as if they were will systematically misrank both attacks and defenses.

This matters practically. A defense that reduces raw ASR may achieve this by making the model less instruction-following — which increases false negatives in legitimate use cases and degrades capability on safety-relevant tasks like medical information retrieval. Security Cube provides a framework for detecting these tradeoffs rather than hiding them in an aggregate metric.

### A Structured Taxonomy of Attacks and Defenses

The paper provides comparison tables covering a substantial fraction of the published jailbreak and defense literature. These tables serve a function beyond completeness: they identify patterns in how attack methods relate to defense methods across the taxonomy. Some attack families have multiple mature defenses; others are systematically underdefended. The SoK format — synthesising findings across many papers rather than reporting new experimental results — is particularly well-suited for identifying these structural gaps in the literature.

A recurring pattern in the taxonomy is that defenses which are effective against one attack family often create new vulnerabilities to a different family. This is consistent with the adversarial robustness literature in computer vision, where there is now strong evidence of a fundamental tradeoff between natural accuracy and adversarial robustness. The SoK suggests a similar tradeoff structure may exist in LLM safety, with implications for how "safe" models should be evaluated before deployment.

### Open Challenges and Evaluation Standards

The paper concludes with a characterisation of the open challenges that the field needs to address. Several of these map directly to known failure modes in the F41LUR3-F1R57 corpus:

**Classifier fidelity**: Most existing jailbreak success evaluations use either keyword matching (which we have documented overcounts compliance by 30–60 percentage points) or LLM-based classifiers (which introduce model-specific bias and grader agreement problems). Security Cube's multi-dimensional framework implicitly requires more sophisticated evaluation infrastructure, but does not fully specify it — leaving implementation details as an open problem.

**Generalization across attack families**: A defense validated against one attack family provides no guarantees against a different family. The field currently lacks formal transfer results that would let practitioners reason about robustness under distribution shift in the attack space.

**Dynamic adversaries**: Static benchmarks, even well-constructed ones, are evaluated against a fixed attack distribution. Adaptive adversaries who observe a deployed defense and optimise against it are not captured by any current benchmark. This is the evaluation gap that active learning approaches like MultiBreak (featured yesterday) begin to address.

### Why This Paper Is the Right Capstone for This Week

This survey lands at the right moment. The week's papers — a broad embodied AI safety survey, a high-quality multi-turn jailbreak benchmark, a VLA-specific threat taxonomy, and now a measurement framework that questions how we score everything — together describe a field that is growing rapidly in capability and attack sophistication while its evaluation infrastructure lags behind. Security Cube is a proposal for how to close that gap. Whether it becomes the standard evaluation framework will depend on adoption, and adoption will depend on tooling. That tooling work is now the critical path.

*Read the [full paper on arXiv](https://arxiv.org/abs/2605.05058) · [PDF](https://arxiv.org/pdf/2605.05058.pdf)*
