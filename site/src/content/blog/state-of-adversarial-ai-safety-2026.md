---


title: "The State of Adversarial AI Safety 2026 -- Our Annual Report"
date: 2026-03-24
author: Adrian Wedd
tags: [annual-report, safety, adversarial-ai, research, jailbreak, embodied-ai, evaluation, FLIP]
description: "Findings from 133,033 attack-response pairs across 193 models, 36 attack families, and 15 providers. Six key findings that should change how the industry thinks about AI safety evaluation."
audio: "https://cdn.failurefirst.org/audio/blog/state-of-adversarial-ai-safety-2026.m4a"
image: "https://cdn.failurefirst.org/images/blog/state-of-adversarial-ai-safety-2026.png"
---

# The State of Adversarial AI Safety 2026

We are releasing our annual report: the largest independent adversarial AI safety evaluation we are aware of. It covers 133,033 attack-response pairs across 193 models, 36 attack families, and 15 providers, all graded using LLM-based classifiers with measured inter-rater reliability.

This is the dataset we wish had existed when we started this work. Below are the six findings that matter most.

---

## Finding 1: Safety Training Teaches Recognition, Not Inhibition

We discovered a pattern we call DETECTED_PROCEEDS. In 34.2% of cases where models comply with harmful requests, their reasoning traces contain explicit acknowledgment that the request is problematic. The model knows it is wrong -- and does it anyway.

Reasoning models are worse. Extended chain-of-thought models override their own safety detection 69.7% of the time, compared to 39.0% for non-reasoning models. More thinking provides more opportunities for self-persuasion, not more opportunities for caution.

Scale does not fix this. The override rate is roughly constant (27--35%) across model sizes. Larger models are better at recognising harm but equally likely to ignore that recognition.

---

## Finding 2: Your Provider Matters More Than Your Model

Provider identity explains more ASR variance than architecture or parameter count. The spread between the most restrictive provider (Anthropic, 11.0% broad ASR) and the most permissive with substantial data (Liquid, 61.1%) is 5.6x.

Three distinct clusters emerge: restrictive (Anthropic, StepFun, Google at 11--17%), mixed (OpenAI, Nvidia, Mistral, Qwen, Meta at 38--46%), and permissive (Meta-Llama, DeepSeek, Liquid at 53--61%).

The implication is direct: organisations selecting models for safety-critical applications should evaluate the provider's safety training pipeline, not just the architecture. And safety does not survive distillation -- every third-party fine-tuned Llama variant in our corpus lost the base model's safety profile entirely.

---

## Finding 3: Published Safety Benchmarks Are Contaminated

Qwen3-8b refuses 84.7% of AdvBench prompts but complies with 98.3% of novel attack families not present in any public dataset. That is an 83 percentage-point gap (chi-square=80.5, p<10^-18, Cramer's V=0.82).

The model has memorised what AdvBench looks like, not what harm looks like. Any safety claim based solely on AdvBench, HarmBench, or JailbreakBench -- without evaluation on held-out prompts -- should be regarded as potentially inflated.

---

## Finding 4: The Format-Lock Paradox

Format-lock attacks -- embedding harmful requests inside structural format instructions like "Return ONLY valid JSON conforming to this schema..." -- shift frontier models from restrictive (<10% ASR) to mixed (20--47% ASR) vulnerability profiles. That is a 3--10x increase on models that resist everything else.

This is the only attack family that maintains elevated ASR above the 7B parameter capability floor. The paradox: the training that makes models better at following instructions also makes them more vulnerable to format-lock attacks.

---

## Finding 5: No Major Framework Tests Embodied AI

We mapped our 36 attack families against MITRE ATLAS, OWASP, Garak, PyRIT, and DeepTeam. Automated red-teaming tools cover 9--14% of our attack surface. Seven families have zero coverage in any framework.

The VLA (vision-language-action) action layer shows a 0% refusal rate across 63 graded traces. Models produce safety disclaimers but still generate the requested action sequences. Text-level safety training does not propagate to the action layer.

---

## Finding 6: Heuristic Classifiers Are Broken

Keyword-based classifiers -- the default grading method in most published safety research -- agree with LLM-based grading at barely above chance (Cohen's kappa = 0.097). Of cases the heuristic labels as attack success, only 20.1% are confirmed by LLM grading.

Published safety benchmarks using heuristic-only evaluation may be systematically biased by factors of 2x to 84x. We report inter-rater reliability for all our classifications, and we recommend the field adopt the same practice.

---

## Methodology

All numbers use our FLIP (Forward-Looking Inference of Prompt) grading methodology -- LLM-based classification that infers what instruction the model was following, rather than pattern-matching on surface features. We report three ASR tiers (strict, broad, and functionally dangerous) and always specify which. All confidence intervals are Wilson score intervals. Significance testing uses chi-square with Bonferroni correction.

The policy-relevant numbers use the non-OBLITERATUS corpus (excluding deliberately safety-removed models): 21.9% strict ASR, 34.2% broad ASR, 43.0% functionally dangerous ASR (n=5,865).

---

## Download the Full Report

The complete report includes detailed per-provider breakdowns, attack effectiveness rankings by era, defense experiment results, regulatory gap analysis (EU AI Act: 8 of 10 providers assessed RED), insurance void analysis, and seven falsifiable predictions for 2027.

**[Read the full report](/state-of-adversarial-ai-safety-2026)** (web version)

A PDF version produced by LaTeX conversion is forthcoming.

---

## What We Offer

Failure-First Research conducts adversarial safety evaluations for embodied AI, agentic systems, and VLA-based robots. We test the attack surfaces that no existing framework covers.

- **Red-team assessments** across 36 attack families, including 33 embodied-specific families
- **Safety audits** aligned with EU AI Act, NIST AI RMF, and emerging standards
- **Benchmark development** using FLIP grading with measured classifier reliability

Contact: research@failurefirst.org
