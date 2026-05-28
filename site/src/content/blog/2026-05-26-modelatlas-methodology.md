---
title: "How ModelAtlas Scores 704 AI Models for Trust"
description: "ModelAtlas at atlas.failurefirst.org assigns trust tiers to 704 AI models. This post explains the methodology: what goes into a quality-based score, how adversarial benchmark data upgrades that score, and where the current limits are."
date: 2026-05-26
author: River Song and Martha Jones
tags: ["modelatlas", "trust-scoring", "adversarial-evaluation", "methodology", "FLIP", "ASR"]
image: "https://cdn.failurefirst.org/images/blog/2026-05-26-modelatlas-methodology-infographic.png"
draft: false
---

*River Song, Head of Predictive Risk · Martha Jones, Policy & Standards Lead*

---

[ModelAtlas](https://atlas.failurefirst.org) is a model intelligence catalog that assigns trust tiers to AI models. It currently covers 704 models. Every model in the catalog carries a trust tier derived from what the data actually supports — and the methodology is honest about what it does not yet support.

This post explains how the scoring works.

## Quality-based trust scoring: the baseline for most models

For the majority of models in the catalog, the trust tier is computed from three quality signals: license type, download volume, and architecture indicators.

**License type** captures how openly the model is distributed and what terms govern its use. A model released under a permissive open license with clear commercial terms sits differently in a risk profile than one distributed under a restrictive research-only license or no license at all. License clarity matters because it determines whether deployers have a documented understanding of what they are using.

**Download volume** serves as an adoption signal. A model downloaded millions of times has received substantially more real-world exposure than one that is obscure. High adoption does not mean high safety — but it does mean the model has been examined by more eyes, integrated into more pipelines, and is more likely to have publicly known failure modes. Adoption is a partial proxy for scrutiny.

**Architecture signals** cover parameter count, family lineage, instruction-tuning status, and quantization tier. These capture capability-relevant distinctions: a 70-billion-parameter instruction-tuned model and a 1.5-billion-parameter base model have materially different deployment profiles even if they share a family name.

Together, these signals produce a quality-based trust tier for every model in the catalog. It is not a safety evaluation. A high quality-based score means the model is well-documented, widely adopted, and architecturally legible — not that it has been tested against adversarial prompts.

That distinction matters. Most of the 704 models in ModelAtlas carry quality-based scores only. The methodology does not claim more than the data supports.

## ASR-backed tiers: what the adversarial corpus adds

For a subset of models, the trust tier is also shaped by attack success rate (ASR) data from the Failure-First adversarial evaluation corpus.

ASR is the fraction of adversarial prompts on which a model produced a compliant response — meaning the model returned content responsive to the adversarial intent rather than refusing. An ASR of 40% means the model complied with 40 out of every 100 adversarial prompts.

The corpus underpinning these scores contains 53,114 FLIP-graded evaluations. FLIP — the Failure-First Layered Interrogation Protocol — is an LLM-as-judge grader that evaluates whether an adversarial prompt produced a compliant or refused response. It returns one of four verdicts: COMPLIANCE, PARTIAL, HALLUCINATION_REFUSAL, or REFUSAL.

We use FLIP-graded verdicts only. Heuristic keyword classifiers exist in the database but they are not used for ASR numbers published in ModelAtlas. The reason: heuristic classifiers over-report compliance by 30 to 60 percentage points depending on the prompt class. The FLIP-graded number is the harder-earned one, and it is the only one that earns the label.

Of the 167 models in the corpus with any ASR signal, 67 have high-confidence scores (100 or more FLIP-graded evaluations). These are the models where the ASR-backed tier carries statistical weight. Models with fewer evaluations are flagged at lower confidence.

Currently, 28 models in the ModelAtlas catalog carry ASR-backed trust tiers derived from this corpus. That number will grow as corpus coverage expands.

## The veto rule

One finding from the adversarial corpus drives a hard floor in the trust tier system.

The veto rule is: if a model's FLIP-graded ASR exceeds 60% at high confidence, it is placed in the BOTTOM tier regardless of its quality-based score. License, downloads, and architecture do not override this. A widely-adopted, openly-licensed, well-documented model that complies with adversarial prompts more than 60% of the time has demonstrated a failure mode that no quality signal cancels.

Across the corpus, 29 models meet this threshold. They are not named in this post, but they are identified in the catalog. The median ASR across all corpus-tested models is 31.0%.

The veto rule is deliberately blunt. Trust tier systems that allow a high adversarial compliance rate to be offset by good documentation are not safety tools — they are marketing tools. The BOTTOM tier is a floor, not a ranking.

## What the coverage limits mean

Of the 704 models in the catalog, 676 carry quality-based scores only. This is not a gap to be papered over. It reflects the current state of the adversarial corpus: coverage is real but incomplete, and we do not assign ASR-backed tiers where the data does not support them.

Coverage will grow. As the corpus expands to include more models across more prompt classes, more catalog entries will gain ASR-backed tiers. No score is permanent — the catalog refreshes as new evaluation data lands.

## Where to look

The catalog is live at [atlas.failurefirst.org](https://atlas.failurefirst.org). Each model row shows its trust tier, the signals that drove it, and — for ASR-backed rows — the confidence level and sample size behind the adversarial score.

---

**Related reading:** [ModelAtlas Methodology: What a FLIP-Graded ASR Signal Can and Cannot Tell You](/blog/2026-05-16-modelatlas-methodology) — a deeper look at how the adversarial corpus is graded, confidence interval choices, and what the ASR signal does not support.

*Methodology questions and corpus-coverage requests: file an issue in the [Failure-First repository](https://github.com/adrianwedd/failure-first-embodied-ai).*
