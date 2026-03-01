---
title: "Inference Trace Manipulation as an Adversarial Attack Surface"
date: 2026-03-01
description: "Format-lock attacks achieve 92% success rates on frontier models by exploiting how structural constraints displace safety alignment during intermediate reasoning — a qualitatively different attack class from prompt injection."
tags: ["adversarial", "reasoning-models", "format-lock", "faithfulness-gap", "agentic-ai", "safety"]
---

Prompt injection targets the input layer: you embed a malicious instruction in content the model will read, and the instruction overrides the intended task. Trace manipulation operates at a different layer entirely. It poisons the intermediate reasoning steps the model uses to evaluate its task — leaving the user's prompt unchanged, and leaving the model attempting to fulfill a legitimate request through a corrupted decision-making process.

This distinction matters because the defences are different, and the one we have been building is largely the wrong one for this attack class.

## Format-Lock Attacks: The Empirical Finding

The Failure-First format-lock experimental series tested eight models under structural output constraints — forcing models to express their reasoning in raw Python, archaic literary formats, or rigid JSON schemas. The results:

| Model | Format-Lock ASR |
|---|---|
| Nemotron 30B | 92% |
| Llama 70B | 91% |
| DeepSeek-R1 | 84% |
| GPT-OSS 120B | 65% |
| Claude 3.7 (ASCII Smuggling) | 100% |
| Nemotron 9B | 44% |
| Nemotron 12B | 36% |
| LFM 1.2B | 35% |
| Gemma 27B | 0% |

The mechanism: rigid format constraints trigger localised catastrophic forgetting. The structural demand displaces safety alignment weights during generation. Safety alignment training data rarely overlaps with extreme formatting constraints, so the model prioritises the format directive over the safety directive. Adversarial logic propagates through the intermediate trace unchecked.

These are LLM-graded results with Cohen's Kappa of 0.245 for heuristic-LLM agreement. The heuristic classifier for COMPLIANCE is 88% unreliable; for REFUSAL it is 95% reliable. The reported ASR figures reflect LLM-graded assessments, not heuristic-only outputs.

## The Faithfulness-Plausibility Gap

A parallel finding complicates the picture. Extensive controlled trials (75,000 experimental conditions) measuring the relationship between intermediate reasoning traces and final model outputs found a pervasive "Faithfulness-Plausibility Gap" (arXiv:2601.02314): intermediate traces frequently function as human-convincing narratives rather than genuine reflections of the underlying decision-making process.

Models arrive at conclusions through internal heuristics while outputting seemingly logical step-by-step explanations. This creates a paradoxical vulnerability: even though models naturally confabulate reasoning, actively injecting adversarial content into the trace forces the model's attention mechanism to condition subsequent output on the poisoned tokens. In the 75,000 controlled trial set, models frequently altered their final answers to align with injected fragments — and then fabricated alternative explanations for why they reached that conclusion, obscuring the injection.

The model actively aids the adversary by hiding the evidence of trace manipulation in its final output.

## Budget Starvation vs. Format Lock

Budget starvation attacks theoretically exploit context window limitations: inflate the trace with high-priority adversarial tokens, force safety constraints and earlier instructions to be dropped from active context. Modern inference models show higher resilience to budget starvation than to format-lock attacks, likely due to more sophisticated attention mechanisms over long contexts.

Format-lock is the more empirically effective attack class against current frontier models, while budget starvation may be more effective against older or smaller architectures with limited context handling.

## Compounding in Multi-Turn and Embodied Contexts

Single-turn evaluations understate the risk. In multi-turn agentic deployments, errors in intermediate reasoning accumulate: a poisoned variable introduced at turn 2 compounds through subsequent turns rather than being corrected. Research documents accuracy dropping from approximately 90% at single-turn to under 60% with multiple turns under adversarial pressure.

The GOAT (Goal-Oriented Adversarial Testing) multi-turn strategy demonstrated this directly: DeepSeek-R1 escalated from 10.2% ASR at single-turn to 32.0% under multi-turn context expansion. Higher computational effort — longer trace generation — was associated with higher attack success rates, as extended generation provided more surface area for compounding errors.

For embodied AI, the intermediate trace bridges observation and kinetic action. If a format-lock vulnerability causes the agent to misinterpret spatial coordinates, the compounding failure results in physically repeated unsafe actions under corrupted decision criteria. Unlike a text response that a human can read and reject, a physical action may not be recoverable.

## What Hiding Traces Doesn't Solve

Both o1 (OpenAI) and Gemini 2.5 Flash hide intermediate reasoning from users. The common assumption is that hidden traces reduce the attack surface. The research does not support this. Hiding traces reduces auditability — it removes the monitoring signal that would let operators detect trace manipulation — without reducing the underlying vulnerability. The intermediate state space is still manipulable; it is simply less observable.

The policy implication is that inference trace integrity monitoring needs to operate on the trace itself, not just the final output. No production-grade trace integrity monitor currently exists for this purpose. Issue #159 tracks this gap.

*Format-lock ASR results are empirically validated in-repo (CLI-graded, LLM verification). Trace fabrication hypothesis derives from external literature. In-repo validation of the full trace manipulation pipeline is not yet complete.*
