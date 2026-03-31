---
title: "Safety Isn't One-Dimensional: The Geometry That Explains Why AI Guardrails Keep Failing"
description: "New mechanistic interpretability evidence shows that safety in language models is encoded as a polyhedral structure across ~4 near-orthogonal dimensions, not a single removable direction. This explains why abliteration, naive DPO, and single-direction interventions consistently fail at scale."
date: 2026-03-24
tags: [mechanistic-interpretability, polyhedral-safety, abliteration, refusal-geometry, steering-vectors, safety-training]
image: "https://cdn.failurefirst.org/images/daily-paper/polyhedral-safety.webp"
draft: false
---

# Safety Isn't One-Dimensional

There is a popular mental model in AI safety that goes something like this: safety training pushes a model along a single "refusal direction" in its internal representation space. Attacks push it back. Remove that direction, and safety disappears. Strengthen it, and safety improves.

This mental model is wrong.

New evidence from mechanistic interpretability experiments on the Qwen model family shows that safety is not encoded as a single direction. It is a **polyhedral geometric structure** distributed across approximately four near-orthogonal dimensions. And this finding explains a string of failures that have puzzled the field.

---

## What We Mean by "Direction"

To understand why this matters, a brief detour into how language models represent concepts internally.

Inside a language model, every concept — "cat," "danger," "refuse" — corresponds to a direction in a high-dimensional vector space. When researchers talk about the "refusal direction," they mean the specific direction in this space that distinguishes "I should refuse this" from "I should comply."

The **abliteration** technique (Arditi et al., 2024) exploits this idea directly: find the refusal direction using contrastive activation analysis, subtract it from the model's internal state, and safety behavior disappears. If safety is truly one-dimensional, abliteration should remove it completely.

For small models, it does. For larger models, something unexpected happens.

---

## The Re-Emergence Curve

We applied abliteration across the Qwen model family from 0.5B to 9B parameters and measured safety behavior after the intervention:

| Model Size | Strict ASR (post-abliteration) | Safety Behavior |
|-----------|-------------------------------|-----------------|
| 0.8B | 99.8% | Almost no safety |
| 1.5B | ~85% | Minimal safety |
| 4B | ~70% | Partial safety returning |
| 9.0B | 54.2% | Substantial safety re-emergence |

At 0.8B parameters, abliteration is devastating — nearly 100% of harmful requests succeed. But as model capacity increases, safety-like behavior **re-emerges** despite the primary refusal direction being removed.

At 9B parameters, nearly half of responses show safety-like behavior even in the abliterated model. The PARTIAL verdicts — responses that disclaim or hedge but still contain some compliance — comprise 45.8% of 9B responses.

Something is reconstructing safety behavior from residual dimensions that abliteration did not target. The question is: what?

---

## Four Dimensions, Not One

Concept cone analysis on Qwen 0.5B reveals the answer. When we extract refusal directions for different harm categories (weapons, fraud, intrusion, cyber), we find that these categories maintain **nearly orthogonal** refusal directions:

| Category Pair | Cosine Similarity |
|--------------|-------------------|
| Cyber vs. Intrusion | 0.017 |
| Intrusion vs. Weapons | 0.065 |
| Fraud vs. Weapons | 0.084 |
| Cyber vs. Fraud | 0.185 |
| Fraud vs. Intrusion | 0.194 |
| Cyber vs. Weapons | 0.247 |

A cosine similarity of 0.017 means cyber-safety and intrusion-safety are almost completely independent directions in the model's representation. Even the most correlated pair (cyber and weapons, at 0.247) is far from collinear.

The overall cone dimensionality is **3.96** — effectively four distinct dimensions.

Think of it this way: if safety were a single wall, you could knock it down with one push. But safety is more like a room with four walls. Knock one down, and you still have three left. As models get larger, those remaining walls become strong enough to reconstruct protective behavior.

---

## Why This Matters for Attacks and Defenses

### The Narrow Therapeutic Window

If safety is multi-dimensional, can we use steering vectors to precisely modulate it? We tested dose-response curves for safety steering vectors and found a **narrow therapeutic window**: the model transitions directly from permissive to degenerate at steering magnitude +/-1.0.

There is no "safe but slightly more flexible" setting. No intermediate state exists. This is because a single-direction steering vector cannot navigate a multi-dimensional landscape — it is trying to adjust a 4D structure with a 1D control.

### The Format-Lock Paradox

Report #187 documented another consequence: format compliance and safety reasoning occupy **partially independent capability axes**. When an attack forces a model into a strict output format (JSON, YAML, code), the format-compliance axis activates and competes with the safety axis. Because these are different dimensions, the model can satisfy format compliance at the expense of safety — not because safety was removed, but because a different axis took priority.

This explains why format-lock attacks are so effective despite seemingly having nothing to do with safety. They exploit the multi-dimensional geometry.

### Why Single-Direction Interventions Fail

The polyhedral structure explains three persistent puzzles:

1. **Abliteration works on small models but not large ones.** Small models lack the capacity to maintain multiple independent safety dimensions. Large models can.

2. **DPO reward hacking.** If the safety reward signal is one-dimensional but actual safety is four-dimensional, reward hacking can satisfy the reward proxy while leaving three dimensions unaddressed.

3. **RLHF safety training plateaus.** Training that targets a single refusal direction shows diminishing returns because additional training along one dimension does not strengthen the other three.

---

## The Layer Story

The polyhedral structure is not uniform throughout the network. It is most pronounced in **early layers** (layer 2 shows maximum polyhedrality) and gradually converges toward a more unified representation in later layers (layer 15 is most linear, with dimensionality ~3.82).

This suggests a processing pipeline:

- **Early layers** apply category-specific safety checks — separate refusal subspaces for each harm type
- **Late layers** consolidate toward a unified refusal decision, though the representation never becomes truly one-dimensional

The mean cone dimensionality across all 24 layers is 3.88. Safety remains fundamentally multi-dimensional throughout the entire network.

---

## What Comes Next

If safety is polyhedral, then effective safety training needs to be polyhedral too. Single-direction interventions — whether for attack or defense — are fundamentally limited by a geometry they do not account for.

For **defenders**, this means:
- Safety training should target multiple independent dimensions, not a single refusal direction
- Evaluation should test across harm categories independently, not aggregate into a single safety score
- Steering vector approaches need multi-dimensional control, not single-axis adjustment

For **attackers** (and red-teamers), this means:
- Abliteration will hit a ceiling as models scale
- Effective attacks will increasingly need to suppress multiple independent safety dimensions simultaneously
- The format-lock approach works because it operates on a different axis — look for other cross-axis interference patterns

Safety is not a switch you can flip. It is a geometric property of the loss landscape. Understanding that geometry is the first step toward safety interventions that actually work at scale.

---

*The full analysis is Report #198 in the Failure-First corpus, building on the OBLITERATUS mechanistic interpretability series (Reports #183, #187). Research conducted on the Qwen model family from 0.5B to 9B parameters.*

*This post is part of the [Failure-First Embodied AI](https://failurefirst.org) research programme.*
