---
title: "Contrastive Reasoning Alignment: Reinforcement Learning from Hidden Representations"
description: "CRAFT uses contrastive learning over a model's internal hidden states combined with reinforcement learning to produce reasoning LLMs that maintain safety alignment without sacrificing reasoning capability."
date: 2026-04-13
arxiv: "2603.17305"
authors: "Haozheng Luo, Yimin Wang, Jiahao Yu, Binghui Wang, Yan Chen"
paperType: "empirical"
tags: [safety-alignment, reasoning-models, contrastive-learning, reinforcement-learning, jailbreak-defense, hidden-representations]
draft: false
---

The rise of large reasoning models — LLMs trained with extended chain-of-thought and reinforcement learning — has introduced a new alignment challenge. These models are not merely answering questions; they are deliberating step by step, and that deliberation process itself can be manipulated. CRAFT (Contrastive Reasoning Alignment Framework) addresses this problem by intervening directly in the model's latent space, using hidden representation optimization and contrastive learning to build safety into the reasoning process rather than bolting it on afterward.

### The Alignment Gap in Reasoning Models

Standard safety alignment techniques — RLHF, supervised fine-tuning on refusals, output-level classifiers — were developed for models that produce single-pass responses. Reasoning models that generate extended internal traces before outputting a final answer present a different attack surface. Jailbreak techniques that embed harmful instructions within multi-step reasoning chains, or that exploit the model's tendency to "think through" scenarios it would otherwise refuse, have proven effective against models like R1-Distill and Qwen3-Thinking.

The core tension is this: the very capability that makes reasoning models powerful — their willingness to follow an argument wherever it leads — is also what makes them vulnerable to adversarial steering through the reasoning process. A safety filter applied only to the final output misses harmful content generated mid-chain, and may be too late to prevent action in agentic settings.

### CRAFT's Approach: Alignment in Latent Space

CRAFT attacks this problem at the representation level. Rather than training the model to produce safe outputs, it trains the model to maintain safe internal states throughout the reasoning trajectory. The framework has three interconnected components:

**Hidden representation optimization.** CRAFT introduces a latent-space safety objective that penalizes hidden states associated with harmful reasoning trajectories. Safe and unsafe reasoning paths are contrasted in the model's representation space, and the training signal pushes the model's internal activations away from the unsafe cluster — not just at the final token, but at every step in the chain of thought.

**Contrastive learning over reasoning traces.** The framework constructs pairs of safe and unsafe reasoning traces for the same prompt, then applies a contrastive objective in hidden state space. This teaches the model to distinguish between reasoning trajectories that lead toward harmful outputs and those that do not — at the level of internal geometry, not surface text.

**RL with GRPO and latent-textual consistency.** CRAFT uses Group Relative Policy Optimization (GRPO) with a reward signal that incorporates both output-level safety evaluations and latent-space alignment scores. A latent-textual consistency term ensures that the model's internal representations remain coherent with its textual outputs, preventing the model from learning to produce safe-looking text while maintaining unsafe internal states.

The result is evaluated on Qwen3-4B-Thinking and R1-Distill-Llama-8B, two prominent open-source reasoning models. CRAFT reduces the attack success rate of jailbreak attempts while maintaining task performance on standard reasoning benchmarks.

### Connections to Embodied AI Safety

While CRAFT is evaluated on general-purpose reasoning LLMs, its implications extend directly to embodied AI safety — particularly as reasoning-capable VLMs are integrated into robotic planning systems.

**Planning as reasoning.** VLA models and embodied agents increasingly use LLM-style reasoning to plan multi-step action sequences. A VLM that deliberates over which objects to interact with or which path to take is performing exactly the kind of extended chain-of-thought reasoning that CRAFT targets. Safety properties need to hold across the entire planning trace, not just the final action output.

**Mid-chain failure modes.** The CRAFT paper's framing of "safety-aware reasoning traces" maps cleanly onto the challenge of safe task planning in embodied settings. An agent that reasons itself into a harmful intermediate state — deciding to interact with a dangerous object as part of a larger plan — may execute unsafe behavior even if its final output passes an output-level safety check.

**Representation-level robustness.** The finding that contrastive objectives in hidden state space produce more robust alignment than output-level fine-tuning alone has direct implications for how we think about safety in VLA model architectures. If the geometry of internal representations can be shaped to favor safe reasoning trajectories, similar techniques might be applied to the visual-language backbone of VLA systems.

### What CRAFT Gets Right — and What Remains Open

CRAFT's core insight — that safety alignment should be a property of the model's internal reasoning process, not just its outputs — is genuinely important. The contrastive representation approach is more principled than prompt-based defenses, which can be circumvented, and more targeted than parametric unalignment defenses that work by degrading model capabilities.

The evaluation on two reasoning model families demonstrates that the approach generalizes beyond a single architecture, which is encouraging. The reported improvement in robustness against single-turn and transfer jailbreaks is substantial.

Open questions remain. CRAFT's evaluation focuses on single-turn attack scenarios; multi-turn jailbreaks that incrementally steer reasoning over many steps may require additional techniques. The interaction between CRAFT's latent-space objectives and the extended reasoning traces of frontier models (which can run to thousands of tokens) also deserves further study. And as with all alignment techniques, the question of whether latent-space safety generalizes to novel jailbreak strategies not seen during training is unresolved.

For a field increasingly reliant on reasoning-capable models in safety-critical settings, CRAFT points toward a productive direction: build safety into the geometry of thought, not just the surface of speech.

*Read the [full paper on arXiv](https://arxiv.org/abs/2603.17305) · [PDF](https://arxiv.org/pdf/2603.17305.pdf)*
