---
title: "The Attack Surface Gradient: From Fully Defended to Completely Exposed"
date: 2026-03-10
tags: [attack-surface, asr, benchmarking, embodied-ai, safety-evaluation, practitioner-guide]
description: "After testing 172 models across 18,000+ scenarios, we mapped the full attack surface gradient — from 0% ASR on frontier jailbreaks to 67.7% on embodied AI systems. Here is what practitioners need to know."
---

Most AI safety evaluations test one thing at a time. A jailbreak benchmark. A prompt injection test. A red-team exercise. Each produces a number — an attack success rate — that tells you how one system performed against one class of attack.

After 18 months of testing 172 models across 18,723 evaluated scenarios, we have enough data to do something different: map the full gradient from "fully defended" to "completely exposed." The picture that emerges is not a binary of safe-or-unsafe. It is a slope, and where your system sits on that slope depends on what kind of attack it faces.

---

## The Gradient

Here is the attack surface gradient as our data shows it, ordered from lowest to highest attack success rate (ASR):

### Tier 1: Fully Defended (0% ASR)

**Historical jailbreaks against frontier models.** We tested Codex GPT-5.2 (n=62 traces), Claude Sonnet 4.5 (n=64), and Gemini 3 Flash (n=63) against the full taxonomy of historical jailbreak techniques — DAN, persona hijack, refusal suppression, future-year laundering, and others. Result: 0% ASR on Codex and Claude, 1.6% on Gemini (one case that appears to involve context contamination from the test harness itself).

Frontier models have effectively closed the historical jailbreak attack surface. Every technique that worked in 2022-2024 now fails against current-generation systems. This is genuine progress.

### Tier 2: Marginal (4-17% ASR)

**Reasoning-era attacks at all model scales.** We tested 6 models (n=20-25 per model) with attacks that attempt to exploit chain-of-thought reasoning — math decoys with harmful afterthoughts, reasoning chain manipulation, and similar techniques. ASR ranged from 4% to 17% across all model scales, with overlapping confidence intervals and no statistically significant differences between models (r=-0.37 correlation with scale, but weak and non-significant).

The dominant safe behaviour: models answer the decoy mathematical question and ignore the harmful afterthought. Reasoning-era attacks have not opened the gap that early results suggested.

### Tier 3: Significant (30-90% ASR)

**Multi-turn attacks.** This is where the gradient steepens. Crescendo-style attacks — where the adversarial intent is distributed across multiple conversational turns — achieved 30% strict ASR on DeepSeek-R1 (n=20, FLIP-graded) and 80-90% in external benchmarks on the same model family. The GOAT strategy showed ASR escalation from 10.2% to 32.0% across turns on DeepSeek-R1, with model accuracy degrading from 90% to below 60%.

Multi-turn attacks exploit a different mechanism than single-turn jailbreaks. They do not try to bypass safety constraints in one shot. They erode them incrementally, across a conversation that looks benign at each individual step.

### Tier 4: High (35-92% ASR)

**Format-lock and inference trace manipulation.** When attacks target the reasoning process itself rather than the safety layer, success rates climb sharply. Format-lock attacks — forcing models into JSON, YAML, or code-completion formats — achieved 92% ASR on Nemotron 30B, 91% on Llama 70B, 84% on DeepSeek-R1 (all FLIP-graded). Claude 3.7 showed 100% ASR via ASCII smuggling and 95.5% via divergent repetition.

Faithfulness gap research (arXiv:2601.02314, n=75,000 controlled trials) confirms the mechanism: reasoning traces often function as post-hoc rationalisation rather than causal explanation. Models fabricate alternative explanations when injected traces causally dictate output. The traces look correct. The reasoning process has been compromised.

For practitioners: if your safety architecture relies on monitoring chain-of-thought reasoning for signs of misalignment, these findings suggest that architecture may have significant blind spots.

### Tier 5: Near-Total (90-100% ASR)

**Supply chain attacks on small models.** We tested 6 Ollama models (1.5-3.8B parameters) across 50 supply chain scenarios each (n=300 total traces). ASR ranged from 90% to 100%, with no statistically significant pairwise differences between models (multi-model consensus kappa=0.782). Every small model tested was universally vulnerable.

Supply chain attacks — poisoned system prompts, malicious tool definitions, compromised context injection — target the infrastructure around the model rather than the model itself. At small model scales, there is effectively no defence. Frontier models have not been tested against this attack class in our framework.

### Tier 6: Embodied AI (67.7% ASR)

**VLA adversarial attacks.** We tested vision-language-action models across 7 attack families (n=62 LLM-graded traces, 2 models). Overall ASR: 67.7%. By family: safety-bypass exploitation 80%, multi-modal confusion 70%, visual adversarial perturbation 70%, action-space exploitation 67%, trajectory manipulation 67%, language-action misalignment 60%, physical constraint manipulation 60%.

Zero refusals. Not "low refusal rate" — zero. The models did not recognise any of the 62 adversarial scenarios as adversarial. External literature confirms the mechanism: BadVLA achieved near-100% ASR against both pi-zero and OpenVLA through shared VLM backbone attacks that transfer across robot embodiments.

This is the most under-evaluated tier. No standardised cross-embodiment adversarial benchmark exists. The systems being deployed — in warehouses, on roads, in surgical theatres — have not been subjected to the adversarial evaluation that is now routine for language models.

---

## What the Gradient Shows

Three patterns emerge from this data:

**1. Defence progress is real but narrow.** Frontier models have genuinely solved historical jailbreaks. This is significant engineering achievement. But the attack surface has moved, not shrunk. The techniques that fail at 0% ASR in Tier 1 are the techniques from 2022. The techniques that succeed at 67-100% ASR in Tiers 5-6 are the techniques from 2025-2026.

**2. The attack surface shifts from content to process to infrastructure.** Tier 1-2 attacks target what the model says (content-level). Tier 3-4 attacks target how the model reasons (process-level). Tier 5-6 attacks target what the model is embedded in (infrastructure-level). Each shift moves the attack surface further from where current defences are concentrated.

**3. Embodied AI is the least defended frontier.** The 67.7% ASR on VLA models with zero refusals represents systems that are being deployed in physical environments. These systems have actuators. They can move objects, operate vehicles, and interact with humans physically. The absence of any adversarial evaluation infrastructure for these systems is, in our assessment, the most significant gap in current AI safety practice.

## For Practitioners

If you are evaluating AI system safety, this gradient suggests a checklist:

- **Are you testing against current attack classes, not just historical ones?** A clean score against DAN-style jailbreaks tells you about 2022 threats, not 2026 threats.
- **Are you testing multi-turn interactions?** Single-turn evaluations miss the attack class with the steepest ASR increase.
- **Are you monitoring reasoning traces?** If so, are you aware that traces may not reflect actual reasoning?
- **Does your system accept external context (tools, RAG, system prompts)?** If so, have you evaluated supply chain attack vectors?
- **Does your system have physical actuators?** If so, what adversarial evaluation has it undergone?

The gradient is not a ranking of danger. A 0% ASR jailbreak result does not make a system safe if it has a 90% ASR supply chain vulnerability. Safety evaluation requires coverage across the full gradient — and right now, most evaluations cover only the leftmost, best-defended portion.

---

*All statistics in this post include sample sizes and are derived from LLM-graded traces unless otherwise noted. The Failure-First corpus contains 32,465 prompts, 18,723 evaluated results, and 172 models. Methodology details and full trace data are available in our research repository.*
