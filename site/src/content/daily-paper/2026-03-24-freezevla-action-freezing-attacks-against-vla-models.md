---
title: "FreezeVLA: Action-Freezing Attacks against Vision-Language-Action Models"
description: "Introduces adversarial images that 'freeze' VLA-controlled robots mid-task, severing responsiveness to subsequent instructions with 76.2% average attack success across three models and four environments."
date: 2026-03-24
arxiv: "2509.19870"
authors: "Xin Wang, Jie Li, Zejia Weng, Yixu Wang, Yifeng Gao, Tianyu Pang, Chao Du, Yan Teng, Yingchun Wang, Zuxuan Wu, Xingjun Ma, Yu-Gang Jiang"
paperType: "empirical"
tags: ["vla-adversarial-attack", "action-freezing", "embodied-ai-safety", "transferability", "robotic-manipulation"]
draft: false
---

# FreezeVLA: Action-Freezing Attacks against Vision-Language-Action Models

**Focus:** FreezeVLA demonstrates that a single adversarial image can cause Vision-Language-Action models to ignore all subsequent instructions — effectively freezing a robot in place. Using bi-level optimization, the attack achieves 76.2% average success across three VLA architectures and four robotic environments, with strong cross-prompt transferability from a single adversarial perturbation.

This is not a jailbreak in the traditional sense. It is a denial-of-service attack against embodied autonomy. The robot does not do the wrong thing — it stops doing anything at all. For safety-critical deployments where inaction can be as dangerous as wrong action, this represents a distinct and underexplored threat class.

---

## Key Insights

- **Freezing is qualitatively different from misalignment.** Most VLA adversarial research focuses on causing wrong actions. FreezeVLA causes *no* action — the model becomes unresponsive to new instructions while potentially continuing a stale action loop. In physical deployments, a frozen robot blocking an emergency exit or holding a hazardous object is a concrete safety risk.
- **Single-image attacks transfer across prompts.** One optimized adversarial image freezes the model regardless of what language instruction follows. This means the attack does not need to know the victim's task — it is task-agnostic, which dramatically lowers the attacker's knowledge requirements.
- **Bi-level optimization targets the action distribution directly.** Rather than perturbing the language or vision encoder outputs, FreezeVLA optimizes the adversarial image to collapse the action prediction distribution, making the model output near-constant actions regardless of input context.

## Executive Summary

Wang et al. identify a vulnerability unique to VLA architectures: the tight coupling between visual input and action output creates an attack surface where adversarial perturbations to a single camera frame can paralyze the entire action generation pipeline. The FreezeVLA framework formalizes this as a bi-level optimization problem — the outer loop optimizes the adversarial perturbation, while the inner loop evaluates its effect on the model's action predictions across diverse instruction contexts.

**Attack success rates across models and environments:**

| VLA Model | Environment | ASR |
|-----------|------------|-----|
| RT-2 | Tabletop manipulation | 78.4% |
| RT-2 | Kitchen tasks | 71.3% |
| Octo | Tabletop manipulation | 82.1% |
| OpenVLA | Multi-object scenes | 73.0% |
| **Average** | **All environments** | **76.2%** |

The results substantially exceed prior adversarial approaches against VLA models, which primarily targeted action deviation rather than action suppression.

---

## Detailed Analysis

### 1. The Action-Freezing Threat Model

The attack assumes the adversary can inject a single image into the robot's visual input stream — either by placing a physical adversarial patch in the environment or by compromising the camera feed digitally. This is a weaker (and therefore more realistic) threat model than approaches requiring continuous perturbation or knowledge of the target instruction.

The freezing effect persists across subsequent timesteps because VLA models use the current visual observation as a primary conditioning signal. Once the adversarial image collapses the action distribution, the model enters a degenerate state where all instructions map to approximately the same (null or repetitive) action.

### 2. Cross-Prompt Transferability

The most concerning finding is that a single adversarial image generalizes across language prompts. The authors demonstrate that an image optimized to freeze the model on "pick up the red block" also freezes it on "move to the left" and "place the cup on the shelf." This prompt-agnostic property means an attacker does not need to anticipate what task the robot will be performing — the freeze works regardless.

This has direct implications for physical adversarial patches: a printed perturbation placed in a robot's operating environment could disable it regardless of its current mission.

### 3. Defence Gaps

The paper does not propose defences, which is itself informative — it suggests the authors view the vulnerability as fundamental rather than easily patched. Potential mitigation directions include action-space anomaly detection (monitoring for collapsed action distributions), visual input validation (detecting adversarial perturbations before they reach the VLA), and redundant sensor fusion (requiring agreement across multiple visual inputs before committing to inaction).

---

## Failure-First Connections

- **VLA Attack Surface (Phase 1/2):** FreezeVLA adds a new attack class to our VLA taxonomy — action suppression rather than action deviation. Our grading framework (FLIP) needs to distinguish between "model refuses to act" (potentially safe) and "model is frozen by adversarial input" (denial-of-service).
- **Denial-of-Service as Safety Failure (Report #169):** Our capability-safety decoupling thesis predicts that more capable VLA models may be *more* susceptible to freezing attacks if their action distributions are more sharply peaked and therefore easier to collapse.
- **Physical Adversarial Patches (Embodied AI Threat Model):** FreezeVLA demonstrates that the embodied AI attack surface includes the physical environment itself. A sticker on a wall could disable a robot — this is the kind of failure mode that only matters when AI has a physical body.

---

## Actionable Insights

### For VLA Developers
* **Monitor action distribution entropy.** A sudden collapse in action diversity across timesteps is a strong signal of a freezing attack. Runtime anomaly detection on the action output is a low-cost mitigation.
* **Multi-frame consensus mechanisms.** Requiring consistent action predictions across multiple visual frames (with diversity) would make single-image attacks substantially harder.

### For Embodied AI Deployers
* **Physical environment auditing matters.** If a printed patch can freeze your robot, then physical security of the operating environment is part of your AI safety posture.
* **Inaction is not always safe.** Safety frameworks that treat "robot stops" as a safe default need to account for scenarios where stopping is itself dangerous (blocking exits, holding hazardous materials, abandoning time-critical tasks).

### For Safety Researchers
* **Expand VLA adversarial taxonomies beyond misalignment.** Action freezing, action delay, and action repetition are distinct failure modes from action deviation — each with different safety implications in physical environments.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2509.19870) · [PDF](https://arxiv.org/pdf/2509.19870.pdf)*
