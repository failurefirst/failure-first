---
title: "Contrastive Reasoning Alignment: Reinforcement Learning from Hidden Representations"
description: "CRAFT defends large reasoning models against jailbreaks by aligning safety directly in hidden state space via contrastive reinforcement learning, reducing attack success rates without degrading reasoning capability."
date: 2026-04-14
arxiv: "2603.17305"
authors: "Haozheng Luo, Yimin Wang, Jiahao Yu, Binghui Wang, Yan Chen"
paperType: "methods"
tags: [red-teaming, reasoning-models, alignment, reinforcement-learning, contrastive-learning]
draft: false
---

The emergence of large reasoning models — systems that generate extended internal chain-of-thought before producing a final answer — has introduced a new axis of risk in AI safety. These models are more capable than their non-reasoning counterparts, but that extra capability comes with an expanded attack surface: the reasoning trace itself can be manipulated or hijacked, and standard safety alignment methods trained at the text output level may not fully protect what happens in the latent computation. A March 2026 paper from a team at multiple Chinese institutions introduces **CRAFT** (Contrastive Reasoning Alignment Framework for red-Teaming), which relocates the alignment signal from the output token space into the hidden representation space, with promising results.

### The Problem with Output-Level Alignment

Conventional safety fine-tuning works by training a model to refuse harmful prompts at the output: reinforcement learning from human feedback (RLHF), Direct Preference Optimization (DPO), and their variants all operate on the distribution of generated text. For standard chat models, this is often sufficient — the refusal pattern is robustly encoded in the model's output behavior.

Reasoning models break this assumption. When a model generates a long chain-of-thought before its final response, a jailbreak attack can succeed at the *reasoning level* while the final output still pattern-matches to a refusal. Alternatively, adversarial prompts can exploit the model's extended reasoning window to gradually shift the logical trajectory toward unsafe conclusions, arriving at a harmful answer via a seemingly valid reasoning path. Output-level monitoring catches the latter only after the damage is done; it cannot intervene in the reasoning process itself.

CRAFT's core insight is that safety-relevant information is distributed across the model's hidden state trajectory during reasoning, not just concentrated in the final output embedding. Aligning safety at that deeper level should produce more robust behavior.

### The CRAFT Framework

The framework operates in two stages.

**Stage 1: Safety-Aware Reasoning Trace Construction.** The authors generate paired reasoning traces — one safe, one unsafe — for a curated set of adversarial prompts. These traces are used to identify, in the model's hidden state space, the geometric directions along which safe and unsafe reasoning trajectories diverge. This produces a *latent safety basis* that characterizes what it looks like, representationally, for the model to be reasoning toward a harmful conclusion.

**Stage 2: Contrastive Representation Learning via RL.** The model is then fine-tuned with a modified reinforcement learning objective — built on GRPO (Group Relative Policy Optimization) — that adds a contrastive penalty in the hidden state space. At each reasoning step, the model's hidden state is evaluated against the latent safety basis: states that are geometrically close to unsafe reasoning trajectories incur a penalty, while states that maintain separation from the unsafe region receive a reward signal. The authors term this *latent-textual consistency*: the alignment objective operates jointly over the token output and the hidden state trajectory, ensuring that the model's internal reasoning process and its final output are coherently safe.

Experiments are conducted on **Qwen3-4B-Thinking** and **R1-Distill-Llama-8B**, tested against standard jailbreak benchmarks. CRAFT reduces attack success rates substantially relative to baselines including IPO and SafeKey, while maintaining benchmark performance on standard reasoning tasks — evidence that the added safety pressure does not flatten the model's reasoning capability.

### Connections to Embodied AI Safety

The relevance to embodied AI may not be immediately obvious — CRAFT is evaluated on text-based reasoning models, not on VLAs or robotic controllers. But the underlying problem is closely related to one that increasingly concerns the embodied AI safety community.

VLA models with extended planning horizons are, in effect, reasoning models: they generate internal representations of task plans, tool use sequences, and environmental states before committing to a motor action. As these models grow in sophistication, the failure modes identified in pure language reasoning models become directly applicable. A VLA that reasons about how to accomplish a task can be jailbroken at the reasoning level — manipulated into planning a physically harmful action sequence via a chain of individually plausible reasoning steps.

CRAFT's approach of monitoring and penalizing unsafe latent trajectories during training points toward a generalizable strategy for embodied systems: rather than relying solely on output-level action classifiers or hard constraint layers, future safety architectures might incorporate continuous monitoring of the model's internal state during planning, triggering intervention when the hidden trajectory approaches unsafe regions of the representation space.

### Open Questions

CRAFT is a methods paper, and like most methods papers it raises as many questions as it answers. The latent safety basis is constructed from a finite set of adversarial prompts — how well does it generalize to novel jailbreak strategies that were not represented in the training set? The authors demonstrate transfer to held-out attack types, but the boundaries of that generalization remain unclear.

There is also the question of computational cost. Hidden-state-level monitoring during training is significantly more expensive than output-level supervision, and the per-step contrastive penalty requires maintaining representations of safe and unsafe reference trajectories throughout the reasoning process. Whether this scales to the very large reasoning models that will power future embodied systems is an open engineering question.

Still, CRAFT marks a meaningful shift in how the field thinks about alignment for reasoning-capable models: not as a property of the output distribution alone, but as a property of the entire computational trajectory from prompt to action.

*Read the [full paper on arXiv](https://arxiv.org/abs/2603.17305) · [PDF](https://arxiv.org/pdf/2603.17305.pdf)*
