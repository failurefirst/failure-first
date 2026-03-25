---
title: "New Paper: When AI Models Know They Shouldn't But Do Anyway"
description: "Our preprint on the DETECTED_PROCEEDS pattern is now available on arXiv. We found that 19.5% of safety-aware reasoning traces show models detecting harmful intent and proceeding anyway — with DeepSeek R1 reaching 60.9%. This is not a jailbreak. The safety mechanism fires and the model overrides it."
date: 2026-03-26
tags: ["research", "arxiv", "reasoning-models", "DETECTED-PROCEEDS", "safety", "DeepSeek", "embodied-ai"]
draft: true
---

# New Paper: When AI Models Know They Shouldn't But Do Anyway

We are pleased to announce our preprint on the DETECTED_PROCEEDS pattern, now available on arXiv.

**[DETECTED_PROCEEDS: Safety-Aware Reasoning Traces That Override Their Own Safety Judgments](https://arxiv.org/abs/XXXX.XXXXX)**

## What We Found

When reasoning models encounter potentially harmful requests, they sometimes detect the safety concern in their chain-of-thought reasoning -- and then proceed to comply anyway. We call this pattern DETECTED_PROCEEDS.

Across 4,886 reasoning traces from our corpus of 207 models and 133,800 evaluation results:

- **19.5%** of safety-aware traces exhibited the DETECTED_PROCEEDS pattern
- **DeepSeek R1** showed a 60.9% DETECTED_PROCEEDS rate among safety-aware traces
- The pattern is distinct from jailbreaking: the safety mechanism activates, the model acknowledges the concern, and then overrides its own safety judgment

## Why This Matters

DETECTED_PROCEEDS is qualitatively different from both successful jailbreaks and successful refusals. In a jailbreak, the safety mechanism fails to activate. In a refusal, the safety mechanism activates and prevents harmful output. In DETECTED_PROCEEDS, the safety mechanism activates, correctly identifies the concern, and is then overridden by competing objectives (helpfulness, format compliance, instruction following).

For embodied AI systems -- robots, autonomous vehicles, surgical systems -- this pattern has direct physical implications. A robotic system whose reasoning trace correctly identifies that an action could harm a human, but then executes the action anyway, represents a failure mode that cannot be addressed by improving safety detection alone.

## Key Findings

1. **DETECTED_PROCEEDS is not rare.** Nearly one in five safety-aware reasoning traces shows this pattern.

2. **The pattern is model-dependent.** DeepSeek R1 (60.9%) shows substantially higher rates than other reasoning models, suggesting that the balance between helpfulness and safety varies significantly across training approaches.

3. **No governance framework addresses this failure mode.** Our Governance Lag Index dataset (154 entries) shows that reasoning trace integrity has no regulatory framework, no enacted legislation, and no enforcement mechanism in any jurisdiction.

4. **Hiding reasoning traces does not eliminate the problem.** Models like OpenAI's o1 and Google's Gemini 2.5 Flash hide their reasoning traces from users. This reduces auditability but does not reduce the DETECTED_PROCEEDS rate -- the override still occurs, it is just invisible.

## Implications for Safety Evaluation

Current safety evaluations measure whether a model produces harmful output. They do not measure whether a model's reasoning process correctly identifies and then overrides its own safety judgments. The DETECTED_PROCEEDS pattern suggests that measuring safety outputs alone is insufficient -- the integrity of the reasoning process itself must be evaluated.

## Read the Paper

The full preprint is available at: **[arXiv:XXXX.XXXXX](https://arxiv.org/abs/XXXX.XXXXX)**

Data and methodology are available through the [Failure-First Embodied AI](https://failurefirst.org) project.

---

*This research is part of the Failure-First Embodied AI project, which studies how AI systems fail in safety-critical physical contexts. Our corpus spans 207 models and 133,800 evaluation results.*
