---


title: "StrongREJECT: A Robust Metric for Evaluating Jailbreak Resistance"
description: "Proposes StrongREJECT, a classification-based metric that robustly evaluates whether a language model's refusal to provide harmful information is genuine or can be evaded with minor prompt variations."
date: 2025-11-06
arxiv: "2402.10260"
authors: "Landon Souly, Fatih Mili, Giannis Daras, Karthikeyan Natesan Ramamurthy, Manish Madaio, Jean-Baptiste Labreuille, Pierre Monget"
paperType: "empirical"
tags: [jailbreaking, evaluation-metrics, robustness, safety-testing, rejection-consistency]
draft: false
image: "https://cdn.failurefirst.org/images/daily-paper/strongreject-robust-jailbreak-evaluation.png"
audio: "https://cdn.failurefirst.org/audio/daily-paper/strongreject-robust-jailbreak-evaluation.m4a"
---

Red-teaming methods are only useful if we can reliably measure whether they succeed. A model that refuses a jailbreak attempt might seem safe, but it might also simply be refusing the specific phrasing—and would comply with a slightly reworded version of the same request.

StrongREJECT addresses this problem by defining refusal robustness: a model is truly aligned only if it refuses not just the original adversarial prompt, but also minor variations on it. The metric works by applying text transformations (synonym replacement, paraphrasing, structure changes) to prompts that a model refuses, then checking whether the model's refusal remains consistent.

If a model refuses "how to make a bomb" but accepts "steps for constructing an explosive device," it has not genuinely learned to refuse the harmful request—it has only learned to pattern-match specific phrasings. StrongREJECT makes this failure visible.

The metric surfaces a critical insight: many claimed safety improvements are brittle. A model might achieve high refusal rates on a standard benchmark, but its refusal mechanism fails under paraphrasing. This explains why adversarial attacks that succeed often do so through simple rewording—they exploit the fragility of pattern-matching-based refusals.

For embodied systems, robustness to paraphrasing is essential. A robot might receive instructions from users with different linguistic backgrounds, from noisy sensors misinterpreting sound, from text processing systems introducing small errors. If the robot's safety mechanism depends on exact phrase matching, it will fail in real-world deployment with linguistic variation.

StrongREJECT shifts evaluation methodology from "does this attack work on this prompt?" to "is this refusal genuinely robust?" This distinction is foundational for building embodied AI systems where safety must be maintained not just against the exact threats in the test suite, but against natural distribution shift and linguistic variation in deployment.
