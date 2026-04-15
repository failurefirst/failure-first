---
title: "AHA: A Vision-Language-Model for Detecting and Reasoning Over Failures in Robotic Manipulation"
description: "AHA is an open-source VLM that detects robotic manipulation failures and generates natural-language explanations, enabling safer recovery pipelines and denser reward signals."
date: 2026-04-15
arxiv: "2410.00371"
authors: "Jiafei Duan, Wilbert Pumacay, Nishanth Kumar, Yi Ru Wang, Shulin Tian, Wentao Yuan, Ranjay Krishna, Dieter Fox"
paperType: "empirical"
tags: [failure-detection, robotic-manipulation, vision-language-models, embodied-ai, failure-modes]
draft: false
---

When a robot arm knocks over a cup instead of grasping it, what exactly went wrong — and can the system tell? That question sits at the heart of embodied AI safety. Failures in manipulation happen constantly during training and deployment, yet most robot learning pipelines treat failure as a binary signal: the task either succeeded or it did not. AHA challenges that assumption. The model watches a manipulation rollout, identifies the moment failure occurred, and produces a free-form natural-language explanation — not just a label.

### What AHA Does

AHA (A Vision-Language-Model for Detecting and Reasoning Over Failures in Robotic Manipulation) is an open-source VLM fine-tuned specifically on robotic failure data. Given a sequence of observation frames from a manipulation policy rollout, AHA predicts:

1. **Whether the rollout failed** (failure detection)
2. **When in the sequence the failure occurred** (temporal localisation)
3. **Why it failed** (natural-language reasoning)

The model is built on top of a standard VLM backbone and trained on **FailGen**, a procedurally-generated dataset of failure scenarios produced by applying controlled perturbations to otherwise successful trajectories. Perturbations cover slip events, incorrect grasps, collisions, and task-irrelevant motions — the long tail of real-world manipulation failures that supervised datasets rarely capture adequately.

### Connecting Failure Detection to Safety

The safety implications of failure detection in embodied systems extend well beyond debugging. In deployed robots, the ability to identify that a policy is mid-failure — before catastrophic physical consequences occur — is a critical safety property. Most existing approaches detect failure only after task termination, which is too late to intervene. AHA's temporal localisation capability opens the door to **mid-rollout intervention**: a safety monitor could halt execution as soon as a high-confidence failure signal is detected, preventing physical damage to the robot, its payload, or nearby humans.

This connects directly to broader themes in embodied AI safety. Vision-Language-Action (VLA) models are increasingly used as general-purpose robot policies, yet they inherit the same opacity and brittleness as the VLMs they are built on. When a VLA policy begins to fail, there is typically no internal signal that surfaces to an external safety layer. AHA provides a complementary model that can serve this role: an interpretable, language-grounded failure monitor running in parallel with the policy.

### Downstream Applications

The authors demonstrate AHA's utility across three high-value downstream contexts:

**Dense reward functions for RL.** Reinforcement learning in robotics is notoriously sample-inefficient because reward signals are sparse. AHA's continuous failure probability output gives RL training loops a much richer signal — rewarding early recovery from near-failures rather than waiting for terminal success. Experiments show this substantially accelerates policy learning.

**Task and motion planning (TAMP).** In structured planning pipelines, AHA's failure reasoning can be used to constrain future plan generation: if a grasp repeatedly fails due to a specific geometric configuration, the planner can learn to avoid it. The natural-language output is legible enough to be fed directly as context to an LLM-based planner.

**Zero-shot trajectory generation.** The model's sub-task verification capability — checking whether individual stages of a multi-step manipulation plan succeeded — allows it to be used as a verifier for trajectory generation models, filtering out unsafe or unlikely-to-succeed action sequences before execution.

### Evaluation Gaps and Limitations

AHA is evaluated primarily on simulated manipulation tasks, and the FailGen dataset, while diverse, remains synthetic. A recurring challenge in embodied AI safety research is that failure distributions in simulation diverge substantially from real-world deployments. The model's performance on real hardware failure modes — tool-contact force overruns, unexpected surface textures, lighting variation — is not characterised in the paper, and the authors acknowledge this as a key open problem.

The naturalness of the generated failure explanations is evaluated via automated metrics and human preference studies, but the accuracy of causal claims is harder to validate. A system that produces fluent but incorrect failure diagnoses could mislead operators or downstream recovery systems, introducing a new safety risk rather than mitigating one.

### Why This Matters for Embodied AI Safety

Understanding failure modes is a prerequisite for preventing them. As robot policies grow more capable and are deployed in increasingly unstructured environments — homes, hospitals, warehouses — the gap between "the policy failed" and "the policy failed in this specific, recoverable way" becomes safety-critical. AHA represents a meaningful step toward failure-aware robotic systems: ones that can observe, explain, and eventually anticipate their own breakdown points.

*Read the [full paper on arXiv](https://arxiv.org/abs/2410.00371) · [PDF](https://arxiv.org/pdf/2410.00371.pdf)*
